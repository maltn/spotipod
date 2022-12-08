#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use lofty::{read_from_path, AudioFile};
use reqwest::StatusCode;
use std::collections::HashMap;
use std::fs::{File, OpenOptions};
use std::io::Write;
use std::{env, fs};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn spotify_env() -> HashMap<String, String> {
    HashMap::from([
        (
            String::from("SPOTIFY_CLIENT_ID"),
            env::var("SPOTIFY_CLIENT_ID").unwrap_or(String::from("")),
        ),
        (
            String::from("SPOTIFY_SERVER_ID"),
            env::var("SPOTIFY_SECRET_ID").unwrap_or(String::from("")),
        ),
    ])
}

#[tauri::command]
async fn internet_status() -> bool {
    let resp = reqwest::get("https://captive.apple.com/hotspot-detect.html").await;
    let result = match resp {
        Ok(res) => res.status(),
        Err(_) => StatusCode::from_u16(404).unwrap(),
    };
    result.is_success()
}

#[tauri::command]
fn write_spotify_data(data: &str) {
    println!("Wrote {}", data);
    let mut file = OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .open("../menudata.txt")
        .unwrap();

    file.write_all(data.as_bytes()).unwrap();
}

#[tauri::command]
fn read_spotify_data() -> String {
    let input: String = fs::read_to_string(String::from("../menudata.txt")).unwrap();
    input
}

#[tauri::command]
fn get_track_info(track: &str) -> (u64, Vec<u8>) {
    println!("{}", track);

    let file = lofty::read_from_path(
        home::home_dir().unwrap().to_str().unwrap().to_owned() + "\\music\\" + track + ".mp3",
    )
    .unwrap();
    let duration = file.properties().duration().as_secs();
    if file.primary_tag().unwrap().picture_count() > 0 {
        let data = file
            .primary_tag()
            .unwrap()
            .pictures()
            .get(0)
            .unwrap()
            .data();
        return (duration, data.to_vec());
    } else {
        return (duration, vec![0]);
    }
}

#[tauri::command]
fn test_command() {
    println!(
        "{:?}",
        home::home_dir().unwrap().to_str().unwrap().to_owned()
    )
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            spotify_env,
            internet_status,
            write_spotify_data,
            read_spotify_data,
            get_track_info,
            test_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
