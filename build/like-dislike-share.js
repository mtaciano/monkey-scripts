// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     2.0.1
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==
let e, t, a, l, c, n, i;
async function g() {
    await i.click(), await i.click(), await new Promise((e)=>setTimeout(e, 600)), document.getElementById("copy-button")?.click(), navigator.clipboard.writeText(document.getElementById("share-url").value);
}
function r() {
    if (!/^\/watch/.test(location.pathname)) {
        e = !1;
        return;
    }
    e = !0, 1 == (t = document.getElementsByTagName("ytd-video-primary-info-renderer")).length ? (l = (a = t[0].getElementsByTagName("button"))[0], c = a[1], i = "Share" === a[2].getAttribute("aria-label") ? a[2] : a[3]) : (l = null, c = null, i = null);
}
r();
new MutationObserver(r).observe(document.documentElement, {
    childList: !0,
    subtree: !0
}), addEventListener("keypress", (t)=>{
    if (e) "true" != t.target.getAttribute("contenteditable") && "input" != (n = t.target.tagName.toLowerCase()) && "textarea" != n && ("BracketLeft" == t.code && l ? l.click() : "BracketRight" == t.code && c ? c.click() : "Backslash" == t.code && i && g());
});
