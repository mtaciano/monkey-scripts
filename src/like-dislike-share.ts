// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     2.0.0
// @downloadURL https://github.com/mtaciano/monkey-scripts/blob/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==

// TODO: refactor to TS style
let onvideopage: any,
  videoinfo,
  buttons,
  like: any,
  dislike: any,
  tag,
  link: any;

async function getLink() {
  // Create popup and wait for it to load
  await link.click();
  await link.click();
  await new Promise((r) => setTimeout(r, 600));

  document.getElementById("copy-button")?.click();
  navigator.clipboard.writeText(
    (document.getElementById("share-url") as HTMLInputElement).value
  );
}

function findButtons() {
  if (!/^\/watch/.test(location.pathname)) {
    onvideopage = false;
    return;
  }
  onvideopage = true;

  videoinfo = document.getElementsByTagName("ytd-video-primary-info-renderer");
  if (videoinfo.length == 1) {
    buttons = videoinfo[0].getElementsByTagName("button");
    like = buttons[0];
    dislike = buttons[1];
    link = // Check if video has "applaud" button
      buttons[2].getAttribute("aria-label") === "Share"
        ? buttons[2]
        : buttons[3];
  } else {
    like = null;
    dislike = null;
    link = null;
  }
}

findButtons();
let observer = new MutationObserver(findButtons);
observer.observe(document.documentElement, { childList: true, subtree: true });

// Add keybindings
addEventListener("keypress", (e) => {
  if (!onvideopage) return;

  if ((e.target as HTMLElement).getAttribute("contenteditable") == "true")
    return;

  tag = (e.target as HTMLElement).tagName.toLowerCase();
  if (tag == "input" || tag == "textarea") return;

  if (e.code == "BracketLeft" && like) {
    like.click();
  } else if (e.code == "BracketRight" && dislike) {
    dislike.click();
  } else if (e.code == "Backslash" && link) {
    getLink();
  }
});
