// 1. 定義變數來存儲字母和答案的狀態
let originalLetters = ['W', 'O', 'R', 'D', 'S', 'C', 'R', 'A', 'M', 'B', 'L', 'E'];  // 例：原始字母
let currentLetters = [...originalLetters];  // 當前的字母順序
let correctAnswer = 'SCRAMBLE';  // 假設答案是 'SCRAMBLE'
let letterSlots = []; // 用來存儲玩家放置字母的位置

// 2. 記錄玩家點擊的字母，將其放到相應的位置
function handleLetterClick(letter, slotIndex) {
    // 確保這個字母沒放過
    if (letterSlots[slotIndex]) {
        alert("你已經放置過這個字母!");
        return;
    }

    // 放置字母
    letterSlots[slotIndex] = letter;
    // 顯示字母在正確的答案格內
    document.getElementById(`slot-${slotIndex}`).innerText = letter;
    // 更新字母的顯示位置
    currentLetters = currentLetters.filter(l => l !== letter);
}

// 3. 當玩家放錯字母時，將字母返回原位
function resetWrongLetter(letter, slotIndex) {
    // 重置該格並移除已放置的字母
    document.getElementById(`slot-${slotIndex}`).innerText = '';
    currentLetters.push(letter);  // 將字母放回原來的字母區
}

// 4. 檢查答案並重置遊戲
function checkAnswer() {
    const playerAnswer = letterSlots.join('');
    
    if (playerAnswer === correctAnswer) {
        alert('恭喜你答對了！');
        // 可選: 繼續進行下一輪或結束遊戲
    } else {
        alert('答案錯誤！重置遊戲');
        resetGame();
    }
}

// 5. 重置遊戲
function resetGame() {
    // 清空字母格和答案區
    letterSlots = [];
    currentLetters = [...originalLetters];  // 重置字母順序
    
    // 重置HTML顯示
    document.querySelectorAll('.letter-slot').forEach(slot => {
        slot.innerText = ''; // 清除答案格中的字母
    });
    document.querySelectorAll('.letter-box').forEach(box => {
        box.innerText = ''; // 清除字母區域中的字母
    });
    
    // 重新排列字母到題目格中
    shuffleLetters();
}

// 6. 打亂字母順序（用於初始化題目格）
function shuffleLetters() {
    currentLetters = shuffle([...originalLetters]);
    // 更新界面顯示打亂後的字母
    document.querySelectorAll('.letter-box').forEach((box, index) => {
        box.innerText = currentLetters[index];
    });
}

// 隨機打亂函數
function shuffle(array) {
    let currentIndex = array.length, randomIndex, temporaryValue;
    
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        
        // Swap it with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// 初始化遊戲
window.onload = function() {
    shuffleLetters();  // 打亂字母，顯示在題目格中
};
