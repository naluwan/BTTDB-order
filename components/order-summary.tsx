'use client';

import { Button } from '@/components/ui/button';
import { OrderItem } from '@/types';

interface OrderSummaryProps {
  orderItems: OrderItem[];
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
}

export const OrderSummary = ({ orderItems, setOrderItems }: OrderSummaryProps) => {
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const formatPrice = (price: number) => {
    // 使用前字符 `$` 並禁用小數位
    return `$${new Intl.NumberFormat('en-US', {
      style: 'decimal', // 使用十進位格式
      minimumFractionDigits: 0, // 最少小數位數為 0
      maximumFractionDigits: 0, // 最多小數位數為 0
    }).format(price)}`;
  };

  const handleOrderComplete = () => {
    localStorage.removeItem('orderItems');
    setOrderItems([]);
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-bold'>點餐摘要</h2>
      {orderItems.map((item) => (
        <div key={item.id} className='grid grid-cols-6 gap-4'>
          <span className='col-span-4'>
            {item.name} x {item.quantity}
          </span>
          <span>{formatPrice(item.price * item.quantity)}</span>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => handleRemoveItem(item.id)}
          >
            移除
          </Button>
        </div>
      ))}
      <div className='flex justify-between'>
        <div className='text-lg font-bold'>總計: {formatPrice(totalAmount)}</div>
        {orderItems.length > 0 && <Button onClick={handleOrderComplete}>點餐完成</Button>}
      </div>
    </div>
  );
};

export default OrderSummary;
