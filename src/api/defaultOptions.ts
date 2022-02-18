export const defaultOptions = {
  fetcher() {
    return Promise.reject('fetcher is required');
  },
};
