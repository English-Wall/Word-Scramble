// Puzzle word (can be replaced with any word you want)
const word = 'engine';

// 儲存目前使用者選擇的答案
let currentAnswer = [];

// 隨機生成顏色
function getRandomColor() {
  const colors = ['#f7b7b7', '#b7d7f7', '#f7d7b7', '#d7f7b7', '#f7f7b7'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Shuffle the word to create a puzzle
function shuffleWord(word) {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}

// Create the puzzle
function createPuzzle() {
  const shuffledLetters = shuffleWord(word);
  const puzzleDiv = document.querySelector('.puzzle');
  puzzleDiv.innerHTML = ''; // Clear existing letters

  shuffledLetters.forEach((letter, index) => {
    const letterDiv = document.createElement('div');
    letterDiv.classList.add('letter');
    letterDiv.textContent = letter.toUpperCase(); // 顯示大寫字母
    letterDiv.setAttribute('draggable', 'true');
    letterDiv.dataset.originalIndex = index; // 儲存原始索引，以便辨識
    letterDiv.dataset.letter = letter; // 儲存字母值
    letterDiv.style.backgroundColor = getRandomColor(); // 設置隨機顏色

    // 點擊事件：將字母移動到答案區
    letterDiv.addEventListener('click', (e) => {
      moveToAnswerArea(e.target);
    });

    // 拖曳事件
    letterDiv.addEventListener('dragstart', dragStart);

    puzzleDiv.appendChild(letterDiv);
  });
}

// 建立答案區的格子
function createAnswerBoxes() {
    const answerDiv = document.querySelector('.answer');
    answerDiv.innerHTML = ''; // 清除舊的答案格
    for (let i = 0; i < word.length; i++) {
        const answerBox = document.createElement('div');
        answerBox.classList.add('answer-box');
        answerBox.addEventListener('click', (e) => {
            // 點擊答案格時，將字母移回題目區
            if (e.target.textContent) {
                moveBackToPuzzleArea(e.target);
            }
        });
        answerDiv.appendChild(answerBox);
    }
}

// Handle drag start event
let draggedLetter = null;
function dragStart(event) {
  draggedLetter = event.target;
  event.dataTransfer.setData('text/plain', draggedLetter.dataset.letter);
}

// Allow dropping letters into the answer area
const answerDiv = document.querySelector('.answer');
answerDiv.addEventListener('dragover', function(event) {
  event.preventDefault();
});

answerDiv.addEventListener('drop', function(event) {
  event.preventDefault();
  const letter = event.dataTransfer.getData('text/plain');
  const targetBox = event.target.closest('.answer-box');
  
  // 檢查拖放目標是否為答案格，且答案格內為空
  if (targetBox && !targetBox.textContent && currentAnswer.length < word.length) {
    const originalLetterDiv = document.querySelector(`.letter[data-letter="${letter}"][draggable="true"]`);
    if (originalLetterDiv) {
      moveToAnswerArea(originalLetterDiv, targetBox);
    }
  }
});

// 將字母從題目區移動到答案區
function moveToAnswerArea(letterDiv, targetBox = null) {
  if (currentAnswer.length >= word.length) {
      return; // 答案已滿，不允許再移動
  }

  // 找到第一個空的答案格
  const emptyBox = targetBox || document.querySelector('.answer-box:empty');

  if (emptyBox) {
    emptyBox.textContent = letterDiv.textContent;
    emptyBox.dataset.letter = letterDiv.dataset.letter;
    
    // 隱藏題目區的字母，並移除拖曳功能
    letterDiv.classList.add('hidden');
    letterDiv.removeAttribute('draggable');

    currentAnswer.push(letterDiv.dataset.letter);

    // 如果所有字母都已填入，則檢查答案
    if (currentAnswer.length === word.length) {
      checkAnswer();
    }
  }
}

// 將字母從答案區移回題目區
function moveBackToPuzzleArea(answerBox) {
  const letter = answerBox.dataset.letter;
  const originalLetterDiv = document.querySelector(`.letter[data-letter="${letter}"][class*="hidden"]`);

  if (originalLetterDiv) {
    // 讓題目區的字母重新顯示，並恢復拖曳功能
    originalLetterDiv.classList.remove('hidden');
    originalLetterDiv.setAttribute('draggable', 'true');
    
    // 清空答案格
    answerBox.textContent = '';
    delete answerBox.dataset.letter;

    // 從答案陣列中移除該字母
    const index = currentAnswer.indexOf(letter);
    if (index > -1) {
      currentAnswer.splice(index, 1);
    }
  }
}

// Check the answer
function checkAnswer() {
  const resultDiv = document.getElementById('result');
  const userAnswer = currentAnswer.join('');
  
  if (userAnswer === word) {
    resultDiv.textContent = 'Correct!';
    resultDiv.style.color = 'green';
  } else {
    resultDiv.textContent = 'Wrong!';
    resultDiv.style.color = 'red';
    
    // 延遲一段時間後自動重設遊戲
    setTimeout(() => {
      resetGame();
    }, 1500); // 1.5 秒後重設
  }
}

// 重設遊戲狀態
function resetGame() {
    const puzzleLetters = document.querySelectorAll('.puzzle .letter.hidden');
    puzzleLetters.forEach(letterDiv => {
        letterDiv.classList.remove('hidden');
        letterDiv.setAttribute('draggable', 'true');
    });

    const answerBoxes = document.querySelectorAll('.answer-box');
    answerBoxes.forEach(box => {
        box.textContent = '';
        delete box.dataset.letter;
    });

    currentAnswer = [];
    document.getElementById('result').textContent = '';
}

// Initialize the game
createPuzzle();
createAnswerBoxes();
