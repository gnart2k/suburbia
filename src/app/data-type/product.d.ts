type Product = {
    _id: string;
    quantity: number;
    catalogReference: {
      catalogItemId: string;
      appId: string;
      options: {
        variantId: string;
      };
    };
    productName: {
      original: string;
      translated: string;
    };
    url: string;
    price: {
      amount: number;
      convertedAmount: number;
      formattedAmount: string;
      formattedConvertedAmount: string;
    };
    fullPrice: {
      amount: string;
      convertedAmount: string;
      formattedAmount: string;
      formattedConvertedAmount: string;
    };
    priceBeforeDiscounts: {
      amount: string;
      convertedAmount: string;
      formattedAmount: string;
      formattedConvertedAmount: string;
    };
    descriptionLines: {
      name: {
        original: string;
        translated: string;
      };
      plainText: {
        original: string;
        translated: string;
      };
      lineType: string;
    }[];
    image: string;
    availability: {
      status: string;
      quantityAvailable: number;
    };
    physicalProperties: {
      sku: string;
      shippable: boolean;
    };
    couponScopes: {
      namespace: string;
      group: {
        name: string;
        entityId: string;
      };
    }[];
    itemType: {
      preset: string;
    };
    paymentOption: string;
    rootCatalogItemId: string;
    customLineItem: boolean;
    priceUndetermined: boolean;
    fixedQuantity: boolean;
    savePaymentMethod: boolean;
    policies: string[];
    inventoryAppId: string;
    membersOnly: boolean;
  };
  