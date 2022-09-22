// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     2.2.0
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==
function e(e, t, n, o, r, l, c) {
    try {
        var i = e[l](c), a = i.value;
    } catch (u) {
        n(u);
        return;
    }
    i.done ? t(a) : Promise.resolve(a).then(o, r);
}
let t, n, o, r, l = 0, c = "";
function i(e) {
    return new Promise((t)=>{
        let n = document.getElementById(e);
        if (n) {
            t(n);
            return;
        }
        let o = new MutationObserver((n)=>{
            n.forEach((n)=>{
                let r = Array.from(n.addedNodes).find((t)=>{
                    var n;
                    return t.id === e || (null === (n = t.parentElement) || void 0 === n ? void 0 : n.id) === e;
                });
                if (r) {
                    t(r), o.disconnect();
                    return;
                }
            });
        });
        o.observe(document.body, {
            childList: !0,
            subtree: !0
        });
    });
}
function a() {
    var t;
    return t = function*(e) {
        e.click();
        let t = performance.now(), n = yield i("close-button"), o = yield i("copy-button").then((e)=>e.getElementsByTagName("button")[0]), r = performance.now(), c = r - t;
        l || c <= 150 ? setTimeout(()=>{
            n.click(), o.click();
        }, Math.max(150, l, c)) : (n.click(), o.click()), 0 === l == !0 && (l = Math.max(150, c)), console.log(l);
        let a = document.getElementById("share-url");
        navigator.clipboard.writeText(a.value);
    }, (a = function() {
        var n = this, o = arguments;
        return new Promise(function(r, l) {
            var c = t.apply(n, o);
            function i(t) {
                e(c, r, l, i, a, "next", t);
            }
            function a(t) {
                e(c, r, l, i, a, "throw", t);
            }
            i(void 0);
        });
    }).apply(this, arguments);
}
function u() {
    if (!/^\/watch/.test(location.pathname)) {
        t = !1;
        return;
    }
    c !== location.href && (console.log(c), console.log(location.href), l = 0), c = location.href, t = !0;
    let e = document.getElementsByTagName("ytd-watch-metadata");
    if (1 === e.length) {
        let i = e[0].querySelector("div #actions");
        if (null != i) {
            let a = i.getElementsByTagName("button");
            n = a[0], o = a[1], r = a[2];
        }
    } else n = null, o = null, r = null;
}
u();
const d = new MutationObserver(u);
d.observe(document.documentElement, {
    childList: !0,
    subtree: !0
}), addEventListener("keypress", (e)=>{
    if (!t) return;
    let l = e.target;
    if ("true" === l.getAttribute("contenteditable")) return;
    let c = l.tagName.toLowerCase();
    "input" !== c && "textarea" !== c && ("BracketLeft" === e.code && n ? n.click() : "BracketRight" === e.code && o ? o.click() : "Backslash" === e.code && r && function(e) {
        return a.apply(this, arguments);
    }(r));
});
