# Anagrams.js

## Overview

This project implements a client-side Anagrams game using **JavaScript**, **HTML**, and **localStorage**, offering a dynamic and interactive single-page application. Players are shown 7 shuffled letters and must form valid dictionary words using only those letters. The game tracks score, guesses, and player statistics—all while persisting data locally between sessions.

## Game Features

- Display of 7-letter target word (shuffled)
- User can guess valid words using the given letters
- Real-time word validation via API (dictionary lookup)
- Scoring system based on word length
- Game ends when the 7-letter target word is correctly guessed
- Ability to shuffle letters or start a new game
- Tracks and displays all valid guesses grouped by length

## User Stats

- Number of games played
- Highest and lowest scores
- Average number of correct and incorrect guesses per game
- Persistent across sessions using `localStorage`

##  Reset Options

- Users can clear all stats and history
- Game resets automatically on page load if no active game is found

## Technologies Used

- JavaScript (Vanilla, no jQuery)
- HTML/CSS
- `localStorage` for persistent data
- AJAX using Fetch API
- UVA-provided APIs:
  - `getRandomWord()` to fetch a 7-letter word
  - `checkword.php` to validate dictionary entries

## Files

- `index.html` – Main game interface
- `script.js` – Contains all game logic and event handling
- `anagrams.js` – Provided helper for fetching random target words

## Published Version

You can access the live version at:  
https://zixingyu.github.io/anagrams-game-js/

---

