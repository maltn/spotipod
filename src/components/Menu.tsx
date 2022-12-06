import { k } from "@tauri-apps/api/event-2a9960e7";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { IItem } from "../utility/interfaces";
import {
  findNestedObj,
  findParent,
  updateNestedByIdentifier,
} from "../utility/utility";

const Menu = () => {
  const [contentState, _setContentState] = useState<IItem>({
    name: "Top",
    items: [
      {
        name: "Playlists",
        items: [
          {
            name: "Discover Weekly",
            items: [
              { name: "Song 1" },
              { name: "Song 2" },
              { name: "Song 3" },
              { name: "Song 4" },
              { name: "Song 5" },
              { name: "Song 6" },
              { name: "Song 7" },
              { name: "Song 8" },
              { name: "Song 9" },
              { name: "Song 10" },
              { name: "Song 11" },
              { name: "Song 12" },
              { name: "Song 13" },
              { name: "Song 14" },
              { name: "Song 15" },
              { name: "Song 16" },
              { name: "Song 17" },
              { name: "Song 18" },
              { name: "Song 19" },
              { name: "Song 20" },
            ],
          },
          {
            name: "Indie",
            items: [{ name: "Song 1" }, { name: "Song 2" }, { name: "Song 3" }],
          },
          {
            name: "Alternative",
            items: [{ name: "Song 1" }, { name: "Song 2" }, { name: "Song 3" }],
          },
          {
            name: "Rap",
            items: [{ name: "Song 1" }, { name: "Song 2" }, { name: "Song 3" }],
          },
          {
            name: "Kpop",
            items: [{ name: "Song 1" }, { name: "Song 2" }, { name: "Song 3" }],
          },
        ],
      },
      {
        name: "Settings",
        items: [{ name: "Fetch data" }],
      },
    ],
  });

  const [contentRenderer, _setContentRenderer] = useState<IItem>(contentState);
  const contentRendererRef = useRef(contentRenderer);
  const [hover, _setHover] = useState(0);
  const hoverRef = useRef(hover);
  const setHover = (payload: number) => {
    hoverRef.current = payload;
    _setHover(payload);
  };
  const setContentRenderer = (payload: IItem) => {
    contentRendererRef.current = payload;
    _setContentRenderer(payload);
  };

  const inputManager = (e: KeyboardEvent) => {
    if (e.key == "w" || e.key == "W") {
      //UP
      if (hoverRef.current - 1 < 0) {
        setHover(contentRendererRef.current.items.length - 1);
      } else {
        setHover(hoverRef.current - 1);
      }
    }
    if (e.key == "s" || e.key == "S") {
      //DOWN
      if (hoverRef.current + 1 > contentRendererRef.current.items.length - 1) {
        setHover(0);
      } else {
        setHover(hoverRef.current + 1);
      }
    }
    if (e.key == "Enter") {
      //SELECT
      if (!contentRendererRef.current.items[hoverRef.current].items) return;
      setContentRenderer(contentRendererRef.current.items[hoverRef.current]);
      setHover(0);
    }
    if (e.key == "Backspace") {
      //BACK
      if (contentRendererRef.current.name == "Top") return;
      const result = findParent(contentState, contentRendererRef.current);
      setContentRenderer(result);
      setHover(0);
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
      {contentRenderer.items.map((data, i) => {
        return (
          <span
            key={i}
            className={`block pl-1 mr-1 rounded-sm ${
              hover == i && "bg-green-500 text-black"
            } ${hover >= 8 && i < hover - 8 && "hidden"}`}
          >
            {data.name}
          </span>
        );
      })}
    </div>
  );
};

export default Menu;
