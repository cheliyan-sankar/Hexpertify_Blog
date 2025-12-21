import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { commitBinaryFile, getGithubRawUrl } from '@/lib/github';

function getSafeExt(originalName: string) {
  const fileExt = originalName.includes('.') ? originalName.split('.').pop() : undefined;
  return fileExt ? `.${fileExt}` : '';
}

function makeFileName(originalName: string) {
  const safeExt = getSafeExt(originalName);
  return `${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`;
}

async function writeToPublicUploads(fileName: string, bytes: Uint8Array) {
  const publicDir = path.join(process.cwd(), 'public', 'assets', 'uploads');
  await fs.promises.mkdir(publicDir, { recursive: true });
  const absolutePath = path.join(publicDir, fileName);
  await fs.promises.writeFile(absolutePath, Buffer.from(bytes));
  return `/assets/uploads/${fileName}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as any;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Basic validation
    const maxBytes = 10 * 1024 * 1024; // 10 MB
    if (file.size && file.size > maxBytes) {
      return NextResponse.json({ error: 'File too large. Max 10MB allowed.' }, { status: 400 });
    }

    if (file.type && !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const originalName: string = file.name || `upload-${Date.now()}`;
    const fileName = makeFileName(originalName);

    // Prefer Supabase Storage if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';

    if (supabaseUrl && serviceRoleKey) {
		const supabase = createClient(supabaseUrl, serviceRoleKey);
		const objectPath = `uploads/${fileName}`;
		const upload = await supabase.storage
			.from(bucket)
			.upload(objectPath, Buffer.from(bytes), {
				contentType: file.type || 'application/octet-stream',
				upsert: false,
			});

		if (upload.error) {
			console.error('Supabase upload error:', upload.error);
			return NextResponse.json({ error: upload.error.message || 'Supabase upload failed' }, { status: 500 });
		}

		const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
		if (!data?.publicUrl) {
			return NextResponse.json({ error: 'Upload succeeded but could not get public URL' }, { status: 500 });
		}

		return NextResponse.json({ url: data.publicUrl });
    }

    // Fallback: GitHub repo storage if configured
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
		const baseDir = process.env.GITHUB_ASSETS_PATH_PREFIX || 'assets/uploads';
		const filePath = `${baseDir}/${fileName}`;
		await commitBinaryFile(filePath, bytes, `Upload image: ${originalName}`);
		const url = getGithubRawUrl(filePath);
		return NextResponse.json({ url });
    }

    // Final fallback: write into public/ so local dev can serve it
    const url = await writeToPublicUploads(fileName, bytes);
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error('Upload API error:', err);
    const message = err?.message || String(err) || 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
