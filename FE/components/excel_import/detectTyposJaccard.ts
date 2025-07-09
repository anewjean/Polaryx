const jaccardSimilarity = (a: string, b: string) => {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
};

export const detectTyposJaccard = (uploadedHeaders: string[]) => {
  const validFields = ["email", "name", "role", "group", "github", "blog"];
  const typos = [];

  for (const header of uploadedHeaders) {
    if (validFields.includes(header)) continue;
    const suggestions = validFields
      .map((field) => ({
        field,
        similarity: jaccardSimilarity(header, field),
      }))
      .filter((f) => f.similarity >= 0.6) // 0.6~0.8 정도를 오타로 간주
      .sort((a, b) => b.similarity - a.similarity);
    if (suggestions.length > 0) {
      typos.push({
        wrong: header,
        suggest: suggestions[0].field,
      });
    }
  }
  return typos;
};
