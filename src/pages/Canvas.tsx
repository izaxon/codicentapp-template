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

import { useEffect, useState, useRef } from "react";
import { makeStyles } from "@fluentui/react-components";
import { useSearchParams } from "react-router-dom";
import { Footer, VoiceIcon, RealtimeVoice } from "codicent-app-sdk";
import { MODULE_VOICE } from "../constants";

const useStyles = makeStyles({
  frame: {
    width: "100%",
    height: "100%",
    border: "none",
  },
  content: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: "90px",
    zIndex: 1000,
  },
});

const Canvas = ({
  html,
  script, // new injected script prop
  onHtmlChange,
  voice,
}: {
  html?: string;
  script?: string; // new injected script prop
  onHtmlChange: (html: string) => void;
  voice?: RealtimeVoice;
}) => {
  const style = useStyles();
  const [searchParams] = useSearchParams();
  const [htmlCode, setHtmlCode] = useState<string>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const html = searchParams.get("html");
    if (html) {
      setHtmlCode(html);
    }

    const instructions = searchParams.get("instructions");
    if (instructions) {
      voice?.updateInstructions(instructions);
    }
  }, [searchParams, voice]);

  useEffect(() => {
    if (htmlCode) {
      onHtmlChange(htmlCode);
    }
  }, [htmlCode, onHtmlChange]);

  useEffect(() => {
    if (html) {
      setHtmlCode(html);
    }
  }, [html]);

  useEffect(() => {
    if (iframeRef.current && script) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        const scriptEl = doc.createElement("script");
        scriptEl.textContent = script;
        doc.body.appendChild(scriptEl);
      }
    }
  }, [script, htmlCode]);

  return (
    <div className={style.content}>
      {MODULE_VOICE && voice && <VoiceIcon voice={voice} />}
      <iframe ref={iframeRef} srcDoc={htmlCode} title="Codicent Canvas" className={style.frame} />
      <Footer />
    </div>
  );
};

export default Canvas;
