/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateStore = /* GraphQL */ `
  subscription OnCreateStore($filter: ModelSubscriptionStoreFilterInput) {
    onCreateStore(filter: $filter) {
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
export const onUpdateStore = /* GraphQL */ `
  subscription OnUpdateStore($filter: ModelSubscriptionStoreFilterInput) {
    onUpdateStore(filter: $filter) {
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
export const onDeleteStore = /* GraphQL */ `
  subscription OnDeleteStore($filter: ModelSubscriptionStoreFilterInput) {
    onDeleteStore(filter: $filter) {
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
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onCreateCategory(filter: $filter) {
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
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onUpdateCategory(filter: $filter) {
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
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onDeleteCategory(filter: $filter) {
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
export const onCreateNotifications = /* GraphQL */ `
  subscription OnCreateNotifications(
    $filter: ModelSubscriptionNotificationsFilterInput
  ) {
    onCreateNotifications(filter: $filter) {
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
export const onUpdateNotifications = /* GraphQL */ `
  subscription OnUpdateNotifications(
    $filter: ModelSubscriptionNotificationsFilterInput
  ) {
    onUpdateNotifications(filter: $filter) {
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
export const onDeleteNotifications = /* GraphQL */ `
  subscription OnDeleteNotifications(
    $filter: ModelSubscriptionNotificationsFilterInput
  ) {
    onDeleteNotifications(filter: $filter) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
    onCreateProduct(filter: $filter) {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
    onUpdateProduct(filter: $filter) {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
    onDeleteProduct(filter: $filter) {
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
export const onCreateBillItem = /* GraphQL */ `
  subscription OnCreateBillItem($filter: ModelSubscriptionBillItemFilterInput) {
    onCreateBillItem(filter: $filter) {
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
export const onUpdateBillItem = /* GraphQL */ `
  subscription OnUpdateBillItem($filter: ModelSubscriptionBillItemFilterInput) {
    onUpdateBillItem(filter: $filter) {
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
export const onDeleteBillItem = /* GraphQL */ `
  subscription OnDeleteBillItem($filter: ModelSubscriptionBillItemFilterInput) {
    onDeleteBillItem(filter: $filter) {
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
export const onCreateBill = /* GraphQL */ `
  subscription OnCreateBill($filter: ModelSubscriptionBillFilterInput) {
    onCreateBill(filter: $filter) {
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
export const onUpdateBill = /* GraphQL */ `
  subscription OnUpdateBill($filter: ModelSubscriptionBillFilterInput) {
    onUpdateBill(filter: $filter) {
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
export const onDeleteBill = /* GraphQL */ `
  subscription OnDeleteBill($filter: ModelSubscriptionBillFilterInput) {
    onDeleteBill(filter: $filter) {
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
export const onCreatePurchaseOrder = /* GraphQL */ `
  subscription OnCreatePurchaseOrder(
    $filter: ModelSubscriptionPurchaseOrderFilterInput
  ) {
    onCreatePurchaseOrder(filter: $filter) {
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
export const onUpdatePurchaseOrder = /* GraphQL */ `
  subscription OnUpdatePurchaseOrder(
    $filter: ModelSubscriptionPurchaseOrderFilterInput
  ) {
    onUpdatePurchaseOrder(filter: $filter) {
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
export const onDeletePurchaseOrder = /* GraphQL */ `
  subscription OnDeletePurchaseOrder(
    $filter: ModelSubscriptionPurchaseOrderFilterInput
  ) {
    onDeletePurchaseOrder(filter: $filter) {
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
export const onCreatePurchaseItem = /* GraphQL */ `
  subscription OnCreatePurchaseItem(
    $filter: ModelSubscriptionPurchaseItemFilterInput
  ) {
    onCreatePurchaseItem(filter: $filter) {
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
export const onUpdatePurchaseItem = /* GraphQL */ `
  subscription OnUpdatePurchaseItem(
    $filter: ModelSubscriptionPurchaseItemFilterInput
  ) {
    onUpdatePurchaseItem(filter: $filter) {
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
export const onDeletePurchaseItem = /* GraphQL */ `
  subscription OnDeletePurchaseItem(
    $filter: ModelSubscriptionPurchaseItemFilterInput
  ) {
    onDeletePurchaseItem(filter: $filter) {
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
export const onCreateWarehouseScan = /* GraphQL */ `
  subscription OnCreateWarehouseScan(
    $filter: ModelSubscriptionWarehouseScanFilterInput
  ) {
    onCreateWarehouseScan(filter: $filter) {
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
export const onUpdateWarehouseScan = /* GraphQL */ `
  subscription OnUpdateWarehouseScan(
    $filter: ModelSubscriptionWarehouseScanFilterInput
  ) {
    onUpdateWarehouseScan(filter: $filter) {
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
export const onDeleteWarehouseScan = /* GraphQL */ `
  subscription OnDeleteWarehouseScan(
    $filter: ModelSubscriptionWarehouseScanFilterInput
  ) {
    onDeleteWarehouseScan(filter: $filter) {
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
