const USER_ID_PATTERN = /^[A-Za-z0-9]+$/;

export function sanitizeUserIdInput(value: string) {
  return value.trim().replace(/[^A-Za-z0-9]/g, "");
}

export function validateUserId(value: string): {
  ok: boolean;
  sanitized: string;
  message?: string;
} {
  const trimmed = value.trim();
  const sanitized = sanitizeUserIdInput(value);

  if (!trimmed) {
    return { ok: false, sanitized, message: "User ID is required." };
  }

  if (trimmed !== sanitized) {
    return {
      ok: false,
      sanitized,
      message: "User ID must be alphanumeric only (no special characters).",
    };
  }

  if (sanitized.length < 6) {
    return {
      ok: false,
      sanitized,
      message: "User ID must be at least 6 characters long.",
    };
  }

  if (!USER_ID_PATTERN.test(sanitized)) {
    return {
      ok: false,
      sanitized,
      message: "User ID must be alphanumeric only.",
    };
  }

  return { ok: true, sanitized };
}
