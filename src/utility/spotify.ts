import { invoke } from "@tauri-apps/api/tauri";
import { IItem } from "./interfaces";
import create from 'zustand'

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
      const temp = []
      for (let i = 0; i < track.track.artists.length; i++) {
        const artist = track.track.artists[i].name;

        if(track["track"]["name"].includes(artist) && track["track"]["name"].includes("feat.") && temp.length > 0) {
          console.log(track["track"]["name"], artist, track["track"]["name"].includes(artist))
          continue;
        }
        else {
          temp.push(artist)
        }
      }
      const artists = temp.join(", ")

      let trackName: string = track.track.name
      trackName = trackName.replaceAll("/", "")

      return {name: artists + " - " + trackName, type: "song"}
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
        items: [{ name: "Toggle Shuffle", type: "setting" }, { name: "Toggle Repeat", type: "setting" }, { name: "Fetch Data", type: "setting" }],
      },
    ],
  }

  data.items[0].items = spotifyData

  console.log(JSON.stringify(data))

  await invoke("write_spotify_data", { data: JSON.stringify(data) });
}

interface IPlayerData {
  image: string | null,
  title: string | null,
  artist: string | null,
  length: number | null,
  duration: number | null,
  setData: (data: IPlayerData) => void,
  setDuration: (time: number) => void
}

const usePlayerData = create<IPlayerData>((set) => ({
  image: null,
  title: null,
  artist: null,
  length: null,
  duration: null,
  setData: (data: IPlayerData) => set(() => ({image: data.image, title: data.title, artist: data.artist, length: data.length, duration: 0})),
  setDuration: (time) => set(() => ({ duration: time }))
}))

export { getKey, getPlaylists, getPlaylistsItems, saveSpotifyData, usePlayerData }