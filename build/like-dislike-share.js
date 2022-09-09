// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     2.1.4
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==
function e(e, t, n, r, o, i, c) {
    try {
        var l = e[i](c), a = l.value;
    } catch (u) {
        n(u);
        return;
    }
    l.done ? t(a) : Promise.resolve(a).then(r, o);
}
let t, n, r, o, i = 0;
function c(e) {
    return new Promise((t)=>{
        let n = document.getElementById(e);
        if (n) {
            t(n);
            return;
        }
        let r = new MutationObserver((n)=>{
            n.forEach((n)=>{
                let o = Array.from(n.addedNodes).find((t)=>{
                    var n;
                    let r = t;
                    return r.id === e || (null === (n = r.parentElement) || void 0 === n ? void 0 : n.id) === e;
                });
                if (o) {
                    t(o), i = 0, r.disconnect();
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
    var t;
    return (l = (t = function*(e) {
        e.click();
        let t = performance.now(), n = yield c("close-button"), r = yield c("copy-button").then((e)=>e.getElementsByTagName("button")[0]), o = performance.now();
        i ? setTimeout(()=>{
            n.click(), r.click();
        }, i) : (i = o - t, n.click(), r.click());
        let l = document.getElementById("share-url");
        navigator.clipboard.writeText(l.value);
    }, function() {
        var n = this, r = arguments;
        return new Promise(function(o, i) {
            var c = t.apply(n, r);
            function l(t) {
                e(c, o, i, l, a, "next", t);
            }
            function a(t) {
                e(c, o, i, l, a, "throw", t);
            }
            l(void 0);
        });
    })).apply(this, arguments);
}
function a() {
    if (!/^\/watch/.test(location.pathname)) {
        t = !1;
        return;
    }
    t = !0;
    let e = document.getElementsByTagName("ytd-video-primary-info-renderer");
    if (1 === e.length) {
        let i = e[0].getElementsByTagName("button");
        n = i[0], r = i[1], o = i[2];
    } else n = null, r = null, o = null;
}
a();
const u = new MutationObserver(a);
u.observe(document.documentElement, {
    childList: !0,
    subtree: !0
}), addEventListener("keypress", (e)=>{
    if (!t) return;
    let i = e.target;
    if ("true" === i.getAttribute("contenteditable")) return;
    let c = i.tagName.toLowerCase();
    "input" !== c && "textarea" !== c && ("BracketLeft" === e.code && n ? n.click() : "BracketRight" === e.code && r ? r.click() : "Backslash" === e.code && o && function(e) {
        return l.apply(this, arguments);
    }(o));
});
