const levels = [
  {
    word: 'advisory',
    hint: 'A machine or device for moving or processing things.'
  },
  {
    word: 'aircraft',
    hint: 'A vehicle that can fly.'
  },
  {
    word: 'engineer',
    hint: 'A person who designs or builds machines.'
  }
];

let currentLevel = 0;
let draggedLetter = null;

// DOM elements
const puzzleDiv = document.querySelector('.puzzle');
const answerDiv = document.querySelector('.answer');
const resultDiv = document.getElementById('result');
const checkBtn = document.getElementById('checkBtn');
const levelInfo = document.getElementById('level-info');
const hintDiv = document.querySelector('.hint p');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

// 隨機顏色
function getRandomColor() {
  const colors = ['#f7b7b7', '#b7d7f7', '#f7d7b7', '#d7f7b7', '#f7f7b7'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function shuffleWord(word) {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}

function createPuzzle() {
  const level = levels[currentLevel];
  const shuffledLetters = shuffleWord(level.word);

  puzzleDiv.innerHTML = '';
  answerDiv.innerHTML = '';
  resultDiv.textContent = '';

  // 顯示關卡與提示
  levelInfo.textContent = `Level ${currentLevel + 1} / ${levels.length}`;
  hintDiv.textContent = `Hint: ${level.hint}`;

  shuffledLetters.forEach(letter => {
    const letterDiv = document.createElement('div');
    letterDiv.classList.add('letter');
    letterDiv.textContent = letter;
    letterDiv.setAttribute('draggable', 'true');
    letterDiv.style.backgroundColor = getRandomColor();

    letterDiv.addEventListener('dragstart', dragStart);
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

function dragStart(event) {
  draggedLetter = event.target;
  event.dataTransfer.setData('text/plain', draggedLetter.textContent);
}

// 拖入答題區
answerDiv.addEventListener('dragover', event => event.preventDefault());
answerDiv.addEventListener('drop', event => {
  event.preventDefault();
  if (draggedLetter && draggedLetter.parentElement === puzzleDiv) {
    answerDiv.appendChild(draggedLetter);
    draggedLetter.style.opacity = 1;
    draggedLetter.removeAttribute('draggable');
    draggedLetter = null;
  }
});

// 拖回題目區
puzzleDiv.addEventListener('dragover', event => event.preventDefault());
puzzleDiv.addEventListener('drop', event => {
  event.preventDefault();
  if (draggedLetter && draggedLetter.parentElement === answerDiv) {
    puzzleDiv.appendChild(draggedLetter);
    draggedLetter.setAttribute('draggable', 'true');
    draggedLetter = null;
  }
});

// 點擊移回題目區
answerDiv.addEventListener('click', event => {
  if (event.target.classList.contains('letter')) {
    puzzleDiv.appendChild(event.target);
    event.target.setAttribute('draggable', 'true');
  }
});

// 檢查答案
function checkAnswer() {
  const userAnswer = Array.from(answerDiv.children).map(l => l.textContent).join('');
  const correctAnswer = levels[currentLevel].word;

  if (userAnswer === correctAnswer) {
    resultDiv.textContent = 'Correct!';
    resultDiv.style.color = 'green';
    correctSound.play();

    currentLevel++;
    if (currentLevel < levels.length) {
      setTimeout(() => {
        createPuzzle();
      }, 1500);
    } else {
      resultDiv.textContent = '🎉 All Levels Completed!';
      levelInfo.textContent = '';
    }
  } else {
    resultDiv.textContent = 'Try Again!';
    resultDiv.style.color = 'red';
    wrongSound.play();
    setTimeout(createPuzzle, 1500);
  }
}

// 初始化遊戲
checkBtn.addEventListener('click', checkAnswer);
createPuzzle();
