import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Item } from './item.entity';

@Entity('invoice_details')
export class InvoiceDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice)
  invoice: Invoice;

  @ManyToOne(() => Item)
  item: Item;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  total: number;
}
