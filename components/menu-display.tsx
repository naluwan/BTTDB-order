'use client';

import { Button } from '@/components/ui/button';
import { Category, MenuItem } from '@/types';

interface MenuDisplayProps {
  categories: Category[];
  onAddToOrder: (menuItem: MenuItem) => void;
}

export const MenuDisplay = ({ categories, onAddToOrder }: MenuDisplayProps) => {
  return (
    <div className='space-y-6'>
      {categories?.map((category) => (
        <div key={category._id}>
          <h2 className='mb-2 text-xl font-bold'>{category.name}</h2>
          <div className='grid grid-cols-3 gap-4'>
            {category.menuItems?.map((item) => (
              <Button
                key={item._id}
                onClick={() => onAddToOrder(item)}
                variant='outline'
                className='h-auto w-auto whitespace-normal p-2'
              >
                {item.name} - ${item.price}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuDisplay;
