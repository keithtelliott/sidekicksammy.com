-- CreateTable
CREATE TABLE "Bot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hsActive" BOOLEAN NOT NULL DEFAULT true,
    "hsPortalId" INTEGER,
    "hsAppId" INTEGER,
    "hsRefreshToken" TEXT,
    "hsAccessTokenExpiresAt" DATETIME,
    "hsAccessToken" TEXT,
    "hsUserId" INTEGER,
    "hsPrompt" TEXT,
    "fixieCorpusId" TEXT,
    "fixieAgentId" TEXT,
    "corpusRefetchIntervalDays" INTEGER NOT NULL DEFAULT 7,
    "cardImageUrl" TEXT,
    "description" TEXT,
    "urlSlug" TEXT,
    "title" TEXT,
    "logoUrl" TEXT,
    "backgroundColor" TEXT,
    "textColor" TEXT,
    "greeting" TEXT,
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
