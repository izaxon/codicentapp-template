import { useState, useCallback, useMemo } from "react";
import { FC } from "react";
import {
   Button,
   makeStyles,
   MessageBar,
   MessageBarActions,
   MessageBarBody,
   MessageBarTitle,
} from "@fluentui/react-components";
import { HOME_BACKGROUND_IMAGE_URL } from "../constants";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CodicentAppState, Page, TextHeader, useLocalization } from "codicent-app-sdk";
import QrScanner from "../components/QrScanner";

const useStyles = makeStyles({
   container: {
      backgroundImage: "url('" + HOME_BACKGROUND_IMAGE_URL + "')",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      height: "100%",
      touchAction: "pan-y",
      margin: "0 auto",
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
   },
   flashOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "transparent",
      transition: "background-color 0.2s ease-out",
      pointerEvents: "none",
      zIndex: 3,
   },
   scannerContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      width: "100%",
   },
});

const QrScan: FC<{ state: CodicentAppState; title?: string; singleShot?: boolean }> = ({ state, title, singleShot }) => {
   const styles = useStyles();
   const { service } = state;
   const { t } = useLocalization();
   const [error, setError] = useState<string>();
   const shutter = useMemo(() => new Audio("/audio/camera.mp3"), []);
   const [flash, setFlash] = useState(false);
   const [busy, setBusy] = useState(false);
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const tags = searchParams.get("tags");

   const scanned = useCallback(
      async (result: string) => {
         setBusy(true);
         console.log("Scanned result:", result);
         shutter.play();
         setFlash(true);
         setTimeout(() => setFlash(false), 100);
         setTimeout(() => setBusy(false), 1000);
         try {
            await service.sendMessage(`${tags ? tags + " " : ""}${result}`);
            if (singleShot === true) {
               navigate(-1);
            }
         } catch (error) {
            console.error("Error sending message:", error);
            setError(error instanceof Error ? error.message : String(error));
         }
      },
      [shutter, service, tags, singleShot, navigate]
   );

   const handleError = useCallback((error: string) => {
      console.log("QR Scanner Error:", error);
      setError(error);
   }, []);

   return (
      <Page hideHeader>
         <div className={styles.container}>
            <div className={styles.flashOverlay} style={{ backgroundColor: flash ? "#ffffff" : "transparent" }} />
            {error && (
               <MessageBar intent="error">
                  <MessageBarBody>
                     <MessageBarTitle>{t("Fel")}</MessageBarTitle>
                     {error}
                  </MessageBarBody>
                  <MessageBarActions containerAction={<Button appearance="transparent" icon="DismissRegular" />}>
                     <Button onClick={() => setError(undefined)}>{t("OK")}</Button>
                  </MessageBarActions>
               </MessageBar>
            )}
            <TextHeader title={title || t("Skanna")} />
            <div className={styles.scannerContainer}>
               <QrScanner
                  onScan={(code) => {
                     if (!busy) scanned(code);
                  }}
                  onError={handleError}
               />
            </div>
         </div>
      </Page>
   );
};

export default QrScan;
