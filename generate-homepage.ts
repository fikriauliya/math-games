// Generate index.html with all games
const games: Record<string, { emoji: string; title: string; desc: string; tags: string; theme: string }[]> = {
  math: [
    { emoji: '🪢', title: 'Tug of War', desc: '2-player math battle! Pull the rope!', tags: '<span class="tag hot">🔥 Popular</span><span class="tag multi">👥 2P</span>', theme: 'tug' },
    { emoji: '🏎️', title: 'Math Racer', desc: 'Answer fast, build combos, race!', tags: '<span class="tag">👤 1P</span><span class="tag">⚡ Speed</span>', theme: 'racer' },
    { emoji: '🫧', title: 'Bubble Pop', desc: 'Pop bubbles matching the target!', tags: '<span class="tag">👤 1P</span><span class="tag">🎯 Target</span>', theme: 'bubble' },
    { emoji: '🧠', title: 'Math Memory', desc: 'Match equations with answers!', tags: '<span class="tag">👤 1-2P</span><span class="tag">🧩 Puzzle</span>', theme: 'memory' },
    { emoji: '🧮', title: 'Sempoa Flash', desc: 'Mental math with flashing numbers!', tags: '<span class="tag">👤 1P</span><span class="tag">🧮 Mental</span>', theme: 'sempoa' },
    { emoji: '🔢', title: 'Number Line', desc: 'Place numbers on the number line!', tags: '<span class="tag">👤 1P</span><span class="tag">📏 Visual</span>', theme: 'numline' },
    { emoji: '🥊', title: 'Greater or Less?', desc: 'Compare numbers boxing style!', tags: '<span class="tag">👤 1P</span><span class="tag">⚡ Speed</span>', theme: 'greater' },
    { emoji: '🎯', title: 'Math Target', desc: 'Hit the target number using operations!', tags: '<span class="tag">👤 1P</span><span class="tag">🎯 Target</span>', theme: 'target' },
    { emoji: '⚔️', title: 'Math Duel', desc: '2-player math showdown!', tags: '<span class="tag multi">👥 2P</span><span class="tag">⚔️ Battle</span>', theme: 'duel' },
    { emoji: '🏃', title: 'Decimal Dash', desc: 'Master decimals on the number line!', tags: '<span class="tag">👤 1P</span><span class="tag">🔢 Decimal</span>', theme: 'decimal' },
    { emoji: '➗', title: 'Division Dash', desc: 'Speed division challenges!', tags: '<span class="tag">👤 1P</span><span class="tag">⚡ Speed</span>', theme: 'division' },
    { emoji: '🧱', title: 'Equation Builder', desc: 'Build equations from number blocks!', tags: '<span class="tag">👤 1P</span><span class="tag">🧩 Puzzle</span>', theme: 'equation' },
    { emoji: '📐', title: 'Estimation', desc: 'Estimate quantities and distances!', tags: '<span class="tag">👤 1P</span><span class="tag">🎯 Guess</span>', theme: 'estimation' },
    { emoji: '🔍', title: 'Factor Finder', desc: 'Find all factors of a number!', tags: '<span class="tag">👤 1P</span><span class="tag">🔢 Numbers</span>', theme: 'factor' },
    { emoji: '🍕', title: 'Fraction Pizza', desc: 'Learn fractions with pizza slices!', tags: '<span class="tag">👤 1P</span><span class="tag">🍕 Visual</span>', theme: 'pizza' },
    { emoji: '📊', title: 'Mean & Median', desc: 'Calculate averages and medians!', tags: '<span class="tag">👤 1P</span><span class="tag">📊 Stats</span>', theme: 'stats' },
    { emoji: '💰', title: 'Money Math', desc: 'Count coins and make change!', tags: '<span class="tag">👤 1P</span><span class="tag">💰 Money</span>', theme: 'money' },
    { emoji: '⚔️', title: 'Multiplication War', desc: 'Times tables battle!', tags: '<span class="tag">👤 1P</span><span class="tag">⚡ Speed</span>', theme: 'multwar' },
    { emoji: '➖', title: 'Negative Numbers', desc: 'Master positive and negative numbers!', tags: '<span class="tag">👤 1P</span><span class="tag">🔢 Numbers</span>', theme: 'negative' },
    { emoji: '📏', title: 'Percentage Bar', desc: 'Visualize and calculate percentages!', tags: '<span class="tag">👤 1P</span><span class="tag">📏 Visual</span>', theme: 'percent' },
    { emoji: '🏛️', title: 'Place Value', desc: 'Understand ones, tens, hundreds!', tags: '<span class="tag">👤 1P</span><span class="tag">🔢 Numbers</span>', theme: 'place' },
    { emoji: '🔎', title: 'Prime Hunter', desc: 'Find the prime numbers!', tags: '<span class="tag">👤 1P</span><span class="tag">🔍 Hunt</span>', theme: 'prime' },
    { emoji: '🏛️', title: 'Roman Numerals', desc: 'Convert Roman to Arabic numerals!', tags: '<span class="tag">👤 1P</span><span class="tag">🏛️ History</span>', theme: 'roman' },
    { emoji: '🔢', title: 'Skip Counting', desc: 'Count by 2s, 3s, 5s, 10s!', tags: '<span class="tag">👤 1P</span><span class="tag">🔢 Pattern</span>', theme: 'skip' },
    { emoji: '⚡', title: 'Times Table', desc: 'Master your multiplication tables!', tags: '<span class="tag">👤 1P</span><span class="tag">⚡ Drill</span>', theme: 'times' },
    { emoji: '🥷', title: 'Number Ninja', desc: 'Slice falling math problems!', tags: '<span class="tag">👤 1P</span><span class="tag">⚡ Action</span>', theme: 'ninja' },
    { emoji: '🎲', title: 'Math Bingo', desc: 'Bingo with math problems!', tags: '<span class="tag">👤 1P</span><span class="tag">🎲 Bingo</span>', theme: 'bingo' },
    { emoji: '✏️', title: 'Math Crossword', desc: 'Crossword with math clues!', tags: '<span class="tag">👤 1P</span><span class="tag">✏️ Puzzle</span>', theme: 'crossword' },
    { emoji: '🕐', title: 'Clock Reader', desc: 'Read analog clocks!', tags: '<span class="tag">👤 1P</span><span class="tag">🕐 Time</span>', theme: 'clock' },
    { emoji: '🕐', title: 'Clock Angles', desc: 'Calculate angles between clock hands!', tags: '<span class="tag">👤 1P</span><span class="tag">📐 Angles</span>', theme: 'clockangle' },
    { emoji: '🌀', title: 'Math Maze', desc: 'Solve equations to escape the maze!', tags: '<span class="tag">👤 1P</span><span class="tag">🌀 Maze</span>', theme: 'maze' },
    { emoji: '📐', title: 'Geometry Shapes', desc: 'Identify and learn about shapes!', tags: '<span class="tag">👤 1P</span><span class="tag">📐 Shapes</span>', theme: 'geometry' },
    { emoji: '🎨', title: 'Color Mix', desc: 'Mix colors to match targets!', tags: '<span class="tag">👤 1P</span><span class="tag">🎨 Colors</span>', theme: 'colormix' },
    { emoji: '📐', title: 'Area & Perimeter', desc: 'Calculate area and perimeter of shapes!', tags: '<span class="tag">👤 1P</span><span class="tag">📐 Geometry</span>', theme: 'area' },
    { emoji: '🔤', title: 'Algebra Intro', desc: 'Solve for X! Simple equations.', tags: '<span class="tag">👤 1P</span><span class="tag">🔤 Algebra</span>', theme: 'algebra' },
    { emoji: '📍', title: 'Coordinate Plot', desc: 'Plot points and find treasure!', tags: '<span class="tag">👤 1P</span><span class="tag">📍 Grid</span>', theme: 'coord' },
    { emoji: '🗼', title: 'Exponent Tower', desc: 'Calculate powers: 2³, 5², etc!', tags: '<span class="tag">👤 1P</span><span class="tag">🗼 Powers</span>', theme: 'exponent' },
    { emoji: '🥧', title: 'Fraction Compare', desc: 'Which fraction is bigger?', tags: '<span class="tag">👤 1P</span><span class="tag">🥧 Visual</span>', theme: 'fraccomp' },
    { emoji: '📊', title: 'Graph Reader', desc: 'Read bar and line graphs!', tags: '<span class="tag">👤 1P</span><span class="tag">📊 Data</span>', theme: 'graph' },
    { emoji: '🔗', title: 'LCM & GCD', desc: 'Find least common multiple & GCD!', tags: '<span class="tag">👤 1P</span><span class="tag">🔢 Numbers</span>', theme: 'lcmgcd' },
    { emoji: '⚖️', title: 'Math Balance', desc: 'Balance the scale with numbers!', tags: '<span class="tag">👤 1P</span><span class="tag">⚖️ Balance</span>', theme: 'balance' },
    { emoji: '🐍', title: 'Math Snake', desc: 'Snake eats correct answers!', tags: '<span class="tag">👤 1P</span><span class="tag">🐍 Action</span>', theme: 'snake' },
    { emoji: '📏', title: 'Measurement', desc: 'Convert cm↔m, kg↔g, and more!', tags: '<span class="tag">👤 1P</span><span class="tag">📏 Units</span>', theme: 'measure' },
    { emoji: '🔗', title: 'Number Bond', desc: 'Find pairs that sum to target!', tags: '<span class="tag">👤 1P</span><span class="tag">🔗 Pairs</span>', theme: 'bond' },
    { emoji: '📝', title: 'Order of Ops', desc: 'PEMDAS challenges!', tags: '<span class="tag">👤 1P</span><span class="tag">📝 PEMDAS</span>', theme: 'orderops' },
    { emoji: '🍳', title: 'Ratio Recipe', desc: 'Scale recipes by ratio!', tags: '<span class="tag">👤 1P</span><span class="tag">🍳 Cooking</span>', theme: 'ratio' },
    { emoji: '🎯', title: 'Rounding', desc: 'Round to nearest 10, 100, 1000!', tags: '<span class="tag">👤 1P</span><span class="tag">🎯 Round</span>', theme: 'rounding' },
    { emoji: '🔄', title: 'Unit Converter', desc: 'Convert between different units!', tags: '<span class="tag">👤 1P</span><span class="tag">🔄 Convert</span>', theme: 'unitconv' },
    { emoji: '🔠', title: 'Math Wordsearch', desc: 'Find math terms in a letter grid!', tags: '<span class="tag">👤 1P</span><span class="tag">🔠 Words</span>', theme: 'wordsearch' },
  ],
  logic: [
    { emoji: '🗼', title: 'Tower Sort', desc: 'Sort discs Tower of Hanoi style!', tags: '<span class="tag">👤 1P</span><span class="tag">🧩 Classic</span>', theme: 'tower' },
    { emoji: '✅', title: 'True or False?', desc: 'Quick-fire true/false math!', tags: '<span class="tag">👤 1P</span><span class="tag">⚡ Speed</span>', theme: 'tf' },
    { emoji: '🔮', title: 'Odd One Out', desc: 'Find what doesn\'t belong!', tags: '<span class="tag">👤 1P</span><span class="tag">🔍 Find</span>', theme: 'odd' },
    { emoji: '📋', title: 'Sequence Sort', desc: 'Put numbers in the right order!', tags: '<span class="tag">👤 1P</span><span class="tag">📋 Sort</span>', theme: 'sort' },
    { emoji: '🔵', title: 'Simon Says', desc: 'Repeat the color pattern!', tags: '<span class="tag">👤 1P</span><span class="tag">🧠 Memory</span>', theme: 'simon' },
    { emoji: '🔍', title: 'Pattern Detective', desc: 'Find the pattern and continue it!', tags: '<span class="tag">👤 1P</span><span class="tag">🔍 Pattern</span>', theme: 'pattern' },
    { emoji: '🪞', title: 'Mirror Draw', desc: 'Draw the mirror image!', tags: '<span class="tag">👤 1P</span><span class="tag">🪞 Visual</span>', theme: 'mirror' },
    { emoji: '📖', title: 'Word Logic', desc: 'Solve word-based logic puzzles!', tags: '<span class="tag">👤 1P</span><span class="tag">📖 Words</span>', theme: 'wordlogic' },
    { emoji: '💡', title: 'Lights Out', desc: 'Toggle lights to turn them all off!', tags: '<span class="tag">👤 1P</span><span class="tag">💡 Puzzle</span>', theme: 'lights' },
    { emoji: '📊', title: 'Logic Grid', desc: 'Solve logic grid deduction puzzles!', tags: '<span class="tag">👤 1P</span><span class="tag">📊 Deduce</span>', theme: 'logicgrid' },
    { emoji: '🃏', title: 'Memory Cards', desc: 'Classic card matching game!', tags: '<span class="tag">👤 1P</span><span class="tag">🧠 Memory</span>', theme: 'memcards' },
    { emoji: '💣', title: 'Minesweeper', desc: 'Classic minesweeper puzzle!', tags: '<span class="tag">👤 1P</span><span class="tag">💣 Classic</span>', theme: 'mines' },
    { emoji: '🖼️', title: 'Nonogram', desc: 'Pixel art logic puzzle!', tags: '<span class="tag">👤 1P</span><span class="tag">🖼️ Pixel</span>', theme: 'nonogram' },
    { emoji: '🧩', title: 'Sliding Puzzle', desc: 'Slide tiles to solve the image!', tags: '<span class="tag">👤 1P</span><span class="tag">🧩 Slide</span>', theme: 'sliding' },
    { emoji: '🔢', title: 'Sudoku Mini', desc: '4x4 and 6x6 Sudoku!', tags: '<span class="tag">👤 1P</span><span class="tag">🔢 Sudoku</span>', theme: 'sudoku' },
    { emoji: '🔷', title: 'Tangram', desc: 'Arrange shapes to fill the outline!', tags: '<span class="tag">👤 1P</span><span class="tag">🔷 Shapes</span>', theme: 'tangram' },
    { emoji: '❌', title: 'Tic Tac Toe', desc: 'Classic X and O vs AI!', tags: '<span class="tag">👤 1P</span><span class="tag">❌ Classic</span>', theme: 'tictactoe' },
    { emoji: '⏰', title: 'Time Calculator', desc: 'Add and subtract time!', tags: '<span class="tag">👤 1P</span><span class="tag">⏰ Time</span>', theme: 'timecalc' },
    { emoji: '🔴', title: 'Connect Four', desc: 'Drop discs to connect 4 in a row!', tags: '<span class="tag multi">👥 2P</span><span class="tag">🔴 Classic</span>', theme: 'connect4' },
    { emoji: '0️⃣', title: 'Binary Code', desc: 'Learn binary numbers!', tags: '<span class="tag">👤 1P</span><span class="tag">0️⃣ Binary</span>', theme: 'binary' },
    { emoji: '🌊', title: 'Maze Runner', desc: 'Navigate through the maze!', tags: '<span class="tag">👤 1P</span><span class="tag">🌊 Maze</span>', theme: 'mazerun' },
    { emoji: '2️⃣', title: '2048', desc: 'Merge tiles to reach 2048!', tags: '<span class="tag">👤 1P</span><span class="tag">🔢 Classic</span>', theme: '2048' },
    { emoji: '🚢', title: 'Battleship', desc: 'Find and sink ships on a grid!', tags: '<span class="tag">👤 1P</span><span class="tag">🚢 Strategy</span>', theme: 'battleship' },
    { emoji: '🌉', title: 'Bridges', desc: 'Connect islands with bridges!', tags: '<span class="tag">👤 1P</span><span class="tag">🌉 Puzzle</span>', theme: 'bridges' },
    { emoji: '🔐', title: 'Code Breaker', desc: 'Crack the secret color code!', tags: '<span class="tag">👤 1P</span><span class="tag">🔐 Mastermind</span>', theme: 'codebreak' },
    { emoji: '✏️', title: 'Crossword Mini', desc: 'Small crossword puzzles!', tags: '<span class="tag">👤 1P</span><span class="tag">✏️ Words</span>', theme: 'crossmini' },
    { emoji: '🎨', title: 'Flood Fill', desc: 'Fill the board with one color!', tags: '<span class="tag">👤 1P</span><span class="tag">🎨 Strategy</span>', theme: 'flood' },
    { emoji: '🔢', title: 'Kakuro', desc: 'Number crossword puzzle!', tags: '<span class="tag">👤 1P</span><span class="tag">🔢 Puzzle</span>', theme: 'kakuro' },
    { emoji: '♞', title: 'Knight\'s Tour', desc: 'Visit every square with a knight!', tags: '<span class="tag">👤 1P</span><span class="tag">♞ Chess</span>', theme: 'knight' },
    { emoji: '⚡', title: 'Logic Gates', desc: 'AND, OR, NOT gate puzzles!', tags: '<span class="tag">👤 1P</span><span class="tag">⚡ Circuits</span>', theme: 'gates' },
    { emoji: '🔥', title: 'Match Stick', desc: 'Move matchsticks to fix equations!', tags: '<span class="tag">👤 1P</span><span class="tag">🔥 Visual</span>', theme: 'matchstick' },
    { emoji: '🗺️', title: 'Path Finder', desc: 'Find the shortest path!', tags: '<span class="tag">👤 1P</span><span class="tag">🗺️ Grid</span>', theme: 'pathfind' },
    { emoji: '🔧', title: 'Pipe Connect', desc: 'Rotate pipes to connect flow!', tags: '<span class="tag">👤 1P</span><span class="tag">🔧 Puzzle</span>', theme: 'pipe' },
    { emoji: '⚫', title: 'Reversi', desc: 'Othello vs AI!', tags: '<span class="tag">👤 1P</span><span class="tag">⚫ Strategy</span>', theme: 'reversi' },
    { emoji: '📦', title: 'Sokoban', desc: 'Push boxes to target positions!', tags: '<span class="tag">👤 1P</span><span class="tag">📦 Classic</span>', theme: 'sokoban' },
    { emoji: '👀', title: 'Spot Difference', desc: 'Find differences between grids!', tags: '<span class="tag">👤 1P</span><span class="tag">👀 Find</span>', theme: 'spotdiff' },
    { emoji: '🔤', title: 'Word Scramble', desc: 'Unscramble the letters!', tags: '<span class="tag">👤 1P</span><span class="tag">🔤 Words</span>', theme: 'scramble' },
    { emoji: '♟️', title: 'Chess Puzzle', desc: 'Mate in 1! Chess tactics!', tags: '<span class="tag">👤 1P</span><span class="tag">♟️ Tactics</span>', theme: 'chess' },
  ],
  toddler: [
    { emoji: '🐄', title: 'Suara Hewan', desc: 'Tebak suara hewan! 🐮🐱🐶', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🔊 Sound</span>', theme: 'animals' },
    { emoji: '🎨', title: 'Tap Warna', desc: 'Tap warna yang benar! 🔴🔵🟡', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🎨 Colors</span>', theme: 'colors' },
    { emoji: '🔢', title: 'Hitung Yuk!', desc: 'Belajar menghitung 1-5! ☝️✌️', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🔢 Count</span>', theme: 'numbers' },
    { emoji: '🍎', title: 'Buah-buahan', desc: 'Kenal buah-buahan! 🍎🍌🍊', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🍎 Fruits</span>', theme: 'fruits' },
    { emoji: '🚗', title: 'Kendaraan', desc: 'Belajar nama kendaraan! 🚗✈️🚂', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🚗 Vehicles</span>', theme: 'vehicles' },
    { emoji: '👕', title: 'Pakaian', desc: 'Kenal jenis pakaian! 👕👗🧢', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">👕 Clothes</span>', theme: 'clothes' },
    { emoji: '🍽️', title: 'Makanan', desc: 'Kenal jenis makanan! 🍚🍜🍞', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🍽️ Food</span>', theme: 'food' },
    { emoji: '🏠', title: 'Ruangan', desc: 'Kenal ruangan di rumah! 🏠🛏️🍳', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🏠 Rooms</span>', theme: 'rooms' },
    { emoji: '🌊', title: 'Laut', desc: 'Hewan laut! 🐟🐙🐢', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🌊 Sea</span>', theme: 'sea' },
    { emoji: '🌤️', title: 'Cuaca', desc: 'Belajar cuaca! ☀️🌧️❄️', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🌤️ Weather</span>', theme: 'weather' },
    { emoji: '😊', title: 'Emosi', desc: 'Kenal perasaan! 😊😢😡', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">😊 Feelings</span>', theme: 'emotions' },
    { emoji: '👋', title: 'Gerakan', desc: 'Belajar gerakan! 👋👏🙌', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">👋 Actions</span>', theme: 'actions' },
    { emoji: '🖐️', title: 'Jari-jari', desc: 'Hitung jari! ☝️✌️🖐️', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🖐️ Fingers</span>', theme: 'fingers' },
    { emoji: 'ABC', title: 'Huruf', desc: 'Kenal huruf A-Z! 📝', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🔤 Letters</span>', theme: 'letters' },
    { emoji: '🎵', title: 'Musik', desc: 'Kenal alat musik! 🎸🥁🎹', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🎵 Music</span>', theme: 'music' },
    { emoji: '🧩', title: 'Cocokkan!', desc: 'Cocokkan pasangan yang sama!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🧩 Match</span>', theme: 'match' },
    { emoji: '↔️', title: 'Lawan Kata', desc: 'Besar-kecil, panas-dingin! ↔️', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">↔️ Opposites</span>', theme: 'opposites' },
    { emoji: '👨‍⚕️', title: 'Profesi', desc: 'Kenal macam-macam pekerjaan!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">👨‍⚕️ Jobs</span>', theme: 'profesi' },
    { emoji: '📏', title: 'Ukuran', desc: 'Besar atau kecil? Panjang atau pendek?', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">📏 Sizes</span>', theme: 'sizes' },
    { emoji: '👤', title: 'Tubuhku', desc: 'Kenal bagian tubuh! 👀👃👄', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">👤 Body</span>', theme: 'body' },
    { emoji: '🫧', title: 'Gelembung', desc: 'Tap gelembung warna-warni!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🫧 Free Play</span>', theme: 'bubbles' },
    { emoji: '🕐', title: 'Waktu', desc: 'Pagi, siang, sore, malam!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🕐 Time</span>', theme: 'tclock' },
    { emoji: '🔢', title: 'Berhitung', desc: 'Hitung benda 1-10!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🔢 Count</span>', theme: 'counting' },
    { emoji: '💃', title: 'Menari', desc: 'Ikuti gerakan tari!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">💃 Dance</span>', theme: 'dance' },
    { emoji: '🐔', title: 'Peternakan', desc: 'Tap hewan di peternakan!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🐔 Farm</span>', theme: 'farm' },
    { emoji: '🌱', title: 'Kebun', desc: 'Siram tanaman, lihat tumbuh!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🌱 Garden</span>', theme: 'garden' },
    { emoji: '🍎', title: 'Gravitasi', desc: 'Jatuhkan benda, mana lebih cepat?', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🍎 Physics</span>', theme: 'gravity' },
    { emoji: '🔴🔵', title: 'Pola', desc: 'Lanjutkan pola warna!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🔴 Pattern</span>', theme: 'patterns' },
    { emoji: '🐱', title: 'Peliharaan', desc: 'Beri makan & rawat hewan!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🐱 Pet</span>', theme: 'pets' },
    { emoji: '🧩', title: 'Puzzle', desc: 'Susun 4 potongan gambar!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🧩 Puzzle</span>', theme: 'tpuzzle' },
    { emoji: '🌈', title: 'Pelangi', desc: 'Susun warna pelangi!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🌈 Colors</span>', theme: 'rainbow' },
    { emoji: '♻️', title: 'Daur Ulang', desc: 'Pilah sampah organik & anorganik!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">♻️ Recycle</span>', theme: 'recycle' },
    { emoji: '👤', title: 'Bayangan', desc: 'Cocokkan benda dengan bayangannya!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">👤 Shadow</span>', theme: 'shadows' },
    { emoji: '🔊', title: 'Tebak Suara', desc: 'Dengar suara, tebak bendanya!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🔊 Sound</span>', theme: 'sounds' },
    { emoji: '🧱', title: 'Susun Balok', desc: 'Susun balok dari besar ke kecil!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🧱 Stack</span>', theme: 'stacking' },
    { emoji: '🚂', title: 'Kereta Api', desc: 'Susun gerbong sesuai urutan!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">🚂 Train</span>', theme: 'train' },
    { emoji: '✏️', title: 'Menjiplak', desc: 'Jiplak huruf dan angka!', tags: '<span class="tag">👶 Ages 2-4</span><span class="tag">✏️ Trace</span>', theme: 'tracing' },
  ]
};

// Map game dir names
const dirMap: Record<string, string> = {
  'Tug of War': 'tug-of-war', 'Math Racer': 'speed-math', 'Bubble Pop': 'bubble-pop',
  'Math Memory': 'memory-math', 'Sempoa Flash': 'sempoa', 'Number Line': 'number-line',
  'Greater or Less?': 'greater-less', 'Math Target': 'math-target', 'Math Duel': 'math-duel',
  'Decimal Dash': 'decimal-dash', 'Division Dash': 'division-dash', 'Equation Builder': 'equation-builder',
  'Estimation': 'estimation', 'Factor Finder': 'factor-finder', 'Fraction Pizza': 'fraction-pizza',
  'Mean & Median': 'mean-median', 'Money Math': 'money-math', 'Multiplication War': 'multiplication-war',
  'Negative Numbers': 'negative-numbers', 'Percentage Bar': 'percentage-bar', 'Place Value': 'place-value',
  'Prime Hunter': 'prime-hunter', 'Roman Numerals': 'roman-numerals', 'Skip Counting': 'skip-counting',
  'Times Table': 'times-table', 'Number Ninja': 'number-ninja', 'Math Bingo': 'math-bingo',
  'Math Crossword': 'math-crossword', 'Clock Reader': 'clock-reader', 'Clock Angles': 'clock-angles',
  'Math Maze': 'math-maze', 'Geometry Shapes': 'geometry-shapes', 'Color Mix': 'color-mix',
  'Area & Perimeter': 'area-perimeter', 'Algebra Intro': 'algebra-intro', 'Coordinate Plot': 'coordinate-plot',
  'Exponent Tower': 'exponent-tower', 'Fraction Compare': 'fraction-compare', 'Graph Reader': 'graph-reader',
  'LCM & GCD': 'lcm-gcd', 'Math Balance': 'math-balance', 'Math Snake': 'math-snake',
  'Measurement': 'measurement', 'Number Bond': 'number-bond', 'Order of Ops': 'order-ops',
  'Ratio Recipe': 'ratio-recipe', 'Rounding': 'rounding', 'Unit Converter': 'unit-converter',
  'Math Wordsearch': 'math-wordsearch',
  // Logic
  'Tower Sort': 'tower-sort', 'True or False?': 'true-false', 'Odd One Out': 'odd-one-out',
  'Sequence Sort': 'sequence-sort', 'Simon Says': 'simon-says', 'Pattern Detective': 'pattern-detective',
  'Mirror Draw': 'mirror-draw', 'Word Logic': 'word-logic', 'Lights Out': 'lights-out',
  'Logic Grid': 'logic-grid', 'Memory Cards': 'memory-cards', 'Minesweeper': 'minesweeper',
  'Nonogram': 'nonogram', 'Sliding Puzzle': 'sliding-puzzle', 'Sudoku Mini': 'sudoku-mini',
  'Tangram': 'tangram', 'Tic Tac Toe': 'tic-tac-toe', 'Time Calculator': 'time-calculator',
  'Connect Four': 'connect-four', 'Binary Code': 'binary-code', 'Maze Runner': 'maze-runner',
  '2048': 'twenty-fortyeight', 'Battleship': 'battleship', 'Bridges': 'bridges',
  'Code Breaker': 'code-breaker', 'Crossword Mini': 'crossword-mini', 'Flood Fill': 'flood-fill',
  'Kakuro': 'kakuro', "Knight's Tour": 'knights-tour', 'Logic Gates': 'logic-gates',
  'Match Stick': 'match-stick', 'Path Finder': 'path-finder', 'Pipe Connect': 'pipe-connect',
  'Reversi': 'reversi', 'Sokoban': 'sokoban', 'Spot Difference': 'spot-difference',
  'Word Scramble': 'word-scramble', 'Chess Puzzle': 'chess-puzzle',
  // Toddler
  'Suara Hewan': 'toddler-animals', 'Tap Warna': 'toddler-colors', 'Hitung Yuk!': 'toddler-numbers',
  'Buah-buahan': 'toddler-fruits', 'Kendaraan': 'toddler-vehicles', 'Pakaian': 'toddler-clothes',
  'Makanan': 'toddler-food', 'Ruangan': 'toddler-rooms', 'Laut': 'toddler-sea',
  'Cuaca': 'toddler-weather', 'Emosi': 'toddler-emotions', 'Gerakan': 'toddler-actions',
  'Jari-jari': 'toddler-fingers', 'Huruf': 'toddler-letters', 'Musik': 'toddler-music',
  'Cocokkan!': 'toddler-match', 'Lawan Kata': 'toddler-opposites', 'Profesi': 'toddler-profesi',
  'Ukuran': 'toddler-sizes', 'Tubuhku': 'toddler-body',
  'Gelembung': 'toddler-bubbles', 'Waktu': 'toddler-clock', 'Berhitung': 'toddler-counting',
  'Menari': 'toddler-dance', 'Peternakan': 'toddler-farm', 'Kebun': 'toddler-garden',
  'Gravitasi': 'toddler-gravity', 'Pola': 'toddler-patterns', 'Peliharaan': 'toddler-pets',
  'Puzzle': 'toddler-puzzle', 'Pelangi': 'toddler-rainbow', 'Daur Ulang': 'toddler-recycle',
  'Bayangan': 'toddler-shadows', 'Tebak Suara': 'toddler-sounds', 'Susun Balok': 'toddler-stacking',
  'Kereta Api': 'toddler-train', 'Menjiplak': 'toddler-tracing',
};

function getDir(title: string): string {
  return dirMap[title] || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function renderCards(list: typeof games.math): string {
  return list.map(g => `    <a href="games/${getDir(g.title)}/" class="game-card theme-${g.theme}">
      <div class="game-emoji">${g.emoji}</div>
      <div class="game-info">
        <div class="game-title">${g.title}</div>
        <div class="game-desc">${g.desc}</div>
        <div class="game-tags">${g.tags}</div>
      </div>
    </a>`).join('\n');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <title>Math & Logic Games for Kids</title>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="./style.css?v=6">
</head>
<body>
  <div class="header">
    <h1><span class="emoji">🎮</span> Math & Logic Games for Kids</h1>
    <p class="subtitle">124 fun games for the whole family — no login required!</p>
  </div>

  <div class="section-label">🧮 Math Games (${games.math.length})</div>
  <div class="games-grid">
${renderCards(games.math)}
  </div>

  <div class="section-label">🧩 Logic & Puzzle Games (${games.logic.length})</div>
  <div class="games-grid">
${renderCards(games.logic)}
  </div>

  <div class="section-label">🧸 Toddler Games (${games.toddler.length})</div>
  <div class="games-grid">
${renderCards(games.toddler)}
  </div>

  <div class="footer">
    <p>Made with ❤️ for Yusuf, Ibrahim & Fatih</p>
  </div>

  <script src="./homepage.ts?v=6"></script>
</body>
</html>`;

await Bun.write('index.html', html);
console.log(`Generated index.html with ${games.math.length} math + ${games.logic.length} logic + ${games.toddler.length} toddler = ${games.math.length + games.logic.length + games.toddler.length} games`);
