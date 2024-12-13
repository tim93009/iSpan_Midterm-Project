// 定義聊天輸出與按鈕的 DOM 元素
const chatOutput = document.getElementById('chat-output');
const chatInput = document.getElementById('chat-input');
const translateButton = document.getElementById('translate-button');
const clearButton = document.getElementById('clear-button');
const inputLanguage = document.getElementById('input-language');
const outputLanguage = document.getElementById('output-language');
const swapLanguagesButton = document.getElementById('swap-languages'); // 雙向箭頭按鈕
const apiSourceSelect = document.getElementById('api-source'); // 選擇 API 來源
const usageInfo = document.getElementById('usage-info'); // 顯示剩餘次數區域

// 定義翻譯 API 的 URL
const apiUrls = {
    mymemory: 'https://api.mymemory.translated.net/get',
    deepl: 'https://api-free.deepl.com/v2/translate', // DeepL 免費 API (需要 API 金鑰)
    chatgpt: 'https://api.openai.com/v1/chat/completions', // 需要 API 金鑰
    gemini: 'https://api.gemini.com/v1/translate', // 新增 Gemini API URL
    claude: 'https://api.claude.com/v1/translate' // 新增 Claude API URL
};

// 用於追蹤 API 使用次數的計數器
let chatGptUsageCount = 0; // ChatGPT 翻譯使用次數
let deeplUsageCount = 0; // DeepL 翻譯使用次數
let geminiUsageCount = 0; // Gemini 翻譯使用次數
let claudeUsageCount = 0; // Claude 翻譯使用次數

// 顯示剩餘使用次數
function updateUsageInfo(apiSource) {
    if (apiSource === 'mymemory') {
      usageInfo.innerHTML = `MyMemory 翻譯剩餘次數: 無限制`;
    } else if (apiSource === 'deepl') {
      usageInfo.innerHTML = `DeepL 翻譯剩餘次數: ${500000 - deeplUsageCount} 字符 (每月免費配額)`;
    } else if (apiSource === 'chatgpt') {
      usageInfo.innerHTML = `ChatGPT 翻譯剩餘次數: ${100 - chatGptUsageCount} (上限 100 次)`;
    } else if (apiSource === 'gemini') {
      usageInfo.innerHTML = `Gemini 翻譯剩餘次數: 無限制`; // 假設 Gemini 沒有限制
    } else if (apiSource === 'claude') {
      usageInfo.innerHTML = `Claude 翻譯剩餘次數: 無限制`; // 假設 Claude 沒有限制
    }
}

// 監聽 API 選擇改變
apiSourceSelect.addEventListener('change', () => {
    const apiSource = apiSourceSelect.value;
    updateUsageInfo(apiSource);  // 當 API 選擇改變時，更新剩餘次數
});
  
// 監聽按鈕點擊事件
translateButton.addEventListener('click', () => {
    const message = chatInput.value.trim(); // 獲取輸入訊息
    if (!message) return; // 如果為空，則不執行
  
    // 獲取選擇的語言對
    const inputLang = inputLanguage.value;
    const outputLang = outputLanguage.value;
    const apiSource = apiSourceSelect.value; // 獲取選擇的 API 來源
    // 取得翻譯中的 DOM 元素
    const loadingIndicator = document.getElementById('loading');
  
    // 顯示翻譯中的動畫
    loadingIndicator.style.display = 'flex';
    chatOutput.style.display = 'none';
  
    // 根據選擇的 API 來源進行翻譯
    if (apiSource === 'mymemory') {
      const mymemoryApiUrl = apiUrls.mymemory;
      fetch(`${mymemoryApiUrl}?q=${encodeURIComponent(message)}&langpair=${inputLang}|${outputLang}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            throw new Error(data.error.message);
          }
          const translatedText = data.responseData.translatedText;
          chatOutput.innerHTML = translatedText.replace(/\n/g, '<br>');
          chatOutput.style.display = 'block';
          chatOutput.scrollTop = chatOutput.scrollHeight;
        })
        .catch(error => {
          console.error('翻譯失敗:', error);
          alert('翻譯服務目前無法使用，請稍後再試。');
        })
        .finally(() => {
          updateUsageInfo('mymemory'); // 更新剩餘次數
          loadingIndicator.style.display = 'none';
        });
    } else if (apiSource === 'deepl') {
      const apiKey = 'YOUR_DEEPL_API_KEY'; // 用戶需填寫自己的 DeepL API 密鑰
      fetch(apiUrls.deepl, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `text=${encodeURIComponent(message)}&source_lang=${inputLang}&target_lang=${outputLang}`
      })
        .then(response => response.json())
        .then(data => {
          const translatedText = data.translations[0].text;
          chatOutput.innerHTML = translatedText.replace(/\n/g, '<br>');
          chatOutput.style.display = 'block';
          chatOutput.scrollTop = chatOutput.scrollHeight;
        })
        .catch(error => {
          console.error('翻譯失敗:', error);
          alert('翻譯服務目前無法使用，請稍後再試。');
        })
        .finally(() => {
          deeplUsageCount += 1; // 增加 DeepL 使用次數
          updateUsageInfo('deepl'); // 更新剩餘次數
          loadingIndicator.style.display = 'none';
        });
    } else if (apiSource === 'chatgpt') {
      const apiKey = ''; // 用戶需填寫自己的 ChatGPT API 密鑰
      fetch(apiUrls.chatgpt, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }]
        })
      })
        .then(response => response.json())
        .then(data => {
          const translatedText = data.choices[0].message.content;
          chatOutput.innerHTML = translatedText.replace(/\n/g, '<br>');
          chatOutput.style.display = 'block';
          chatOutput.scrollTop = chatOutput.scrollHeight;
        })
        .catch(error => {
          console.error('翻譯失敗:', error);
          alert('翻譯服務目前無法使用，請稍後再試。');
        })
        .finally(() => {
          chatGptUsageCount += 1; // 增加 ChatGPT 使用次數
          updateUsageInfo('chatgpt'); // 更新剩餘次數
          loadingIndicator.style.display = 'none';
        });
    } else if (apiSource === 'gemini') {
      const geminiApiUrl = apiUrls.gemini;
      fetch(geminiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          sourceLang: inputLang,
          targetLang: outputLang
        })
      })
        .then(response => response.json())
        .then(data => {
          const translatedText = data.translatedText;
          chatOutput.innerHTML = translatedText.replace(/\n/g, '<br>');
          chatOutput.style.display = 'block';
          chatOutput.scrollTop = chatOutput.scrollHeight;
        })
        .catch(error => {
          console.error('翻譯失敗:', error);
          alert('翻譯服務目前無法使用，請稍後再試。');
        })
        .finally(() => {
          geminiUsageCount += 1; // 增加 Gemini 使用次數
          updateUsageInfo('gemini'); // 更新剩餘次數
          loadingIndicator.style.display = 'none';
        });
    } else if (apiSource === 'claude') {
      const claudeApiUrl = apiUrls.claude;
      fetch(claudeApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          sourceLang: inputLang,
          targetLang: outputLang
        })
      })
        .then(response => response.json())
        .then(data => {
          const translatedText = data.translatedText;
          chatOutput.innerHTML = translatedText.replace(/\n/g, '<br>');
          chatOutput.style.display = 'block';
          chatOutput.scrollTop = chatOutput.scrollHeight;
        })
        .catch(error => {
          console.error('翻譯失敗:', error);
          alert('翻譯服務目前無法使用，請稍後再試。');
        })
        .finally(() => {
          claudeUsageCount += 1; // 增加 Claude 使用次數
          updateUsageInfo('claude'); // 更新剩餘次數
          loadingIndicator.style.display = 'none';
        });
    }
});

// 監聽清空按鈕點擊事件
clearButton.addEventListener('click', () => {
    chatInput.value = ''; // 清空輸入框
    chatOutput.innerHTML = ''; // 清空聊天輸出區域
    usageInfo.innerHTML = ''; // 清空剩餘使用次數
});

// 監聽 Enter 鍵事件，當按下 Enter 時觸發翻譯按鈕的點擊事件
chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // 防止換行
        translateButton.click(); // 觸發翻譯按鈕的點擊事件
    }
});

// 初始設置
// 初次載入頁面時顯示 MyMemory 的使用次數
updateUsageInfo(apiSourceSelect.value); // 初始設置顯示剩餘次數

// 監聽交換語言按鈕點擊事件
swapLanguagesButton.addEventListener('click', () => {
    const temp = inputLanguage.value;
    inputLanguage.value = outputLanguage.value;
    outputLanguage.value = temp;
});
