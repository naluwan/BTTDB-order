'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types';
import axios from 'axios';
import toast from 'react-hot-toast';

interface MenuItemFormProps {
  categories: Category[];
  menuItemMutate: () => void;
}

export const MenuItemForm = ({ categories, menuItemMutate }: MenuItemFormProps) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const menuItemSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      const res = await axios.post('/api/menuItem', { name, price, category });
      const result = res.data;

      if (result.status === 201) {
        setName('');
        setPrice('');
        setCategory('');
        menuItemMutate();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      // 取消Loading狀態
      setIsLoading(false);
    },
    [name, price, category, menuItemMutate],
  );

  return (
    <form onSubmit={menuItemSubmit} className='space-y-4'>
      <Input
        placeholder='餐點名稱'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type='number'
        placeholder='價格'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder='選擇類別' />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((category) => (
            <SelectItem key={category._id} value={category._id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type='submit' disabled={isLoading}>
        {isLoading ? '新增中...' : '新增餐點'}
      </Button>
    </form>
  );
};

export default MenuItemForm;
