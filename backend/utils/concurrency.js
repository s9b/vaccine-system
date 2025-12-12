const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetries = async (fn, maxRetries = 3, initialDelay = 50, maxDelay = 200) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'SQLITE_BUSY' || error.code === 'SQLITE_LOCKED') {
        retries++;
        if (retries >= maxRetries) {
          throw error;
        }
        const delayMs = Math.floor(Math.random() * (maxDelay - initialDelay + 1) + initialDelay);
        await delay(delayMs);
      } else {
        throw error;
      }
    }
  }
};

module.exports = { withRetries };
