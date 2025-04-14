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

import React, { useCallback, useEffect, useRef, useState } from "react";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import {
  getGpsLocation,
  CodicentService,
  Page,
  CodicentAppState,
  useLocalization,
  useToaster,
  TextHeader,
  MessageInput,
  UploadFile,
  UploadFileRef,
} from "codicent-app-sdk";
import { useSearchParams } from "react-router-dom";
import {
  APP_SAVE_TITLE,
  COMPOSE_BACKGROUND_IMAGE_URL,
  COMPOSE_HIDE_LOCATION,
  COMPOSE_SIMPLE_ATTACH_FILE,
} from "../constants";

const useStyles = makeStyles({
  main: {
    flexGrow: 1,
    ...shorthands.padding("10px"),
    overflowY: "auto",
  },
  container: {
    maxWidth: "640px",
    margin: "0 auto",
    // backgroundImage: "url('" + COMPOSE_BACKGROUND_IMAGE_URL + "')",
    backgroundPosition: "calc(50% + 100px) center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    height: "100%",
  },
  root: {
    height: "100%",
  },
  item: {
    height: "auto",
    width: "auto",
    flexShrink: 1,
    marginBottom: "1rem",
  },
  chat: {
    flexGrow: 1,
    boxSizing: "border-box",
    overflow: "hidden",
    border: "none",
  },
  attachmentBar: {
    display: "none", // Hide the old attachment bar
  },
  iconButton: {
    width: "24px",
    height: "24px",
  },
  imageCard: {
    alignContent: "center",
    borderRadius: tokens.borderRadiusLarge,
    height: "240px",
    textAlign: "left",
    position: "relative",
  },
});

export const Compose: React.FC<{ state: CodicentAppState }> = ({ state }) => {
  const styles = useStyles();
  const { t } = useLocalization();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const uploadFileRef = useRef<UploadFileRef>(null);
  const uploadImageRef = useRef<UploadFileRef>(null);
  const uploadCameraRef = useRef<UploadFileRef>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const { service } = state;
  const [searchParams, setSearchParams] = useSearchParams();
  const [defaultText, setDefaultText] = useState<string | undefined>(undefined);
  const toaster = useToaster();

  const handleFileUploaded = useCallback(
    (fileIds: string[]) => {
      for (const fileId of fileIds) {
        service.getFileInfo(fileId).then((fileInfo) => {
          setFiles((prevFiles) => [...prevFiles, fileInfo]);
        });
      }
    },
    [service, setFiles]
  );

  const handleImagePasted = useCallback(
    (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      service
        .uploadFile(file.name, formData)
        .then((fileId: string) => {
          handleFileUploaded([fileId]);
        })
        .catch(() => {
          toaster.notify(t("Error"), t("Error uploading pasted image"), "");
        });
    },
    [service, handleFileUploaded, toaster, t]
  );

  const handleUploading = (uploading: boolean) => {
    setIsUploading(uploading);
  };

  useEffect(() => {
    const text = searchParams.get("text");
    const url = searchParams.get("url");
    if (text) {
      setDefaultText(text);
      searchParams.delete("text");
    }

    if (url) {
      searchParams.delete("url");
      setDefaultText(((text || "") + " " + url).trim());
    }

    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams, setDefaultText, service, handleFileUploaded]);

  const getLocation = async () => {
    console.log("attach-location");
    const pos = await getGpsLocation();
    if (pos) {
      toaster.notify(t("Position"), t("Position tillagd."), "");
      setLocation(`#gps(${pos.coords.latitude},${pos.coords.longitude})`);
    } else {
      console.log("Failed to get GPS location");
    }
  };

  const clearLocation = () => {
    setLocation(null);
    toaster.notify(t("Position"), t("Position borttagen."), "");
    console.log("clear-location");
  };

  const handleSend = (message: string) => {
    message = `${message}${location ? " " + location : ""}${files.length > 0 ? "\n" : ""}${files
      .map((file) => `#file:${file.id}`)
      .join(" ")}`;
    service.sendMessage(message).then(() => {
      toaster.notify(t("Meddelande"), t("Meddelandet är sparat."), "");
    });
  };

  return (
    <Page hideHeader>
      <div className={styles.container} style={{ backgroundImage: `url(${COMPOSE_BACKGROUND_IMAGE_URL})` }}>
        <TextHeader title={APP_SAVE_TITLE ? t(APP_SAVE_TITLE!) : t("Spara")} />
        <MessageInput
          disableSend
          defaultText={defaultText}
          onSend={handleSend}
          files={files}
          onFilesChange={setFiles}
          isUploading={isUploading}
          onHandleDefaultFiles={handleFileUploaded}
          onUploadFile={() => {
            uploadFileRef.current?.triggerUpload();
            console.log("attach-file");
          }}
          onUploadImage={
            COMPOSE_SIMPLE_ATTACH_FILE
              ? undefined
              : () => {
                  uploadImageRef.current?.triggerUpload();
                  console.log("attach-image");
                }
          }
          onUploadCamera={
            COMPOSE_SIMPLE_ATTACH_FILE
              ? undefined
              : () => {
                  uploadCameraRef.current?.triggerUpload();
                  console.log("attach-camera");
                }
          }
          getImageUrl={CodicentService.getImageUrl}
          onLocationChange={
            COMPOSE_HIDE_LOCATION
              ? undefined
              : (hasLocation) => {
                  if (hasLocation) {
                    getLocation();
                  } else {
                    clearLocation();
                  }
                }
          }
          hasLocation={!!location}
          onImagePasted={handleImagePasted}
        />
        <UploadFile
          ref={uploadFileRef}
          onFileUploaded={handleFileUploaded}
          onUploading={handleUploading}
          multiple
          codicentService={service}
        />
        <UploadFile
          codicentService={service}
          ref={uploadImageRef}
          onFileUploaded={handleFileUploaded}
          onUploading={handleUploading}
          multiple
          accept="image/*"
        />
        <UploadFile
          codicentService={service}
          ref={uploadCameraRef}
          onFileUploaded={handleFileUploaded}
          onUploading={handleUploading}
          multiple
          accept="image/*"
          capture="environment"
        />
      </div>
    </Page>
  );
};

export default Compose;
