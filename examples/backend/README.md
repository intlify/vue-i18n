# Backend integration

This is an example of back-end integration.

The following are examples of two cases:

- i18n JIT compilation
- i18n resource pre-compilation

## About files

- `vite.config.ts`: define the plugin that is simulated as the back-end for development mode
- `db`: simulate the loading of resources from the database
- `scripts/generate.ts`: pre-compile the i18n resources
- `scripts/server.ts`: simulate production server
- `src/locales.ts`: define the i18n resources load function

## How to play

### development

```sh
npm run dev
```

### i18n JIT compilation

```sh
npm run serve   # start server
npm run preview # start preview
```

### i18n resource pre-compilation

```sh
npm run generate # i18n resources pre-compilation 
npm run preview  # start preview
```

> NOTE:
> You need to enable comment out codes on `src/locales.ts`
