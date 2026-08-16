-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "movements" INTEGER[],
    "interestRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "pin" INTEGER NOT NULL,
    "movementsDates" TIMESTAMP(3)[],
    "currency" TEXT NOT NULL,
    "locale" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
