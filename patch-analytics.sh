#!/bin/bash
cd /home/levifikri/.openclaw/workspace/projects/tug-of-war-math

for app in games/*/app.ts; do
  game=$(echo "$app" | sed 's|games/||;s|/app.ts||')
  
  # Skip if already patched
  if grep -q 'lib/analytics' "$app"; then
    echo "SKIP $game (already patched)"
    continue
  fi
  
  # Determine import path depth
  import_path="../../lib/analytics"
  
  # Add import after confetti import
  sed -i "/from '..\/..\/lib\/confetti'/a import { trackGameStart, trackGameEnd, trackRating, createRatingUI } from '${import_path}';" "$app"
  
  # Add startTime variable after GAME_ID line
  sed -i "/const GAME_ID = '${game}';/a let _analyticsStartTime = 0;" "$app"
  
  echo "PATCHED imports: $game"
done

echo "Done patching imports"
