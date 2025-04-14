import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrandVariants, createDarkTheme, createLightTheme, FluentProvider, Theme } from "@fluentui/react-components";
import { Auth0Provider } from "@auth0/auth0-react";
import {
  AUTH_REDIRECT_URL,
  THEME_BRAND_COLORS,
  THEME_FONTS,
  THEME_DARK,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  AUTH0_PROVIDER_SCOPE,
  ABOUT_TEXT,
  ANONYMOUS_CODICENT,
  ANONYMOUS_TOKEN,
  API_BASE_URL,
  APP_BUTTONS,
  APP_CHAT_TITLE,
  APP_LOG_CODICENT,
  APP_LOG_TOKEN,
  APP_NAME,
  APP_PREFIX,
  APP_SAVE_TITLE,
  APP_TEMPLATE,
  AUTH0_SCOPE,
  AUTH0_USER_DOMAIN,
  BUTTON_TAG,
  CHAT_BACKGROUND_IMAGE_URL,
  CHAT_INSTRUCTIONS,
  CHAT_WELCOME,
  DEFAULT_LANGUAGE,
  HIDE_CHAT_BUTTON,
  HIDE_MENU_BUTTON,
  HIDE_REGISTER_BUTTON,
  HIDE_SAVE_BUTTON,
  LOGBOOK_TAG_DEFINITIONS,
  LOGBOOK_TAGS,
  MESSAGE_HIDE_BAR,
  MODULE_VOICE,
  REALTIME_VOICE_API_KEY,
  SEND_BUTTON_ROUND_BACKGROUND,
  SHOW_CANVAS_BUTTON,
  SHOW_CHAT_PROMPTS,
  SHOW_HELP_BUTTON,
  SHOW_LOGBOOK_BUTTON,
  SHOW_MICROPHONE_BUTTON,
  SHOW_SETTINGS_BUTTON,
  SHOW_SNAP_BUTTON,
  SHOW_VOICE_BUTTON,
  STRIP_CUSTOMER_PORTAL,
  STRIPE_PRICE_ID,
  STRIPE_PUBLIC_KEY,
  SUBSCRIPTION_NEEDED,
  THEME_WELCOME,
  USER_PREFIX,
  WELCOME_STATUS_PROMPT,
  INDEX_TITLE,
  APP_TITLE,
  APP_ICON_URL,
  APP_HEADER_ICON_URL,
  HOME_BACKGROUND_IMAGE_URL,
  MENU_BACKGROUND_IMAGE_URL,
  COMPOSE_BACKGROUND_IMAGE_URL,
} from "./constants.ts";
// import { indexedDBCache } from "../codicent/utils";

import { initCodicentApp } from "codicent-app-sdk";
import { APP_CONFIG } from "./appconfig.ts";
import ErrorBoundary from "./components/ErrorBoundary";

const theme = JSON.parse(THEME_BRAND_COLORS) as BrandVariants;
const lightTheme: Theme = {
  ...(THEME_DARK ? createDarkTheme(theme) : createLightTheme(theme)),
  fontFamilyBase: THEME_FONTS || "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
};


initCodicentApp({
  // ANONYMOUS_CODICENT,
  // ANONYMOUS_TOKEN,
  // API_BASE_URL,
  // APP_BUTTONS,
  APP_CONFIG: APP_CONFIG,
  // APP_LOG_CODICENT,
  // APP_LOG_TOKEN,
  APP_NAME,
  APP_HEADER_ICON_URL,
  // APP_PREFIX,
  // APP_TEMPLATE,
  // AUTH_REDIRECT_URL,
  // AUTH0_AUDIENCE,
  // AUTH0_CLIENT_ID,
  // AUTH0_DOMAIN,
  // AUTH0_PROVIDER_SCOPE,
  // AUTH0_SCOPE,
  // AUTH0_USER_DOMAIN,
  // // TODO: BUTTON_BACKGROUND_COLOR: BUTTON_BACKGROUND_COLOR || undefined,
  // // TODO: BUTTON_BORDER_RADIUS,
  // BUTTON_TAG,
  // CHAT_INSTRUCTIONS,
  // DEFAULT_LANGUAGE,
  // LOGBOOK_TAGS,
  // STRIPE_PUBLIC_KEY,
  // STRIPE_PRICE_ID,
  // SUBSCRIPTION_NEEDED,
  // USER_PREFIX,
  // WELCOME_STATUS_PROMPT,
  ANONYMOUS_CODICENT,
  ANONYMOUS_TOKEN,
  API_BASE_URL,
  APP_BUTTONS,
  APP_CHAT_TITLE,
  APP_LOG_CODICENT,
  APP_LOG_TOKEN,
  APP_PREFIX,
  APP_TEMPLATE,
  CHAT_BACKGROUND_IMAGE_URL,
  AUTH_REDIRECT_URL,
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  AUTH0_PROVIDER_SCOPE,
  AUTH0_SCOPE,
  AUTH0_USER_DOMAIN,
  // BUTTON_BACKGROUND_COLOR,
  // BUTTON_BORDER_RADIUS,
  BUTTON_TAG,
  // CHAT_BOT_BACKGROUND_COLOR,
  // CHAT_BOT_TEXT_COLOR,
  CHAT_INSTRUCTIONS,
  // CHAT_USER_BACKGROUND_COLOR,
  // CHAT_USER_TEXT_COLOR,
  DEFAULT_LANGUAGE,
  LOGBOOK_TAGS,
  SHOW_CHAT_PROMPTS,
  STRIPE_PUBLIC_KEY,
  STRIPE_PRICE_ID,
  SUBSCRIPTION_NEEDED,
  USER_PREFIX,
  WELCOME_STATUS_PROMPT,
  CHAT_WELCOME,
  REALTIME_VOICE_API_KEY,
  APP_SAVE_TITLE,
  SHOW_LOGBOOK_BUTTON,
  HIDE_MENU_BUTTON,
  HIDE_CHAT_BUTTON,
  HIDE_SAVE_BUTTON,
  SHOW_CANVAS_BUTTON,
  SHOW_SNAP_BUTTON,
  // APP_FOOTER_COLOR,
  // APP_FOOTER_TEXT_COLOR,
  // APP_FOOTER_SELECTED_COLOR,
  // APP_HEADER_COLOR,
  // APP_HEADER_TEXT_COLOR,
  SHOW_MICROPHONE_BUTTON,
  SHOW_VOICE_BUTTON,
  SHOW_SETTINGS_BUTTON,
  // APP_HEADER_ICON_URL,
  APP_ICON_URL,
  APP_TITLE,
  MODULE_VOICE,
  // APP_CHAT_TEXT_PLACEHOLDER,
  SEND_BUTTON_ROUND_BACKGROUND,
  // BUTTON_ACTIVE_COLOR,
  // BUTTON_HOVER_COLOR,
  // BUTTON_TEXT_COLOR,
  COMPOSE_BACKGROUND_IMAGE_URL,
  // COMPOSE_HIDE_LOCATION,
  // COMPOSE_SIMPLE_ATTACH_FILE,
  // APP_SPLASH_TEXT,
  // APP_SPLASH_URL,
  HOME_BACKGROUND_IMAGE_URL,
  // APP_SEARCH_TITLE,
  ABOUT_TEXT,
  MENU_BACKGROUND_IMAGE_URL,
  SHOW_HELP_BUTTON,
  STRIP_CUSTOMER_PORTAL,
  // APP_MENU_TITLE,
  // APP_VERSION,
  INDEX_TITLE,
  HIDE_REGISTER_BUTTON,
  LOGBOOK_TAG_DEFINITIONS,
  // PUBLIC_FLOW_CODICENT,
  MESSAGE_HIDE_BAR,
  THEME_WELCOME,
  // APP_SLOGAN,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: AUTH_REDIRECT_URL,
          audience: AUTH0_AUDIENCE,
          scope: AUTH0_PROVIDER_SCOPE,
          ui_locales: "sv",
        }}
        // onRedirectCallback={onRedirectCallback}
        cacheLocation="localstorage"
        // cache={indexedDBCache}
        useRefreshTokens={true}
      // cacheLocation="memory"
      >
        <FluentProvider theme={/*darkTheme*/ lightTheme /*webLightTheme*/}>
          <App />
        </FluentProvider>
      </Auth0Provider>
    </ErrorBoundary>
  </StrictMode>
);
