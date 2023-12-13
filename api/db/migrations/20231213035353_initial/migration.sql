-- CreateTable
CREATE TABLE "HubspotBot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "refreshToken" TEXT,
    "refreshTokenExpiresAt" DATETIME,
    "prompt" TEXT,
    "channelAccountId" TEXT,
    "channelId" TEXT,
    "hubspotUserId" TEXT,
    "fixieCorpusId" TEXT,
    "urlSlug" TEXT,
    "logoUrl" TEXT,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "userId" INTEGER,
    CONSTRAINT "HubspotBot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
