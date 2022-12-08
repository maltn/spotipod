import { useEffect, useRef, useState } from "react";
import { register } from "@tauri-apps/api/globalShortcut";
import SpotifyWebApi from "spotify-web-api-js";
import Menu from "../components/Menu";
import StatusBar from "../components/StatusBar";
import TrackInfo from "../components/TrackInfo";

// (async () => {
//   await register('CommandOrControl+Shift+E', () => {
//     console.log('Shortcut triggered');
//   });
// })();

function App() {
  return (
    <div className="w-full h-full absolute left-0 top-0 bg-black15 flex justify-center items-center">
      <div className="w-80 h-60 relative scale-150 outline-4 outline-black rounded-md outline">
        <StatusBar />
        <div className="absolute top-4 bottom-0 w-full">
          <div className="w-1/2 h-full bg-black text-green-500 font-bold float-left relative overflow-hidden">
            <div className="ml-1 mt-1 space-y-1 overflow-hidden w-full h-full">
              <Menu />
            </div>
            <div className="fade w-full h-4 absolute bottom-0"></div>
          </div>
          <TrackInfo />
        </div>
      </div>
    </div>
  );
}

export default App;
