const getTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message: string, data?: unknown) => {
    console.log(`[${getTimestamp()}] INFO: ${message}`, data ?? "");
  },
  error: (message: string, error?: unknown) => {
    console.error(`[${getTimestamp()}] ERROR: ${message}`, error ?? "");
  },
  warn: (message: string, data?: unknown) => {
    console.warn(`[${getTimestamp()}] WARN: ${message}`, data ?? "");
  },
  request: (method: string, path: string, status: number, duration: number) => {
    console.log(`[${getTimestamp()}] ${method} ${path} ${status} - ${duration}ms`);
  },
};
