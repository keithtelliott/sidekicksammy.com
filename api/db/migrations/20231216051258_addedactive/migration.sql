-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hsActive" BOOLEAN NOT NULL DEFAULT true,
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
INSERT INTO "new_Bot" ("backgroundColor", "cardImageUrl", "createdAt", "description", "fixieCorpusId", "greeting", "hsAccessToken", "hsAccessTokenExpiresAt", "hsAppId", "hsChannelAccountId", "hsChannelId", "hsPortalId", "hsPrompt", "hsRefreshToken", "hsUserId", "id", "logoUrl", "textColor", "title", "updatedAt", "urlSlug", "userId") SELECT "backgroundColor", "cardImageUrl", "createdAt", "description", "fixieCorpusId", "greeting", "hsAccessToken", "hsAccessTokenExpiresAt", "hsAppId", "hsChannelAccountId", "hsChannelId", "hsPortalId", "hsPrompt", "hsRefreshToken", "hsUserId", "id", "logoUrl", "textColor", "title", "updatedAt", "urlSlug", "userId" FROM "Bot";
DROP TABLE "Bot";
ALTER TABLE "new_Bot" RENAME TO "Bot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
