// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const UserRole = {
  "GENERAL_MANAGER": "GENERAL_MANAGER",
  "CASHIER": "CASHIER",
  "WAREHOUSE_MANAGER": "WAREHOUSE_MANAGER",
  "PURCHASER": "PURCHASER"
};

const BillStatus = {
  "PENDING": "PENDING",
  "CONFIRMED": "CONFIRMED",
  "PAID": "PAID",
  "RECEIVED": "RECEIVED"
};

const { Store, Category, Notifications, User, Product, BillItem, Bill, PurchaseOrder, PurchaseItem, WarehouseScan } = initSchema(schema);

export {
  Store,
  Category,
  Notifications,
  User,
  Product,
  BillItem,
  Bill,
  PurchaseOrder,
  PurchaseItem,
  WarehouseScan,
  UserRole,
  BillStatus
};