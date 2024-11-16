# LitElement Template

A zero-dependency, zero-build starter repository for lit-element 

## Setup
There are two keyed strings that you will need to find and replace in order to get started. 

`%project-name%` makes the name of your project appear in the package.json, web app manifest, Firebase configuration files, document.title, and boilerplate header

`%firebase-config%` needs to be replaced firebase-app.mjs in order to use Firebase

## File Organization

Files are organized as

```
Type imports
Variable imports

Module Constants

Type definitions

Module implementations
```

Implementations are ordered so that dependent functions are placed below code that calls them in a way that they can be hoisted. An exception is for utility functions that are used throughout the module, especally if they are also exported.

## Contents
This template provides a variety of prepackaged tools

### npm scripts
- `npm install` to install development tools. This project has no build dependencies, so this step is optional
- `npm run start` for easy local server that runs `src/index.html` in SPA mode
- `npm run test` to automatically run Jest and linters
- `npm run lint` to just run the linters
- `npm run deployprod` to deploy to your production Firebase config
- `npm run deploydev` to deploy to your development Firebase config

### Development tools
- Eslint for linting
- Prettier for code formatting
- Typescript for type checking
  - Type definitions for Lit, and Firebase using their npm packages

### Lit
A self-hosted version of `lit-element` 2.7.6. It is the `lit-all` package so directives like `ref` can be used. Be careful not to import from the npm package which is only installed locally for type checking.

### Firebase
A self hosted version of Firebase 9.7.0 for website use and 7.14.6 for use in cloud functions. Be careful not to import from the npm package which is only installed locally for type checking.

### Service Worker
A service worker that will cache files as the user visits them. If you are using static imports (or lazy loading, anything that isn't truly dynamic), it will cache your whole website

### Services
Helper functions for Firebase Auth and Firestore. Read the documentation for more details.

### Global Styles
Some basic CSS resets. Also includes the Material Symbols Sharp font family, available with `.material-symbols`

### Authentication Pages
While not routed, simple signup, login, and forgot password pages are included. They use the Firebase services. Signup and Login support a `redirect` query parameter to send the user to a specific location after authenticating.