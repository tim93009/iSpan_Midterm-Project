// 綁定開始按鈕事件，點擊時啟動占卜邏輯
document.getElementById('start-button').addEventListener('click', function () {
    startFortuneTelling();
});

// 綁定重新占卜按鈕事件，點擊後重置占卜狀態
document.getElementById('start-button-after').addEventListener('click', function () {
    resetFortuneTelling();
});

// 綁定重新占卜按鈕事件，點擊後重置占卜狀態
document.addEventListener("DOMContentLoaded", function () {
    createFallingLeaves(); // 初始化葉子效果
    const content = document.querySelector(".content");
    content.classList.add("animate-content"); // 將動畫類別加入主要內容區域
});

// 綁定重新占卜按鈕事件，點擊後重置占卜狀態
function startFortuneTelling() {
    const results = ['大吉', '小吉', '小兇', '大兇']; // 運勢選項
    const positiveAdvice = [
        "今天是你的幸運日，積極行動會有好的結果！",
        "無論做什麼，今天都有很好的機會，趕快把握！",
        "今天適合進行新的嘗試，會有正面的回報！",
        "運氣非常好，別猶豫，去追求你的夢想吧！"
    ];
    const negativeAdvice = [
        "今天要小心，避免做出衝動的決定。",
        "運勢不佳，最好避免冒險，保持謹慎。",
        "今天不是外出旅行的好日子，盡量待在家中。",
        "避免過度自信，今天適合低調行事。"
    ];
    const luckyItems = [
        { name: '花枝丸', img: '../image/flower_ball.jpg', link: '../b/b001.html' },  // 在這裡加上每個幸運好物的連結
        { name: '貢丸', img: '../image/cong_ball.jpg', link: '../b/b001.html' },
        { name: '虱目魚丸', img: '../image/fish_ball.jpg', link: '../b/b001.html' }
    ];

    // 動畫與結果處理
    const animation = document.getElementById('animation');
    const resultDiv = document.getElementById('result');
    const adviceDiv = document.getElementById('advice');
    const luckyItemDiv = document.getElementById('lucky-item');
    const startButton = document.getElementById('start-button');
    const buttonWrapperAfter = document.querySelector('.button-wrapper-after');
    
    resultDiv.style.display = 'none';
    adviceDiv.style.display = 'none';
    luckyItemDiv.style.display = 'none';
    animation.style.display = 'block'; // 顯示動畫
    startButton.style.display = 'none'; // 隱藏按鈕
    buttonWrapperAfter.style.display = 'none';

    setTimeout(() => {
        animation.style.display = 'none';

        const randomResult = results[Math.floor(Math.random() * results.length)];
        document.getElementById('fortune-text').textContent = randomResult;

        const randomAdvice = randomResult.includes("吉")
            ? positiveAdvice[Math.floor(Math.random() * positiveAdvice.length)]
            : negativeAdvice[Math.floor(Math.random() * negativeAdvice.length)];

        const luckyItem = luckyItems[Math.floor(Math.random() * luckyItems.length)];

        adviceDiv.innerHTML = `
            <div class="advice-title">建議：</div>
            <div class="advice-text">${randomAdvice}</div>
        `;

        luckyItemDiv.innerHTML = `
            <div class="lucky-title">幸運好物：</div>
            <div class="lucky-item">
                <!-- 新增：名稱顯示在圖片正上方 -->
                <div class="lucky-name">${luckyItem.name}</div>
                <!-- 新增：圖片包裹在連結中，點擊時跳轉到相關頁面 -->
                <a href="${luckyItem.link}" target="_self">
                    <img src="${luckyItem.img}" alt="${luckyItem.name}">
                </a>
            </div>
        `;

        resultDiv.style.display = 'block';
        adviceDiv.style.display = 'block';
        luckyItemDiv.style.display = 'block';
        buttonWrapperAfter.style.display = 'block';
    }, 2000);
}

// 重置占卜狀態
function resetFortuneTelling() {
    // 隱藏占卜結果區域
    document.getElementById('result').style.display = 'none';
    document.getElementById('advice').style.display = 'none';
    document.getElementById('lucky-item').style.display = 'none';
    document.querySelector('.button-wrapper-after').style.display = 'none';

    // 重新啟動占卜
    startFortuneTelling();
}

// 隨機生成楓葉吹落效果
function createFallingLeaves() {
    const leafTypes = ['🍁', '🍂', '🌿']; // 多種葉子符號
    const numberOfLeaves = 10; // 生成的葉子數量

    for (let i = 0; i < numberOfLeaves; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        leaf.textContent = leafTypes[Math.floor(Math.random() * leafTypes.length)];

        // 隨機設定葉子初始水平位置
        leaf.style.left = Math.random() * 100 + '%';
        // 隨機設定動畫持續時間
        leaf.style.animationDuration = Math.random() * 3 + 3 + 's';
        // 隨機設定動畫的水平位移幅度 (新增動畫變化)
        leaf.style.transform = `translateX(${Math.random() * 50 - 25}px)`;

        document.body.appendChild(leaf); // 添加到整個頁面範圍
    }
}

// 初始化頁面，生成葉子效果
createFallingLeaves(); // 執行時即可生成全頁葉子

