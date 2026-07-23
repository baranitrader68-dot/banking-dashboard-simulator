-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardHolder" TEXT NOT NULL,
    "expiryDate" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "accountId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_cardNumber_key" ON "Card"("cardNumber");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
