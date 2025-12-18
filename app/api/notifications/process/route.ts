import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const resendApiKey = process.env.RESEND_API_KEY || '';

  if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
    return NextResponse.json({ error: 'Missing Supabase or Resend configuration' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const resend = new Resend(resendApiKey);

  try {
    const { data: notifications, error: nError } = await supabase
      .from('notifications')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10);

    if (nError) throw nError;
    if (!notifications || notifications.length === 0) {
      return NextResponse.json({ ok: true, processed: 0 });
    }

    let processed = 0;

    for (const notif of notifications) {
      try {
        // mark processing
        await supabase.from('notifications').update({ status: 'processing' }).eq('id', notif.id);

        const { data: subs, error: sError } = await supabase
          .from('subscribers')
          .select('*')
          .eq('status', 'subscribed')
          .eq('confirmed', true)
          .limit(1000);

        if (sError) throw sError;
        if (!subs || subs.length === 0) {
          // nothing to send to — mark as sent
          await supabase.from('notifications').update({ status: 'sent' }).eq('id', notif.id);
          processed++;
          continue;
        }

        // send to each subscriber (serial to keep it simple)
        for (const sub of subs) {
          try {
            await resend.emails.send({
              from: 'Hexpertify Blog <newsletter@hexpertify.com>',
              to: sub.email,
              subject: notif.title ? `New from Hexpertify: ${notif.title}` : 'New post from Hexpertify Blog',
              html: `
                <html>
                  <body style="font-family: Arial, sans-serif; color: #222; line-height:1.5; max-width:600px; margin:0 auto; padding:16px;">
                    <h2 style="color:#222;">${notif.title || 'New post on Hexpertify Blog'}</h2>
                    <p style="color:#333;">${notif.description || ''}</p>
                    <p><a href="https://hexpertify.com/blog/${notif.post_slug}" style="color:#450BC8;">Read the full article</a></p>
                    <hr style="border:none;border-top:1px solid #eee; margin:18px 0;" />
                    <p style="color:#666; font-size:13px;">You are receiving this email because you subscribed to Hexpertify Blog updates.</p>
                  </body>
                </html>
              `,
            });

            // update subscriber counters (non-blocking)
            try {
              await supabase
                .from('subscribers')
                .update({ send_count: (sub.send_count || 0) + 1, last_sent_at: new Date().toISOString() })
                .eq('id', sub.id);
            } catch (_) {}
          } catch (sendErr) {
            console.error('Failed to send to', sub.email, sendErr);
            // continue sending to others
          }
        }

        // mark notification as sent
        await supabase.from('notifications').update({ status: 'sent' }).eq('id', notif.id);
        processed++;
      } catch (err: any) {
        console.error('Error processing notification', notif?.id, err?.message || err);
        await supabase.from('notifications').update({ status: 'failed', last_error: String(err?.message || err) }).eq('id', notif.id);
      }
    }

    return NextResponse.json({ ok: true, processed });
  } catch (err: any) {
    console.error('Notification processor failed', err);
    return NextResponse.json({ error: err?.message || 'Processor failed' }, { status: 500 });
  }
}
