import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ ok: true, time: Date.now() });
  } catch (err: any) {
    console.error('/api/categories/debug error:', err);
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
