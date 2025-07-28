// 主題切換功能
(function() {
    // 獲取當前主題
    function getCurrentTheme() {
        return localStorage.getItem('theme') || 'auto';
    }

    // 設定主題
    function setTheme(theme) {
        localStorage.setItem('theme', theme);
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        updateToggleButton();
    }

    // 更新切換按鈕圖示
    function updateToggleButton() {
        const button = document.getElementById('theme-toggle');
        if (!button) return;
        
        const currentTheme = getCurrentTheme();
        const isDark = currentTheme === 'dark' || 
            (currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        button.innerHTML = isDark ? '☀️' : '🌙';
        button.title = isDark ? '切換到淺色模式' : '切換到深色模式';
    }

    // 切換主題
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const isDark = currentTheme === 'dark' || 
            (currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        setTheme(isDark ? 'light' : 'dark');
    }

    // 創建切換按鈕
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'theme-toggle';
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', '切換深色/淺色模式');
        button.addEventListener('click', toggleTheme);
        
        document.body.appendChild(button);
        updateToggleButton();
    }

    // 監聽系統主題變化
    function watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(updateToggleButton);
    }

    // 初始化
    function init() {
        // 設定初始主題
        setTheme(getCurrentTheme());
        
        // 創建切換按鈕
        createToggleButton();
        
        // 監聽系統主題變化
        watchSystemTheme();
    }

    // DOM 載入完成後初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
