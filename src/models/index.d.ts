import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";

export enum UserRole {
  GENERAL_MANAGER = "GENERAL_MANAGER",
  CASHIER = "CASHIER",
  WAREHOUSE_MANAGER = "WAREHOUSE_MANAGER",
  PURCHASER = "PURCHASER"
}

export enum BillStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PAID = "PAID",
  RECEIVED = "RECEIVED"
}



type EagerStore = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Store, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly currency?: string | null;
  readonly address?: string | null;
  readonly contact?: string | null;
  readonly users?: (User | null)[] | null;
  readonly products?: (Product | null)[] | null;
  readonly bills?: (Bill | null)[] | null;
  readonly purchaseOrder?: (PurchaseOrder | null)[] | null;
  readonly warehouseScan?: (WarehouseScan | null)[] | null;
  readonly billItems?: (BillItem | null)[] | null;
  readonly category?: (Category | null)[] | null;
  readonly notifications?: (Notifications | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyStore = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Store, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly currency?: string | null;
  readonly address?: string | null;
  readonly contact?: string | null;
  readonly users: AsyncCollection<User>;
  readonly products: AsyncCollection<Product>;
  readonly bills: AsyncCollection<Bill>;
  readonly purchaseOrder: AsyncCollection<PurchaseOrder>;
  readonly warehouseScan: AsyncCollection<WarehouseScan>;
  readonly billItems: AsyncCollection<BillItem>;
  readonly category: AsyncCollection<Category>;
  readonly notifications: AsyncCollection<Notifications>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Store = LazyLoading extends LazyLoadingDisabled ? EagerStore : LazyStore

export declare const Store: (new (init: ModelInit<Store>) => Store) & {
  copyOf(source: Store, mutator: (draft: MutableModel<Store>) => MutableModel<Store> | void): Store;
}

type EagerCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly product?: (Product | null)[] | null;
  readonly store?: Store | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeCategoryId?: string | null;
}

type LazyCategory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Category, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly description?: string | null;
  readonly product: AsyncCollection<Product>;
  readonly store: AsyncItem<Store | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeCategoryId?: string | null;
}

export declare type Category = LazyLoading extends LazyLoadingDisabled ? EagerCategory : LazyCategory

export declare const Category: (new (init: ModelInit<Category>) => Category) & {
  copyOf(source: Category, mutator: (draft: MutableModel<Category>) => MutableModel<Category> | void): Category;
}

type EagerNotifications = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notifications, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly warehousequanity?: number | null;
  readonly shelfquantity?: number | null;
  readonly productID?: string | null;
  readonly productname?: string | null;
  readonly isRead?: boolean | null;
  readonly isWarehouseNotification?: boolean | null;
  readonly isShelfNotification?: boolean | null;
  readonly store?: Store | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeNotificationsId?: string | null;
}

type LazyNotifications = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notifications, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly warehousequanity?: number | null;
  readonly shelfquantity?: number | null;
  readonly productID?: string | null;
  readonly productname?: string | null;
  readonly isRead?: boolean | null;
  readonly isWarehouseNotification?: boolean | null;
  readonly isShelfNotification?: boolean | null;
  readonly store: AsyncItem<Store | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeNotificationsId?: string | null;
}

export declare type Notifications = LazyLoading extends LazyLoadingDisabled ? EagerNotifications : LazyNotifications

export declare const Notifications: (new (init: ModelInit<Notifications>) => Notifications) & {
  copyOf(source: Notifications, mutator: (draft: MutableModel<Notifications>) => MutableModel<Notifications> | void): Notifications;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly username: string;
  readonly phonenumber?: string | null;
  readonly password?: string | null;
  readonly image?: string | null;
  readonly role: UserRole | keyof typeof UserRole;
  readonly idcardimage?: (string | null)[] | null;
  readonly store?: Store | null;
  readonly bills?: string | null;
  readonly purchaseOrders?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeUsersId?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly username: string;
  readonly phonenumber?: string | null;
  readonly password?: string | null;
  readonly image?: string | null;
  readonly role: UserRole | keyof typeof UserRole;
  readonly idcardimage?: (string | null)[] | null;
  readonly store: AsyncItem<Store | undefined>;
  readonly bills?: string | null;
  readonly purchaseOrders?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeUsersId?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Product, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly barcode: string;
  readonly image?: string | null;
  readonly price: number;
  readonly manufacturer?: string | null;
  readonly category?: string | null;
  readonly category1?: Category | null;
  readonly warehouseQuantity: number;
  readonly shelfQuantity: number;
  readonly warehouseInventoryLimit?: number | null;
  readonly shelfInventoryLimit?: number | null;
  readonly store?: Store | null;
  readonly billItems?: (BillItem | null)[] | null;
  readonly purchaseItems?: (PurchaseItem | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeProductsId?: string | null;
  readonly categoryProductId?: string | null;
}

type LazyProduct = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Product, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly barcode: string;
  readonly image?: string | null;
  readonly price: number;
  readonly manufacturer?: string | null;
  readonly category?: string | null;
  readonly category1: AsyncItem<Category | undefined>;
  readonly warehouseQuantity: number;
  readonly shelfQuantity: number;
  readonly warehouseInventoryLimit?: number | null;
  readonly shelfInventoryLimit?: number | null;
  readonly store: AsyncItem<Store | undefined>;
  readonly billItems: AsyncCollection<BillItem>;
  readonly purchaseItems: AsyncCollection<PurchaseItem>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeProductsId?: string | null;
  readonly categoryProductId?: string | null;
}

export declare type Product = LazyLoading extends LazyLoadingDisabled ? EagerProduct : LazyProduct

export declare const Product: (new (init: ModelInit<Product>) => Product) & {
  copyOf(source: Product, mutator: (draft: MutableModel<Product>) => MutableModel<Product> | void): Product;
}

type EagerBillItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BillItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly product: Product;
  readonly productName?: string | null;
  readonly quantity: number;
  readonly productPrice: number;
  readonly subtotal: number;
  readonly category?: string | null;
  readonly manufacturer?: string | null;
  readonly bill?: Bill | null;
  readonly store?: Store | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeBillItemsId?: string | null;
  readonly productBillItemsId?: string | null;
  readonly billItemsId?: string | null;
}

type LazyBillItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BillItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly product: AsyncItem<Product>;
  readonly productName?: string | null;
  readonly quantity: number;
  readonly productPrice: number;
  readonly subtotal: number;
  readonly category?: string | null;
  readonly manufacturer?: string | null;
  readonly bill: AsyncItem<Bill | undefined>;
  readonly store: AsyncItem<Store | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeBillItemsId?: string | null;
  readonly productBillItemsId?: string | null;
  readonly billItemsId?: string | null;
}

export declare type BillItem = LazyLoading extends LazyLoadingDisabled ? EagerBillItem : LazyBillItem

export declare const BillItem: (new (init: ModelInit<BillItem>) => BillItem) & {
  copyOf(source: BillItem, mutator: (draft: MutableModel<BillItem>) => MutableModel<BillItem> | void): BillItem;
}

type EagerBill = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Bill, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cashier: string;
  readonly cashierName?: string | null;
  readonly items: BillItem[];
  readonly totalAmount: number;
  readonly status: BillStatus | keyof typeof BillStatus;
  readonly store?: Store | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeBillsId?: string | null;
}

type LazyBill = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Bill, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cashier: string;
  readonly cashierName?: string | null;
  readonly items: AsyncCollection<BillItem>;
  readonly totalAmount: number;
  readonly status: BillStatus | keyof typeof BillStatus;
  readonly store: AsyncItem<Store | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeBillsId?: string | null;
}

export declare type Bill = LazyLoading extends LazyLoadingDisabled ? EagerBill : LazyBill

export declare const Bill: (new (init: ModelInit<Bill>) => Bill) & {
  copyOf(source: Bill, mutator: (draft: MutableModel<Bill>) => MutableModel<Bill> | void): Bill;
}

type EagerPurchaseOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PurchaseOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly purchaser: string;
  readonly purchaserName?: string | null;
  readonly vendor?: string | null;
  readonly store?: Store | null;
  readonly items: PurchaseItem[];
  readonly totalAmount: number;
  readonly status?: BillStatus | keyof typeof BillStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storePurchaseOrderId?: string | null;
}

type LazyPurchaseOrder = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PurchaseOrder, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly purchaser: string;
  readonly purchaserName?: string | null;
  readonly vendor?: string | null;
  readonly store: AsyncItem<Store | undefined>;
  readonly items: AsyncCollection<PurchaseItem>;
  readonly totalAmount: number;
  readonly status?: BillStatus | keyof typeof BillStatus | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storePurchaseOrderId?: string | null;
}

export declare type PurchaseOrder = LazyLoading extends LazyLoadingDisabled ? EagerPurchaseOrder : LazyPurchaseOrder

export declare const PurchaseOrder: (new (init: ModelInit<PurchaseOrder>) => PurchaseOrder) & {
  copyOf(source: PurchaseOrder, mutator: (draft: MutableModel<PurchaseOrder>) => MutableModel<PurchaseOrder> | void): PurchaseOrder;
}

type EagerPurchaseItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PurchaseItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly product: Product;
  readonly productName?: string | null;
  readonly productPrice?: number | null;
  readonly productTag?: number | null;
  readonly quantityOrdered: number;
  readonly quantityReceived: number;
  readonly purchaseOrder?: PurchaseOrder | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly productPurchaseItemsId?: string | null;
  readonly purchaseOrderItemsId?: string | null;
}

type LazyPurchaseItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PurchaseItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly product: AsyncItem<Product>;
  readonly productName?: string | null;
  readonly productPrice?: number | null;
  readonly productTag?: number | null;
  readonly quantityOrdered: number;
  readonly quantityReceived: number;
  readonly purchaseOrder: AsyncItem<PurchaseOrder | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly productPurchaseItemsId?: string | null;
  readonly purchaseOrderItemsId?: string | null;
}

export declare type PurchaseItem = LazyLoading extends LazyLoadingDisabled ? EagerPurchaseItem : LazyPurchaseItem

export declare const PurchaseItem: (new (init: ModelInit<PurchaseItem>) => PurchaseItem) & {
  copyOf(source: PurchaseItem, mutator: (draft: MutableModel<PurchaseItem>) => MutableModel<PurchaseItem> | void): PurchaseItem;
}

type EagerWarehouseScan = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WarehouseScan, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly scannedBy?: string | null;
  readonly scannedByName?: string | null;
  readonly productId?: string | null;
  readonly productName?: string | null;
  readonly productQuantity?: number | null;
  readonly store?: Store | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeWarehouseScanId?: string | null;
}

type LazyWarehouseScan = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<WarehouseScan, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly scannedBy?: string | null;
  readonly scannedByName?: string | null;
  readonly productId?: string | null;
  readonly productName?: string | null;
  readonly productQuantity?: number | null;
  readonly store: AsyncItem<Store | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storeWarehouseScanId?: string | null;
}

export declare type WarehouseScan = LazyLoading extends LazyLoadingDisabled ? EagerWarehouseScan : LazyWarehouseScan

export declare const WarehouseScan: (new (init: ModelInit<WarehouseScan>) => WarehouseScan) & {
  copyOf(source: WarehouseScan, mutator: (draft: MutableModel<WarehouseScan>) => MutableModel<WarehouseScan> | void): WarehouseScan;
}