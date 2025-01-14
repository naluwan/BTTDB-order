export interface Category {
  _id: string;
  name: string;
  menuItems: MenuItem[];
}

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: Category;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}
