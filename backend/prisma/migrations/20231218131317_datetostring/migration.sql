-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_wardrobe" (
    "number" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "date" TEXT
);
INSERT INTO "new_wardrobe" ("createdAt", "date", "name", "number", "situation", "updatedAt") SELECT "createdAt", "date", "name", "number", "situation", "updatedAt" FROM "wardrobe";
DROP TABLE "wardrobe";
ALTER TABLE "new_wardrobe" RENAME TO "wardrobe";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
