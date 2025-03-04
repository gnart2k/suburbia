"use server"
import prismadb from "@/lib/prisma";

export async function createProductsFromCart(cartResponse: any) {
    try { 
      const result = await createManyProduct({lineItems:cartResponse});
      console.log("Products successfully added to the database:", result);
    } catch (error) {
      console.error("Failed to process cart response:", error);
    }
  }
  

export async function createManyProduct({lineItems}: {lineItems:Product[]}) {
    const products = lineItems.map((product) => ({
      id: product.rootCatalogItemId,
      quantity: product.quantity,
      catalogItemId: product.catalogReference.catalogItemId,
      appId: product.catalogReference.appId,
      variantId: product.catalogReference.options.variantId,
      productNameOriginal: product.productName.original,
      productNameTranslated: product.productName.translated,
      url: product.url,
      priceAmount: +product.price.amount,
      convertedPriceAmount: +product.price.convertedAmount,
      priceFormatted: product.price.formattedAmount,
      convertedPriceFormatted: product.price.formattedConvertedAmount,
      fullPriceAmount: product.fullPrice.amount,
      convertedFullPriceAmount: product.fullPrice.convertedAmount,
      fullPriceFormatted: product.fullPrice.formattedAmount,
      convertedFullPriceFormatted: product.fullPrice.formattedConvertedAmount,
      priceBeforeDiscountsAmount: product.priceBeforeDiscounts.amount,
      convertedPriceBeforeDiscountsAmount: product.priceBeforeDiscounts.convertedAmount,
      priceBeforeDiscountsFormatted: product.priceBeforeDiscounts.formattedAmount,
      convertedPriceBeforeDiscountsFormatted: product.priceBeforeDiscounts.formattedConvertedAmount,
      image: product.image,
      availabilityStatus: product.availability.status,
      quantityAvailable: +product.availability.quantityAvailable,
      sku: product.physicalProperties.sku,
      shippable: product.physicalProperties.shippable,
      paymentOption: product.paymentOption,
      membersOnly: product.membersOnly,
      rootCatalogItemId: product.rootCatalogItemId,
      customLineItem: product.customLineItem,
      priceUndetermined: product.priceUndetermined,
      fixedQuantity: product.fixedQuantity,
      savePaymentMethod: product.savePaymentMethod,
      inventoryAppId: product.inventoryAppId,
      policies: product.policies, // JSON-compatible
    }));
  
    return await prismadb.product.createMany({ data: products, skipDuplicates: true });
  }
  