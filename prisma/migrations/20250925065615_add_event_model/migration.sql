-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventId_key" ON "public"."Event"("eventId");

-- CreateIndex
CREATE INDEX "Event_recordId_idx" ON "public"."Event"("recordId");

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "public"."Record"("recordId") ON DELETE RESTRICT ON UPDATE CASCADE;
