/*
  Warnings:

  - A unique constraint covering the columns `[matchId,displayName]` on the table `Prediction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Prediction_matchId_displayName_key" ON "Prediction"("matchId", "displayName");
