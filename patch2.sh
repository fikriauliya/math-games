#!/bin/bash
cd /home/levifikri/.openclaw/workspace/projects/tug-of-war-math

for app in games/*/app.ts; do
  game=$(echo "$app" | sed 's|games/||;s|/app.ts||')
  
  # Skip if already has trackGameStart call (not just import)
  if grep -q 'trackGameStart(GAME_ID)' "$app" || grep -q "trackGameStart('$game')" "$app"; then
    echo "SKIP $game (already has trackGameStart call)"
    continue
  fi
  
  python3 -c "
import re
with open('$app', 'r') as f:
    content = f.read()

# Add trackGameStart after startGame function opening
pattern = r'(function startGame\([^)]*\)\s*\{)'
replacement = r'\1\n  _analyticsStartTime = Date.now();\n  trackGameStart(GAME_ID);'
content = re.sub(pattern, replacement, content, count=1)

# Add trackGameEnd + createRatingUI after setLastPlayed
if 'setLastPlayed(GAME_ID);' in content:
    content = content.replace(
        'setLastPlayed(GAME_ID);',
        'setLastPlayed(GAME_ID);\n  trackGameEnd(GAME_ID, typeof score !== \"undefined\" && typeof score === \"number\" ? score : 0, Date.now() - _analyticsStartTime, true);\n  createRatingUI(GAME_ID, document.getElementById(\"result\") || document.getElementById(\"result-screen\") || document.body);',
        1
    )

with open('$app', 'w') as f:
    f.write(content)
" 2>&1
  
  echo "PATCHED: $game"
done
