var CACHENAME = "TFjs-HandPoseDemo-PWA";
var urlsToCache = [
    "/matsusato4.github.io/TFjs-HandPoseDemo/",
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open(CACHENAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(e) {
});