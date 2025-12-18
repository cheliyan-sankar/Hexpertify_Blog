import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || '').toString().trim();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase.from('subscribers').insert([{ email }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send professional welcome/confirmation email (non-blocking)
    try {
      await resend.emails.send({
        from: 'Hexpertify Blog <newsletter@hexpertify.com>',
        to: email,
        subject: 'Subscription Confirmed — Hexpertify Blog',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Subscription Confirmed</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: left; margin-bottom: 20px;">
                <h1 style="color: #222; margin-bottom: 6px;">Subscription Confirmed</h1>
                <p style="color: #444; margin-top: 0;">Dear Subscriber,</p>
              </div>

              <div style="padding: 18px; border-radius: 6px; background-color: #f7f8fa; margin-bottom: 20px;">
                <p style="color: #333; margin: 0 0 10px 0;">Thank you for subscribing to Hexpertify Blog. Your subscription has been successfully confirmed.</p>
                <p style="color: #333; margin: 0;">You will receive timely, professional updates for every new blog post we publish so you can stay informed about industry trends, expert analyses, and practical insights.</p>
              </div>

              <div style="margin: 20px 0;">
                <a href="https://hexpertify.com/blog" style="background-color: #450BC8; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: 600;">Visit Hexpertify Blog</a>
              </div>

              <div style="border-top: 1px solid #eee; padding-top: 14px; margin-top: 20px; font-size: 13px; color: #666;">
                <p style="margin: 0 0 6px 0;">If you wish to manage your subscription or unsubscribe, please reply to this email or use the unsubscribe link in future messages.</p>
                <p style="margin: 0;">© 2025 Hexpertify. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
