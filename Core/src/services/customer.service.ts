import { Injectable } from '@nestjs/common';

interface CustomerProfile {
  id: number;
  name: string;
  phone: string;
  city: string;
  balance: number;
}

@Injectable()
export class CustomerService {
  async getCustomerById(id: number): Promise<CustomerProfile | null> {
    return null;
  }

  async getAllCustomers(): Promise<CustomerProfile[]> {
    return [];
  }

  async createCustomer(customerData: Partial<CustomerProfile>): Promise<CustomerProfile | null> {
    return null;
  }

  async updateCustomer(id: number, customerData: Partial<CustomerProfile>): Promise<CustomerProfile | null> {
    return null;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return false;
  }
}
