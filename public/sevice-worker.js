
// Create cache
const CACHE_NAME = 'budget-tracker-cache-v1';
const DATA_CACHE_NAME = 'budget-tracker-data-cache-v1';
// Provide files to cache
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/js/index.js',
  '/js/idb.js',
  '/manifest.json',
];
// Install the service worker
self.addEventListener('install', function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Your files were pre-cached successfully!');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // needs this to activate
  self.skipWaiting();
});
self.addEventListener("install", function(event) {

    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
    );
  });
  
  self.addEventListener("fetch", function(event) {

    if (event.request.url.includes("/api/")) {
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request)
            .then(response => {
           
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {

              return cache.match(event.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }
  
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request).then(function(response) {
          if (response) {
            return response;
          } else if (event.request.headers.get("accept").includes("text/html")) {
            
            return caches.match("/");
          }
        });
      })
    );
  });
  
  