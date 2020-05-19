var CACHE_NAME = "TFjs-HandPoseDemo-PWA";
var urlsToCache = [
    "/matsusato4.github.io/TFjs-HandPoseDemo/",
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache.map(url => new Request(url, {credentials: 'same-origin'})));
            })
    );
});

self.addEventListener('fetch', function(e) {
});