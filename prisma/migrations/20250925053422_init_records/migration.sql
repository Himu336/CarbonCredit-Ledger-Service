-- CreateTable
CREATE TABLE "public"."Record" (
    "id" SERIAL NOT NULL,
    "recordId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "registry" TEXT NOT NULL,
    "vintage" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "serialNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Record_recordId_key" ON "public"."Record"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "Record_serialNumber_key" ON "public"."Record"("serialNumber");

-- CreateIndex
CREATE INDEX "Record_projectName_idx" ON "public"."Record"("projectName");

-- CreateIndex
CREATE INDEX "Record_registry_idx" ON "public"."Record"("registry");

-- CreateIndex
CREATE INDEX "Record_vintage_idx" ON "public"."Record"("vintage");
