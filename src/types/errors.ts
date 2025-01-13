export class LicenseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'LicenseError';
  }
}

export const ErrorCodes = {
  FILE_PARSE_ERROR: 'FILE_PARSE_ERROR',
  INVALID_LICENSE: 'INVALID_LICENSE',
  EXPORT_ERROR: 'EXPORT_ERROR',
} as const;
