// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     2.1.0
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==
let e, t, n, l;
function c(e) {
    return new Promise((t)=>{
        let n = document.getElementById(e);
        if (n) {
            t(n);
            return;
        }
        let l = new MutationObserver((n)=>{
            n.forEach((n)=>{
                let c = Array.from(n.addedNodes).find((t)=>{
                    let n = t;
                    return n.parentElement?.id === e || n.id === e;
                });
                if (c) {
                    t(c), l.disconnect();
                    return;
                }
            });
        });
        l.observe(document.body, {
            childList: !0,
            subtree: !0
        });
    });
}
async function i(e) {
    e.click();
    let t = await c("close-button"), n = await c("copy-button");
    t.click(), n.click(), navigator.clipboard.writeText(document.getElementById("share-url").value);
}
function r() {
    if (!/^\/watch/.test(location.pathname)) {
        e = !1;
        return;
    }
    e = !0;
    let c = document.getElementsByTagName("ytd-video-primary-info-renderer");
    if (1 == c.length) {
        let i = c[0].getElementsByTagName("button");
        t = i[0], n = i[1], l = i[2];
    } else t = null, n = null, l = null;
}
r();
const a = new MutationObserver(r);
a.observe(document.documentElement, {
    childList: !0,
    subtree: !0
}), addEventListener("keypress", (c)=>{
    if (!e || "true" == c.target.getAttribute("contenteditable")) return;
    let r = c.target.tagName.toLowerCase();
    "input" != r && "textarea" != r && ("BracketLeft" == c.code && t ? t.click() : "BracketRight" == c.code && n ? n.click() : "Backslash" == c.code && l && i(l));
});
