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

import { useEffect, useRef, useState } from "react";
import {
  MessageContent,
  TextHeader,
  MessageItem,
  Page,
  CodicentAppState,
  useLocalization,
  useStateWithLocalStorage,
  SearchBox,
  getTimeString,
} from "codicent-app-sdk";
import { makeStyles } from "@fluentui/react-components";
import { useSearchParams } from "react-router-dom";
import { LOGBOOK_TAGS, PUBLIC_FLOW_CODICENT, LOGBOOK_TAG_DEFINITIONS } from "../constants";

const useStyles = makeStyles({
  container: {
    width: "100%",
    flex: 1,
    maxWidth: "800px",
    height: "100%",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    margin: "0 auto",
    overflow: "hidden",
    "@media (max-width: 768px)": {
      maxWidth: "100%",
      borderRadius: "0",
    },
    "@media (max-width: 480px)": {},
    touchAction: "pan-y",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  search_results: {
    overflowY: "auto",
    height: "calc(100vh - 200px)",
    marginTop: "10px",
  },
});

export const Log = ({ state }: { state: CodicentAppState }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get("q") || "");
  const { service } = state;
  const { selectedApp } = state.context;
  const [messages, setMessages] = useStateWithLocalStorage<Message[]>(`messages-${selectedApp}`, []);
  const [searching, setSearching] = useState(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const styles = useStyles();
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const { t } = useLocalization();

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  // Only sync search state from URL on mount and when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    const queryParam = searchParams.get("q") || "";
    setSearch(queryParam);
  }, [searchParams]); // Listen for searchParams changes

  useEffect(() => {
    let mounted = true;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (search === undefined) {
        setSearch("");
        return;
      }

      // Update URL only when actual search occurs (after debounce)
      setSearchParams(search ? { q: search } : {}, { replace: true });

      const tags = LOGBOOK_TAGS.split(",");
      setSearching(true);
      // setMessages([]);

      console.log("log-search: " + (search || "-")); // TODO: skip showing search after testing
      service
        .getMessagesFast(tags, undefined, 100, PUBLIC_FLOW_CODICENT)
        .then((msgs) => {
          if (!mounted) {
            setSearching(false);
            return;
          }
          const filtered = msgs.filter((m) => m.content.toLowerCase().includes(search.toLowerCase()));
          if (filtered.length === 0 || messages.length === 0 || filtered[0].id !== messages[0].id) {
            setMessages(filtered);
          }
        })
        .catch((error) => {
          console.warn(error);
        })
        .finally(() => setSearching(false));
    }, 500);

    return () => {
      mounted = false;
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [search, service, setMessages, setSearchParams]);

  // Handle scroll event to save position
  useEffect(() => {
    const element = searchResultsRef.current;
    if (!element) return;

    const handleScroll = () => {
      requestAnimationFrame(() => {
        sessionStorage.setItem("log-scroll-pos-" + selectedApp, element.scrollTop.toString());
      });
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  // Restore scroll position after initial render
  useEffect(() => {
    if (!isInitialMount.current) return;

    const savedScrollPosition = sessionStorage.getItem("log-scroll-pos-" + selectedApp);
    if (savedScrollPosition && searchResultsRef.current) {
      requestAnimationFrame(() => {
        if (searchResultsRef.current) {
          searchResultsRef.current.scrollTop = parseInt(savedScrollPosition);
        }
      });
    }
    isInitialMount.current = false;
  }, [messages, selectedApp]); // Run when messages are loaded

  // Reset scroll position only when search changes
  useEffect(() => {
    if (isInitialMount.current) return;

    if (searchResultsRef.current) {
      searchResultsRef.current.scrollTop = 0;
      sessionStorage.removeItem("log-scroll-pos-" + selectedApp);
    }
  }, [search, selectedApp]);

  // Add scroll position preservation
  useEffect(() => {
    const scrollContainer = searchResultsRef.current;
    if (!scrollContainer) return;

    // Create ResizeObserver to handle content changes
    resizeObserverRef.current = new ResizeObserver(() => {
      const savedScrollPosition = sessionStorage.getItem(`log-scroll-pos-${selectedApp}`);
      if (savedScrollPosition) {
        scrollContainer.scrollTop = parseInt(savedScrollPosition);
      }
    });

    // Observe all message items
    const messageItems = scrollContainer.querySelectorAll(".message-item");
    messageItems.forEach((item) => {
      resizeObserverRef.current?.observe(item);
    });

    // Handle image loads
    const images = scrollContainer.querySelectorAll("img");
    images.forEach((img) => {
      if (!img.complete) {
        const savedScrollPosition = scrollContainer.scrollTop;
        img.addEventListener(
          "load",
          () => {
            scrollContainer.scrollTop = savedScrollPosition;
          },
          { once: true }
        );
      }
    });

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [messages, selectedApp]);

  return (
    <Page hideHeader>
      <div className={styles.container}>
        <TextHeader title={t("Loggbok")} />
        <SearchBox placeholder={t("Sök") + "..."} value={search} onChange={handleSearch} />
        <div className={styles.search_results} ref={searchResultsRef}>
          {searching && <p>{t("Söker") + "..."}</p>}
          {messages.map((m) => {
            const msg = new MessageContent(m.content);
            const header = LOGBOOK_TAG_DEFINITIONS
              ? LOGBOOK_TAG_DEFINITIONS[msg.tags[0]]?.name ||
                msg.tags[0] ||
                (msg.files.length > 0 ? LOGBOOK_TAG_DEFINITIONS["file"]?.name : "")
              : msg.tags[0];
            const content = msg.content;
            return (
              <MessageItem
                key={m.id}
                id={m.id}
                header={header}
                description={""}
                timestamp={getTimeString(new Date(m.createdAt))}
                text={content}
                tags={msg.tags}
                image={""}
                fileIds={msg.files}
                codicentService={service}
              />
            );
          })}
        </div>
      </div>
    </Page>
  );
};

export default Log;
