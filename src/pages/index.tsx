import { useEffect, useRef, useState } from "react";
import { register } from "@tauri-apps/api/globalShortcut";
import SpotifyWebApi from "spotify-web-api-js";
import Menu from "../components/Menu";
import StatusBar from "../components/StatusBar";

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
            <div className="ml-1 mt-1 space-y-1 overflow-y-hidden w-full h-full">
              <Menu />
            </div>
            <div className="fade w-full h-4 absolute bottom-0"></div>
          </div>

          <div className="w-1/2 h-full bg-black float-left flex items-center flex-col">
            <div className="w-28 h-28 mt-2 bg-red-500 rounded-sm overflow-hidden">
              <img
                className="grayscale"
                src="https://i.scdn.co/image/ab67616d0000b27338af97753b8b89cbd1d05096"
                alt=""
              />
            </div>
            <span className="w-9/10 text-green-400 whitespace-nowrap overflow-hidden text-ellipsis">
              Again (feat. Ghostly Kisses)
            </span>
            <span className="w-9/10 text-green-700 whitespace-nowrap overflow-hidden -mt-1">
              Men I Trust, Ghostly Kisses
            </span>
            <div className="h-2 w-9/10 rounded-md bg-green-900 overflow-hidden">
              <div className="bg-green-400 h-full w-2/5 rounded-md"></div>
            </div>
            <div className="w-9/10 h-4">
              <span className="text-green-400">1:01</span>
              <span className="float-right text-green-400">3:49</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
