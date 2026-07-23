-- CreateTable
CREATE TABLE "Budget" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "spent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accountId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
