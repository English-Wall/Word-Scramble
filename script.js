document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const puzzleDiv = document.querySelector('.puzzle');
  const answerDiv = document.querySelector('.answer');
  const checkBtn = document.getElementById('checkBtn');
  const resultDiv = document.getElementById('result');

  // --- Game State ---
  const word = 'machinery'; // The correct answer
  let draggedLetter = null; // To keep track of the letter being dragged

  // --- Functions ---

  /**
   * Shuffles the letters of a word.
   * @param {string} wordToShuffle - The word to be shuffled.
   * @returns {string[]} An array of shuffled letters.
   */
  function shuffleWord(wordToShuffle) {
    const letters = wordToShuffle.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  }
  
  /**
   * Generates a random background color for letters.
   * @returns {string} A hex color code.
   */
  function getRandomColor() {
    const colors = ['#f7b7b7', '#b7d7f7', '#f7d7b7', '#d7f7b7', '#f7f7b7'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Moves a letter from the puzzle area to the answer area.
   * @param {HTMLElement} letter - The letter element to move.
   */
  function moveLetterToAnswer(letter) {
    if (!letter) return;
    answerDiv.appendChild(letter);
    // Once in the answer area, change its event listeners
    updateLetterListeners(letter, 'answer');
  }

  /**
   * Moves a letter from the answer area back to the puzzle area.
   * @param {HTMLElement} letter - The letter element to move.
   */
  function moveLetterToPuzzle(letter) {
    if (!letter) return;
    puzzleDiv.appendChild(letter);
    // Once back in the puzzle area, change its event listeners
    updateLetterListeners(letter, 'puzzle');
  }

  /**
   * Updates the event listeners for a letter based on its location.
   * @param {HTMLElement} letter - The letter element.
   * @param {('puzzle'|'answer')} location - The new location of the letter.
   */
  function updateLetterListeners(letter, location) {
    // Remove all previous click listeners to avoid duplicates
    letter.removeEventListener('click', handlePuzzleLetterClick);
    letter.removeEventListener('click', handleAnswerLetterClick);

    if (location === 'puzzle') {
      letter.addEventListener('click', handlePuzzleLetterClick);
      letter.setAttribute('draggable', 'true');
    } else { // location === 'answer'
      letter.addEventListener('click', handleAnswerLetterClick);
      letter.setAttribute('draggable', 'true'); // Still draggable from the answer box
    }
  }

  // --- Event Handlers ---

  function handlePuzzleLetterClick(event) {
    moveLetterToAnswer(event.target);
  }

  function handleAnswerLetterClick(event) {
    moveLetterToPuzzle(event.target);
  }

  function handleDragStart(event) {
    draggedLetter = event.target;
    // Set data to be transferred (optional but good practice)
    event.dataTransfer.setData('text/plain', draggedLetter.textContent);
  }

  /**
   * Resets the game to its initial state.
   */
  function resetGame() {
    puzzleDiv.innerHTML = '';
    answerDiv.innerHTML = '';
    resultDiv.textContent = '';
    resultDiv.classList.remove('red', 'green');
    initializeGame();
  }

  /**
   * Checks the user's answer. If incorrect, resets the game.
   */
  function checkAnswer() {
    const answerLetters = Array.from(answerDiv.children).map(letter => letter.textContent).join('');
    
    if (answerLetters === word) {
      resultDiv.textContent = 'Correct!';
      resultDiv.style.color = 'green';
    } else {
      resultDiv.textContent = 'Try Again!';
      resultDiv.style.color = 'red';
      // Requirement 4: Auto-reset on wrong answer after a short delay
      setTimeout(resetGame, 1200);
    }
  }

  /**
   * Initializes the game board.
   */
  function initializeGame() {
    const shuffledLetters = shuffleWord(word);
    
    shuffledLetters.forEach(letterText => {
      const letterDiv = document.createElement('div');
      letterDiv.classList.add('letter');
      letterDiv.textContent = letterText;
      letterDiv.style.backgroundColor = getRandomColor();
      
      // Add drag start listener
      letterDiv.addEventListener('dragstart', handleDragStart);
      
      // Add initial listeners for being in the puzzle area
      updateLetterListeners(letterDiv, 'puzzle');
      
      puzzleDiv.appendChild(letterDiv);
    });
  }

  // --- Event Listener Setup ---

  // Allow dropping letters into the answer area
  answerDiv.addEventListener('dragover', (event) => event.preventDefault());
  answerDiv.addEventListener('drop', (event) => {
    event.preventDefault();
    if (draggedLetter && draggedLetter.parentElement !== answerDiv) {
      moveLetterToAnswer(draggedLetter);
      draggedLetter = null;
    }
  });

  // Allow dropping letters back into the puzzle area
  puzzleDiv.addEventListener('dragover', (event) => event.preventDefault());
  puzzleDiv.addEventListener('drop', (event) => {
    event.preventDefault();
    if (draggedLetter && draggedLetter.parentElement !== puzzleDiv) {
      moveLetterToPuzzle(draggedLetter);
      draggedLetter = null;
    }
  });

  // Check button listener
  checkBtn.addEventListener('click', checkAnswer);

  // --- Start the Game ---
  initializeGame();
});
