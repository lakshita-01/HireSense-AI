export const calculateATSScore = (analysisData) => {
  const weights = {
    keywordMatch: 0.35,
    semanticSimilarity: 0.25,
    impactMetrics: 0.15,
    techDepth: 0.15,
    formatting: 0.10
  };

  // Ensure analysisData has required properties
  const text = analysisData.text || '';
  const matchCount = analysisData.matchCount || 0;
  const requiredCount = analysisData.requiredCount || 1;
  const similarity = typeof analysisData.similarity === 'number' ? analysisData.similarity : 0;

  // 1. Keyword Score (35%)
  const keywordScore = Math.min((matchCount / Math.max(requiredCount, 1)) * 100, 100);

  // 2. Semantic Score (25%) - similarity is already 0-1, convert to 0-100
  const semanticScore = similarity * 100;

  // 3. Impact Metrics (15%) - Checking for numbers/percentages in text
  const hasImpact = /[0-9]%|[0-9]+ (users|increase|revenue|reduction|customers|growth|improved|reduced|saved|generated|led|managed|created|developed)/gi.test(text);
  const impactScore = hasImpact ? 100 : 40;

  // 4. Tech Depth (15%) - Checking for complex phrases
  const techPhrases = ["architecture", "scale", "optimization", "lead", "implement", "deploy", "design", "developed", "engineered", "built", "created", "managed", "system", "platform", "framework", "api", "database", "cloud", "microservices", "agile"];
  const techMatchCount = techPhrases.filter(p => text.toLowerCase().includes(p)).length;
  const techDepthScore = Math.min((techMatchCount / techPhrases.length) * 100 + 40, 100);

  // 5. Formatting (10%) - Default high score for parsed documents
  const formattingScore = 95;

  // Calculate weighted final score
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
