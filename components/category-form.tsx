'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  categoryMutate: () => void;
}

export const CategoryForm = ({ categoryMutate }: CategoryFormProps) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categorySubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      const res = await axios.post('/api/category', { name });
      const result = res.data;

      if (result.status === 201) {
        setName('');
        categoryMutate();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      // 取消Loading狀態
      setIsLoading(false);
    },
    [name, categoryMutate],
  );

  return (
    <form onSubmit={categorySubmit} className='space-y-4'>
      <Input
        placeholder='類別名稱'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type='submit' disabled={isLoading}>
        {isLoading ? '新增中...' : '新增類別'}
      </Button>
    </form>
  );
};

export default CategoryForm;
