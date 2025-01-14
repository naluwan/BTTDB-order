import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
connect();

export async function GET(): Promise<NextResponse> {
  try {
    const menuItems = await MenuItem.find().populate('category');

    return NextResponse.json({ status: 200, data: menuItems });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[MENU ITEM GET]', error.message);
    } else {
      console.error('[MENU ITEM GET] Unknown error:', error);
    }
    return new NextResponse('內部發生錯誤', { status: 500 });
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { name, price, category } = await req.json();

    if (!name || !price || !category) {
      return NextResponse.json({ message: '餐點名稱、價格、類別不能為空', status: 400 });
    }

    const existingMenuItem = await MenuItem.findOne({ name });

    if (existingMenuItem) {
      return NextResponse.json({ message: '餐點名稱重複', status: 400 });
    }

    const newMenuItem = new MenuItem({ name, price, category });
    await newMenuItem.save();

    return NextResponse.json({ message: '餐點建立成功', status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[MENU ITEM CREATE]', error.message);
    } else {
      console.error('[MENU ITEM CREATE] Unknown error:', error);
    }
    return new NextResponse('內部發生錯誤', { status: 500 });
  }
}

export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const { id, name, price } = await req.json();

    if (!name || !price) {
      return NextResponse.json({ message: '名稱、價格不能為空', status: 400 });
    }

    const existingMenuItem = await MenuItem.findOne({
      name,
      _id: { $ne: id }, // 排除當前的 `id`
    });
    if (existingMenuItem) {
      return NextResponse.json({ message: '餐點名稱重複', status: 400 });
    }

    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return NextResponse.json({ message: '餐點不存在', status: 404 });
    }

    menuItem.name = name;
    menuItem.price = price;
    await menuItem.save();

    return NextResponse.json({ message: '餐點更新成功', status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[MENU ITEM PUT]', error.message);
    } else {
      console.error('[MENU ITEM PUT] Unknown error:', error);
    }
    return new NextResponse('內部發生錯誤', { status: 500 });
  }
}
