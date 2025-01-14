import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import Category from '@/models/Category';
import MenuItem from '@/models/MenuItem';
connect();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  try {
    const { id } = params;

    const category = await Category.findById(id).populate({
      path: 'menuItems', // 填充的字段名稱（需要在 Category 模型中虛擬化設置）
      model: MenuItem, // 關聯的模型
    });

    console.log(category);

    if (category?.menuItems.length > 0) {
      return NextResponse.json({
        message: '請先刪除類別下所有餐點再進行類別刪除',
        status: 400,
      });
    }

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
