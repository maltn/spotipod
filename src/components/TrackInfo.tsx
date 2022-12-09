import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";
import { usePlayerData } from "../utility/spotify";
import { fmtMSS } from "../utility/utility";

const TrackInfo = () => {
  const [songDuration, _setSongDuration] = useState(0);
  const playerData = usePlayerData();

  const songDurationRef = useRef(songDuration);
  const setSongDuration = (payload: number) => {
    songDurationRef.current = payload;
    _setSongDuration(payload);
  };

  const interval = useRef<any>();

  useEffect(() => {
    let unlisten: UnlistenFn;

    (async () => {
      unlisten = await listen("handle_counter", (event) => {
        if (event.payload == "start") {
          setSongDuration(0);
          if (!interval.current) {
            interval.current = setInterval(() => {
              setSongDuration(songDurationRef.current + 10);
            }, 100);
          }
        } else if (event.payload == "play") {
          if (!interval.current) {
            interval.current = setInterval(() => {
              setSongDuration(songDurationRef.current + 10);
            }, 100);
          }
        } else if (event.payload == "pause") {
          if (interval.current) {
            clearInterval(interval.current);
            interval.current = null;
          }
        }

        console.log(event);
      });
    })();

    return () => {
      if (unlisten) unlisten();
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (playerData.length && songDuration / 100 >= playerData.length)
      clearInterval(interval.current);
  }, [songDuration]);

  return (
    <div className="w-1/2 h-full bg-black float-left flex items-center flex-col">
      <div className="w-28 h-28 mt-2 rounded-sm overflow-hidden">
        <img
          className="grayscale"
          src={
            (playerData.image ||=
              "https://i.scdn.co/image/ab67616d0000b27338af97753b8b89cbd1d05096")
          }
          alt=""
        />
      </div>
      <span className="w-9/10 text-center text-green-400 whitespace-nowrap overflow-hidden text-ellipsis">
        {(playerData.title ||= "Nothing is playing")}
      </span>
      <span className="w-9/10 text-green-700 text-center whitespace-nowrap overflow-hidden -mt-1">
        {(playerData.artist ||= "Nobody")}
      </span>
      <div className="h-2 w-9/10 rounded-md bg-green-900 overflow-hidden">
        <div
          style={{
            width:
              ((songDuration / 100 / playerData.length) * 100).toFixed(1) + "%",
          }}
          className={`bg-green-400 h-full rounded-md`}
        ></div>
      </div>
      <div className="w-9/10 h-4">
        <span className="text-green-400">
          {fmtMSS((songDuration / 100).toFixed(0))}
        </span>
        <span className="float-right text-green-400">
          {playerData.length ? fmtMSS(playerData.length) : "0:00"}
        </span>
      </div>
    </div>
  );
};

export default TrackInfo;
