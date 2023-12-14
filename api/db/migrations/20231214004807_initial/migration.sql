-- CreateTable
CREATE TABLE "Bot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hsRefreshToken" TEXT,
    "hsRefreshTokenExpiresAt" DATETIME,
    "hsPrompt" TEXT,
    "hsChannelAccountId" TEXT,
    "hsChannelId" TEXT,
    "hsUserId" TEXT,
    "fixieCorpusId" TEXT,
    "cardImageUrl" TEXT,
    "description" TEXT,
    "urlSlug" TEXT,
    "logoUrl" TEXT,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "userId" INTEGER,
    CONSTRAINT "Bot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" DATETIME,
    "roles" TEXT NOT NULL DEFAULT 'customer'
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
