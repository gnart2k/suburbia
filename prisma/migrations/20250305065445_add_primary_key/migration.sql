-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `catalogItemId` VARCHAR(191) NOT NULL,
    `appId` VARCHAR(191) NOT NULL,
    `variantId` VARCHAR(191) NOT NULL,
    `productNameOriginal` VARCHAR(191) NOT NULL,
    `productNameTranslated` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `priceAmount` INTEGER NOT NULL,
    `convertedPriceAmount` INTEGER NOT NULL,
    `priceFormatted` VARCHAR(191) NOT NULL,
    `convertedPriceFormatted` VARCHAR(191) NOT NULL,
    `fullPriceAmount` VARCHAR(191) NOT NULL,
    `convertedFullPriceAmount` VARCHAR(191) NOT NULL,
    `fullPriceFormatted` VARCHAR(191) NOT NULL,
    `convertedFullPriceFormatted` VARCHAR(191) NOT NULL,
    `priceBeforeDiscountsAmount` VARCHAR(191) NOT NULL,
    `convertedPriceBeforeDiscountsAmount` VARCHAR(191) NOT NULL,
    `priceBeforeDiscountsFormatted` VARCHAR(191) NOT NULL,
    `convertedPriceBeforeDiscountsFormatted` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `availabilityStatus` VARCHAR(191) NOT NULL,
    `quantityAvailable` INTEGER NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `shippable` BOOLEAN NOT NULL,
    `paymentOption` VARCHAR(191) NOT NULL,
    `membersOnly` BOOLEAN NOT NULL,
    `rootCatalogItemId` VARCHAR(191) NOT NULL,
    `customLineItem` BOOLEAN NOT NULL,
    `priceUndetermined` BOOLEAN NOT NULL,
    `fixedQuantity` BOOLEAN NOT NULL,
    `savePaymentMethod` BOOLEAN NOT NULL,
    `inventoryAppId` VARCHAR(191) NOT NULL,
    `policies` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInfo` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `shippingAddress` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `ward` VARCHAR(191) NOT NULL,
    `addressDetail` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserInfo_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(191) NOT NULL,
    `userInfoid` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL DEFAULT 'processing',
    `amount` VARCHAR(191) NOT NULL,
    `paymentUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_OrderToProduct` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_OrderToProduct_AB_unique`(`A`, `B`),
    INDEX `_OrderToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userInfoid_fkey` FOREIGN KEY (`userInfoid`) REFERENCES `UserInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderToProduct` ADD CONSTRAINT `_OrderToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderToProduct` ADD CONSTRAINT `_OrderToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
