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
  puzzleDiv.innerHTML = '';
  answerDiv.innerHTML = '';
  resultDiv.textContent = '';

  const shuffledLetters = shuffleWord(word);

  shuffledLetters.forEach(letter => {
    const letterDiv = document.createElement('div');
    letterDiv.classList.add('letter');
    letterDiv.textContent = letter;
    letterDiv.setAttribute('draggable', 'true');
    letterDiv.style.backgroundColor = getRandomColor();

    // 拖曳事件
    letterDiv.addEventListener('dragstart', dragStart);

    // 點擊事件（放入答案）
    letterDiv.addEventListener('click', () => {
      if (letterDiv.parentElement === puzzleDiv) {
        answerDiv.appendChild(letterDiv);
        letterDiv.removeAttribute('draggable');
        letterDiv.style.opacity = 1;
      }
    });

    puzzleDiv.appendChild(letterDiv);
  });
}

// 拖曳功能
function dragStart(event) {
  draggedLetter = event.target;
  event.dataTransfer.setData('text/plain', draggedLetter.textContent);
}

// 答案區允許放入字母
answerDiv.addEventListener('dragover', event => {
  event.preventDefault();
});

answerDiv.addEventListener('drop', event => {
  event.preventDefault();
  if (draggedLetter && draggedLetter.parentElement === puzzleDiv) {
    answerDiv.appendChild(draggedLetter);
    draggedLetter.style.opacity = 1;
    draggedLetter.removeAttribute('draggable');
    draggedLetter = null;
  }
});

// puzzle 區也允許拖回字母
puzzleDiv.addEventListener('dragover', event => {
  event.preventDefault();
});

puzzleDiv.addEventListener('drop', event => {
  event.preventDefault();
  if (draggedLetter && draggedLetter.parentElement === answerDiv) {
    puzzleDiv.appendChild(draggedLetter);
    draggedLetter.setAttribute('draggable', 'true');
    draggedLetter = null;
  }
});

// 點擊移除答案中的字母回 puzzle 區
answerDiv.addEventListener('click', event => {
  if (event.target.classList.contains('letter')) {
    puzzleDiv.appendChild(event.target);
    event.target.setAttribute('draggable', 'true');
  }
});

// 檢查答案
function checkAnswer() {
  const answerLetters = Array.from(answerDiv.children).map(l => l.textContent);
  if (answerLetters.join('') === word) {
    resultDiv.textContent = 'Correct!';
    resultDiv.style.color = 'green';
  } else {
    resultDiv.textContent = 'Try Again!';
    resultDiv.style.color = 'red';
    setTimeout(resetGame, 1500);
  }
}

// 遊戲重置
function resetGame() {
  createPuzzle();
}

// 初始化
createPuzzle();
document.getElementById('checkBtn').addEventListener('click', checkAnswer);
