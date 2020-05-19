importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js')

workbox.precaching.precacheAndRoute([
  {
    url: '/index.html',
    revision: '10000'
  },
  {
    url: '/index.js',
    revision: '10000'
  },
])