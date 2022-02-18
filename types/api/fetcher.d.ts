declare namespace Fetcher {
  interface FetcherConfig {
    url: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    data?: any;
    config?: any;
  }
}
