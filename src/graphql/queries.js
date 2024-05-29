/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStore = /* GraphQL */ `
  query GetStore($id: ID!) {
    getStore(id: $id) {
      id
      name
      currency
      address
      contact
      users {
        nextToken
        startedAt
        __typename
      }
      products {
        nextToken
        startedAt
        __typename
      }
      bills {
        nextToken
        startedAt
        __typename
      }
      purchaseOrder {
        nextToken
        startedAt
        __typename
      }
      warehouseScan {
        nextToken
        startedAt
        __typename
      }
      billItems {
        nextToken
        startedAt
        __typename
      }
      category {
        nextToken
        startedAt
        __typename
      }
      notifications {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const listStores = /* GraphQL */ `
  query ListStores(
    $filter: ModelStoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStores(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncStores = /* GraphQL */ `
  query SyncStores(
    $filter: ModelStoreFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncStores(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
      id
      name
      description
      product {
        nextToken
        startedAt
        __typename
      }
      store {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      storeCategoryId
      __typename
    }
  }
`;
export const listCategories = /* GraphQL */ `
  query ListCategories(
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeCategoryId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncCategories = /* GraphQL */ `
  query SyncCategories(
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCategories(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        description
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeCategoryId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getNotifications = /* GraphQL */ `
  query GetNotifications($id: ID!) {
    getNotifications(id: $id) {
      id
      warehousequanity
      shelfquantity
      productID
      productname
      isRead
      isWarehouseNotification
      isShelfNotification
      store {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      storeNotificationsId
      __typename
    }
  }
`;
export const listNotifications = /* GraphQL */ `
  query ListNotifications(
    $filter: ModelNotificationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        warehousequanity
        shelfquantity
        productID
        productname
        isRead
        isWarehouseNotification
        isShelfNotification
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeNotificationsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncNotifications = /* GraphQL */ `
  query SyncNotifications(
    $filter: ModelNotificationsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncNotifications(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        warehousequanity
        shelfquantity
        productID
        productname
        isRead
        isWarehouseNotification
        isShelfNotification
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeNotificationsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      userId
      username
      phonenumber
      password
      image
      role
      idcardimage
      store {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      bills
      purchaseOrders
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      storeUsersId
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        username
        phonenumber
        password
        image
        role
        idcardimage
        bills
        purchaseOrders
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeUsersId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        userId
        username
        phonenumber
        password
        image
        role
        idcardimage
        bills
        purchaseOrders
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeUsersId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      barcode
      image
      price
      manufacturer
      category
      category1 {
        id
        name
        description
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeCategoryId
        __typename
      }
      warehouseQuantity
      shelfQuantity
      warehouseInventoryLimit
      shelfInventoryLimit
      store {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      billItems {
        nextToken
        startedAt
        __typename
      }
      purchaseItems {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      storeProductsId
      categoryProductId
      __typename
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        barcode
        image
        price
        manufacturer
        category
        warehouseQuantity
        shelfQuantity
        warehouseInventoryLimit
        shelfInventoryLimit
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeProductsId
        categoryProductId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncProducts = /* GraphQL */ `
  query SyncProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncProducts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        barcode
        image
        price
        manufacturer
        category
        warehouseQuantity
        shelfQuantity
        warehouseInventoryLimit
        shelfInventoryLimit
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeProductsId
        categoryProductId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getBillItem = /* GraphQL */ `
  query GetBillItem($id: ID!) {
    getBillItem(id: $id) {
      id
      product {
        id
        name
        barcode
        image
        price
        manufacturer
        category
        warehouseQuantity
        shelfQuantity
        warehouseInventoryLimit
        shelfInventoryLimit
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeProductsId
        categoryProductId
        __typename
      }
      productName
      quantity
      productPrice
      subtotal
      category
      manufacturer
      bill {
        id
        cashier
        cashierName
        totalAmount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeBillsId
        __typename
      }
      store {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      storeBillItemsId
      productBillItemsId
      billItemsId
      __typename
    }
  }
`;
export const listBillItems = /* GraphQL */ `
  query ListBillItems(
    $filter: ModelBillItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBillItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        productName
        quantity
        productPrice
        subtotal
        category
        manufacturer
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeBillItemsId
        productBillItemsId
        billItemsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncBillItems = /* GraphQL */ `
  query SyncBillItems(
    $filter: ModelBillItemFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncBillItems(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        productName
        quantity
        productPrice
        subtotal
        category
        manufacturer
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeBillItemsId
        productBillItemsId
        billItemsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getBill = /* GraphQL */ `
  query GetBill($id: ID!) {
    getBill(id: $id) {
      id
      cashier
      cashierName
      items {
        nextToken
        startedAt
        __typename
      }
      totalAmount
      status
      store {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      storeBillsId
      __typename
    }
  }
`;
export const listBills = /* GraphQL */ `
  query ListBills(
    $filter: ModelBillFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBills(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        cashier
        cashierName
        totalAmount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeBillsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncBills = /* GraphQL */ `
  query SyncBills(
    $filter: ModelBillFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncBills(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        cashier
        cashierName
        totalAmount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeBillsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getPurchaseOrder = /* GraphQL */ `
  query GetPurchaseOrder($id: ID!) {
    getPurchaseOrder(id: $id) {
      id
      purchaser
      purchaserName
      vendor
      store {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      items {
        nextToken
        startedAt
        __typename
      }
      totalAmount
      status
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      storePurchaseOrderId
      __typename
    }
  }
`;
export const listPurchaseOrders = /* GraphQL */ `
  query ListPurchaseOrders(
    $filter: ModelPurchaseOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPurchaseOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        purchaser
        purchaserName
        vendor
        totalAmount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storePurchaseOrderId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncPurchaseOrders = /* GraphQL */ `
  query SyncPurchaseOrders(
    $filter: ModelPurchaseOrderFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPurchaseOrders(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        purchaser
        purchaserName
        vendor
        totalAmount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storePurchaseOrderId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getPurchaseItem = /* GraphQL */ `
  query GetPurchaseItem($id: ID!) {
    getPurchaseItem(id: $id) {
      id
      product {
        id
        name
        barcode
        image
        price
        manufacturer
        category
        warehouseQuantity
        shelfQuantity
        warehouseInventoryLimit
        shelfInventoryLimit
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeProductsId
        categoryProductId
        __typename
      }
      productName
      productPrice
      productTag
      quantityOrdered
      quantityReceived
      purchaseOrder {
        id
        purchaser
        purchaserName
        vendor
        totalAmount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storePurchaseOrderId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      productPurchaseItemsId
      purchaseOrderItemsId
      __typename
    }
  }
`;
export const listPurchaseItems = /* GraphQL */ `
  query ListPurchaseItems(
    $filter: ModelPurchaseItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPurchaseItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        productName
        productPrice
        productTag
        quantityOrdered
        quantityReceived
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        productPurchaseItemsId
        purchaseOrderItemsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncPurchaseItems = /* GraphQL */ `
  query SyncPurchaseItems(
    $filter: ModelPurchaseItemFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPurchaseItems(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        productName
        productPrice
        productTag
        quantityOrdered
        quantityReceived
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        productPurchaseItemsId
        purchaseOrderItemsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getWarehouseScan = /* GraphQL */ `
  query GetWarehouseScan($id: ID!) {
    getWarehouseScan(id: $id) {
      id
      scannedBy
      scannedByName
      productId
      productName
      productQuantity
      store {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      storeWarehouseScanId
      __typename
    }
  }
`;
export const listWarehouseScans = /* GraphQL */ `
  query ListWarehouseScans(
    $filter: ModelWarehouseScanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWarehouseScans(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        scannedBy
        scannedByName
        productId
        productName
        productQuantity
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeWarehouseScanId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncWarehouseScans = /* GraphQL */ `
  query SyncWarehouseScans(
    $filter: ModelWarehouseScanFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncWarehouseScans(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        scannedBy
        scannedByName
        productId
        productName
        productQuantity
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeWarehouseScanId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const storeByName = /* GraphQL */ `
  query StoreByName(
    $name: String!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStoreFilterInput
    $limit: Int
    $nextToken: String
  ) {
    storeByName(
      name: $name
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        currency
        address
        contact
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const userById = /* GraphQL */ `
  query UserById(
    $userId: ID!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userById(
      userId: $userId
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        username
        phonenumber
        password
        image
        role
        idcardimage
        bills
        purchaseOrders
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeUsersId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const userByName = /* GraphQL */ `
  query UserByName(
    $username: String!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByName(
      username: $username
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        username
        phonenumber
        password
        image
        role
        idcardimage
        bills
        purchaseOrders
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeUsersId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const productByName = /* GraphQL */ `
  query ProductByName(
    $name: String!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    productByName(
      name: $name
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        barcode
        image
        price
        manufacturer
        category
        warehouseQuantity
        shelfQuantity
        warehouseInventoryLimit
        shelfInventoryLimit
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeProductsId
        categoryProductId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const productByBarcode = /* GraphQL */ `
  query ProductByBarcode(
    $barcode: String!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    productByBarcode(
      barcode: $barcode
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        barcode
        image
        price
        manufacturer
        category
        warehouseQuantity
        shelfQuantity
        warehouseInventoryLimit
        shelfInventoryLimit
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeProductsId
        categoryProductId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const billByCashierId = /* GraphQL */ `
  query BillByCashierId(
    $cashier: String!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelBillFilterInput
    $limit: Int
    $nextToken: String
  ) {
    billByCashierId(
      cashier: $cashier
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        cashier
        cashierName
        totalAmount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storeBillsId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const poByPurchaserId = /* GraphQL */ `
  query PoByPurchaserId(
    $purchaser: ID!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPurchaseOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    poByPurchaserId(
      purchaser: $purchaser
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        purchaser
        purchaserName
        vendor
        totalAmount
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        storePurchaseOrderId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
