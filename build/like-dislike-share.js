// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     2.0.0
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==
let a,b,c,d,e,f,g;async function h(){await g.click(),await g.click(),await new Promise(a=>setTimeout(a,600)),document.getElementById("copy-button")?.click(),navigator.clipboard.writeText(document.getElementById("share-url").value)}function i(){if(!/^\/watch/.test(location.pathname)){a=!1;return}a=!0,1==(b=document.getElementsByTagName("ytd-video-primary-info-renderer")).length?(d=(c=b[0].getElementsByTagName("button"))[0],e=c[1],g="Share"===c[2].getAttribute("aria-label")?c[2]:c[3]):(d=null,e=null,g=null)}i();new MutationObserver(i).observe(document.documentElement,{childList:!0,subtree:!0}),addEventListener("keypress",b=>{if(a)"true"!=b.target.getAttribute("contenteditable")&&"input"!=(f=b.target.tagName.toLowerCase())&&"textarea"!=f&&("BracketLeft"==b.code&&d?d.click():"BracketRight"==b.code&&e?e.click():"Backslash"==b.code&&g&&h())})