// 假設這是文章的數據，現在加上一筆測試資料
let articles = JSON.parse(localStorage.getItem("articles")) || [
  { title: "測試文章", content: "這是測試文章的內容。" }
]; // ✅ 修正：初始化時從 localStorage 讀取，沒有資料則使用預設值

// 當頁面加載完成時，執行初始化函數
document.addEventListener("DOMContentLoaded", function () {
  initializePage();
});

// 初始化頁面
function initializePage() {
  checkForNewArticle(); // 檢查是否有新增或編輯文章的資料

  const articleList = document.getElementById("articleList");
  if (articleList) {
    displayArticles(); // 顯示文章列表
  }

  const addArticleBtn = document.getElementById("addArticleBtn");
  if (addArticleBtn) {
    addArticleBtn.addEventListener("click", function () {
      window.location.href = "./c001_add.html";
    });
  }
}

// 檢查是否有來自 c001_add.js 傳來的新文章資料
function checkForNewArticle() {
  const urlParams = new URLSearchParams(window.location.search);
  const newTitle = urlParams.get("title");
  const newContent = urlParams.get("content");
  const articleIndex = urlParams.get("id"); // 使用 'id' 來識別文章

  if (newTitle && newContent) {
    if (articleIndex !== null) {
      // ✅ 修改現有文章資料：如果提供了 'id'，則更新該篇文章
      articles[articleIndex] = { title: newTitle, content: newContent }; // 更新資料
    } else {
      // ✅ 新增文章資料：如果沒有提供 'id'，則當作新增文章處理
      articles.push({ title: newTitle, content: newContent });
    }
    saveArticlesToLocalStorage(); // 儲存到 localStorage
    history.replaceState(null, "", window.location.pathname); // 清除 URL 參數，避免頁面重新加載時再次進行新增
    displayArticles(); // 更新文章列表
  }
}

// 將文章資料保存到 localStorage 的函數
function saveArticlesToLocalStorage() {
  localStorage.setItem("articles", JSON.stringify(articles)); // ✅ 將 articles 陣列轉成 JSON 字串並存入 localStorage
}

// 顯示文章列表的函數
function displayArticles() {
  const articleList = document.getElementById("articleList");
  if (!articleList) {
    console.error("找不到文章列表元素！");
    return;
  }

  articleList.innerHTML = ""; // 清空現有的 DOM

  if (articles.length === 0) {
    articleList.innerHTML = "<p>目前沒有文章資料。</p>";
  } else {
    articles.forEach((article, index) => {
      const articleElement = document.createElement("div");
      articleElement.classList.add("article-item");

      // ✅ 修改：新增編輯與刪除按鈕
      articleElement.innerHTML = `
        <h2>${article.title}</h2>
        <p>${article.content}</p>
        <button class="edit-btn" onclick="editArticle(${index})">編輯</button>
        <button class="delete-btn" onclick="deleteArticle(${index})">刪除</button>
      `;

      articleList.appendChild(articleElement);
    });
  }
}

// 編輯文章的函數
function editArticle(index) {
  const article = articles[index];
  const editUrl = `c001_add.html?id=${index}&title=${encodeURIComponent(article.title)}&content=${encodeURIComponent(article.content)}`;
  window.location.href = editUrl; // 跳轉到新增頁面，並附加文章資料
}

// 刪除文章的函數
function deleteArticle(index) {
  articles.splice(index, 1); // 刪除對應索引的文章
  saveArticlesToLocalStorage(); // 更新 localStorage
  displayArticles(); // 重新渲染文章列表
}
