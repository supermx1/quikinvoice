module.exports = {
  globDirectory: 'www/',
  globPatterns: ['**/*.{woff,woff2,js,css,png,jpg,svg,html}'],
  /* pass array of globs to exclude from caching */
  globIgnores: [],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: 'www/service-worker.js',
  // stale while revalidate strategy for all files
  runtimeCaching: [{
    urlPattern: /./,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'runtime-cache',
      expiration: {
        maxEntries: 1,
        maxAgeSeconds: 1
      }
    }
  }],
};
