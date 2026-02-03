export const getFbExpiration = (pictureUrl: string): number | null => {
  try {
    const url = new URL(pictureUrl);
    const ext = url.searchParams.get("ext");
    return ext ? parseInt(ext, 10) : null;
  } catch {
    return null;
  }
};
