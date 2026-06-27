export function calculatePoints(
    actualHomeScore: number,
    actualAwayScore: number,
    predictedWinnerId: string | null,
    homeTeamId: string,
    awayTeamId: string,
    predictedHomeScore?: number | null,
    predictedAwayScore?: number | null,
  ): number {
    
    let actualWinnerId: string | null = null;
    if (actualHomeScore > actualAwayScore) {
      actualWinnerId = homeTeamId;
    } else if (actualAwayScore > actualHomeScore) {
      actualWinnerId = awayTeamId;
    } else {
      actualWinnerId = null; 
    }
  
    const correctResult = predictedWinnerId === actualWinnerId;
  
    if (!correctResult) return 0;
  
    let points = 3;
  
    if (
        predictedHomeScore != null &&
        predictedAwayScore != null &&
        predictedHomeScore === actualHomeScore &&
        predictedAwayScore === actualAwayScore
      ) {
        points += 2;
      }
  
    return points;
  }