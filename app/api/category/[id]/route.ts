import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import Category from '@/models/Category';
connect();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const { id } = params;

    const deleteCategory = await Category.findByIdAndDelete(id);

    if (!deleteCategory) {
      return NextResponse.json({ message: '類別不存在', status: 404 });
    }

    return NextResponse.json({ message: '類別刪除成功', status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[CATEGORY DELETE]', error.message);
    } else {
      console.error('[CATEGORY DELETE] Unknown error:', error);
    }
    return new NextResponse('內部發生錯誤', { status: 500 });
  }
}
