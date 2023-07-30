// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     3.0.2
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==
function e(e, t, i, n, r, l, o) {
    try {
        var s = e[l](o), u = s.value;
    } catch (e) {
        i(e);
        return;
    }
    s.done ? t(u) : Promise.resolve(u).then(n, r);
}
function t(t) {
    return function() {
        var i = this, n = arguments;
        return new Promise(function(r, l) {
            var o = t.apply(i, n);
            function s(t) {
                e(o, r, l, s, u, "next", t);
            }
            function u(t) {
                e(o, r, l, s, u, "throw", t);
            }
            s(void 0);
        });
    };
}
function i(e, t, i) {
    return t in e ? Object.defineProperty(e, t, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = i, e;
}
class n {
    from(e) {
        if (!/^\/watch/.test(location.pathname)) {
            this.onVideoPage = !1, this.like = null, this.dislike = null, this.share = null;
            return;
        }
        this.onVideoPage = !0;
        let t = e.querySelector("div #actions-inner");
        if (null !== t) {
            let e = t.getElementsByTagName("button");
            e.length >= 3 && (this.like = e[0], this.dislike = e[1], this.share = e[2]);
        }
    }
    shareLink() {
        var e = this;
        return t(function*() {
            if (null === e.share) return "";
            e.share.click();
            let t = yield r("close-button"), i = yield r("copy-button").then((e)=>e.getElementsByTagName("button")[0]);
            setTimeout(()=>{
                i.click(), t.click();
            }, 200);
            let n = document.getElementById("share-url");
            return n.value;
        })();
    }
    constructor(){
        i(this, "onVideoPage", void 0), i(this, "like", void 0), i(this, "dislike", void 0), i(this, "share", void 0), this.onVideoPage = !1, this.like = null, this.dislike = null, this.share = null;
    }
}
function r() {
    return l.apply(this, arguments);
}
function l() {
    return (l = t(function*(e) {
        return new Promise((t)=>{
            let i = document.getElementById(e);
            if (null !== i) {
                t(i);
                return;
            }
            let n = new MutationObserver((i)=>{
                i.forEach((i)=>{
                    let r = Array.from(i.addedNodes).find((t)=>{
                        var i;
                        return t.id === e || (null === (i = t.parentElement) || void 0 === i ? void 0 : i.id) === e;
                    });
                    if (r) {
                        t(r), n.disconnect();
                        return;
                    }
                });
            });
            n.observe(document.body, {
                childList: !0,
                subtree: !0
            });
        });
    })).apply(this, arguments);
}
!function() {
    let e = new n();
    e.from(document);
    let t = new MutationObserver((t)=>{
        e.from(document);
    });
    t.observe(document.documentElement, {
        childList: !0,
        subtree: !0
    }), addEventListener("keypress", (t)=>{
        if (!e.onVideoPage) return;
        let i = t.target;
        if ("true" === i.getAttribute("contenteditable")) return;
        let n = i.tagName.toLowerCase();
        "input" !== n && "textarea" !== n && ("BracketLeft" === t.code && e.like ? e.like.click() : "BracketRight" === t.code && e.dislike ? e.dislike.click() : "Backslash" === t.code && e.share && e.shareLink().then((e)=>{
            navigator.clipboard.writeText(e);
        }));
    });
}();
