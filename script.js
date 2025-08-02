// Puzzle word (can be replaced with any word you want)
const word = 'advisory';

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


// DOM references
const puzzleDiv = document.querySelector('.puzzle');
const answerDiv = document.querySelector('.answer');
const resultDiv = document.getElementById('result');

let draggedLetter = null;

// Create the puzzle
function createPuzzle() {
  const shuffledLetters = shuffleWord(word);
  const puzzleDiv = document.querySelector('.puzzle');
  puzzleDiv.innerHTML = ''; // Clear existing letters

  shuffledLetters.forEach(letter => {
    const letterDiv = document.createElement('div');
    letterDiv.classList.add('letter');
    letterDiv.textContent = letter;
    letterDiv.setAttribute('draggable', 'true');
    letterDiv.style.backgroundColor = getRandomColor(); // 設置隨機顏色
    letterDiv.addEventListener('dragstart', dragStart);
    puzzleDiv.appendChild(letterDiv);
  });
}

letterDiv.addEventListener('click', () => {
  if (letterDiv.parentElement.classList.contains('puzzle')) {
    answerDiv.appendChild(letterDiv);
    letterDiv.removeAttribute('draggable');
    letterDiv.style.opacity = 1;
  }
});

// 拖曳功能
let draggedLetter = null;
function dragStart(event) {
  draggedLetter = event.target;
  event.dataTransfer.setData('text/plain', draggedLetter.textContent);
}

// 答案區允許放入字母
const answerDiv = document.querySelector('.answer');
answerDiv.addEventListener('dragover', function(event) {
  event.preventDefault();
});

answerDiv.addEventListener('drop', function(event) {
  event.preventDefault();
  if (draggedLetter) {
    answerDiv.appendChild(draggedLetter); // 把字母放到答案區域
    draggedLetter.style.opacity = 1;
    draggedLetter.removeAttribute('draggable'); // 移除拖放屬性
    draggedLetter = null;
  }
});

// 點擊移除答案中的字母回 puzzle 區
answerDiv.addEventListener('click', (event) => {
  if (event.target.classList.contains('letter')) {
    puzzleDiv.appendChild(event.target);
    event.target.setAttribute('draggable', 'true');
  }
});

// 允許拖回 puzzle 區
const puzzleDiv = document.querySelector('.puzzle');
puzzleDiv.addEventListener('dragover', (event) => {
  event.preventDefault();
});
puzzleDiv.addEventListener('drop', (event) => {
  event.preventDefault();
  if (draggedLetter) {
    puzzleDiv.appendChild(draggedLetter);
    draggedLetter.setAttribute('draggable', 'true');
    draggedLetter = null;
  }
});

// 檢查答案
function checkAnswer() {
  const answerLetters = Array.from(answerDiv.children).map(letter => letter.textContent);
  const resultDiv = document.getElementById('result');
  
  if (answerLetters.join('') === word) {
    resultDiv.textContent = 'Correct!';
    resultDiv.style.color = 'green';
  } else {
    resultDiv.textContent = 'Try Again!';
    resultDiv.style.color = 'red';
  }
}

function resetGame() {
  document.getElementById('result').textContent = '';
  createPuzzle(); // 重新打亂字母
}

function checkAnswer() {
  const answerLetters = Array.from(answerDiv.children).map(letter => letter.textContent);
  const resultDiv = document.getElementById('result');
  
  if (answerLetters.join('') === word) {
    resultDiv.textContent = 'Correct!';
    resultDiv.style.color = 'green';
  } else {
    resultDiv.textContent = 'Try Again!';
    resultDiv.style.color = 'red';
    setTimeout(resetGame, 1500); // 1.5 秒後重新開始
  }
}

// 遊戲重置
createPuzzle();

// Add event listener for the check button
document.getElementById('checkBtn').addEventListener('click', checkAnswer);
