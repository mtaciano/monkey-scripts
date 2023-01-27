// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     3.0.0
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==
function e(e, t, n, i, r, o, l) {
    try {
        var s = e[o](l), u = s.value;
    } catch (e) {
        n(e);
        return;
    }
    s.done ? t(u) : Promise.resolve(u).then(i, r);
}
function t(t) {
    return function() {
        var n = this, i = arguments;
        return new Promise(function(r, o) {
            var l = t.apply(n, i);
            function s(t) {
                e(l, r, o, s, u, "next", t);
            }
            function u(t) {
                e(l, r, o, s, u, "throw", t);
            }
            s(void 0);
        });
    };
}
class n {
    setFrom(e) {
        /^\/watch/.test(location.pathname) || (this.onVideoPage = !1), this.onVideoPage = !0;
        let t = e.querySelector("div #actions-inner");
        if (null !== t) {
            let e = t.getElementsByTagName("button");
            e.length >= 3 && (this.like = e[0], this.dislike = e[1], this.share = e[2]);
        }
    }
    getShareLink() {
        var e = this;
        return t(function*() {
            if (null === e.share) return "";
            e.share.click();
            let t = yield i("close-button"), n = yield i("copy-button").then((e)=>e.getElementsByTagName("button")[0]);
            setTimeout(()=>{
                n.click(), t.click();
            }, 150);
            let r = document.getElementById("share-url");
            return r.value;
        })();
    }
    constructor(){
        this.onVideoPage = !1, this.like = null, this.dislike = null, this.share = null;
    }
}
function i() {
    return r.apply(this, arguments);
}
function r() {
    return (r = t(function*(e) {
        return new Promise((t)=>{
            let n = document.getElementById(e);
            if (n) {
                t(n);
                return;
            }
            let i = new MutationObserver((n)=>{
                n.forEach((n)=>{
                    let r = Array.from(n.addedNodes).find((t)=>{
                        var n;
                        return t.id === e || (null === (n = t.parentElement) || void 0 === n ? void 0 : n.id) === e;
                    });
                    if (r) {
                        t(r), i.disconnect();
                        return;
                    }
                });
            });
            i.observe(document.body, {
                childList: !0,
                subtree: !0
            });
        });
    })).apply(this, arguments);
}
!function() {
    let e = new n();
    e.setFrom(document);
    let t = new MutationObserver((t)=>{
        e.setFrom(document);
    });
    t.observe(document.documentElement, {
        childList: !0,
        subtree: !0
    }), addEventListener("keypress", (t)=>{
        if (!e.onVideoPage) return;
        let n = t.target;
        if ("true" === n.getAttribute("contenteditable")) return;
        let i = n.tagName.toLowerCase();
        "input" !== i && "textarea" !== i && ("BracketLeft" === t.code && e.like ? e.like.click() : "BracketRight" === t.code && e.dislike ? e.dislike.click() : "Backslash" === t.code && e.share && e.getShareLink().then((e)=>{
            navigator.clipboard.writeText(e);
        }));
    });
}();
