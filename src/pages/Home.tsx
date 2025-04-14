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

import React, { useEffect, useState } from "react";
import { makeStyles, shorthands, Image } from "@fluentui/react-components";
import {
  Content,
  Title,
  Button,
  Spinner,
  Text,
  UrlProcessor,
  Page,
  AudioRecorder,
  CodicentAppState,
  RealtimeVoice,
  useCodicentState,
  useLocalization,
  useStateWithLocalStorage,
} from "codicent-app-sdk";
import { Link } from "react-router-dom";
import { APP_CONFIG } from "../appconfig";
import {
  BUTTON_BACKGROUND_COLOR,
  BUTTON_TEXT_COLOR,
  BUTTON_HOVER_COLOR,
  BUTTON_ACTIVE_COLOR,
  APP_BUTTONS,
  APP_NAME,
  HOME_BACKGROUND_IMAGE_URL,
  INDEX_TITLE,
  THEME_WELCOME,
  APP_SLOGAN,
} from "../constants";

const useStyles = makeStyles({
  main: {
    flexGrow: 1,
    ...shorthands.padding("10px"),
    overflowY: "auto",
    touchAction: "pan-y",
  },
  root: {
    height: "100%",
    backgroundPosition: "calc(50%) center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    touchAction: "pan-y",
    pointerEvents: "none", // Add this to let events pass through
  },
  item: {
    height: "auto",
    width: "auto",
    flexShrink: 1,
  },
  menuButton: {
    width: "16rem",
    border: "none",
    "&.selected": {
      border: "none",
    },
    minWidth: "15rem",
    backgroundColor: BUTTON_BACKGROUND_COLOR || undefined,
    color: BUTTON_TEXT_COLOR || undefined,
    ...shorthands.border("none"),
    "&:hover": {
      color: BUTTON_TEXT_COLOR || undefined,
      backgroundColor: BUTTON_HOVER_COLOR || undefined,
    },
    "&:active": {
      color: BUTTON_TEXT_COLOR || undefined,
      backgroundColor: BUTTON_ACTIVE_COLOR || undefined,
    },
    "&selected": {
      color: BUTTON_TEXT_COLOR || undefined,
      backgroundColor: BUTTON_ACTIVE_COLOR || undefined,
    },
    padding: "1.2rem 1rem",
  },
  buttonsList: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    ...shorthands.padding("10px"),
    paddingTop: "30px",
    pointerEvents: "auto", // Ensure buttons are clickable
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  welcomeInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
    textAlign: "center",
    maxWidth: "20rem",
    pointerEvents: "auto", // Ensure text is selectable if needed
  },
  scrollableContent: {
    overflowY: "auto",
  },
});

export const Home: React.FC<{ state: CodicentAppState; audio: AudioRecorder; voice?: RealtimeVoice }> = ({
  state,
  audio,
  voice,
}) => {
  const { selectedApp, nickname, apps, name } = state.context;
  const { service, error, stateMachine, currentStateName } = state;

  const styles = useStyles();
  const [, setAppTheme] = useStateWithLocalStorage<MessageData | null>("app-theme_" + selectedApp, null);
  const [appButtons, setAppButtons] = useStateWithLocalStorage<MessageData[]>("app-buttons_" + selectedApp, []);
  const [requestSent, setRequestSent] = useState(false);
  // const { appState, createApp, selectedApp, apps, error, selectApp, codicentService, name, nickname, username } = state;
  const { updating, welcomeStatusText } = useCodicentState(stateMachine);
  const { t } = useLocalization();
  // const now = new Date();
  // const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
  //   now.getDate()
  // ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  useEffect(() => {
    if (selectedApp) {
      //   // codicentService.codicent = selectedApp;
      //   service.getAppTheme().then(setAppTheme);
      if (APP_BUTTONS) {
        try {
          const appConfig = APP_CONFIG;
          const appButtonsId = APP_BUTTONS;
          if (appButtonsId && appConfig.apps[appButtonsId]) {
            const buttons = appConfig.apps[appButtonsId].buttons as { title: string; url: string }[];
            buttons.sort((a, b) => a.title.localeCompare(b.title));
            setAppButtons(buttons);
          } else {
            console.warn(`App buttons configuration not found for: ${appButtonsId}`);
            service.getAppButtons().then(setAppButtons).catch(console.warn);
          }
        } catch (e) {
          alert("Failed to parse APP_BUTTONS: " + e);
          console.error(e);
        }
      } else {
        service.getAppButtons().then(setAppButtons).catch(console.warn);
      }
    }
  }, [service, setAppButtons, selectedApp, setAppTheme]);

  const sendRequest = async () => {
    setRequestSent(true);
    if (!APP_NAME) {
      console.error("APP_NAME not defined.");
      alert("APP_NAME not defined.");
      setRequestSent(false);
      return;
    }

    const ok = await service.requestInvite(nickname!, APP_NAME!);
    if (ok) {
      alert(t("Begäran skickad! Du får åtkomst när ägaren godkänner."));
    } else {
      setRequestSent(false);
      alert(t("Misslyckades att skicka begäran. Försök igen senare."));
    }
    console.log(`send_request: ${nickname}, ${APP_NAME}`);
  };

  const checkRequest = () => {
    window.location.href = "./";
    console.log(`check_request: ${nickname}, ${selectedApp}`);
  };

  const hideHeader = !selectedApp || currentStateName !== "hasAccess";
  const hideFooter = !selectedApp || currentStateName !== "hasAccess";

  const showButtons = selectedApp && currentStateName === "hasAccess";
  const showAppSelection = !selectedApp && currentStateName === "hasAccess" && apps!.length > 1;
  const showCreateApp = !error && !selectedApp && !APP_NAME;
  const showRequestAccess = currentStateName === "noAccess" && (apps!.length === 1 || APP_NAME);
  const showWelcome = selectedApp && currentStateName === "hasAccess";

  return (
    <Page hideHeader={hideHeader} hideFooter={hideFooter} audio={audio} voice={voice}>
      <div className={styles.root} style={{ backgroundImage: `url(${HOME_BACKGROUND_IMAGE_URL})` }}>
        <div className={styles.item}>
          <div className={styles.item}>
            <div className={styles.buttonsList}>
              {showAppSelection && (
                <>
                  <Title>{t("Välkommen, vart vill du gå?")}</Title>
                  {apps!.map((app, i) => (
                    <div key={"codicent_button_" + i}>
                      <Button
                        size="large"
                        appearance="primary"
                        className={styles.menuButton}
                        onClick={() => {
                          stateMachine.setSelectedApp(app.id); // TODO: is this enough?
                          // state.updateContext({ selectedApp: app.id });
                          // selectApp(app.id);
                          console.log(`select_app: ${app.id}`);
                        }}
                      >
                        <div className={styles.buttonContent}>
                          {app.logo && <Image src={app.logo} height={24} />}
                          {app.title || app.id}
                        </div>
                      </Button>
                    </div>
                  ))}
                </>
              )}
              {showCreateApp && (
                <>
                  <Title>{t("Skapa ny?")}</Title>
                  <Text size={400}>{t("Här går du vidare för att skapa din egna privata digitala assistent.")}</Text>
                  <Button
                    size="large"
                    appearance="primary"
                    className={styles.menuButton}
                    onClick={() => {
                      stateMachine.update();
                      console.log(`create_app: requested`);
                    }}
                  >
                    {t("Kör!")}
                  </Button>
                </>
              )}
              {showRequestAccess && (
                <div>
                  <Content>
                    <Title>{`${t("Välkommen till")} ${INDEX_TITLE}`}</Title>
                    {!requestSent && (
                      <Text size={400}>{t("Du är inte medlem än. Skicka begäran för att komma in!")}</Text>
                    )}
                    {/* <pre>{JSON.stringify({ name, nickname, username })}</pre> */}
                    {!requestSent && (
                      <Button size="large" appearance="primary" onClick={sendRequest}>
                        {t("Skicka begäran")}
                      </Button>
                    )}
                    {!requestSent && (
                      <Text size={300}>
                        {t("Har du redan ett abonnemang? Då kanske har du loggat in med fel konto.")}{" "}
                        <Link to="/logout">{t("Logga ut")}</Link> {t("och sedan in igen för att komma igång.")}
                      </Text>
                    )}
                    {requestSent && <Text size={400}>{t("Begäran skickad till ägaren.")}</Text>}
                    {requestSent && (
                      <Button size="large" onClick={checkRequest}>
                        {t("Kontrollera åtkomst")}
                      </Button>
                    )}
                  </Content>
                </div>
              )}
              {showWelcome && (
                <div className={styles.welcomeInfo}>
                  <Text weight="semibold" size={500} align="center">
                    {THEME_WELCOME ? THEME_WELCOME!.replace("{{username}}", name || nickname || "") : t("Välkommen")}
                  </Text>
                  {APP_SLOGAN && (
                    <Text weight="semibold" italic size={400} align="center">
                      {APP_SLOGAN}
                    </Text>
                  )}
                  {updating && <Spinner />}
                  {!updating && welcomeStatusText && (
                    <Text size={400} align="center">
                      {welcomeStatusText}
                    </Text>
                  )}
                </div>
              )}
              {showButtons &&
                appButtons.map((button, i) => {
                  return (
                    <div key={"button_" + i}>
                      <UrlProcessor service={service}>
                        {(processUrl) => (
                          <Button
                            size="large"
                            appearance="primary"
                            className={styles.menuButton}
                            onClick={() => {
                              console.log(button.title);
                              if (button.url.startsWith("voice:")) {
                                const instr = button.url.replace("voice:", "").trim();
                                if (instr !== "") {
                                  voice?.updateInstructions(instr);
                                } else {
                                  if (!APP_BUTTONS) {
                                    console.error("APP_BUTTONS not defined.");
                                    return;
                                  }

                                  const appConfig = APP_CONFIG;
                                  const appButtonsId = APP_BUTTONS;

                                  if (appButtonsId && appConfig.apps[appButtonsId]) {
                                    // Access the voiceInstructions directly from the app configuration
                                    voice?.updateInstructions(appConfig.apps[appButtonsId].voiceInstructions || "");
                                  } else {
                                    console.error(`Voice instructions not found for app: ${appButtonsId}`);
                                  }
                                }
                                voice?.connectConversation();
                              } else {
                                processUrl(button.url);
                              }
                            }}
                          >
                            {t(button.title)}
                          </Button>
                        )}
                      </UrlProcessor>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </Page>
  );
};

export default Home;
