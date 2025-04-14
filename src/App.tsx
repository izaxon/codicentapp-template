// Copyright (c) Codicent Inside AB. All rights reserved.
// This software and its associated documentation files (the "Software") are
// proprietary to Codicent Inside AB. Unauthorized copying of this file, via any
// medium is strictly prohibited. The Software is provided "AS IS", without
// warranty of any kind, express or implied, including but not limited to the
// warranties of merchantability, fitness for a particular purpose, and
// noninfringement. In no event shall the authors or copyright holders be liable
// for any claim, damages, or other liability, whether in an action of contract,
// tort, or otherwise, arising from, out of, or in connection with the Software
// or the use or other dealings in the Software.

import { HashRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import mermaid from "mermaid";
// import { useToaster } from "./hooks";
// import { Button } from "../codicent/components";
import { makeStyles, MessageBar, MessageBarActions, MessageBarBody, MessageBarTitle } from "@fluentui/react-components";
import {
  APP_NAME,
  APP_URL,
  MODULE_FORMS,
  MODULE_QR,
  MODULE_SALES,
  MODULE_SEARCH,
  MODULE_SNAP,
  MODULE_VOICE,
  REDIRECT_URL,
} from "./constants";
import {
  Button,
  useToaster,
  useLocalization,
  useCodicentApp,
  AppFrame,
  Login,
  ImageView,
  CrmPage,
  Sales,
  FormInvite,
  Snap,
  Logout,
  Search,
  FormAccept,
} from "codicent-app-sdk";
import Debug from "./pages/Debug";
import { useAuth0 } from "@auth0/auth0-react";

// Lazy load components
const Menu = lazy(() => import("./pages/Menu"));
const Home = lazy(() => import("./pages/Home"));
const Log = lazy(() => import("./pages/Log"));
const Chat = lazy(() => import("./pages/Chat"));
const Splash = lazy(() => import("./pages/Splash"));
const Compose = lazy(() => import("./pages/Compose"));
const Canvas = lazy(() => import("./pages/Canvas"));
const QrScan = lazy(() => import("./pages/QrScan"));

const useStyles = makeStyles({
  error: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  container: {
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    position: "relative",
    touchAction: "pan-y", // Added to enable horizontal swipe detection
  },
});

// Add custom event type
interface LogEvent extends CustomEvent {
  detail: { message: string };
}

const App = () => {
  const auth0 = useAuth0();
  const appState = useCodicentApp({ auth0 });
  const {
    audio,
    service,
    state,
    nickname,
    error,
    errorType,
    fixAppUrl,
    isBusy,
    setAnonymous,
    html,
    setHtml,
    voice,
    script,
  } = appState;

  const { ToasterComponent } = useToaster();
  const { t } = useLocalization();
  const styles = useStyles();

  useEffect(() => {
    if (html && MODULE_VOICE) {
      // if current route is not /canvas, navigate to /canvas
      window.location.hash = "#/canvas";
    }
  }, [html]);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
    const handleLogEvent = (e: LogEvent) => {
      service
        .logAction(e.detail.message, nickname || "unknown")
        .then(() => {})
        .catch(console.warn);
    };
    window.addEventListener("log-event", handleLogEvent as EventListener);
    return () => {
      window.removeEventListener("log-event", handleLogEvent as EventListener);
    };
  }, [service, nickname]);

  useEffect(() => {
    if (state !== "needsPurchase" && window.location.hash.startsWith("#/purchase")) {
      window.location.replace("#/");
    }
  }, [state]);

  useEffect(() => {
    const allowAnonymous =
      window.location.hash.startsWith("#/formaccept") || window.location.hash.startsWith("#/search");
    if (allowAnonymous) {
      setAnonymous(true);
      // sm.current.updateContext({ isAnonymous: true });
    }
  }, []);

  if (REDIRECT_URL && state === "hasAccess") {
    window.location.href = fixAppUrl(REDIRECT_URL);
    return null; // Prevent rendering the rest of the app
  }

  const allowAnonymous = window.location.hash.startsWith("#/formaccept") || window.location.hash.startsWith("#/search");
  return (
    <HashRouter>
      {state === "error" && <Splash state={appState} />}
      {isBusy() && <Splash state={appState} />}
      {(state === "error" || state === "registered" || state === "authenticating") && <Splash state={appState} />}
      {state === "notAuthenticated" && !allowAnonymous && <Login state={appState} />}
      <div className={styles.container}>
        <ToasterComponent />
        {error && (
          <div className={styles.error}>
            <MessageBar intent="error">
              <MessageBarBody>
                <MessageBarTitle>{errorType}</MessageBarTitle>
                {error}
              </MessageBarBody>
              <MessageBarActions containerAction={<Button appearance="transparent" icon="DismissRegular" />}>
                <Button
                  onClick={() => {
                    window.location.href = "./";
                  }}
                >
                  Starta om
                </Button>
              </MessageBarActions>
            </MessageBar>
          </div>
        )}
        <Suspense fallback={<>{t("Laddar...")}</>}>
          <Routes>
            {MODULE_FORMS && <Route path="/formaccept" element={<FormAccept />} />}
            {MODULE_FORMS && <Route path="/chat" element={<Chat state={appState} />} />}
            {MODULE_SEARCH && <Route path="/search" element={<Search state={appState} />} />}
            <Route path="/debug" element={<Debug />} />
            <Route
              path="/"
              element={
                (state === "hasAccess" || state === "noAccess") &&
                (APP_URL ? (
                  <AppFrame src={fixAppUrl(APP_URL)} title={APP_NAME} />
                ) : (
                  <Home state={appState} audio={audio} voice={voice} />
                ))
              }
            />
            {state === "hasAccess" && (
              <>
                <Route path="/menu" element={<Menu state={appState} />} />
                <Route path="/log" element={<Log state={appState} />} />
                <Route path="/chat" element={<Chat state={appState} />} />
                <Route path="/new" element={<Compose state={appState} />} />
                <Route
                  path="/canvas"
                  element={<Canvas html={html} onHtmlChange={setHtml} voice={voice} script={script} />}
                />
                {/* <Route path="/help" element={<Help />} /> */}
                {MODULE_SALES && <Route path="/sales" element={<Sales state={appState} />} />}
                {MODULE_SNAP && <Route path="/snap" element={<Snap state={appState} audio={audio} />} />}
                {MODULE_FORMS && <Route path="/forminvite" element={<FormInvite state={appState} />} />}
                {MODULE_SALES && <Route path="/crm" element={<CrmPage state={appState} />} />}
                {MODULE_QR && <Route path="/qr" element={<QrScan state={appState} />} />}
                <Route path="/image" element={<ImageView state={appState} />} />
                <Route
                  path="/app/*"
                  element={
                    <AppFrame
                      title={APP_NAME}
                      src={fixAppUrl(`./app${window.location.hash.replace(/^#\/app/, "")}${window.location.search}`)}
                      showFooter
                      scrollable
                    />
                  }
                />
              </>
            )}
            <Route path="/logout" element={<Logout state={appState} />} />
            {/* {state === "needsPurchase" && <Route path="/purchase" element={<Purchase state={sm.current} />} />} */}
          </Routes>
        </Suspense>
      </div>
    </HashRouter>
  );
};

export default App;
