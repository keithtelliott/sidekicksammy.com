/*
  Warnings:

  - You are about to drop the column `hsRefreshTokenExpiresAt` on the `Bot` table. All the data in the column will be lost.
  - You are about to alter the column `hsAppId` on the `Bot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `hsChannelAccountId` on the `Bot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `hsChannelId` on the `Bot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `hsPortalId` on the `Bot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `hsUserId` on the `Bot` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hsPortalId" INTEGER,
    "hsAppId" INTEGER,
    "hsRefreshToken" TEXT,
    "hsAccessTokenExpiresAt" DATETIME,
    "hsAccessToken" TEXT,
    "hsChannelAccountId" INTEGER,
    "hsChannelId" INTEGER,
    "hsUserId" INTEGER,
    "hsPrompt" TEXT,
    "fixieCorpusId" TEXT,
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
INSERT INTO "new_Bot" ("backgroundColor", "cardImageUrl", "createdAt", "description", "fixieCorpusId", "greeting", "hsAppId", "hsChannelAccountId", "hsChannelId", "hsPortalId", "hsPrompt", "hsRefreshToken", "hsUserId", "id", "logoUrl", "textColor", "updatedAt", "urlSlug", "userId") SELECT "backgroundColor", "cardImageUrl", "createdAt", "description", "fixieCorpusId", "greeting", "hsAppId", "hsChannelAccountId", "hsChannelId", "hsPortalId", "hsPrompt", "hsRefreshToken", "hsUserId", "id", "logoUrl", "textColor", "updatedAt", "urlSlug", "userId" FROM "Bot";
DROP TABLE "Bot";
ALTER TABLE "new_Bot" RENAME TO "Bot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
