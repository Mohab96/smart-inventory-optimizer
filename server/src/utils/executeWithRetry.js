async function executeWithRetry(
  fn,
  params = null,
  maxRetries = 5,
  retryDelay = 1000
) {
  for (let retries = 0; retries < maxRetries; retries++) {
    try {
      return fn(...params);
    } catch (error) {
      if (retries === maxRetries - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}

module.exports = executeWithRetry;
