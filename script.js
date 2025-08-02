document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const gameContainer = document.querySelector('.game-container');
  const puzzleDiv = document.querySelector('.puzzle');
  const answerDiv = document.querySelector('.answer');
  const checkBtn = document.getElementById('checkBtn');
  const hintBtn = document.getElementById('hintBtn'); // <<< 獲取 Hint 按鈕
  const resultDiv = document.getElementById('result');
  const hintP = document.querySelector('.hint p'); // 獲取提示的 <p> 元素

  // ======================================================================
  // 1. 建立題庫 (您可以自由新增、修改或刪除)
  // ======================================================================
  const questions = [
    { word: 'machinery', hint: 'A machine or device for moving or processing things.' },
    { word: 'javascript', hint: 'A popular programming language for the web.' },
    { word: 'developer', hint: 'A person who creates computer software.' },
    { word: 'interface', hint: 'A point where two systems, subjects, or organizations meet and interact.' },
    { word: 'network', hint: 'A group or system of interconnected people or things.' },
    { word: 'database', hint: 'An organized collection of structured information.' },
    { word: 'security', hint: 'The state of being free from danger or threat.' },
    { word: 'algorithm', hint: 'A process or set of rules to be followed in calculations.' },
    { word: 'variable', hint: 'A named storage location in a program.' },
    { word: 'function', hint: 'A block of code designed to perform a particular task.' }
  ];

  // --- Game State ---
  let currentQuestionIndex = 0; //追蹤題目
  let draggedLetter = null;

  // --- Functions ---

  function shuffleWord(wordToShuffle) {
    const letters = wordToShuffle.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  }
  
  function getRandomColor() {
    const colors = ['#f7b7b7', '#b7d7f7', '#f7d7b7', '#d7f7b7', '#f7f7b7'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function moveLetterToAnswer(letter) {
    if (!letter) return;
    answerDiv.appendChild(letter);
    updateLetterListeners(letter, 'answer');
  }

  function moveLetterToPuzzle(letter) {
    if (!letter) return;
    puzzleDiv.appendChild(letter);
    updateLetterListeners(letter, 'puzzle');
  }

  function updateLetterListeners(letter, location) {
    letter.removeEventListener('click', handlePuzzleLetterClick);
    letter.removeEventListener('click', handleAnswerLetterClick);
    if (location === 'puzzle') {
      letter.addEventListener('click', handlePuzzleLetterClick);
      letter.setAttribute('draggable', 'true');
    } else {
      letter.addEventListener('click', handleAnswerLetterClick);
      letter.setAttribute('draggable', 'true');
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
    event.dataTransfer.setData('text/plain', draggedLetter.textContent);
  }

  /**
   * 4. 檢查答案與處理遊戲進程
   */
   function checkAnswer() {
    const currentWord = questions[currentQuestionIndex].word;
    const answerLetters = Array.from(answerDiv.children).map(letter => letter.textContent).join('');
    
    if (answerLetters === currentWord) {
      resultDiv.textContent = 'Correct!';
      resultDiv.style.color = 'green';
      
      currentQuestionIndex++; 
      
      setTimeout(() => {
        if (currentQuestionIndex < questions.length) {
          loadQuestion();
        } else {
          showGameCompletion(); 
        }
      }, 1500);

    } else {
      resultDiv.textContent = 'Try Again!';
      resultDiv.style.color = 'red';
      setTimeout(loadQuestion, 1200);
    }
  }
  
    // <<< 新增：鎖定字母的函式 >>>
  /**
   * Locks a letter, making it non-interactive.
   * @param {HTMLElement} letter - The letter element to lock.
   */
  function lockLetter(letter) {
    letter.classList.add('locked');
    letter.setAttribute('draggable', 'false');
    // 移除所有可能的互動事件
    letter.removeEventListener('click', handlePuzzleLetterClick);
    letter.removeEventListener('click', handleAnswerLetterClick);
    letter.removeEventListener('dragstart', handleDragStart);
  }

  // <<< 新增：提供提示的函式 >>>
  /**
   * Provides a hint by revealing the first letter of the answer.
   */
  function giveHint() {
    // 檢查答案區是否已經有字母，如果有了就不提供提示，避免搞亂玩家已有的答案
    if (answerDiv.children.length > 0) {
        hintBtn.disabled = true; // 直接禁用按鈕
        return;
    }
    
    const correctWord = questions[currentQuestionIndex].word;
    const firstLetterChar = correctWord[0];

    // 從題目區找到第一個匹配提示字母的方塊
    const letterToMove = Array.from(puzzleDiv.children).find(
      (letter) => letter.textContent === firstLetterChar
    );

    if (letterToMove) {
      // 將字母移動到答案區並鎖定它
      answerDiv.appendChild(letterToMove);
      lockLetter(letterToMove);

      // 禁用提示按鈕，每回合只能用一次
      hintBtn.disabled = true;
    }
  }
  
  /**
   * 3. 載入特定關卡的題目和提示
   */
  function loadQuestion() {
    // 清空上個關卡的狀態
    puzzleDiv.innerHTML = '';
    answerDiv.innerHTML = '';
    resultDiv.textContent = '';
    resultDiv.classList.remove('red', 'green');
    
    hintBtn.disabled = false; // <<< 修改點：每回合開始時，重新啟用 Hint 按鈕
    
    // 獲取當前題目資料
    const currentQuestion = questions[currentQuestionIndex];
    const shuffledLetters = shuffleWord(currentQuestion.word);
    
    // 更新提示文字
    hintP.textContent = `Hint: ${currentQuestion.hint}`;
    
    // 建立新的字母方塊
    shuffledLetters.forEach(letterText => {
      const letterDiv = document.createElement('div');
      letterDiv.classList.add('letter');
      letterDiv.textContent = letterText;
      letterDiv.style.backgroundColor = getRandomColor();
      letterDiv.addEventListener('dragstart', handleDragStart);
      updateLetterListeners(letterDiv, 'puzzle');
      puzzleDiv.appendChild(letterDiv);
    });
  }
  
  /**
   * 當所有題目都回答完畢時呼叫
   */
 function showGameCompletion() {
    gameContainer.innerHTML = `
      <h1>Congratulations!</h1>
      <p style="font-size: 20px; color: #333;">You have completed all the word puzzles!</p>
      <button onclick="location.reload()">Play Again</button>
    `;
    // 遊戲結束時不需要再顯示 hint 按鈕，所以直接改寫 innerHTML 就好
  }

  // --- Event Listener Setup ---
  answerDiv.addEventListener('dragover', (event) => event.preventDefault());
  answerDiv.addEventListener('drop', (event) => {
    event.preventDefault();
    if (draggedLetter && draggedLetter.parentElement !== answerDiv) {
      moveLetterToAnswer(draggedLetter);
      draggedLetter = null;
    }
  });

  puzzleDiv.addEventListener('dragover', (event) => event.preventDefault());
  puzzleDiv.addEventListener('drop', (event) => {
    event.preventDefault();
    if (draggedLetter && draggedLetter.parentElement !== puzzleDiv) {
      moveLetterToPuzzle(draggedLetter);
      draggedLetter = null;
    }
  });

  checkBtn.addEventListener('click', checkAnswer);
  hintBtn.addEventListener('click', giveHint); // <<< 新增：為 Hint 按鈕加上點擊事件監聽

  // --- Start the Game ---
  loadQuestion(); // 初始載入第一題
});
