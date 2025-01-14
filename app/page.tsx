'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MenuDisplay } from '@/components/menu-display';
import { OrderSummary } from '@/components/order-summary';
import useSWR from 'swr';
import { Category, MenuItem, OrderItem } from '@/types';
import Image from 'next/image';
import Logo from '@/public/logo.png';

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const storedOrderItems = localStorage.getItem('orderItems');
    if (storedOrderItems) setOrderItems(JSON.parse(storedOrderItems));
  }, []);

  const getCategories = async () => {
    const response = await fetch('/api/category');
    const data = await response.json();
    return data;
  };

  const { data: categoriesData } = useSWR('/api/category', getCategories);

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData.data);
  }, [categoriesData]);

  useEffect(() => {
    if (orderItems.length > 0) {
      localStorage.setItem('orderItems', JSON.stringify(orderItems));
    }
  }, [orderItems]);

  const handleAddOrderItem = (menuItem: MenuItem) => {
    const existingItem = orderItems.find((item) => item.menuItemId === menuItem._id);
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.menuItemId === menuItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: Date.now().toString(),
          menuItemId: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
        },
      ]);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='mb-4 flex flex-col items-center justify-between gap-2 md:flex-row'>
        <div className='flex items-center justify-center gap-2'>
          <Image src={Logo} alt='昔日大飯店' width={40} height={40} />
          <h1 className='text-2xl font-bold'>昔日大飯店點餐系統</h1>
        </div>

        <Link href='/manage' className='w-full md:w-auto'>
          <Button className='w-full md:w-auto'>管理類別和餐點</Button>
        </Link>
      </div>
      <div className='flex flex-col gap-6 md:flex-row'>
        <div className='max-h-[650px] w-full overflow-y-auto rounded-lg border p-4'>
          <MenuDisplay categories={categories} onAddToOrder={handleAddOrderItem} />
        </div>
        <div className='max-h-[650px] w-full overflow-y-auto rounded-lg border p-4'>
          <OrderSummary orderItems={orderItems} setOrderItems={setOrderItems} />
        </div>
      </div>
    </div>
  );
};

export default Home;
