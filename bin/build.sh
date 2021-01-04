#!/usr/bin/bash

bold=$(tput bold)
normal=$(tput sgr0)

RESOLVED_MODE=${MODE:-production}

echo "${bold}Main process:${normal}" &&
  vite build --config ./config/main.vite.js --mode "$RESOLVED_MODE" &&
  echo "${bold}Preload script:${normal}" &&
  vite build --config ./config/preload.vite.js --mode "$RESOLVED_MODE" &&
  echo "${bold}Renderer process:${normal}" &&
  vite build --config ./config/renderer.vite.js --mode "$RESOLVED_MODE"
