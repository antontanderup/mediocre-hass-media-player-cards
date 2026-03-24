export const getMediaPlaceholderText = (value?: string | null) => {
  const normalized = value?.trim();
  if (!normalized) return "";

  const parts = normalized
    .split(/[\s/,&()+-]+/)
    .map(part => part.replace(/[^A-Za-z0-9]/g, ""))
    .filter(Boolean);

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    const token = parts[0];
    const first = token[0] ?? "";
    const second =
      token
        .slice(1)
        .split("")
        .find(char => /[A-Za-z]/.test(char)) ?? token[1] ?? "";
    return `${first}${second}`.toUpperCase();
  }

  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1][0] ?? "";
  return `${first}${last}`.toUpperCase();
};
