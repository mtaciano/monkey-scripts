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

let onVideoPage: boolean;
let likeButton: HTMLElement | null;
let dislikeButton: HTMLElement | null;
let shareButton: HTMLElement | null;
let delay = 0;
let url = "";

// Create a promise to wait for an element
function waitForElementById(selector: string): Promise<HTMLElement> {
  return new Promise((resolve) => {
    // Already exists
    const elem = document.getElementById(selector);
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
  const startTime = performance.now();
  const closeButton = await waitForElementById("close-button");
  const copyButton = await waitForElementById("copy-button").then(
    (elem) => elem.getElementsByTagName("button")[0]
  );
  const endTime = performance.now();

  let newDelay = endTime - startTime;

  // TODO: Definitively overengineered, should simplify
  if (delay || newDelay <= 150) {
    // HACK: change behavior if the button already exists
    setTimeout(() => {
      closeButton.click();
      copyButton.click();
    }, Math.max(150, delay, newDelay));
  } else {
    // Close the popup and create the "link copied" popup
    // BUG: for some reason if you click the close button it works once,
    // after that it does not work anymore, probably it's because
    // the action of opening and closing the popup is too fast
    // if there's no need to wait the creation of the element
    closeButton.click();
    copyButton.click();
  }

  switch (delay === 0) {
    case true:
      delay = Math.max(150, newDelay);
      break;

    case false:
      // Do nothing
      break;
  }

  console.log(delay);

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

  if (url !== location.href) {
    console.log(url);
    console.log(location.href);
    // Changed the video
    delay = 0;
  }

  url = location.href;
  onVideoPage = true;

  const videoInfo = document.getElementsByTagName("ytd-watch-metadata");
  if (videoInfo.length === 1) {
    const actions = videoInfo[0].querySelector("div #actions");
    if (actions != null) {
      const buttons = actions.getElementsByTagName("button");
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
