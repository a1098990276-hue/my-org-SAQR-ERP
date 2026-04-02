import { Injectable } from '@nestjs/common';

interface SupplierProfile {
  id: number;
  name: string;
  phone: string;
  city: string;
  balance: number;
}

@Injectable()
export class SupplierService {
  async getSupplierById(id: number): Promise<SupplierProfile | null> {
    return null;
  }

  async getAllSuppliers(): Promise<SupplierProfile[]> {
    return [];
  }

  async createSupplier(supplierData: Partial<SupplierProfile>): Promise<SupplierProfile | null> {
    return null;
  }

  async updateSupplier(id: number, supplierData: Partial<SupplierProfile>): Promise<SupplierProfile | null> {
    return null;
  }

  async deleteSupplier(id: number): Promise<boolean> {
    return false;
  }
}
