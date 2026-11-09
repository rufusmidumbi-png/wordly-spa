# Wordly Dictionary SPA

Wordly is a Single Page Application that allows users to search for English words and view definitions, pronunciation, parts of speech, synonyms, and audio pronunciation without refreshing the page.

## Features

- Search for English words
- View definitions and parts of speech
- View pronunciation
- Listen to audio pronunciation
- View synonyms
- Save favorite words
- Handle invalid words and API errors
- Responsive design
- Dynamic DOM updates without page reload

## Technologies

- HTML5
- CSS3
- JavaScript
- DOM Manipulation
- Fetch API
- Async/Await
- Merriam-Webster Collegiate Dictionary API
- Merriam-Webster Collegiate Thesaurus API
- Git and GitHub

## Setup

1. Clone the repository.
2. Open the project in VS Code.
3. Obtain Merriam-Webster Collegiate Dictionary and Collegiate Thesaurus API keys.
4. Create a config.js file.
5. Add the API keys to config.js.
6. Open index.html using Live Server.

## API Configuration

Create config.js and define an API_KEYS object containing:

- dictionary: your Collegiate Dictionary API key
- thesaurus: your Collegiate Thesaurus API key

The config.js file is excluded from GitHub using .gitignore to protect private API keys.

## How to Use

1. Enter a word.
2. Click Search.
3. View its pronunciation, definitions, and synonyms.
4. Click Listen to hear pronunciation when available.
5. Click Save Word to add the word to Saved Words.
6. Click Saved again to remove the word.

## Testing

The application was tested with:

- hello - valid dictionary search
- happy - definitions, pronunciation, audio and synonyms
- xyzabc123 - invalid word handling
- blank input - form validation
- Save Word - favorite word functionality

## Error Handling

Wordly handles:

- Invalid words
- Empty searches
- Missing definitions
- Missing synonyms
- Missing audio
- API request failures
- Network errors

## Security

API keys are stored locally in config.js.

config.js is listed in .gitignore and is not uploaded to GitHub.

## Future Improvements

- Store favorites using localStorage
- Add dark mode
- Add antonyms
- Add recent searches
- Add example sentences
- Add automated tests
- Deploy the application online

## Author

Rufus Midumbi

## License

This project was developed for educational purposes.