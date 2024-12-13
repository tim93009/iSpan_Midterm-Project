// 人物和說的話的對應資料
const personData  = [
    { name: "王世堅", image: "image/Wang Shijian.jpg", quotes: ["over my dead body!!!"] },
    { name: "韓國瑜", image: "image/Han Kuoyu.jpg", quotes: ["放馬過來！恁北淡麗！"] },
    { name: "蘇貞昌", image: "image/Su Tseng-chang.jpg", quotes: ["在那叫什麼？"] },
    { name: "亞洲統神", image: "image/Asia God Tone.jpg", quotes: ["欸你過來一下~~"] },
    { name: "國棟", image: "image/Guo Dong.jpg", quotes: ["為什麼不幫我發大絕? 極靈~"] },
    { name: "館長", image: "image/GuanZhang.jpg", quotes: ["請大家一定要傳承我的精神~"] },
    { name: "破壞之王", image: "image/King of Destruction.png", quotes: ["在座各位，程式都要多練點~"] }
];

let currentPersonIndex = 0;
let displayedPersonIndexes = []; // 用來存放已顯示人物的索引

// 更新圖片並觸發動畫
function updatePersonImage(personImage, currentPerson, callback) {
    const quoteText = document.getElementById('quote-text'); // 取得詩詞顯示區域
    const quoteDisplay = document.getElementById('quote-display'); // 取得說話框區域

    // 在更新圖片之前，隱藏說話框及文字
    quoteDisplay.style.opacity = 0; // 隱藏說話框
    quoteText.style.opacity = 0;    // 隱藏文字

    personImage.src = currentPerson.image; // 設置圖片來源
    personImage.style.animation = 'none'; // 重置動畫
    personImage.offsetHeight; // 強制重繪以觸發動畫
    personImage.style.animation = 'imageEffect 2s ease-in-out'; // 重新啟動動畫

    // 等待圖片顯示完成後再執行回調
    personImage.addEventListener('animationend', function onEnd() {
        personImage.removeEventListener('animationend', onEnd); // 移除事件監聽器
        if (callback) callback(); // 回調顯示話語
    });
}


// 打字機效果
function typeQuote(text, element, callback) {
    const placeholder = "　\n".repeat(2); // 用全形空格占位
    let i = 0;
    
    element.textContent = placeholder; // 初始化為占位符
    element.style.opacity = 1; // 開始時文字應該可見，不要完全隱藏
    
    const fadeOut = setInterval(() => {
        if (i < placeholder.length) {
            element.textContent = placeholder.slice(0, placeholder.length - i); // 逐步刪除文字
            i++;
        } else {
            clearInterval(fadeOut); // 刪除佔位符後
            const interval = setInterval(() => {
                if (i < text.length) {
                    element.textContent = placeholder + text.slice(0, i + 1);
                    i++;
                } else {
                    clearInterval(interval);
                    if (callback) callback(); // 顯示完畢後呼叫回調
                }
            }, 150);
        }
    }, 150);
}




// 顯示說的話並與人物對應
function displayQuoteAndPerson() {
    const quoteText = document.getElementById('quote-text');
    const personImage = document.getElementById('person-image');
    const quoteDisplay = document.getElementById('quote-display'); // 獲取說話框元素

    // 確保每個人物至少顯示一次
    if (displayedPersonIndexes.length < personData.length) {
        // 還有未顯示過的人物，隨機選擇一個未顯示過的人物
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * personData.length);
        } while (displayedPersonIndexes.includes(randomIndex)); // 確保這個人物還沒顯示過

        // 記錄已顯示的人物索引
        displayedPersonIndexes.push(randomIndex);

        const currentPerson = personData[randomIndex];
        const randomQuote = currentPerson.quotes[Math.floor(Math.random() * currentPerson.quotes.length)];

        // 更新圖片並在動畫結束後顯示話語
        updatePersonImage(personImage, currentPerson, () => {
            // 圖片顯示完成後再顯示話語
            quoteDisplay.style.opacity = 1;  // 顯示說話框
            typeQuote(randomQuote, quoteText, () => {
                setTimeout(() => {
                    // 在顯示完後，讓圖片與說話框同時隱藏
                    quoteDisplay.style.opacity = 0;  // 隱藏說話框
                    quoteText.style.opacity = 0;     // 隱藏文字
                    displayQuoteAndPerson(); // 顯示下一位話語
                }, 1000); // 等待一秒後再隱藏
            });
        });

    } else {
        // 當所有人物都顯示過一次後，隨機選擇人物
        displayedPersonIndexes = []; // 重置顯示過的索引
        displayQuoteAndPerson(); // 重置後重新隨機選擇人物
    }
}

// 初始化
// 監控背景動畫完成後顯示內容
document.addEventListener("DOMContentLoaded", () => {
    const backgroundContainer = document.querySelector('.background-container');
    const content = document.querySelector('.content');
    const title = document.querySelector('h1');

    // 等待背景動畫完成
    backgroundContainer.addEventListener('animationend', () => {
        // 等待標題動畫結束
        title.addEventListener('animationend', () => {
            // 顯示內容
            content.style.visibility = 'visible'; // 顯示內容區域
            content.style.opacity = '1'; // 顯示內容區域
            displayQuoteAndPerson(); // 開始顯示話語與人物
        });
    });
});
