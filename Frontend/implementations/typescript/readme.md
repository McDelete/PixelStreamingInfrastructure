## Minimal Pixel Streaming web frontend (TypeScript)

This frontend now builds and serves only the UI-less player page for video streaming and input handling.

### Included
- `uiless.html`
- `uiless.ts`

### Removed from this build
- full UI player page (`player.html` / `player.ts`)
- showcase and stress test pages

### Building
```
cd Frontend/implementations/typescript
npm install
npm run build
```

### Usage
Build output is written to `SignallingWebServer/www`, with `uiless.html` as the default homepage in the signalling server.
