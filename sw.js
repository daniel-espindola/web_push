/* IMPORTANT:
 Update version every time a new version of the application is deployed
 */
assetCacheName = "v0.0.0";

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(assetCacheName).then(function (cache) {
            return cache.addAll([
            ]);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== assetCacheName) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});

self.addEventListener('push', function (e) {
    var data = e.data.json();
    var options = {
        body: data.Body,
        icon: data.Image,
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            link: data.Link,
        }
    };
    e.waitUntil(
        self.registration.showNotification(data.Title, options)
    );
});

self.addEventListener('notificationclick', function (e) {
    var notification = e.notification;
    var action = e.action;
    var data = notification.data;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow(data.link);
        notification.close();
    }
});