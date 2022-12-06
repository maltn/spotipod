import { listen, UnlistenFn } from "@tauri-apps/api/event";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import "../App.css";
import useInternetState from "../utility/states";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  const internet = useInternetState((state) => state);
  useEffect(() => {
    let unlisten: UnlistenFn;
    (async () => {
      unlisten = await listen("wifi_status", (event) => {
        internet.setStatus(event.payload as boolean);
      });
    })();
    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  return <Component {...pageProps} />;
}
