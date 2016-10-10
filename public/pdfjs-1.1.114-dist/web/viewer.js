"use strict";
function removeNullCharacters(e) {
    return e.replace(NullCharactersRegExp, "")
}
function getFileName(e) {
    var t = e.indexOf("#"),
    i = e.indexOf("?"),
    n = Math.min(t > 0 ? t: e.length, i > 0 ? i: e.length);
    return e.substring(e.lastIndexOf("/", n) + 1, n)
}
function getOutputScale(e) {
    var t = window.devicePixelRatio || 1,
    i = e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || e.backingStorePixelRatio || 1,
    n = t / i;
    return {
        sx: n,
        sy: n,
        scaled: 1 !== n
    }
}
function scrollIntoView(e, t, i) {
    var n = e.offsetParent;
    if (!n) return void console.error("offsetParent is not set -- cannot scroll");
    for (var r = i || !1,
    s = e.offsetTop + e.clientTop,
    a = e.offsetLeft + e.clientLeft; n.clientHeight === n.scrollHeight || r && "hidden" === getComputedStyle(n).overflow;) if (n.dataset._scaleY && (s /= n.dataset._scaleY, a /= n.dataset._scaleX), s += n.offsetTop, a += n.offsetLeft, n = n.offsetParent, !n) return;
    t && (void 0 !== t.top && (s += t.top), void 0 !== t.left && (a += t.left, n.scrollLeft = a)),
    n.scrollTop = s
}
function watchScroll(e, t) {
    var i = function(i) {
        r || (r = window.requestAnimationFrame(function() {
            r = null;
            var i = e.scrollTop,
            s = n.lastY;
            i !== s && (n.down = i > s),
            n.lastY = i,
            t(n)
        }))
    },
    n = {
        down: !0,
        lastY: e.scrollTop,
        _eventHandler: i
    },
    r = null;
    return e.addEventListener("scroll", i, !0),
    n
}
function parseQueryString(e) {
    for (var t = e.split("&"), i = {},
    n = 0, r = t.length; r > n; ++n) {
        var s = t[n].split("="),
        a = s[0].toLowerCase(),
        o = s.length > 1 ? s[1] : null;
        i[decodeURIComponent(a)] = decodeURIComponent(o)
    }
    return i
}
function binarySearchFirstItem(e, t) {
    var i = 0,
    n = e.length - 1;
    if (0 === e.length || !t(e[n])) return e.length;
    if (t(e[i])) return i;
    for (; n > i;) {
        var r = i + n >> 1,
        s = e[r];
        t(s) ? n = r: i = r + 1
    }
    return i
}
function approximateFraction(e) {
    if (Math.floor(e) === e) return [e, 1];
    var t = 1 / e,
    i = 8;
    if (t > i) return [1, i];
    if (Math.floor(t) === t) return [1, t];
    for (var n = e > 1 ? t: e, r = 0, s = 1, a = 1, o = 1;;) {
        var d = r + a,
        l = s + o;
        if (l > i) break;
        d / l >= n ? (a = d, o = l) : (r = d, s = l)
    }
    return a / o - n > n - r / s ? n === e ? [r, s] : [s, r] : n === e ? [a, o] : [o, a]
}
function roundToDivide(e, t) {
    var i = e % t;
    return 0 === i ? e: Math.round(e - i + t)
}
function getVisibleElements(e, t, i) {
    function n(e) {
        var t = e.div,
        i = t.offsetTop + t.clientTop + t.clientHeight;
        return i > u
    }
    for (var r, s, a, o, d, l, h, c, u = e.scrollTop,
    p = u + e.clientHeight,
    g = e.scrollLeft,
    f = g + e.clientWidth,
    m = [], v = 0 === t.length ? 0 : binarySearchFirstItem(t, n), w = v, P = t.length; P > w && (r = t[w], s = r.div, a = s.offsetTop + s.clientTop, o = s.clientHeight, !(a > p)); w++) h = s.offsetLeft + s.clientLeft,
    c = s.clientWidth,
    g > h + c || h > f || (d = Math.max(0, u - a) + Math.max(0, a + o - p), l = 100 * (o - d) / o | 0, m.push({
        id: r.id,
        x: h,
        y: a,
        view: r,
        percent: l
    }));
    var b = m[0],
    S = m[m.length - 1];
    return i && m.sort(function(e, t) {
        var i = e.percent - t.percent;
        return Math.abs(i) > .001 ? -i: e.id - t.id
    }),
    {
        first: b,
        last: S,
        views: m
    }
}
function noContextMenuHandler(e) {
    e.preventDefault()
}
function getPDFFileNameFromURL(e) {
    var t = /^(?:([^:]+:)?\/\/[^\/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/,
    i = /[^\/?#=]+\.pdf\b(?!.*\.pdf\b)/i,
    n = t.exec(e),
    r = i.exec(n[1]) || i.exec(n[2]) || i.exec(n[3]);
    if (r && (r = r[0], -1 !== r.indexOf("%"))) try {
        r = i.exec(decodeURIComponent(r))[0]
    } catch(s) {}
    return r || "document.pdf"
}
function DefaultTextLayerFactory() {}
function DefaultAnnotationsLayerFactory() {}
function webViewerLoad(e) {
    PDFViewerApplication.initialize().then(webViewerInitialized)
}
function webViewerInitialized() {
    var e = document.location.search.substring(1),
    t = parseQueryString(e),
    i = "file" in t ? t.file: DEFAULT_URL,
    n = document.createElement("input");
    n.id = "fileInput",
    n.className = "fileInput",
    n.setAttribute("type", "file"),
    n.oncontextmenu = noContextMenuHandler,
    document.body.appendChild(n),
    window.File && window.FileReader && window.FileList && window.Blob ? document.getElementById("fileInput").value = null: (document.getElementById("openFile").setAttribute("hidden", "true"), document.getElementById("secondaryOpenFile").setAttribute("hidden", "true"));
    var r = PDFJS.locale || navigator.language;
    if (PDFViewerApplication.preferencePdfBugEnabled) {
        var s = document.location.hash.substring(1),
        a = parseQueryString(s);
        if ("disableworker" in a && (PDFJS.disableWorker = "true" === a.disableworker), "disablerange" in a && (PDFJS.disableRange = "true" === a.disablerange), "disablestream" in a && (PDFJS.disableStream = "true" === a.disablestream), "disableautofetch" in a && (PDFJS.disableAutoFetch = "true" === a.disableautofetch), "disablefontface" in a && (PDFJS.disableFontFace = "true" === a.disablefontface), "disablehistory" in a && (PDFJS.disableHistory = "true" === a.disablehistory), "webgl" in a && (PDFJS.disableWebGL = "true" !== a.webgl), "useonlycsszoom" in a && (PDFJS.useOnlyCssZoom = "true" === a.useonlycsszoom), "verbosity" in a && (PDFJS.verbosity = 0 | a.verbosity), "ignorecurrentpositiononzoom" in a && (IGNORE_CURRENT_POSITION_ON_ZOOM = "true" === a.ignorecurrentpositiononzoom), "locale" in a && (r = a.locale), "textlayer" in a) switch (a.textlayer) {
        case "off":
            PDFJS.disableTextLayer = !0;
            break;
        case "visible":
        case "shadow":
        case "hover":
            var o = document.getElementById("viewer");
            o.classList.add("textLayer-" + a.textlayer)
        }
        if ("pdfbug" in a) {
            PDFJS.pdfBug = !0;
            var d = a.pdfbug,
            l = d.split(",");
            PDFBug.enable(l),
            PDFBug.init()
        }
    }
    mozL10n.setLanguage(r),
    PDFViewerApplication.supportsPrinting || (document.getElementById("print").classList.add("hidden"), document.getElementById("secondaryPrint").classList.add("hidden")),
    PDFViewerApplication.supportsFullscreen || (document.getElementById("presentationMode").classList.add("hidden"), document.getElementById("secondaryPresentationMode").classList.add("hidden")),
    PDFViewerApplication.supportsIntegratedFind && document.getElementById("viewFind").classList.add("hidden"),
    PDFJS.UnsupportedManager.listen(PDFViewerApplication.fallback.bind(PDFViewerApplication)),
    document.getElementById("scaleSelect").oncontextmenu = noContextMenuHandler;
    var h = document.getElementById("mainContainer"),
    c = document.getElementById("outerContainer");
    if (h.addEventListener("transitionend",
    function(e) {
        if (e.target === h) {
            var t = document.createEvent("UIEvents");
            t.initUIEvent("resize", !1, !1, window, 0),
            window.dispatchEvent(t),
            c.classList.remove("sidebarMoving")
        }
    },
    !0), document.getElementById("sidebarToggle").addEventListener("click",
    function() {
        this.classList.toggle("toggled"),
        c.classList.add("sidebarMoving"),
        c.classList.toggle("sidebarOpen"),
        PDFViewerApplication.sidebarOpen = c.classList.contains("sidebarOpen"),
        PDFViewerApplication.sidebarOpen && PDFViewerApplication.refreshThumbnailViewer(),
        PDFViewerApplication.forceRendering()
    }), document.getElementById("viewThumbnail").addEventListener("click",
    function() {
        PDFViewerApplication.switchSidebarView("thumbs")
    }), document.getElementById("viewOutline").addEventListener("click",
    function() {
        PDFViewerApplication.switchSidebarView("outline")
    }), document.getElementById("viewOutline").addEventListener("dblclick",
    function() {
        PDFViewerApplication.outline.toggleOutlineTree()
    }), document.getElementById("viewAttachments").addEventListener("click",
    function() {
        PDFViewerApplication.switchSidebarView("attachments")
    }), document.getElementById("previous").addEventListener("click",
    function() {
        PDFViewerApplication.page--
    }), document.getElementById("next").addEventListener("click",
    function() {
        PDFViewerApplication.page++
    }), document.getElementById("zoomIn").addEventListener("click",
    function() {
        PDFViewerApplication.zoomIn()
    }), document.getElementById("zoomOut").addEventListener("click",
    function() {
        PDFViewerApplication.zoomOut()
    }), document.getElementById("pageNumber").addEventListener("click",
    function() {
        this.select()
    }), document.getElementById("pageNumber").addEventListener("change",
    function() {
        PDFViewerApplication.page = 0 | this.value,
        this.value !== (0 | this.value).toString() && (this.value = PDFViewerApplication.page)
    }), document.getElementById("scaleSelect").addEventListener("change",
    function() {
        "custom" !== this.value && (PDFViewerApplication.pdfViewer.currentScaleValue = this.value)
    }), document.getElementById("presentationMode").addEventListener("click", SecondaryToolbar.presentationModeClick.bind(SecondaryToolbar)), document.getElementById("openFile").addEventListener("click", SecondaryToolbar.openFileClick.bind(SecondaryToolbar)), document.getElementById("print").addEventListener("click", SecondaryToolbar.printClick.bind(SecondaryToolbar)), document.getElementById("download").addEventListener("click", SecondaryToolbar.downloadClick.bind(SecondaryToolbar)), i && 0 === i.lastIndexOf("file:", 0)) {
        PDFViewerApplication.setTitleUsingUrl(i);
        var u = new XMLHttpRequest;
        u.onload = function() {
            PDFViewerApplication.open(new Uint8Array(u.response))
        };
        try {
            u.open("GET", i),
            u.responseType = "arraybuffer",
            u.send()
        } catch(p) {
            PDFViewerApplication.error(mozL10n.get("loading_error", null, "An error occurred while loading the PDF."), p)
        }
    } else i && PDFViewerApplication.open(i)
}
function selectScaleOption(e) {
    for (var t = document.getElementById("scaleSelect").options, i = !1, n = 0, r = t.length; r > n; n++) {
        var s = t[n];
        s.value === e ? (s.selected = !0, i = !0) : s.selected = !1
    }
    return i
}
function handleMouseWheel(e) {
    var t = 40,
    i = "DOMMouseScroll" === e.type ? -e.detail: e.wheelDelta / t,
    n = 0 > i ? "zoomOut": "zoomIn",
    r = PDFViewerApplication.pdfViewer;
    if (r.isInPresentationMode) e.preventDefault(),
    PDFViewerApplication.scrollPresentationMode(i * t);
    else if (e.ctrlKey || e.metaKey) {
        var s = PDFViewerApplication.supportedMouseWheelZoomModifierKeys;
        if (e.ctrlKey && !s.ctrlKey || e.metaKey && !s.metaKey) return;
        e.preventDefault();
        var a = r.currentScale;
        PDFViewerApplication[n](Math.abs(i));
        var o = r.currentScale;
        if (a !== o) {
            var d = o / a - 1,
            l = r.container.getBoundingClientRect(),
            h = e.clientX - l.left,
            c = e.clientY - l.top;
            r.container.scrollLeft += h * d,
            r.container.scrollTop += c * d
        }
    }
}
var DEFAULT_URL = "compressed.tracemonkey-pldi-09.pdf",
DEFAULT_SCALE_DELTA = 1.1,
MIN_SCALE = .25,
MAX_SCALE = 10,
SCALE_SELECT_CONTAINER_PADDING = 8,
SCALE_SELECT_PADDING = 22,
PAGE_NUMBER_LOADING_INDICATOR = "visiblePageIsLoading",
DISABLE_AUTO_FETCH_LOADING_BAR_TIMEOUT = 5e3;
PDFJS.imageResourcesPath = "./images/",
PDFJS.workerSrc = "./js/pdf.worker.js",
PDFJS.cMapUrl = "../cmaps/",
PDFJS.cMapPacked = !0;
var mozL10n = document.mozL10n || document.webL10n,
CSS_UNITS = 96 / 72,
DEFAULT_SCALE_VALUE = "auto",
DEFAULT_SCALE = 1,
UNKNOWN_SCALE = 0,
MAX_AUTO_SCALE = 1.25,
SCROLLBAR_PADDING = 40,
VERTICAL_PADDING = 5,
NullCharactersRegExp = /\x00/g,
ProgressBar = function() {
    function e(e, t, i) {
        return Math.min(Math.max(e, t), i)
    }
    function t(e, t) {
        this.visible = !0,
        this.div = document.querySelector(e + " .progress"),
        this.bar = this.div.parentNode,
        this.height = t.height || 100,
        this.width = t.width || 100,
        this.units = t.units || "%",
        this.div.style.height = this.height + this.units,
        this.percent = 0
    }
    return t.prototype = {
        updateBar: function() {
            if (this._indeterminate) return this.div.classList.add("indeterminate"),
            void(this.div.style.width = this.width + this.units);
            this.div.classList.remove("indeterminate");
            var e = this.width * this._percent / 100;
            this.div.style.width = e + this.units
        },
        get percent() {
            return this._percent
        },
        set percent(t) {
            this._indeterminate = isNaN(t),
            this._percent = e(t, 0, 100),
            this.updateBar()
        },
        setWidth: function(e) {
            if (e) {
                var t = e.parentNode,
                i = t.offsetWidth - e.offsetWidth;
                i > 0 && this.bar.setAttribute("style", "width: calc(100% - " + i + "px);")
            }
        },
        hide: function() {
            this.visible && (this.visible = !1, this.bar.classList.add("hidden"), document.body.classList.remove("loadingInProgress"))
        },
        show: function() {
            this.visible || (this.visible = !0, document.body.classList.add("loadingInProgress"), this.bar.classList.remove("hidden"))
        }
    },
    t
} (),
DEFAULT_PREFERENCES = {
    showPreviousViewOnLoad: !0,
    defaultZoomValue: "",
    sidebarViewOnLoad: 0,
    enableHandToolOnLoad: !1,
    enableWebGL: !1,
    pdfBugEnabled: !1,
    disableRange: !1,
    disableStream: !1,
    disableAutoFetch: !1,
    disableFontFace: !1,
    disableTextLayer: !1,
    useOnlyCssZoom: !1,
    externalLinkTarget: 0
},
SidebarView = {
    NONE: 0,
    THUMBS: 1,
    OUTLINE: 2,
    ATTACHMENTS: 3
},
Preferences = {
    prefs: Object.create(DEFAULT_PREFERENCES),
    isInitializedPromiseResolved: !1,
    initializedPromise: null,
    initialize: function() {
        return this.initializedPromise = this._readFromStorage(DEFAULT_PREFERENCES).then(function(e) {
            this.isInitializedPromiseResolved = !0,
            e && (this.prefs = e)
        }.bind(this))
    },
    _writeToStorage: function(e) {
        return Promise.resolve()
    },
    _readFromStorage: function(e) {
        return Promise.resolve()
    },
    reset: function() {
        return this.initializedPromise.then(function() {
            return this.prefs = Object.create(DEFAULT_PREFERENCES),
            this._writeToStorage(DEFAULT_PREFERENCES)
        }.bind(this))
    },
    reload: function() {
        return this.initializedPromise.then(function() {
            this._readFromStorage(DEFAULT_PREFERENCES).then(function(e) {
                e && (this.prefs = e)
            }.bind(this))
        }.bind(this))
    },
    set: function(e, t) {
        return this.initializedPromise.then(function() {
            if (void 0 === DEFAULT_PREFERENCES[e]) throw new Error("preferencesSet: '" + e + "' is undefined.");
            if (void 0 === t) throw new Error("preferencesSet: no value is specified.");
            var i = typeof t,
            n = typeof DEFAULT_PREFERENCES[e];
            if (i !== n) {
                if ("number" !== i || "string" !== n) throw new Error("Preferences_set: '" + t + "' is a \"" + i + '", expected "' + n + '".');
                t = t.toString()
            } else if ("number" === i && (0 | t) !== t) throw new Error("Preferences_set: '" + t + '\' must be an "integer".');
            return this.prefs[e] = t,
            this._writeToStorage(this.prefs)
        }.bind(this))
    },
    get: function(e) {
        return this.initializedPromise.then(function() {
            var t = DEFAULT_PREFERENCES[e];
            if (void 0 === t) throw new Error("preferencesGet: '" + e + "' is undefined.");
            var i = this.prefs[e];
            return void 0 !== i ? i: t
        }.bind(this))
    }
};
Preferences._writeToStorage = function(e) {
    return new Promise(function(t) {
        localStorage.setItem("pdfjs.preferences", JSON.stringify(e)),
        t()
    })
},
Preferences._readFromStorage = function(e) {
    return new Promise(function(e) {
        var t = JSON.parse(localStorage.getItem("pdfjs.preferences"));
        e(t)
    })
},
function() {
    function e(e) {
        var t = document.createEvent("CustomEvent");
        t.initCustomEvent(e, !1, !1, "custom"),
        window.dispatchEvent(t)
    }
    function t() {
        if (r) if (n(), ++s < r.length) {
            var e = r[s];
            "function" == typeof e.mozPrintCallback ? e.mozPrintCallback({
                context: e.getContext("2d"),
                abort: i,
                done: t
            }) : t()
        } else n(),
        a.call(window),
        setTimeout(i, 20)
    }
    function i() {
        r && (r = null, n(), e("afterprint"))
    }
    function n() {
        var e = document.getElementById("mozPrintCallback-shim");
        if (r && r.length) {
            var t = Math.round(100 * s / r.length),
            n = e.querySelector("progress"),
            a = e.querySelector(".relative-progress");
            n.value = t,
            a.textContent = t + "%",
            e.removeAttribute("hidden"),
            e.onclick = i
        } else e.setAttribute("hidden", "")
    }
    if (! ("mozPrintCallback" in document.createElement("canvas"))) {
        HTMLCanvasElement.prototype.mozPrintCallback = void 0;
        var r, s, a = window.print;
        window.print = function() {
            if (r) return void console.warn("Ignored window.print() because of a pending print job.");
            try {
                e("beforeprint")
            } finally {
                r = document.querySelectorAll("canvas"),
                s = -1,
                t()
            }
        };
        var o = !!document.attachEvent;
        if (window.addEventListener("keydown",
        function(e) {
            if (80 === e.keyCode && (e.ctrlKey || e.metaKey) && !e.altKey && (!e.shiftKey || window.chrome || window.opera)) {
                if (window.print(), o) return;
                return e.preventDefault(),
                void(e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.stopPropagation())
            }
            27 === e.keyCode && r && i()
        },
        !0), o && document.attachEvent("onkeydown",
        function(e) {
            return e = e || window.event,
            80 === e.keyCode && e.ctrlKey ? (e.keyCode = 0, !1) : void 0
        }), "onbeforeprint" in window) {
            var d = function(e) {
                "custom" !== e.detail && e.stopImmediatePropagation && e.stopImmediatePropagation()
            };
            window.addEventListener("beforeprint", d, !1),
            window.addEventListener("afterprint", d, !1)
        }
    }
} ();
var DownloadManager = function() {
    function e(e, t) {
        var i = document.createElement("a");
        if (i.click) i.href = e,
        i.target = "_parent",
        "download" in i && (i.download = t),
        (document.body || document.documentElement).appendChild(i),
        i.click(),
        i.parentNode.removeChild(i);
        else {
            if (window.top === window && e.split("#")[0] === window.location.href.split("#")[0]) {
                var n = -1 === e.indexOf("?") ? "?": "&";
                e = e.replace(/#|$/, n + "$&")
            }
            window.open(e, "_parent")
        }
    }
    function t() {}
    return t.prototype = {
        downloadUrl: function(t, i) {
            PDFJS.isValidUrl(t, !0) && e(t + "#pdfjs.action=download", i)
        },
        downloadData: function(t, i, n) {
            if (navigator.msSaveBlob) return navigator.msSaveBlob(new Blob([t], {
                type: n
            }), i);
            var r = PDFJS.createObjectURL(t, n);
            e(r, i)
        },
        download: function(t, i, n) {
            if (!URL) return void this.downloadUrl(i, n);
            if (navigator.msSaveBlob) return void(navigator.msSaveBlob(t, n) || this.downloadUrl(i, n));
            var r = URL.createObjectURL(t);
            e(r, n)
        }
    },
    t
} (),
DEFAULT_VIEW_HISTORY_CACHE_SIZE = 20,
ViewHistory = function() {
    function e(e, t) {
        this.fingerprint = e,
        this.cacheSize = t || DEFAULT_VIEW_HISTORY_CACHE_SIZE,
        this.isInitializedPromiseResolved = !1,
        this.initializedPromise = this._readFromStorage().then(function(e) {
            this.isInitializedPromiseResolved = !0;
            var t = JSON.parse(e || "{}");
            "files" in t || (t.files = []),
            t.files.length >= this.cacheSize && t.files.shift();
            for (var i, n = 0,
            r = t.files.length; r > n; n++) {
                var s = t.files[n];
                if (s.fingerprint === this.fingerprint) {
                    i = n;
                    break
                }
            }
            "number" != typeof i && (i = t.files.push({
                fingerprint: this.fingerprint
            }) - 1),
            this.file = t.files[i],
            this.database = t
        }.bind(this))
    }
    return e.prototype = {
        _writeToStorage: function() {
            return new Promise(function(e) {
                var t = JSON.stringify(this.database);
                localStorage.setItem("database", t),
                e()
            }.bind(this))
        },
        _readFromStorage: function() {
            return new Promise(function(e) {
                e(localStorage.getItem("database"))
            })
        },
        set: function(e, t) {
            return this.isInitializedPromiseResolved ? (this.file[e] = t, this._writeToStorage()) : void 0
        },
        setMultiple: function(e) {
            if (this.isInitializedPromiseResolved) {
                for (var t in e) this.file[t] = e[t];
                return this._writeToStorage()
            }
        },
        get: function(e, t) {
            return this.isInitializedPromiseResolved ? this.file[e] || t: t
        }
    },
    e
} (),
PDFFindBar = function() {
    function e(e) {
        if (this.opened = !1, this.bar = e.bar || null, this.toggleButton = e.toggleButton || null, this.findField = e.findField || null, this.highlightAll = e.highlightAllCheckbox || null, this.caseSensitive = e.caseSensitiveCheckbox || null, this.findMsg = e.findMsg || null, this.findResultsCount = e.findResultsCount || null, this.findStatusIcon = e.findStatusIcon || null, this.findPreviousButton = e.findPreviousButton || null, this.findNextButton = e.findNextButton || null, this.findController = e.findController || null, null === this.findController) throw new Error("PDFFindBar cannot be used without a PDFFindController instance.");
        var t = this;
        this.toggleButton.addEventListener("click",
        function() {
            t.toggle()
        }),
        this.findField.addEventListener("input",
        function() {
            t.dispatchEvent("")
        }),
        this.bar.addEventListener("keydown",
        function(e) {
            switch (e.keyCode) {
            case 13:
                e.target === t.findField && t.dispatchEvent("again", e.shiftKey);
                break;
            case 27:
                t.close()
            }
        }),
        this.findPreviousButton.addEventListener("click",
        function() {
            t.dispatchEvent("again", !0)
        }),
        this.findNextButton.addEventListener("click",
        function() {
            t.dispatchEvent("again", !1)
        }),
        this.highlightAll.addEventListener("click",
        function() {
            t.dispatchEvent("highlightallchange")
        }),
        this.caseSensitive.addEventListener("click",
        function() {
            t.dispatchEvent("casesensitivitychange")
        })
    }
    return e.prototype = {
        dispatchEvent: function(e, t) {
            var i = document.createEvent("CustomEvent");
            return i.initCustomEvent("find" + e, !0, !0, {
                query: this.findField.value,
                caseSensitive: this.caseSensitive.checked,
                highlightAll: this.highlightAll.checked,
                findPrevious: t
            }),
            window.dispatchEvent(i)
        },
        updateUIState: function(e, t, i) {
            var n = !1,
            r = "",
            s = "";
            switch (e) {
            case FindStates.FIND_FOUND:
                break;
            case FindStates.FIND_PENDING:
                s = "pending";
                break;
            case FindStates.FIND_NOTFOUND:
                r = mozL10n.get("find_not_found", null, "Phrase not found"),
                n = !0;
                break;
            case FindStates.FIND_WRAPPED:
                r = t ? mozL10n.get("find_reached_top", null, "Reached top of document, continued from bottom") : mozL10n.get("find_reached_bottom", null, "Reached end of document, continued from top")
            }
            n ? this.findField.classList.add("notFound") : this.findField.classList.remove("notFound"),
            this.findField.setAttribute("data-status", s),
            this.findMsg.textContent = r,
            this.updateResultsCount(i)
        },
        updateResultsCount: function(e) {
            if (this.findResultsCount) {
                if (!e) return void this.findResultsCount.classList.add("hidden");
                this.findResultsCount.textContent = e.toLocaleString(),
                this.findResultsCount.classList.remove("hidden")
            }
        },
        open: function() {
            this.opened || (this.opened = !0, this.toggleButton.classList.add("toggled"), this.bar.classList.remove("hidden")),
            this.findField.select(),
            this.findField.focus()
        },
        close: function() {
            this.opened && (this.opened = !1, this.toggleButton.classList.remove("toggled"), this.bar.classList.add("hidden"), this.findController.active = !1)
        },
        toggle: function() {
            this.opened ? this.close() : this.open()
        }
    },
    e
} (),
FindStates = {
    FIND_FOUND: 0,
    FIND_NOTFOUND: 1,
    FIND_WRAPPED: 2,
    FIND_PENDING: 3
},
FIND_SCROLL_OFFSET_TOP = -50,
FIND_SCROLL_OFFSET_LEFT = -400,
PDFFindController = function() {
    function e(e) {
        this.startedTextExtraction = !1,
        this.extractTextPromises = [],
        this.pendingFindMatches = {},
        this.active = !1,
        this.pageContents = [],
        this.pageMatches = [],
        this.matchCount = 0,
        this.selected = {
            pageIdx: -1,
            matchIdx: -1
        },
        this.offset = {
            pageIdx: null,
            matchIdx: null
        },
        this.pagesToSearch = null,
        this.resumePageIdx = null,
        this.state = null,
        this.dirtyMatch = !1,
        this.findTimeout = null,
        this.pdfViewer = e.pdfViewer || null,
        this.integratedFind = e.integratedFind || !1,
        this.charactersToNormalize = {
            "‘": "'",
            "’": "'",
            "‚": "'",
            "‛": "'",
            "“": '"',
            "”": '"',
            "„": '"',
            "‟": '"',
            "¼": "1/4",
            "½": "1/2",
            "¾": "3/4"
        },
        this.findBar = e.findBar || null;
        var t = Object.keys(this.charactersToNormalize).join("");
        this.normalizationRegex = new RegExp("[" + t + "]", "g");
        var i = ["find", "findagain", "findhighlightallchange", "findcasesensitivitychange"];
        this.firstPagePromise = new Promise(function(e) {
            this.resolveFirstPage = e
        }.bind(this)),
        this.handleEvent = this.handleEvent.bind(this);
        for (var n = 0,
        r = i.length; r > n; n++) window.addEventListener(i[n], this.handleEvent)
    }
    return e.prototype = {
        setFindBar: function(e) {
            this.findBar = e
        },
        reset: function() {
            this.startedTextExtraction = !1,
            this.extractTextPromises = [],
            this.active = !1
        },
        normalize: function(e) {
            var t = this;
            return e.replace(this.normalizationRegex,
            function(e) {
                return t.charactersToNormalize[e]
            })
        },
        calcFindMatch: function(e) {
            var t = this.normalize(this.pageContents[e]),
            i = this.normalize(this.state.query),
            n = this.state.caseSensitive,
            r = i.length;
            if (0 !== r) {
                n || (t = t.toLowerCase(), i = i.toLowerCase());
                for (var s = [], a = -r;;) {
                    if (a = t.indexOf(i, a + r), -1 === a) break;
                    s.push(a)
                }
                this.pageMatches[e] = s,
                this.updatePage(e),
                this.resumePageIdx === e && (this.resumePageIdx = null, this.nextPageMatch()),
                s.length > 0 && (this.matchCount += s.length, this.updateUIResultsCount())
            }
        },
        extractText: function() {
            function e(i) {
                r.pdfViewer.getPageTextContent(i).then(function(n) {
                    for (var s = n.items,
                    a = [], o = 0, d = s.length; d > o; o++) a.push(s[o].str);
                    r.pageContents.push(a.join("")),
                    t[i](i),
                    i + 1 < r.pdfViewer.pagesCount && e(i + 1)
                })
            }
            if (!this.startedTextExtraction) {
                this.startedTextExtraction = !0,
                this.pageContents = [];
                for (var t = [], i = this.pdfViewer.pagesCount, n = 0; i > n; n++) this.extractTextPromises.push(new Promise(function(e) {
                    t.push(e)
                }));
                var r = this;
                e(0)
            }
        },
        handleEvent: function(e) { (null === this.state || "findagain" !== e.type) && (this.dirtyMatch = !0),
            this.state = e.detail,
            this.updateUIState(FindStates.FIND_PENDING),
            this.firstPagePromise.then(function() {
                this.extractText(),
                clearTimeout(this.findTimeout),
                "find" === e.type ? this.findTimeout = setTimeout(this.nextMatch.bind(this), 250) : this.nextMatch()
            }.bind(this))
        },
        updatePage: function(e) {
            this.selected.pageIdx === e && this.pdfViewer.scrollPageIntoView(e + 1);
            var t = this.pdfViewer.getPageView(e);
            t.textLayer && t.textLayer.updateMatches()
        },
        nextMatch: function() {
            var e = this.state.findPrevious,
            t = this.pdfViewer.currentPageNumber - 1,
            i = this.pdfViewer.pagesCount;
            if (this.active = !0, this.dirtyMatch) {
                this.dirtyMatch = !1,
                this.selected.pageIdx = this.selected.matchIdx = -1,
                this.offset.pageIdx = t,
                this.offset.matchIdx = null,
                this.hadMatch = !1,
                this.resumePageIdx = null,
                this.pageMatches = [],
                this.matchCount = 0;
                for (var n = this,
                r = 0; i > r; r++) this.updatePage(r),
                r in this.pendingFindMatches || (this.pendingFindMatches[r] = !0, this.extractTextPromises[r].then(function(e) {
                    delete n.pendingFindMatches[e],
                    n.calcFindMatch(e)
                }))
            }
            if ("" === this.state.query) return void this.updateUIState(FindStates.FIND_FOUND);
            if (!this.resumePageIdx) {
                var s = this.offset;
                if (this.pagesToSearch = i, null !== s.matchIdx) {
                    var a = this.pageMatches[s.pageIdx].length;
                    if (!e && s.matchIdx + 1 < a || e && s.matchIdx > 0) return this.hadMatch = !0,
                    s.matchIdx = e ? s.matchIdx - 1 : s.matchIdx + 1,
                    void this.updateMatch(!0);
                    this.advanceOffsetPage(e)
                }
                this.nextPageMatch()
            }
        },
        matchesReady: function(e) {
            var t = this.offset,
            i = e.length,
            n = this.state.findPrevious;
            return i ? (this.hadMatch = !0, t.matchIdx = n ? i - 1 : 0, this.updateMatch(!0), !0) : (this.advanceOffsetPage(n), t.wrapped && (t.matchIdx = null, this.pagesToSearch < 0) ? (this.updateMatch(!1), !0) : !1)
        },
        updateMatchPosition: function(e, t, i, n, r) {
            if (this.selected.matchIdx === t && this.selected.pageIdx === e) {
                var s = {
                    top: FIND_SCROLL_OFFSET_TOP,
                    left: FIND_SCROLL_OFFSET_LEFT
                };
                scrollIntoView(i[n], s, !0)
            }
        },
        nextPageMatch: function() {
            null !== this.resumePageIdx && console.error("There can only be one pending page.");
            do {
                var e = this.offset.pageIdx,
                t = this.pageMatches[e];
                if (!t) {
                    this.resumePageIdx = e;
                    break
                }
            } while (! this . matchesReady ( t ))
        },
        advanceOffsetPage: function(e) {
            var t = this.offset,
            i = this.extractTextPromises.length;
            t.pageIdx = e ? t.pageIdx - 1 : t.pageIdx + 1,
            t.matchIdx = null,
            this.pagesToSearch--,
            (t.pageIdx >= i || t.pageIdx < 0) && (t.pageIdx = e ? i - 1 : 0, t.wrapped = !0)
        },
        updateMatch: function(e) {
            var t = FindStates.FIND_NOTFOUND,
            i = this.offset.wrapped;
            if (this.offset.wrapped = !1, e) {
                var n = this.selected.pageIdx;
                this.selected.pageIdx = this.offset.pageIdx,
                this.selected.matchIdx = this.offset.matchIdx,
                t = i ? FindStates.FIND_WRAPPED: FindStates.FIND_FOUND,
                -1 !== n && n !== this.selected.pageIdx && this.updatePage(n)
            }
            this.updateUIState(t, this.state.findPrevious),
            -1 !== this.selected.pageIdx && this.updatePage(this.selected.pageIdx)
        },
        updateUIResultsCount: function() {
            if (null === this.findBar) throw new Error("PDFFindController is not initialized with a PDFFindBar instance.");
            this.findBar.updateResultsCount(this.matchCount)
        },
        updateUIState: function(e, t) {
            if (this.integratedFind) return void FirefoxCom.request("updateFindControlState", {
                result: e,
                findPrevious: t
            });
            if (null === this.findBar) throw new Error("PDFFindController is not initialized with a PDFFindBar instance.");
            this.findBar.updateUIState(e, t, this.matchCount)
        }
    },
    e
} (),
PDFLinkService = function() {
    function e() {
        this.baseUrl = null,
        this.pdfDocument = null,
        this.pdfViewer = null,
        this.pdfHistory = null,
        this._pagesRefCache = null
    }
    return e.prototype = {
        setDocument: function(e, t) {
            this.baseUrl = t,
            this.pdfDocument = e,
            this._pagesRefCache = Object.create(null)
        },
        setViewer: function(e) {
            this.pdfViewer = e
        },
        setHistory: function(e) {
            this.pdfHistory = e
        },
        get pagesCount() {
            return this.pdfDocument.numPages
        },
        get page() {
            return this.pdfViewer.currentPageNumber
        },
        set page(e) {
            this.pdfViewer.currentPageNumber = e
        },
        navigateTo: function(e) {
            var t, i = "",
            n = this,
            r = function(t) {
                var s = t instanceof Object ? n._pagesRefCache[t.num + " " + t.gen + " R"] : t + 1;
                s ? (s > n.pagesCount && (s = n.pagesCount), n.pdfViewer.scrollPageIntoView(s, e), n.pdfHistory && n.pdfHistory.push({
                    dest: e,
                    hash: i,
                    page: s
                })) : n.pdfDocument.getPageIndex(t).then(function(e) {
                    var i = e + 1,
                    s = t.num + " " + t.gen + " R";
                    n._pagesRefCache[s] = i,
                    r(t)
                })
            };
            "string" == typeof e ? (i = e, t = this.pdfDocument.getDestination(e)) : t = Promise.resolve(e),
            t.then(function(t) {
                e = t,
                t instanceof Array && r(t[0])
            })
        },
        getDestinationHash: function(e) {
            if ("string" == typeof e) return this.getAnchorUrl("#" + escape(e));
            if (e instanceof Array) {
                var t = e[0],
                i = t instanceof Object ? this._pagesRefCache[t.num + " " + t.gen + " R"] : t + 1;
                if (i) {
                    var n = this.getAnchorUrl("#page=" + i),
                    r = e[1];
                    if ("object" == typeof r && "name" in r && "XYZ" === r.name) {
                        var s = e[4] || this.pdfViewer.currentScaleValue,
                        a = parseFloat(s);
                        a && (s = 100 * a),
                        n += "&zoom=" + s,
                        (e[2] || e[3]) && (n += "," + (e[2] || 0) + "," + (e[3] || 0))
                    }
                    return n
                }
            }
            return ""
        },
        getAnchorUrl: function(e) {
            return (this.baseUrl || "") + e
        },
        setHash: function(e) {
            if (e.indexOf("=") >= 0) {
                var t = parseQueryString(e);
                if ("nameddest" in t) return this.pdfHistory && this.pdfHistory.updateNextHashParam(t.nameddest),
                void this.navigateTo(t.nameddest);
                var i, n;
                if ("page" in t && (i = 0 | t.page || 1), "zoom" in t) {
                    var r = t.zoom.split(","),
                    s = r[0],
                    a = parseFloat(s); - 1 === s.indexOf("Fit") ? n = [null, {
                        name: "XYZ"
                    },
                    r.length > 1 ? 0 | r[1] : null, r.length > 2 ? 0 | r[2] : null, a ? a / 100 : s] : "Fit" === s || "FitB" === s ? n = [null, {
                        name: s
                    }] : "FitH" === s || "FitBH" === s || "FitV" === s || "FitBV" === s ? n = [null, {
                        name: s
                    },
                    r.length > 1 ? 0 | r[1] : null] : "FitR" === s ? 5 !== r.length ? console.error("PDFLinkService_setHash: Not enough parameters for 'FitR'.") : n = [null, {
                        name: s
                    },
                    0 | r[1], 0 | r[2], 0 | r[3], 0 | r[4]] : console.error("PDFLinkService_setHash: '" + s + "' is not a valid zoom value.")
                }
                if (n ? this.pdfViewer.scrollPageIntoView(i || this.page, n) : i && (this.page = i), "pagemode" in t) {
                    var o = document.createEvent("CustomEvent");
                    o.initCustomEvent("pagemode", !0, !0, {
                        mode: t.pagemode
                    }),
                    this.pdfViewer.container.dispatchEvent(o)
                }
            } else / ^\d + $ / .test(e) ? this.page = e: (this.pdfHistory && this.pdfHistory.updateNextHashParam(unescape(e)), this.navigateTo(unescape(e)))
        },
        executeNamedAction: function(e) {
            switch (e) {
            case "GoBack":
                this.pdfHistory && this.pdfHistory.back();
                break;
            case "GoForward":
                this.pdfHistory && this.pdfHistory.forward();
                break;
            case "NextPage":
                this.page++;
                break;
            case "PrevPage":
                this.page--;
                break;
            case "LastPage":
                this.page = this.pagesCount;
                break;
            case "FirstPage":
                this.page = 1
            }
            var t = document.createEvent("CustomEvent");
            t.initCustomEvent("namedaction", !0, !0, {
                action: e
            }),
            this.pdfViewer.container.dispatchEvent(t)
        },
        cachePageRef: function(e, t) {
            var i = t.num + " " + t.gen + " R";
            this._pagesRefCache[i] = e
        }
    },
    e
} (),
PDFHistory = function() {
    function e(e) {
        this.linkService = e.linkService,
        this.initialized = !1,
        this.initialDestination = null,
        this.initialBookmark = null
    }
    return e.prototype = {
        initialize: function(e) {
            function t() {
                s.previousHash = window.location.hash.slice(1),
                s._pushToHistory({
                    hash: s.previousHash
                },
                !1, !0),
                s._updatePreviousBookmark()
            }
            function i(e, t) {
                function i() {
                    window.removeEventListener("popstate", i),
                    window.addEventListener("popstate", n),
                    s._pushToHistory(e, !1, !0),
                    history.forward()
                }
                function n() {
                    window.removeEventListener("popstate", n),
                    s.allowHashChange = !0,
                    s.historyUnlocked = !0,
                    t()
                }
                s.historyUnlocked = !1,
                s.allowHashChange = !1,
                window.addEventListener("popstate", i),
                history.back()
            }
            function n() {
                var e = s._getPreviousParams(null, !0);
                if (e) {
                    var t = !s.current.dest && s.current.hash !== s.previousHash;
                    s._pushToHistory(e, !1, t),
                    s._updatePreviousBookmark()
                }
                window.removeEventListener("beforeunload", n, !1)
            }
            this.initialized = !0,
            this.reInitialized = !1,
            this.allowHashChange = !0,
            this.historyUnlocked = !0,
            this.isViewerInPresentationMode = !1,
            this.previousHash = window.location.hash.substring(1),
            this.currentBookmark = "",
            this.currentPage = 0,
            this.updatePreviousBookmark = !1,
            this.previousBookmark = "",
            this.previousPage = 0,
            this.nextHashParam = "",
            this.fingerprint = e,
            this.currentUid = this.uid = 0,
            this.current = {};
            var r = window.history.state;
            this._isStateObjectDefined(r) ? (r.target.dest ? this.initialDestination = r.target.dest: this.initialBookmark = r.target.hash, this.currentUid = r.uid, this.uid = r.uid + 1, this.current = r.target) : (r && r.fingerprint && this.fingerprint !== r.fingerprint && (this.reInitialized = !0), this._pushOrReplaceState({
                fingerprint: this.fingerprint
            },
            !0));
            var s = this;
            window.addEventListener("popstate",
            function(e) {
                if (s.historyUnlocked) {
                    if (e.state) return void s._goTo(e.state);
                    if (0 === s.uid) {
                        var n = s.previousHash && s.currentBookmark && s.previousHash !== s.currentBookmark ? {
                            hash: s.currentBookmark,
                            page: s.currentPage
                        }: {
                            page: 1
                        };
                        i(n,
                        function() {
                            t()
                        })
                    } else t()
                }
            },
            !1),
            window.addEventListener("beforeunload", n, !1),
            window.addEventListener("pageshow",
            function(e) {
                window.addEventListener("beforeunload", n, !1)
            },
            !1),
            window.addEventListener("presentationmodechanged",
            function(e) {
                s.isViewerInPresentationMode = !!e.detail.active
            })
        },
        clearHistoryState: function() {
            this._pushOrReplaceState(null, !0)
        },
        _isStateObjectDefined: function(e) {
            return e && e.uid >= 0 && e.fingerprint && this.fingerprint === e.fingerprint && e.target && e.target.hash ? !0 : !1
        },
        _pushOrReplaceState: function(e, t) {
            t ? window.history.replaceState(e, "", document.URL) : window.history.pushState(e, "", document.URL)
        },
        get isHashChangeUnlocked() {
            return this.initialized ? this.allowHashChange: !0
        },
        _updatePreviousBookmark: function() {
            this.updatePreviousBookmark && this.currentBookmark && this.currentPage && (this.previousBookmark = this.currentBookmark, this.previousPage = this.currentPage, this.updatePreviousBookmark = !1)
        },
        updateCurrentBookmark: function(e, t) {
            this.initialized && (this.currentBookmark = e.substring(1), this.currentPage = 0 | t, this._updatePreviousBookmark())
        },
        updateNextHashParam: function(e) {
            this.initialized && (this.nextHashParam = e)
        },
        push: function(e, t) {
            if (this.initialized && this.historyUnlocked) {
                if (e.dest && !e.hash && (e.hash = this.current.hash && this.current.dest && this.current.dest === e.dest ? this.current.hash: this.linkService.getDestinationHash(e.dest).split("#")[1]), e.page && (e.page |= 0), t) {
                    var i = window.history.state.target;
                    return i || (this._pushToHistory(e, !1), this.previousHash = window.location.hash.substring(1)),
                    this.updatePreviousBookmark = this.nextHashParam ? !1 : !0,
                    void(i && this._updatePreviousBookmark())
                }
                if (this.nextHashParam) {
                    if (this.nextHashParam === e.hash) return this.nextHashParam = null,
                    void(this.updatePreviousBookmark = !0);
                    this.nextHashParam = null
                }
                e.hash ? this.current.hash ? this.current.hash !== e.hash ? this._pushToHistory(e, !0) : (!this.current.page && e.page && this._pushToHistory(e, !1, !0), this.updatePreviousBookmark = !0) : this._pushToHistory(e, !0) : this.current.page && e.page && this.current.page !== e.page && this._pushToHistory(e, !0)
            }
        },
        _getPreviousParams: function(e, t) {
            if (!this.currentBookmark || !this.currentPage) return null;
            if (this.updatePreviousBookmark && (this.updatePreviousBookmark = !1), this.uid > 0 && (!this.previousBookmark || !this.previousPage)) return null;
            if (!this.current.dest && !e || t) {
                if (this.previousBookmark === this.currentBookmark) return null
            } else {
                if (!this.current.page && !e) return null;
                if (this.previousPage === this.currentPage) return null
            }
            var i = {
                hash: this.currentBookmark,
                page: this.currentPage
            };
            return this.isViewerInPresentationMode && (i.hash = null),
            i
        },
        _stateObj: function(e) {
            return {
                fingerprint: this.fingerprint,
                uid: this.uid,
                target: e
            }
        },
        _pushToHistory: function(e, t, i) {
            if (this.initialized) {
                if (!e.hash && e.page && (e.hash = "page=" + e.page), t && !i) {
                    var n = this._getPreviousParams();
                    if (n) {
                        var r = !this.current.dest && this.current.hash !== this.previousHash;
                        this._pushToHistory(n, !1, r)
                    }
                }
                this._pushOrReplaceState(this._stateObj(e), i || 0 === this.uid),
                this.currentUid = this.uid++,
                this.current = e,
                this.updatePreviousBookmark = !0
            }
        },
        _goTo: function(e) {
            if (this.initialized && this.historyUnlocked && this._isStateObjectDefined(e)) {
                if (!this.reInitialized && e.uid < this.currentUid) {
                    var t = this._getPreviousParams(!0);
                    if (t) return this._pushToHistory(this.current, !1),
                    this._pushToHistory(t, !1),
                    this.currentUid = e.uid,
                    void window.history.back()
                }
                this.historyUnlocked = !1,
                e.target.dest ? this.linkService.navigateTo(e.target.dest) : this.linkService.setHash(e.target.hash),
                this.currentUid = e.uid,
                e.uid > this.uid && (this.uid = e.uid),
                this.current = e.target,
                this.updatePreviousBookmark = !0;
                var i = window.location.hash.substring(1);
                this.previousHash !== i && (this.allowHashChange = !1),
                this.previousHash = i,
                this.historyUnlocked = !0
            }
        },
        back: function() {
            this.go( - 1)
        },
        forward: function() {
            this.go(1)
        },
        go: function(e) {
            if (this.initialized && this.historyUnlocked) {
                var t = window.history.state; - 1 === e && t && t.uid > 0 ? window.history.back() : 1 === e && t && t.uid < this.uid - 1 && window.history.forward()
            }
        }
    },
    e
} (),
SecondaryToolbar = {
    opened: !1,
    previousContainerHeight: null,
    newContainerHeight: null,
    initialize: function(e) {
        this.toolbar = e.toolbar,
        this.buttonContainer = this.toolbar.firstElementChild,
        this.toggleButton = e.toggleButton,
        this.presentationModeButton = e.presentationModeButton,
        this.openFile = e.openFile,
        this.print = e.print,
        this.download = e.download,
        this.viewBookmark = e.viewBookmark,
        this.firstPage = e.firstPage,
        this.lastPage = e.lastPage,
        this.pageRotateCw = e.pageRotateCw,
        this.pageRotateCcw = e.pageRotateCcw,
        this.documentPropertiesButton = e.documentPropertiesButton;
        var t = [{
            element: this.toggleButton,
            handler: this.toggle
        },
        {
            element: this.presentationModeButton,
            handler: this.presentationModeClick
        },
        {
            element: this.openFile,
            handler: this.openFileClick
        },
        {
            element: this.print,
            handler: this.printClick
        },
        {
            element: this.download,
            handler: this.downloadClick
        },
        {
            element: this.viewBookmark,
            handler: this.viewBookmarkClick
        },
        {
            element: this.firstPage,
            handler: this.firstPageClick
        },
        {
            element: this.lastPage,
            handler: this.lastPageClick
        },
        {
            element: this.pageRotateCw,
            handler: this.pageRotateCwClick
        },
        {
            element: this.pageRotateCcw,
            handler: this.pageRotateCcwClick
        },
        {
            element: this.documentPropertiesButton,
            handler: this.documentPropertiesClick
        }];
        for (var i in t) {
            var n = t[i].element;
            n && n.addEventListener("click", t[i].handler.bind(this))
        }
    },
    presentationModeClick: function(e) {
        PDFViewerApplication.requestPresentationMode(),
        this.close()
    },
    openFileClick: function(e) {
        document.getElementById("fileInput").click(),
        this.close()
    },
    printClick: function(e) {
        window.print(),
        this.close()
    },
    downloadClick: function(e) {
        PDFViewerApplication.download(),
        this.close()
    },
    viewBookmarkClick: function(e) {
        this.close()
    },
    firstPageClick: function(e) {
        PDFViewerApplication.page = 1,
        this.close()
    },
    lastPageClick: function(e) {
        PDFViewerApplication.pdfDocument && (PDFViewerApplication.page = PDFViewerApplication.pagesCount),
        this.close()
    },
    pageRotateCwClick: function(e) {
        PDFViewerApplication.rotatePages(90)
    },
    pageRotateCcwClick: function(e) {
        PDFViewerApplication.rotatePages( - 90)
    },
    documentPropertiesClick: function(e) {
        PDFViewerApplication.pdfDocumentProperties.open(),
        this.close()
    },
    setMaxHeight: function(e) {
        e && this.buttonContainer && (this.newContainerHeight = e.clientHeight, this.previousContainerHeight !== this.newContainerHeight && (this.buttonContainer.setAttribute("style", "max-height: " + (this.newContainerHeight - SCROLLBAR_PADDING) + "px;"), this.previousContainerHeight = this.newContainerHeight))
    },
    open: function() {
        this.opened || (this.opened = !0, this.toggleButton.classList.add("toggled"), this.toolbar.classList.remove("hidden"))
    },
    close: function(e) {
        this.opened && (!e || this.toolbar.contains(e)) && (this.opened = !1, this.toolbar.classList.add("hidden"), this.toggleButton.classList.remove("toggled"))
    },
    toggle: function() {
        this.opened ? this.close() : this.open()
    }
},
DELAY_BEFORE_RESETTING_SWITCH_IN_PROGRESS = 1500,
DELAY_BEFORE_HIDING_CONTROLS = 3e3,
ACTIVE_SELECTOR = "pdfPresentationMode",
CONTROLS_SELECTOR = "pdfPresentationModeControls",
PDFPresentationMode = function() {
    function e(e) {
        this.container = e.container,
        this.viewer = e.viewer || e.container.firstElementChild,
        this.pdfViewer = e.pdfViewer,
        this.pdfThumbnailViewer = e.pdfThumbnailViewer || null;
        var t = e.contextMenuItems || null;
        if (this.active = !1, this.args = null, this.contextMenuOpen = !1, this.mouseScrollTimeStamp = 0, this.mouseScrollDelta = 0, t) for (var i = 0,
        n = t.length; n > i; i++) {
            var r = t[i];
            r.element.addEventListener("click",
            function(e) {
                this.contextMenuOpen = !1,
                e()
            }.bind(this, r.handler))
        }
    }
    return e.prototype = {
        request: function() {
            if (this.switchInProgress || this.active || !this.viewer.hasChildNodes()) return ! 1;
            if (this._addFullscreenChangeListeners(), this._setSwitchInProgress(), this._notifyStateChange(), this.container.requestFullscreen) this.container.requestFullscreen();
            else if (this.container.mozRequestFullScreen) this.container.mozRequestFullScreen();
            else if (this.container.webkitRequestFullscreen) this.container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            else {
                if (!this.container.msRequestFullscreen) return ! 1;
                this.container.msRequestFullscreen()
            }
            return this.args = {
                page: this.pdfViewer.currentPageNumber,
                previousScale: this.pdfViewer.currentScaleValue
            },
            !0
        },
        mouseScroll: function(e) {
            if (this.active) {
                var t = 50,
                i = 120,
                n = {
                    UP: -1,
                    DOWN: 1
                },
                r = (new Date).getTime(),
                s = this.mouseScrollTimeStamp;
                if (! (r > s && t > r - s) && ((this.mouseScrollDelta > 0 && 0 > e || this.mouseScrollDelta < 0 && e > 0) && this._resetMouseScrollState(), this.mouseScrollDelta += e, Math.abs(this.mouseScrollDelta) >= i)) {
                    var a = this.mouseScrollDelta > 0 ? n.UP: n.DOWN,
                    o = this.pdfViewer.currentPageNumber;
                    if (this._resetMouseScrollState(), 1 === o && a === n.UP || o === this.pdfViewer.pagesCount && a === n.DOWN) return;
                    this.pdfViewer.currentPageNumber = o + a,
                    this.mouseScrollTimeStamp = r
                }
            }
        },
        get isFullscreen() {
            return !! (document.fullscreenElement || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement)
        },
        _notifyStateChange: function() {
            var e = document.createEvent("CustomEvent");
            e.initCustomEvent("presentationmodechanged", !0, !0, {
                active: this.active,
                switchInProgress: !!this.switchInProgress
            }),
            window.dispatchEvent(e)
        },
        _setSwitchInProgress: function() {
            this.switchInProgress && clearTimeout(this.switchInProgress),
            this.switchInProgress = setTimeout(function() {
                this._removeFullscreenChangeListeners(),
                delete this.switchInProgress,
                this._notifyStateChange()
            }.bind(this), DELAY_BEFORE_RESETTING_SWITCH_IN_PROGRESS)
        },
        _resetSwitchInProgress: function() {
            this.switchInProgress && (clearTimeout(this.switchInProgress), delete this.switchInProgress)
        },
        _enter: function() {
            this.active = !0,
            this._resetSwitchInProgress(),
            this._notifyStateChange(),
            this.container.classList.add(ACTIVE_SELECTOR),
            setTimeout(function() {
                this.pdfViewer.currentPageNumber = this.args.page,
                this.pdfViewer.currentScaleValue = "page-fit"
            }.bind(this), 0),
            this._addWindowListeners(),
            this._showControls(),
            this.contextMenuOpen = !1,
            this.container.setAttribute("contextmenu", "viewerContextMenu"),
            window.getSelection().removeAllRanges()
        },
        _exit: function() {
            var e = this.pdfViewer.currentPageNumber;
            this.container.classList.remove(ACTIVE_SELECTOR),
            setTimeout(function() {
                this.active = !1,
                this._removeFullscreenChangeListeners(),
                this._notifyStateChange(),
                this.pdfViewer.currentScaleValue = this.args.previousScale,
                this.pdfViewer.currentPageNumber = e,
                this.args = null
            }.bind(this), 0),
            this._removeWindowListeners(),
            this._hideControls(),
            this._resetMouseScrollState(),
            this.container.removeAttribute("contextmenu"),
            this.contextMenuOpen = !1,
            this.pdfThumbnailViewer && this.pdfThumbnailViewer.ensureThumbnailVisible(e)
        },
        _mouseDown: function(e) {
            if (this.contextMenuOpen) return this.contextMenuOpen = !1,
            void e.preventDefault();
            if (0 === e.button) {
                var t = e.target.href && e.target.classList.contains("internalLink");
                t || (e.preventDefault(), this.pdfViewer.currentPageNumber += e.shiftKey ? -1 : 1)
            }
        },
        _contextMenu: function() {
            this.contextMenuOpen = !0
        },
        _showControls: function() {
            this.controlsTimeout ? clearTimeout(this.controlsTimeout) : this.container.classList.add(CONTROLS_SELECTOR),
            this.controlsTimeout = setTimeout(function() {
                this.container.classList.remove(CONTROLS_SELECTOR),
                delete this.controlsTimeout
            }.bind(this), DELAY_BEFORE_HIDING_CONTROLS)
        },
        _hideControls: function() {
            this.controlsTimeout && (clearTimeout(this.controlsTimeout), this.container.classList.remove(CONTROLS_SELECTOR), delete this.controlsTimeout)
        },
        _resetMouseScrollState: function() {
            this.mouseScrollTimeStamp = 0,
            this.mouseScrollDelta = 0
        },
        _addWindowListeners: function() {
            this.showControlsBind = this._showControls.bind(this),
            this.mouseDownBind = this._mouseDown.bind(this),
            this.resetMouseScrollStateBind = this._resetMouseScrollState.bind(this),
            this.contextMenuBind = this._contextMenu.bind(this),
            window.addEventListener("mousemove", this.showControlsBind),
            window.addEventListener("mousedown", this.mouseDownBind),
            window.addEventListener("keydown", this.resetMouseScrollStateBind),
            window.addEventListener("contextmenu", this.contextMenuBind)
        },
        _removeWindowListeners: function() {
            window.removeEventListener("mousemove", this.showControlsBind),
            window.removeEventListener("mousedown", this.mouseDownBind),
            window.removeEventListener("keydown", this.resetMouseScrollStateBind),
            window.removeEventListener("contextmenu", this.contextMenuBind),
            delete this.showControlsBind,
            delete this.mouseDownBind,
            delete this.resetMouseScrollStateBind,
            delete this.contextMenuBind
        },
        _fullscreenChange: function() {
            this.isFullscreen ? this._enter() : this._exit()
        },
        _addFullscreenChangeListeners: function() {
            this.fullscreenChangeBind = this._fullscreenChange.bind(this),
            window.addEventListener("fullscreenchange", this.fullscreenChangeBind),
            window.addEventListener("mozfullscreenchange", this.fullscreenChangeBind),
            window.addEventListener("webkitfullscreenchange", this.fullscreenChangeBind),
            window.addEventListener("MSFullscreenChange", this.fullscreenChangeBind)
        },
        _removeFullscreenChangeListeners: function() {
            window.removeEventListener("fullscreenchange", this.fullscreenChangeBind),
            window.removeEventListener("mozfullscreenchange", this.fullscreenChangeBind),
            window.removeEventListener("webkitfullscreenchange", this.fullscreenChangeBind),
            window.removeEventListener("MSFullscreenChange", this.fullscreenChangeBind),
            delete this.fullscreenChangeBind
        }
    },
    e
} (),
GrabToPan = function() {
    function e(e) {
        this.element = e.element,
        this.document = e.element.ownerDocument,
        "function" == typeof e.ignoreTarget && (this.ignoreTarget = e.ignoreTarget),
        this.onActiveChanged = e.onActiveChanged,
        this.activate = this.activate.bind(this),
        this.deactivate = this.deactivate.bind(this),
        this.toggle = this.toggle.bind(this),
        this._onmousedown = this._onmousedown.bind(this),
        this._onmousemove = this._onmousemove.bind(this),
        this._endPan = this._endPan.bind(this);
        var t = this.overlay = document.createElement("div");
        t.className = "grab-to-pan-grabbing"
    }
    function t(e) {
        return "buttons" in e && n ? !(1 | e.buttons) : s || a ? 0 === e.which: void 0
    }
    e.prototype = {
        CSS_CLASS_GRAB: "grab-to-pan-grab",
        activate: function() {
            this.active || (this.active = !0, this.element.addEventListener("mousedown", this._onmousedown, !0), this.element.classList.add(this.CSS_CLASS_GRAB), this.onActiveChanged && this.onActiveChanged(!0))
        },
        deactivate: function() {
            this.active && (this.active = !1, this.element.removeEventListener("mousedown", this._onmousedown, !0), this._endPan(), this.element.classList.remove(this.CSS_CLASS_GRAB), this.onActiveChanged && this.onActiveChanged(!1))
        },
        toggle: function() {
            this.active ? this.deactivate() : this.activate()
        },
        ignoreTarget: function(e) {
            return e[i]("a[href], a[href] *, input, textarea, button, button *, select, option")
        },
        _onmousedown: function(e) {
            if (0 === e.button && !this.ignoreTarget(e.target)) {
                if (e.originalTarget) try {
                    e.originalTarget.tagName
                } catch(t) {
                    return
                }
                this.scrollLeftStart = this.element.scrollLeft,
                this.scrollTopStart = this.element.scrollTop,
                this.clientXStart = e.clientX,
                this.clientYStart = e.clientY,
                this.document.addEventListener("mousemove", this._onmousemove, !0),
                this.document.addEventListener("mouseup", this._endPan, !0),
                this.element.addEventListener("scroll", this._endPan, !0),
                e.preventDefault(),
                e.stopPropagation(),
                this.document.documentElement.classList.add(this.CSS_CLASS_GRABBING);
                var i = document.activeElement;
                i && !i.contains(e.target) && i.blur()
            }
        },
        _onmousemove: function(e) {
            if (this.element.removeEventListener("scroll", this._endPan, !0), t(e)) return void this._endPan();
            var i = e.clientX - this.clientXStart,
            n = e.clientY - this.clientYStart;
            this.element.scrollTop = this.scrollTopStart - n,
            this.element.scrollLeft = this.scrollLeftStart - i,
            this.overlay.parentNode || document.body.appendChild(this.overlay)
        },
        _endPan: function() {
            this.element.removeEventListener("scroll", this._endPan, !0),
            this.document.removeEventListener("mousemove", this._onmousemove, !0),
            this.document.removeEventListener("mouseup", this._endPan, !0),
            this.overlay.parentNode && this.overlay.parentNode.removeChild(this.overlay)
        }
    };
    var i; ["webkitM", "mozM", "msM", "oM", "m"].some(function(e) {
        var t = e + "atches";
        return t in document.documentElement && (i = t),
        t += "Selector",
        t in document.documentElement && (i = t),
        i
    });
    var n = !document.documentMode || document.documentMode > 9,
    r = window.chrome,
    s = r && (r.webstore || r.app),
    a = /Apple/.test(navigator.vendor) && /Version\/([6-9]\d*|[1-5]\d+)/.test(navigator.userAgent);
    return e
} (),
HandTool = {
    initialize: function(e) {
        var t = e.toggleHandTool;
        this.handTool = new GrabToPan({
            element: e.container,
            onActiveChanged: function(e) {
                t && (e ? (t.title = mozL10n.get("hand_tool_disable.title", null, "Disable hand tool"), t.firstElementChild.textContent = mozL10n.get("hand_tool_disable_label", null, "Disable hand tool")) : (t.title = mozL10n.get("hand_tool_enable.title", null, "Enable hand tool"), t.firstElementChild.textContent = mozL10n.get("hand_tool_enable_label", null, "Enable hand tool")))
            }
        }),
        t && (t.addEventListener("click", this.toggle.bind(this), !1), window.addEventListener("localized",
        function(e) {
            Preferences.get("enableHandToolOnLoad").then(function(e) {
                e && this.handTool.activate()
            }.bind(this),
            function(e) {})
        }.bind(this)), window.addEventListener("presentationmodechanged",
        function(e) {
            e.detail.switchInProgress || (e.detail.active ? this.enterPresentationMode() : this.exitPresentationMode())
        }.bind(this)))
    },
    toggle: function() {
        this.handTool.toggle(),
        SecondaryToolbar.close()
    },
    enterPresentationMode: function() {
        this.handTool.active && (this.wasActive = !0, this.handTool.deactivate())
    },
    exitPresentationMode: function() {
        this.wasActive && (this.wasActive = null, this.handTool.activate())
    }
},
OverlayManager = {
    overlays: {},
    active: null,
    register: function(e, t, i) {
        return new Promise(function(n) {
            var r, s;
            if (! (e && (r = document.getElementById(e)) && (s = r.parentNode))) throw new Error("Not enough parameters.");
            if (this.overlays[e]) throw new Error("The overlay is already registered.");
            this.overlays[e] = {
                element: r,
                container: s,
                callerCloseMethod: t || null,
                canForceClose: i || !1
            },
            n()
        }.bind(this))
    },
    unregister: function(e) {
        return new Promise(function(t) {
            if (!this.overlays[e]) throw new Error("The overlay does not exist.");
            if (this.active === e) throw new Error("The overlay cannot be removed while it is active.");
            delete this.overlays[e],
            t()
        }.bind(this))
    },
    open: function(e) {
        return new Promise(function(t) {
            if (!this.overlays[e]) throw new Error("The overlay does not exist.");
            if (this.active) {
                if (!this.overlays[e].canForceClose) throw this.active === e ? new Error("The overlay is already active.") : new Error("Another overlay is currently active.");
                this._closeThroughCaller()
            }
            this.active = e,
            this.overlays[this.active].element.classList.remove("hidden"),
            this.overlays[this.active].container.classList.remove("hidden"),
            window.addEventListener("keydown", this._keyDown),
            t()
        }.bind(this))
    },
    close: function(e) {
        return new Promise(function(t) {
            if (!this.overlays[e]) throw new Error("The overlay does not exist.");
            if (!this.active) throw new Error("The overlay is currently not active.");
            if (this.active !== e) throw new Error("Another overlay is currently active.");
            this.overlays[this.active].container.classList.add("hidden"),
            this.overlays[this.active].element.classList.add("hidden"),
            this.active = null,
            window.removeEventListener("keydown", this._keyDown),
            t()
        }.bind(this))
    },
    _keyDown: function(e) {
        var t = OverlayManager;
        t.active && 27 === e.keyCode && (t._closeThroughCaller(), e.preventDefault())
    },
    _closeThroughCaller: function() {
        this.overlays[this.active].callerCloseMethod && this.overlays[this.active].callerCloseMethod(),
        this.active && this.close(this.active)
    }
},
PasswordPrompt = {
    overlayName: null,
    updatePassword: null,
    reason: null,
    passwordField: null,
    passwordText: null,
    passwordSubmit: null,
    passwordCancel: null,
    initialize: function(e) {
        this.overlayName = e.overlayName,
        this.passwordField = e.passwordField,
        this.passwordText = e.passwordText,
        this.passwordSubmit = e.passwordSubmit,
        this.passwordCancel = e.passwordCancel,
        this.passwordSubmit.addEventListener("click", this.verifyPassword.bind(this)),
        this.passwordCancel.addEventListener("click", this.close.bind(this)),
        this.passwordField.addEventListener("keydown",
        function(e) {
            13 === e.keyCode && this.verifyPassword()
        }.bind(this)),
        OverlayManager.register(this.overlayName, this.close.bind(this), !0)
    },
    open: function() {
        OverlayManager.open(this.overlayName).then(function() {
            this.passwordField.focus();
            var e = mozL10n.get("password_label", null, "Enter the password to open this PDF file.");
            this.reason === PDFJS.PasswordResponses.INCORRECT_PASSWORD && (e = mozL10n.get("password_invalid", null, "Invalid password. Please try again.")),
            this.passwordText.textContent = e
        }.bind(this))
    },
    close: function() {
        OverlayManager.close(this.overlayName).then(function() {
            this.passwordField.value = ""
        }.bind(this))
    },
    verifyPassword: function() {
        var e = this.passwordField.value;
        return e && e.length > 0 ? (this.close(), this.updatePassword(e)) : void 0
    }
},
PDFDocumentProperties = function() {
    function e(e) {
        this.fields = e.fields,
        this.overlayName = e.overlayName,
        this.rawFileSize = 0,
        this.url = null,
        this.pdfDocument = null,
        e.closeButton && e.closeButton.addEventListener("click", this.close.bind(this)),
        this.dataAvailablePromise = new Promise(function(e) {
            this.resolveDataAvailable = e
        }.bind(this)),
        OverlayManager.register(this.overlayName, this.close.bind(this))
    }
    return e.prototype = {
        open: function() {
            Promise.all([OverlayManager.open(this.overlayName), this.dataAvailablePromise]).then(function() {
                this._getProperties()
            }.bind(this))
        },
        close: function() {
            OverlayManager.close(this.overlayName)
        },
        setFileSize: function(e) {
            e > 0 && (this.rawFileSize = e)
        },
        setDocumentAndUrl: function(e, t) {
            this.pdfDocument = e,
            this.url = t,
            this.resolveDataAvailable()
        },
        _getProperties: function() {
            OverlayManager.active && (this.pdfDocument.getDownloadInfo().then(function(e) {
                e.length !== this.rawFileSize && (this.setFileSize(e.length), this._updateUI(this.fields.fileSize, this._parseFileSize()))
            }.bind(this)), this.pdfDocument.getMetadata().then(function(e) {
                var t = {
                    fileName: getPDFFileNameFromURL(this.url),
                    fileSize: this._parseFileSize(),
                    title: e.info.Title,
                    author: e.info.Author,
                    subject: e.info.Subject,
                    keywords: e.info.Keywords,
                    creationDate: this._parseDate(e.info.CreationDate),
                    modificationDate: this._parseDate(e.info.ModDate),
                    creator: e.info.Creator,
                    producer: e.info.Producer,
                    version: e.info.PDFFormatVersion,
                    pageCount: this.pdfDocument.numPages
                };
                for (var i in t) this._updateUI(this.fields[i], t[i])
            }.bind(this)))
        },
        _updateUI: function(e, t) {
            e && void 0 !== t && "" !== t && (e.textContent = t)
        },
        _parseFileSize: function() {
            var e = this.rawFileSize,
            t = e / 1024;
            return t ? 1024 > t ? mozL10n.get("document_properties_kb", {
                size_kb: ( + t.toPrecision(3)).toLocaleString(),
                size_b: e.toLocaleString()
            },
            "{{size_kb}} KB ({{size_b}} bytes)") : mozL10n.get("document_properties_mb", {
                size_mb: ( + (t / 1024).toPrecision(3)).toLocaleString(),
                size_b: e.toLocaleString()
            },
            "{{size_mb}} MB ({{size_b}} bytes)") : void 0
        },
        _parseDate: function(e) {
            var t = e;
            if (void 0 === t) return "";
            "D:" === t.substring(0, 2) && (t = t.substring(2));
            var i = parseInt(t.substring(0, 4), 10),
            n = parseInt(t.substring(4, 6), 10) - 1,
            r = parseInt(t.substring(6, 8), 10),
            s = parseInt(t.substring(8, 10), 10),
            a = parseInt(t.substring(10, 12), 10),
            o = parseInt(t.substring(12, 14), 10),
            d = t.substring(14, 15),
            l = parseInt(t.substring(15, 17), 10),
            h = parseInt(t.substring(18, 20), 10);
            "-" === d ? (s += l, a += h) : "+" === d && (s -= l, a -= h);
            var c = new Date(Date.UTC(i, n, r, s, a, o)),
            u = c.toLocaleDateString(),
            p = c.toLocaleTimeString();
            return mozL10n.get("document_properties_date_string", {
                date: u,
                time: p
            },
            "{{date}}, {{time}}")
        }
    },
    e
} (),
PresentationModeState = {
    UNKNOWN: 0,
    NORMAL: 1,
    CHANGING: 2,
    FULLSCREEN: 3
},
IGNORE_CURRENT_POSITION_ON_ZOOM = !1,
DEFAULT_CACHE_SIZE = 10,
CLEANUP_TIMEOUT = 3e4,
RenderingStates = {
    INITIAL: 0,
    RUNNING: 1,
    PAUSED: 2,
    FINISHED: 3
},
PDFRenderingQueue = function() {
    function e() {
        this.pdfViewer = null,
        this.pdfThumbnailViewer = null,
        this.onIdle = null,
        this.highestPriorityPage = null,
        this.idleTimeout = null,
        this.printing = !1,
        this.isThumbnailViewEnabled = !1
    }
    return e.prototype = {
        setViewer: function(e) {
            this.pdfViewer = e
        },
        setThumbnailViewer: function(e) {
            this.pdfThumbnailViewer = e
        },
        isHighestPriority: function(e) {
            return this.highestPriorityPage === e.renderingId
        },
        renderHighestPriority: function(e) {
            this.idleTimeout && (clearTimeout(this.idleTimeout), this.idleTimeout = null),
            this.pdfViewer.forceRendering(e) || this.pdfThumbnailViewer && this.isThumbnailViewEnabled && this.pdfThumbnailViewer.forceRendering() || this.printing || this.onIdle && (this.idleTimeout = setTimeout(this.onIdle.bind(this), CLEANUP_TIMEOUT))
        },
        getHighestPriority: function(e, t, i) {
            var n = e.views,
            r = n.length;
            if (0 === r) return ! 1;
            for (var s = 0; r > s; ++s) {
                var a = n[s].view;
                if (!this.isViewFinished(a)) return a
            }
            if (i) {
                var o = e.last.id;
                if (t[o] && !this.isViewFinished(t[o])) return t[o]
            } else {
                var d = e.first.id - 2;
                if (t[d] && !this.isViewFinished(t[d])) return t[d]
            }
            return null
        },
        isViewFinished: function(e) {
            return e.renderingState === RenderingStates.FINISHED
        },
        renderView: function(e) {
            var t = e.renderingState;
            switch (t) {
            case RenderingStates.FINISHED:
                return ! 1;
            case RenderingStates.PAUSED:
                this.highestPriorityPage = e.renderingId,
                e.resume();
                break;
            case RenderingStates.RUNNING:
                this.highestPriorityPage = e.renderingId;
                break;
            case RenderingStates.INITIAL:
                this.highestPriorityPage = e.renderingId;
                var i = function() {
                    this.renderHighestPriority()
                }.bind(this);
                e.draw().then(i, i)
            }
            return ! 0
        }
    },
    e
} (),
TEXT_LAYER_RENDER_DELAY = 200,
PDFPageView = function() {
    function e(e) {
        var t = e.container,
        i = e.id,
        n = e.scale,
        r = e.defaultViewport,
        s = e.renderingQueue,
        a = e.textLayerFactory,
        o = e.annotationsLayerFactory;
        this.id = i,
        this.renderingId = "page" + i,
        this.rotation = 0,
        this.scale = n || DEFAULT_SCALE,
        this.viewport = r,
        this.pdfPageRotate = r.rotation,
        this.hasRestrictedScaling = !1,
        this.renderingQueue = s,
        this.textLayerFactory = a,
        this.annotationsLayerFactory = o,
        this.renderingState = RenderingStates.INITIAL,
        this.resume = null,
        this.onBeforeDraw = null,
        this.onAfterDraw = null,
        this.textLayer = null,
        this.zoomLayer = null,
        this.annotationLayer = null;
        var d = document.createElement("div");
        d.id = "pageContainer" + this.id,
        d.className = "page",
        d.style.width = Math.floor(this.viewport.width) + "px",
        d.style.height = Math.floor(this.viewport.height) + "px",
        d.setAttribute("data-page-number", this.id),
        this.div = d,
        t.appendChild(d)
    }
    var t = PDFJS.CustomStyle;
    return e.prototype = {
        setPdfPage: function(e) {
            this.pdfPage = e,
            this.pdfPageRotate = e.rotate;
            var t = (this.rotation + this.pdfPageRotate) % 360;
            this.viewport = e.getViewport(this.scale * CSS_UNITS, t),
            this.stats = e.stats,
            this.reset()
        },
        destroy: function() {
            this.zoomLayer = null,
            this.reset(),
            this.pdfPage && this.pdfPage.cleanup()
        },
        reset: function(e, t) {
            this.renderTask && this.renderTask.cancel(),
            this.resume = null,
            this.renderingState = RenderingStates.INITIAL;
            var i = this.div;
            i.style.width = Math.floor(this.viewport.width) + "px",
            i.style.height = Math.floor(this.viewport.height) + "px";
            for (var n = i.childNodes,
            r = e && this.zoomLayer || null,
            s = t && this.annotationLayer && this.annotationLayer.div || null,
            a = n.length - 1; a >= 0; a--) {
                var o = n[a];
                r !== o && s !== o && i.removeChild(o)
            }
            i.removeAttribute("data-loaded"),
            s ? this.annotationLayer.hide() : this.annotationLayer = null,
            this.canvas && !r && (this.canvas.width = 0, this.canvas.height = 0, delete this.canvas),
            this.loadingIconDiv = document.createElement("div"),
            this.loadingIconDiv.className = "loadingIcon",
            i.appendChild(this.loadingIconDiv)
        },
        update: function(e, t) {
            this.scale = e || this.scale,
            "undefined" != typeof t && (this.rotation = t);
            var i = (this.rotation + this.pdfPageRotate) % 360;
            this.viewport = this.viewport.clone({
                scale: this.scale * CSS_UNITS,
                rotation: i
            });
            var n = !1;
            if (this.canvas && PDFJS.maxCanvasPixels > 0) {
                var r = this.outputScale,
                s = this.viewport.width * this.viewport.height;
                Math.sqrt(PDFJS.maxCanvasPixels / s); (Math.floor(this.viewport.width) * r.sx | 0) * (Math.floor(this.viewport.height) * r.sy | 0) > PDFJS.maxCanvasPixels && (n = !0)
            }
            if (this.canvas) {
                if (PDFJS.useOnlyCssZoom || this.hasRestrictedScaling && n) {
                    this.cssTransform(this.canvas, !0);
                    var a = document.createEvent("CustomEvent");
                    return a.initCustomEvent("pagerendered", !0, !0, {
                        pageNumber: this.id,
                        cssTransform: !0
                    }),
                    void this.div.dispatchEvent(a)
                }
                this.zoomLayer || (this.zoomLayer = this.canvas.parentNode, this.zoomLayer.style.position = "absolute")
            }
            this.zoomLayer && this.cssTransform(this.zoomLayer.firstChild),
            this.reset(!0, !0)
        },
        updatePosition: function() {
            this.textLayer && this.textLayer.render(TEXT_LAYER_RENDER_DELAY)
        },
        cssTransform: function(e, i) {
            var n = this.viewport.width,
            r = this.viewport.height,
            s = this.div;
            e.style.width = e.parentNode.style.width = s.style.width = Math.floor(n) + "px",
            e.style.height = e.parentNode.style.height = s.style.height = Math.floor(r) + "px";
            var a = this.viewport.rotation - e._viewport.rotation,
            o = Math.abs(a),
            d = 1,
            l = 1; (90 === o || 270 === o) && (d = r / n, l = n / r);
            var h = "rotate(" + a + "deg) scale(" + d + "," + l + ")";
            if (t.setProp("transform", e, h), this.textLayer) {
                var c = this.textLayer.viewport,
                u = this.viewport.rotation - c.rotation,
                p = Math.abs(u),
                g = n / c.width; (90 === p || 270 === p) && (g = n / c.height);
                var f, m, v = this.textLayer.textLayerDiv;
                switch (p) {
                case 0:
                    f = m = 0;
                    break;
                case 90:
                    f = 0,
                    m = "-" + v.style.height;
                    break;
                case 180:
                    f = "-" + v.style.width,
                    m = "-" + v.style.height;
                    break;
                case 270:
                    f = "-" + v.style.width,
                    m = 0;
                    break;
                default:
                    console.error("Bad rotation value.")
                }
                t.setProp("transform", v, "rotate(" + p + "deg) scale(" + g + ", " + g + ") translate(" + f + ", " + m + ")"),
                t.setProp("transformOrigin", v, "0% 0%")
            }
            i && this.annotationLayer && this.annotationLayer.setupAnnotations(this.viewport, "display")
        },
        get width() {
            return this.viewport.width
        },
        get height() {
            return this.viewport.height
        },
        getPagePoint: function(e, t) {
            return this.viewport.convertToPdfPoint(e, t)
        },
        draw: function() {
            function e(e) {
                if (E === P.renderTask && (P.renderTask = null), "cancelled" === e) return void v(e);
                if (P.renderingState = RenderingStates.FINISHED, a && (P.canvas.removeAttribute("hidden"), a = !1), P.loadingIconDiv && (n.removeChild(P.loadingIconDiv), delete P.loadingIconDiv), P.zoomLayer) {
                    var i = P.zoomLayer.firstChild;
                    i.width = 0,
                    i.height = 0,
                    n.removeChild(P.zoomLayer),
                    P.zoomLayer = null
                }
                P.error = e,
                P.stats = t.stats,
                P.onAfterDraw && P.onAfterDraw();
                var r = document.createEvent("CustomEvent");
                r.initCustomEvent("pagerendered", !0, !0, {
                    pageNumber: P.id,
                    cssTransform: !1
                }),
                n.dispatchEvent(r);
                var s = document.createEvent("CustomEvent");
                s.initCustomEvent("pagerender", !0, !0, {
                    pageNumber: t.pageNumber
                }),
                n.dispatchEvent(s),
                e ? v(e) : m(void 0)
            }
            this.renderingState !== RenderingStates.INITIAL && console.error("Must be in new state before drawing"),
            this.renderingState = RenderingStates.RUNNING;
            var t = this.pdfPage,
            i = this.viewport,
            n = this.div,
            r = document.createElement("div");
            r.style.width = n.style.width,
            r.style.height = n.style.height,
            r.classList.add("canvasWrapper");
            var s = document.createElement("canvas");
            s.id = "page" + this.id,
            s.setAttribute("hidden", "hidden");
            var a = !0;
            r.appendChild(s),
            this.annotationLayer && this.annotationLayer.div ? n.insertBefore(r, this.annotationLayer.div) : n.appendChild(r),
            this.canvas = s,
            s.mozOpaque = !0;
            var o = s.getContext("2d", {
                alpha: !1
            }),
            d = getOutputScale(o);
            if (this.outputScale = d, PDFJS.useOnlyCssZoom) {
                var l = i.clone({
                    scale: CSS_UNITS
                });
                d.sx *= l.width / i.width,
                d.sy *= l.height / i.height,
                d.scaled = !0
            }
            if (PDFJS.maxCanvasPixels > 0) {
                var h = i.width * i.height,
                c = Math.sqrt(PDFJS.maxCanvasPixels / h);
                d.sx > c || d.sy > c ? (d.sx = c, d.sy = c, d.scaled = !0, this.hasRestrictedScaling = !0) : this.hasRestrictedScaling = !1
            }
            var u = approximateFraction(d.sx),
            p = approximateFraction(d.sy);
            s.width = roundToDivide(i.width * d.sx, u[0]),
            s.height = roundToDivide(i.height * d.sy, p[0]),
            s.style.width = roundToDivide(i.width, u[1]) + "px",
            s.style.height = roundToDivide(i.height, p[1]) + "px",
            s._viewport = i;
            var g = null,
            f = null;
            this.textLayerFactory && (g = document.createElement("div"), g.className = "textLayer", g.style.width = r.style.width, g.style.height = r.style.height, this.annotationLayer && this.annotationLayer.div ? n.insertBefore(g, this.annotationLayer.div) : n.appendChild(g), f = this.textLayerFactory.createTextLayerBuilder(g, this.id - 1, this.viewport)),
            this.textLayer = f;
            var m, v, w = new Promise(function(e, t) {
                m = e,
                v = t
            }),
            P = this,
            b = null;
            this.renderingQueue && (b = function(e) {
                return P.renderingQueue.isHighestPriority(P) ? (a && (P.canvas.removeAttribute("hidden"), a = !1), void e()) : (P.renderingState = RenderingStates.PAUSED, void(P.resume = function() {
                    P.renderingState = RenderingStates.RUNNING,
                    e()
                }))
            });
            var S = d.scaled ? [d.sx, 0, 0, d.sy, 0, 0] : null,
            y = {
                canvasContext: o,
                transform: S,
                viewport: this.viewport
            },
            E = this.renderTask = this.pdfPage.render(y);
            return E.onContinue = b,
            this.renderTask.promise.then(function() {
                e(null),
                f && P.pdfPage.getTextContent({
                    normalizeWhitespace: !0
                }).then(function(e) {
                    f.setTextContent(e),
                    f.render(TEXT_LAYER_RENDER_DELAY)
                })
            },
            function(t) {
                e(t)
            }),
            this.annotationsLayerFactory && (this.annotationLayer || (this.annotationLayer = this.annotationsLayerFactory.createAnnotationsLayerBuilder(n, this.pdfPage)), this.annotationLayer.setupAnnotations(this.viewport, "display")),
            n.setAttribute("data-loaded", !0),
            P.onBeforeDraw && P.onBeforeDraw(),
            w
        },
        beforePrint: function() {
            var e = this.pdfPage,
            i = e.getViewport(1),
            n = 2,
            r = document.createElement("canvas");
            r.width = Math.floor(i.width) * n,
            r.height = Math.floor(i.height) * n,
            r.style.width = 100 * n + "%",
            r.style.height = 100 * n + "%";
            var s = "scale(" + 1 / n + ", " + 1 / n + ")";
            t.setProp("transform", r, s),
            t.setProp("transformOrigin", r, "0% 0%");
            var a = document.getElementById("printContainer"),
            o = document.createElement("div");
            o.style.width = i.width + "pt",
            o.style.height = i.height + "pt",
            o.appendChild(r),
            a.appendChild(o),
            r.mozPrintCallback = function(t) {
                var s = t.context;
                s.save(),
                s.fillStyle = "rgb(255, 255, 255)",
                s.fillRect(0, 0, r.width, r.height),
                s.restore(),
                s._transformMatrix = [n, 0, 0, n, 0, 0],
                s.scale(n, n);
                var a = {
                    canvasContext: s,
                    viewport: i,
                    intent: "print"
                };
                e.render(a).promise.then(function() {
                    t.done()
                },
                function(e) {
                    console.error(e),
                    "abort" in t ? t.abort() : t.done()
                })
            }
        }
    },
    e
} (),
TextLayerBuilder = function() {
    function e(e) {
        this.textLayerDiv = e.textLayerDiv,
        this.renderingDone = !1,
        this.divContentDone = !1,
        this.pageIdx = e.pageIndex,
        this.pageNumber = this.pageIdx + 1,
        this.matches = [],
        this.viewport = e.viewport,
        this.textDivs = [],
        this.findController = e.findController || null,
        this.textLayerRenderTask = null,
        this._bindMouse()
    }
    return e.prototype = {
        _finishRendering: function() {
            this.renderingDone = !0;
            var e = document.createElement("div");
            e.className = "endOfContent",
            this.textLayerDiv.appendChild(e);
            var t = document.createEvent("CustomEvent");
            t.initCustomEvent("textlayerrendered", !0, !0, {
                pageNumber: this.pageNumber
            }),
            this.textLayerDiv.dispatchEvent(t)
        },
        render: function(e) {
            if (this.divContentDone && !this.renderingDone) {
                this.textLayerRenderTask && (this.textLayerRenderTask.cancel(), this.textLayerRenderTask = null),
                this.textDivs = [];
                var t = document.createDocumentFragment();
                this.textLayerRenderTask = PDFJS.renderTextLayer({
                    textContent: this.textContent,
                    container: t,
                    viewport: this.viewport,
                    textDivs: this.textDivs,
                    timeout: e
                }),
                this.textLayerRenderTask.promise.then(function() {
                    this.textLayerDiv.appendChild(t),
                    this._finishRendering(),
                    this.updateMatches()
                }.bind(this),
                function(e) {})
            }
        },
        setTextContent: function(e) {
            this.textLayerRenderTask && (this.textLayerRenderTask.cancel(), this.textLayerRenderTask = null),
            this.textContent = e,
            this.divContentDone = !0
        },
        convertMatches: function(e) {
            for (var t = 0,
            i = 0,
            n = this.textContent.items,
            r = n.length - 1,
            s = null === this.findController ? 0 : this.findController.state.query.length, a = [], o = 0, d = e.length; d > o; o++) {
                for (var l = e[o]; t !== r && l >= i + n[t].str.length;) i += n[t].str.length,
                t++;
                t === n.length && console.error("Could not find a matching mapping");
                var h = {
                    begin: {
                        divIdx: t,
                        offset: l - i
                    }
                };
                for (l += s; t !== r && l > i + n[t].str.length;) i += n[t].str.length,
                t++;
                h.end = {
                    divIdx: t,
                    offset: l - i
                },
                a.push(h)
            }
            return a
        },
        renderMatches: function(e) {
            function t(e, t) {
                var n = e.divIdx;
                r[n].textContent = "",
                i(n, 0, e.offset, t)
            }
            function i(e, t, i, s) {
                var a = r[e],
                o = n[e].str.substring(t, i),
                d = document.createTextNode(o);
                if (s) {
                    var l = document.createElement("span");
                    return l.className = s,
                    l.appendChild(d),
                    void a.appendChild(l)
                }
                a.appendChild(d)
            }
            if (0 !== e.length) {
                var n = this.textContent.items,
                r = this.textDivs,
                s = null,
                a = this.pageIdx,
                o = null === this.findController ? !1 : a === this.findController.selected.pageIdx,
                d = null === this.findController ? -1 : this.findController.selected.matchIdx,
                l = null === this.findController ? !1 : this.findController.state.highlightAll,
                h = {
                    divIdx: -1,
                    offset: void 0
                },
                c = d,
                u = c + 1;
                if (l) c = 0,
                u = e.length;
                else if (!o) return;
                for (var p = c; u > p; p++) {
                    var g = e[p],
                    f = g.begin,
                    m = g.end,
                    v = o && p === d,
                    w = v ? " selected": "";
                    if (this.findController && this.findController.updateMatchPosition(a, p, r, f.divIdx, m.divIdx), s && f.divIdx === s.divIdx ? i(s.divIdx, s.offset, f.offset) : (null !== s && i(s.divIdx, s.offset, h.offset), t(f)), f.divIdx === m.divIdx) i(f.divIdx, f.offset, m.offset, "highlight" + w);
                    else {
                        i(f.divIdx, f.offset, h.offset, "highlight begin" + w);
                        for (var P = f.divIdx + 1,
                        b = m.divIdx; b > P; P++) r[P].className = "highlight middle" + w;
                        t(m, "highlight end" + w)
                    }
                    s = m
                }
                s && i(s.divIdx, s.offset, h.offset)
            }
        },
        updateMatches: function() {
            if (this.renderingDone) {
                for (var e = this.matches,
                t = this.textDivs,
                i = this.textContent.items,
                n = -1,
                r = 0,
                s = e.length; s > r; r++) {
                    for (var a = e[r], o = Math.max(n, a.begin.divIdx), d = o, l = a.end.divIdx; l >= d; d++) {
                        var h = t[d];
                        h.textContent = i[d].str,
                        h.className = ""
                    }
                    n = a.end.divIdx + 1
                }
                null !== this.findController && this.findController.active && (this.matches = this.convertMatches(null === this.findController ? [] : this.findController.pageMatches[this.pageIdx] || []), this.renderMatches(this.matches))
            }
        },
        _bindMouse: function() {
            var e = this.textLayerDiv;
            e.addEventListener("mousedown",
            function(t) {
                var i = e.querySelector(".endOfContent");
                if (i) {
                    var n = t.target !== e;
                    if (n = n && "none" !== window.getComputedStyle(i).getPropertyValue("-moz-user-select")) {
                        var r = e.getBoundingClientRect(),
                        s = Math.max(0, (t.pageY - r.top) / r.height);
                        i.style.top = (100 * s).toFixed(2) + "%"
                    }
                    i.classList.add("active")
                }
            }),
            e.addEventListener("mouseup",
            function(t) {
                var i = e.querySelector(".endOfContent");
                i && (i.style.top = "", i.classList.remove("active"))
            })
        }
    },
    e
} ();
DefaultTextLayerFactory.prototype = {
    createTextLayerBuilder: function(e, t, i) {
        return new TextLayerBuilder({
            textLayerDiv: e,
            pageIndex: t,
            viewport: i
        })
    }
};
var AnnotationsLayerBuilder = function() {
    function e(e) {
        this.pageDiv = e.pageDiv,
        this.pdfPage = e.pdfPage,
        this.linkService = e.linkService,
        this.div = null
    }
    var t = PDFJS.CustomStyle;
    return e.prototype = {
        setupAnnotations: function(e, i) {
            function n(e, t) {
                e.href = s.getDestinationHash(t),
                e.onclick = function() {
                    return t && s.navigateTo(t),
                    !1
                },
                t && (e.className = "internalLink")
            }
            function r(e, t) {
                e.href = s.getAnchorUrl(""),
                e.onclick = function() {
                    return s.executeNamedAction(t),
                    !1
                },
                e.className = "internalLink"
            }
            var s = this.linkService,
            a = this.pdfPage,
            o = this,
            d = {
                intent: void 0 === i ? "display": i
            };
            a.getAnnotations(d).then(function(i) {
                e = e.clone({
                    dontFlip: !0
                });
                var s, d, l, h, c = e.transform,
                u = "matrix(" + c.join(",") + ")";
                if (o.div) {
                    for (l = 0, h = i.length; h > l; l++) s = i[l],
                    d = o.div.querySelector('[data-annotation-id="' + s.id + '"]'),
                    d && t.setProp("transform", d, u);
                    o.div.removeAttribute("hidden")
                } else for (l = 0, h = i.length; h > l; l++) if (s = i[l], s && s.hasHtml) {
                    d = PDFJS.AnnotationUtils.getHtmlElement(s, a.commonObjs),
                    d.setAttribute("data-annotation-id", s.id),
                    "undefined" != typeof mozL10n && mozL10n.translate(d);
                    var p = s.rect,
                    g = a.view;
                    p = PDFJS.Util.normalizeRect([p[0], g[3] - p[1] + g[1], p[2], g[3] - p[3] + g[1]]),
                    d.style.left = p[0] + "px",
                    d.style.top = p[1] + "px",
                    d.style.position = "absolute",
                    t.setProp("transform", d, u);
                    var f = -p[0] + "px " + -p[1] + "px";
                    if (t.setProp("transformOrigin", d, f), "Link" === s.subtype && !s.url) {
                        var m = d.getElementsByTagName("a")[0];
                        m && (s.action ? r(m, s.action) : n(m, "dest" in s ? s.dest: null))
                    }
                    if (!o.div) {
                        var v = document.createElement("div");
                        v.className = "annotationLayer",
                        o.pageDiv.appendChild(v),
                        o.div = v
                    }
                    o.div.appendChild(d)
                }
            })
        },
        hide: function() {
            this.div && this.div.setAttribute("hidden", "true")
        }
    },
    e
} ();
DefaultAnnotationsLayerFactory.prototype = {
    createAnnotationsLayerBuilder: function(e, t) {
        return new AnnotationsLayerBuilder({
            pageDiv: e,
            pdfPage: t,
            linkService: new SimpleLinkService
        })
    }
};
var PDFViewer = function() {
    function e(e) {
        var t = [];
        this.push = function(i) {
            var n = t.indexOf(i);
            n >= 0 && t.splice(n, 1),
            t.push(i),
            t.length > e && t.shift().destroy()
        },
        this.resize = function(i) {
            for (e = i; t.length > e;) t.shift().destroy()
        }
    }
    function t(e, t) {
        return t === e ? !0 : Math.abs(t - e) < 1e-15 ? !0 : !1
    }
    function i(e) {
        this.container = e.container,
        this.viewer = e.viewer || e.container.firstElementChild,
        this.linkService = e.linkService || new SimpleLinkService,
        this.removePageBorders = e.removePageBorders || !1,
        this.defaultRenderingQueue = !e.renderingQueue,
        this.defaultRenderingQueue ? (this.renderingQueue = new PDFRenderingQueue, this.renderingQueue.setViewer(this)) : this.renderingQueue = e.renderingQueue,
        this.scroll = watchScroll(this.container, this._scrollUpdate.bind(this)),
        this.updateInProgress = !1,
        this.presentationModeState = PresentationModeState.UNKNOWN,
        this._resetView(),
        this.removePageBorders && this.viewer.classList.add("removePageBorders")
    }
    return i.prototype = {
        get pagesCount() {
            return this._pages.length
        },
        getPageView: function(e) {
            return this._pages[e]
        },
        get currentPageNumber() {
            return this._currentPageNumber
        },
        set currentPageNumber(e) {
            if (!this.pdfDocument) return void(this._currentPageNumber = e);
            var t = document.createEvent("UIEvents");
            return t.initUIEvent("pagechange", !0, !0, window, 0),
            t.updateInProgress = this.updateInProgress,
            e > 0 && e <= this.pagesCount ? (t.previousPageNumber = this._currentPageNumber, this._currentPageNumber = e, t.pageNumber = e, this.container.dispatchEvent(t), void(this.updateInProgress || this.scrollPageIntoView(e))) : (t.pageNumber = this._currentPageNumber, t.previousPageNumber = e, void this.container.dispatchEvent(t))
        },
        get currentScale() {
            return this._currentScale !== UNKNOWN_SCALE ? this._currentScale: DEFAULT_SCALE
        },
        set currentScale(e) {
            if (isNaN(e)) throw new Error("Invalid numeric scale");
            return this.pdfDocument ? void this._setScale(e, !1) : (this._currentScale = e, void(this._currentScaleValue = e !== UNKNOWN_SCALE ? e.toString() : null))
        },
        get currentScaleValue() {
            return this._currentScaleValue
        },
        set currentScaleValue(e) {
            return this.pdfDocument ? void this._setScale(e, !1) : (this._currentScale = isNaN(e) ? UNKNOWN_SCALE: e, void(this._currentScaleValue = e))
        },
        get pagesRotation() {
            return this._pagesRotation
        },
        set pagesRotation(e) {
            this._pagesRotation = e;
            for (var t = 0,
            i = this._pages.length; i > t; t++) {
                var n = this._pages[t];
                n.update(n.scale, e)
            }
            this._setScale(this._currentScaleValue, !0),
            this.defaultRenderingQueue && this.update()
        },
        setDocument: function(e) {
            if (this.pdfDocument && this._resetView(), this.pdfDocument = e, e) {
                var t, i = e.numPages,
                n = this,
                r = new Promise(function(e) {
                    t = e
                });
                this.pagesPromise = r,
                r.then(function() {
                    var e = document.createEvent("CustomEvent");
                    e.initCustomEvent("pagesloaded", !0, !0, {
                        pagesCount: i
                    }),
                    n.container.dispatchEvent(e)
                });
                var s = !1,
                a = null,
                o = new Promise(function(e) {
                    a = e
                });
                this.onePageRendered = o;
                var d = function(e) {
                    e.onBeforeDraw = function() {
                        n._buffer.push(this)
                    },
                    e.onAfterDraw = function() {
                        s || (s = !0, a())
                    }
                },
                l = e.getPage(1);
                return this.firstPagePromise = l,
                l.then(function(r) {
                    for (var s = this.currentScale,
                    a = r.getViewport(s * CSS_UNITS), l = 1; i >= l; ++l) {
                        var h = null;
                        PDFJS.disableTextLayer || (h = this);
                        var c = new PDFPageView({
                            container: this.viewer,
                            id: l,
                            scale: s,
                            defaultViewport: a.clone(),
                            renderingQueue: this.renderingQueue,
                            textLayerFactory: h,
                            annotationsLayerFactory: this
                        });
                        d(c),
                        this._pages.push(c)
                    }
                    var u = this.linkService;
                    o.then(function() {
                        if (PDFJS.disableAutoFetch) t();
                        else for (var r = i,
                        s = 1; i >= s; ++s) e.getPage(s).then(function(e, i) {
                            var s = n._pages[e - 1];
                            s.pdfPage || s.setPdfPage(i),
                            u.cachePageRef(e, i.ref),
                            r--,
                            r || t()
                        }.bind(null, s))
                    });
                    var p = document.createEvent("CustomEvent");
                    p.initCustomEvent("pagesinit", !0, !0, null),
                    n.container.dispatchEvent(p),
                    this.defaultRenderingQueue && this.update(),
                    this.findController && this.findController.resolveFirstPage()
                }.bind(this))
            }
        },
        _resetView: function() {
            this._pages = [],
            this._currentPageNumber = 1,
            this._currentScale = UNKNOWN_SCALE,
            this._currentScaleValue = null,
            this._buffer = new e(DEFAULT_CACHE_SIZE),
            this._location = null,
            this._pagesRotation = 0,
            this._pagesRequests = [];
            for (var t = this.viewer; t.hasChildNodes();) t.removeChild(t.lastChild)
        },
        _scrollUpdate: function() {
            if (0 !== this.pagesCount) {
                this.update();
                for (var e = 0,
                t = this._pages.length; t > e; e++) this._pages[e].updatePosition()
            }
        },
        _setScaleDispatchEvent: function(e, t, i) {
            var n = document.createEvent("UIEvents");
            n.initUIEvent("scalechange", !0, !0, window, 0),
            n.scale = e,
            i && (n.presetValue = t),
            this.container.dispatchEvent(n)
        },
        _setScaleUpdatePages: function(e, i, n, r) {
            if (this._currentScaleValue = i, t(this._currentScale, e)) return void(r && this._setScaleDispatchEvent(e, i, !0));
            for (var s = 0,
            a = this._pages.length; a > s; s++) this._pages[s].update(e);
            if (this._currentScale = e, !n) {
                var o, d = this._currentPageNumber; ! this._location || IGNORE_CURRENT_POSITION_ON_ZOOM || this.isInPresentationMode || this.isChangingPresentationMode || (d = this._location.pageNumber, o = [null, {
                    name: "XYZ"
                },
                this._location.left, this._location.top, null]),
                this.scrollPageIntoView(d, o)
            }
            this._setScaleDispatchEvent(e, i, r),
            this.defaultRenderingQueue && this.update()
        },
        _setScale: function(e, t) {
            var i = parseFloat(e);
            if (i > 0) this._setScaleUpdatePages(i, e, t, !1);
            else {
                var n = this._pages[this._currentPageNumber - 1];
                if (!n) return;
                var r = this.isInPresentationMode || this.removePageBorders ? 0 : SCROLLBAR_PADDING,
                s = this.isInPresentationMode || this.removePageBorders ? 0 : VERTICAL_PADDING,
                a = (this.container.clientWidth - r) / n.width * n.scale,
                o = (this.container.clientHeight - s) / n.height * n.scale;
                switch (e) {
                case "page-actual":
                    i = 1;
                    break;
                case "page-width":
                    i = a;
                    break;
                case "page-height":
                    i = o;
                    break;
                case "page-fit":
                    i = Math.min(a, o);
                    break;
                case "auto":
                    var d = n.width > n.height,
                    l = d ? Math.min(o, a) : a;
                    i = Math.min(MAX_AUTO_SCALE, l);
                    break;
                default:
                    return void console.error("pdfViewSetScale: '" + e + "' is an unknown zoom value.")
                }
                this._setScaleUpdatePages(i, e, t, !0)
            }
        },
        scrollPageIntoView: function(e, t) {
            if (this.pdfDocument) {
                var i = this._pages[e - 1];
                if (this.isInPresentationMode) {
                    if (this._currentPageNumber !== i.id) return void(this.currentPageNumber = i.id);
                    t = null,
                    this._setScale(this._currentScaleValue, !0)
                }
                if (!t) return void scrollIntoView(i.div);
                var n, r, s = 0,
                a = 0,
                o = 0,
                d = 0,
                l = i.rotation % 180 === 0 ? !1 : !0,
                h = (l ? i.height: i.width) / i.scale / CSS_UNITS,
                c = (l ? i.width: i.height) / i.scale / CSS_UNITS,
                u = 0;
                switch (t[1].name) {
                case "XYZ":
                    s = t[2],
                    a = t[3],
                    u = t[4],
                    s = null !== s ? s: 0,
                    a = null !== a ? a: c;
                    break;
                case "Fit":
                case "FitB":
                    u = "page-fit";
                    break;
                case "FitH":
                case "FitBH":
                    a = t[2],
                    u = "page-width",
                    null === a && this._location && (s = this._location.left, a = this._location.top);
                    break;
                case "FitV":
                case "FitBV":
                    s = t[2],
                    o = h,
                    d = c,
                    u = "page-height";
                    break;
                case "FitR":
                    s = t[2],
                    a = t[3],
                    o = t[4] - s,
                    d = t[5] - a;
                    var p = this.removePageBorders ? 0 : SCROLLBAR_PADDING,
                    g = this.removePageBorders ? 0 : VERTICAL_PADDING;
                    n = (this.container.clientWidth - p) / o / CSS_UNITS,
                    r = (this.container.clientHeight - g) / d / CSS_UNITS,
                    u = Math.min(Math.abs(n), Math.abs(r));
                    break;
                default:
                    return
                }
                if (u && u !== this._currentScale ? this.currentScaleValue = u: this._currentScale === UNKNOWN_SCALE && (this.currentScaleValue = DEFAULT_SCALE_VALUE), "page-fit" === u && !t[4]) return void scrollIntoView(i.div);
                var f = [i.viewport.convertToViewportPoint(s, a), i.viewport.convertToViewportPoint(s + o, a + d)],
                m = Math.min(f[0][0], f[1][0]),
                v = Math.min(f[0][1], f[1][1]);
                scrollIntoView(i.div, {
                    left: m,
                    top: v
                })
            }
        },
        _updateLocation: function(e) {
            var t = this._currentScale,
            i = this._currentScaleValue,
            n = parseFloat(i) === t ? Math.round(1e4 * t) / 100 : i,
            r = e.id,
            s = "#page=" + r;
            s += "&zoom=" + n;
            var a = this._pages[r - 1],
            o = this.container,
            d = a.getPagePoint(o.scrollLeft - e.x, o.scrollTop - e.y),
            l = Math.round(d[0]),
            h = Math.round(d[1]);
            s += "," + l + "," + h,
            this._location = {
                pageNumber: r,
                scale: n,
                top: h,
                left: l,
                pdfOpenParams: s
            }
        },
        update: function() {
            var e = this._getVisiblePages(),
            t = e.views;
            if (0 !== t.length) {
                this.updateInProgress = !0;
                var i = Math.max(DEFAULT_CACHE_SIZE, 2 * t.length + 1);
                this._buffer.resize(i),
                this.renderingQueue.renderHighestPriority(e);
                for (var n = this._currentPageNumber,
                r = e.first,
                s = 0,
                a = t.length,
                o = !1; a > s; ++s) {
                    var d = t[s];
                    if (d.percent < 100) break;
                    if (d.id === n) {
                        o = !0;
                        break
                    }
                }
                o || (n = t[0].id),
                this.isInPresentationMode || (this.currentPageNumber = n),
                this._updateLocation(r),
                this.updateInProgress = !1;
                var l = document.createEvent("UIEvents");
                l.initUIEvent("updateviewarea", !0, !0, window, 0),
                l.location = this._location,
                this.container.dispatchEvent(l)
            }
        },
        containsElement: function(e) {
            return this.container.contains(e)
        },
        focus: function() {
            this.container.focus()
        },
        get isInPresentationMode() {
            return this.presentationModeState === PresentationModeState.FULLSCREEN
        },
        get isChangingPresentationMode() {
            return this.presentationModeState === PresentationModeState.CHANGING
        },
        get isHorizontalScrollbarEnabled() {
            return this.isInPresentationMode ? !1 : this.container.scrollWidth > this.container.clientWidth
        },
        _getVisiblePages: function() {
            if (this.isInPresentationMode) {
                var e = [],
                t = this._pages[this._currentPageNumber - 1];
                return e.push({
                    id: t.id,
                    view: t
                }),
                {
                    first: t,
                    last: t,
                    views: e
                }
            }
            return getVisibleElements(this.container, this._pages, !0)
        },
        cleanup: function() {
            for (var e = 0,
            t = this._pages.length; t > e; e++) this._pages[e] && this._pages[e].renderingState !== RenderingStates.FINISHED && this._pages[e].reset()
        },
        _ensurePdfPageLoaded: function(e) {
            if (e.pdfPage) return Promise.resolve(e.pdfPage);
            var t = e.id;
            if (this._pagesRequests[t]) return this._pagesRequests[t];
            var i = this.pdfDocument.getPage(t).then(function(i) {
                return e.setPdfPage(i),
                this._pagesRequests[t] = null,
                i
            }.bind(this));
            return this._pagesRequests[t] = i,
            i
        },
        forceRendering: function(e) {
            var t = e || this._getVisiblePages(),
            i = this.renderingQueue.getHighestPriority(t, this._pages, this.scroll.down);
            return i ? (this._ensurePdfPageLoaded(i).then(function() {
                this.renderingQueue.renderView(i)
            }.bind(this)), !0) : !1
        },
        getPageTextContent: function(e) {
            return this.pdfDocument.getPage(e + 1).then(function(e) {
                return e.getTextContent({
                    normalizeWhitespace: !0
                })
            })
        },
        createTextLayerBuilder: function(e, t, i) {
            return new TextLayerBuilder({
                textLayerDiv: e,
                pageIndex: t,
                viewport: i,
                findController: this.isInPresentationMode ? null: this.findController
            })
        },
        createAnnotationsLayerBuilder: function(e, t) {
            return new AnnotationsLayerBuilder({
                pageDiv: e,
                pdfPage: t,
                linkService: this.linkService
            })
        },
        setFindController: function(e) {
            this.findController = e
        }
    },
    i
} (),
SimpleLinkService = function() {
    function e() {}
    return e.prototype = {
        get page() {
            return 0
        },
        set page(e) {},
        navigateTo: function(e) {},
        getDestinationHash: function(e) {
            return "#"
        },
        getAnchorUrl: function(e) {
            return "#"
        },
        setHash: function(e) {},
        executeNamedAction: function(e) {},
        cachePageRef: function(e, t) {}
    },
    e
} (),
THUMBNAIL_SCROLL_MARGIN = -19,
THUMBNAIL_WIDTH = 98,
THUMBNAIL_CANVAS_BORDER_WIDTH = 1,
PDFThumbnailView = function() {
    function e(e, i) {
        var n = t.tempImageCache;
        n || (n = document.createElement("canvas"), t.tempImageCache = n),
        n.width = e,
        n.height = i,
        n.mozOpaque = !0;
        var r = n.getContext("2d", {
            alpha: !1
        });
        return r.save(),
        r.fillStyle = "rgb(255, 255, 255)",
        r.fillRect(0, 0, e, i),
        r.restore(),
        n
    }
    function t(e) {
        var t = e.container,
        i = e.id,
        n = e.defaultViewport,
        r = e.linkService,
        s = e.renderingQueue;
        this.id = i,
        this.renderingId = "thumbnail" + i,
        this.pdfPage = null,
        this.rotation = 0,
        this.viewport = n,
        this.pdfPageRotate = n.rotation,
        this.linkService = r,
        this.renderingQueue = s,
        this.hasImage = !1,
        this.resume = null,
        this.renderingState = RenderingStates.INITIAL,
        this.pageWidth = this.viewport.width,
        this.pageHeight = this.viewport.height,
        this.pageRatio = this.pageWidth / this.pageHeight,
        this.canvasWidth = THUMBNAIL_WIDTH,
        this.canvasHeight = this.canvasWidth / this.pageRatio | 0,
        this.scale = this.canvasWidth / this.pageWidth;
        var a = document.createElement("a");
        a.href = r.getAnchorUrl("#page=" + i),
        a.title = mozL10n.get("thumb_page_title", {
            page: i
        },
        "Page {{page}}"),
        a.onclick = function() {
            return r.page = i,
            !1
        };
        var o = document.createElement("div");
        o.id = "thumbnailContainer" + i,
        o.className = "thumbnail",
        this.div = o,
        1 === i && o.classList.add("selected");
        var d = document.createElement("div");
        d.className = "thumbnailSelectionRing";
        var l = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH;
        d.style.width = this.canvasWidth + l + "px",
        d.style.height = this.canvasHeight + l + "px",
        this.ring = d,
        o.appendChild(d),
        a.appendChild(o),
        t.appendChild(a)
    }
    return t.prototype = {
        setPdfPage: function(e) {
            this.pdfPage = e,
            this.pdfPageRotate = e.rotate;
            var t = (this.rotation + this.pdfPageRotate) % 360;
            this.viewport = e.getViewport(1, t),
            this.reset()
        },
        reset: function() {
            this.renderTask && this.renderTask.cancel(),
            this.hasImage = !1,
            this.resume = null,
            this.renderingState = RenderingStates.INITIAL,
            this.pageWidth = this.viewport.width,
            this.pageHeight = this.viewport.height,
            this.pageRatio = this.pageWidth / this.pageHeight,
            this.canvasHeight = this.canvasWidth / this.pageRatio | 0,
            this.scale = this.canvasWidth / this.pageWidth,
            this.div.removeAttribute("data-loaded");
            for (var e = this.ring,
            t = e.childNodes,
            i = t.length - 1; i >= 0; i--) e.removeChild(t[i]);
            var n = 2 * THUMBNAIL_CANVAS_BORDER_WIDTH;
            e.style.width = this.canvasWidth + n + "px",
            e.style.height = this.canvasHeight + n + "px",
            this.canvas && (this.canvas.width = 0, this.canvas.height = 0, delete this.canvas),
            this.image && (this.image.removeAttribute("src"), delete this.image)
        },
        update: function(e) {
            "undefined" != typeof e && (this.rotation = e);
            var t = (this.rotation + this.pdfPageRotate) % 360;
            this.viewport = this.viewport.clone({
                scale: 1,
                rotation: t
            }),
            this.reset()
        },
        _getPageDrawContext: function(e) {
            var t = document.createElement("canvas");
            this.canvas = t,
            t.mozOpaque = !0;
            var i = t.getContext("2d", {
                alpha: !1
            }),
            n = getOutputScale(i);
            t.width = this.canvasWidth * n.sx | 0,
            t.height = this.canvasHeight * n.sy | 0,
            t.style.width = this.canvasWidth + "px",
            t.style.height = this.canvasHeight + "px",
            !e && n.scaled && i.scale(n.sx, n.sy);
            var r = document.createElement("img");
            return this.image = r,
            r.id = this.renderingId,
            r.className = "thumbnailImage",
            r.setAttribute("aria-label", mozL10n.get("thumb_page_canvas", {
                page: this.id
            },
            "Thumbnail of Page {{page}}")),
            r.style.width = t.style.width,
            r.style.height = t.style.height,
            i
        },
        _convertCanvasToImage: function() {
            this.canvas && (this.image.src = this.canvas.toDataURL(), this.div.setAttribute("data-loaded", !0), this.ring.appendChild(this.image), this.canvas.width = 0, this.canvas.height = 0, delete this.canvas)
        },
        draw: function() {
            function e(e) {
                return l === r.renderTask && (r.renderTask = null),
                "cancelled" === e ? void i(e) : (r.renderingState = RenderingStates.FINISHED, r._convertCanvasToImage(), void(e ? i(e) : t(void 0)))
            }
            if (this.renderingState !== RenderingStates.INITIAL && console.error("Must be in new state before drawing"), this.hasImage) return Promise.resolve(void 0);
            this.hasImage = !0,
            this.renderingState = RenderingStates.RUNNING;
            var t, i, n = new Promise(function(e, n) {
                t = e,
                i = n
            }),
            r = this,
            s = this._getPageDrawContext(),
            a = this.viewport.clone({
                scale: this.scale
            }),
            o = function(e) {
                return r.renderingQueue.isHighestPriority(r) ? void e() : (r.renderingState = RenderingStates.PAUSED, void(r.resume = function() {
                    r.renderingState = RenderingStates.RUNNING,
                    e()
                }))
            },
            d = {
                canvasContext: s,
                viewport: a
            },
            l = this.renderTask = this.pdfPage.render(d);
            return l.onContinue = o,
            l.promise.then(function() {
                e(null)
            },
            function(t) {
                e(t)
            }),
            n
        },
        setImage: function(t) {
            var i = t.canvas;
            if (!this.hasImage && i) {
                this.pdfPage || this.setPdfPage(t.pdfPage),
                this.hasImage = !0,
                this.renderingState = RenderingStates.FINISHED;
                var n = this._getPageDrawContext(!0),
                r = n.canvas;
                if (i.width <= 2 * r.width) return n.drawImage(i, 0, 0, i.width, i.height, 0, 0, r.width, r.height),
                void this._convertCanvasToImage();
                for (var s = 3,
                a = r.width << s,
                o = r.height << s,
                d = e(a, o), l = d.getContext("2d"); a > i.width || o > i.height;) a >>= 1,
                o >>= 1;
                for (l.drawImage(i, 0, 0, i.width, i.height, 0, 0, a, o); a > 2 * r.width;) l.drawImage(d, 0, 0, a, o, 0, 0, a >> 1, o >> 1),
                a >>= 1,
                o >>= 1;
                n.drawImage(d, 0, 0, a, o, 0, 0, r.width, r.height),
                this._convertCanvasToImage()
            }
        }
    },
    t
} ();
PDFThumbnailView.tempImageCache = null;
var PDFThumbnailViewer = function() {
    function e(e) {
        this.container = e.container,
        this.renderingQueue = e.renderingQueue,
        this.linkService = e.linkService,
        this.scroll = watchScroll(this.container, this._scrollUpdated.bind(this)),
        this._resetView()
    }
    return e.prototype = {
        _scrollUpdated: function() {
            this.renderingQueue.renderHighestPriority()
        },
        getThumbnail: function(e) {
            return this.thumbnails[e]
        },
        _getVisibleThumbs: function() {
            return getVisibleElements(this.container, this.thumbnails)
        },
        scrollThumbnailIntoView: function(e) {
            var t = document.querySelector(".thumbnail.selected");
            t && t.classList.remove("selected");
            var i = document.getElementById("thumbnailContainer" + e);
            i && i.classList.add("selected");
            var n = this._getVisibleThumbs(),
            r = n.views.length;
            if (r > 0) {
                var s = n.first.id,
                a = r > 1 ? n.last.id: s; (s >= e || e >= a) && scrollIntoView(i, {
                    top: THUMBNAIL_SCROLL_MARGIN
                })
            }
        },
        get pagesRotation() {
            return this._pagesRotation
        },
        set pagesRotation(e) {
            this._pagesRotation = e;
            for (var t = 0,
            i = this.thumbnails.length; i > t; t++) {
                var n = this.thumbnails[t];
                n.update(e)
            }
        },
        cleanup: function() {
            var e = PDFThumbnailView.tempImageCache;
            e && (e.width = 0, e.height = 0),
            PDFThumbnailView.tempImageCache = null
        },
        _resetView: function() {
            this.thumbnails = [],
            this._pagesRotation = 0,
            this._pagesRequests = []
        },
        setDocument: function(e) {
            if (this.pdfDocument) {
                for (var t = this.container; t.hasChildNodes();) t.removeChild(t.lastChild);
                this._resetView()
            }
            return this.pdfDocument = e,
            e ? e.getPage(1).then(function(t) {
                for (var i = e.numPages,
                n = t.getViewport(1), r = 1; i >= r; ++r) {
                    var s = new PDFThumbnailView({
                        container: this.container,
                        id: r,
                        defaultViewport: n.clone(),
                        linkService: this.linkService,
                        renderingQueue: this.renderingQueue
                    });
                    this.thumbnails.push(s)
                }
            }.bind(this)) : Promise.resolve()
        },
        _ensurePdfPageLoaded: function(e) {
            if (e.pdfPage) return Promise.resolve(e.pdfPage);
            var t = e.id;
            if (this._pagesRequests[t]) return this._pagesRequests[t];
            var i = this.pdfDocument.getPage(t).then(function(i) {
                return e.setPdfPage(i),
                this._pagesRequests[t] = null,
                i
            }.bind(this));
            return this._pagesRequests[t] = i,
            i
        },
        ensureThumbnailVisible: function(e) {
            scrollIntoView(document.getElementById("thumbnailContainer" + e))
        },
        forceRendering: function() {
            var e = this._getVisibleThumbs(),
            t = this.renderingQueue.getHighestPriority(e, this.thumbnails, this.scroll.down);
            return t ? (this._ensurePdfPageLoaded(t).then(function() {
                this.renderingQueue.renderView(t)
            }.bind(this)), !0) : !1
        }
    },
    e
} (),
PDFOutlineView = function() {
    function e(e) {
        this.container = e.container,
        this.outline = e.outline,
        this.linkService = e.linkService,
        this.lastToggleIsShow = !0
    }
    return e.prototype = {
        reset: function() {
            for (var e = this.container; e.firstChild;) e.removeChild(e.firstChild);
            this.lastToggleIsShow = !0
        },
        _dispatchEvent: function(e) {
            var t = document.createEvent("CustomEvent");
            t.initCustomEvent("outlineloaded", !0, !0, {
                outlineCount: e
            }),
            this.container.dispatchEvent(t)
        },
        _bindLink: function(e, t) {
            var i = this.linkService;
            e.href = i.getDestinationHash(t.dest),
            e.onclick = function(e) {
                return i.navigateTo(t.dest),
                !1
            }
        },
        _addToggleButton: function(e) {
            var t = document.createElement("div");
            t.className = "outlineItemToggler",
            t.onclick = function(i) {
                if (i.stopPropagation(), t.classList.toggle("outlineItemsHidden"), i.shiftKey) {
                    var n = !t.classList.contains("outlineItemsHidden");
                    this._toggleOutlineItem(e, n)
                }
            }.bind(this),
            e.insertBefore(t, e.firstChild)
        },
        _toggleOutlineItem: function(e, t) {
            this.lastToggleIsShow = t;
            for (var i = e.querySelectorAll(".outlineItemToggler"), n = 0, r = i.length; r > n; ++n) i[n].classList[t ? "remove": "add"]("outlineItemsHidden")
        },
        toggleOutlineTree: function() {
            this._toggleOutlineItem(this.container, !this.lastToggleIsShow)
        },
        render: function() {
            var e = this.outline,
            t = 0;
            if (this.reset(), !e) return void this._dispatchEvent(t);
            for (var i = document.createDocumentFragment(), n = [{
                parent: i,
                items: this.outline
            }], r = !1; n.length > 0;) for (var s = n.shift(), a = 0, o = s.items.length; o > a; a++) {
                var d = s.items[a],
                l = document.createElement("div");
                l.className = "outlineItem";
                var h = document.createElement("a");
                if (this._bindLink(h, d), h.textContent = removeNullCharacters(d.title), l.appendChild(h), d.items.length > 0) {
                    r = !0,
                    this._addToggleButton(l);
                    var c = document.createElement("div");
                    c.className = "outlineItems",
                    l.appendChild(c),
                    n.push({
                        parent: c,
                        items: d.items
                    })
                }
                s.parent.appendChild(l),
                t++
            }
            r && this.container.classList.add("outlineWithDeepNesting"),
            this.container.appendChild(i),
            this._dispatchEvent(t)
        }
    },
    e
} (),
PDFAttachmentView = function() {
    function e(e) {
        this.container = e.container,
        this.attachments = e.attachments,
        this.downloadManager = e.downloadManager
    }
    return e.prototype = {
        reset: function() {
            for (var e = this.container; e.firstChild;) e.removeChild(e.firstChild)
        },
        _dispatchEvent: function(e) {
            var t = document.createEvent("CustomEvent");
            t.initCustomEvent("attachmentsloaded", !0, !0, {
                attachmentsCount: e
            }),
            this.container.dispatchEvent(t)
        },
        _bindLink: function(e, t, i) {
            e.onclick = function(e) {
                return this.downloadManager.downloadData(t, i, ""),
                !1
            }.bind(this)
        },
        render: function() {
            var e = this.attachments,
            t = 0;
            if (this.reset(), !e) return void this._dispatchEvent(t);
            var i = Object.keys(e).sort(function(e, t) {
                return e.toLowerCase().localeCompare(t.toLowerCase())
            });
            t = i.length;
            for (var n = 0; t > n; n++) {
                var r = e[i[n]],
                s = getFileName(r.filename),
                a = document.createElement("div");
                a.className = "attachmentsItem";
                var o = document.createElement("button");
                this._bindLink(o, r.content, s),
                o.textContent = removeNullCharacters(s),
                a.appendChild(o),
                this.container.appendChild(a)
            }
            this._dispatchEvent(t)
        }
    },
    e
} (),
PDFViewerApplication = {
    initialBookmark: document.location.hash.substring(1),
    initialDestination: null,
    initialized: !1,
    fellback: !1,
    pdfDocument: null,
    pdfLoadingTask: null,
    sidebarOpen: !1,
    printing: !1,
    pdfViewer: null,
    pdfThumbnailViewer: null,
    pdfRenderingQueue: null,
    pdfPresentationMode: null,
    pdfDocumentProperties: null,
    pdfLinkService: null,
    pdfHistory: null,
    pageRotation: 0,
    isInitialViewSet: !1,
    animationStartedPromise: null,
    preferenceSidebarViewOnLoad: SidebarView.NONE,
    preferencePdfBugEnabled: !1,
    preferenceShowPreviousViewOnLoad: !0,
    preferenceDefaultZoomValue: "",
    isViewerEmbedded: window.parent !== window,
    url: "",
    initialize: function() {
        var e = new PDFRenderingQueue;
        e.onIdle = this.cleanup.bind(this),
        this.pdfRenderingQueue = e;
        var t = new PDFLinkService;
        this.pdfLinkService = t;
        var i = document.getElementById("viewerContainer"),
        n = document.getElementById("viewer");
        this.pdfViewer = new PDFViewer({
            container: i,
            viewer: n,
            renderingQueue: e,
            linkService: t
        }),
        e.setViewer(this.pdfViewer),
        t.setViewer(this.pdfViewer);
        var r = document.getElementById("thumbnailView");
        if (this.pdfThumbnailViewer = new PDFThumbnailViewer({
            container: r,
            renderingQueue: e,
            linkService: t
        }), e.setThumbnailViewer(this.pdfThumbnailViewer), Preferences.initialize(), this.pdfHistory = new PDFHistory({
            linkService: t
        }), t.setHistory(this.pdfHistory), this.findController = new PDFFindController({
            pdfViewer: this.pdfViewer,
            integratedFind: this.supportsIntegratedFind
        }), this.pdfViewer.setFindController(this.findController), this.findBar = new PDFFindBar({
            bar: document.getElementById("findbar"),
            toggleButton: document.getElementById("viewFind"),
            findField: document.getElementById("findInput"),
            highlightAllCheckbox: document.getElementById("findHighlightAll"),
            caseSensitiveCheckbox: document.getElementById("findMatchCase"),
            findMsg: document.getElementById("findMsg"),
            findResultsCount: document.getElementById("findResultsCount"),
            findStatusIcon: document.getElementById("findStatusIcon"),
            findPreviousButton: document.getElementById("findPrevious"),
            findNextButton: document.getElementById("findNext"),
            findController: this.findController
        }), this.findController.setFindBar(this.findBar), HandTool.initialize({
            container: i,
            toggleHandTool: document.getElementById("toggleHandTool")
        }), this.pdfDocumentProperties = new PDFDocumentProperties({
            overlayName: "documentPropertiesOverlay",
            closeButton: document.getElementById("documentPropertiesClose"),
            fields: {
                fileName: document.getElementById("fileNameField"),
                fileSize: document.getElementById("fileSizeField"),
                title: document.getElementById("titleField"),
                author: document.getElementById("authorField"),
                subject: document.getElementById("subjectField"),
                keywords: document.getElementById("keywordsField"),
                creationDate: document.getElementById("creationDateField"),
                modificationDate: document.getElementById("modificationDateField"),
                creator: document.getElementById("creatorField"),
                producer: document.getElementById("producerField"),
                version: document.getElementById("versionField"),
                pageCount: document.getElementById("pageCountField")
            }
        }), SecondaryToolbar.initialize({
            toolbar: document.getElementById("secondaryToolbar"),
            toggleButton: document.getElementById("secondaryToolbarToggle"),
            presentationModeButton: document.getElementById("secondaryPresentationMode"),
            openFile: document.getElementById("secondaryOpenFile"),
            print: document.getElementById("secondaryPrint"),
            download: document.getElementById("secondaryDownload"),
            viewBookmark: document.getElementById("secondaryViewBookmark"),
            firstPage: document.getElementById("firstPage"),
            lastPage: document.getElementById("lastPage"),
            pageRotateCw: document.getElementById("pageRotateCw"),
            pageRotateCcw: document.getElementById("pageRotateCcw"),
            documentPropertiesButton: document.getElementById("documentProperties")
        }), this.supportsFullscreen) {
            var s = SecondaryToolbar;
            this.pdfPresentationMode = new PDFPresentationMode({
                container: i,
                viewer: n,
                pdfViewer: this.pdfViewer,
                pdfThumbnailViewer: this.pdfThumbnailViewer,
                contextMenuItems: [{
                    element: document.getElementById("contextFirstPage"),
                    handler: s.firstPageClick.bind(s)
                },
                {
                    element: document.getElementById("contextLastPage"),
                    handler: s.lastPageClick.bind(s)
                },
                {
                    element: document.getElementById("contextPageRotateCw"),
                    handler: s.pageRotateCwClick.bind(s)
                },
                {
                    element: document.getElementById("contextPageRotateCcw"),
                    handler: s.pageRotateCcwClick.bind(s)
                }]
            })
        }
        PasswordPrompt.initialize({
            overlayName: "passwordOverlay",
            passwordField: document.getElementById("password"),
            passwordText: document.getElementById("passwordText"),
            passwordSubmit: document.getElementById("passwordSubmit"),
            passwordCancel: document.getElementById("passwordCancel")
        });
        var a = this,
        o = Promise.all([Preferences.get("enableWebGL").then(function(e) {
            PDFJS.disableWebGL = !e
        }), Preferences.get("sidebarViewOnLoad").then(function(e) {
            a.preferenceSidebarViewOnLoad = e
        }), Preferences.get("pdfBugEnabled").then(function(e) {
            a.preferencePdfBugEnabled = e
        }), Preferences.get("showPreviousViewOnLoad").then(function(e) {
            a.preferenceShowPreviousViewOnLoad = e
        }), Preferences.get("defaultZoomValue").then(function(e) {
            a.preferenceDefaultZoomValue = e
        }), Preferences.get("disableTextLayer").then(function(e) {
            PDFJS.disableTextLayer !== !0 && (PDFJS.disableTextLayer = e)
        }), Preferences.get("disableRange").then(function(e) {
            PDFJS.disableRange !== !0 && (PDFJS.disableRange = e)
        }), Preferences.get("disableStream").then(function(e) {
            PDFJS.disableStream !== !0 && (PDFJS.disableStream = e)
        }), Preferences.get("disableAutoFetch").then(function(e) {
            PDFJS.disableAutoFetch = e
        }), Preferences.get("disableFontFace").then(function(e) {
            PDFJS.disableFontFace !== !0 && (PDFJS.disableFontFace = e)
        }), Preferences.get("useOnlyCssZoom").then(function(e) {
            PDFJS.useOnlyCssZoom = e
        }), Preferences.get("externalLinkTarget").then(function(e) {
            PDFJS.isExternalLinkTargetSet() || (PDFJS.externalLinkTarget = e)
        })])["catch"](function(e) {});
        return o.then(function() {
            a.isViewerEmbedded && !PDFJS.isExternalLinkTargetSet() && (PDFJS.externalLinkTarget = PDFJS.LinkTarget.TOP),
            a.initialized = !0
        })
    },
    zoomIn: function(e) {
        var t = this.pdfViewer.currentScale;
        do t = (t * DEFAULT_SCALE_DELTA).toFixed(2),
        t = Math.ceil(10 * t) / 10,
        t = Math.min(MAX_SCALE, t);
        while (--e > 0 && MAX_SCALE > t);
        this.pdfViewer.currentScaleValue = t
    },
    zoomOut: function(e) {
        var t = this.pdfViewer.currentScale;
        do t = (t / DEFAULT_SCALE_DELTA).toFixed(2),
        t = Math.floor(10 * t) / 10,
        t = Math.max(MIN_SCALE, t);
        while (--e > 0 && t > MIN_SCALE);
        this.pdfViewer.currentScaleValue = t
    },
    get pagesCount() {
        return this.pdfDocument.numPages
    },
    set page(e) {
        this.pdfLinkService.page = e
    },
    get page() {
        return this.pdfLinkService.page
    },
    get supportsPrinting() {
        var e = document.createElement("canvas"),
        t = "mozPrintCallback" in e;
        return PDFJS.shadow(this, "supportsPrinting", t)
    },
    get supportsFullscreen() {
        var e = document.documentElement,
        t = !!(e.requestFullscreen || e.mozRequestFullScreen || e.webkitRequestFullScreen || e.msRequestFullscreen);
        return (document.fullscreenEnabled === !1 || document.mozFullScreenEnabled === !1 || document.webkitFullscreenEnabled === !1 || document.msFullscreenEnabled === !1) && (t = !1),
        t && PDFJS.disableFullscreen === !0 && (t = !1),
        PDFJS.shadow(this, "supportsFullscreen", t)
    },
    get supportsIntegratedFind() {
        var e = !1;
        return PDFJS.shadow(this, "supportsIntegratedFind", e)
    },
    get supportsDocumentFonts() {
        var e = !0;
        return PDFJS.shadow(this, "supportsDocumentFonts", e)
    },
    get supportsDocumentColors() {
        var e = !0;
        return PDFJS.shadow(this, "supportsDocumentColors", e)
    },
    get loadingBar() {
        var e = new ProgressBar("#loadingBar", {});
        return PDFJS.shadow(this, "loadingBar", e)
    },
    get supportedMouseWheelZoomModifierKeys() {
        var e = {
            ctrlKey: !0,
            metaKey: !0
        };
        return PDFJS.shadow(this, "supportedMouseWheelZoomModifierKeys", e)
    },
    setTitleUsingUrl: function(e) {
        this.url = e;
        try {
            this.setTitle(decodeURIComponent(getFileName(e)) || e)
        } catch(t) {
            this.setTitle(e)
        }
    },
    setTitle: function(e) {
        this.isViewerEmbedded || (document.title = e)
    },
    close: function() {
        var e = document.getElementById("errorWrapper");
        if (e.setAttribute("hidden", "true"), !this.pdfLoadingTask) return Promise.resolve();
        var t = this.pdfLoadingTask.destroy();
        return this.pdfLoadingTask = null,
        this.pdfDocument && (this.pdfDocument = null, this.pdfThumbnailViewer.setDocument(null), this.pdfViewer.setDocument(null), this.pdfLinkService.setDocument(null, null)),
        "undefined" != typeof PDFBug && PDFBug.cleanup(),
        t
    },
    open: function(e, t) {
        var i = 0;
        if ((arguments.length > 2 || "number" == typeof t) && (console.warn("Call of open() with obsolete signature."), "number" == typeof t && (i = t), t = arguments[4] || null, arguments[3] && "object" == typeof arguments[3] && (t = Object.create(t), t.range = arguments[3]), "string" == typeof arguments[2] && (t = Object.create(t), t.password = arguments[2])), this.pdfLoadingTask) return this.close().then(function() {
            return Preferences.reload(),
            this.open(e, t)
        }.bind(this));
        var n = Object.create(null);
        if ("string" == typeof e ? (this.setTitleUsingUrl(e), n.url = e) : e && "byteLength" in e ? n.data = e: e.url && e.originalUrl && (this.setTitleUsingUrl(e.originalUrl), n.url = e.url), t) for (var r in t) n[r] = t[r];
        var s = this;
        s.downloadComplete = !1;
        var a = PDFJS.getDocument(n);
        this.pdfLoadingTask = a,
        a.onPassword = function(e, t) {
            PasswordPrompt.updatePassword = e,
            PasswordPrompt.reason = t,
            PasswordPrompt.open()
        },
        a.onProgress = function(e) {
            s.progress(e.loaded / e.total)
        };
        var o = a.promise.then(function(e) {
            s.load(e, i)
        },
        function(e) {
            var t = e && e.message,
            i = mozL10n.get("loading_error", null, "An error occurred while loading the PDF.");
            e instanceof PDFJS.InvalidPDFException ? i = mozL10n.get("invalid_file_error", null, "Invalid or corrupted PDF file.") : e instanceof PDFJS.MissingPDFException ? i = mozL10n.get("missing_file_error", null, "Missing PDF file.") : e instanceof PDFJS.UnexpectedResponseException && (i = mozL10n.get("unexpected_response_error", null, "Unexpected server response."));
            var n = {
                message: t
            };
            throw s.error(i, n),
            new Error(i)
        });
        return t && t.length && PDFViewerApplication.pdfDocumentProperties.setFileSize(t.length),
        o
    },
    download: function() {
        function e() {
            n.downloadUrl(t, i)
        }
        var t = this.url.split("#")[0],
        i = getPDFFileNameFromURL(t),
        n = new DownloadManager;
        return n.onerror = function(e) {
            PDFViewerApplication.error("PDF failed to download.")
        },
        this.pdfDocument && this.downloadComplete ? void this.pdfDocument.getData().then(function(e) {
            var r = PDFJS.createBlob(e, "application/pdf");
            n.download(r, t, i)
        },
        e).then(null, e) : void e()
    },
    fallback: function(e) {},
    error: function(e, t) {
        var i = mozL10n.get("error_version_info", {
            version: PDFJS.version || "?",
            build: PDFJS.build || "?"
        },
        "PDF.js v{{version}} (build: {{build}})") + "\n";
        t && (i += mozL10n.get("error_message", {
            message: t.message
        },
        "Message: {{message}}"), t.stack ? i += "\n" + mozL10n.get("error_stack", {
            stack: t.stack
        },
        "Stack: {{stack}}") : (t.filename && (i += "\n" + mozL10n.get("error_file", {
            file: t.filename
        },
        "File: {{file}}")), t.lineNumber && (i += "\n" + mozL10n.get("error_line", {
            line: t.lineNumber
        },
        "Line: {{line}}"))));
        var n = document.getElementById("errorWrapper");
        n.removeAttribute("hidden");
        var r = document.getElementById("errorMessage");
        r.textContent = e;
        var s = document.getElementById("errorClose");
        s.onclick = function() {
            n.setAttribute("hidden", "true")
        };
        var a = document.getElementById("errorMoreInfo"),
        o = document.getElementById("errorShowMore"),
        d = document.getElementById("errorShowLess");
        o.onclick = function() {
            a.removeAttribute("hidden"),
            o.setAttribute("hidden", "true"),
            d.removeAttribute("hidden"),
            a.style.height = a.scrollHeight + "px"
        },
        d.onclick = function() {
            a.setAttribute("hidden", "true"),
            o.removeAttribute("hidden"),
            d.setAttribute("hidden", "true")
        },
        o.oncontextmenu = noContextMenuHandler,
        d.oncontextmenu = noContextMenuHandler,
        s.oncontextmenu = noContextMenuHandler,
        o.removeAttribute("hidden"),
        d.setAttribute("hidden", "true"),
        a.value = i
    },
    progress: function(e) {
        var t = Math.round(100 * e); (t > this.loadingBar.percent || isNaN(t)) && (this.loadingBar.percent = t, PDFJS.disableAutoFetch && t && (this.disableAutoFetchLoadingBarTimeout && (clearTimeout(this.disableAutoFetchLoadingBarTimeout), this.disableAutoFetchLoadingBarTimeout = null), this.loadingBar.show(), this.disableAutoFetchLoadingBarTimeout = setTimeout(function() {
            this.loadingBar.hide(),
            this.disableAutoFetchLoadingBarTimeout = null
        }.bind(this), DISABLE_AUTO_FETCH_LOADING_BAR_TIMEOUT)))
    },
    load: function(e, t) {
        var i = this;
        t = t || UNKNOWN_SCALE,
        this.findController.reset(),
        this.pdfDocument = e,
        this.pdfDocumentProperties.setDocumentAndUrl(e, this.url);
        var n = e.getDownloadInfo().then(function() {
            i.downloadComplete = !0,
            i.loadingBar.hide()
        }),
        r = e.numPages;
        document.getElementById("numPages").textContent = mozL10n.get("page_of", {
            pageCount: r
        },
        "of {{pageCount}}"),
        document.getElementById("pageNumber").max = r;
        var s = this.documentFingerprint = e.fingerprint,
        a = this.store = new ViewHistory(s),
        o = null;
        this.pdfLinkService.setDocument(e, o);
        var d = this.pdfViewer;
        d.currentScale = t,
        d.setDocument(e);
        var l = d.firstPagePromise,
        h = d.pagesPromise,
        c = d.onePageRendered;
        this.pageRotation = 0,
        this.isInitialViewSet = !1,
        this.pdfThumbnailViewer.setDocument(e),
        l.then(function(e) {
            n.then(function() {
                var e = document.createEvent("CustomEvent");
                e.initCustomEvent("documentload", !0, !0, {}),
                window.dispatchEvent(e)
            }),
            i.loadingBar.setWidth(document.getElementById("viewer")),
            PDFJS.disableHistory || i.isViewerEmbedded || (i.preferenceShowPreviousViewOnLoad || i.pdfHistory.clearHistoryState(), i.pdfHistory.initialize(i.documentFingerprint), i.pdfHistory.initialDestination ? i.initialDestination = i.pdfHistory.initialDestination: i.pdfHistory.initialBookmark && (i.initialBookmark = i.pdfHistory.initialBookmark));
            var r = {
                destination: i.initialDestination,
                bookmark: i.initialBookmark,
                hash: null
            };
            a.initializedPromise.then(function() {
                var e = null;
                if (i.preferenceShowPreviousViewOnLoad && a.get("exists", !1)) {
                    var n = a.get("page", "1"),
                    s = i.preferenceDefaultZoomValue || a.get("zoom", DEFAULT_SCALE_VALUE),
                    o = a.get("scrollLeft", "0"),
                    d = a.get("scrollTop", "0");
                    e = "page=" + n + "&zoom=" + s + "," + o + "," + d
                } else i.preferenceDefaultZoomValue && (e = "page=1&zoom=" + i.preferenceDefaultZoomValue);
                i.setInitialView(e, t),
                r.hash = e,
                i.isViewerEmbedded || i.pdfViewer.focus()
            },
            function(e) {
                console.error(e),
                i.setInitialView(null, t)
            }),
            h.then(function() { (r.destination || r.bookmark || r.hash) && (i.hasEqualPageSizes || (i.initialDestination = r.destination, i.initialBookmark = r.bookmark, i.pdfViewer.currentScaleValue = i.pdfViewer.currentScaleValue, i.setInitialView(r.hash, t)))
            })
        }),
        h.then(function() {
            i.supportsPrinting && e.getJavaScript().then(function(e) {
                e.length && (console.warn("Warning: JavaScript is not supported"), i.fallback(PDFJS.UNSUPPORTED_FEATURES.javaScript));
                for (var t = /\bprint\s*\(/,
                n = 0,
                r = e.length; r > n; n++) {
                    var s = e[n];
                    if (s && t.test(s)) return void setTimeout(function() {
                        window.print()
                    })
                }
            })
        });
        var u = [h, this.animationStartedPromise];
        Promise.all(u).then(function() {
            e.getOutline().then(function(e) {
                var t = document.getElementById("outlineView");
                i.outline = new PDFOutlineView({
                    container: t,
                    outline: e,
                    linkService: i.pdfLinkService
                }),
                i.outline.render(),
                document.getElementById("viewOutline").disabled = !e,
                e || t.classList.contains("hidden") || i.switchSidebarView("thumbs"),
                e && i.preferenceSidebarViewOnLoad === SidebarView.OUTLINE && i.switchSidebarView("outline", !0)
            }),
            e.getAttachments().then(function(e) {
                var t = document.getElementById("attachmentsView");
                i.attachments = new PDFAttachmentView({
                    container: t,
                    attachments: e,
                    downloadManager: new DownloadManager
                }),
                i.attachments.render(),
                document.getElementById("viewAttachments").disabled = !e,
                e || t.classList.contains("hidden") || i.switchSidebarView("thumbs"),
                e && i.preferenceSidebarViewOnLoad === SidebarView.ATTACHMENTS && i.switchSidebarView("attachments", !0)
            })
        }),
        i.preferenceSidebarViewOnLoad === SidebarView.THUMBS && Promise.all([l, c]).then(function() {
            i.switchSidebarView("thumbs", !0)
        }),
        e.getMetadata().then(function(e) {
            var t = e.info,
            n = e.metadata;
            i.documentInfo = t,
            i.metadata = n;
            var r;
            if (n && n.has("dc:title")) {
                var s = n.get("dc:title");
                "Untitled" !== s && (r = s)
            } ! r && t && t.Title && (r = t.Title),
            r && i.setTitle(r + " - " + document.title),
            t.IsAcroFormPresent && (console.warn("Warning: AcroForm/XFA is not supported"), i.fallback(PDFJS.UNSUPPORTED_FEATURES.forms))
        })
    },
    setInitialView: function(e, t) {
        this.isInitialViewSet = !0,
        document.getElementById("pageNumber").value = this.pdfViewer.currentPageNumber,
        this.initialDestination ? (this.pdfLinkService.navigateTo(this.initialDestination), this.initialDestination = null) : this.initialBookmark ? (this.pdfLinkService.setHash(this.initialBookmark), this.pdfHistory.push({
            hash: this.initialBookmark
        },
        !0), this.initialBookmark = null) : e ? this.pdfLinkService.setHash(e) : t && (this.pdfViewer.currentScaleValue = t, this.page = 1),
        this.pdfViewer.currentScaleValue || (this.pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE)
    },
    cleanup: function() {
        this.pdfDocument && (this.pdfViewer.cleanup(), this.pdfThumbnailViewer.cleanup(), this.pdfDocument.cleanup())
    },
    forceRendering: function() {
        this.pdfRenderingQueue.printing = this.printing,
        this.pdfRenderingQueue.isThumbnailViewEnabled = this.sidebarOpen,
        this.pdfRenderingQueue.renderHighestPriority()
    },
    refreshThumbnailViewer: function() {
        for (var e = this.pdfViewer,
        t = this.pdfThumbnailViewer,
        i = e.pagesCount,
        n = 0; i > n; n++) {
            var r = e.getPageView(n);
            if (r && r.renderingState === RenderingStates.FINISHED) {
                var s = t.getThumbnail(n);
                s.setImage(r)
            }
        }
        t.scrollThumbnailIntoView(this.page)
    },
    switchSidebarView: function(e, t) {
        t && !this.sidebarOpen && document.getElementById("sidebarToggle").click();
        var i = document.getElementById("thumbnailView"),
        n = document.getElementById("outlineView"),
        r = document.getElementById("attachmentsView"),
        s = document.getElementById("viewThumbnail"),
        a = document.getElementById("viewOutline"),
        o = document.getElementById("viewAttachments");
        switch (e) {
        case "thumbs":
            var d = i.classList.contains("hidden");
            s.classList.add("toggled"),
            a.classList.remove("toggled"),
            o.classList.remove("toggled"),
            i.classList.remove("hidden"),
            n.classList.add("hidden"),
            r.classList.add("hidden"),
            this.forceRendering(),
            d && this.pdfThumbnailViewer.ensureThumbnailVisible(this.page);
            break;
        case "outline":
            if (a.disabled) return;
            s.classList.remove("toggled"),
            a.classList.add("toggled"),
            o.classList.remove("toggled"),
            i.classList.add("hidden"),
            n.classList.remove("hidden"),
            r.classList.add("hidden");
            break;
        case "attachments":
            if (o.disabled) return;
            s.classList.remove("toggled"),
            a.classList.remove("toggled"),
            o.classList.add("toggled"),
            i.classList.add("hidden"),
            n.classList.add("hidden"),
            r.classList.remove("hidden")
        }
    },
    beforePrint: function() {
        if (!this.supportsPrinting) {
            var e = mozL10n.get("printing_not_supported", null, "Warning: Printing is not fully supported by this browser.");
            return void this.error(e)
        }
        var t, i, n = !1;
        if (this.pdfDocument && this.pagesCount) {
            for (t = 0, i = this.pagesCount; i > t; ++t) if (!this.pdfViewer.getPageView(t).pdfPage) {
                n = !0;
                break
            }
        } else n = !0;
        if (n) {
            var r = mozL10n.get("printing_not_ready", null, "Warning: The PDF is not fully loaded for printing.");
            return void window.alert(r)
        }
        this.printing = !0,
        this.forceRendering();
        var s = document.querySelector("body");
        s.setAttribute("data-mozPrintCallback", !0),
        this.hasEqualPageSizes || console.warn("Not all pages have the same size. The printed result may be incorrect!"),
        this.pageStyleSheet = document.createElement("style");
        var a = this.pdfViewer.getPageView(0).pdfPage.getViewport(1);
        for (this.pageStyleSheet.textContent = "@supports ((size:A4) and (size:1pt 1pt)) {@page { size: " + a.width + "pt " + a.height + "pt;}#printContainer {height:100%}#printContainer > div {width:100% !important;height:100% !important;}}", s.appendChild(this.pageStyleSheet), t = 0, i = this.pagesCount; i > t; ++t) this.pdfViewer.getPageView(t).beforePrint()
    },
    get hasEqualPageSizes() {
        for (var e = this.pdfViewer.getPageView(0), t = 1, i = this.pagesCount; i > t; ++t) {
            var n = this.pdfViewer.getPageView(t);
            if (n.width !== e.width || n.height !== e.height) return ! 1
        }
        return ! 0
    },
    afterPrint: function() {
        for (var e = document.getElementById("printContainer"); e.hasChildNodes();) e.removeChild(e.lastChild);
        this.pageStyleSheet && this.pageStyleSheet.parentNode && (this.pageStyleSheet.parentNode.removeChild(this.pageStyleSheet), this.pageStyleSheet = null),
        this.printing = !1,
        this.forceRendering()
    },
    rotatePages: function(e) {
        var t = this.page;
        this.pageRotation = (this.pageRotation + 360 + e) % 360,
        this.pdfViewer.pagesRotation = this.pageRotation,
        this.pdfThumbnailViewer.pagesRotation = this.pageRotation,
        this.forceRendering(),
        this.pdfViewer.scrollPageIntoView(t)
    },
    requestPresentationMode: function() {
        this.pdfPresentationMode && this.pdfPresentationMode.request()
    },
    scrollPresentationMode: function(e) {
        this.pdfPresentationMode && this.pdfPresentationMode.mouseScroll(e)
    }
};
window.PDFView = PDFViewerApplication,
document.addEventListener("DOMContentLoaded", webViewerLoad, !0),
document.addEventListener("pagerendered",
function(e) {
    var t = e.detail.pageNumber,
    i = t - 1,
    n = PDFViewerApplication.pdfViewer.getPageView(i);
    if (PDFViewerApplication.sidebarOpen) {
        var r = PDFViewerApplication.pdfThumbnailViewer.getThumbnail(i);
        r.setImage(n)
    }
    if (PDFJS.pdfBug && Stats.enabled && n.stats && Stats.add(t, n.stats), n.error && PDFViewerApplication.error(mozL10n.get("rendering_error", null, "An error occurred while rendering the page."), n.error), t === PDFViewerApplication.page) {
        var s = document.getElementById("pageNumber");
        s.classList.remove(PAGE_NUMBER_LOADING_INDICATOR)
    }
},
!0),
document.addEventListener("textlayerrendered",
function(e) {
    var t = e.detail.pageNumber - 1;
    PDFViewerApplication.pdfViewer.getPageView(t)
},
!0),
document.addEventListener("pagemode",
function(e) {
    if (PDFViewerApplication.initialized) {
        var t = e.detail.mode;
        switch (t) {
        case "bookmarks":
            t = "outline";
        case "thumbs":
        case "attachments":
            PDFViewerApplication.switchSidebarView(t, !0);
            break;
        case "none":
            PDFViewerApplication.sidebarOpen && document.getElementById("sidebarToggle").click()
        }
    }
},
!0),
document.addEventListener("namedaction",
function(e) {
    if (PDFViewerApplication.initialized) {
        var t = e.detail.action;
        switch (t) {
        case "GoToPage":
            document.getElementById("pageNumber").focus();
            break;
        case "Find":
            PDFViewerApplication.supportsIntegratedFind || PDFViewerApplication.findBar.toggle()
        }
    }
},
!0),
window.addEventListener("presentationmodechanged",
function(e) {
    var t = e.detail.active,
    i = e.detail.switchInProgress;
    PDFViewerApplication.pdfViewer.presentationModeState = i ? PresentationModeState.CHANGING: t ? PresentationModeState.FULLSCREEN: PresentationModeState.NORMAL
}),
window.addEventListener("updateviewarea",
function(e) {
    if (PDFViewerApplication.initialized) {
        var t = e.location;
        PDFViewerApplication.store.initializedPromise.then(function() {
            PDFViewerApplication.store.setMultiple({
                exists: !0,
                page: t.pageNumber,
                zoom: t.scale,
                scrollLeft: t.left,
                scrollTop: t.top
            })["catch"](function() {})
        });
        var i = PDFViewerApplication.pdfLinkService.getAnchorUrl(t.pdfOpenParams);
        document.getElementById("viewBookmark").href = i,
        document.getElementById("secondaryViewBookmark").href = i,
        PDFViewerApplication.pdfHistory.updateCurrentBookmark(t.pdfOpenParams, t.pageNumber);
        var n = document.getElementById("pageNumber"),
        r = PDFViewerApplication.pdfViewer.getPageView(PDFViewerApplication.page - 1);
        r.renderingState === RenderingStates.FINISHED ? n.classList.remove(PAGE_NUMBER_LOADING_INDICATOR) : n.classList.add(PAGE_NUMBER_LOADING_INDICATOR)
    }
},
!0),
window.addEventListener("resize",
function(e) {
    if (PDFViewerApplication.initialized) {
        var t = PDFViewerApplication.pdfViewer.currentScaleValue;
        "auto" === t || "page-fit" === t || "page-width" === t ? PDFViewerApplication.pdfViewer.currentScaleValue = t: t || (PDFViewerApplication.pdfViewer.currentScaleValue = DEFAULT_SCALE_VALUE),
        PDFViewerApplication.pdfViewer.update()
    }
    SecondaryToolbar.setMaxHeight(document.getElementById("viewerContainer"))
}),
window.addEventListener("hashchange",
function(e) {
    if (PDFViewerApplication.pdfHistory.isHashChangeUnlocked) {
        var t = document.location.hash.substring(1);
        if (!t) return;
        PDFViewerApplication.isInitialViewSet ? PDFViewerApplication.pdfLinkService.setHash(t) : PDFViewerApplication.initialBookmark = t
    }
}),
window.addEventListener("change",
function(e) {
    var t = e.target.files;
    if (t && 0 !== t.length) {
        var i = t[0];
        if (!PDFJS.disableCreateObjectURL && "undefined" != typeof URL && URL.createObjectURL) PDFViewerApplication.open(URL.createObjectURL(i));
        else {
            var n = new FileReader;
            n.onload = function(e) {
                var t = e.target.result,
                i = new Uint8Array(t);
                PDFViewerApplication.open(i)
            },
            n.readAsArrayBuffer(i)
        }
        PDFViewerApplication.setTitleUsingUrl(i.name),
        document.getElementById("viewBookmark").setAttribute("hidden", "true"),
        document.getElementById("secondaryViewBookmark").setAttribute("hidden", "true"),
        document.getElementById("download").setAttribute("hidden", "true"),
        document.getElementById("secondaryDownload").setAttribute("hidden", "true")
    }
},
!0),
window.addEventListener("localized",
function(e) {
    document.getElementsByTagName("html")[0].dir = mozL10n.getDirection(),
    PDFViewerApplication.animationStartedPromise.then(function() {
        var e = document.getElementById("scaleSelectContainer");
        if (0 === e.clientWidth && e.setAttribute("style", "display: inherit;"), e.clientWidth > 0) {
            var t = document.getElementById("scaleSelect");
            t.setAttribute("style", "min-width: inherit;");
            var i = t.clientWidth + SCALE_SELECT_CONTAINER_PADDING;
            t.setAttribute("style", "min-width: " + (i + SCALE_SELECT_PADDING) + "px;"),
            e.setAttribute("style", "min-width: " + i + "px; max-width: " + i + "px;")
        }
        SecondaryToolbar.setMaxHeight(document.getElementById("viewerContainer"))
    })
},
!0),
window.addEventListener("scalechange",
function(e) {
    document.getElementById("zoomOut").disabled = e.scale === MIN_SCALE,
    document.getElementById("zoomIn").disabled = e.scale === MAX_SCALE;
    var t = selectScaleOption(e.presetValue || "" + e.scale);
    if (!t) {
        var i = document.getElementById("customScaleOption"),
        n = Math.round(1e4 * e.scale) / 100;
        i.textContent = mozL10n.get("page_scale_percent", {
            scale: n
        },
        "{{scale}}%"),
        i.selected = !0
    }
    PDFViewerApplication.initialized && PDFViewerApplication.pdfViewer.update()
},
!0),
window.addEventListener("pagechange",
function(e) {
    var t = e.pageNumber;
    e.previousPageNumber !== t && (document.getElementById("pageNumber").value = t, PDFViewerApplication.sidebarOpen && PDFViewerApplication.pdfThumbnailViewer.scrollThumbnailIntoView(t));
    var i = PDFViewerApplication.pagesCount;
    if (document.getElementById("previous").disabled = 1 >= t, document.getElementById("next").disabled = t >= i, document.getElementById("firstPage").disabled = 1 >= t, document.getElementById("lastPage").disabled = t >= i, PDFJS.pdfBug && Stats.enabled) {
        var n = PDFViewerApplication.pdfViewer.getPageView(t - 1);
        n.stats && Stats.add(t, n.stats)
    }
},
!0),
window.addEventListener("DOMMouseScroll", handleMouseWheel),
window.addEventListener("mousewheel", handleMouseWheel),
window.addEventListener("click",
function(e) {
    SecondaryToolbar.opened && PDFViewerApplication.pdfViewer.containsElement(e.target) && SecondaryToolbar.close()
},
!1),
window.addEventListener("keydown",
function(e) {
    if (!OverlayManager.active) {
        var t = !1,
        i = (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0),
        n = PDFViewerApplication.pdfViewer,
        r = n && n.isInPresentationMode;
        if (1 === i || 8 === i || 5 === i || 12 === i) switch (e.keyCode) {
        case 70:
            PDFViewerApplication.supportsIntegratedFind || (PDFViewerApplication.findBar.open(), t = !0);
            break;
        case 71:
            PDFViewerApplication.supportsIntegratedFind || (PDFViewerApplication.findBar.dispatchEvent("again", 5 === i || 12 === i), t = !0);
            break;
        case 61:
        case 107:
        case 187:
        case 171:
            r || PDFViewerApplication.zoomIn(),
            t = !0;
            break;
        case 173:
        case 109:
        case 189:
            r || PDFViewerApplication.zoomOut(),
            t = !0;
            break;
        case 48:
        case 96:
            r || (setTimeout(function() {
                n.currentScaleValue = DEFAULT_SCALE_VALUE
            }), t = !1)
        }
        if (1 === i || 8 === i) switch (e.keyCode) {
        case 83:
            PDFViewerApplication.download(),
            t = !0
        }
        if (3 === i || 10 === i) switch (e.keyCode) {
        case 80:
            PDFViewerApplication.requestPresentationMode(),
            t = !0;
            break;
        case 71:
            document.getElementById("pageNumber").select(),
            t = !0
        }
        if (t) return void e.preventDefault();
        var s = document.activeElement || document.querySelector(":focus"),
        a = s && s.tagName.toUpperCase();
        if ("INPUT" !== a && "TEXTAREA" !== a && "SELECT" !== a || 27 === e.keyCode) {
            var o = !1;
            if (0 === i) switch (e.keyCode) {
            case 38:
            case 33:
            case 8:
                if (!r && "page-fit" !== n.currentScaleValue) break;
            case 37:
                if (n.isHorizontalScrollbarEnabled) break;
            case 75:
            case 80:
                PDFViewerApplication.page--,
                t = !0;
                break;
            case 27:
                SecondaryToolbar.opened && (SecondaryToolbar.close(), t = !0),
                !PDFViewerApplication.supportsIntegratedFind && PDFViewerApplication.findBar.opened && (PDFViewerApplication.findBar.close(), t = !0);
                break;
            case 40:
            case 34:
            case 32:
                if (!r && "page-fit" !== n.currentScaleValue) break;
            case 39:
                if (n.isHorizontalScrollbarEnabled) break;
            case 74:
            case 78:
                PDFViewerApplication.page++,
                t = !0;
                break;
            case 36:
                (r || PDFViewerApplication.page > 1) && (PDFViewerApplication.page = 1, t = !0, o = !0);
                break;
            case 35:
                (r || PDFViewerApplication.pdfDocument && PDFViewerApplication.page < PDFViewerApplication.pagesCount) && (PDFViewerApplication.page = PDFViewerApplication.pagesCount, t = !0, o = !0);
                break;
            case 72:
                r || HandTool.toggle();
                break;
            case 82:
                PDFViewerApplication.rotatePages(90)
            }
            if (4 === i) switch (e.keyCode) {
            case 32:
                if (!r && "page-fit" !== n.currentScaleValue) break;
                PDFViewerApplication.page--,
                t = !0;
                break;
            case 82:
                PDFViewerApplication.rotatePages( - 90)
            }
            if (t || r || (e.keyCode >= 33 && e.keyCode <= 40 || 32 === e.keyCode && "BUTTON" !== a) && (o = !0), 2 === i) switch (e.keyCode) {
            case 37:
                r && (PDFViewerApplication.pdfHistory.back(), t = !0);
                break;
            case 39:
                r && (PDFViewerApplication.pdfHistory.forward(), t = !0)
            }
            o && !n.containsElement(s) && n.focus(),
            t && e.preventDefault()
        }
    }
}),
window.addEventListener("beforeprint",
function(e) {
    PDFViewerApplication.beforePrint()
}),
window.addEventListener("afterprint",
function(e) {
    PDFViewerApplication.afterPrint()
}),
function() {
    PDFViewerApplication.animationStartedPromise = new Promise(function(e) {
        window.requestAnimationFrame(e)
    })
} ();