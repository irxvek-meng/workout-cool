interface MuscleGifMetadata {
  gifUrl: string;
}

/**
 * Fetches a GIF preview URL from ExerciseGymGifsDB (jsDelivr).
 * Returns null when slug is missing, HTTP error, or invalid JSON.
 */
export async function getMuscleImageUrl(muscle: string, slug: string): Promise<string | null> {
  const trimmed = slug.trim();
  if (!trimmed) {
    return null;
  }

  const locale = "en";
  const lowercaseMuscle = muscle.toLowerCase();
  const url = `https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/api/${locale}/exercises/${lowercaseMuscle}/${trimmed}.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }

    const result = (await res.json()) as MuscleGifMetadata;
    if (typeof result.gifUrl !== "string" || result.gifUrl.length === 0) {
      return null;
    }

    return result.gifUrl;
  } catch (error) {
    console.error(`Error fetching muscle image for ${trimmed}:`, error);
    return null;
  }
}



