// ==UserScript==
// @name        Like | Dislike | Link
// @namespace   https://github.com/mtaciano
// @match       https://www.youtube.com/*
// @description "[" likes; "]" dislikes; "\" gets the current video link
// @version     3.0.3
// @downloadURL https://raw.githubusercontent.com/mtaciano/monkey-scripts/main/build/like-dislike-share.js
// @homepageURL https://github.com/mtaciano/monkey-scripts/
// @grant       none
// ==/UserScript==
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var Buttons = function() {
    "use strict";
    function Buttons() {
        _class_call_check(this, Buttons);
        _define_property(this, "onVideoPage", void 0);
        _define_property(this, "like", void 0);
        _define_property(this, "dislike", void 0);
        _define_property(this, "share", void 0);
        this.onVideoPage = false;
        this.like = null;
        this.dislike = null;
        this.share = null;
    }
    _create_class(Buttons, [
        {
            key: "from",
            value: function from(root) {
                if (!/^\/watch/.test(location.pathname)) {
                    this.onVideoPage = false;
                    this.like = null;
                    this.dislike = null;
                    this.share = null;
                    return;
                }
                this.onVideoPage = true;
                var videoInfo = root.querySelector("div #actions-inner");
                if (videoInfo !== null) {
                    var buttons = videoInfo.getElementsByTagName("button");
                    if (buttons.length >= 3) {
                        this.like = buttons[0];
                        this.dislike = buttons[1];
                        this.share = buttons[2];
                    }
                }
            }
        },
        {
            key: "shareLink",
            value: function shareLink() {
                var _this = this;
                return _async_to_generator(function() {
                    var close, copy, url;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (_this.share === null) {
                                    return [
                                        2,
                                        ""
                                    ];
                                }
                                _this.share.click();
                                return [
                                    4,
                                    awaitElementById("close-button")
                                ];
                            case 1:
                                close = _state.sent();
                                return [
                                    4,
                                    awaitElementById("copy-button").then(function(elem) {
                                        return elem.getElementsByTagName("button")[0];
                                    })
                                ];
                            case 2:
                                copy = _state.sent();
                                setTimeout(function() {
                                    close.click();
                                    copy.click();
                                }, 250);
                                url = document.getElementById("share-url");
                                return [
                                    2,
                                    url.value
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return Buttons;
}();
function awaitElementById(selector) {
    return _awaitElementById.apply(this, arguments);
}
function _awaitElementById() {
    _awaitElementById = _async_to_generator(function(selector) {
        return _ts_generator(this, function(_state) {
            return [
                2,
                new Promise(function(resolve) {
                    var elem = document.getElementById(selector);
                    if (elem !== null) {
                        resolve(elem);
                        return;
                    }
                    var observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            var elem = Array.from(mutation.addedNodes).find(function(node) {
                                var _elem_parentElement;
                                var elem = node;
                                return elem.id === selector || ((_elem_parentElement = elem.parentElement) === null || _elem_parentElement === void 0 ? void 0 : _elem_parentElement.id) === selector;
                            });
                            if (elem) {
                                resolve(elem);
                                observer.disconnect();
                                return;
                            }
                        });
                    });
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                })
            ];
        });
    });
    return _awaitElementById.apply(this, arguments);
}
(function() {
    var buttons = new Buttons();
    buttons.from(document);
    var button_observer = new MutationObserver(function(_) {
        buttons.from(document);
    });
    button_observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    addEventListener("keypress", function(event) {
        if (!buttons.onVideoPage) {
            return;
        }
        var target = event.target;
        if (target.getAttribute("contenteditable") === "true") {
            return;
        }
        var tag = target.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") {
            return;
        }
        if (event.code === "BracketLeft" && buttons.like) {
            buttons.like.click();
        } else if (event.code === "BracketRight" && buttons.dislike) {
            buttons.dislike.click();
        } else if (event.code === "Backslash" && buttons.share) {
            buttons.shareLink().then(function(link) {
                navigator.clipboard.writeText(link);
            });
        }
    });
})();
