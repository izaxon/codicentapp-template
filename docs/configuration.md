# Codicent App Configuration

Documentation for all environment variables used in the application. All variables should be prefixed with `VITE_`.

## Core Application Settings
These settings define the basic application identity and behavior. They are used throughout the application for branding, 
navigation, and core functionality.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_API_BASE_URL | string | Base URL for API endpoints |
| VITE_APP_TEMPLATE | string | Template name for the application |
| VITE_APP_PREFIX | string | Application prefix for namespacing |
| VITE_APP_TITLE | string | Main application title |
| VITE_APP_NAME | string | Application name |
| VITE_APP_SLOGAN | string | Application slogan text |
| VITE_APP_URL | string | Main application URL |
| VITE_APP_SAVE_TITLE | string | Title displayed when saving |
| VITE_DEFAULT_LANGUAGE | string | Default application language |
| VITE_USER_PREFIX | string | Prefix for user-related features |
| VITE_INDEX_TITLE | string | Title for index page |
| VITE_ABOUT_TEXT | string | About section content |
| VITE_WELCOME_STATUS_PROMPT | string | Welcome message prompt |

## Theme & UI Configuration
Controls the visual appearance of the application including colors, fonts, and theme settings. These variables are used 
by the theming system and UI components to maintain consistent styling.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_APP_THEME_NAME | string | Theme name identifier |
| VITE_APP_ICON_URL | string | Application icon URL |
| VITE_APP_HEADER_ICON_URL | string | Header icon URL |
| VITE_APP_SPLASH_URL | string | Splash screen image URL |
| VITE_APP_HEADER_COLOR | string | Header background color |
| VITE_APP_HEADER_TEXT_COLOR | string | Header text color |
| VITE_THEME_BRAND_COLORS | string | Brand color definitions |
| VITE_THEME_FONTS | string | Font definitions |
| VITE_THEME_DARK | boolean | Enable dark theme |
| VITE_HTML_HEAD | string | Custom HTML head content |
| VITE_THEME_WELCOME | string | Welcome screen theme |

## Button Configuration 
Defines the styling and behavior of custom buttons throughout the application. These settings ensure consistent button 
appearance and interaction patterns.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_BUTTON_TAG | string | Custom button element tag |
| VITE_BUTTON_BACKGROUND_COLOR | string | Button background color |
| VITE_BUTTON_TEXT_COLOR | string | Button text color |
| VITE_BUTTON_HOVER_COLOR | string | Button hover color |
| VITE_BUTTON_ACTIVE_COLOR | string | Button active color |
| VITE_APP_BUTTONS | string | Button configurations |

## Feature Toggles
Controls the visibility and availability of various application features. Used to enable/disable functionality without 
code changes.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_SHOW_LOGBOOK_BUTTON | boolean | Show logbook button |
| VITE_HIDE_MENU_BUTTON | boolean | Hide menu button |
| VITE_SHOW_SETTINGS_BUTTON | boolean | Show settings button |
| VITE_HIDE_SAVE_BUTTON | boolean | Hide save button |
| VITE_HIDE_CHAT_BUTTON | boolean | Hide chat button |
| VITE_SHOW_MICROPHONE_BUTTON | boolean | Show microphone button |
| VITE_SHOW_VOICE_BUTTON | boolean | Show voice button |
| VITE_SHOW_CANVAS_BUTTON | boolean | Show canvas button |
| VITE_HIDE_REGISTER_BUTTON | boolean | Hide register button |
| VITE_ENABLE_SLIDE_NAVIGATION | boolean | Enable slide navigation |

## Module Configuration
Enables or disables major application modules. These flags control which functional modules are available to users.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_MODULE_SALES | boolean | Enable sales module |
| VITE_MODULE_SNAP | boolean | Enable snap module |
| VITE_MODULE_VOICE | boolean | Enable voice module |
| VITE_MODULE_FORMS | boolean | Enable forms module |

## Authentication (Auth0)
Configuration for Auth0 integration, defining authentication behavior and security settings. These settings are essential 
for user authentication and authorization.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_AUTH0_SCOPE | string | Auth0 scope |
| VITE_AUTH0_DOMAIN | string | Auth0 domain |
| VITE_AUTH0_CLIENT_ID | string | Auth0 client ID |
| VITE_AUTH0_AUDIENCE | string | Auth0 audience |
| VITE_AUTH0_PROVIDER_SCOPE | string | Auth0 provider scope |
| VITE_AUTH0_USER_DOMAIN | string | Auth0 user domain |
| VITE_REDIRECT_URL | string | Auth redirect URL |

## Payment Integration
Settings for Stripe payment integration. Controls subscription management and payment processing features.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_STRIPE_PUBLIC_KEY | string | Stripe public key |
| VITE_STRIPE_PRICE_ID | string | Stripe price ID |
| VITE_STRIP_CUSTOMER_PORTAL | string | Stripe customer portal URL |
| VITE_SUBSCRIPTION_NEEDED | boolean | Require subscription |

## Chat Configuration
Defines the appearance and behavior of the chat interface. Controls colors and styling for chat messages and interactions.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_CHAT_USER_BACKGROUND_COLOR | string | User message background |
| VITE_CHAT_USER_TEXT_COLOR | string | User message text color |
| VITE_CHAT_BOT_BACKGROUND_COLOR | string | Bot message background |
| VITE_CHAT_BOT_TEXT_COLOR | string | Bot message text color |

## Background Images
URLs for various background images used throughout the application. These images provide visual context for different sections.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_HOME_BACKGROUND_IMAGE_URL | string | Home background image |
| VITE_MENU_BACKGROUND_IMAGE_URL | string | Menu background image |
| VITE_CHAT_BACKGROUND_IMAGE_URL | string | Chat background image |
| VITE_COMPOSE_BACKGROUND_IMAGE_URL | string | Compose background image |

## Logbook Settings
Configuration for the logbook feature including tags, colors, and definitions. Controls how user activities and entries 
are categorized and displayed.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_LOGBOOK_TAGS | string | Available tags |
| VITE_LOGBOOK_COLORS | string | Color definitions |
| VITE_LOGBOOK_TAG_DEFINITIONS | JSON | Tag definitions |

## Voice Features
Settings for voice-related features including API keys and configurations. Controls voice input and processing capabilities.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_REALTIME_VOICE_API_KEY | string | Voice API key |

## System & Debug
System-level configuration and debugging options. These settings are primarily used during development and troubleshooting.
| Variable | Type | Description |
|----------|------|-------------|
| VITE_DEBUG | boolean | Enable debug mode |
| VITE_PUBLIC_FLOW_CODICENT | string | Public flow ID |
| VITE_APP_LOG_CODICENT | string | Log identifier |
| VITE_APP_LOG_TOKEN | string | Log access token |

## Usage Examples

### Theme Configuration Example
```typescript
// Theme settings used in components
import { APP_HEADER_COLOR, THEME_DARK } from '../constants';

const ThemeComponent = () => {
  return <div style={{ backgroundColor: APP_HEADER_COLOR }}>
    {THEME_DARK ? 'Dark Mode' : 'Light Mode'}
  </div>
};
```

### Feature Toggle Example
```typescript
// Feature flags controlling UI elements
import { SHOW_LOGBOOK_BUTTON, HIDE_MENU_BUTTON } from '../constants';

const Navigation = () => {
  return (
    <nav>
      {!HIDE_MENU_BUTTON && <MenuButton />}
      {SHOW_LOGBOOK_BUTTON && <LogbookButton />}
    </nav>
  );
};
```

### Authentication Example
```typescript
// Auth0 configuration usage
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '../constants';

const authConfig = {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  // ...other settings
};
