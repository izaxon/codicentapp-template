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

import { makeStyles, Image } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Markdown,
  Profile,
  TextHeader,
  Page,
  CodicentAppState,
  useAppStyles,
  useLocalization,
} from "codicent-app-sdk";
import {
  ABOUT_TEXT,
  APP_MENU_TITLE,
  APP_NAME,
  APP_VERSION,
  MENU_BACKGROUND_IMAGE_URL,
  SHOW_HELP_BUTTON,
  SHOW_LOGBOOK_BUTTON,
  STRIP_CUSTOMER_PORTAL,
} from "../constants";

const useStyles = makeStyles({
  container: {
    // backgroundImage: "url('" + MENU_BACKGROUND_IMAGE_URL + "')",
    // backgroundPosition: "calc(50% - 100px) center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    height: "100%",
    touchAction: "pan-y", // Added to enable horizontal swipe detection
    margin: "0 auto",
    maxWidth: "800px",
  },
  menu_items: {
    overflowY: "auto",
    height: "calc(100vh - 130px)",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  // sectionTitle: {
  //   fontSize: "20px",
  //   fontWeight: "600",
  //   marginBottom: "16px",
  //   marginTop: "24px",
  // },
  divider: {
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "32px",
    marginBottom: "20px",
  },
  button: {
    // fontSize: "1rem",
    // padding: "1.2rem 1rem",
  },
  appButton: {
    margin: "2px",
  },
});

export const Menu: React.FC<{ state: CodicentAppState }> = ({ state }) => {
  const navigate = useNavigate();
  const appStyles = useAppStyles();
  const styles = useStyles();
  const { auth } = state;
  const { t } = useLocalization();

  const logout = () => {
    auth.logout();
    state.stateMachine.logout();
    console.log("menu-logout");
  };

  return (
    <Page hideHeader>
      <div className={styles.container} style={{ backgroundImage: `url(${MENU_BACKGROUND_IMAGE_URL})` }}>
        <TextHeader title={APP_MENU_TITLE ? t(APP_MENU_TITLE!) : t("Meny")} />
        {/* <Content> */}
        <div className={styles.menu_items}>
          {/* <Divider className={styles.divider}>{t("Ditt konto")}</Divider> */}
          <Profile state={state} />
          <hr />
          <Button
            icon="ChevronRightFilled"
            size="large"
            className={appStyles.menuButton}
            onClick={logout}
            iconPosition="after"
            appearance="transparent"
          >
            {t("Logga ut")}
          </Button>
          {STRIP_CUSTOMER_PORTAL && (
            <Button
              icon="Payment24Regular"
              size="large"
              className={appStyles.menuButton}
              onClick={() => (window.location.href = STRIP_CUSTOMER_PORTAL)}
              iconPosition="after"
              appearance="transparent"
            >
              {t("Abonnemang")}
            </Button>
          )}
          {!APP_NAME && state.context.apps!.length > 1 && (
            <>
              <h3>{t("Mina codicents")}</h3>
              {state.context.apps!.map((a) => (
                <Button
                  className={styles.appButton}
                  key={a.id}
                  image={a.logo ? <Image src={a.logo} height="24px" /> : undefined}
                  onClick={() => state.stateMachine.setSelectedApp(a.id)}
                  title={a.title || a.id}
                >
                  {a.title || a.id}
                </Button>
              ))}
            </>
          )}
          {/* {!SHOW_LOGBOOK_BUTTON && <Divider className={styles.divider}>{t("Data")}</Divider>} */}
          {SHOW_LOGBOOK_BUTTON && (
            <>
              <hr />
              <Button
                className={appStyles.menuButton}
                icon="ChevronRightFilled"
                size="large"
                appearance="subtle"
                iconPosition="after"
                onClick={() => {
                  navigate("/log");
                  console.log("menu-log");
                }}
              >
                {t("Loggboken")}
              </Button>
            </>
          )}
          <hr />
          {/* <Divider className={styles.divider}>{t("Övrigt")}</Divider> */}
          <Markdown
            content={ABOUT_TEXT.replace(
              "{{version}}",
              (() => {
                const now = new Date();
                const date = now.toISOString().split("T")[0]; // yyyy-MM-dd
                const hour = now.getHours().toString().padStart(2, "0"); // HH with leading zero
                const version = APP_VERSION || `v${date}.${hour}`;
                return version;
              })()
            )}
          />
          {SHOW_HELP_BUTTON && (
            <>
              <h3>{t("Behöver du hjälp?")}</h3>
              <Button
                icon="QuestionCircle24Regular"
                className={appStyles.button}
                size="large"
                appearance="subtle"
                onClick={() => {
                  navigate("/help");
                  console.log("menu-help");
                }}
              >
                {t("Visa hjälp")}
              </Button>
            </>
          )}
        </div>
      </div>
    </Page>
  );
};

export default Menu;
