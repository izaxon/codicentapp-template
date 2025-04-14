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

import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import { useSearchParams } from "react-router-dom";
import {
  ChatInput,
  Prompt,
  TextHeader,
  TypingIndicator,
  CombinedPlaceholderDialog,
  ChatMessage,
  useLocalization,
  useChat,
  TemplateVariable,
  FilePlaceholder,
  useStateWithLocalStorage,
  useTemplateVariables,
  CodicentAppState,
  CodicentService,
  Page,
} from "codicent-app-sdk";
import { SHOW_CHAT_PROMPTS, CHAT_BACKGROUND_IMAGE_URL, APP_CHAT_TITLE, CHAT_WELCOME } from "../constants";
const useStyles = makeStyles({
  chatContainer: {
    width: "100%",
    flex: 1,
    maxWidth: "800px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    overflow: "hidden",
    "@media (max-width: 768px)": {
      maxWidth: "100%",
      borderRadius: "0",
    },
    "@media (max-width: 480px)": {},
    // backgroundImage: "url('" + CHAT_BACKGROUND_IMAGE_URL + "')",
    backgroundPosition: "calc(50%) center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    // Added touchAction to enable horizontal swipe detection
    touchAction: "pan-y",
  },
  chatMessages: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    // backgroundColor: "#f5f5f5",
    touchAction: "pan-y", // Added to enable horizontal swipe detection
  },
});

const Chat: React.FC<{ state: CodicentAppState }> = ({ state }) => {
  const classes = useStyles();
  const { t } = useLocalization();
  const { messages, isBotTyping, handleSend, newChat, openChat } = useChat(state.stateMachine);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialText, setInitialText] = useState<string | null>(null);
  const [showNewPrompt, setShowNewPrompt] = useState(false);
  const { service } = state;
  const [templateVariables, setTemplateVariables] = useState<TemplateVariable[]>([]);
  const [filePlaceholders, setFilePlaceholders] = useState<FilePlaceholder[]>([]);
  const [placeholderDialogOpen, setPlaceholderDialogOpen] = useState(false);
  const [formId, setFormId] = useState<string>();
  const [prompts, setPrompts] = useStateWithLocalStorage<{ title: string; prompt: string }[]>(
    state.context.selectedApp + "_prompts",
    []
  );
  const {
    extractTemplateVariables,
    replaceTemplateVariables,
    extractFilePlaceholders,
    replaceFilePlaceholders,
    handleSelectFiles,
  } = useTemplateVariables(service.uploadFile);
  const hasProcessedUrlText = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (SHOW_CHAT_PROMPTS && messages.length === 0) {
      state.service
        .getAppPrompts()
        .then(setPrompts)
        .catch((error) => {
          console.error("Failed to get prompts", error);
        });
    }
  }, [state.service, setPrompts, messages.length]);

  useEffect(() => {
    setTimeout(() => scrollToBottom(), 10);
  }, [messages]);

  // Handle initial text from URL
  useEffect(() => {
    if (hasProcessedUrlText.current) return;
    hasProcessedUrlText.current = true;

    const text = searchParams.get("text");
    const id = searchParams.get("id");
    const fid = searchParams.get("fid");
    if (text) {
      const processTextAndVariables = async () => {
        const placeholders = extractFilePlaceholders(text);
        const variables = extractTemplateVariables(text);

        // Always clear chat first before processing new text
        newChat();

        if (placeholders.length > 0 || variables.length > 0) {
          setFilePlaceholders(placeholders);
          setTemplateVariables(variables);
          setPlaceholderDialogOpen(true);
          setInitialText(t(text));
        } else {
          setInitialText(t(text));
        }
      };
      processTextAndVariables();
    } else if (id) {
      openChat(id);
    } else if (fid) {
      setFormId(fid);
      service.getFormById(fid).then((form) => {
        newChat();
        // TODO: translate prompt?
        setInitialText(form.prompt);
        // setInitialText(t("Välkommen!") + "\n---\n" + form.prompt);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - runs once on mount

  // Process initial text after placeholders are handled
  useEffect(() => {
    if (initialText && !placeholderDialogOpen) {
      let processedText = initialText;

      if (filePlaceholders.length > 0) {
        processedText = replaceFilePlaceholders(processedText, filePlaceholders);
      }

      if (templateVariables.length > 0) {
        processedText = replaceTemplateVariables(processedText, templateVariables);
      }

      handleSend(processedText);
      // Clear URL params immediately after sending
      setSearchParams({}, { replace: true });
      setInitialText(null);
      setTemplateVariables([]);
      setFilePlaceholders([]);
    }
  }, [
    initialText,
    placeholderDialogOpen,
    handleSend,
    setSearchParams,
    replaceFilePlaceholders,
    replaceTemplateVariables,
    filePlaceholders,
    templateVariables,
  ]);

  const send = (text: string) => {
    const append = searchParams.get("append"); // text to append after each user message
    if (append) {
      text += "\n---\n" + append;
    }

    handleSend(text);
  };

  return (
    <Page hideHeader hideFooter={!!formId}>
      <div
        id="chat-container"
        className={classes.chatContainer}
        style={{ backgroundImage: `url(${CHAT_BACKGROUND_IMAGE_URL})` }}
      >
        <TextHeader
          title={t(APP_CHAT_TITLE || "Chatt")}
          // subtitle="Här kan du chatta mig. Om du inte vet vad du ska skriva så fråga mig vad jag kan hjälpa till med."
          onNewChat={formId ? undefined : () => setShowNewPrompt(true)}
        />
        <div className={classes.chatMessages}>
          {SHOW_CHAT_PROMPTS && prompts.length > 0 && messages.length === 0 && (
            <ChatMessage sender="bot" content={t(CHAT_WELCOME)}>
              {prompts.map((prompt, i) => {
                return (
                  <div key={`prompt-${i}`}>
                    {"> "}
                    <a
                      href="./#/chat"
                      onClick={() => {
                        send(prompt.title + "\n---\n" + prompt.prompt);
                      }}
                    >
                      {t(prompt.title)}
                    </a>
                    <br />
                  </div>
                );
              })}
            </ChatMessage>
          )}
          {messages.map((msg, i) => (
            <div key={msg.id}>
              {((isBotTyping && i === messages.length - 1) || (!isBotTyping && i === messages.length - 2)) && (
                <div ref={messagesEndRef} />
              )}
              <ChatMessage key={msg.id} sender={msg.sender} content={msg.content} isNew={msg.isNew} />
            </div>
          ))}
          {isBotTyping && <TypingIndicator />}
        </div>
        <ChatInput
          codicent={state.context.selectedApp!}
          disableSend={isBotTyping}
          onSend={send}
          onSelectFiles={handleSelectFiles}
          getImageUrl={CodicentService.getImageUrl}
          getFileInfo={(fileId) => service.getFileInfo(fileId)} // Add this line
        />
      </div>
      <Prompt
        open={showNewPrompt}
        title={t("Vill du rensa chatten?")}
        content={t("En ny startas, men chatten kommer först sparas.")}
        onYes={() => {
          setShowNewPrompt(false);
          newChat();
        }}
        onNo={() => setShowNewPrompt(false)}
      />
      <CombinedPlaceholderDialog
        open={placeholderDialogOpen}
        templateVariables={templateVariables}
        filePlaceholders={filePlaceholders}
        onTemplateVariablesChange={setTemplateVariables}
        onFilePlaceholdersChange={setFilePlaceholders}
        onConfirm={() => setPlaceholderDialogOpen(false)}
        onCancel={() => {
          setPlaceholderDialogOpen(false);
          setInitialText(null);
          setTemplateVariables([]);
          setFilePlaceholders([]);
        }}
        uploadFile={service.uploadFile}
      />
    </Page>
  );
};

export default Chat;
