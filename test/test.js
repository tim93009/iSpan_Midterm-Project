const player = document.getElementById('player');
const gameArea = document.querySelector('.game-area');
const startBtn = document.getElementById('start-btn');
const scoreBoard = document.getElementById('score-board');
const livesDisplay = document.getElementById('lives');
const leaderboard = document.getElementById('score-list');
const characterSelection = document.getElementById('character-selection');

let gameInterval;
let obstacleInterval;
let score = 0;
let lives = 2;
let playerPosition = 180;
let gameDuration = 10000; // 比賽時間10秒
let timer;

let selectedCharacter = '花枝丸';
const obstacleTypes = ['obstacle1.png', 'obstacle2.png', 'obstacle3.png', 'obstacle4.png', 'obstacle5.png'];
const activeObstacles = [];

// 設定玩家角色
document.querySelectorAll('.character').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    selectedCharacter = e.target.dataset.type;
    player.style.backgroundImage = `url('${selectedCharacter}.png')`;
    characterSelection.style.display = 'none';
  });
});

const countdownDisplay = document.getElementById('countdown');
let countdownTimer;
let remainingTime = 10; // 初始剩餘時間

// 更新倒計時邏輯
function startCountdown() {
  remainingTime = 10; // 重置時間
  countdownDisplay.textContent = `剩餘時間: ${remainingTime} 秒`;
  countdownTimer = setInterval(() => {
    remainingTime--;
    countdownDisplay.textContent = `剩餘時間: ${remainingTime} 秒`;
    if (remainingTime <= 0) {
      clearInterval(countdownTimer);
      endGame();
    }
  }, 1000);
}

// 在開始遊戲時啟動倒計時
startBtn.addEventListener('click', () => {
    resetGame();
    startCountdown(); // 啟動倒計時
    startBtn.style.display = 'none';
    gameInterval = setInterval(gameLoop, 20);
    obstacleInterval = setInterval(generateObstacle, 1000); // 每秒生成一個新障礙物
  });

// 移動玩家
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && playerPosition > 0) {
    playerPosition -= 10;
  } else if (e.key === 'ArrowRight' && playerPosition < 360) {
    playerPosition += 10;
  }
  player.style.left = playerPosition + 'px';
});

// 隨機生成障礙物
function generateObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  obstacle.style.backgroundImage = `url('${randomType}')`;
  obstacle.style.left = Math.random() * 360 + 'px';
  obstacle.style.top = '-50px';
  gameArea.appendChild(obstacle);
  activeObstacles.push(obstacle);
}

// 遊戲主循環
function gameLoop() {
  score++;
  scoreBoard.textContent = `分數: ${score}`;

  activeObstacles.forEach((obstacle, index) => {
    const obstacleTop = parseInt(window.getComputedStyle(obstacle).top);
    const obstacleLeft = parseInt(window.getComputedStyle(obstacle).left);

    // 移動障礙物
    obstacle.style.top = (obstacleTop + 5) + 'px';

    // 移出畫面後移除障礙物
    if (obstacleTop > 600) {
      gameArea.removeChild(obstacle);
      activeObstacles.splice(index, 1);
    }

    // 檢查碰撞
    if (
      obstacleTop > 540 &&
      obstacleLeft > playerPosition - 40 &&
      obstacleLeft < playerPosition + 40
    ) {
      lives--;
      livesDisplay.textContent = `生命: ${lives}`;
      gameArea.removeChild(obstacle);
      activeObstacles.splice(index, 1);

      if (lives === 0) {
        clearTimeout(timer);
        endGame();
      }
    }
  });
}

// 在結束遊戲時清除倒計時
function endGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    clearInterval(countdownTimer); // 停止倒計時
    activeObstacles.forEach((obstacle) => {
      gameArea.removeChild(obstacle);
    });
    activeObstacles.length = 0;
    alert(`遊戲結束！最終分數: ${score}`);
    updateLeaderboard(score);
    startBtn.style.display = 'block';
}

// 更新排行榜
function updateLeaderboard(score) {
  const listItem = document.createElement('li');
  listItem.textContent = `分數: ${score}`;
  leaderboard.appendChild(listItem);
}

// 重置遊戲
function resetGame() {
  score = 0;
  lives = 2;
  playerPosition = 180;
  scoreBoard.textContent = `分數: 0`;
  livesDisplay.textContent = `生命: 2`;
  player.style.left = '180px';
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  activeObstacles.forEach((obstacle) => {
    gameArea.removeChild(obstacle);
  });
  activeObstacles.length = 0;
}
