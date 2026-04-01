import { Injectable } from '@nestjs/common';

interface ItemRecord {
  id: number;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  minQuantity: number;
}

@Injectable()
export class ItemService {
  async getItemById(id: number): Promise<ItemRecord | null> {
    return null;
  }

  async getAllItems(): Promise<ItemRecord[]> {
    return [];
  }

  async getLowStockItems(): Promise<ItemRecord[]> {
    return [];
  }

  async createItem(itemData: Partial<ItemRecord>): Promise<ItemRecord | null> {
    return null;
  }

  async updateItem(id: number, itemData: Partial<ItemRecord>): Promise<ItemRecord | null> {
    return null;
  }

  async deleteItem(id: number): Promise<boolean> {
    return false;
  }
}
