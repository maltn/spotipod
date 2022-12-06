import { invoke } from "@tauri-apps/api/tauri";
import { IButtonEventPayload } from "../interfaces"
import { getKey, getPlaylistsItems, getPlaylists, saveSpotifyData } from "../spotify";

const settingsEventHandler = async (payload: IButtonEventPayload) => {
  const button = payload.name.toLocaleLowerCase()

  if(button == "fetch data") {
    const key = await getKey()
    let playlists = await getPlaylists(key)
    const items = await getPlaylistsItems(key, playlists)
    saveSpotifyData(items)
  }

  console.log(payload.name, payload.type)
}

export default settingsEventHandler