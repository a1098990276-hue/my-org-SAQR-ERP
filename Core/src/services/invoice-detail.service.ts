import { Injectable } from '@nestjs/common';

interface InvoiceDetailRecord {
  id: number;
  invoiceId: number;
  itemId: number;
  quantity: number;
  unitPrice: number;
  total: number;
}

@Injectable()
export class InvoiceDetailService {
  async getDetailById(id: number): Promise<InvoiceDetailRecord | null> {
    return null;
  }

  async getDetailsByInvoiceId(invoiceId: number): Promise<InvoiceDetailRecord[]> {
    return [];
  }

  async createDetail(detailData: Partial<InvoiceDetailRecord>): Promise<InvoiceDetailRecord | null> {
    return null;
  }

  async updateDetail(id: number, detailData: Partial<InvoiceDetailRecord>): Promise<InvoiceDetailRecord | null> {
    return null;
  }

  async deleteDetail(id: number): Promise<boolean> {
    return false;
  }
}
