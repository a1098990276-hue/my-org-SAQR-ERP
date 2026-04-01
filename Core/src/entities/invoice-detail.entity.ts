import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity('invoice_details')
export class InvoiceDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice)
  invoice: Invoice;

  @Column({ type: 'int' })
  itemId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
}
