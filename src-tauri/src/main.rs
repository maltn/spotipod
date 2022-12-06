#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use reqwest::StatusCode;
use std::collections::HashMap;
use std::env;
use std::fs::{File, OpenOptions};
use std::io::Write;

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
    println!("dawdwa");
    let mut file = OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .open("../menudata.txt")
        .unwrap();

    file.write_all(data.as_bytes()).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            spotify_env,
            internet_status,
            write_spotify_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
