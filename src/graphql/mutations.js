/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createStore = /* GraphQL */ `
  mutation CreateStore(
    $input: CreateStoreInput!
    $condition: ModelStoreConditionInput
  ) {
    createStore(input: $input, condition: $condition) {
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
export const updateStore = /* GraphQL */ `
  mutation UpdateStore(
    $input: UpdateStoreInput!
    $condition: ModelStoreConditionInput
  ) {
    updateStore(input: $input, condition: $condition) {
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
export const deleteStore = /* GraphQL */ `
  mutation DeleteStore(
    $input: DeleteStoreInput!
    $condition: ModelStoreConditionInput
  ) {
    deleteStore(input: $input, condition: $condition) {
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
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
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
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
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
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
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
export const createNotifications = /* GraphQL */ `
  mutation CreateNotifications(
    $input: CreateNotificationsInput!
    $condition: ModelNotificationsConditionInput
  ) {
    createNotifications(input: $input, condition: $condition) {
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
export const updateNotifications = /* GraphQL */ `
  mutation UpdateNotifications(
    $input: UpdateNotificationsInput!
    $condition: ModelNotificationsConditionInput
  ) {
    updateNotifications(input: $input, condition: $condition) {
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
export const deleteNotifications = /* GraphQL */ `
  mutation DeleteNotifications(
    $input: DeleteNotificationsInput!
    $condition: ModelNotificationsConditionInput
  ) {
    deleteNotifications(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
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
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
export const createBillItem = /* GraphQL */ `
  mutation CreateBillItem(
    $input: CreateBillItemInput!
    $condition: ModelBillItemConditionInput
  ) {
    createBillItem(input: $input, condition: $condition) {
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
export const updateBillItem = /* GraphQL */ `
  mutation UpdateBillItem(
    $input: UpdateBillItemInput!
    $condition: ModelBillItemConditionInput
  ) {
    updateBillItem(input: $input, condition: $condition) {
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
export const deleteBillItem = /* GraphQL */ `
  mutation DeleteBillItem(
    $input: DeleteBillItemInput!
    $condition: ModelBillItemConditionInput
  ) {
    deleteBillItem(input: $input, condition: $condition) {
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
export const createBill = /* GraphQL */ `
  mutation CreateBill(
    $input: CreateBillInput!
    $condition: ModelBillConditionInput
  ) {
    createBill(input: $input, condition: $condition) {
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
export const updateBill = /* GraphQL */ `
  mutation UpdateBill(
    $input: UpdateBillInput!
    $condition: ModelBillConditionInput
  ) {
    updateBill(input: $input, condition: $condition) {
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
export const deleteBill = /* GraphQL */ `
  mutation DeleteBill(
    $input: DeleteBillInput!
    $condition: ModelBillConditionInput
  ) {
    deleteBill(input: $input, condition: $condition) {
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
export const createPurchaseOrder = /* GraphQL */ `
  mutation CreatePurchaseOrder(
    $input: CreatePurchaseOrderInput!
    $condition: ModelPurchaseOrderConditionInput
  ) {
    createPurchaseOrder(input: $input, condition: $condition) {
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
export const updatePurchaseOrder = /* GraphQL */ `
  mutation UpdatePurchaseOrder(
    $input: UpdatePurchaseOrderInput!
    $condition: ModelPurchaseOrderConditionInput
  ) {
    updatePurchaseOrder(input: $input, condition: $condition) {
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
export const deletePurchaseOrder = /* GraphQL */ `
  mutation DeletePurchaseOrder(
    $input: DeletePurchaseOrderInput!
    $condition: ModelPurchaseOrderConditionInput
  ) {
    deletePurchaseOrder(input: $input, condition: $condition) {
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
export const createPurchaseItem = /* GraphQL */ `
  mutation CreatePurchaseItem(
    $input: CreatePurchaseItemInput!
    $condition: ModelPurchaseItemConditionInput
  ) {
    createPurchaseItem(input: $input, condition: $condition) {
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
export const updatePurchaseItem = /* GraphQL */ `
  mutation UpdatePurchaseItem(
    $input: UpdatePurchaseItemInput!
    $condition: ModelPurchaseItemConditionInput
  ) {
    updatePurchaseItem(input: $input, condition: $condition) {
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
export const deletePurchaseItem = /* GraphQL */ `
  mutation DeletePurchaseItem(
    $input: DeletePurchaseItemInput!
    $condition: ModelPurchaseItemConditionInput
  ) {
    deletePurchaseItem(input: $input, condition: $condition) {
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
export const createWarehouseScan = /* GraphQL */ `
  mutation CreateWarehouseScan(
    $input: CreateWarehouseScanInput!
    $condition: ModelWarehouseScanConditionInput
  ) {
    createWarehouseScan(input: $input, condition: $condition) {
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
export const updateWarehouseScan = /* GraphQL */ `
  mutation UpdateWarehouseScan(
    $input: UpdateWarehouseScanInput!
    $condition: ModelWarehouseScanConditionInput
  ) {
    updateWarehouseScan(input: $input, condition: $condition) {
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
export const deleteWarehouseScan = /* GraphQL */ `
  mutation DeleteWarehouseScan(
    $input: DeleteWarehouseScanInput!
    $condition: ModelWarehouseScanConditionInput
  ) {
    deleteWarehouseScan(input: $input, condition: $condition) {
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
