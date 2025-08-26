# SilentiumChat Client

🚧 **Work in Progress** 🚧

SilentiumChat Client is the front-end application for **SilentiumChat**, a secure messaging app with **end-to-end encryption (E2EE)**.  
All messages are encrypted on the client side — the server only relays encrypted data and never has access to your messages or private keys.

## Features (planned)

- Client-side encryption and decryption
- Minimal interface for sending/receiving messages
- Key management and identity handling
- Future: group chats, attachments, notifications, etc.

## Status

> [!CAUTION]
> This project is still under active development.  
> Expect frequent updates, changes, and new features.

## Configuration

> [!WARNING]
> Before running the project, you need to configure the backend and WebSocket URLs in the API store:  

```javascript
// ./stores/api.js
state: () => ({
    urls: {
        backend: 'http://your-backend-url:PORT',
        ws: 'http://your-backend-url:PORT',
    }
})
```

## Contributing

Ideas, feedback, and contributions are welcome!  
Please refer to the [Server repository](https://github.com/ton-user/SilentiumChat-Server) for the backend component.