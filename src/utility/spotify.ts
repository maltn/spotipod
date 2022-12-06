import { invoke } from "@tauri-apps/api/tauri";
import { IItem } from "./interfaces";

const getKey = async () => {
  const internetStatus = await invoke("internet_status");
  if(!internetStatus) return "error";

  const data = await invoke("spotify_env")
  const auth = window.btoa( data["SPOTIFY_CLIENT_ID"] + ":" + data["SPOTIFY_SERVER_ID"] )

  const key = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + auth
    },
    body: "grant_type=client_credentials"
  }).then(x => x.json())

  if(key)
    return key["access_token"]
  else
    return "error"
}

const getPlaylists = async (key: string) => {
  const internetStatus = await invoke("internet_status");
  if(!internetStatus) return "error";

  let result = await fetch("https://api.spotify.com/v1/users/meciaro/playlists", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + key
    }
  }).then(x => x.json())

  result = result["items"]

  result = result.map(item => ({
    name: item["name"],
    id: item["id"],
  }))

  return result
}

const getPlaylistsItems = async (key, playlists) => {
  let data: any = [];

  for (let i = 0; i < playlists.length; i++) {
    const playlist = playlists[i];

    let songs = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + key
      }
    }).then(x => x.json())

    const tracks = songs["items"].map(track => {
      return {name: track.track.artists[0].name + " - " + track.track.name, type: "song"}
    })

    data.push({...playlist, items: tracks})
  }

  return data
}

const saveSpotifyData = async (spotifyData: IItem[]) => {
  const data: IItem = {
    name: "Top",
    items: [
      {
        name: "Playlists",
        items: []
      },
      {
        name: "Settings",
        items: [{ name: "Fetch Data", type: "setting" }],
      },
    ],
  }

  data.items[0].items = spotifyData
  await invoke("write_spotify_data", { data: JSON.stringify(data) });
}

export { getKey, getPlaylists, getPlaylistsItems, saveSpotifyData }