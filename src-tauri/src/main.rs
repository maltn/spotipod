#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{thread, time::Duration};

use reqwest::StatusCode;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.app_handle();
            thread::spawn(move || loop {
                //https://captive.apple.com/hotspot-detect.html
                let resp = reqwest::blocking::get("https://captive.apple.com/hotspot-detect.html");
                let result = match resp {
                    Ok(res) => res.status(),
                    Err(_) => StatusCode::from_u16(404).unwrap(),
                };
                // println!("{:#?}", result);
                app_handle
                    .emit_all("wifi_status", result.is_success())
                    .unwrap();
                thread::sleep(Duration::from_secs(10))
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
