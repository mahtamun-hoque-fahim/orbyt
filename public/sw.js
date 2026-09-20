self.addEventListener('push', function (event) {
  const text = event.data ? event.data.text() : 'Time to check off a topic.'

  event.waitUntil(
    self.registration.showNotification('Orbyt', {
      body: text,
      icon: '/icon.png',
      badge: '/icon.png',
      tag: 'orbyt-reminder',
      renotify: true,
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        for (const client of clientList) {
          if (client.url.includes('/dashboard') && 'focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/dashboard')
        }
      })
  )
})
