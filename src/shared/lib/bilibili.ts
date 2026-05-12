/**
 * Normalizes a Bilibili **web player** URL (e.g. `player.bilibili.com/player.html?...`)
 * to an absolute `https:` URL suitable for `<iframe src>`.
 */
export function normalizeBilibiliPlayerUrl(candidate: string): string | null {
  const trimmed = candidate.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const withProtocol = trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
    const parsed = new URL(withProtocol);
    if (!parsed.hostname.endsWith("bilibili.com")) {
      return null;
    }
    if (!parsed.pathname.includes("player.html")) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Accepts either a raw player URL or a full `<iframe ... src="...">` snippet (official embed).
 */
export function extractBilibiliPlayerUrlFromPaste(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.includes("<iframe")) {
    const match = trimmed.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
    if (!match?.[1]) {
      return null;
    }

    return normalizeBilibiliPlayerUrl(match[1]);
  }

  return normalizeBilibiliPlayerUrl(trimmed);
}

/**
 * Returns an iframe-safe player URL when `fullVideoUrl` stores a Bilibili player URL
 * (or legacy paste that still contains the iframe markup).
 */
export function getBilibiliEmbedUrl(videoUrl: string | null | undefined): string | null {
  if (!videoUrl) {
    return null;
  }

  return normalizeBilibiliPlayerUrl(videoUrl) ?? extractBilibiliPlayerUrlFromPaste(videoUrl);
}
