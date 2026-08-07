window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
(function () {
    if (window.__pakeHookClickInjected) return;
    window.__pakeHookClickInjected = true;

    const originalWindowOpen = window.open;
    const WHITE_ORIGIN = "https://xlgame.icu";

    /** 判断url是否属于白名单域名 */
    function isWhiteUrl(url) {
        if (!url) return false;
        try {
            const u = new URL(url, window.location.origin);
            // 匹配白名单域名
            return u.origin === WHITE_ORIGIN;
        } catch (e) {
            // 无效url（相对路径、非法地址）返回false
            return false;
        }
    }

    const hookClick = function (e) {
        if (e.defaultPrevented) return;
        const origin = e.target.closest('a');
        if (!origin) return;

        const href = origin.getAttribute('href') || '';
        // 跳过伪协议、空链接、页内锚点
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('data:')) {
            return;
        }

        const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');
        const aTarget = origin.target;

        // 只有 _blank / base target="_blank" 并且链接属于白名单域名，才接管在当前窗口打开
        if ((aTarget === '_blank' || isBaseTargetBlank) && isWhiteUrl(href)) {
            e.preventDefault();
            location.href = href;
        }
        // 其他情况：不 preventDefault，原样放行！
        // 外部域名、下载链接，交给Pake底层，自动唤起系统浏览器
    };

    window.open = function (url, target, features) {
        if (!url) {
            return originalWindowOpen.call(window, url, target, features);
        }
        // 白名单域名：当前页面跳转
        if (isWhiteUrl(url)) {
            location.href = url;
            return {
                close: function () {},
                focus: function () {},
                blur: function () {},
                location: {}
            };
        } else {
            // 外部域名、下载、其他弹窗：调用原生window.open，交给Pake处理系统浏览器
            return originalWindowOpen.call(window, url, target, features);
        }
    };

    document.addEventListener('click', hookClick, { capture: true });

    window.__pakeUninstallHook = function () {
        document.removeEventListener('click', hookClick, { capture: true });
        window.open = originalWindowOpen;
        delete window.__pakeHookClickInjected;
        delete window.__pakeUninstallHook;
    };
})();