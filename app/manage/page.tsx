'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Category, MenuItem } from '@/types';
import { CategoryForm } from '@/components/category-form';
import { MenuItemForm } from '@/components/menu-item-form';
import Link from 'next/link';
import useSWR from 'swr';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManagePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingMenuItemId, setEditingMenuItemId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingPrice, setEditingPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState('categories');

  const getCategories = async () => {
    const response = await fetch('/api/category');
    const data = await response.json();
    return data;
  };

  const getMenuItems = async () => {
    const response = await fetch('/api/menuItem');
    const data = await response.json();
    return data;
  };

  const { data: categoriesData, mutate: categoryMutate } = useSWR(
    '/api/category',
    getCategories,
  );
  const { data: menuItemsData, mutate: menuItemMutate } = useSWR(
    '/api/menuItem',
    getMenuItems,
  );

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData.data);
    if (menuItemsData) setMenuItems(menuItemsData.data);
  }, [categoriesData, menuItemsData]);

  const handleDeleteCategory = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await axios.delete(`/api/category/${id}`);
    if (res.data.status === 201) {
      toast.success(res.data.message);
      categoryMutate();
    } else {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  const handleDeleteMenuItem = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await axios.delete(`/api/menuItem/${id}`);
    if (res.data.status === 201) {
      toast.success(res.data.message);
      menuItemMutate();
    } else {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category._id);
    setEditingName(category.name);
  };

  const handleEditMenuItem = (menuItem: MenuItem) => {
    setEditingMenuItemId(menuItem._id);
    setEditingName(menuItem.name);
    setEditingPrice(menuItem.price.toString());
  };

  const handleSaveCategory = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      const res = await axios.put('/api/category', {
        id: editingCategoryId,
        name: editingName,
      });
      if (res.data.status === 201) {
        toast.success(res.data.message);
        categoryMutate();
      } else {
        toast.error(res.data.message);
      }
      setEditingCategoryId(null);
      setEditingName('');
    },
    [editingCategoryId, editingName, categoryMutate],
  );

  const handleSaveMenuItem = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      const res = await axios.put('/api/menuItem', {
        id: editingMenuItemId,
        name: editingName,
        price: editingPrice,
      });
      if (res.data.status === 201) {
        toast.success(res.data.message);
        menuItemMutate();
      } else {
        toast.error(res.data.message);
      }
      setEditingMenuItemId(null);
      setEditingName('');
      setEditingPrice('');
    },
    [editingMenuItemId, editingName, editingPrice, menuItemMutate],
  );

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='container mx-auto p-4 py-6'>
      <div className='mb-6 flex justify-between'>
        <h1 className='text-3xl font-bold'>管理類別和餐點</h1>
        <Link href='/'>
          <Button>返回首頁</Button>
        </Link>
      </div>
      <Tabs defaultValue={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value='categories'>類別</TabsTrigger>
          <TabsTrigger value='menu-items'>餐點</TabsTrigger>
        </TabsList>
        <div className='my-4 flex flex-col justify-between gap-4 md:flex md:flex-row'>
          <Input
            placeholder='搜尋...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='max-w-sm'
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button>新增</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {tab === 'categories' ? '新增類別' : '新增餐點'}
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <TabsContent value='categories'>
                <CategoryForm categoryMutate={categoryMutate} />
              </TabsContent>
              <TabsContent value='menu-items'>
                <MenuItemForm categories={categories} menuItemMutate={menuItemMutate} />
              </TabsContent>
            </DialogContent>
          </Dialog>
        </div>
        <TabsContent value='categories' className='max-h-[550px] w-full overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名稱</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className='w-full md:w-auto'>
                    {editingCategoryId === category._id ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                    ) : (
                      category.name
                    )}
                  </TableCell>
                  <TableCell className='flex flex-1 flex-col gap-2 md:flex-row'>
                    {editingCategoryId === category._id ? (
                      <Button
                        variant='outline'
                        className='md:mr-2'
                        onClick={handleSaveCategory}
                        disabled={isLoading}
                      >
                        完成
                      </Button>
                    ) : (
                      <Button
                        variant='outline'
                        className='md:mr-2'
                        onClick={() => handleEditCategory(category)}
                        disabled={isLoading}
                      >
                        編輯
                      </Button>
                    )}
                    <Button
                      variant='destructive'
                      onClick={(e) => handleDeleteCategory(e, category._id)}
                      disabled={isLoading}
                    >
                      刪除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value='menu-items' className='max-h-[550px] w-full overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名稱</TableHead>
                <TableHead>價格</TableHead>
                <TableHead>類別</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMenuItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {editingMenuItemId === item._id ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                    ) : (
                      item.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingMenuItemId === item._id ? (
                      <Input
                        type='number'
                        value={editingPrice}
                        onChange={(e) => setEditingPrice(e.target.value)}
                      />
                    ) : (
                      item.price
                    )}
                  </TableCell>
                  <TableCell className='truncate text-ellipsis whitespace-nowrap'>
                    {item.category.name}
                  </TableCell>
                  <TableCell className='flex flex-1 flex-col gap-2 md:flex-row'>
                    {editingMenuItemId === item._id ? (
                      <Button
                        variant='outline'
                        className='md:mr-2'
                        onClick={handleSaveMenuItem}
                        disabled={isLoading}
                      >
                        完成
                      </Button>
                    ) : (
                      <Button
                        variant='outline'
                        className='md:mr-2'
                        onClick={() => handleEditMenuItem(item)}
                        disabled={isLoading}
                      >
                        編輯
                      </Button>
                    )}
                    <Button
                      variant='destructive'
                      onClick={(e) => handleDeleteMenuItem(e, item._id)}
                      disabled={isLoading}
                    >
                      刪除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagePage;
