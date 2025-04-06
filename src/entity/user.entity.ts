import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({ primaryKey: true })
  uid: string;
  @Column
  name: string;
  @Column
  email: string;
  @Column
  phone: string;
  @Column
  password: string;
}
