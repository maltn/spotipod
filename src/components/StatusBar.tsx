import { useEffect, useState } from "react";
import { BsWifiOff, BsWifi } from "react-icons/bs";
import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";

const Battery = ({ percentage }: { percentage: string }) => {
  const percentageNum = parseInt(percentage.replaceAll(/[^0-9]/g, ""));

  return (
    <div className="mr-2 flex items-center">
      <div className="text-green-400 mb-[0.5px] text-[7px] mr-0.5">
        {percentageNum}%
      </div>
      <div className="w-4 h-2 border border-green-400 rounded-sm overflow-hidden">
        <div className="w-full h-full border border-black">
          <div
            className={`${
              percentageNum <= 25
                ? "bg-green-900"
                : percentageNum <= 50
                ? "bg-green-600"
                : percentageNum <= 75
                ? "bg-green-400"
                : "bg-green-200"
            } ${percentage} h-full`}
          ></div>
        </div>
      </div>
    </div>
  );
};

const Internet = () => {
  const [internetStatus, setInternetStatus] = useState(false);
  // const internet = useInternetState((state) => state);
  useEffect(() => {
    (async () => {
      setInternetStatus(await invoke("internet_status"));
    })();
    const interval = setInterval(async () => {
      setInternetStatus(await invoke("internet_status"));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return internetStatus ? (
    <BsWifi className="text-green-400 text-xs ml-2" />
  ) : (
    <BsWifiOff className="text-green-900 text-xs ml-2" />
  );
};

const StatusBar = () => {
  const temp = async () => {
    const resp = await invoke("write_spotify_data", { data: "haha" });

    console.log(resp);
  };

  return (
    <div className="w-full bg-black h-4 relative flex items-center justify-between">
      <Internet />
      <div onClick={temp} className="w-4 h-4 bg-red-500"></div>
      <Battery percentage="w-[71%]" />
    </div>
  );
};

export default StatusBar;
