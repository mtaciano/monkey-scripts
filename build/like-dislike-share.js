// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     2.1.2
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==
function e(e, t, n, r, l, i, c) {
    try {
        var o = e[i](c), a = o.value;
    } catch (u) {
        n(u);
        return;
    }
    o.done ? t(a) : Promise.resolve(a).then(r, l);
}
let t, n, r, l, i = 0;
function c(e) {
    return new Promise((t)=>{
        let n = document.getElementById(e);
        if (n) {
            t(n);
            return;
        }
        let r = new MutationObserver((n)=>{
            n.forEach((n)=>{
                let l = Array.from(n.addedNodes).find((t)=>{
                    var n;
                    let r = t;
                    return r.id === e || (null === (n = r.parentElement) || void 0 === n ? void 0 : n.id) === e;
                });
                if (l) {
                    t(l), i = 0, r.disconnect();
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
function o() {
    var t;
    return (o = (t = function*(e) {
        e.click();
        let t = performance.now(), n = yield c("close-button"), r = yield c("copy-button").then((e)=>e.getElementsByTagName("button")[0]), l = performance.now();
        i ? setTimeout(()=>{
            n.click(), r.click();
        }, i) : (i = l - t, n.click(), r.click()), navigator.clipboard.writeText(document.getElementById("share-url").value);
    }, function() {
        var n = this, r = arguments;
        return new Promise(function(l, i) {
            var c = t.apply(n, r);
            function o(t) {
                e(c, l, i, o, a, "next", t);
            }
            function a(t) {
                e(c, l, i, o, a, "throw", t);
            }
            o(void 0);
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
    if (1 == e.length) {
        let i = e[0].getElementsByTagName("button");
        n = i[0], r = i[1], l = i[2];
    } else n = null, r = null, l = null;
}
a();
const u = new MutationObserver(a);
u.observe(document.documentElement, {
    childList: !0,
    subtree: !0
}), addEventListener("keypress", (e)=>{
    if (!t || "true" == e.target.getAttribute("contenteditable")) return;
    let i = e.target.tagName.toLowerCase();
    "input" != i && "textarea" != i && ("BracketLeft" == e.code && n ? n.click() : "BracketRight" == e.code && r ? r.click() : "Backslash" == e.code && l && function(e) {
        return o.apply(this, arguments);
    }(l));
});
