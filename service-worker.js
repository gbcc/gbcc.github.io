// Adapted from https://github.com/mozilla/serviceworker-cookbook
// Original license follows:
//
// The MIT License (MIT)
//
// Copyright (c) 2015 Harald Kirschner
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

var CACHE = 'GBCC';

self.addEventListener('install', function(evt) {
	// Ask the service worker to keep installing until the returning
	// promise resolves.
	evt.waitUntil(precache());
});

// On fetch, try network, or fall back to cache
self.addEventListener('fetch', function(evt) {
	// Try network and if it fails, go for the cached copy.
	evt.respondWith(fromNetwork(evt.request, 2000).catch(function () {
		evt.respondWith(fromCache(evt.request));
	}));
});

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
function precache() {
	return caches.open(CACHE).then(function (cache) {
		return cache.addAll([
			'.',
			'index.html',
			'header.svg',
			'icons/favicon-16x16.png',
			'icons/favicon-32x32.png',
			'screenshots/darkwing-thumb.png',
			'screenshots/kirby-android-thumb.png',
			'screenshots/pinball-thumb.png',
			'screenshots/prehistorik-thumb.png',
			'screenshots/shantae-thumb.png',
		]);
	});
}

// Time limited network request. If the network fails or the response is not
// served before timeout, the promise is rejected.
function fromNetwork(request, timeout) {
	return new Promise(function (fulfill, reject) {
		// Reject in case of timeout.
		var timeoutId = setTimeout(reject, timeout);
		// Fulfill in case of success.
		fetch(request).then(function (response) {
			clearTimeout(timeoutId);
			fulfill(response);
			// Reject also if network fetch rejects.
		}, reject);
	});
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
function fromCache(request) {
	return caches.open(CACHE).then(function (cache) {
		return cache.match(request).then(function (matching) {
			return matching || Promise.reject('no-match');
		});
	});
}
