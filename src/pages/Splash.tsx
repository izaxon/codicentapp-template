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
import { CodicentAppState, useLocalization, Button, Spinner } from "codicent-app-sdk";
import { HOME_BACKGROUND_IMAGE_URL, APP_SPLASH_URL, APP_SPLASH_TEXT, APP_TITLE } from "../constants";

const useStyles = makeStyles({
  container: {
    height: "100vh",
    width: "100vw",
    position: "fixed",
    top: 0,
    left: 0,
    overflow: "hidden",
    // backgroundImage: "url('" + HOME_BACKGROUND_IMAGE_URL + "')",
    backgroundPosition: "calc(50% - 100px) center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  spinner: {
    display: "flex",
    flexDirection: "column",
    // TODO: center in middle
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    "& img": {
      maxWidth: "140px",
      maxHeight: "140px",
      width: "auto",
      height: "auto",
    },
  },
  splashText: {
    whiteSpace: "pre",
    // center text
    textAlign: "center",
    marginTop: "16px",
  },
});

const Splash = ({ state }: { state: CodicentAppState }) => {
  const styles = useStyles();
  const { error } = state.context;
  const { t } = useLocalization();
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${HOME_BACKGROUND_IMAGE_URL})` }}>
      {APP_SPLASH_URL && (
        <div className={styles.imageContainer}>
          <Image
            width="140px"
            height="140px"
            fit="contain"
            alt="splash"
            src={APP_SPLASH_URL}
            style={{ objectPosition: "center" }}
          />
          <h3 className={styles.splashText}>{APP_SPLASH_TEXT && t(APP_SPLASH_TEXT!)}</h3>
        </div>
      )}
      {!APP_SPLASH_URL && (
        <div className={styles.spinner}>
          <Spinner size="large" />
          <h3>
            {APP_SPLASH_TEXT && t(APP_SPLASH_TEXT!)}
            {!APP_SPLASH_TEXT && (
              <>
                {t(`Väcker`)}
                {` ${APP_TITLE} ...`}
              </>
            )}
          </h3>
          {error && <p>{t("...svårt att vakna idag!")}</p>}
        </div>
      )}
      {error && (
        <div>
          <p>{t(`Ett fel har uppstått: ${error}`)}</p>
          <Button onClick={() => window.location.reload()}>{t("Ladda om appen")}</Button>
          <Button onClick={() => state.stateMachine.updateContext({ error: null })}>{t("Försök igen")}</Button>
        </div>
      )}
    </div>
  );
};

export default Splash;
