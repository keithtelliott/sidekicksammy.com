-- CreateTable
CREATE TABLE "Bot" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hsActive" BOOLEAN NOT NULL DEFAULT true,
    "hsPortalId" INTEGER,
    "hsAppId" INTEGER,
    "hsRefreshToken" TEXT,
    "hsAccessTokenExpiresAt" TIMESTAMP(3),
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

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" TIMESTAMP(3),
    "roles" TEXT NOT NULL DEFAULT 'customer',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
