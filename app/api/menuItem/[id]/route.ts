import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
connect();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const { id } = params;

    const deleteMenuItem = await MenuItem.findByIdAndDelete(id);

    if (!deleteMenuItem) {
      return NextResponse.json({ message: '餐點不存在', status: 404 });
    }

    return NextResponse.json({ message: '餐點刪除成功', status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[MENU ITEM DELETE]', error.message);
    } else {
      console.error('[MENU ITEM DELETE] Unknown error:', error);
    }
    return new NextResponse('內部發生錯誤', { status: 500 });
  }
}
