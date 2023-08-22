var GOOGLE_FONT_URL = 'https://fonts.gstatic.com';
var CACHE_STATIC_NAME = 'pwanote-static_v3';
var CACHE_DYNAMIC_NAME = 'pwanote-dynamic_v3';
var STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/js/main.js',
    '/assets/css/style.css',
    '/manifest.json',
    '/images/image.png',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
];


self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function (cache) {
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(function (e) {
            })
    );

});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(
                keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        return caches.delete(key);
                    }
                }));
        }));
    return self.clients.claim();
});


self.addEventListener('fetch', function(event) {
    // event.respondWith(
    //     caches.match(event.request).then(function(response) {
    //         return response || fetch(event.request);
    //     })
    // );
});


var payload;
self.addEventListener('push', function (event) {
    payload = event.data ? event.data.text() : 'No Data';
    var options = {
        body: 'برای نمایش محتوای پیام کلیک کنید!',
        dir: 'rtl',
        lang: 'fa-IR',
        icon: 'images/newRequest-icon.png',
        image: 'images/newRequest-image.png',
        badge: 'images/newRequest.png',
        // vibrate: [100, 50, 200],
    };
    var text = '';
    if (payload.split("-")[2] === "0") {
        text = `درخواست جدیدی توسط ${payload.split("-")[0]} ثبت شد!`;
    } else if (payload.split("-")[2] === "2") {
        text = `درخواست شما توسط ${payload.split("-")[0]} باطل شد!`;
    } else if (payload.split("-")[2] === "4" || payload.split("-")[2] === "10" || payload.split("-")[2] === "5") {
        text = `درخواست جدیدی توسط ${payload.split("-")[0]} ارسال شد!`;
    } else if (payload.split("-")[2] === "11") {
        text = `کاربر ${payload.split("-")[0]} در اتوماسیون ثبت نام کرد!`;
    }
    event.waitUntil(
        self.registration.showNotification(text, options)
    )
})
addEventListener('notificationclick', event => {
    event.waitUntil(async function () {
        const allClients = await clients.matchAll({
            includeUncontrolled: true
        });
        let reqClient;
        // Let's see if we already have a chat window open:
        for (const client of allClients) {
            const url = new URL(client.url);
            if (payload.split("-")[2] !== "11") {
                if (url.pathname == `/Request/${payload.split("-")[1]}`) {
                    // Excellent, let's use it!
                    client.focus();
                    reqClient = client;
                    break;
                }
            } else {
                if (url.pathname == `/UsersInfo`) {
                    // Excellent, let's use it!
                    client.focus();
                    reqClient = client;
                    break;
                }
            }
        }
        // If we didn't find an existing chat window,
        // open a new one:
        if (!reqClient) {
            if (payload.split("-")[2] !== "11") {
                reqClient = await clients.openWindow(`/Request/${payload.split("-")[1]}`);
            } else {
                reqClient = await clients.openWindow(`/UsersInfo`);
            }
        }
        // Message the client:
        reqClient.postMessage("New request messages!");
    }());
});