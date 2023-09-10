// ==UserScript==
// @name        Like-Dislike-Share
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" copies the current video link
// @version     4.0.0
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/src/like_dislike_share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant none
// ==/UserScript==

/**
 * Test if the current URI is a video page, meaning it cointains the word
 * `watch` somewhere inside it
 * @param {string} uri
 * @returns {boolean}
 */
function isOnVideoPage(uri) {
  return /^\/watch/.test(uri);
}

/**
 * Return an element if it exists. But if not, wait for it to be created and
 * then return it
 * @param {string} selector
 * @returns {Promise<HTMLElement>}
 */
async function awaitElementById(selector) {
  return await new Promise((resolve) => {
    const elem = document.getElementById(selector);

    if (elem !== null) {
      resolve(elem);
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const elem = Array.from(mutation.addedNodes).find((node) => {
          const e = /** @type {Element}*/ (node);

          // NOTE: Should return _true_ if its parent is the element we want.
          // This is because, while testing, only the children where visible
          // when searching for the `copy-button`, so this is a workaround.
          return e.id === selector || e.parentElement?.id === selector;
        });

        if (elem === undefined) {
          return;
        }

        if (elem.parentElement?.id === selector) {
          resolve(elem.parentElement);
        } else {
          resolve(/** @type {HTMLElement} */ (elem));
        }
        observer.disconnect();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

/**
 * Create all the buttons from a parent node, if we can't create
 * valid buttons, we simply return null for them
 * @param {ParentNode} node
 * @returns {Array<HTMLButtonElement|null>}
 */
function buttonsFromNode(node) {
  if (!isOnVideoPage(/** @type {Document} */ (node).location.pathname)) {
    return [null, null, null];
  }

  const videoInfo = node.querySelector("div #actions-inner");
  if (videoInfo === null) {
    return [null, null, null];
  }

  const buttons = videoInfo.getElementsByTagName("button");
  if (buttons.length >= 3) {
    const like = buttons.item(0);
    const dislike = buttons.item(1);
    const share = buttons.item(2);

    return [like, dislike, share];
  }

  return [null, null, null];
}

/**
 * Return the URI for the current video page. We use an `async` function
 * here because, even if we could just copy the URI directily, when you
 * click the button yourself, a popup with the text
 * `Link copied to clipboard` appears. We want to recreate this effect
 * but didn't find any better way to.
 * @param {HTMLButtonElement} button
 * @returns {Promise<string>}
 */
async function shareLink(button) {
  button.click();

  const close = await awaitElementById("close-button");
  const copy = await awaitElementById("copy-button").then(
    (elem) => elem.getElementsByTagName("button")[0],
  );

  copy.click();
  close.click();

  const url = /** @type {HTMLInputElement} */ (
    document.getElementById("share-url")
  );
  return url.value;
}

/**
 * Perform a click on the given button. We use a pseudo-strategy pattern
 * here as to simplify implementation may we add more buttons in the
 * future
 * @param {string} tag
 * @param {HTMLButtonElement|null} button
 * @returns {void}
 */
function clickButton(tag, button) {
  if (button === null) {
    return;
  }

  if (tag === "like" || tag === "dislike") {
    button.click();
  } else if (tag === "share") {
    shareLink(button).then((link) => {
      navigator.clipboard.writeText(link).catch((err) => {
        console.log(err);
      });
    });
  }
}

/**
 * The main function, responsible for handling the button clicks and their
 * behaviour when the page changes
 * @returns {void}
 */
(function () {
  let [like, dislike, share] = buttonsFromNode(document);

  const buttonsObserver = new MutationObserver((_) => {
    [like, dislike, share] = buttonsFromNode(document);
  });

  buttonsObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  addEventListener("keypress", (event) => {
    if (!isOnVideoPage(document.location.pathname)) {
      return;
    }

    const target = /** @type {HTMLElement} */ (event.target);
    if (target.getAttribute("contenteditable") === "true") {
      return;
    }

    const tag = target.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea") {
      return;
    }

    // TODO: it would be better if we used enums, but it seems that
    // javascript doesn't support them, maybe there's a better
    // implementation?
    if (event.code === "BracketLeft") {
      clickButton("like", like);
    } else if (event.code === "BracketRight") {
      clickButton("dislike", dislike);
    } else if (event.code === "Backslash") {
      clickButton("share", share);
    }
  });
})();
