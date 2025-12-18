import { NextResponse } from 'next/server';

const TOKEN_ENV_NAMES = ['BLOB_READ_WRITE_TOKEN', 'VERCEL_BLOB_TOKEN', 'VERCEL_TOKEN', 'VERCEL_BLOB_UPLOAD_TOKEN'];

export async function GET() {
  try {
    for (const name of TOKEN_ENV_NAMES) {
      if (process.env[name]) {
        return NextResponse.json({ tokenEnv: name });
      }
    }

    return NextResponse.json({ tokenEnv: null });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'error' }, { status: 500 });
  }
}
