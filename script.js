document.addEventListener('DOMContentLoaded', () => {
     const word = 'advisory'; // 正確答案
     let scrambledWord = shuffleWord(word.split('')).join(''); // 隨機打亂字母
     let answer = []; // 儲存使用者輸入的答案
 
     const scrambleArea = document.getElementById('scramble-area');
     const answerArea = document.getElementById('answer-area');
     const messageArea = document.getElementById('message-area');
 
     // 初始化遊戲
     function initGame() {
         scrambleArea.innerHTML = '';
         answerArea.innerHTML = '';
         messageArea.innerHTML = '';
         answer = [];
         scrambledWord = shuffleWord(word.split('')).join('');
 
         createScrambleLetters(scrambledWord);
         createAnswerBoxes(word.length);
     }
 
     // 打亂單字
     function shuffleWord(array) {
         for (let i = array.length - 1; i > 0; i--) {
             const j = Math.floor(Math.random() * (i + 1));
             [[array][i], [array][j]] = [[array][j], [array][i]];
         }
         return array;
     }
 
     // 建立提示字母
     function createScrambleLetters(scrambled) {
         scrambled.split('').forEach(letter => {
             const letterDiv = document.createElement('div');
             letterDiv.classList.add('scramble-letter');
             letterDiv.textContent = letter.toUpperCase();
             letterDiv.setAttribute('draggable', true);
             letterDiv.dataset.letter = letter;
             scrambleArea.appendChild(letterDiv);
         });
     }
 
     // 建立答案區的格子
     function createAnswerBoxes(count) {
         for (let i = 0; i < count; i++) {
             const boxDiv = document.createElement('div');
             boxDiv.classList.add('answer-box');
             boxDiv.dataset.index = i;
             answerArea.appendChild(boxDiv);
         }
     }
 
     // 處理點擊字母事件
     scrambleArea.addEventListener('click', (e) => {
         const letterDiv = e.target.closest('.scramble-letter');
         if (letterDiv && answer.length < word.length && !letterDiv.classList.contains('hidden')) {
             moveToAnswerArea(letterDiv);
         }
     });
 
     // 處理點擊答案區格子事件 (將字母移回提示區)
     answerArea.addEventListener('click', (e) => {
         const boxDiv = e.target.closest('.answer-box');
         if (boxDiv && boxDiv.textContent) {
             moveBackToScrambleArea(boxDiv);
         }
     });
 
     // 處理拖曳事件
     scrambleArea.addEventListener('dragstart', (e) => {
         const letterDiv = e.target.closest('.scramble-letter');
         if (letterDiv) {
             e.dataTransfer.setData('text/plain', letterDiv.dataset.letter);
             e.dataTransfer.effectAllowed = 'move';
             letterDiv.classList.add('dragging');
         }
     });
 
     scrambleArea.addEventListener('dragend', (e) => {
         e.target.classList.remove('dragging');
     });
 
     answerArea.addEventListener('dragover', (e) => {
         e.preventDefault(); // 允許拖放
     });
 
     answerArea.addEventListener('drop', (e) => {
         e.preventDefault();
         const droppedLetter = e.dataTransfer.getData('text/plain');
         const targetBox = e.target.closest('.answer-box');
 
         if (targetBox && !targetBox.textContent && answer.length < word.length) {
             const originalLetterDiv = document.querySelector(`.scramble-letter:not(.hidden)[data-letter="${droppedLetter}"]`);
             if (originalLetterDiv) {
                 moveToAnswerArea(originalLetterDiv);
             }
         }
     });
 
     // 將字母移動到答案區
     function moveToAnswerArea(letterDiv) {
         const letter = letterDiv.dataset.letter;
         const emptyBox = document.querySelector('.answer-box:empty');
 
         if (emptyBox) {
             emptyBox.textContent = letter.toUpperCase();
             emptyBox.dataset.letter = letter;
             letterDiv.classList.add('hidden');
             answer.push(letter);
 
             if (answer.length === word.length) {
                 checkAnswer();
             }
         }
     }
 
     // 將字母移回提示區
     function moveBackToScrambleArea(boxDiv) {
         const letter = boxDiv.dataset.letter;
         const originalLetterDivs = document.querySelectorAll(`.scramble-letter.hidden`);
         let found = false;
         originalLetterDivs.forEach(div => {
             if (div.dataset.letter === letter && !found) {
                 div.classList.remove('hidden');
                 found = true;
             }
         });
 
         boxDiv.textContent = '';
         delete boxDiv.dataset.letter;
 
         const index = answer.indexOf(letter);
         if (index > -1) {
             answer.splice(index, 1);
         }
     }
 
     // 檢查答案
     function checkAnswer() {
         const userAnswer = answer.join('');
         if (userAnswer === word) {
             messageArea.textContent = 'Correct!';
             messageArea.classList.remove('wrong');
             messageArea.classList.add('correct');
         } else {
             messageArea.textContent = 'Wrong!';
             messageArea.classList.remove('correct');
             messageArea.classList.add('wrong');
 
             setTimeout(() => {
                 const answerBoxes = document.querySelectorAll('.answer-box');
                 answerBoxes.forEach(box => {
                     if (box.textContent) {
                         moveBackToScrambleArea(box);
                     }
                 });
                 messageArea.textContent = '';
                 answer = [];
                 const hiddenLetters = document.querySelectorAll('.scramble-letter.hidden');
                 hiddenLetters.forEach(letter => letter.classList.remove('hidden'));
                 answerBoxes.forEach(box => {
                     box.textContent = '';
                     delete box.dataset.letter;
                 });
             }, 1500);
         }
     }
 
     initGame();
 });
