document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.getElementById("submitBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const content = document.getElementById("content");

    // 解析 URL 參數
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.slice(1); // 移除 "?" 符號
        queryString.split("&").forEach(pair => {
            const [key, value] = pair.split("=");
            if (key && value) {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        });
        return params;
    }

    // 將文章資料填入表單，並調整按鈕文字（新增/編輯）
    function populateForm() {
        const params = getQueryParams();
        if (params.title && params.content) {
            // 編輯模式：填充表單
            submitBtn.textContent = "確定編輯"; // 修改按鈕文字為“確定編輯”
            document.getElementById("title").value = params.title; // 設定標題
            content.innerHTML = params.content; // 設定內容
        }
    }

    // 初始化畫面，填充表單資料
    populateForm();

    // 確認按鈕功能：新增或編輯文章
    submitBtn.addEventListener("click", function () {
        const title = document.getElementById("title").value; // 取得標題
        const articleContent = content.innerHTML; // 取得文章內容（HTML格式）
        const params = getQueryParams(); // 取得 URL 參數

        // 檢查標題和內容是否有填寫
        if (title && articleContent) {
            const encodedTitle = encodeURIComponent(title); // URL 編碼標題
            const encodedContent = encodeURIComponent(articleContent); // URL 編碼內容

            // 判斷是否來自編輯模式
            if (params.id) {
                // 編輯模式：帶回文章 ID 和更新內容
                const articleId = encodeURIComponent(params.id); // URL 編碼文章 ID
                window.location.href = `c001.html?mode=edit&id=${articleId}&title=${encodedTitle}&content=${encodedContent}`;
            } else {
                // 新增模式：直接新增
                window.location.href = `c001.html?mode=add&title=${encodedTitle}&content=${encodedContent}`;
            }
        } else {
            alert("請填寫標題和內容！"); // 沒有填寫標題或內容時提示
        }
    });

    // 取消按鈕功能：跳轉回 c001.html
    cancelBtn.addEventListener("click", function () {
        window.location.href = "c001.html"; // 跳轉到 c001.html
    });
});
