// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     2.1.1
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==
let e, t, l, n, c;
function i(e) {
    return new Promise((l)=>{
        let n = document.getElementById(e);
        if (n) {
            t = !0, l(n);
            return;
        }
        let c = new MutationObserver((n)=>{
            n.forEach((n)=>{
                let i = Array.from(n.addedNodes).find((t)=>{
                    let l = t;
                    return l.parentElement?.id === e || l.id === e;
                });
                if (i) {
                    t = !1, l(i), c.disconnect();
                    return;
                }
            });
        });
        c.observe(document.body, {
            childList: !0,
            subtree: !0
        });
    });
}
async function r(e) {
    e.click();
    let l = await i("close-button"), n = await i("copy-button");
    t ? (setTimeout(()=>{
        l.click();
    }, 600), setTimeout(()=>{
        n.click();
    }, 600)) : (l.click(), n.click()), navigator.clipboard.writeText(document.getElementById("share-url").value);
}
function a() {
    if (!/^\/watch/.test(location.pathname)) {
        e = !1;
        return;
    }
    e = !0;
    let t = document.getElementsByTagName("ytd-video-primary-info-renderer");
    if (1 == t.length) {
        let i = t[0].getElementsByTagName("button");
        l = i[0], n = i[1], c = i[2];
    } else l = null, n = null, c = null;
}
a();
const d = new MutationObserver(a);
d.observe(document.documentElement, {
    childList: !0,
    subtree: !0
}), addEventListener("keypress", (t)=>{
    if (!e || "true" == t.target.getAttribute("contenteditable")) return;
    let i = t.target.tagName.toLowerCase();
    "input" != i && "textarea" != i && ("BracketLeft" == t.code && l ? l.click() : "BracketRight" == t.code && n ? n.click() : "Backslash" == t.code && c && r(c));
});
