// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     2.2.1
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==

let onVideoPage: boolean;
let likeButton: HTMLElement | null;
let dislikeButton: HTMLElement | null;
let shareButton: HTMLElement | null;

// Create a promise to wait for an element
function awaitElementById(selector: string): Promise<HTMLElement> {
  return new Promise((resolve) => {
    const elem = document.getElementById(selector);

    // Already exists
    if (elem) {
      resolve(elem);
      return;
    }

    // Does not exist, create observer
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const elem = Array.from(mutation.addedNodes).find((node) => {
          const elem = node as Element;

          // NOTE: Should return _true_ if its parent is the chosen one.
          // This is because while testing only the children where visible
          // when searching for the `copy-button`, so this is a workaround
          return elem.id === selector || elem.parentElement?.id === selector;
        }) as HTMLElement;

        if (elem) {
          resolve(elem);
          observer.disconnect();
          return;
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

// Get the link of the video
async function getLink(popupButton: HTMLElement) {
  // Open popup to create the shareable link
  popupButton.click();

  // Get the button to close the popup and copy the link
  const closeButton = await awaitElementById("close-button");
  const copyButton = await awaitElementById("copy-button");

  setTimeout(() => {
    closeButton.click();
    copyButton.click();
  }, 150);

  // Copy to the clipboard
  const shareURL = document.getElementById("share-url") as HTMLInputElement;
  navigator.clipboard.writeText(shareURL.value);
}

// Find the buttons that are needed
function findButtons() {
  // Test if we are in a valid page
  if (!/^\/watch/.test(location.pathname)) {
    onVideoPage = false;
    return;
  }

  onVideoPage = true;

  const videoInfo = document.getElementsByTagName("ytd-menu-renderer");
  if (videoInfo.length >= 2) {
    const buttons = videoInfo[1].getElementsByTagName("button");

    if (buttons != null) {
      likeButton = buttons[0];
      dislikeButton = buttons[1];
      shareButton = buttons[2];
    }
  } else {
    likeButton = null;
    dislikeButton = null;
    shareButton = null;
  }
}

// Call the funcion and set a observer in case the document changes
findButtons();
const observer = new MutationObserver(findButtons);
observer.observe(document.documentElement, { childList: true, subtree: true });

// Add event listener to the keys
addEventListener("keypress", (event) => {
  if (!onVideoPage) {
    return;
  }

  const targetElement = event.target as HTMLElement;

  // On your userpage, return
  if (targetElement.getAttribute("contenteditable") === "true") {
    return;
  }

  const tag = targetElement.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") {
    return;
  }

  if (event.code === "BracketLeft" && likeButton) {
    likeButton.click();
  } else if (event.code === "BracketRight" && dislikeButton) {
    dislikeButton.click();
  } else if (event.code === "Backslash" && shareButton) {
    getLink(shareButton);
  }
});
