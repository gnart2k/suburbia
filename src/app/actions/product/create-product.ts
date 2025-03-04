"use server"
import prismadb from "@/lib/prisma";

export async function createProduct(product: Product) {
    return await prismadb.product.create({
      data: {
        id: product.id,
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
      },
    });
  }
  