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

let onVideoPage: boolean;
let likeButton: HTMLElement | null;
let dislikeButton: HTMLElement | null;
let shareButton: HTMLElement | null;
let delay = 0;

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
          delay = 0; // Reset delay just in case
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

  if (delay) {
    // HACK: change behavior if the button already exists
    setTimeout(() => {
      closeButton.click();
      copyButton.click();
    }, delay);
  } else {
    delay = endTime - startTime;
    // Close the popup and create the "link copied" popup
    // BUG: for some reason if you click the close button it works once,
    // after that it does not work anymore, probably it's because
    // the action of opening and closing the popup is too fast
    // if there's no need to wait the creation of the element
    closeButton.click();
    copyButton.click();
  }

  // Copy to the clipboard
  navigator.clipboard.writeText(
    (document.getElementById("share-url") as HTMLInputElement).value
  );
}

// Find the buttons that are needed
function findButtons() {
  // Test if we are in a valid page
  if (!/^\/watch/.test(location.pathname)) {
    onVideoPage = false;
    return;
  }
  onVideoPage = true;

  const videoInfo = document.getElementsByTagName(
    "ytd-video-primary-info-renderer"
  );
  if (videoInfo.length == 1) {
    const buttons = videoInfo[0].getElementsByTagName("button");
    likeButton = buttons[0];
    dislikeButton = buttons[1];
    shareButton = buttons[2];
    // NOTE: It seems that the `applaud` button was changed to `thanks`
    // which comes after `share`, so maybe there's no more need for this check
    // link = // Check if video has `applaud` button
    //   buttons[2].getAttribute("aria-label") === "Share"
    //     ? buttons[2]
    //     : buttons[3];
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

  // On your userpage, return
  if ((event.target as HTMLElement).getAttribute("contenteditable") == "true") {
    return;
  }

  const tag = (event.target as HTMLElement).tagName.toLowerCase();
  if (tag == "input" || tag == "textarea") {
    return;
  }

  if (event.code == "BracketLeft" && likeButton) {
    likeButton.click();
  } else if (event.code == "BracketRight" && dislikeButton) {
    dislikeButton.click();
  } else if (event.code == "Backslash" && shareButton) {
    getLink(shareButton);
  }
});
