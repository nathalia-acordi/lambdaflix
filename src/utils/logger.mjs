export function log(message, meta = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message,
    ...meta
  };
  console.log(JSON.stringify(logEntry));
}
