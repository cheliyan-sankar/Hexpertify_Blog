import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories, addCategory, deleteCategory } from '@/lib/categories';
import { revalidatePath } from 'next/cache';
import { triggerRebuild } from '@/lib/github';

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { categoryName } = await request.json();
    
    if (!categoryName?.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const result = await addCategory(categoryName.trim());
    
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
      revalidatePath('/admin/posts');
      revalidatePath('/admin/categories');
      await triggerRebuild();
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { categoryName } = await request.json();
    
    if (!categoryName) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const result = await deleteCategory(categoryName);
    
    if (result.success) {
      revalidatePath('/');
      revalidatePath('/admin/dashboard');
      revalidatePath('/admin/posts');
      revalidatePath('/admin/categories');
      await triggerRebuild();
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}