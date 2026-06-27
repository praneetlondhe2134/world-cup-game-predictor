type PredictionResult = {
    predictedResult: 'home' | 'away' | 'draw';
    predictedWinner: string | null;
    confidence: 'low' | 'medium' | 'high';
    explanation: string;
  };
  
  export function predictMatch(
    homeTeamName: string,
    homeTeamRating: number,
    awayTeamName: string,
    awayTeamRating: number,
  ): PredictionResult {
    const diff = homeTeamRating - awayTeamRating;
    const absDiff = Math.abs(diff);
  
    let confidence: 'low' | 'medium' | 'high';
    if (absDiff < 100) {
      confidence = 'low';
    } else if (absDiff < 300) {
      confidence = 'medium';
    } else {
      confidence = 'high';
    }
  
    if (absDiff < 100) {
      return {
        predictedResult: 'draw',
        predictedWinner: null,
        confidence,
        explanation: `${homeTeamName} and ${awayTeamName} are closely matched (ratings within ${absDiff} points). The model predicts a draw.`,
      };
    }
  
    if (diff > 0) {
      return {
        predictedResult: 'home',
        predictedWinner: homeTeamName,
        confidence,
        explanation: `${homeTeamName} (${homeTeamRating}) is rated ${absDiff} points higher than ${awayTeamName} (${awayTeamRating}).`,
      };
    }
  
    return {
      predictedResult: 'away',
      predictedWinner: awayTeamName,
      confidence,
      explanation: `${awayTeamName} (${awayTeamRating}) is rated ${absDiff} points higher than ${homeTeamName} (${homeTeamRating}).`,
    };
  }