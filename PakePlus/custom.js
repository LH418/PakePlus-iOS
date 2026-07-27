window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })

// ==================== 新增：视频全屏自动横屏 【原有逻辑完全未改动】 ====================
function lockLandscape() {
    if (screen?.orientation?.lock) {
        screen.orientation.lock('landscape-primary').catch(err => console.log('横屏锁定失败', err))
    }
}

function unlockOrientation() {
    if (screen?.orientation?.unlock) {
        screen.orientation.unlock()
    }
}

// 全局页面全屏监听
document.addEventListener('fullscreenchange', () => {
    document.fullscreenElement ? lockLandscape() : unlockOrientation()
})
document.addEventListener('webkitfullscreenchange', () => {
    document.webkitFullscreenElement ? lockLandscape() : unlockOrientation()
})

// 单独监听video视频进入/退出全屏（自动播放触发全屏生效）
document.addEventListener('webkitenterfullscreen', (e) => {
    if (e.target.tagName === 'VIDEO') lockLandscape()
}, true)
document.addEventListener('webkitleavefullscreen', (e) => {
    if (e.target.tagName === 'VIDEO') unlockOrientation()
}, true)

document.addEventListener('enterfullscreen', (e) => {
    if (e.target.tagName === 'VIDEO') lockLandscape()
}, true)
document.addEventListener('leavefullscreen', (e) => {
    if (e.target.tagName === 'VIDEO') unlockOrientation()
}, true)