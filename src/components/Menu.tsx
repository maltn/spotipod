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
              { name: "Song 1", type: "song" },
              { name: "Song 2", type: "song" },
              { name: "Song 3", type: "song" },
              { name: "Song 4", type: "song" },
              { name: "Song 5", type: "song" },
              { name: "Song 6", type: "song" },
              { name: "Song 7", type: "song" },
              { name: "Song 8", type: "song" },
              { name: "Song 9", type: "song" },
              { name: "Song 10", type: "song" },
              { name: "Song 11", type: "song" },
              { name: "Song 12", type: "song" },
              { name: "Song 13", type: "song" },
              { name: "Song 14", type: "song" },
              { name: "Song 15", type: "song" },
              { name: "Song 16", type: "song" },
              { name: "Song 17", type: "song" },
              { name: "Song 18", type: "song" },
              { name: "Song 19", type: "song" },
              { name: "Song 20", type: "song" },
            ],
          },
          {
            name: "Indie",
            items: [
              { name: "Song 1", type: "song" },
              { name: "Song 2", type: "song" },
              { name: "Song 3", type: "song" },
            ],
          },
          {
            name: "Alternative",
            items: [
              { name: "Song 1", type: "song" },
              { name: "Song 2", type: "song" },
              { name: "Song 3", type: "song" },
            ],
          },
          {
            name: "Rap",
            items: [
              { name: "Song 1", type: "song" },
              { name: "Song 2", type: "song" },
              { name: "Song 3", type: "song" },
            ],
          },
          {
            name: "Kpop",
            items: [
              { name: "Song 1", type: "song" },
              { name: "Song 2", type: "song" },
              { name: "Song 3", type: "song" },
            ],
          },
        ],
      },
      {
        name: "Settings",
        items: [{ name: "Fetch data", type: "setting" }],
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
      const content = contentRendererRef.current.items[hoverRef.current];
      if (!contentRendererRef.current.items[hoverRef.current].items) {
        //button
        const event = new CustomEvent("button_press", {
          detail: { name: content.name, type: content.type },
        } as CustomEventInit);
        document.dispatchEvent(event);

        return;
      }
      setContentRenderer(content);
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
