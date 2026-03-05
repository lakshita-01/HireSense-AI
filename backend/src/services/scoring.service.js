export const calculateATSScore = (analysisData) => {
  const weights = {
    keywordMatch: 0.35,
    semanticSimilarity: 0.25,
    impactMetrics: 0.15,
    techDepth: 0.15,
    formatting: 0.10
  };

  // 1. Keyword Score
  const keywordScore = Math.min((analysisData.matchCount / Math.max(analysisData.requiredCount, 1)) * 100, 100);

  // 2. Semantic Score
  const semanticScore = analysisData.similarity * 100;

  // 3. Impact Metrics (Checking for numbers/percentages in text)
  const hasImpact = /[0-9]%|[0-9]+ (users|increase|revenue|reduction|customers|growth)/gi.test(analysisData.text);
  const impactScore = hasImpact ? 100 : 40;

  // 4. Tech Depth (Checking for complex phrases)
  const techPhrases = ["architecture", "scale", "optimization", "lead", "implement", "deploy", "design"];
  const techMatchCount = techPhrases.filter(p => analysisData.text.toLowerCase().includes(p)).length;
  const techDepthScore = Math.min((techMatchCount / techPhrases.length) * 100 + 40, 100);

  // 5. Formatting (Basic check)
  const formattingScore = 95; // Default for parsed PDF

  const finalScore = (
    (keywordScore * weights.keywordMatch) +
    (semanticScore * weights.semanticSimilarity) +
    (impactScore * weights.impactMetrics) +
    (techDepthScore * weights.techDepth) +
    (formattingScore * weights.formatting)
  );

  return {
    total: Math.round(finalScore),
    breakdown: {
      keywordMatch: Math.round(keywordScore),
      semanticSimilarity: Math.round(semanticScore),
      impactMetrics: Math.round(impactScore),
      techDepth: Math.round(techDepthScore),
      formatting: Math.round(formattingScore)
    }
  };
};
