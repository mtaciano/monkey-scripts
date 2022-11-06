// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     2.2.2
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==
let e, t, n, r;
function i(e, t, n, r, i, o, l) {
    try {
        var u = e[o](l), c = u.value;
    } catch (a) {
        n(a);
        return;
    }
    u.done ? t(c) : Promise.resolve(c).then(r, i);
}
function o(e) {
    return new Promise((t)=>{
        let n = document.getElementById(e);
        if (n) {
            t(n);
            return;
        }
        let r = new MutationObserver((n)=>{
            n.forEach((n)=>{
                let i = Array.from(n.addedNodes).find((t)=>{
                    var n;
                    return t.id === e || (null === (n = t.parentElement) || void 0 === n ? void 0 : n.id) === e;
                });
                if (i) {
                    t(i), r.disconnect();
                    return;
                }
            });
        });
        r.observe(document.body, {
            childList: !0,
            subtree: !0
        });
    });
}
function l() {
    var e;
    return e = function*(e) {
        e.click();
        let t = yield o("close-button"), n = yield o("copy-button").then((e)=>e.getElementsByTagName("button")[0]);
        setTimeout(()=>{
            t.click(), n.click();
        }, 150);
        let r = document.getElementById("share-url");
        navigator.clipboard.writeText(r.value);
    }, (l = function() {
        var t = this, n = arguments;
        return new Promise(function(r, o) {
            var l = e.apply(t, n);
            function u(e) {
                i(l, r, o, u, c, "next", e);
            }
            function c(e) {
                i(l, r, o, u, c, "throw", e);
            }
            u(void 0);
        });
    }).apply(this, arguments);
}
function u() {
    if (!/^\/watch/.test(location.pathname)) {
        e = !1;
        return;
    }
    e = !0;
    let i = document.querySelector("div #actions-inner");
    if (null !== i) {
        let o = i.getElementsByTagName("button");
        null != o && (t = o[0], n = o[1], r = o[2]);
    } else t = null, n = null, r = null;
}
u();
const c = new MutationObserver(u);
c.observe(document.documentElement, {
    childList: !0,
    subtree: !0
}), addEventListener("keypress", (i)=>{
    if (!e) return;
    let o = i.target;
    if ("true" === o.getAttribute("contenteditable")) return;
    let u = o.tagName.toLowerCase();
    "input" !== u && "textarea" !== u && ("BracketLeft" === i.code && t ? t.click() : "BracketRight" === i.code && n ? n.click() : "Backslash" === i.code && r && function(e) {
        return l.apply(this, arguments);
    }(r));
});
