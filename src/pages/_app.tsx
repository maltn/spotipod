import { listen, UnlistenFn } from "@tauri-apps/api/event";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import "@fontsource/rubik";
import "../App.css";
import { IButtonEventPayload } from "../utility/interfaces";
import settingsEventHandler from "../utility/events/settingsEventHandler";
import { usePlayerData } from "../utility/spotify";
import { imageBytesToBase64 } from "../utility/utility";
import { invoke } from "@tauri-apps/api/tauri";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  const playerData = usePlayerData();

  const musicEventHandler = async (payload: IButtonEventPayload) => {
    console.log(payload);

    const resp: [number, Uint8Array] = await invoke("get_track_info", {
      track: payload.name,
    });
    const image = imageBytesToBase64(resp[1]);

    playerData.setData({
      ...playerData,
      image,
      title: payload.name.split(" - ")[1],
      artist: payload.name.split(" - ")[0],
      length: resp[0],
      duration: 0,
    });
  };

  useEffect(() => {
    const handler = async (e) => {
      const payload: IButtonEventPayload = e.detail;

      switch (payload.type) {
        case "setting":
          settingsEventHandler(payload);
          break;
        case "song":
          await musicEventHandler(payload);
          break;
        default:
          console.log(
            "eventhandler got passed an undefined or unhandled typing, typing: ",
            payload.type
          );
          break;
      }
    };

    document.addEventListener("button_press", handler);
    return () => {
      document.removeEventListener("button_press", handler);
    };
  }, []);

  return <Component {...pageProps} />;
}
