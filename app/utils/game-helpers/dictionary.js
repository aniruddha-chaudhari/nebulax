const commonWords = [
  "ace", "act", "add", "age", "ago", "aid", "aim", "air", "all", "and",
  "any", "arm", "art", "ask", "ate", "bad", "bag", "ban", "bar", "bat",
  "bay", "bed", "bee", "beg", "bet", "bid", "big", "bit", "boa", "bob",
  "box", "boy", "bug", "bun", "bus", "but", "buy", "cab", "can", "cap",
  "car", "cat", "cow", "cry", "cup", "cut", "dad", "day", "den", "did",
  "die", "dig", "dim", "dip", "dog", "dot", "dry", "due", "dug", "dye",
  "ear", "eat", "egg", "ego", "elk", "elm", "end", "era", "eve", "eye",
  "fad", "fan", "far", "fat", "fee", "few", "fig", "fin", "fir", "fit",
  "fix", "fly", "fog", "for", "fox", "fry", "fun", "fur", "gag", "gap",
  "gas", "gel", "gem", "get", "gig", "gin", "god", "got", "gum", "gun",
  "gut", "guy", "gym", "had", "hag", "ham", "has", "hat", "hay", "hem",
  "hen", "her", "hey", "hid", "him", "hip", "his", "hit", "hog", "hop",
  "hot", "how", "hub", "hue", "hug", "hum", "hut", "ice", "icy", "ill",
  "ink", "inn", "ion", "ire", "its", "ivy", "jab", "jag", "jam", "jar",
  "jaw", "jay", "jet", "jig", "job", "jog", "jot", "joy", "jug", "jut",
  "keg", "key", "kid", "kin", "kit", "lab", "lac", "lad", "lag", "lam",
  "lap", "law", "lay", "led", "leg", "let", "lid", "lie", "lip", "lit",
  "lob", "log", "lot", "low", "lug", "lye", "mad", "mag", "man", "map",
  "mat", "may", "men", "met", "mid", "mix", "mob", "mod", "mom", "mop",
  "mud", "mug", "nag", "nap", "nay", "net", "new", "nil", "nip", "nit",
  "nod", "nor", "not", "now", "nun", "nut", "oak", "odd", "off", "oft",
  "oil", "old", "one", "orb", "ore", "our", "out", "owe", "owl", "own",
  "pad", "pal", "pan", "par", "pat", "paw", "pay", "pea", "pen", "pep",
  "per", "pet", "pew", "pie", "pig", "pin", "pip", "pit", "ply", "pod",
  "pop", "pot", "pow", "pro", "pry", "pub", "pug", "pun", "pup", "put",
  "rad", "rag", "raid", "rail", "rain", "rake", "rank", "rant", "rare", "rate",
  "read", "real", "reap", "rear", "rely", "rend", "rent", "rest", "rice", "rich",
  "ride", "rift", "right", "ring", "riot", "rise", "risk", "rite", "road", "roam",
  "roar", "robe", "rock", "rode", "roll", "roof", "room", "root", "rope", "rose",
  "rosy", "rote", "rout", "ruby", "rude", "rule", "rung", "runs", "rush", "rust",
  "sack", "safe", "saga", "sage", "said", "sail", "sake", "sale", "salt", "same",
  "sand", "sane", "sang", "sank", "save", "scab", "scan", "scar", "seat", "seed",
  "seek", "seem", "seen", "self", "sell", "send", "sent", "serf", "sets", "sewn",
  "shad", "shag", "shah", "sham", "shaw", "shed", "ship", "shod", "shoe", "shoo",
  "shop", "shot", "show", "shut", "sick", "side", "sift", "sigh", "sign", "silk",
  "sill", "silo", "silt", "sine", "sing", "sink", "sire", "site", "sits", "size",
  "skew", "skid", "skim", "skin", "skip", "skit", "slab", "slam", "slap", "slat",
  "slay", "sled", "slew", "slid", "slim", "slip", "slit", "slob", "slog", "slot",
  "slow", "slug", "slum", "slur", "smog", "smug", "snag", "snap", "snip", "snit",
  "snob", "snow", "snub", "snug", "soak", "soap", "soar", "sock", "soda", "sofa",
  "soft", "soil", "sold", "sole", "some", "song", "soon", "soot", "sore", "sort",
  "soul", "soup", "sour", "sown", "spam", "span", "spar", "spat", "spay", "sped",
  "spin", "spit", "spot", "spry", "spud", "spur", "stab", "stag", "star", "stay",
  "stem", "step", "stew", "stir", "stop", "stow", "stub", "stud", "stun", "such",
  "suds", "suit", "sulk", "sump", "sung", "sunk", "sure", "surf", "swab", "swag",
  "swam", "swan", "swap", "swat", "sway", "swig", "swim", "swum", "tack", "taco",
  "tact", "tail", "take", "tale", "talk", "tall", "tame", "tang", "tank", "tape",
  "taps", "tare", "tarp", "tart", "task", "taut", "taxi", "team", "tear", "teas",
  "tell", "temp", "tend", "tent", "term", "test", "text", "than", "that", "thaw",
  "them", "then", "they", "thin", "this", "tick", "tide", "tidy", "tied", "tier",
  "tile", "till", "tilt", "time", "tine", "ting", "tint", "tiny", "tipi", "tire",
  "toad", "toil", "told", "toll", "tomb", "tone", "tong", "took", "tool", "toot",
  "tore", "torn", "tote", "tour", "tout", "town", "trap", "tray", "tree", "trek",
  "trim", "trio", "trip", "trod", "trot", "true", "tube", "tuck", "tuff", "tuft",
  "tuna", "tune", "turf", "turn", "tusk", "tutu", "twig", "twin", "twit", "type",
  "ugly", "ulna", "undo", "unit", "unto", "upon", "urge", "urn", "use", "used",
  "user", "uses", "vain", "vale", "vamp", "vane", "vang", "vape", "vary", "vase",
  "vast", "veal", "veer", "veil", "vein", "vend", "vent", "verb", "very", "vest",
  "veto", "vial", "vibe", "vice", "view", "vile", "vine", "visa", "vise", "void",
  "volt", "vote", "wack", "wade", "waft", "wage", "wail", "wait", "wake", "walk",
  "wall", "wand", "want", "ward", "ware", "warm", "warn", "warp", "wart", "wary",
  "wash", "wasp", "watt", "wave", "wavy", "waxy", "weak", "wean", "wear", "weed",
  "week", "weep", "weld", "well", "welt", "went", "wept", "were", "west", "what",
  "when", "whey", "whim", "whip", "whir", "whit", "whiz", "who", "whom", "why",
  "wick", "wide", "wife", "wild", "will", "wilt", "wily", "wimp", "wind", "wine",
  "wing", "wink", "wino", "wire", "wise", "wish", "wisp", "with", "woke", "wold",
  "wolf", "womb", "wont", "wood", "wool", "woot", "word", "wore", "work", "worm",
  "worn", "wove", "wrap", "wren", "writ", "yard", "yarn", "yeah", "year", "yelp",
  "yoga", "yoke", "yolk", "your", "zany", "zeal", "zero", "zest", "zinc", "zing",
  "zone", "zoom"
];

export const isValidWord = (word) => {
  return commonWords.includes(word.toLowerCase());
};

export const getRandomWord = () => {
  const index = Math.floor(Math.random() * commonWords.length);
  return commonWords[index];
};

export const getWordsWithPrefix = (prefix) => {
  return commonWords.filter(word => word.startsWith(prefix.toLowerCase()));
};

export const getWordsOfLength = (length) => {
  return commonWords.filter(word => word.length === length);
};

export const getWordsByLength = (minLength, maxLength) => {
  return commonWords.filter(word => word.length >= minLength && word.length <= maxLength);
};

export const getRandomWordSet = (count, minLength = 3, maxLength = 7) => {
  const appropriateWords = getWordsByLength(minLength, maxLength);
  const shuffled = [...appropriateWords].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const findWordsInGrid = (grid) => {
  const gridLower = grid.map(row => row.map(cell => cell.toLowerCase()));
  
  const canPlaceWordFromCell = (row, col, word) => {
    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0]
    ];
    
    for (const [dr, dc] of directions) {
      let canPlace = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + i * dr;
        const c = col + i * dc;
        if (r < 0 || r >= gridLower.length || c < 0 || c >= gridLower[0].length ||
            gridLower[r][c] !== word[i]) {
          canPlace = false;
          break;
        }
      }
      if (canPlace) return true;
    }
    return false;
  };
  
  const foundWords = [];
  for (const word of commonWords) {
    if (word.length >= 3) {
      for (let row = 0; row < gridLower.length; row++) {
        for (let col = 0; col < gridLower[row].length; col++) {
          if (canPlaceWordFromCell(row, col, word)) {
            foundWords.push(word);
            break;
          }
        }
        if (foundWords.includes(word)) break;
      }
    }
  }
  
  return foundWords;
};

export default {
  isValidWord,
  getRandomWord,
  getWordsWithPrefix,
  getWordsOfLength,
  getWordsByLength,
  getRandomWordSet,
  findWordsInGrid,
  wordCount: commonWords.length
};