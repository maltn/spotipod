import { k } from "@tauri-apps/api/event-2a9960e7";
import { useEffect, useRef, useState } from "react";
import { IItem } from "../utility/interfaces";
import { findNestedObj, updateNestedByIdentifier } from "../utility/utility";

const Menu = () => {
  const [contentState, _setContentState] = useState<IItem>({
    name: "Top",
    selected: false,
    hover: true,
    type: "parent",
    items: [
      {
        name: "Playlists",
        items: [
          {
            name: "Discover Weekly",
            items: [
              { name: "Song 1", hover: true, type: "song" },
              { name: "Song 2", hover: false, type: "song" },
              { name: "Song 3", hover: false, type: "song" },
            ],
            hover: true,
            type: "playlist",
          },
          {
            name: "Indie",
            items: [
              { name: "Song 1", hover: true, type: "song" },
              { name: "Song 2", hover: false, type: "song" },
              { name: "Song 3", hover: false, type: "song" },
            ],
            hover: false,
            type: "playlist",
          },
          {
            name: "Alternative",
            items: [
              { name: "Song 1", hover: true, type: "song" },
              { name: "Song 2", hover: false, type: "song" },
              { name: "Song 3", hover: false, type: "song" },
            ],
            hover: false,
            type: "playlist",
          },
          {
            name: "Rap",
            items: [
              { name: "Song 1", hover: true, type: "song" },
              { name: "Song 2", hover: false, type: "song" },
              { name: "Song 3", hover: false, type: "song" },
            ],
            hover: false,
            type: "playlist",
          },
          {
            name: "Kpop",
            items: [
              { name: "Song 1", hover: true, type: "song" },
              { name: "Song 2", hover: false, type: "song" },
              { name: "Song 3", hover: false, type: "song" },
            ],
            hover: false,
            type: "playlist",
          },
        ],
        selected: false,
        hover: true,
        type: "parent",
      },
      {
        name: "Settings",
        items: [{ name: "Fetch data", type: "button", hover: true }],
        selected: true,
        hover: false,
        type: "parent",
      },
    ],
  });

  // const [contentRenderState, _setContentRenderState] = useState(contentState);

  const playlists = useRef([
    "Discover Weekly",
    "Indie",
    "Alternative",
    "Rap",
    "Kpop",
  ]);
  const contentStateRef = useRef(contentState);
  // const contentRenderStateRef = useRef(contentRenderState);

  const setContentState = (data) => {
    contentStateRef.current = data;
    _setContentState(data);
  };

  // const setContentRenderState = (data) => {
  //   contentRenderStateRef.current = data;
  //   _setContentRenderState(data);
  // };

  const inputManager = (e: KeyboardEvent) => {
    const obj = findNestedObj(contentStateRef.current, "selected", true);
    if (e.key == "w" || e.key == "W") {
      //UP
    }
    if (e.key == "s" || e.key == "S") {
      //DOWN
      // for (let i = 0; i < obj.items.length; i++) {
      //   if (obj.items[i + 1]) {
      //     obj.items[i + 1].hover = true;
      //   } else {
      //     obj.items[0].hover = true;
      //   }
      //   obj.items[i].hover = false;
      // }
      obj.items[0].name = "FUCK";
      let copy = { ...contentStateRef.current };
      let arifhj = { ...contentStateRef.current };
      console.log(JSON.stringify(obj));
      console.log(JSON.stringify(copy));
      const resObj = updateNestedByIdentifier(obj.name, obj, copy);
      console.log(JSON.stringify(copy) == JSON.stringify(arifhj));
    }
    if (e.key == "Enter") {
      //SELECT
    }
    if (e.key == "Backspace") {
      //BACK
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", inputManager);
    return () => {
      document.removeEventListener("keydown", inputManager);
    };
  }, []);

  const getRenderObj = (obj: IItem): IItem[] => {
    const res = findNestedObj(obj, "selected", true);
    if (res) return res.items;
    return obj.items;
  };

  return (
    <div>
      {getRenderObj(contentStateRef.current).map((data, i) => {
        return (
          <span
            key={i}
            className={`block pl-1 mr-1 rounded-sm ${
              data.hover && "bg-green-500 text-black"
            }`}
          >
            {data.name}
          </span>
        );
      })}
      {/* {contentState.map((data, i) => {
        if ()
        
      })} */}
    </div>
  );
};

export default Menu;
