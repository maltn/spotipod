import { listen, UnlistenFn } from "@tauri-apps/api/event";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../App.css";
import eventHandler from "../utility/events/eventHandler";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const handler = (e) => {
      eventHandler(e);
    };

    document.addEventListener("button_press", handler);
    return () => {
      document.removeEventListener("button_press", handler);
    };
  }, []);

  return <Component {...pageProps} />;
}
