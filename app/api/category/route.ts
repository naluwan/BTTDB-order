import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import Category from '@/models/Category';
import MenuItem from '@/models/MenuItem';

connect();

export async function GET(): Promise<NextResponse> {
  try {
    const categories = await Category.find()
      .populate({
        path: 'menuItems', // 填充的字段名稱（需要在 Category 模型中虛擬化設置）
        model: MenuItem, // 關聯的模型
      })
      .lean(); // 使用 .lean() 以獲取純 JS 對象，提升性能

    return NextResponse.json({ status: 200, data: categories });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[CATEGORY GET]', error.message);
    } else {
      console.error('[CATEGORY GET] Unknown error:', error);
    }
    return new NextResponse('內部發生錯誤', { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: '類別名稱不能為空', status: 400 });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json({ message: '類別名稱重複', status: 400 });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    return NextResponse.json({ message: '類別建立成功', status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[CATEGORY CREATE]', error.message);
    } else {
      console.error('[CATEGORY CREATE] Unknown error:', error);
    }
    return new NextResponse('內部發生錯誤', { status: 500 });
  }
}

export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const { id, name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: '類別名稱不能為空', status: 400 });
    }

    const existingCategory = await Category.findOne({
      name,
      _id: { $ne: id },
    });
    if (existingCategory) {
      return NextResponse.json({ message: '類別名稱重複', status: 400 });
    }
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ message: '類別不存在', status: 404 });
    }

    category.name = name;
    await category.save();

    return NextResponse.json({ message: '類別更新成功', status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[CATEGORY PUT]', error.message);
    } else {
      console.error('[CATEGORY PUT] Unknown error:', error);
    }
    return new NextResponse('內部發生錯誤', { status: 500 });
  }
}
