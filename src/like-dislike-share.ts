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

// Buttons used for interacting with the video player
class Buttons {
  onVideoPage: boolean;
  like: HTMLElement | null;
  dislike: HTMLElement | null;
  share: HTMLElement | null;

  constructor() {
    this.onVideoPage = false;
    this.like = null;
    this.dislike = null;
    this.share = null;
  }

  setFrom(root: ParentNode) {
    // Test if we are in a valid page
    if (!/^\/watch/.test(location.pathname)) {
      this.onVideoPage = false;
    }

    // We are, proceed
    this.onVideoPage = true;

    const videoInfo = root.querySelector("div #actions-inner");
    if (videoInfo !== null) {
      const buttons = videoInfo.getElementsByTagName("button");

      if (buttons.length >= 3) {
        this.like = buttons[0];
        this.dislike = buttons[1];
        this.share = buttons[2];
      }
    }
  }

  async getShareLink(): Promise<string> {
      if (this.share === null) {
        return "";
      }

      // Open popup to create the shareable link
      this.share.click();

      // Get the button to close the popup and copy the link
      const close = await awaitElementById("close-button");
      const copy = await awaitElementById("copy-button").then(
        (elem) => elem.getElementsByTagName("button")[0]
      );

      // Force the link generation
      setTimeout(() => {
        copy.click();
        close.click();
      }, 150);

      // Return the link value
      const url = document.getElementById("share-url") as HTMLInputElement;
      return url.value;
  }
}

// Create a promise to wait for an element
async function awaitElementById(selector: string): Promise<HTMLElement> {
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

// Main IIFE
(function () {
  let buttons = new Buttons();

  // Set the buttons and create an observer in case the document changes
  buttons.setFrom(document);
  const button_observer = new MutationObserver((_) => {
    // Try to set the buttons everytime a change occurs
    buttons.setFrom(document);
  });
  button_observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Add event listener to the keys
  addEventListener("keypress", (event) => {
    if (!buttons.onVideoPage) {
      return;
    }

    const target = event.target as HTMLElement;

    // On your userpage, return
    if (target.getAttribute("contenteditable") === "true") {
      return;
    }

    const tag = target.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea") {
      return;
    }

    if (event.code === "BracketLeft" && buttons.like) {
      buttons.like.click();
    } else if (event.code === "BracketRight" && buttons.dislike) {
      buttons.dislike.click();
    } else if (event.code === "Backslash" && buttons.share) {
      buttons.getShareLink().then((link) => {
        navigator.clipboard.writeText(link);
      });
    }
  });
})();
