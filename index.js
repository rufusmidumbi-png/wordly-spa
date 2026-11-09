// Select elements from the HTML
const searchForm = document.getElementById("search-form");
const wordInput = document.getElementById("word-input");
const message = document.getElementById("message");
const resultSection = document.getElementById("result-section");

const wordElement = document.getElementById("word");
const phoneticElement = document.getElementById("phonetic");
const meaningsElement = document.getElementById("meanings");
const synonymsElement = document.getElementById("synonyms");

const audioButton = document.getElementById("audio-button");
const favoriteButton = document.getElementById("favorite-button");
const favoritesList = document.getElementById("favorites-list");

let currentWord = "";
let currentAudio = "";
let favorites = [];

// Listen for form submission
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const word = wordInput.value.trim();

  if (!word) {
    showMessage("Please enter a word.", "red");
    return;
  }

  await searchWord(word);
});

// Fetch word information from the Dictionary API
async function searchWord(word) {
  showMessage("Searching...", "#4f46e5");
  resultSection.hidden = true;

  try {
    const url =
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(word)}?key=${API_KEYS.dictionary}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Dictionary service error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.length) {
      showMessage("No results found.", "red");
      return;
    }

    // Merriam-Webster returns strings when it is suggesting spellings
    if (typeof data[0] === "string") {
      showMessage(
        `Word not found. Suggestions: ${data.slice(0, 5).join(", ")}`,
        "red"
      );
      return;
    }

    displayMerriamWebsterWord(data[0]);
showMessage("", "");
  } catch (error) {
    console.error("Dictionary request failed:", error);

    showMessage(
      "Unable to reach the dictionary service. Please try again.",
      "red"
    );
  }
}
function displayMerriamWebsterWord(entry) {
  currentWord = entry.meta?.id?.split(":")[0] || wordInput.value.trim();

  wordElement.textContent = currentWord;

  const pronunciation = entry.hwi?.prs?.[0]?.mw;

  phoneticElement.textContent = pronunciation
    ? `Pronunciation: ${pronunciation}`
    : "Pronunciation unavailable";

  meaningsElement.innerHTML = "";

  const partOfSpeech = document.createElement("h3");
  partOfSpeech.textContent = entry.fl || "Definition";

  meaningsElement.appendChild(partOfSpeech);

  const definitions = entry.shortdef || [];

  if (definitions.length > 0) {
    definitions.forEach((definition, index) => {
      const paragraph = document.createElement("p");

      paragraph.textContent = `${index + 1}. ${definition}`;

      meaningsElement.appendChild(paragraph);
    });
  } else {
    const paragraph = document.createElement("p");
    paragraph.textContent = "No definition available.";

    meaningsElement.appendChild(paragraph);
  }

  // Pronunciation audio
  const audioName = entry.hwi?.prs?.find(
    (pronunciation) => pronunciation.sound?.audio
  )?.sound?.audio;

  if (audioName) {
    const firstLetter = audioName.charAt(0);

    let subdirectory = firstLetter;

    if (audioName.startsWith("bix")) {
      subdirectory = "bix";
    } else if (audioName.startsWith("gg")) {
      subdirectory = "gg";
    } else if (/^[0-9_]/.test(audioName)) {
      subdirectory = "number";
    }

    currentAudio =
      `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${audioName}.mp3`;

    audioButton.hidden = false;
  } else {
    currentAudio = "";
    audioButton.hidden = true;
  }

  loadSynonyms(currentWord);

  updateFavoriteButton();

  resultSection.hidden = false;
}
// Display dictionary information
function displayWord(data) {
  currentWord = data.word;
  currentAudio = "";

  wordElement.textContent = data.word;
  phoneticElement.textContent =
    data.phonetic || "Pronunciation unavailable";

  meaningsElement.innerHTML = "";
  synonymsElement.innerHTML = "";

  // Find pronunciation audio
  const audioPhonetic = data.phonetics?.find(
    (phonetic) => phonetic.audio
  );

  if (audioPhonetic) {
    currentAudio = audioPhonetic.audio;
    audioButton.hidden = false;
  } else {
    audioButton.hidden = true;
  }
  // Display meanings and definitions
  data.meanings?.forEach((meaning) => {
    const meaningContainer = document.createElement("div");

    const partOfSpeech = document.createElement("h3");
    partOfSpeech.textContent = meaning.partOfSpeech;

    meaningContainer.appendChild(partOfSpeech);

    meaning.definitions.slice(0, 3).forEach((item, index) => {
      const definition = document.createElement("p");

      definition.textContent =
        `${index + 1}. ${item.definition}`;

      meaningContainer.appendChild(definition);

      if (item.example) {
        const example = document.createElement("p");

        example.textContent = `Example: "${item.example}"`;
        example.style.fontStyle = "italic";

        meaningContainer.appendChild(example);
      }
    });

    meaningsElement.appendChild(meaningContainer);
  });

  // Collect synonyms
  const synonyms = data.meanings
    ?.flatMap((meaning) => meaning.synonyms || [])
    .filter((synonym, index, array) => array.indexOf(synonym) === index)
    .slice(0, 10);

  if (synonyms && synonyms.length > 0) {
    synonymsElement.textContent = synonyms.join(", ");
  } else {
    synonymsElement.textContent = "No synonyms available.";
  }

  updateFavoriteButton();

  resultSection.hidden = false;
}
async function loadSynonyms(word) {
  synonymsElement.textContent = "Loading synonyms...";

  try {
    const url =
      `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${encodeURIComponent(word)}?key=${API_KEYS.thesaurus}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Thesaurus service error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.length || typeof data[0] === "string") {
      synonymsElement.textContent = "No synonyms available.";
      return;
    }

    const synonyms = data
      .flatMap((entry) => entry.meta?.syns?.flat() || [])
      .filter(
        (synonym, index, array) =>
          array.indexOf(synonym) === index
      )
      .slice(0, 10);

    if (synonyms.length === 0) {
      synonymsElement.textContent = "No synonyms available.";
      return;
    }

    synonymsElement.textContent = synonyms.join(", ");
  } catch (error) {
    console.error("Thesaurus request failed:", error);

    synonymsElement.textContent = "Unable to load synonyms.";
  }
}
// Play pronunciation
audioButton.addEventListener("click", () => {
  if (currentAudio) {
    const audio = new Audio(currentAudio);
    audio.play();
  }
});

// Save or remove favorite word
favoriteButton.addEventListener("click", () => {
  if (!currentWord) {
    return;
  }

  if (favorites.includes(currentWord)) {
    favorites = favorites.filter((word) => word !== currentWord);
  } else {
    favorites.push(currentWord);
  }

  displayFavorites();
  updateFavoriteButton();
});

// Display favorite words
function displayFavorites() {
  favoritesList.innerHTML = "";

  favorites.forEach((word) => {
    const listItem = document.createElement("li");

    listItem.textContent = word;

    favoritesList.appendChild(listItem);
  });
}

// Change favorite button appearance
function updateFavoriteButton() {
  if (favorites.includes(currentWord)) {
    favoriteButton.textContent = "★ Saved";
    favoriteButton.style.backgroundColor = "#16a34a";
  } else {
    favoriteButton.textContent = "♡ Save Word";
    favoriteButton.style.backgroundColor = "#f59e0b";
  }
}

// Display messages to the user
function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
}