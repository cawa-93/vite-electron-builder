#!/usr/bin/bash

bold=$(tput bold)
normal=$(tput sgr0)

echo "${bold}Main process:${normal}" &&
  vite build --config ./config/main.vite.js &&
  echo "${bold}Preload script:${normal}" &&
  vite build --config ./config/preload.vite.js &&
  echo "${bold}Renderer process:${normal}" &&
  vite build --config ./config/renderer.vite.js
