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
function e(e, t, n, l, i, r, c) {
    try {
        var o = e[r](c), u = o.value;
    } catch (a) {
        n(a);
        return;
    }
    o.done ? t(u) : Promise.resolve(u).then(l, i);
}
let t, n, l, i, r = 0;
function c(e) {
    return new Promise((t)=>{
        let n = document.getElementById(e);
        if (n) {
            t(n);
            return;
        }
        let l = new MutationObserver((n)=>{
            n.forEach((n)=>{
                let i = Array.from(n.addedNodes).find((t)=>{
                    var n;
                    let l = t;
                    return l.id === e || (null === (n = l.parentElement) || void 0 === n ? void 0 : n.id) === e;
                });
                if (i) {
                    t(i), r = 0, l.disconnect();
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
function o() {
    return (o = function(t) {
        return function() {
            var n = this, l = arguments;
            return new Promise(function(i, r) {
                var c = t.apply(n, l);
                function o(t) {
                    e(c, i, r, o, u, "next", t);
                }
                function u(t) {
                    e(c, i, r, o, u, "throw", t);
                }
                o(void 0);
            });
        };
    }(function*(e) {
        e.click();
        let t = performance.now(), n = yield c("close-button"), l = yield c("copy-button"), i = performance.now();
        r ? setTimeout(()=>{
            n.click(), l.click();
        }, r) : (r = i - t, n.click(), l.click()), navigator.clipboard.writeText(document.getElementById("share-url").value);
    })).apply(this, arguments);
}
function u() {
    if (!/^\/watch/.test(location.pathname)) {
        t = !1;
        return;
    }
    t = !0;
    let e = document.getElementsByTagName("ytd-video-primary-info-renderer");
    if (1 == e.length) {
        let r = e[0].getElementsByTagName("button");
        n = r[0], l = r[1], i = r[2];
    } else n = null, l = null, i = null;
}
u();
const a = new MutationObserver(u);
a.observe(document.documentElement, {
    childList: !0,
    subtree: !0
}), addEventListener("keypress", (e)=>{
    if (!t || "true" == e.target.getAttribute("contenteditable")) return;
    let r = e.target.tagName.toLowerCase();
    "input" != r && "textarea" != r && ("BracketLeft" == e.code && n ? n.click() : "BracketRight" == e.code && l ? l.click() : "Backslash" == e.code && i && function(e) {
        return o.apply(this, arguments);
    }(i));
});
