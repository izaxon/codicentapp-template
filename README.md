# Codicent App Template

This template provides a foundation for developing Codicent applications using the Codicent App SDK. Built with React, TypeScript, and Vite, it includes all the necessary configurations and components to get started quickly.

## Features

- **Codicent App SDK Integration**: Ready to use with the Codicent ecosystem
- **React 18+**: Modern React with hooks and functional components
- **TypeScript**: Type safety for improved developer experience
- **Vite**: Fast development server and optimized builds
- **FluentUI Components**: Microsoft's design system for consistent UI
- **Internationalization**: Support for multiple languages (EN, SV, DE)
- **QR Scanner**: Built-in QR code scanning functionality
- **Authentication**: Auth0 integration ready

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone this repository
   ```bash
   git clone https://github.com/izaxon/codicent-app.git
   cd codicent-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```
   
3. Start the development server
   ```bash
   npm run dev
   ```

### Build

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Available Scripts

- `npm run dev` - Start development server
- `npm run devsub` - Start development server with base path `/codicent/`
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run localize` - Update localization files

## Project Structure

```
codicentapp-template/
├── config/               # App-specific configurations
├── docs/                 # Documentation
├── public/               # Static assets
│   └── images/           # Image resources
├── src/
│   ├── assets/           # Application assets
│   ├── components/       # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Application pages
│   └── types/            # TypeScript type definitions
└── translations/         # Internationalization files
```

## Extending the ESLint Configuration

If you need to update the ESLint configuration for your project:

```js
// eslint.config.js
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'

export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // Enable recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
    // Add your custom rules here
  },
})
```

## Debugging

### Mobile Debugging

To test on mobile devices:

1. Install BrowserSync
   ```bash
   npm install -g browser-sync
   ```

2. Run BrowserSync to proxy the development server
   ```bash
   browser-sync start --proxy "http://localhost:5173" --files "./**/*"
   ```

3. Access from your mobile device using the provided IP address (e.g. `http://192.168.1.55:3001/`)

4. Use browser developer tools to check console output

## Codicent App SDK

This template uses the [Codicent App SDK](https://github.com/izaxon/codicent-app-sdk) for integration with the Codicent platform. The SDK provides:

- Authentication and authorization
- State management
- API communication
- UI components
- Utility functions

Refer to the SDK documentation for more details on available features and how to use them in your application.

## License

[Include appropriate license information here]



