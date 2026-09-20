import { a as i_ } from "./runtime-D_epeM7Z.js";
var qu = { exports: {} }, na = {}, $u = { exports: {} }, mt = {};
var pm;
function r_() {
  if (pm) return mt;
  pm = 1;
  var s = /* @__PURE__ */ Symbol.for("react.element"), e = /* @__PURE__ */ Symbol.for("react.portal"), t = /* @__PURE__ */ Symbol.for("react.fragment"), r = /* @__PURE__ */ Symbol.for("react.strict_mode"), o = /* @__PURE__ */ Symbol.for("react.profiler"), l = /* @__PURE__ */ Symbol.for("react.provider"), u = /* @__PURE__ */ Symbol.for("react.context"), d = /* @__PURE__ */ Symbol.for("react.forward_ref"), f = /* @__PURE__ */ Symbol.for("react.suspense"), h = /* @__PURE__ */ Symbol.for("react.memo"), m = /* @__PURE__ */ Symbol.for("react.lazy"), _ = Symbol.iterator;
  function v(U) {
    return U === null || typeof U != "object" ? null : (U = _ && U[_] || U["@@iterator"], typeof U == "function" ? U : null);
  }
  var S = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, y = Object.assign, E = {};
  function x(U, oe, Fe) {
    this.props = U, this.context = oe, this.refs = E, this.updater = Fe || S;
  }
  x.prototype.isReactComponent = {}, x.prototype.setState = function(U, oe) {
    if (typeof U != "object" && typeof U != "function" && U != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, U, oe, "setState");
  }, x.prototype.forceUpdate = function(U) {
    this.updater.enqueueForceUpdate(this, U, "forceUpdate");
  };
  function M() {
  }
  M.prototype = x.prototype;
  function L(U, oe, Fe) {
    this.props = U, this.context = oe, this.refs = E, this.updater = Fe || S;
  }
  var R = L.prototype = new M();
  R.constructor = L, y(R, x.prototype), R.isPureReactComponent = !0;
  var D = Array.isArray, ee = Object.prototype.hasOwnProperty, F = { current: null }, I = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Y(U, oe, Fe) {
    var K, ce = {}, pe = null, Me = null;
    if (oe != null) for (K in oe.ref !== void 0 && (Me = oe.ref), oe.key !== void 0 && (pe = "" + oe.key), oe) ee.call(oe, K) && !I.hasOwnProperty(K) && (ce[K] = oe[K]);
    var Re = arguments.length - 2;
    if (Re === 1) ce.children = Fe;
    else if (1 < Re) {
      for (var Le = Array(Re), Je = 0; Je < Re; Je++) Le[Je] = arguments[Je + 2];
      ce.children = Le;
    }
    if (U && U.defaultProps) for (K in Re = U.defaultProps, Re) ce[K] === void 0 && (ce[K] = Re[K]);
    return { $$typeof: s, type: U, key: pe, ref: Me, props: ce, _owner: F.current };
  }
  function ve(U, oe) {
    return { $$typeof: s, type: U.type, key: oe, ref: U.ref, props: U.props, _owner: U._owner };
  }
  function T(U) {
    return typeof U == "object" && U !== null && U.$$typeof === s;
  }
  function C(U) {
    var oe = { "=": "=0", ":": "=2" };
    return "$" + U.replace(/[=:]/g, function(Fe) {
      return oe[Fe];
    });
  }
  var te = /\/+/g;
  function J(U, oe) {
    return typeof U == "object" && U !== null && U.key != null ? C("" + U.key) : oe.toString(36);
  }
  function se(U, oe, Fe, K, ce) {
    var pe = typeof U;
    (pe === "undefined" || pe === "boolean") && (U = null);
    var Me = !1;
    if (U === null) Me = !0;
    else switch (pe) {
      case "string":
      case "number":
        Me = !0;
        break;
      case "object":
        switch (U.$$typeof) {
          case s:
          case e:
            Me = !0;
        }
    }
    if (Me) return Me = U, ce = ce(Me), U = K === "" ? "." + J(Me, 0) : K, D(ce) ? (Fe = "", U != null && (Fe = U.replace(te, "$&/") + "/"), se(ce, oe, Fe, "", function(Je) {
      return Je;
    })) : ce != null && (T(ce) && (ce = ve(ce, Fe + (!ce.key || Me && Me.key === ce.key ? "" : ("" + ce.key).replace(te, "$&/") + "/") + U)), oe.push(ce)), 1;
    if (Me = 0, K = K === "" ? "." : K + ":", D(U)) for (var Re = 0; Re < U.length; Re++) {
      pe = U[Re];
      var Le = K + J(pe, Re);
      Me += se(pe, oe, Fe, Le, ce);
    }
    else if (Le = v(U), typeof Le == "function") for (U = Le.call(U), Re = 0; !(pe = U.next()).done; ) pe = pe.value, Le = K + J(pe, Re++), Me += se(pe, oe, Fe, Le, ce);
    else if (pe === "object") throw oe = String(U), Error("Objects are not valid as a React child (found: " + (oe === "[object Object]" ? "object with keys {" + Object.keys(U).join(", ") + "}" : oe) + "). If you meant to render a collection of children, use an array instead.");
    return Me;
  }
  function _e(U, oe, Fe) {
    if (U == null) return U;
    var K = [], ce = 0;
    return se(U, K, "", "", function(pe) {
      return oe.call(Fe, pe, ce++);
    }), K;
  }
  function Z(U) {
    if (U._status === -1) {
      var oe = U._result;
      oe = oe(), oe.then(function(Fe) {
        (U._status === 0 || U._status === -1) && (U._status = 1, U._result = Fe);
      }, function(Fe) {
        (U._status === 0 || U._status === -1) && (U._status = 2, U._result = Fe);
      }), U._status === -1 && (U._status = 0, U._result = oe);
    }
    if (U._status === 1) return U._result.default;
    throw U._result;
  }
  var he = { current: null }, O = { transition: null }, ue = { ReactCurrentDispatcher: he, ReactCurrentBatchConfig: O, ReactCurrentOwner: F };
  function ae() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return mt.Children = { map: _e, forEach: function(U, oe, Fe) {
    _e(U, function() {
      oe.apply(this, arguments);
    }, Fe);
  }, count: function(U) {
    var oe = 0;
    return _e(U, function() {
      oe++;
    }), oe;
  }, toArray: function(U) {
    return _e(U, function(oe) {
      return oe;
    }) || [];
  }, only: function(U) {
    if (!T(U)) throw Error("React.Children.only expected to receive a single React element child.");
    return U;
  } }, mt.Component = x, mt.Fragment = t, mt.Profiler = o, mt.PureComponent = L, mt.StrictMode = r, mt.Suspense = f, mt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ue, mt.act = ae, mt.cloneElement = function(U, oe, Fe) {
    if (U == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + U + ".");
    var K = y({}, U.props), ce = U.key, pe = U.ref, Me = U._owner;
    if (oe != null) {
      if (oe.ref !== void 0 && (pe = oe.ref, Me = F.current), oe.key !== void 0 && (ce = "" + oe.key), U.type && U.type.defaultProps) var Re = U.type.defaultProps;
      for (Le in oe) ee.call(oe, Le) && !I.hasOwnProperty(Le) && (K[Le] = oe[Le] === void 0 && Re !== void 0 ? Re[Le] : oe[Le]);
    }
    var Le = arguments.length - 2;
    if (Le === 1) K.children = Fe;
    else if (1 < Le) {
      Re = Array(Le);
      for (var Je = 0; Je < Le; Je++) Re[Je] = arguments[Je + 2];
      K.children = Re;
    }
    return { $$typeof: s, type: U.type, key: ce, ref: pe, props: K, _owner: Me };
  }, mt.createContext = function(U) {
    return U = { $$typeof: u, _currentValue: U, _currentValue2: U, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, U.Provider = { $$typeof: l, _context: U }, U.Consumer = U;
  }, mt.createElement = Y, mt.createFactory = function(U) {
    var oe = Y.bind(null, U);
    return oe.type = U, oe;
  }, mt.createRef = function() {
    return { current: null };
  }, mt.forwardRef = function(U) {
    return { $$typeof: d, render: U };
  }, mt.isValidElement = T, mt.lazy = function(U) {
    return { $$typeof: m, _payload: { _status: -1, _result: U }, _init: Z };
  }, mt.memo = function(U, oe) {
    return { $$typeof: h, type: U, compare: oe === void 0 ? null : oe };
  }, mt.startTransition = function(U) {
    var oe = O.transition;
    O.transition = {};
    try {
      U();
    } finally {
      O.transition = oe;
    }
  }, mt.unstable_act = ae, mt.useCallback = function(U, oe) {
    return he.current.useCallback(U, oe);
  }, mt.useContext = function(U) {
    return he.current.useContext(U);
  }, mt.useDebugValue = function() {
  }, mt.useDeferredValue = function(U) {
    return he.current.useDeferredValue(U);
  }, mt.useEffect = function(U, oe) {
    return he.current.useEffect(U, oe);
  }, mt.useId = function() {
    return he.current.useId();
  }, mt.useImperativeHandle = function(U, oe, Fe) {
    return he.current.useImperativeHandle(U, oe, Fe);
  }, mt.useInsertionEffect = function(U, oe) {
    return he.current.useInsertionEffect(U, oe);
  }, mt.useLayoutEffect = function(U, oe) {
    return he.current.useLayoutEffect(U, oe);
  }, mt.useMemo = function(U, oe) {
    return he.current.useMemo(U, oe);
  }, mt.useReducer = function(U, oe, Fe) {
    return he.current.useReducer(U, oe, Fe);
  }, mt.useRef = function(U) {
    return he.current.useRef(U);
  }, mt.useState = function(U) {
    return he.current.useState(U);
  }, mt.useSyncExternalStore = function(U, oe, Fe) {
    return he.current.useSyncExternalStore(U, oe, Fe);
  }, mt.useTransition = function() {
    return he.current.useTransition();
  }, mt.version = "18.3.1", mt;
}
var mm;
function Cf() {
  return mm || (mm = 1, $u.exports = r_()), $u.exports;
}
var gm;
function s_() {
  if (gm) return na;
  gm = 1;
  var s = Cf(), e = /* @__PURE__ */ Symbol.for("react.element"), t = /* @__PURE__ */ Symbol.for("react.fragment"), r = Object.prototype.hasOwnProperty, o = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, l = { key: !0, ref: !0, __self: !0, __source: !0 };
  function u(d, f, h) {
    var m, _ = {}, v = null, S = null;
    h !== void 0 && (v = "" + h), f.key !== void 0 && (v = "" + f.key), f.ref !== void 0 && (S = f.ref);
    for (m in f) r.call(f, m) && !l.hasOwnProperty(m) && (_[m] = f[m]);
    if (d && d.defaultProps) for (m in f = d.defaultProps, f) _[m] === void 0 && (_[m] = f[m]);
    return { $$typeof: e, type: d, key: v, ref: S, props: _, _owner: o.current };
  }
  return na.Fragment = t, na.jsx = u, na.jsxs = u, na;
}
var vm;
function o_() {
  return vm || (vm = 1, qu.exports = s_()), qu.exports;
}
var W = o_(), wl = {}, Ku = { exports: {} }, kn = {}, Zu = { exports: {} }, Qu = {};
var _m;
function a_() {
  return _m || (_m = 1, (function(s) {
    function e(O, ue) {
      var ae = O.length;
      O.push(ue);
      e: for (; 0 < ae; ) {
        var U = ae - 1 >>> 1, oe = O[U];
        if (0 < o(oe, ue)) O[U] = ue, O[ae] = oe, ae = U;
        else break e;
      }
    }
    function t(O) {
      return O.length === 0 ? null : O[0];
    }
    function r(O) {
      if (O.length === 0) return null;
      var ue = O[0], ae = O.pop();
      if (ae !== ue) {
        O[0] = ae;
        e: for (var U = 0, oe = O.length, Fe = oe >>> 1; U < Fe; ) {
          var K = 2 * (U + 1) - 1, ce = O[K], pe = K + 1, Me = O[pe];
          if (0 > o(ce, ae)) pe < oe && 0 > o(Me, ce) ? (O[U] = Me, O[pe] = ae, U = pe) : (O[U] = ce, O[K] = ae, U = K);
          else if (pe < oe && 0 > o(Me, ae)) O[U] = Me, O[pe] = ae, U = pe;
          else break e;
        }
      }
      return ue;
    }
    function o(O, ue) {
      var ae = O.sortIndex - ue.sortIndex;
      return ae !== 0 ? ae : O.id - ue.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var l = performance;
      s.unstable_now = function() {
        return l.now();
      };
    } else {
      var u = Date, d = u.now();
      s.unstable_now = function() {
        return u.now() - d;
      };
    }
    var f = [], h = [], m = 1, _ = null, v = 3, S = !1, y = !1, E = !1, x = typeof setTimeout == "function" ? setTimeout : null, M = typeof clearTimeout == "function" ? clearTimeout : null, L = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function R(O) {
      for (var ue = t(h); ue !== null; ) {
        if (ue.callback === null) r(h);
        else if (ue.startTime <= O) r(h), ue.sortIndex = ue.expirationTime, e(f, ue);
        else break;
        ue = t(h);
      }
    }
    function D(O) {
      if (E = !1, R(O), !y) if (t(f) !== null) y = !0, Z(ee);
      else {
        var ue = t(h);
        ue !== null && he(D, ue.startTime - O);
      }
    }
    function ee(O, ue) {
      y = !1, E && (E = !1, M(Y), Y = -1), S = !0;
      var ae = v;
      try {
        for (R(ue), _ = t(f); _ !== null && (!(_.expirationTime > ue) || O && !C()); ) {
          var U = _.callback;
          if (typeof U == "function") {
            _.callback = null, v = _.priorityLevel;
            var oe = U(_.expirationTime <= ue);
            ue = s.unstable_now(), typeof oe == "function" ? _.callback = oe : _ === t(f) && r(f), R(ue);
          } else r(f);
          _ = t(f);
        }
        if (_ !== null) var Fe = !0;
        else {
          var K = t(h);
          K !== null && he(D, K.startTime - ue), Fe = !1;
        }
        return Fe;
      } finally {
        _ = null, v = ae, S = !1;
      }
    }
    var F = !1, I = null, Y = -1, ve = 5, T = -1;
    function C() {
      return !(s.unstable_now() - T < ve);
    }
    function te() {
      if (I !== null) {
        var O = s.unstable_now();
        T = O;
        var ue = !0;
        try {
          ue = I(!0, O);
        } finally {
          ue ? J() : (F = !1, I = null);
        }
      } else F = !1;
    }
    var J;
    if (typeof L == "function") J = function() {
      L(te);
    };
    else if (typeof MessageChannel < "u") {
      var se = new MessageChannel(), _e = se.port2;
      se.port1.onmessage = te, J = function() {
        _e.postMessage(null);
      };
    } else J = function() {
      x(te, 0);
    };
    function Z(O) {
      I = O, F || (F = !0, J());
    }
    function he(O, ue) {
      Y = x(function() {
        O(s.unstable_now());
      }, ue);
    }
    s.unstable_IdlePriority = 5, s.unstable_ImmediatePriority = 1, s.unstable_LowPriority = 4, s.unstable_NormalPriority = 3, s.unstable_Profiling = null, s.unstable_UserBlockingPriority = 2, s.unstable_cancelCallback = function(O) {
      O.callback = null;
    }, s.unstable_continueExecution = function() {
      y || S || (y = !0, Z(ee));
    }, s.unstable_forceFrameRate = function(O) {
      0 > O || 125 < O ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ve = 0 < O ? Math.floor(1e3 / O) : 5;
    }, s.unstable_getCurrentPriorityLevel = function() {
      return v;
    }, s.unstable_getFirstCallbackNode = function() {
      return t(f);
    }, s.unstable_next = function(O) {
      switch (v) {
        case 1:
        case 2:
        case 3:
          var ue = 3;
          break;
        default:
          ue = v;
      }
      var ae = v;
      v = ue;
      try {
        return O();
      } finally {
        v = ae;
      }
    }, s.unstable_pauseExecution = function() {
    }, s.unstable_requestPaint = function() {
    }, s.unstable_runWithPriority = function(O, ue) {
      switch (O) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          O = 3;
      }
      var ae = v;
      v = O;
      try {
        return ue();
      } finally {
        v = ae;
      }
    }, s.unstable_scheduleCallback = function(O, ue, ae) {
      var U = s.unstable_now();
      switch (typeof ae == "object" && ae !== null ? (ae = ae.delay, ae = typeof ae == "number" && 0 < ae ? U + ae : U) : ae = U, O) {
        case 1:
          var oe = -1;
          break;
        case 2:
          oe = 250;
          break;
        case 5:
          oe = 1073741823;
          break;
        case 4:
          oe = 1e4;
          break;
        default:
          oe = 5e3;
      }
      return oe = ae + oe, O = { id: m++, callback: ue, priorityLevel: O, startTime: ae, expirationTime: oe, sortIndex: -1 }, ae > U ? (O.sortIndex = ae, e(h, O), t(f) === null && O === t(h) && (E ? (M(Y), Y = -1) : E = !0, he(D, ae - U))) : (O.sortIndex = oe, e(f, O), y || S || (y = !0, Z(ee))), O;
    }, s.unstable_shouldYield = C, s.unstable_wrapCallback = function(O) {
      var ue = v;
      return function() {
        var ae = v;
        v = ue;
        try {
          return O.apply(this, arguments);
        } finally {
          v = ae;
        }
      };
    };
  })(Qu)), Qu;
}
var xm;
function l_() {
  return xm || (xm = 1, Zu.exports = a_()), Zu.exports;
}
var ym;
function c_() {
  if (ym) return kn;
  ym = 1;
  var s = Cf(), e = l_();
  function t(n) {
    for (var i = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, a = 1; a < arguments.length; a++) i += "&args[]=" + encodeURIComponent(arguments[a]);
    return "Minified React error #" + n + "; visit " + i + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var r = /* @__PURE__ */ new Set(), o = {};
  function l(n, i) {
    u(n, i), u(n + "Capture", i);
  }
  function u(n, i) {
    for (o[n] = i, n = 0; n < i.length; n++) r.add(i[n]);
  }
  var d = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), f = Object.prototype.hasOwnProperty, h = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, m = {}, _ = {};
  function v(n) {
    return f.call(_, n) ? !0 : f.call(m, n) ? !1 : h.test(n) ? _[n] = !0 : (m[n] = !0, !1);
  }
  function S(n, i, a, c) {
    if (a !== null && a.type === 0) return !1;
    switch (typeof i) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return c ? !1 : a !== null ? !a.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function y(n, i, a, c) {
    if (i === null || typeof i > "u" || S(n, i, a, c)) return !0;
    if (c) return !1;
    if (a !== null) switch (a.type) {
      case 3:
        return !i;
      case 4:
        return i === !1;
      case 5:
        return isNaN(i);
      case 6:
        return isNaN(i) || 1 > i;
    }
    return !1;
  }
  function E(n, i, a, c, p, g, w) {
    this.acceptsBooleans = i === 2 || i === 3 || i === 4, this.attributeName = c, this.attributeNamespace = p, this.mustUseProperty = a, this.propertyName = n, this.type = i, this.sanitizeURL = g, this.removeEmptyString = w;
  }
  var x = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    x[n] = new E(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var i = n[0];
    x[i] = new E(i, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    x[n] = new E(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    x[n] = new E(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    x[n] = new E(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    x[n] = new E(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    x[n] = new E(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    x[n] = new E(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    x[n] = new E(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var M = /[\-:]([a-z])/g;
  function L(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var i = n.replace(
      M,
      L
    );
    x[i] = new E(i, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var i = n.replace(M, L);
    x[i] = new E(i, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var i = n.replace(M, L);
    x[i] = new E(i, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    x[n] = new E(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), x.xlinkHref = new E("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    x[n] = new E(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function R(n, i, a, c) {
    var p = x.hasOwnProperty(i) ? x[i] : null;
    (p !== null ? p.type !== 0 : c || !(2 < i.length) || i[0] !== "o" && i[0] !== "O" || i[1] !== "n" && i[1] !== "N") && (y(i, a, p, c) && (a = null), c || p === null ? v(i) && (a === null ? n.removeAttribute(i) : n.setAttribute(i, "" + a)) : p.mustUseProperty ? n[p.propertyName] = a === null ? p.type === 3 ? !1 : "" : a : (i = p.attributeName, c = p.attributeNamespace, a === null ? n.removeAttribute(i) : (p = p.type, a = p === 3 || p === 4 && a === !0 ? "" : "" + a, c ? n.setAttributeNS(c, i, a) : n.setAttribute(i, a))));
  }
  var D = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ee = /* @__PURE__ */ Symbol.for("react.element"), F = /* @__PURE__ */ Symbol.for("react.portal"), I = /* @__PURE__ */ Symbol.for("react.fragment"), Y = /* @__PURE__ */ Symbol.for("react.strict_mode"), ve = /* @__PURE__ */ Symbol.for("react.profiler"), T = /* @__PURE__ */ Symbol.for("react.provider"), C = /* @__PURE__ */ Symbol.for("react.context"), te = /* @__PURE__ */ Symbol.for("react.forward_ref"), J = /* @__PURE__ */ Symbol.for("react.suspense"), se = /* @__PURE__ */ Symbol.for("react.suspense_list"), _e = /* @__PURE__ */ Symbol.for("react.memo"), Z = /* @__PURE__ */ Symbol.for("react.lazy"), he = /* @__PURE__ */ Symbol.for("react.offscreen"), O = Symbol.iterator;
  function ue(n) {
    return n === null || typeof n != "object" ? null : (n = O && n[O] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var ae = Object.assign, U;
  function oe(n) {
    if (U === void 0) try {
      throw Error();
    } catch (a) {
      var i = a.stack.trim().match(/\n( *(at )?)/);
      U = i && i[1] || "";
    }
    return `
` + U + n;
  }
  var Fe = !1;
  function K(n, i) {
    if (!n || Fe) return "";
    Fe = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (i) if (i = function() {
        throw Error();
      }, Object.defineProperty(i.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(i, []);
        } catch (re) {
          var c = re;
        }
        Reflect.construct(n, [], i);
      } else {
        try {
          i.call();
        } catch (re) {
          c = re;
        }
        n.call(i.prototype);
      }
      else {
        try {
          throw Error();
        } catch (re) {
          c = re;
        }
        n();
      }
    } catch (re) {
      if (re && c && typeof re.stack == "string") {
        for (var p = re.stack.split(`
`), g = c.stack.split(`
`), w = p.length - 1, N = g.length - 1; 1 <= w && 0 <= N && p[w] !== g[N]; ) N--;
        for (; 1 <= w && 0 <= N; w--, N--) if (p[w] !== g[N]) {
          if (w !== 1 || N !== 1)
            do
              if (w--, N--, 0 > N || p[w] !== g[N]) {
                var k = `
` + p[w].replace(" at new ", " at ");
                return n.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", n.displayName)), k;
              }
            while (1 <= w && 0 <= N);
          break;
        }
      }
    } finally {
      Fe = !1, Error.prepareStackTrace = a;
    }
    return (n = n ? n.displayName || n.name : "") ? oe(n) : "";
  }
  function ce(n) {
    switch (n.tag) {
      case 5:
        return oe(n.type);
      case 16:
        return oe("Lazy");
      case 13:
        return oe("Suspense");
      case 19:
        return oe("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = K(n.type, !1), n;
      case 11:
        return n = K(n.type.render, !1), n;
      case 1:
        return n = K(n.type, !0), n;
      default:
        return "";
    }
  }
  function pe(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case I:
        return "Fragment";
      case F:
        return "Portal";
      case ve:
        return "Profiler";
      case Y:
        return "StrictMode";
      case J:
        return "Suspense";
      case se:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case C:
        return (n.displayName || "Context") + ".Consumer";
      case T:
        return (n._context.displayName || "Context") + ".Provider";
      case te:
        var i = n.render;
        return n = n.displayName, n || (n = i.displayName || i.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case _e:
        return i = n.displayName || null, i !== null ? i : pe(n.type) || "Memo";
      case Z:
        i = n._payload, n = n._init;
        try {
          return pe(n(i));
        } catch {
        }
    }
    return null;
  }
  function Me(n) {
    var i = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (i.displayName || "Context") + ".Consumer";
      case 10:
        return (i._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = i.render, n = n.displayName || n.name || "", i.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return i;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return pe(i);
      case 8:
        return i === Y ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof i == "function") return i.displayName || i.name || null;
        if (typeof i == "string") return i;
    }
    return null;
  }
  function Re(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function Le(n) {
    var i = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (i === "checkbox" || i === "radio");
  }
  function Je(n) {
    var i = Le(n) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(n.constructor.prototype, i), c = "" + n[i];
    if (!n.hasOwnProperty(i) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var p = a.get, g = a.set;
      return Object.defineProperty(n, i, { configurable: !0, get: function() {
        return p.call(this);
      }, set: function(w) {
        c = "" + w, g.call(this, w);
      } }), Object.defineProperty(n, i, { enumerable: a.enumerable }), { getValue: function() {
        return c;
      }, setValue: function(w) {
        c = "" + w;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[i];
      } };
    }
  }
  function ft(n) {
    n._valueTracker || (n._valueTracker = Je(n));
  }
  function at(n) {
    if (!n) return !1;
    var i = n._valueTracker;
    if (!i) return !0;
    var a = i.getValue(), c = "";
    return n && (c = Le(n) ? n.checked ? "true" : "false" : n.value), n = c, n !== a ? (i.setValue(n), !0) : !1;
  }
  function B(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function qt(n, i) {
    var a = i.checked;
    return ae({}, i, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: a ?? n._wrapperState.initialChecked });
  }
  function ht(n, i) {
    var a = i.defaultValue == null ? "" : i.defaultValue, c = i.checked != null ? i.checked : i.defaultChecked;
    a = Re(i.value != null ? i.value : a), n._wrapperState = { initialChecked: c, initialValue: a, controlled: i.type === "checkbox" || i.type === "radio" ? i.checked != null : i.value != null };
  }
  function ct(n, i) {
    i = i.checked, i != null && R(n, "checked", i, !1);
  }
  function Ze(n, i) {
    ct(n, i);
    var a = Re(i.value), c = i.type;
    if (a != null) c === "number" ? (a === 0 && n.value === "" || n.value != a) && (n.value = "" + a) : n.value !== "" + a && (n.value = "" + a);
    else if (c === "submit" || c === "reset") {
      n.removeAttribute("value");
      return;
    }
    i.hasOwnProperty("value") ? ke(n, i.type, a) : i.hasOwnProperty("defaultValue") && ke(n, i.type, Re(i.defaultValue)), i.checked == null && i.defaultChecked != null && (n.defaultChecked = !!i.defaultChecked);
  }
  function Ce(n, i, a) {
    if (i.hasOwnProperty("value") || i.hasOwnProperty("defaultValue")) {
      var c = i.type;
      if (!(c !== "submit" && c !== "reset" || i.value !== void 0 && i.value !== null)) return;
      i = "" + n._wrapperState.initialValue, a || i === n.value || (n.value = i), n.defaultValue = i;
    }
    a = n.name, a !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, a !== "" && (n.name = a);
  }
  function ke(n, i, a) {
    (i !== "number" || B(n.ownerDocument) !== n) && (a == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + a && (n.defaultValue = "" + a));
  }
  var P = Array.isArray;
  function b(n, i, a, c) {
    if (n = n.options, i) {
      i = {};
      for (var p = 0; p < a.length; p++) i["$" + a[p]] = !0;
      for (a = 0; a < n.length; a++) p = i.hasOwnProperty("$" + n[a].value), n[a].selected !== p && (n[a].selected = p), p && c && (n[a].defaultSelected = !0);
    } else {
      for (a = "" + Re(a), i = null, p = 0; p < n.length; p++) {
        if (n[p].value === a) {
          n[p].selected = !0, c && (n[p].defaultSelected = !0);
          return;
        }
        i !== null || n[p].disabled || (i = n[p]);
      }
      i !== null && (i.selected = !0);
    }
  }
  function $(n, i) {
    if (i.dangerouslySetInnerHTML != null) throw Error(t(91));
    return ae({}, i, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function fe(n, i) {
    var a = i.value;
    if (a == null) {
      if (a = i.children, i = i.defaultValue, a != null) {
        if (i != null) throw Error(t(92));
        if (P(a)) {
          if (1 < a.length) throw Error(t(93));
          a = a[0];
        }
        i = a;
      }
      i == null && (i = ""), a = i;
    }
    n._wrapperState = { initialValue: Re(a) };
  }
  function xe(n, i) {
    var a = Re(i.value), c = Re(i.defaultValue);
    a != null && (a = "" + a, a !== n.value && (n.value = a), i.defaultValue == null && n.defaultValue !== a && (n.defaultValue = a)), c != null && (n.defaultValue = "" + c);
  }
  function de(n) {
    var i = n.textContent;
    i === n._wrapperState.initialValue && i !== "" && i !== null && (n.value = i);
  }
  function Xe(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Pe(n, i) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Xe(i) : n === "http://www.w3.org/2000/svg" && i === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var Oe, vt = (function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(i, a, c, p) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(i, a, c, p);
      });
    } : n;
  })(function(n, i) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = i;
    else {
      for (Oe = Oe || document.createElement("div"), Oe.innerHTML = "<svg>" + i.valueOf().toString() + "</svg>", i = Oe.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; i.firstChild; ) n.appendChild(i.firstChild);
    }
  });
  function we(n, i) {
    if (i) {
      var a = n.firstChild;
      if (a && a === n.lastChild && a.nodeType === 3) {
        a.nodeValue = i;
        return;
      }
    }
    n.textContent = i;
  }
  var Ue = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, rt = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Ue).forEach(function(n) {
    rt.forEach(function(i) {
      i = i + n.charAt(0).toUpperCase() + n.substring(1), Ue[i] = Ue[n];
    });
  });
  function it(n, i, a) {
    return i == null || typeof i == "boolean" || i === "" ? "" : a || typeof i != "number" || i === 0 || Ue.hasOwnProperty(n) && Ue[n] ? ("" + i).trim() : i + "px";
  }
  function H(n, i) {
    n = n.style;
    for (var a in i) if (i.hasOwnProperty(a)) {
      var c = a.indexOf("--") === 0, p = it(a, i[a], c);
      a === "float" && (a = "cssFloat"), c ? n.setProperty(a, p) : n[a] = p;
    }
  }
  var me = ae({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function $e(n, i) {
    if (i) {
      if (me[n] && (i.children != null || i.dangerouslySetInnerHTML != null)) throw Error(t(137, n));
      if (i.dangerouslySetInnerHTML != null) {
        if (i.children != null) throw Error(t(60));
        if (typeof i.dangerouslySetInnerHTML != "object" || !("__html" in i.dangerouslySetInnerHTML)) throw Error(t(61));
      }
      if (i.style != null && typeof i.style != "object") throw Error(t(62));
    }
  }
  function pt(n, i) {
    if (n.indexOf("-") === -1) return typeof i.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var V = null;
  function Ie(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var le = null, ge = null, De = null;
  function ze(n) {
    if (n = Ho(n)) {
      if (typeof le != "function") throw Error(t(280));
      var i = n.stateNode;
      i && (i = Ba(i), le(n.stateNode, n.type, i));
    }
  }
  function _t(n) {
    ge ? De ? De.push(n) : De = [n] : ge = n;
  }
  function zt() {
    if (ge) {
      var n = ge, i = De;
      if (De = ge = null, ze(n), i) for (n = 0; n < i.length; n++) ze(i[n]);
    }
  }
  function cn(n, i) {
    return n(i);
  }
  function xt() {
  }
  var nn = !1;
  function Zn(n, i, a) {
    if (nn) return n(i, a);
    nn = !0;
    try {
      return cn(n, i, a);
    } finally {
      nn = !1, (ge !== null || De !== null) && (xt(), zt());
    }
  }
  function er(n, i) {
    var a = n.stateNode;
    if (a === null) return null;
    var c = Ba(a);
    if (c === null) return null;
    a = c[i];
    e: switch (i) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (c = !c.disabled) || (n = n.type, c = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !c;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (a && typeof a != "function") throw Error(t(231, i, typeof a));
    return a;
  }
  var us = !1;
  if (d) try {
    var Hn = {};
    Object.defineProperty(Hn, "passive", { get: function() {
      us = !0;
    } }), window.addEventListener("test", Hn, Hn), window.removeEventListener("test", Hn, Hn);
  } catch {
    us = !1;
  }
  function Mo(n, i, a, c, p, g, w, N, k) {
    var re = Array.prototype.slice.call(arguments, 3);
    try {
      i.apply(a, re);
    } catch (Se) {
      this.onError(Se);
    }
  }
  var tr = !1, Ir = null, Li = !1, ds = null, fs = { onError: function(n) {
    tr = !0, Ir = n;
  } };
  function ya(n, i, a, c, p, g, w, N, k) {
    tr = !1, Ir = null, Mo.apply(fs, arguments);
  }
  function Sa(n, i, a, c, p, g, w, N, k) {
    if (ya.apply(this, arguments), tr) {
      if (tr) {
        var re = Ir;
        tr = !1, Ir = null;
      } else throw Error(t(198));
      Li || (Li = !0, ds = re);
    }
  }
  function Di(n) {
    var i = n, a = n;
    if (n.alternate) for (; i.return; ) i = i.return;
    else {
      n = i;
      do
        i = n, (i.flags & 4098) !== 0 && (a = i.return), n = i.return;
      while (n);
    }
    return i.tag === 3 ? a : null;
  }
  function Ma(n) {
    if (n.tag === 13) {
      var i = n.memoizedState;
      if (i === null && (n = n.alternate, n !== null && (i = n.memoizedState)), i !== null) return i.dehydrated;
    }
    return null;
  }
  function Ea(n) {
    if (Di(n) !== n) throw Error(t(188));
  }
  function A(n) {
    var i = n.alternate;
    if (!i) {
      if (i = Di(n), i === null) throw Error(t(188));
      return i !== n ? null : n;
    }
    for (var a = n, c = i; ; ) {
      var p = a.return;
      if (p === null) break;
      var g = p.alternate;
      if (g === null) {
        if (c = p.return, c !== null) {
          a = c;
          continue;
        }
        break;
      }
      if (p.child === g.child) {
        for (g = p.child; g; ) {
          if (g === a) return Ea(p), n;
          if (g === c) return Ea(p), i;
          g = g.sibling;
        }
        throw Error(t(188));
      }
      if (a.return !== c.return) a = p, c = g;
      else {
        for (var w = !1, N = p.child; N; ) {
          if (N === a) {
            w = !0, a = p, c = g;
            break;
          }
          if (N === c) {
            w = !0, c = p, a = g;
            break;
          }
          N = N.sibling;
        }
        if (!w) {
          for (N = g.child; N; ) {
            if (N === a) {
              w = !0, a = g, c = p;
              break;
            }
            if (N === c) {
              w = !0, c = g, a = p;
              break;
            }
            N = N.sibling;
          }
          if (!w) throw Error(t(189));
        }
      }
      if (a.alternate !== c) throw Error(t(190));
    }
    if (a.tag !== 3) throw Error(t(188));
    return a.stateNode.current === a ? n : i;
  }
  function X(n) {
    return n = A(n), n !== null ? ne(n) : null;
  }
  function ne(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var i = ne(n);
      if (i !== null) return i;
      n = n.sibling;
    }
    return null;
  }
  var ie = e.unstable_scheduleCallback, j = e.unstable_cancelCallback, be = e.unstable_shouldYield, Be = e.unstable_requestPaint, Ae = e.unstable_now, Ye = e.unstable_getCurrentPriorityLevel, nt = e.unstable_ImmediatePriority, st = e.unstable_UserBlockingPriority, qe = e.unstable_NormalPriority, wt = e.unstable_LowPriority, Pt = e.unstable_IdlePriority, Dt = null, Ot = null;
  function St(n) {
    if (Ot && typeof Ot.onCommitFiberRoot == "function") try {
      Ot.onCommitFiberRoot(Dt, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Ve = Math.clz32 ? Math.clz32 : Vn, $t = Math.log, Mt = Math.LN2;
  function Vn(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - ($t(n) / Mt | 0) | 0;
  }
  var li = 64, rn = 4194304;
  function Ni(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function Nt(n, i) {
    var a = n.pendingLanes;
    if (a === 0) return 0;
    var c = 0, p = n.suspendedLanes, g = n.pingedLanes, w = a & 268435455;
    if (w !== 0) {
      var N = w & ~p;
      N !== 0 ? c = Ni(N) : (g &= w, g !== 0 && (c = Ni(g)));
    } else w = a & ~p, w !== 0 ? c = Ni(w) : g !== 0 && (c = Ni(g));
    if (c === 0) return 0;
    if (i !== 0 && i !== c && (i & p) === 0 && (p = c & -c, g = i & -i, p >= g || p === 16 && (g & 4194240) !== 0)) return i;
    if ((c & 4) !== 0 && (c |= a & 16), i = n.entangledLanes, i !== 0) for (n = n.entanglements, i &= c; 0 < i; ) a = 31 - Ve(i), p = 1 << a, c |= n[a], i &= ~p;
    return c;
  }
  function Mi(n, i) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return i + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return i + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Eo(n, i) {
    for (var a = n.suspendedLanes, c = n.pingedLanes, p = n.expirationTimes, g = n.pendingLanes; 0 < g; ) {
      var w = 31 - Ve(g), N = 1 << w, k = p[w];
      k === -1 ? ((N & a) === 0 || (N & c) !== 0) && (p[w] = Mi(N, i)) : k <= i && (n.expiredLanes |= N), g &= ~N;
    }
  }
  function hn(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function hs() {
    var n = li;
    return li <<= 1, (li & 4194240) === 0 && (li = 64), n;
  }
  function wo(n) {
    for (var i = [], a = 0; 31 > a; a++) i.push(n);
    return i;
  }
  function nr(n, i, a) {
    n.pendingLanes |= i, i !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, i = 31 - Ve(i), n[i] = a;
  }
  function wg(n, i) {
    var a = n.pendingLanes & ~i;
    n.pendingLanes = i, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= i, n.mutableReadLanes &= i, n.entangledLanes &= i, i = n.entanglements;
    var c = n.eventTimes;
    for (n = n.expirationTimes; 0 < a; ) {
      var p = 31 - Ve(a), g = 1 << p;
      i[p] = 0, c[p] = -1, n[p] = -1, a &= ~g;
    }
  }
  function vc(n, i) {
    var a = n.entangledLanes |= i;
    for (n = n.entanglements; a; ) {
      var c = 31 - Ve(a), p = 1 << c;
      p & i | n[c] & i && (n[c] |= i), a &= ~p;
    }
  }
  var bt = 0;
  function jf(n) {
    return n &= -n, 1 < n ? 4 < n ? (n & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Yf, _c, qf, $f, Kf, xc = !1, wa = [], ir = null, rr = null, sr = null, To = /* @__PURE__ */ new Map(), bo = /* @__PURE__ */ new Map(), or = [], Tg = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Zf(n, i) {
    switch (n) {
      case "focusin":
      case "focusout":
        ir = null;
        break;
      case "dragenter":
      case "dragleave":
        rr = null;
        break;
      case "mouseover":
      case "mouseout":
        sr = null;
        break;
      case "pointerover":
      case "pointerout":
        To.delete(i.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        bo.delete(i.pointerId);
    }
  }
  function Ao(n, i, a, c, p, g) {
    return n === null || n.nativeEvent !== g ? (n = { blockedOn: i, domEventName: a, eventSystemFlags: c, nativeEvent: g, targetContainers: [p] }, i !== null && (i = Ho(i), i !== null && _c(i)), n) : (n.eventSystemFlags |= c, i = n.targetContainers, p !== null && i.indexOf(p) === -1 && i.push(p), n);
  }
  function bg(n, i, a, c, p) {
    switch (i) {
      case "focusin":
        return ir = Ao(ir, n, i, a, c, p), !0;
      case "dragenter":
        return rr = Ao(rr, n, i, a, c, p), !0;
      case "mouseover":
        return sr = Ao(sr, n, i, a, c, p), !0;
      case "pointerover":
        var g = p.pointerId;
        return To.set(g, Ao(To.get(g) || null, n, i, a, c, p)), !0;
      case "gotpointercapture":
        return g = p.pointerId, bo.set(g, Ao(bo.get(g) || null, n, i, a, c, p)), !0;
    }
    return !1;
  }
  function Qf(n) {
    var i = Ur(n.target);
    if (i !== null) {
      var a = Di(i);
      if (a !== null) {
        if (i = a.tag, i === 13) {
          if (i = Ma(a), i !== null) {
            n.blockedOn = i, Kf(n.priority, function() {
              qf(a);
            });
            return;
          }
        } else if (i === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function Ta(n) {
    if (n.blockedOn !== null) return !1;
    for (var i = n.targetContainers; 0 < i.length; ) {
      var a = Sc(n.domEventName, n.eventSystemFlags, i[0], n.nativeEvent);
      if (a === null) {
        a = n.nativeEvent;
        var c = new a.constructor(a.type, a);
        V = c, a.target.dispatchEvent(c), V = null;
      } else return i = Ho(a), i !== null && _c(i), n.blockedOn = a, !1;
      i.shift();
    }
    return !0;
  }
  function Jf(n, i, a) {
    Ta(n) && a.delete(i);
  }
  function Ag() {
    xc = !1, ir !== null && Ta(ir) && (ir = null), rr !== null && Ta(rr) && (rr = null), sr !== null && Ta(sr) && (sr = null), To.forEach(Jf), bo.forEach(Jf);
  }
  function Co(n, i) {
    n.blockedOn === i && (n.blockedOn = null, xc || (xc = !0, e.unstable_scheduleCallback(e.unstable_NormalPriority, Ag)));
  }
  function Ro(n) {
    function i(p) {
      return Co(p, n);
    }
    if (0 < wa.length) {
      Co(wa[0], n);
      for (var a = 1; a < wa.length; a++) {
        var c = wa[a];
        c.blockedOn === n && (c.blockedOn = null);
      }
    }
    for (ir !== null && Co(ir, n), rr !== null && Co(rr, n), sr !== null && Co(sr, n), To.forEach(i), bo.forEach(i), a = 0; a < or.length; a++) c = or[a], c.blockedOn === n && (c.blockedOn = null);
    for (; 0 < or.length && (a = or[0], a.blockedOn === null); ) Qf(a), a.blockedOn === null && or.shift();
  }
  var ps = D.ReactCurrentBatchConfig, ba = !0;
  function Cg(n, i, a, c) {
    var p = bt, g = ps.transition;
    ps.transition = null;
    try {
      bt = 1, yc(n, i, a, c);
    } finally {
      bt = p, ps.transition = g;
    }
  }
  function Rg(n, i, a, c) {
    var p = bt, g = ps.transition;
    ps.transition = null;
    try {
      bt = 4, yc(n, i, a, c);
    } finally {
      bt = p, ps.transition = g;
    }
  }
  function yc(n, i, a, c) {
    if (ba) {
      var p = Sc(n, i, a, c);
      if (p === null) Oc(n, i, c, Aa, a), Zf(n, c);
      else if (bg(p, n, i, a, c)) c.stopPropagation();
      else if (Zf(n, c), i & 4 && -1 < Tg.indexOf(n)) {
        for (; p !== null; ) {
          var g = Ho(p);
          if (g !== null && Yf(g), g = Sc(n, i, a, c), g === null && Oc(n, i, c, Aa, a), g === p) break;
          p = g;
        }
        p !== null && c.stopPropagation();
      } else Oc(n, i, c, null, a);
    }
  }
  var Aa = null;
  function Sc(n, i, a, c) {
    if (Aa = null, n = Ie(c), n = Ur(n), n !== null) if (i = Di(n), i === null) n = null;
    else if (a = i.tag, a === 13) {
      if (n = Ma(i), n !== null) return n;
      n = null;
    } else if (a === 3) {
      if (i.stateNode.current.memoizedState.isDehydrated) return i.tag === 3 ? i.stateNode.containerInfo : null;
      n = null;
    } else i !== n && (n = null);
    return Aa = n, null;
  }
  function eh(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (Ye()) {
          case nt:
            return 1;
          case st:
            return 4;
          case qe:
          case wt:
            return 16;
          case Pt:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var ar = null, Mc = null, Ca = null;
  function th() {
    if (Ca) return Ca;
    var n, i = Mc, a = i.length, c, p = "value" in ar ? ar.value : ar.textContent, g = p.length;
    for (n = 0; n < a && i[n] === p[n]; n++) ;
    var w = a - n;
    for (c = 1; c <= w && i[a - c] === p[g - c]; c++) ;
    return Ca = p.slice(n, 1 < c ? 1 - c : void 0);
  }
  function Ra(n) {
    var i = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && i === 13 && (n = 13)) : n = i, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function Pa() {
    return !0;
  }
  function nh() {
    return !1;
  }
  function Gn(n) {
    function i(a, c, p, g, w) {
      this._reactName = a, this._targetInst = p, this.type = c, this.nativeEvent = g, this.target = w, this.currentTarget = null;
      for (var N in n) n.hasOwnProperty(N) && (a = n[N], this[N] = a ? a(g) : g[N]);
      return this.isDefaultPrevented = (g.defaultPrevented != null ? g.defaultPrevented : g.returnValue === !1) ? Pa : nh, this.isPropagationStopped = nh, this;
    }
    return ae(i.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var a = this.nativeEvent;
      a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Pa);
    }, stopPropagation: function() {
      var a = this.nativeEvent;
      a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Pa);
    }, persist: function() {
    }, isPersistent: Pa }), i;
  }
  var ms = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Ec = Gn(ms), Po = ae({}, ms, { view: 0, detail: 0 }), Pg = Gn(Po), wc, Tc, Lo, La = ae({}, Po, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Ac, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== Lo && (Lo && n.type === "mousemove" ? (wc = n.screenX - Lo.screenX, Tc = n.screenY - Lo.screenY) : Tc = wc = 0, Lo = n), wc);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : Tc;
  } }), ih = Gn(La), Lg = ae({}, La, { dataTransfer: 0 }), Dg = Gn(Lg), Ng = ae({}, Po, { relatedTarget: 0 }), bc = Gn(Ng), Ig = ae({}, ms, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Ug = Gn(Ig), Fg = ae({}, ms, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), kg = Gn(Fg), Og = ae({}, ms, { data: 0 }), rh = Gn(Og), Bg = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, zg = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Hg = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Vg(n) {
    var i = this.nativeEvent;
    return i.getModifierState ? i.getModifierState(n) : (n = Hg[n]) ? !!i[n] : !1;
  }
  function Ac() {
    return Vg;
  }
  var Gg = ae({}, Po, { key: function(n) {
    if (n.key) {
      var i = Bg[n.key] || n.key;
      if (i !== "Unidentified") return i;
    }
    return n.type === "keypress" ? (n = Ra(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? zg[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Ac, charCode: function(n) {
    return n.type === "keypress" ? Ra(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? Ra(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), Wg = Gn(Gg), Xg = ae({}, La, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), sh = Gn(Xg), jg = ae({}, Po, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Ac }), Yg = Gn(jg), qg = ae({}, ms, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), $g = Gn(qg), Kg = ae({}, La, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Zg = Gn(Kg), Qg = [9, 13, 27, 32], Cc = d && "CompositionEvent" in window, Do = null;
  d && "documentMode" in document && (Do = document.documentMode);
  var Jg = d && "TextEvent" in window && !Do, oh = d && (!Cc || Do && 8 < Do && 11 >= Do), ah = " ", lh = !1;
  function ch(n, i) {
    switch (n) {
      case "keyup":
        return Qg.indexOf(i.keyCode) !== -1;
      case "keydown":
        return i.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function uh(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var gs = !1;
  function ev(n, i) {
    switch (n) {
      case "compositionend":
        return uh(i);
      case "keypress":
        return i.which !== 32 ? null : (lh = !0, ah);
      case "textInput":
        return n = i.data, n === ah && lh ? null : n;
      default:
        return null;
    }
  }
  function tv(n, i) {
    if (gs) return n === "compositionend" || !Cc && ch(n, i) ? (n = th(), Ca = Mc = ar = null, gs = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(i.ctrlKey || i.altKey || i.metaKey) || i.ctrlKey && i.altKey) {
          if (i.char && 1 < i.char.length) return i.char;
          if (i.which) return String.fromCharCode(i.which);
        }
        return null;
      case "compositionend":
        return oh && i.locale !== "ko" ? null : i.data;
      default:
        return null;
    }
  }
  var nv = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function dh(n) {
    var i = n && n.nodeName && n.nodeName.toLowerCase();
    return i === "input" ? !!nv[n.type] : i === "textarea";
  }
  function fh(n, i, a, c) {
    _t(c), i = Fa(i, "onChange"), 0 < i.length && (a = new Ec("onChange", "change", null, a, c), n.push({ event: a, listeners: i }));
  }
  var No = null, Io = null;
  function iv(n) {
    Ph(n, 0);
  }
  function Da(n) {
    var i = Ss(n);
    if (at(i)) return n;
  }
  function rv(n, i) {
    if (n === "change") return i;
  }
  var hh = !1;
  if (d) {
    var Rc;
    if (d) {
      var Pc = "oninput" in document;
      if (!Pc) {
        var ph = document.createElement("div");
        ph.setAttribute("oninput", "return;"), Pc = typeof ph.oninput == "function";
      }
      Rc = Pc;
    } else Rc = !1;
    hh = Rc && (!document.documentMode || 9 < document.documentMode);
  }
  function mh() {
    No && (No.detachEvent("onpropertychange", gh), Io = No = null);
  }
  function gh(n) {
    if (n.propertyName === "value" && Da(Io)) {
      var i = [];
      fh(i, Io, n, Ie(n)), Zn(iv, i);
    }
  }
  function sv(n, i, a) {
    n === "focusin" ? (mh(), No = i, Io = a, No.attachEvent("onpropertychange", gh)) : n === "focusout" && mh();
  }
  function ov(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return Da(Io);
  }
  function av(n, i) {
    if (n === "click") return Da(i);
  }
  function lv(n, i) {
    if (n === "input" || n === "change") return Da(i);
  }
  function cv(n, i) {
    return n === i && (n !== 0 || 1 / n === 1 / i) || n !== n && i !== i;
  }
  var ci = typeof Object.is == "function" ? Object.is : cv;
  function Uo(n, i) {
    if (ci(n, i)) return !0;
    if (typeof n != "object" || n === null || typeof i != "object" || i === null) return !1;
    var a = Object.keys(n), c = Object.keys(i);
    if (a.length !== c.length) return !1;
    for (c = 0; c < a.length; c++) {
      var p = a[c];
      if (!f.call(i, p) || !ci(n[p], i[p])) return !1;
    }
    return !0;
  }
  function vh(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function _h(n, i) {
    var a = vh(n);
    n = 0;
    for (var c; a; ) {
      if (a.nodeType === 3) {
        if (c = n + a.textContent.length, n <= i && c >= i) return { node: a, offset: i - n };
        n = c;
      }
      e: {
        for (; a; ) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break e;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = vh(a);
    }
  }
  function xh(n, i) {
    return n && i ? n === i ? !0 : n && n.nodeType === 3 ? !1 : i && i.nodeType === 3 ? xh(n, i.parentNode) : "contains" in n ? n.contains(i) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(i) & 16) : !1 : !1;
  }
  function yh() {
    for (var n = window, i = B(); i instanceof n.HTMLIFrameElement; ) {
      try {
        var a = typeof i.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) n = i.contentWindow;
      else break;
      i = B(n.document);
    }
    return i;
  }
  function Lc(n) {
    var i = n && n.nodeName && n.nodeName.toLowerCase();
    return i && (i === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || i === "textarea" || n.contentEditable === "true");
  }
  function uv(n) {
    var i = yh(), a = n.focusedElem, c = n.selectionRange;
    if (i !== a && a && a.ownerDocument && xh(a.ownerDocument.documentElement, a)) {
      if (c !== null && Lc(a)) {
        if (i = c.start, n = c.end, n === void 0 && (n = i), "selectionStart" in a) a.selectionStart = i, a.selectionEnd = Math.min(n, a.value.length);
        else if (n = (i = a.ownerDocument || document) && i.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var p = a.textContent.length, g = Math.min(c.start, p);
          c = c.end === void 0 ? g : Math.min(c.end, p), !n.extend && g > c && (p = c, c = g, g = p), p = _h(a, g);
          var w = _h(
            a,
            c
          );
          p && w && (n.rangeCount !== 1 || n.anchorNode !== p.node || n.anchorOffset !== p.offset || n.focusNode !== w.node || n.focusOffset !== w.offset) && (i = i.createRange(), i.setStart(p.node, p.offset), n.removeAllRanges(), g > c ? (n.addRange(i), n.extend(w.node, w.offset)) : (i.setEnd(w.node, w.offset), n.addRange(i)));
        }
      }
      for (i = [], n = a; n = n.parentNode; ) n.nodeType === 1 && i.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof a.focus == "function" && a.focus(), a = 0; a < i.length; a++) n = i[a], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var dv = d && "documentMode" in document && 11 >= document.documentMode, vs = null, Dc = null, Fo = null, Nc = !1;
  function Sh(n, i, a) {
    var c = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    Nc || vs == null || vs !== B(c) || (c = vs, "selectionStart" in c && Lc(c) ? c = { start: c.selectionStart, end: c.selectionEnd } : (c = (c.ownerDocument && c.ownerDocument.defaultView || window).getSelection(), c = { anchorNode: c.anchorNode, anchorOffset: c.anchorOffset, focusNode: c.focusNode, focusOffset: c.focusOffset }), Fo && Uo(Fo, c) || (Fo = c, c = Fa(Dc, "onSelect"), 0 < c.length && (i = new Ec("onSelect", "select", null, i, a), n.push({ event: i, listeners: c }), i.target = vs)));
  }
  function Na(n, i) {
    var a = {};
    return a[n.toLowerCase()] = i.toLowerCase(), a["Webkit" + n] = "webkit" + i, a["Moz" + n] = "moz" + i, a;
  }
  var _s = { animationend: Na("Animation", "AnimationEnd"), animationiteration: Na("Animation", "AnimationIteration"), animationstart: Na("Animation", "AnimationStart"), transitionend: Na("Transition", "TransitionEnd") }, Ic = {}, Mh = {};
  d && (Mh = document.createElement("div").style, "AnimationEvent" in window || (delete _s.animationend.animation, delete _s.animationiteration.animation, delete _s.animationstart.animation), "TransitionEvent" in window || delete _s.transitionend.transition);
  function Ia(n) {
    if (Ic[n]) return Ic[n];
    if (!_s[n]) return n;
    var i = _s[n], a;
    for (a in i) if (i.hasOwnProperty(a) && a in Mh) return Ic[n] = i[a];
    return n;
  }
  var Eh = Ia("animationend"), wh = Ia("animationiteration"), Th = Ia("animationstart"), bh = Ia("transitionend"), Ah = /* @__PURE__ */ new Map(), Ch = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function lr(n, i) {
    Ah.set(n, i), l(i, [n]);
  }
  for (var Uc = 0; Uc < Ch.length; Uc++) {
    var Fc = Ch[Uc], fv = Fc.toLowerCase(), hv = Fc[0].toUpperCase() + Fc.slice(1);
    lr(fv, "on" + hv);
  }
  lr(Eh, "onAnimationEnd"), lr(wh, "onAnimationIteration"), lr(Th, "onAnimationStart"), lr("dblclick", "onDoubleClick"), lr("focusin", "onFocus"), lr("focusout", "onBlur"), lr(bh, "onTransitionEnd"), u("onMouseEnter", ["mouseout", "mouseover"]), u("onMouseLeave", ["mouseout", "mouseover"]), u("onPointerEnter", ["pointerout", "pointerover"]), u("onPointerLeave", ["pointerout", "pointerover"]), l("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), l("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), l("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), l("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), l("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var ko = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), pv = new Set("cancel close invalid load scroll toggle".split(" ").concat(ko));
  function Rh(n, i, a) {
    var c = n.type || "unknown-event";
    n.currentTarget = a, Sa(c, i, void 0, n), n.currentTarget = null;
  }
  function Ph(n, i) {
    i = (i & 4) !== 0;
    for (var a = 0; a < n.length; a++) {
      var c = n[a], p = c.event;
      c = c.listeners;
      e: {
        var g = void 0;
        if (i) for (var w = c.length - 1; 0 <= w; w--) {
          var N = c[w], k = N.instance, re = N.currentTarget;
          if (N = N.listener, k !== g && p.isPropagationStopped()) break e;
          Rh(p, N, re), g = k;
        }
        else for (w = 0; w < c.length; w++) {
          if (N = c[w], k = N.instance, re = N.currentTarget, N = N.listener, k !== g && p.isPropagationStopped()) break e;
          Rh(p, N, re), g = k;
        }
      }
    }
    if (Li) throw n = ds, Li = !1, ds = null, n;
  }
  function Ft(n, i) {
    var a = i[Wc];
    a === void 0 && (a = i[Wc] = /* @__PURE__ */ new Set());
    var c = n + "__bubble";
    a.has(c) || (Lh(i, n, 2, !1), a.add(c));
  }
  function kc(n, i, a) {
    var c = 0;
    i && (c |= 4), Lh(a, n, c, i);
  }
  var Ua = "_reactListening" + Math.random().toString(36).slice(2);
  function Oo(n) {
    if (!n[Ua]) {
      n[Ua] = !0, r.forEach(function(a) {
        a !== "selectionchange" && (pv.has(a) || kc(a, !1, n), kc(a, !0, n));
      });
      var i = n.nodeType === 9 ? n : n.ownerDocument;
      i === null || i[Ua] || (i[Ua] = !0, kc("selectionchange", !1, i));
    }
  }
  function Lh(n, i, a, c) {
    switch (eh(i)) {
      case 1:
        var p = Cg;
        break;
      case 4:
        p = Rg;
        break;
      default:
        p = yc;
    }
    a = p.bind(null, i, a, n), p = void 0, !us || i !== "touchstart" && i !== "touchmove" && i !== "wheel" || (p = !0), c ? p !== void 0 ? n.addEventListener(i, a, { capture: !0, passive: p }) : n.addEventListener(i, a, !0) : p !== void 0 ? n.addEventListener(i, a, { passive: p }) : n.addEventListener(i, a, !1);
  }
  function Oc(n, i, a, c, p) {
    var g = c;
    if ((i & 1) === 0 && (i & 2) === 0 && c !== null) e: for (; ; ) {
      if (c === null) return;
      var w = c.tag;
      if (w === 3 || w === 4) {
        var N = c.stateNode.containerInfo;
        if (N === p || N.nodeType === 8 && N.parentNode === p) break;
        if (w === 4) for (w = c.return; w !== null; ) {
          var k = w.tag;
          if ((k === 3 || k === 4) && (k = w.stateNode.containerInfo, k === p || k.nodeType === 8 && k.parentNode === p)) return;
          w = w.return;
        }
        for (; N !== null; ) {
          if (w = Ur(N), w === null) return;
          if (k = w.tag, k === 5 || k === 6) {
            c = g = w;
            continue e;
          }
          N = N.parentNode;
        }
      }
      c = c.return;
    }
    Zn(function() {
      var re = g, Se = Ie(a), Ee = [];
      e: {
        var ye = Ah.get(n);
        if (ye !== void 0) {
          var He = Ec, We = n;
          switch (n) {
            case "keypress":
              if (Ra(a) === 0) break e;
            case "keydown":
            case "keyup":
              He = Wg;
              break;
            case "focusin":
              We = "focus", He = bc;
              break;
            case "focusout":
              We = "blur", He = bc;
              break;
            case "beforeblur":
            case "afterblur":
              He = bc;
              break;
            case "click":
              if (a.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              He = ih;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              He = Dg;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              He = Yg;
              break;
            case Eh:
            case wh:
            case Th:
              He = Ug;
              break;
            case bh:
              He = $g;
              break;
            case "scroll":
              He = Pg;
              break;
            case "wheel":
              He = Zg;
              break;
            case "copy":
            case "cut":
            case "paste":
              He = kg;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              He = sh;
          }
          var je = (i & 4) !== 0, Wt = !je && n === "scroll", q = je ? ye !== null ? ye + "Capture" : null : ye;
          je = [];
          for (var G = re, Q; G !== null; ) {
            Q = G;
            var Te = Q.stateNode;
            if (Q.tag === 5 && Te !== null && (Q = Te, q !== null && (Te = er(G, q), Te != null && je.push(Bo(G, Te, Q)))), Wt) break;
            G = G.return;
          }
          0 < je.length && (ye = new He(ye, We, null, a, Se), Ee.push({ event: ye, listeners: je }));
        }
      }
      if ((i & 7) === 0) {
        e: {
          if (ye = n === "mouseover" || n === "pointerover", He = n === "mouseout" || n === "pointerout", ye && a !== V && (We = a.relatedTarget || a.fromElement) && (Ur(We) || We[Ii])) break e;
          if ((He || ye) && (ye = Se.window === Se ? Se : (ye = Se.ownerDocument) ? ye.defaultView || ye.parentWindow : window, He ? (We = a.relatedTarget || a.toElement, He = re, We = We ? Ur(We) : null, We !== null && (Wt = Di(We), We !== Wt || We.tag !== 5 && We.tag !== 6) && (We = null)) : (He = null, We = re), He !== We)) {
            if (je = ih, Te = "onMouseLeave", q = "onMouseEnter", G = "mouse", (n === "pointerout" || n === "pointerover") && (je = sh, Te = "onPointerLeave", q = "onPointerEnter", G = "pointer"), Wt = He == null ? ye : Ss(He), Q = We == null ? ye : Ss(We), ye = new je(Te, G + "leave", He, a, Se), ye.target = Wt, ye.relatedTarget = Q, Te = null, Ur(Se) === re && (je = new je(q, G + "enter", We, a, Se), je.target = Q, je.relatedTarget = Wt, Te = je), Wt = Te, He && We) t: {
              for (je = He, q = We, G = 0, Q = je; Q; Q = xs(Q)) G++;
              for (Q = 0, Te = q; Te; Te = xs(Te)) Q++;
              for (; 0 < G - Q; ) je = xs(je), G--;
              for (; 0 < Q - G; ) q = xs(q), Q--;
              for (; G--; ) {
                if (je === q || q !== null && je === q.alternate) break t;
                je = xs(je), q = xs(q);
              }
              je = null;
            }
            else je = null;
            He !== null && Dh(Ee, ye, He, je, !1), We !== null && Wt !== null && Dh(Ee, Wt, We, je, !0);
          }
        }
        e: {
          if (ye = re ? Ss(re) : window, He = ye.nodeName && ye.nodeName.toLowerCase(), He === "select" || He === "input" && ye.type === "file") var Ke = rv;
          else if (dh(ye)) if (hh) Ke = lv;
          else {
            Ke = ov;
            var et = sv;
          }
          else (He = ye.nodeName) && He.toLowerCase() === "input" && (ye.type === "checkbox" || ye.type === "radio") && (Ke = av);
          if (Ke && (Ke = Ke(n, re))) {
            fh(Ee, Ke, a, Se);
            break e;
          }
          et && et(n, ye, re), n === "focusout" && (et = ye._wrapperState) && et.controlled && ye.type === "number" && ke(ye, "number", ye.value);
        }
        switch (et = re ? Ss(re) : window, n) {
          case "focusin":
            (dh(et) || et.contentEditable === "true") && (vs = et, Dc = re, Fo = null);
            break;
          case "focusout":
            Fo = Dc = vs = null;
            break;
          case "mousedown":
            Nc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Nc = !1, Sh(Ee, a, Se);
            break;
          case "selectionchange":
            if (dv) break;
          case "keydown":
          case "keyup":
            Sh(Ee, a, Se);
        }
        var tt;
        if (Cc) e: {
          switch (n) {
            case "compositionstart":
              var ot = "onCompositionStart";
              break e;
            case "compositionend":
              ot = "onCompositionEnd";
              break e;
            case "compositionupdate":
              ot = "onCompositionUpdate";
              break e;
          }
          ot = void 0;
        }
        else gs ? ch(n, a) && (ot = "onCompositionEnd") : n === "keydown" && a.keyCode === 229 && (ot = "onCompositionStart");
        ot && (oh && a.locale !== "ko" && (gs || ot !== "onCompositionStart" ? ot === "onCompositionEnd" && gs && (tt = th()) : (ar = Se, Mc = "value" in ar ? ar.value : ar.textContent, gs = !0)), et = Fa(re, ot), 0 < et.length && (ot = new rh(ot, n, null, a, Se), Ee.push({ event: ot, listeners: et }), tt ? ot.data = tt : (tt = uh(a), tt !== null && (ot.data = tt)))), (tt = Jg ? ev(n, a) : tv(n, a)) && (re = Fa(re, "onBeforeInput"), 0 < re.length && (Se = new rh("onBeforeInput", "beforeinput", null, a, Se), Ee.push({ event: Se, listeners: re }), Se.data = tt));
      }
      Ph(Ee, i);
    });
  }
  function Bo(n, i, a) {
    return { instance: n, listener: i, currentTarget: a };
  }
  function Fa(n, i) {
    for (var a = i + "Capture", c = []; n !== null; ) {
      var p = n, g = p.stateNode;
      p.tag === 5 && g !== null && (p = g, g = er(n, a), g != null && c.unshift(Bo(n, g, p)), g = er(n, i), g != null && c.push(Bo(n, g, p))), n = n.return;
    }
    return c;
  }
  function xs(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function Dh(n, i, a, c, p) {
    for (var g = i._reactName, w = []; a !== null && a !== c; ) {
      var N = a, k = N.alternate, re = N.stateNode;
      if (k !== null && k === c) break;
      N.tag === 5 && re !== null && (N = re, p ? (k = er(a, g), k != null && w.unshift(Bo(a, k, N))) : p || (k = er(a, g), k != null && w.push(Bo(a, k, N)))), a = a.return;
    }
    w.length !== 0 && n.push({ event: i, listeners: w });
  }
  var mv = /\r\n?/g, gv = /\u0000|\uFFFD/g;
  function Nh(n) {
    return (typeof n == "string" ? n : "" + n).replace(mv, `
`).replace(gv, "");
  }
  function ka(n, i, a) {
    if (i = Nh(i), Nh(n) !== i && a) throw Error(t(425));
  }
  function Oa() {
  }
  var Bc = null, zc = null;
  function Hc(n, i) {
    return n === "textarea" || n === "noscript" || typeof i.children == "string" || typeof i.children == "number" || typeof i.dangerouslySetInnerHTML == "object" && i.dangerouslySetInnerHTML !== null && i.dangerouslySetInnerHTML.__html != null;
  }
  var Vc = typeof setTimeout == "function" ? setTimeout : void 0, vv = typeof clearTimeout == "function" ? clearTimeout : void 0, Ih = typeof Promise == "function" ? Promise : void 0, _v = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ih < "u" ? function(n) {
    return Ih.resolve(null).then(n).catch(xv);
  } : Vc;
  function xv(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function Gc(n, i) {
    var a = i, c = 0;
    do {
      var p = a.nextSibling;
      if (n.removeChild(a), p && p.nodeType === 8) if (a = p.data, a === "/$") {
        if (c === 0) {
          n.removeChild(p), Ro(i);
          return;
        }
        c--;
      } else a !== "$" && a !== "$?" && a !== "$!" || c++;
      a = p;
    } while (a);
    Ro(i);
  }
  function cr(n) {
    for (; n != null; n = n.nextSibling) {
      var i = n.nodeType;
      if (i === 1 || i === 3) break;
      if (i === 8) {
        if (i = n.data, i === "$" || i === "$!" || i === "$?") break;
        if (i === "/$") return null;
      }
    }
    return n;
  }
  function Uh(n) {
    n = n.previousSibling;
    for (var i = 0; n; ) {
      if (n.nodeType === 8) {
        var a = n.data;
        if (a === "$" || a === "$!" || a === "$?") {
          if (i === 0) return n;
          i--;
        } else a === "/$" && i++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var ys = Math.random().toString(36).slice(2), Ei = "__reactFiber$" + ys, zo = "__reactProps$" + ys, Ii = "__reactContainer$" + ys, Wc = "__reactEvents$" + ys, yv = "__reactListeners$" + ys, Sv = "__reactHandles$" + ys;
  function Ur(n) {
    var i = n[Ei];
    if (i) return i;
    for (var a = n.parentNode; a; ) {
      if (i = a[Ii] || a[Ei]) {
        if (a = i.alternate, i.child !== null || a !== null && a.child !== null) for (n = Uh(n); n !== null; ) {
          if (a = n[Ei]) return a;
          n = Uh(n);
        }
        return i;
      }
      n = a, a = n.parentNode;
    }
    return null;
  }
  function Ho(n) {
    return n = n[Ei] || n[Ii], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function Ss(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(t(33));
  }
  function Ba(n) {
    return n[zo] || null;
  }
  var Xc = [], Ms = -1;
  function ur(n) {
    return { current: n };
  }
  function kt(n) {
    0 > Ms || (n.current = Xc[Ms], Xc[Ms] = null, Ms--);
  }
  function It(n, i) {
    Ms++, Xc[Ms] = n.current, n.current = i;
  }
  var dr = {}, pn = ur(dr), Dn = ur(!1), Fr = dr;
  function Es(n, i) {
    var a = n.type.contextTypes;
    if (!a) return dr;
    var c = n.stateNode;
    if (c && c.__reactInternalMemoizedUnmaskedChildContext === i) return c.__reactInternalMemoizedMaskedChildContext;
    var p = {}, g;
    for (g in a) p[g] = i[g];
    return c && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = i, n.__reactInternalMemoizedMaskedChildContext = p), p;
  }
  function Nn(n) {
    return n = n.childContextTypes, n != null;
  }
  function za() {
    kt(Dn), kt(pn);
  }
  function Fh(n, i, a) {
    if (pn.current !== dr) throw Error(t(168));
    It(pn, i), It(Dn, a);
  }
  function kh(n, i, a) {
    var c = n.stateNode;
    if (i = i.childContextTypes, typeof c.getChildContext != "function") return a;
    c = c.getChildContext();
    for (var p in c) if (!(p in i)) throw Error(t(108, Me(n) || "Unknown", p));
    return ae({}, a, c);
  }
  function Ha(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || dr, Fr = pn.current, It(pn, n), It(Dn, Dn.current), !0;
  }
  function Oh(n, i, a) {
    var c = n.stateNode;
    if (!c) throw Error(t(169));
    a ? (n = kh(n, i, Fr), c.__reactInternalMemoizedMergedChildContext = n, kt(Dn), kt(pn), It(pn, n)) : kt(Dn), It(Dn, a);
  }
  var Ui = null, Va = !1, jc = !1;
  function Bh(n) {
    Ui === null ? Ui = [n] : Ui.push(n);
  }
  function Mv(n) {
    Va = !0, Bh(n);
  }
  function fr() {
    if (!jc && Ui !== null) {
      jc = !0;
      var n = 0, i = bt;
      try {
        var a = Ui;
        for (bt = 1; n < a.length; n++) {
          var c = a[n];
          do
            c = c(!0);
          while (c !== null);
        }
        Ui = null, Va = !1;
      } catch (p) {
        throw Ui !== null && (Ui = Ui.slice(n + 1)), ie(nt, fr), p;
      } finally {
        bt = i, jc = !1;
      }
    }
    return null;
  }
  var ws = [], Ts = 0, Ga = null, Wa = 0, Qn = [], Jn = 0, kr = null, Fi = 1, ki = "";
  function Or(n, i) {
    ws[Ts++] = Wa, ws[Ts++] = Ga, Ga = n, Wa = i;
  }
  function zh(n, i, a) {
    Qn[Jn++] = Fi, Qn[Jn++] = ki, Qn[Jn++] = kr, kr = n;
    var c = Fi;
    n = ki;
    var p = 32 - Ve(c) - 1;
    c &= ~(1 << p), a += 1;
    var g = 32 - Ve(i) + p;
    if (30 < g) {
      var w = p - p % 5;
      g = (c & (1 << w) - 1).toString(32), c >>= w, p -= w, Fi = 1 << 32 - Ve(i) + p | a << p | c, ki = g + n;
    } else Fi = 1 << g | a << p | c, ki = n;
  }
  function Yc(n) {
    n.return !== null && (Or(n, 1), zh(n, 1, 0));
  }
  function qc(n) {
    for (; n === Ga; ) Ga = ws[--Ts], ws[Ts] = null, Wa = ws[--Ts], ws[Ts] = null;
    for (; n === kr; ) kr = Qn[--Jn], Qn[Jn] = null, ki = Qn[--Jn], Qn[Jn] = null, Fi = Qn[--Jn], Qn[Jn] = null;
  }
  var Wn = null, Xn = null, Bt = !1, ui = null;
  function Hh(n, i) {
    var a = ii(5, null, null, 0);
    a.elementType = "DELETED", a.stateNode = i, a.return = n, i = n.deletions, i === null ? (n.deletions = [a], n.flags |= 16) : i.push(a);
  }
  function Vh(n, i) {
    switch (n.tag) {
      case 5:
        var a = n.type;
        return i = i.nodeType !== 1 || a.toLowerCase() !== i.nodeName.toLowerCase() ? null : i, i !== null ? (n.stateNode = i, Wn = n, Xn = cr(i.firstChild), !0) : !1;
      case 6:
        return i = n.pendingProps === "" || i.nodeType !== 3 ? null : i, i !== null ? (n.stateNode = i, Wn = n, Xn = null, !0) : !1;
      case 13:
        return i = i.nodeType !== 8 ? null : i, i !== null ? (a = kr !== null ? { id: Fi, overflow: ki } : null, n.memoizedState = { dehydrated: i, treeContext: a, retryLane: 1073741824 }, a = ii(18, null, null, 0), a.stateNode = i, a.return = n, n.child = a, Wn = n, Xn = null, !0) : !1;
      default:
        return !1;
    }
  }
  function $c(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Kc(n) {
    if (Bt) {
      var i = Xn;
      if (i) {
        var a = i;
        if (!Vh(n, i)) {
          if ($c(n)) throw Error(t(418));
          i = cr(a.nextSibling);
          var c = Wn;
          i && Vh(n, i) ? Hh(c, a) : (n.flags = n.flags & -4097 | 2, Bt = !1, Wn = n);
        }
      } else {
        if ($c(n)) throw Error(t(418));
        n.flags = n.flags & -4097 | 2, Bt = !1, Wn = n;
      }
    }
  }
  function Gh(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    Wn = n;
  }
  function Xa(n) {
    if (n !== Wn) return !1;
    if (!Bt) return Gh(n), Bt = !0, !1;
    var i;
    if ((i = n.tag !== 3) && !(i = n.tag !== 5) && (i = n.type, i = i !== "head" && i !== "body" && !Hc(n.type, n.memoizedProps)), i && (i = Xn)) {
      if ($c(n)) throw Wh(), Error(t(418));
      for (; i; ) Hh(n, i), i = cr(i.nextSibling);
    }
    if (Gh(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(t(317));
      e: {
        for (n = n.nextSibling, i = 0; n; ) {
          if (n.nodeType === 8) {
            var a = n.data;
            if (a === "/$") {
              if (i === 0) {
                Xn = cr(n.nextSibling);
                break e;
              }
              i--;
            } else a !== "$" && a !== "$!" && a !== "$?" || i++;
          }
          n = n.nextSibling;
        }
        Xn = null;
      }
    } else Xn = Wn ? cr(n.stateNode.nextSibling) : null;
    return !0;
  }
  function Wh() {
    for (var n = Xn; n; ) n = cr(n.nextSibling);
  }
  function bs() {
    Xn = Wn = null, Bt = !1;
  }
  function Zc(n) {
    ui === null ? ui = [n] : ui.push(n);
  }
  var Ev = D.ReactCurrentBatchConfig;
  function Vo(n, i, a) {
    if (n = a.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (a._owner) {
        if (a = a._owner, a) {
          if (a.tag !== 1) throw Error(t(309));
          var c = a.stateNode;
        }
        if (!c) throw Error(t(147, n));
        var p = c, g = "" + n;
        return i !== null && i.ref !== null && typeof i.ref == "function" && i.ref._stringRef === g ? i.ref : (i = function(w) {
          var N = p.refs;
          w === null ? delete N[g] : N[g] = w;
        }, i._stringRef = g, i);
      }
      if (typeof n != "string") throw Error(t(284));
      if (!a._owner) throw Error(t(290, n));
    }
    return n;
  }
  function ja(n, i) {
    throw n = Object.prototype.toString.call(i), Error(t(31, n === "[object Object]" ? "object with keys {" + Object.keys(i).join(", ") + "}" : n));
  }
  function Xh(n) {
    var i = n._init;
    return i(n._payload);
  }
  function jh(n) {
    function i(q, G) {
      if (n) {
        var Q = q.deletions;
        Q === null ? (q.deletions = [G], q.flags |= 16) : Q.push(G);
      }
    }
    function a(q, G) {
      if (!n) return null;
      for (; G !== null; ) i(q, G), G = G.sibling;
      return null;
    }
    function c(q, G) {
      for (q = /* @__PURE__ */ new Map(); G !== null; ) G.key !== null ? q.set(G.key, G) : q.set(G.index, G), G = G.sibling;
      return q;
    }
    function p(q, G) {
      return q = yr(q, G), q.index = 0, q.sibling = null, q;
    }
    function g(q, G, Q) {
      return q.index = Q, n ? (Q = q.alternate, Q !== null ? (Q = Q.index, Q < G ? (q.flags |= 2, G) : Q) : (q.flags |= 2, G)) : (q.flags |= 1048576, G);
    }
    function w(q) {
      return n && q.alternate === null && (q.flags |= 2), q;
    }
    function N(q, G, Q, Te) {
      return G === null || G.tag !== 6 ? (G = Vu(Q, q.mode, Te), G.return = q, G) : (G = p(G, Q), G.return = q, G);
    }
    function k(q, G, Q, Te) {
      var Ke = Q.type;
      return Ke === I ? Se(q, G, Q.props.children, Te, Q.key) : G !== null && (G.elementType === Ke || typeof Ke == "object" && Ke !== null && Ke.$$typeof === Z && Xh(Ke) === G.type) ? (Te = p(G, Q.props), Te.ref = Vo(q, G, Q), Te.return = q, Te) : (Te = gl(Q.type, Q.key, Q.props, null, q.mode, Te), Te.ref = Vo(q, G, Q), Te.return = q, Te);
    }
    function re(q, G, Q, Te) {
      return G === null || G.tag !== 4 || G.stateNode.containerInfo !== Q.containerInfo || G.stateNode.implementation !== Q.implementation ? (G = Gu(Q, q.mode, Te), G.return = q, G) : (G = p(G, Q.children || []), G.return = q, G);
    }
    function Se(q, G, Q, Te, Ke) {
      return G === null || G.tag !== 7 ? (G = jr(Q, q.mode, Te, Ke), G.return = q, G) : (G = p(G, Q), G.return = q, G);
    }
    function Ee(q, G, Q) {
      if (typeof G == "string" && G !== "" || typeof G == "number") return G = Vu("" + G, q.mode, Q), G.return = q, G;
      if (typeof G == "object" && G !== null) {
        switch (G.$$typeof) {
          case ee:
            return Q = gl(G.type, G.key, G.props, null, q.mode, Q), Q.ref = Vo(q, null, G), Q.return = q, Q;
          case F:
            return G = Gu(G, q.mode, Q), G.return = q, G;
          case Z:
            var Te = G._init;
            return Ee(q, Te(G._payload), Q);
        }
        if (P(G) || ue(G)) return G = jr(G, q.mode, Q, null), G.return = q, G;
        ja(q, G);
      }
      return null;
    }
    function ye(q, G, Q, Te) {
      var Ke = G !== null ? G.key : null;
      if (typeof Q == "string" && Q !== "" || typeof Q == "number") return Ke !== null ? null : N(q, G, "" + Q, Te);
      if (typeof Q == "object" && Q !== null) {
        switch (Q.$$typeof) {
          case ee:
            return Q.key === Ke ? k(q, G, Q, Te) : null;
          case F:
            return Q.key === Ke ? re(q, G, Q, Te) : null;
          case Z:
            return Ke = Q._init, ye(
              q,
              G,
              Ke(Q._payload),
              Te
            );
        }
        if (P(Q) || ue(Q)) return Ke !== null ? null : Se(q, G, Q, Te, null);
        ja(q, Q);
      }
      return null;
    }
    function He(q, G, Q, Te, Ke) {
      if (typeof Te == "string" && Te !== "" || typeof Te == "number") return q = q.get(Q) || null, N(G, q, "" + Te, Ke);
      if (typeof Te == "object" && Te !== null) {
        switch (Te.$$typeof) {
          case ee:
            return q = q.get(Te.key === null ? Q : Te.key) || null, k(G, q, Te, Ke);
          case F:
            return q = q.get(Te.key === null ? Q : Te.key) || null, re(G, q, Te, Ke);
          case Z:
            var et = Te._init;
            return He(q, G, Q, et(Te._payload), Ke);
        }
        if (P(Te) || ue(Te)) return q = q.get(Q) || null, Se(G, q, Te, Ke, null);
        ja(G, Te);
      }
      return null;
    }
    function We(q, G, Q, Te) {
      for (var Ke = null, et = null, tt = G, ot = G = 0, an = null; tt !== null && ot < Q.length; ot++) {
        tt.index > ot ? (an = tt, tt = null) : an = tt.sibling;
        var Et = ye(q, tt, Q[ot], Te);
        if (Et === null) {
          tt === null && (tt = an);
          break;
        }
        n && tt && Et.alternate === null && i(q, tt), G = g(Et, G, ot), et === null ? Ke = Et : et.sibling = Et, et = Et, tt = an;
      }
      if (ot === Q.length) return a(q, tt), Bt && Or(q, ot), Ke;
      if (tt === null) {
        for (; ot < Q.length; ot++) tt = Ee(q, Q[ot], Te), tt !== null && (G = g(tt, G, ot), et === null ? Ke = tt : et.sibling = tt, et = tt);
        return Bt && Or(q, ot), Ke;
      }
      for (tt = c(q, tt); ot < Q.length; ot++) an = He(tt, q, ot, Q[ot], Te), an !== null && (n && an.alternate !== null && tt.delete(an.key === null ? ot : an.key), G = g(an, G, ot), et === null ? Ke = an : et.sibling = an, et = an);
      return n && tt.forEach(function(Sr) {
        return i(q, Sr);
      }), Bt && Or(q, ot), Ke;
    }
    function je(q, G, Q, Te) {
      var Ke = ue(Q);
      if (typeof Ke != "function") throw Error(t(150));
      if (Q = Ke.call(Q), Q == null) throw Error(t(151));
      for (var et = Ke = null, tt = G, ot = G = 0, an = null, Et = Q.next(); tt !== null && !Et.done; ot++, Et = Q.next()) {
        tt.index > ot ? (an = tt, tt = null) : an = tt.sibling;
        var Sr = ye(q, tt, Et.value, Te);
        if (Sr === null) {
          tt === null && (tt = an);
          break;
        }
        n && tt && Sr.alternate === null && i(q, tt), G = g(Sr, G, ot), et === null ? Ke = Sr : et.sibling = Sr, et = Sr, tt = an;
      }
      if (Et.done) return a(
        q,
        tt
      ), Bt && Or(q, ot), Ke;
      if (tt === null) {
        for (; !Et.done; ot++, Et = Q.next()) Et = Ee(q, Et.value, Te), Et !== null && (G = g(Et, G, ot), et === null ? Ke = Et : et.sibling = Et, et = Et);
        return Bt && Or(q, ot), Ke;
      }
      for (tt = c(q, tt); !Et.done; ot++, Et = Q.next()) Et = He(tt, q, ot, Et.value, Te), Et !== null && (n && Et.alternate !== null && tt.delete(Et.key === null ? ot : Et.key), G = g(Et, G, ot), et === null ? Ke = Et : et.sibling = Et, et = Et);
      return n && tt.forEach(function(n_) {
        return i(q, n_);
      }), Bt && Or(q, ot), Ke;
    }
    function Wt(q, G, Q, Te) {
      if (typeof Q == "object" && Q !== null && Q.type === I && Q.key === null && (Q = Q.props.children), typeof Q == "object" && Q !== null) {
        switch (Q.$$typeof) {
          case ee:
            e: {
              for (var Ke = Q.key, et = G; et !== null; ) {
                if (et.key === Ke) {
                  if (Ke = Q.type, Ke === I) {
                    if (et.tag === 7) {
                      a(q, et.sibling), G = p(et, Q.props.children), G.return = q, q = G;
                      break e;
                    }
                  } else if (et.elementType === Ke || typeof Ke == "object" && Ke !== null && Ke.$$typeof === Z && Xh(Ke) === et.type) {
                    a(q, et.sibling), G = p(et, Q.props), G.ref = Vo(q, et, Q), G.return = q, q = G;
                    break e;
                  }
                  a(q, et);
                  break;
                } else i(q, et);
                et = et.sibling;
              }
              Q.type === I ? (G = jr(Q.props.children, q.mode, Te, Q.key), G.return = q, q = G) : (Te = gl(Q.type, Q.key, Q.props, null, q.mode, Te), Te.ref = Vo(q, G, Q), Te.return = q, q = Te);
            }
            return w(q);
          case F:
            e: {
              for (et = Q.key; G !== null; ) {
                if (G.key === et) if (G.tag === 4 && G.stateNode.containerInfo === Q.containerInfo && G.stateNode.implementation === Q.implementation) {
                  a(q, G.sibling), G = p(G, Q.children || []), G.return = q, q = G;
                  break e;
                } else {
                  a(q, G);
                  break;
                }
                else i(q, G);
                G = G.sibling;
              }
              G = Gu(Q, q.mode, Te), G.return = q, q = G;
            }
            return w(q);
          case Z:
            return et = Q._init, Wt(q, G, et(Q._payload), Te);
        }
        if (P(Q)) return We(q, G, Q, Te);
        if (ue(Q)) return je(q, G, Q, Te);
        ja(q, Q);
      }
      return typeof Q == "string" && Q !== "" || typeof Q == "number" ? (Q = "" + Q, G !== null && G.tag === 6 ? (a(q, G.sibling), G = p(G, Q), G.return = q, q = G) : (a(q, G), G = Vu(Q, q.mode, Te), G.return = q, q = G), w(q)) : a(q, G);
    }
    return Wt;
  }
  var As = jh(!0), Yh = jh(!1), Ya = ur(null), qa = null, Cs = null, Qc = null;
  function Jc() {
    Qc = Cs = qa = null;
  }
  function eu(n) {
    var i = Ya.current;
    kt(Ya), n._currentValue = i;
  }
  function tu(n, i, a) {
    for (; n !== null; ) {
      var c = n.alternate;
      if ((n.childLanes & i) !== i ? (n.childLanes |= i, c !== null && (c.childLanes |= i)) : c !== null && (c.childLanes & i) !== i && (c.childLanes |= i), n === a) break;
      n = n.return;
    }
  }
  function Rs(n, i) {
    qa = n, Qc = Cs = null, n = n.dependencies, n !== null && n.firstContext !== null && ((n.lanes & i) !== 0 && (In = !0), n.firstContext = null);
  }
  function ei(n) {
    var i = n._currentValue;
    if (Qc !== n) if (n = { context: n, memoizedValue: i, next: null }, Cs === null) {
      if (qa === null) throw Error(t(308));
      Cs = n, qa.dependencies = { lanes: 0, firstContext: n };
    } else Cs = Cs.next = n;
    return i;
  }
  var Br = null;
  function nu(n) {
    Br === null ? Br = [n] : Br.push(n);
  }
  function qh(n, i, a, c) {
    var p = i.interleaved;
    return p === null ? (a.next = a, nu(i)) : (a.next = p.next, p.next = a), i.interleaved = a, Oi(n, c);
  }
  function Oi(n, i) {
    n.lanes |= i;
    var a = n.alternate;
    for (a !== null && (a.lanes |= i), a = n, n = n.return; n !== null; ) n.childLanes |= i, a = n.alternate, a !== null && (a.childLanes |= i), a = n, n = n.return;
    return a.tag === 3 ? a.stateNode : null;
  }
  var hr = !1;
  function iu(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function $h(n, i) {
    n = n.updateQueue, i.updateQueue === n && (i.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Bi(n, i) {
    return { eventTime: n, lane: i, tag: 0, payload: null, callback: null, next: null };
  }
  function pr(n, i, a) {
    var c = n.updateQueue;
    if (c === null) return null;
    if (c = c.shared, (yt & 2) !== 0) {
      var p = c.pending;
      return p === null ? i.next = i : (i.next = p.next, p.next = i), c.pending = i, Oi(n, a);
    }
    return p = c.interleaved, p === null ? (i.next = i, nu(c)) : (i.next = p.next, p.next = i), c.interleaved = i, Oi(n, a);
  }
  function $a(n, i, a) {
    if (i = i.updateQueue, i !== null && (i = i.shared, (a & 4194240) !== 0)) {
      var c = i.lanes;
      c &= n.pendingLanes, a |= c, i.lanes = a, vc(n, a);
    }
  }
  function Kh(n, i) {
    var a = n.updateQueue, c = n.alternate;
    if (c !== null && (c = c.updateQueue, a === c)) {
      var p = null, g = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var w = { eventTime: a.eventTime, lane: a.lane, tag: a.tag, payload: a.payload, callback: a.callback, next: null };
          g === null ? p = g = w : g = g.next = w, a = a.next;
        } while (a !== null);
        g === null ? p = g = i : g = g.next = i;
      } else p = g = i;
      a = { baseState: c.baseState, firstBaseUpdate: p, lastBaseUpdate: g, shared: c.shared, effects: c.effects }, n.updateQueue = a;
      return;
    }
    n = a.lastBaseUpdate, n === null ? a.firstBaseUpdate = i : n.next = i, a.lastBaseUpdate = i;
  }
  function Ka(n, i, a, c) {
    var p = n.updateQueue;
    hr = !1;
    var g = p.firstBaseUpdate, w = p.lastBaseUpdate, N = p.shared.pending;
    if (N !== null) {
      p.shared.pending = null;
      var k = N, re = k.next;
      k.next = null, w === null ? g = re : w.next = re, w = k;
      var Se = n.alternate;
      Se !== null && (Se = Se.updateQueue, N = Se.lastBaseUpdate, N !== w && (N === null ? Se.firstBaseUpdate = re : N.next = re, Se.lastBaseUpdate = k));
    }
    if (g !== null) {
      var Ee = p.baseState;
      w = 0, Se = re = k = null, N = g;
      do {
        var ye = N.lane, He = N.eventTime;
        if ((c & ye) === ye) {
          Se !== null && (Se = Se.next = {
            eventTime: He,
            lane: 0,
            tag: N.tag,
            payload: N.payload,
            callback: N.callback,
            next: null
          });
          e: {
            var We = n, je = N;
            switch (ye = i, He = a, je.tag) {
              case 1:
                if (We = je.payload, typeof We == "function") {
                  Ee = We.call(He, Ee, ye);
                  break e;
                }
                Ee = We;
                break e;
              case 3:
                We.flags = We.flags & -65537 | 128;
              case 0:
                if (We = je.payload, ye = typeof We == "function" ? We.call(He, Ee, ye) : We, ye == null) break e;
                Ee = ae({}, Ee, ye);
                break e;
              case 2:
                hr = !0;
            }
          }
          N.callback !== null && N.lane !== 0 && (n.flags |= 64, ye = p.effects, ye === null ? p.effects = [N] : ye.push(N));
        } else He = { eventTime: He, lane: ye, tag: N.tag, payload: N.payload, callback: N.callback, next: null }, Se === null ? (re = Se = He, k = Ee) : Se = Se.next = He, w |= ye;
        if (N = N.next, N === null) {
          if (N = p.shared.pending, N === null) break;
          ye = N, N = ye.next, ye.next = null, p.lastBaseUpdate = ye, p.shared.pending = null;
        }
      } while (!0);
      if (Se === null && (k = Ee), p.baseState = k, p.firstBaseUpdate = re, p.lastBaseUpdate = Se, i = p.shared.interleaved, i !== null) {
        p = i;
        do
          w |= p.lane, p = p.next;
        while (p !== i);
      } else g === null && (p.shared.lanes = 0);
      Vr |= w, n.lanes = w, n.memoizedState = Ee;
    }
  }
  function Zh(n, i, a) {
    if (n = i.effects, i.effects = null, n !== null) for (i = 0; i < n.length; i++) {
      var c = n[i], p = c.callback;
      if (p !== null) {
        if (c.callback = null, c = a, typeof p != "function") throw Error(t(191, p));
        p.call(c);
      }
    }
  }
  var Go = {}, wi = ur(Go), Wo = ur(Go), Xo = ur(Go);
  function zr(n) {
    if (n === Go) throw Error(t(174));
    return n;
  }
  function ru(n, i) {
    switch (It(Xo, i), It(Wo, n), It(wi, Go), n = i.nodeType, n) {
      case 9:
      case 11:
        i = (i = i.documentElement) ? i.namespaceURI : Pe(null, "");
        break;
      default:
        n = n === 8 ? i.parentNode : i, i = n.namespaceURI || null, n = n.tagName, i = Pe(i, n);
    }
    kt(wi), It(wi, i);
  }
  function Ps() {
    kt(wi), kt(Wo), kt(Xo);
  }
  function Qh(n) {
    zr(Xo.current);
    var i = zr(wi.current), a = Pe(i, n.type);
    i !== a && (It(Wo, n), It(wi, a));
  }
  function su(n) {
    Wo.current === n && (kt(wi), kt(Wo));
  }
  var Ht = ur(0);
  function Za(n) {
    for (var i = n; i !== null; ) {
      if (i.tag === 13) {
        var a = i.memoizedState;
        if (a !== null && (a = a.dehydrated, a === null || a.data === "$?" || a.data === "$!")) return i;
      } else if (i.tag === 19 && i.memoizedProps.revealOrder !== void 0) {
        if ((i.flags & 128) !== 0) return i;
      } else if (i.child !== null) {
        i.child.return = i, i = i.child;
        continue;
      }
      if (i === n) break;
      for (; i.sibling === null; ) {
        if (i.return === null || i.return === n) return null;
        i = i.return;
      }
      i.sibling.return = i.return, i = i.sibling;
    }
    return null;
  }
  var ou = [];
  function au() {
    for (var n = 0; n < ou.length; n++) ou[n]._workInProgressVersionPrimary = null;
    ou.length = 0;
  }
  var Qa = D.ReactCurrentDispatcher, lu = D.ReactCurrentBatchConfig, Hr = 0, Vt = null, Kt = null, sn = null, Ja = !1, jo = !1, Yo = 0, wv = 0;
  function mn() {
    throw Error(t(321));
  }
  function cu(n, i) {
    if (i === null) return !1;
    for (var a = 0; a < i.length && a < n.length; a++) if (!ci(n[a], i[a])) return !1;
    return !0;
  }
  function uu(n, i, a, c, p, g) {
    if (Hr = g, Vt = i, i.memoizedState = null, i.updateQueue = null, i.lanes = 0, Qa.current = n === null || n.memoizedState === null ? Cv : Rv, n = a(c, p), jo) {
      g = 0;
      do {
        if (jo = !1, Yo = 0, 25 <= g) throw Error(t(301));
        g += 1, sn = Kt = null, i.updateQueue = null, Qa.current = Pv, n = a(c, p);
      } while (jo);
    }
    if (Qa.current = nl, i = Kt !== null && Kt.next !== null, Hr = 0, sn = Kt = Vt = null, Ja = !1, i) throw Error(t(300));
    return n;
  }
  function du() {
    var n = Yo !== 0;
    return Yo = 0, n;
  }
  function Ti() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return sn === null ? Vt.memoizedState = sn = n : sn = sn.next = n, sn;
  }
  function ti() {
    if (Kt === null) {
      var n = Vt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = Kt.next;
    var i = sn === null ? Vt.memoizedState : sn.next;
    if (i !== null) sn = i, Kt = n;
    else {
      if (n === null) throw Error(t(310));
      Kt = n, n = { memoizedState: Kt.memoizedState, baseState: Kt.baseState, baseQueue: Kt.baseQueue, queue: Kt.queue, next: null }, sn === null ? Vt.memoizedState = sn = n : sn = sn.next = n;
    }
    return sn;
  }
  function qo(n, i) {
    return typeof i == "function" ? i(n) : i;
  }
  function fu(n) {
    var i = ti(), a = i.queue;
    if (a === null) throw Error(t(311));
    a.lastRenderedReducer = n;
    var c = Kt, p = c.baseQueue, g = a.pending;
    if (g !== null) {
      if (p !== null) {
        var w = p.next;
        p.next = g.next, g.next = w;
      }
      c.baseQueue = p = g, a.pending = null;
    }
    if (p !== null) {
      g = p.next, c = c.baseState;
      var N = w = null, k = null, re = g;
      do {
        var Se = re.lane;
        if ((Hr & Se) === Se) k !== null && (k = k.next = { lane: 0, action: re.action, hasEagerState: re.hasEagerState, eagerState: re.eagerState, next: null }), c = re.hasEagerState ? re.eagerState : n(c, re.action);
        else {
          var Ee = {
            lane: Se,
            action: re.action,
            hasEagerState: re.hasEagerState,
            eagerState: re.eagerState,
            next: null
          };
          k === null ? (N = k = Ee, w = c) : k = k.next = Ee, Vt.lanes |= Se, Vr |= Se;
        }
        re = re.next;
      } while (re !== null && re !== g);
      k === null ? w = c : k.next = N, ci(c, i.memoizedState) || (In = !0), i.memoizedState = c, i.baseState = w, i.baseQueue = k, a.lastRenderedState = c;
    }
    if (n = a.interleaved, n !== null) {
      p = n;
      do
        g = p.lane, Vt.lanes |= g, Vr |= g, p = p.next;
      while (p !== n);
    } else p === null && (a.lanes = 0);
    return [i.memoizedState, a.dispatch];
  }
  function hu(n) {
    var i = ti(), a = i.queue;
    if (a === null) throw Error(t(311));
    a.lastRenderedReducer = n;
    var c = a.dispatch, p = a.pending, g = i.memoizedState;
    if (p !== null) {
      a.pending = null;
      var w = p = p.next;
      do
        g = n(g, w.action), w = w.next;
      while (w !== p);
      ci(g, i.memoizedState) || (In = !0), i.memoizedState = g, i.baseQueue === null && (i.baseState = g), a.lastRenderedState = g;
    }
    return [g, c];
  }
  function Jh() {
  }
  function ep(n, i) {
    var a = Vt, c = ti(), p = i(), g = !ci(c.memoizedState, p);
    if (g && (c.memoizedState = p, In = !0), c = c.queue, pu(ip.bind(null, a, c, n), [n]), c.getSnapshot !== i || g || sn !== null && sn.memoizedState.tag & 1) {
      if (a.flags |= 2048, $o(9, np.bind(null, a, c, p, i), void 0, null), on === null) throw Error(t(349));
      (Hr & 30) !== 0 || tp(a, i, p);
    }
    return p;
  }
  function tp(n, i, a) {
    n.flags |= 16384, n = { getSnapshot: i, value: a }, i = Vt.updateQueue, i === null ? (i = { lastEffect: null, stores: null }, Vt.updateQueue = i, i.stores = [n]) : (a = i.stores, a === null ? i.stores = [n] : a.push(n));
  }
  function np(n, i, a, c) {
    i.value = a, i.getSnapshot = c, rp(i) && sp(n);
  }
  function ip(n, i, a) {
    return a(function() {
      rp(i) && sp(n);
    });
  }
  function rp(n) {
    var i = n.getSnapshot;
    n = n.value;
    try {
      var a = i();
      return !ci(n, a);
    } catch {
      return !0;
    }
  }
  function sp(n) {
    var i = Oi(n, 1);
    i !== null && pi(i, n, 1, -1);
  }
  function op(n) {
    var i = Ti();
    return typeof n == "function" && (n = n()), i.memoizedState = i.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: qo, lastRenderedState: n }, i.queue = n, n = n.dispatch = Av.bind(null, Vt, n), [i.memoizedState, n];
  }
  function $o(n, i, a, c) {
    return n = { tag: n, create: i, destroy: a, deps: c, next: null }, i = Vt.updateQueue, i === null ? (i = { lastEffect: null, stores: null }, Vt.updateQueue = i, i.lastEffect = n.next = n) : (a = i.lastEffect, a === null ? i.lastEffect = n.next = n : (c = a.next, a.next = n, n.next = c, i.lastEffect = n)), n;
  }
  function ap() {
    return ti().memoizedState;
  }
  function el(n, i, a, c) {
    var p = Ti();
    Vt.flags |= n, p.memoizedState = $o(1 | i, a, void 0, c === void 0 ? null : c);
  }
  function tl(n, i, a, c) {
    var p = ti();
    c = c === void 0 ? null : c;
    var g = void 0;
    if (Kt !== null) {
      var w = Kt.memoizedState;
      if (g = w.destroy, c !== null && cu(c, w.deps)) {
        p.memoizedState = $o(i, a, g, c);
        return;
      }
    }
    Vt.flags |= n, p.memoizedState = $o(1 | i, a, g, c);
  }
  function lp(n, i) {
    return el(8390656, 8, n, i);
  }
  function pu(n, i) {
    return tl(2048, 8, n, i);
  }
  function cp(n, i) {
    return tl(4, 2, n, i);
  }
  function up(n, i) {
    return tl(4, 4, n, i);
  }
  function dp(n, i) {
    if (typeof i == "function") return n = n(), i(n), function() {
      i(null);
    };
    if (i != null) return n = n(), i.current = n, function() {
      i.current = null;
    };
  }
  function fp(n, i, a) {
    return a = a != null ? a.concat([n]) : null, tl(4, 4, dp.bind(null, i, n), a);
  }
  function mu() {
  }
  function hp(n, i) {
    var a = ti();
    i = i === void 0 ? null : i;
    var c = a.memoizedState;
    return c !== null && i !== null && cu(i, c[1]) ? c[0] : (a.memoizedState = [n, i], n);
  }
  function pp(n, i) {
    var a = ti();
    i = i === void 0 ? null : i;
    var c = a.memoizedState;
    return c !== null && i !== null && cu(i, c[1]) ? c[0] : (n = n(), a.memoizedState = [n, i], n);
  }
  function mp(n, i, a) {
    return (Hr & 21) === 0 ? (n.baseState && (n.baseState = !1, In = !0), n.memoizedState = a) : (ci(a, i) || (a = hs(), Vt.lanes |= a, Vr |= a, n.baseState = !0), i);
  }
  function Tv(n, i) {
    var a = bt;
    bt = a !== 0 && 4 > a ? a : 4, n(!0);
    var c = lu.transition;
    lu.transition = {};
    try {
      n(!1), i();
    } finally {
      bt = a, lu.transition = c;
    }
  }
  function gp() {
    return ti().memoizedState;
  }
  function bv(n, i, a) {
    var c = _r(n);
    if (a = { lane: c, action: a, hasEagerState: !1, eagerState: null, next: null }, vp(n)) _p(i, a);
    else if (a = qh(n, i, a, c), a !== null) {
      var p = wn();
      pi(a, n, c, p), xp(a, i, c);
    }
  }
  function Av(n, i, a) {
    var c = _r(n), p = { lane: c, action: a, hasEagerState: !1, eagerState: null, next: null };
    if (vp(n)) _p(i, p);
    else {
      var g = n.alternate;
      if (n.lanes === 0 && (g === null || g.lanes === 0) && (g = i.lastRenderedReducer, g !== null)) try {
        var w = i.lastRenderedState, N = g(w, a);
        if (p.hasEagerState = !0, p.eagerState = N, ci(N, w)) {
          var k = i.interleaved;
          k === null ? (p.next = p, nu(i)) : (p.next = k.next, k.next = p), i.interleaved = p;
          return;
        }
      } catch {
      }
      a = qh(n, i, p, c), a !== null && (p = wn(), pi(a, n, c, p), xp(a, i, c));
    }
  }
  function vp(n) {
    var i = n.alternate;
    return n === Vt || i !== null && i === Vt;
  }
  function _p(n, i) {
    jo = Ja = !0;
    var a = n.pending;
    a === null ? i.next = i : (i.next = a.next, a.next = i), n.pending = i;
  }
  function xp(n, i, a) {
    if ((a & 4194240) !== 0) {
      var c = i.lanes;
      c &= n.pendingLanes, a |= c, i.lanes = a, vc(n, a);
    }
  }
  var nl = { readContext: ei, useCallback: mn, useContext: mn, useEffect: mn, useImperativeHandle: mn, useInsertionEffect: mn, useLayoutEffect: mn, useMemo: mn, useReducer: mn, useRef: mn, useState: mn, useDebugValue: mn, useDeferredValue: mn, useTransition: mn, useMutableSource: mn, useSyncExternalStore: mn, useId: mn, unstable_isNewReconciler: !1 }, Cv = { readContext: ei, useCallback: function(n, i) {
    return Ti().memoizedState = [n, i === void 0 ? null : i], n;
  }, useContext: ei, useEffect: lp, useImperativeHandle: function(n, i, a) {
    return a = a != null ? a.concat([n]) : null, el(
      4194308,
      4,
      dp.bind(null, i, n),
      a
    );
  }, useLayoutEffect: function(n, i) {
    return el(4194308, 4, n, i);
  }, useInsertionEffect: function(n, i) {
    return el(4, 2, n, i);
  }, useMemo: function(n, i) {
    var a = Ti();
    return i = i === void 0 ? null : i, n = n(), a.memoizedState = [n, i], n;
  }, useReducer: function(n, i, a) {
    var c = Ti();
    return i = a !== void 0 ? a(i) : i, c.memoizedState = c.baseState = i, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: i }, c.queue = n, n = n.dispatch = bv.bind(null, Vt, n), [c.memoizedState, n];
  }, useRef: function(n) {
    var i = Ti();
    return n = { current: n }, i.memoizedState = n;
  }, useState: op, useDebugValue: mu, useDeferredValue: function(n) {
    return Ti().memoizedState = n;
  }, useTransition: function() {
    var n = op(!1), i = n[0];
    return n = Tv.bind(null, n[1]), Ti().memoizedState = n, [i, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, i, a) {
    var c = Vt, p = Ti();
    if (Bt) {
      if (a === void 0) throw Error(t(407));
      a = a();
    } else {
      if (a = i(), on === null) throw Error(t(349));
      (Hr & 30) !== 0 || tp(c, i, a);
    }
    p.memoizedState = a;
    var g = { value: a, getSnapshot: i };
    return p.queue = g, lp(ip.bind(
      null,
      c,
      g,
      n
    ), [n]), c.flags |= 2048, $o(9, np.bind(null, c, g, a, i), void 0, null), a;
  }, useId: function() {
    var n = Ti(), i = on.identifierPrefix;
    if (Bt) {
      var a = ki, c = Fi;
      a = (c & ~(1 << 32 - Ve(c) - 1)).toString(32) + a, i = ":" + i + "R" + a, a = Yo++, 0 < a && (i += "H" + a.toString(32)), i += ":";
    } else a = wv++, i = ":" + i + "r" + a.toString(32) + ":";
    return n.memoizedState = i;
  }, unstable_isNewReconciler: !1 }, Rv = {
    readContext: ei,
    useCallback: hp,
    useContext: ei,
    useEffect: pu,
    useImperativeHandle: fp,
    useInsertionEffect: cp,
    useLayoutEffect: up,
    useMemo: pp,
    useReducer: fu,
    useRef: ap,
    useState: function() {
      return fu(qo);
    },
    useDebugValue: mu,
    useDeferredValue: function(n) {
      var i = ti();
      return mp(i, Kt.memoizedState, n);
    },
    useTransition: function() {
      var n = fu(qo)[0], i = ti().memoizedState;
      return [n, i];
    },
    useMutableSource: Jh,
    useSyncExternalStore: ep,
    useId: gp,
    unstable_isNewReconciler: !1
  }, Pv = { readContext: ei, useCallback: hp, useContext: ei, useEffect: pu, useImperativeHandle: fp, useInsertionEffect: cp, useLayoutEffect: up, useMemo: pp, useReducer: hu, useRef: ap, useState: function() {
    return hu(qo);
  }, useDebugValue: mu, useDeferredValue: function(n) {
    var i = ti();
    return Kt === null ? i.memoizedState = n : mp(i, Kt.memoizedState, n);
  }, useTransition: function() {
    var n = hu(qo)[0], i = ti().memoizedState;
    return [n, i];
  }, useMutableSource: Jh, useSyncExternalStore: ep, useId: gp, unstable_isNewReconciler: !1 };
  function di(n, i) {
    if (n && n.defaultProps) {
      i = ae({}, i), n = n.defaultProps;
      for (var a in n) i[a] === void 0 && (i[a] = n[a]);
      return i;
    }
    return i;
  }
  function gu(n, i, a, c) {
    i = n.memoizedState, a = a(c, i), a = a == null ? i : ae({}, i, a), n.memoizedState = a, n.lanes === 0 && (n.updateQueue.baseState = a);
  }
  var il = { isMounted: function(n) {
    return (n = n._reactInternals) ? Di(n) === n : !1;
  }, enqueueSetState: function(n, i, a) {
    n = n._reactInternals;
    var c = wn(), p = _r(n), g = Bi(c, p);
    g.payload = i, a != null && (g.callback = a), i = pr(n, g, p), i !== null && (pi(i, n, p, c), $a(i, n, p));
  }, enqueueReplaceState: function(n, i, a) {
    n = n._reactInternals;
    var c = wn(), p = _r(n), g = Bi(c, p);
    g.tag = 1, g.payload = i, a != null && (g.callback = a), i = pr(n, g, p), i !== null && (pi(i, n, p, c), $a(i, n, p));
  }, enqueueForceUpdate: function(n, i) {
    n = n._reactInternals;
    var a = wn(), c = _r(n), p = Bi(a, c);
    p.tag = 2, i != null && (p.callback = i), i = pr(n, p, c), i !== null && (pi(i, n, c, a), $a(i, n, c));
  } };
  function yp(n, i, a, c, p, g, w) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(c, g, w) : i.prototype && i.prototype.isPureReactComponent ? !Uo(a, c) || !Uo(p, g) : !0;
  }
  function Sp(n, i, a) {
    var c = !1, p = dr, g = i.contextType;
    return typeof g == "object" && g !== null ? g = ei(g) : (p = Nn(i) ? Fr : pn.current, c = i.contextTypes, g = (c = c != null) ? Es(n, p) : dr), i = new i(a, g), n.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null, i.updater = il, n.stateNode = i, i._reactInternals = n, c && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = p, n.__reactInternalMemoizedMaskedChildContext = g), i;
  }
  function Mp(n, i, a, c) {
    n = i.state, typeof i.componentWillReceiveProps == "function" && i.componentWillReceiveProps(a, c), typeof i.UNSAFE_componentWillReceiveProps == "function" && i.UNSAFE_componentWillReceiveProps(a, c), i.state !== n && il.enqueueReplaceState(i, i.state, null);
  }
  function vu(n, i, a, c) {
    var p = n.stateNode;
    p.props = a, p.state = n.memoizedState, p.refs = {}, iu(n);
    var g = i.contextType;
    typeof g == "object" && g !== null ? p.context = ei(g) : (g = Nn(i) ? Fr : pn.current, p.context = Es(n, g)), p.state = n.memoizedState, g = i.getDerivedStateFromProps, typeof g == "function" && (gu(n, i, g, a), p.state = n.memoizedState), typeof i.getDerivedStateFromProps == "function" || typeof p.getSnapshotBeforeUpdate == "function" || typeof p.UNSAFE_componentWillMount != "function" && typeof p.componentWillMount != "function" || (i = p.state, typeof p.componentWillMount == "function" && p.componentWillMount(), typeof p.UNSAFE_componentWillMount == "function" && p.UNSAFE_componentWillMount(), i !== p.state && il.enqueueReplaceState(p, p.state, null), Ka(n, a, p, c), p.state = n.memoizedState), typeof p.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function Ls(n, i) {
    try {
      var a = "", c = i;
      do
        a += ce(c), c = c.return;
      while (c);
      var p = a;
    } catch (g) {
      p = `
Error generating stack: ` + g.message + `
` + g.stack;
    }
    return { value: n, source: i, stack: p, digest: null };
  }
  function _u(n, i, a) {
    return { value: n, source: null, stack: a ?? null, digest: i ?? null };
  }
  function xu(n, i) {
    try {
      console.error(i.value);
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  var Lv = typeof WeakMap == "function" ? WeakMap : Map;
  function Ep(n, i, a) {
    a = Bi(-1, a), a.tag = 3, a.payload = { element: null };
    var c = i.value;
    return a.callback = function() {
      ul || (ul = !0, Iu = c), xu(n, i);
    }, a;
  }
  function wp(n, i, a) {
    a = Bi(-1, a), a.tag = 3;
    var c = n.type.getDerivedStateFromError;
    if (typeof c == "function") {
      var p = i.value;
      a.payload = function() {
        return c(p);
      }, a.callback = function() {
        xu(n, i);
      };
    }
    var g = n.stateNode;
    return g !== null && typeof g.componentDidCatch == "function" && (a.callback = function() {
      xu(n, i), typeof c != "function" && (gr === null ? gr = /* @__PURE__ */ new Set([this]) : gr.add(this));
      var w = i.stack;
      this.componentDidCatch(i.value, { componentStack: w !== null ? w : "" });
    }), a;
  }
  function Tp(n, i, a) {
    var c = n.pingCache;
    if (c === null) {
      c = n.pingCache = new Lv();
      var p = /* @__PURE__ */ new Set();
      c.set(i, p);
    } else p = c.get(i), p === void 0 && (p = /* @__PURE__ */ new Set(), c.set(i, p));
    p.has(a) || (p.add(a), n = Xv.bind(null, n, i, a), i.then(n, n));
  }
  function bp(n) {
    do {
      var i;
      if ((i = n.tag === 13) && (i = n.memoizedState, i = i !== null ? i.dehydrated !== null : !0), i) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Ap(n, i, a, c, p) {
    return (n.mode & 1) === 0 ? (n === i ? n.flags |= 65536 : (n.flags |= 128, a.flags |= 131072, a.flags &= -52805, a.tag === 1 && (a.alternate === null ? a.tag = 17 : (i = Bi(-1, 1), i.tag = 2, pr(a, i, 1))), a.lanes |= 1), n) : (n.flags |= 65536, n.lanes = p, n);
  }
  var Dv = D.ReactCurrentOwner, In = !1;
  function En(n, i, a, c) {
    i.child = n === null ? Yh(i, null, a, c) : As(i, n.child, a, c);
  }
  function Cp(n, i, a, c, p) {
    a = a.render;
    var g = i.ref;
    return Rs(i, p), c = uu(n, i, a, c, g, p), a = du(), n !== null && !In ? (i.updateQueue = n.updateQueue, i.flags &= -2053, n.lanes &= ~p, zi(n, i, p)) : (Bt && a && Yc(i), i.flags |= 1, En(n, i, c, p), i.child);
  }
  function Rp(n, i, a, c, p) {
    if (n === null) {
      var g = a.type;
      return typeof g == "function" && !Hu(g) && g.defaultProps === void 0 && a.compare === null && a.defaultProps === void 0 ? (i.tag = 15, i.type = g, Pp(n, i, g, c, p)) : (n = gl(a.type, null, c, i, i.mode, p), n.ref = i.ref, n.return = i, i.child = n);
    }
    if (g = n.child, (n.lanes & p) === 0) {
      var w = g.memoizedProps;
      if (a = a.compare, a = a !== null ? a : Uo, a(w, c) && n.ref === i.ref) return zi(n, i, p);
    }
    return i.flags |= 1, n = yr(g, c), n.ref = i.ref, n.return = i, i.child = n;
  }
  function Pp(n, i, a, c, p) {
    if (n !== null) {
      var g = n.memoizedProps;
      if (Uo(g, c) && n.ref === i.ref) if (In = !1, i.pendingProps = c = g, (n.lanes & p) !== 0) (n.flags & 131072) !== 0 && (In = !0);
      else return i.lanes = n.lanes, zi(n, i, p);
    }
    return yu(n, i, a, c, p);
  }
  function Lp(n, i, a) {
    var c = i.pendingProps, p = c.children, g = n !== null ? n.memoizedState : null;
    if (c.mode === "hidden") if ((i.mode & 1) === 0) i.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, It(Ns, jn), jn |= a;
    else {
      if ((a & 1073741824) === 0) return n = g !== null ? g.baseLanes | a : a, i.lanes = i.childLanes = 1073741824, i.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, i.updateQueue = null, It(Ns, jn), jn |= n, null;
      i.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, c = g !== null ? g.baseLanes : a, It(Ns, jn), jn |= c;
    }
    else g !== null ? (c = g.baseLanes | a, i.memoizedState = null) : c = a, It(Ns, jn), jn |= c;
    return En(n, i, p, a), i.child;
  }
  function Dp(n, i) {
    var a = i.ref;
    (n === null && a !== null || n !== null && n.ref !== a) && (i.flags |= 512, i.flags |= 2097152);
  }
  function yu(n, i, a, c, p) {
    var g = Nn(a) ? Fr : pn.current;
    return g = Es(i, g), Rs(i, p), a = uu(n, i, a, c, g, p), c = du(), n !== null && !In ? (i.updateQueue = n.updateQueue, i.flags &= -2053, n.lanes &= ~p, zi(n, i, p)) : (Bt && c && Yc(i), i.flags |= 1, En(n, i, a, p), i.child);
  }
  function Np(n, i, a, c, p) {
    if (Nn(a)) {
      var g = !0;
      Ha(i);
    } else g = !1;
    if (Rs(i, p), i.stateNode === null) sl(n, i), Sp(i, a, c), vu(i, a, c, p), c = !0;
    else if (n === null) {
      var w = i.stateNode, N = i.memoizedProps;
      w.props = N;
      var k = w.context, re = a.contextType;
      typeof re == "object" && re !== null ? re = ei(re) : (re = Nn(a) ? Fr : pn.current, re = Es(i, re));
      var Se = a.getDerivedStateFromProps, Ee = typeof Se == "function" || typeof w.getSnapshotBeforeUpdate == "function";
      Ee || typeof w.UNSAFE_componentWillReceiveProps != "function" && typeof w.componentWillReceiveProps != "function" || (N !== c || k !== re) && Mp(i, w, c, re), hr = !1;
      var ye = i.memoizedState;
      w.state = ye, Ka(i, c, w, p), k = i.memoizedState, N !== c || ye !== k || Dn.current || hr ? (typeof Se == "function" && (gu(i, a, Se, c), k = i.memoizedState), (N = hr || yp(i, a, N, c, ye, k, re)) ? (Ee || typeof w.UNSAFE_componentWillMount != "function" && typeof w.componentWillMount != "function" || (typeof w.componentWillMount == "function" && w.componentWillMount(), typeof w.UNSAFE_componentWillMount == "function" && w.UNSAFE_componentWillMount()), typeof w.componentDidMount == "function" && (i.flags |= 4194308)) : (typeof w.componentDidMount == "function" && (i.flags |= 4194308), i.memoizedProps = c, i.memoizedState = k), w.props = c, w.state = k, w.context = re, c = N) : (typeof w.componentDidMount == "function" && (i.flags |= 4194308), c = !1);
    } else {
      w = i.stateNode, $h(n, i), N = i.memoizedProps, re = i.type === i.elementType ? N : di(i.type, N), w.props = re, Ee = i.pendingProps, ye = w.context, k = a.contextType, typeof k == "object" && k !== null ? k = ei(k) : (k = Nn(a) ? Fr : pn.current, k = Es(i, k));
      var He = a.getDerivedStateFromProps;
      (Se = typeof He == "function" || typeof w.getSnapshotBeforeUpdate == "function") || typeof w.UNSAFE_componentWillReceiveProps != "function" && typeof w.componentWillReceiveProps != "function" || (N !== Ee || ye !== k) && Mp(i, w, c, k), hr = !1, ye = i.memoizedState, w.state = ye, Ka(i, c, w, p);
      var We = i.memoizedState;
      N !== Ee || ye !== We || Dn.current || hr ? (typeof He == "function" && (gu(i, a, He, c), We = i.memoizedState), (re = hr || yp(i, a, re, c, ye, We, k) || !1) ? (Se || typeof w.UNSAFE_componentWillUpdate != "function" && typeof w.componentWillUpdate != "function" || (typeof w.componentWillUpdate == "function" && w.componentWillUpdate(c, We, k), typeof w.UNSAFE_componentWillUpdate == "function" && w.UNSAFE_componentWillUpdate(c, We, k)), typeof w.componentDidUpdate == "function" && (i.flags |= 4), typeof w.getSnapshotBeforeUpdate == "function" && (i.flags |= 1024)) : (typeof w.componentDidUpdate != "function" || N === n.memoizedProps && ye === n.memoizedState || (i.flags |= 4), typeof w.getSnapshotBeforeUpdate != "function" || N === n.memoizedProps && ye === n.memoizedState || (i.flags |= 1024), i.memoizedProps = c, i.memoizedState = We), w.props = c, w.state = We, w.context = k, c = re) : (typeof w.componentDidUpdate != "function" || N === n.memoizedProps && ye === n.memoizedState || (i.flags |= 4), typeof w.getSnapshotBeforeUpdate != "function" || N === n.memoizedProps && ye === n.memoizedState || (i.flags |= 1024), c = !1);
    }
    return Su(n, i, a, c, g, p);
  }
  function Su(n, i, a, c, p, g) {
    Dp(n, i);
    var w = (i.flags & 128) !== 0;
    if (!c && !w) return p && Oh(i, a, !1), zi(n, i, g);
    c = i.stateNode, Dv.current = i;
    var N = w && typeof a.getDerivedStateFromError != "function" ? null : c.render();
    return i.flags |= 1, n !== null && w ? (i.child = As(i, n.child, null, g), i.child = As(i, null, N, g)) : En(n, i, N, g), i.memoizedState = c.state, p && Oh(i, a, !0), i.child;
  }
  function Ip(n) {
    var i = n.stateNode;
    i.pendingContext ? Fh(n, i.pendingContext, i.pendingContext !== i.context) : i.context && Fh(n, i.context, !1), ru(n, i.containerInfo);
  }
  function Up(n, i, a, c, p) {
    return bs(), Zc(p), i.flags |= 256, En(n, i, a, c), i.child;
  }
  var Mu = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Eu(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function Fp(n, i, a) {
    var c = i.pendingProps, p = Ht.current, g = !1, w = (i.flags & 128) !== 0, N;
    if ((N = w) || (N = n !== null && n.memoizedState === null ? !1 : (p & 2) !== 0), N ? (g = !0, i.flags &= -129) : (n === null || n.memoizedState !== null) && (p |= 1), It(Ht, p & 1), n === null)
      return Kc(i), n = i.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? ((i.mode & 1) === 0 ? i.lanes = 1 : n.data === "$!" ? i.lanes = 8 : i.lanes = 1073741824, null) : (w = c.children, n = c.fallback, g ? (c = i.mode, g = i.child, w = { mode: "hidden", children: w }, (c & 1) === 0 && g !== null ? (g.childLanes = 0, g.pendingProps = w) : g = vl(w, c, 0, null), n = jr(n, c, a, null), g.return = i, n.return = i, g.sibling = n, i.child = g, i.child.memoizedState = Eu(a), i.memoizedState = Mu, n) : wu(i, w));
    if (p = n.memoizedState, p !== null && (N = p.dehydrated, N !== null)) return Nv(n, i, w, c, N, p, a);
    if (g) {
      g = c.fallback, w = i.mode, p = n.child, N = p.sibling;
      var k = { mode: "hidden", children: c.children };
      return (w & 1) === 0 && i.child !== p ? (c = i.child, c.childLanes = 0, c.pendingProps = k, i.deletions = null) : (c = yr(p, k), c.subtreeFlags = p.subtreeFlags & 14680064), N !== null ? g = yr(N, g) : (g = jr(g, w, a, null), g.flags |= 2), g.return = i, c.return = i, c.sibling = g, i.child = c, c = g, g = i.child, w = n.child.memoizedState, w = w === null ? Eu(a) : { baseLanes: w.baseLanes | a, cachePool: null, transitions: w.transitions }, g.memoizedState = w, g.childLanes = n.childLanes & ~a, i.memoizedState = Mu, c;
    }
    return g = n.child, n = g.sibling, c = yr(g, { mode: "visible", children: c.children }), (i.mode & 1) === 0 && (c.lanes = a), c.return = i, c.sibling = null, n !== null && (a = i.deletions, a === null ? (i.deletions = [n], i.flags |= 16) : a.push(n)), i.child = c, i.memoizedState = null, c;
  }
  function wu(n, i) {
    return i = vl({ mode: "visible", children: i }, n.mode, 0, null), i.return = n, n.child = i;
  }
  function rl(n, i, a, c) {
    return c !== null && Zc(c), As(i, n.child, null, a), n = wu(i, i.pendingProps.children), n.flags |= 2, i.memoizedState = null, n;
  }
  function Nv(n, i, a, c, p, g, w) {
    if (a)
      return i.flags & 256 ? (i.flags &= -257, c = _u(Error(t(422))), rl(n, i, w, c)) : i.memoizedState !== null ? (i.child = n.child, i.flags |= 128, null) : (g = c.fallback, p = i.mode, c = vl({ mode: "visible", children: c.children }, p, 0, null), g = jr(g, p, w, null), g.flags |= 2, c.return = i, g.return = i, c.sibling = g, i.child = c, (i.mode & 1) !== 0 && As(i, n.child, null, w), i.child.memoizedState = Eu(w), i.memoizedState = Mu, g);
    if ((i.mode & 1) === 0) return rl(n, i, w, null);
    if (p.data === "$!") {
      if (c = p.nextSibling && p.nextSibling.dataset, c) var N = c.dgst;
      return c = N, g = Error(t(419)), c = _u(g, c, void 0), rl(n, i, w, c);
    }
    if (N = (w & n.childLanes) !== 0, In || N) {
      if (c = on, c !== null) {
        switch (w & -w) {
          case 4:
            p = 2;
            break;
          case 16:
            p = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            p = 32;
            break;
          case 536870912:
            p = 268435456;
            break;
          default:
            p = 0;
        }
        p = (p & (c.suspendedLanes | w)) !== 0 ? 0 : p, p !== 0 && p !== g.retryLane && (g.retryLane = p, Oi(n, p), pi(c, n, p, -1));
      }
      return zu(), c = _u(Error(t(421))), rl(n, i, w, c);
    }
    return p.data === "$?" ? (i.flags |= 128, i.child = n.child, i = jv.bind(null, n), p._reactRetry = i, null) : (n = g.treeContext, Xn = cr(p.nextSibling), Wn = i, Bt = !0, ui = null, n !== null && (Qn[Jn++] = Fi, Qn[Jn++] = ki, Qn[Jn++] = kr, Fi = n.id, ki = n.overflow, kr = i), i = wu(i, c.children), i.flags |= 4096, i);
  }
  function kp(n, i, a) {
    n.lanes |= i;
    var c = n.alternate;
    c !== null && (c.lanes |= i), tu(n.return, i, a);
  }
  function Tu(n, i, a, c, p) {
    var g = n.memoizedState;
    g === null ? n.memoizedState = { isBackwards: i, rendering: null, renderingStartTime: 0, last: c, tail: a, tailMode: p } : (g.isBackwards = i, g.rendering = null, g.renderingStartTime = 0, g.last = c, g.tail = a, g.tailMode = p);
  }
  function Op(n, i, a) {
    var c = i.pendingProps, p = c.revealOrder, g = c.tail;
    if (En(n, i, c.children, a), c = Ht.current, (c & 2) !== 0) c = c & 1 | 2, i.flags |= 128;
    else {
      if (n !== null && (n.flags & 128) !== 0) e: for (n = i.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && kp(n, a, i);
        else if (n.tag === 19) kp(n, a, i);
        else if (n.child !== null) {
          n.child.return = n, n = n.child;
          continue;
        }
        if (n === i) break e;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === i) break e;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
      c &= 1;
    }
    if (It(Ht, c), (i.mode & 1) === 0) i.memoizedState = null;
    else switch (p) {
      case "forwards":
        for (a = i.child, p = null; a !== null; ) n = a.alternate, n !== null && Za(n) === null && (p = a), a = a.sibling;
        a = p, a === null ? (p = i.child, i.child = null) : (p = a.sibling, a.sibling = null), Tu(i, !1, p, a, g);
        break;
      case "backwards":
        for (a = null, p = i.child, i.child = null; p !== null; ) {
          if (n = p.alternate, n !== null && Za(n) === null) {
            i.child = p;
            break;
          }
          n = p.sibling, p.sibling = a, a = p, p = n;
        }
        Tu(i, !0, a, null, g);
        break;
      case "together":
        Tu(i, !1, null, null, void 0);
        break;
      default:
        i.memoizedState = null;
    }
    return i.child;
  }
  function sl(n, i) {
    (i.mode & 1) === 0 && n !== null && (n.alternate = null, i.alternate = null, i.flags |= 2);
  }
  function zi(n, i, a) {
    if (n !== null && (i.dependencies = n.dependencies), Vr |= i.lanes, (a & i.childLanes) === 0) return null;
    if (n !== null && i.child !== n.child) throw Error(t(153));
    if (i.child !== null) {
      for (n = i.child, a = yr(n, n.pendingProps), i.child = a, a.return = i; n.sibling !== null; ) n = n.sibling, a = a.sibling = yr(n, n.pendingProps), a.return = i;
      a.sibling = null;
    }
    return i.child;
  }
  function Iv(n, i, a) {
    switch (i.tag) {
      case 3:
        Ip(i), bs();
        break;
      case 5:
        Qh(i);
        break;
      case 1:
        Nn(i.type) && Ha(i);
        break;
      case 4:
        ru(i, i.stateNode.containerInfo);
        break;
      case 10:
        var c = i.type._context, p = i.memoizedProps.value;
        It(Ya, c._currentValue), c._currentValue = p;
        break;
      case 13:
        if (c = i.memoizedState, c !== null)
          return c.dehydrated !== null ? (It(Ht, Ht.current & 1), i.flags |= 128, null) : (a & i.child.childLanes) !== 0 ? Fp(n, i, a) : (It(Ht, Ht.current & 1), n = zi(n, i, a), n !== null ? n.sibling : null);
        It(Ht, Ht.current & 1);
        break;
      case 19:
        if (c = (a & i.childLanes) !== 0, (n.flags & 128) !== 0) {
          if (c) return Op(n, i, a);
          i.flags |= 128;
        }
        if (p = i.memoizedState, p !== null && (p.rendering = null, p.tail = null, p.lastEffect = null), It(Ht, Ht.current), c) break;
        return null;
      case 22:
      case 23:
        return i.lanes = 0, Lp(n, i, a);
    }
    return zi(n, i, a);
  }
  var Bp, bu, zp, Hp;
  Bp = function(n, i) {
    for (var a = i.child; a !== null; ) {
      if (a.tag === 5 || a.tag === 6) n.appendChild(a.stateNode);
      else if (a.tag !== 4 && a.child !== null) {
        a.child.return = a, a = a.child;
        continue;
      }
      if (a === i) break;
      for (; a.sibling === null; ) {
        if (a.return === null || a.return === i) return;
        a = a.return;
      }
      a.sibling.return = a.return, a = a.sibling;
    }
  }, bu = function() {
  }, zp = function(n, i, a, c) {
    var p = n.memoizedProps;
    if (p !== c) {
      n = i.stateNode, zr(wi.current);
      var g = null;
      switch (a) {
        case "input":
          p = qt(n, p), c = qt(n, c), g = [];
          break;
        case "select":
          p = ae({}, p, { value: void 0 }), c = ae({}, c, { value: void 0 }), g = [];
          break;
        case "textarea":
          p = $(n, p), c = $(n, c), g = [];
          break;
        default:
          typeof p.onClick != "function" && typeof c.onClick == "function" && (n.onclick = Oa);
      }
      $e(a, c);
      var w;
      a = null;
      for (re in p) if (!c.hasOwnProperty(re) && p.hasOwnProperty(re) && p[re] != null) if (re === "style") {
        var N = p[re];
        for (w in N) N.hasOwnProperty(w) && (a || (a = {}), a[w] = "");
      } else re !== "dangerouslySetInnerHTML" && re !== "children" && re !== "suppressContentEditableWarning" && re !== "suppressHydrationWarning" && re !== "autoFocus" && (o.hasOwnProperty(re) ? g || (g = []) : (g = g || []).push(re, null));
      for (re in c) {
        var k = c[re];
        if (N = p?.[re], c.hasOwnProperty(re) && k !== N && (k != null || N != null)) if (re === "style") if (N) {
          for (w in N) !N.hasOwnProperty(w) || k && k.hasOwnProperty(w) || (a || (a = {}), a[w] = "");
          for (w in k) k.hasOwnProperty(w) && N[w] !== k[w] && (a || (a = {}), a[w] = k[w]);
        } else a || (g || (g = []), g.push(
          re,
          a
        )), a = k;
        else re === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, N = N ? N.__html : void 0, k != null && N !== k && (g = g || []).push(re, k)) : re === "children" ? typeof k != "string" && typeof k != "number" || (g = g || []).push(re, "" + k) : re !== "suppressContentEditableWarning" && re !== "suppressHydrationWarning" && (o.hasOwnProperty(re) ? (k != null && re === "onScroll" && Ft("scroll", n), g || N === k || (g = [])) : (g = g || []).push(re, k));
      }
      a && (g = g || []).push("style", a);
      var re = g;
      (i.updateQueue = re) && (i.flags |= 4);
    }
  }, Hp = function(n, i, a, c) {
    a !== c && (i.flags |= 4);
  };
  function Ko(n, i) {
    if (!Bt) switch (n.tailMode) {
      case "hidden":
        i = n.tail;
        for (var a = null; i !== null; ) i.alternate !== null && (a = i), i = i.sibling;
        a === null ? n.tail = null : a.sibling = null;
        break;
      case "collapsed":
        a = n.tail;
        for (var c = null; a !== null; ) a.alternate !== null && (c = a), a = a.sibling;
        c === null ? i || n.tail === null ? n.tail = null : n.tail.sibling = null : c.sibling = null;
    }
  }
  function gn(n) {
    var i = n.alternate !== null && n.alternate.child === n.child, a = 0, c = 0;
    if (i) for (var p = n.child; p !== null; ) a |= p.lanes | p.childLanes, c |= p.subtreeFlags & 14680064, c |= p.flags & 14680064, p.return = n, p = p.sibling;
    else for (p = n.child; p !== null; ) a |= p.lanes | p.childLanes, c |= p.subtreeFlags, c |= p.flags, p.return = n, p = p.sibling;
    return n.subtreeFlags |= c, n.childLanes = a, i;
  }
  function Uv(n, i, a) {
    var c = i.pendingProps;
    switch (qc(i), i.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return gn(i), null;
      case 1:
        return Nn(i.type) && za(), gn(i), null;
      case 3:
        return c = i.stateNode, Ps(), kt(Dn), kt(pn), au(), c.pendingContext && (c.context = c.pendingContext, c.pendingContext = null), (n === null || n.child === null) && (Xa(i) ? i.flags |= 4 : n === null || n.memoizedState.isDehydrated && (i.flags & 256) === 0 || (i.flags |= 1024, ui !== null && (ku(ui), ui = null))), bu(n, i), gn(i), null;
      case 5:
        su(i);
        var p = zr(Xo.current);
        if (a = i.type, n !== null && i.stateNode != null) zp(n, i, a, c, p), n.ref !== i.ref && (i.flags |= 512, i.flags |= 2097152);
        else {
          if (!c) {
            if (i.stateNode === null) throw Error(t(166));
            return gn(i), null;
          }
          if (n = zr(wi.current), Xa(i)) {
            c = i.stateNode, a = i.type;
            var g = i.memoizedProps;
            switch (c[Ei] = i, c[zo] = g, n = (i.mode & 1) !== 0, a) {
              case "dialog":
                Ft("cancel", c), Ft("close", c);
                break;
              case "iframe":
              case "object":
              case "embed":
                Ft("load", c);
                break;
              case "video":
              case "audio":
                for (p = 0; p < ko.length; p++) Ft(ko[p], c);
                break;
              case "source":
                Ft("error", c);
                break;
              case "img":
              case "image":
              case "link":
                Ft(
                  "error",
                  c
                ), Ft("load", c);
                break;
              case "details":
                Ft("toggle", c);
                break;
              case "input":
                ht(c, g), Ft("invalid", c);
                break;
              case "select":
                c._wrapperState = { wasMultiple: !!g.multiple }, Ft("invalid", c);
                break;
              case "textarea":
                fe(c, g), Ft("invalid", c);
            }
            $e(a, g), p = null;
            for (var w in g) if (g.hasOwnProperty(w)) {
              var N = g[w];
              w === "children" ? typeof N == "string" ? c.textContent !== N && (g.suppressHydrationWarning !== !0 && ka(c.textContent, N, n), p = ["children", N]) : typeof N == "number" && c.textContent !== "" + N && (g.suppressHydrationWarning !== !0 && ka(
                c.textContent,
                N,
                n
              ), p = ["children", "" + N]) : o.hasOwnProperty(w) && N != null && w === "onScroll" && Ft("scroll", c);
            }
            switch (a) {
              case "input":
                ft(c), Ce(c, g, !0);
                break;
              case "textarea":
                ft(c), de(c);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof g.onClick == "function" && (c.onclick = Oa);
            }
            c = p, i.updateQueue = c, c !== null && (i.flags |= 4);
          } else {
            w = p.nodeType === 9 ? p : p.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Xe(a)), n === "http://www.w3.org/1999/xhtml" ? a === "script" ? (n = w.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof c.is == "string" ? n = w.createElement(a, { is: c.is }) : (n = w.createElement(a), a === "select" && (w = n, c.multiple ? w.multiple = !0 : c.size && (w.size = c.size))) : n = w.createElementNS(n, a), n[Ei] = i, n[zo] = c, Bp(n, i, !1, !1), i.stateNode = n;
            e: {
              switch (w = pt(a, c), a) {
                case "dialog":
                  Ft("cancel", n), Ft("close", n), p = c;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Ft("load", n), p = c;
                  break;
                case "video":
                case "audio":
                  for (p = 0; p < ko.length; p++) Ft(ko[p], n);
                  p = c;
                  break;
                case "source":
                  Ft("error", n), p = c;
                  break;
                case "img":
                case "image":
                case "link":
                  Ft(
                    "error",
                    n
                  ), Ft("load", n), p = c;
                  break;
                case "details":
                  Ft("toggle", n), p = c;
                  break;
                case "input":
                  ht(n, c), p = qt(n, c), Ft("invalid", n);
                  break;
                case "option":
                  p = c;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!c.multiple }, p = ae({}, c, { value: void 0 }), Ft("invalid", n);
                  break;
                case "textarea":
                  fe(n, c), p = $(n, c), Ft("invalid", n);
                  break;
                default:
                  p = c;
              }
              $e(a, p), N = p;
              for (g in N) if (N.hasOwnProperty(g)) {
                var k = N[g];
                g === "style" ? H(n, k) : g === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, k != null && vt(n, k)) : g === "children" ? typeof k == "string" ? (a !== "textarea" || k !== "") && we(n, k) : typeof k == "number" && we(n, "" + k) : g !== "suppressContentEditableWarning" && g !== "suppressHydrationWarning" && g !== "autoFocus" && (o.hasOwnProperty(g) ? k != null && g === "onScroll" && Ft("scroll", n) : k != null && R(n, g, k, w));
              }
              switch (a) {
                case "input":
                  ft(n), Ce(n, c, !1);
                  break;
                case "textarea":
                  ft(n), de(n);
                  break;
                case "option":
                  c.value != null && n.setAttribute("value", "" + Re(c.value));
                  break;
                case "select":
                  n.multiple = !!c.multiple, g = c.value, g != null ? b(n, !!c.multiple, g, !1) : c.defaultValue != null && b(
                    n,
                    !!c.multiple,
                    c.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof p.onClick == "function" && (n.onclick = Oa);
              }
              switch (a) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  c = !!c.autoFocus;
                  break e;
                case "img":
                  c = !0;
                  break e;
                default:
                  c = !1;
              }
            }
            c && (i.flags |= 4);
          }
          i.ref !== null && (i.flags |= 512, i.flags |= 2097152);
        }
        return gn(i), null;
      case 6:
        if (n && i.stateNode != null) Hp(n, i, n.memoizedProps, c);
        else {
          if (typeof c != "string" && i.stateNode === null) throw Error(t(166));
          if (a = zr(Xo.current), zr(wi.current), Xa(i)) {
            if (c = i.stateNode, a = i.memoizedProps, c[Ei] = i, (g = c.nodeValue !== a) && (n = Wn, n !== null)) switch (n.tag) {
              case 3:
                ka(c.nodeValue, a, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && ka(c.nodeValue, a, (n.mode & 1) !== 0);
            }
            g && (i.flags |= 4);
          } else c = (a.nodeType === 9 ? a : a.ownerDocument).createTextNode(c), c[Ei] = i, i.stateNode = c;
        }
        return gn(i), null;
      case 13:
        if (kt(Ht), c = i.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (Bt && Xn !== null && (i.mode & 1) !== 0 && (i.flags & 128) === 0) Wh(), bs(), i.flags |= 98560, g = !1;
          else if (g = Xa(i), c !== null && c.dehydrated !== null) {
            if (n === null) {
              if (!g) throw Error(t(318));
              if (g = i.memoizedState, g = g !== null ? g.dehydrated : null, !g) throw Error(t(317));
              g[Ei] = i;
            } else bs(), (i.flags & 128) === 0 && (i.memoizedState = null), i.flags |= 4;
            gn(i), g = !1;
          } else ui !== null && (ku(ui), ui = null), g = !0;
          if (!g) return i.flags & 65536 ? i : null;
        }
        return (i.flags & 128) !== 0 ? (i.lanes = a, i) : (c = c !== null, c !== (n !== null && n.memoizedState !== null) && c && (i.child.flags |= 8192, (i.mode & 1) !== 0 && (n === null || (Ht.current & 1) !== 0 ? Zt === 0 && (Zt = 3) : zu())), i.updateQueue !== null && (i.flags |= 4), gn(i), null);
      case 4:
        return Ps(), bu(n, i), n === null && Oo(i.stateNode.containerInfo), gn(i), null;
      case 10:
        return eu(i.type._context), gn(i), null;
      case 17:
        return Nn(i.type) && za(), gn(i), null;
      case 19:
        if (kt(Ht), g = i.memoizedState, g === null) return gn(i), null;
        if (c = (i.flags & 128) !== 0, w = g.rendering, w === null) if (c) Ko(g, !1);
        else {
          if (Zt !== 0 || n !== null && (n.flags & 128) !== 0) for (n = i.child; n !== null; ) {
            if (w = Za(n), w !== null) {
              for (i.flags |= 128, Ko(g, !1), c = w.updateQueue, c !== null && (i.updateQueue = c, i.flags |= 4), i.subtreeFlags = 0, c = a, a = i.child; a !== null; ) g = a, n = c, g.flags &= 14680066, w = g.alternate, w === null ? (g.childLanes = 0, g.lanes = n, g.child = null, g.subtreeFlags = 0, g.memoizedProps = null, g.memoizedState = null, g.updateQueue = null, g.dependencies = null, g.stateNode = null) : (g.childLanes = w.childLanes, g.lanes = w.lanes, g.child = w.child, g.subtreeFlags = 0, g.deletions = null, g.memoizedProps = w.memoizedProps, g.memoizedState = w.memoizedState, g.updateQueue = w.updateQueue, g.type = w.type, n = w.dependencies, g.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), a = a.sibling;
              return It(Ht, Ht.current & 1 | 2), i.child;
            }
            n = n.sibling;
          }
          g.tail !== null && Ae() > Is && (i.flags |= 128, c = !0, Ko(g, !1), i.lanes = 4194304);
        }
        else {
          if (!c) if (n = Za(w), n !== null) {
            if (i.flags |= 128, c = !0, a = n.updateQueue, a !== null && (i.updateQueue = a, i.flags |= 4), Ko(g, !0), g.tail === null && g.tailMode === "hidden" && !w.alternate && !Bt) return gn(i), null;
          } else 2 * Ae() - g.renderingStartTime > Is && a !== 1073741824 && (i.flags |= 128, c = !0, Ko(g, !1), i.lanes = 4194304);
          g.isBackwards ? (w.sibling = i.child, i.child = w) : (a = g.last, a !== null ? a.sibling = w : i.child = w, g.last = w);
        }
        return g.tail !== null ? (i = g.tail, g.rendering = i, g.tail = i.sibling, g.renderingStartTime = Ae(), i.sibling = null, a = Ht.current, It(Ht, c ? a & 1 | 2 : a & 1), i) : (gn(i), null);
      case 22:
      case 23:
        return Bu(), c = i.memoizedState !== null, n !== null && n.memoizedState !== null !== c && (i.flags |= 8192), c && (i.mode & 1) !== 0 ? (jn & 1073741824) !== 0 && (gn(i), i.subtreeFlags & 6 && (i.flags |= 8192)) : gn(i), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(t(156, i.tag));
  }
  function Fv(n, i) {
    switch (qc(i), i.tag) {
      case 1:
        return Nn(i.type) && za(), n = i.flags, n & 65536 ? (i.flags = n & -65537 | 128, i) : null;
      case 3:
        return Ps(), kt(Dn), kt(pn), au(), n = i.flags, (n & 65536) !== 0 && (n & 128) === 0 ? (i.flags = n & -65537 | 128, i) : null;
      case 5:
        return su(i), null;
      case 13:
        if (kt(Ht), n = i.memoizedState, n !== null && n.dehydrated !== null) {
          if (i.alternate === null) throw Error(t(340));
          bs();
        }
        return n = i.flags, n & 65536 ? (i.flags = n & -65537 | 128, i) : null;
      case 19:
        return kt(Ht), null;
      case 4:
        return Ps(), null;
      case 10:
        return eu(i.type._context), null;
      case 22:
      case 23:
        return Bu(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ol = !1, vn = !1, kv = typeof WeakSet == "function" ? WeakSet : Set, Ge = null;
  function Ds(n, i) {
    var a = n.ref;
    if (a !== null) if (typeof a == "function") try {
      a(null);
    } catch (c) {
      Gt(n, i, c);
    }
    else a.current = null;
  }
  function Au(n, i, a) {
    try {
      a();
    } catch (c) {
      Gt(n, i, c);
    }
  }
  var Vp = !1;
  function Ov(n, i) {
    if (Bc = ba, n = yh(), Lc(n)) {
      if ("selectionStart" in n) var a = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        a = (a = n.ownerDocument) && a.defaultView || window;
        var c = a.getSelection && a.getSelection();
        if (c && c.rangeCount !== 0) {
          a = c.anchorNode;
          var p = c.anchorOffset, g = c.focusNode;
          c = c.focusOffset;
          try {
            a.nodeType, g.nodeType;
          } catch {
            a = null;
            break e;
          }
          var w = 0, N = -1, k = -1, re = 0, Se = 0, Ee = n, ye = null;
          t: for (; ; ) {
            for (var He; Ee !== a || p !== 0 && Ee.nodeType !== 3 || (N = w + p), Ee !== g || c !== 0 && Ee.nodeType !== 3 || (k = w + c), Ee.nodeType === 3 && (w += Ee.nodeValue.length), (He = Ee.firstChild) !== null; )
              ye = Ee, Ee = He;
            for (; ; ) {
              if (Ee === n) break t;
              if (ye === a && ++re === p && (N = w), ye === g && ++Se === c && (k = w), (He = Ee.nextSibling) !== null) break;
              Ee = ye, ye = Ee.parentNode;
            }
            Ee = He;
          }
          a = N === -1 || k === -1 ? null : { start: N, end: k };
        } else a = null;
      }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (zc = { focusedElem: n, selectionRange: a }, ba = !1, Ge = i; Ge !== null; ) if (i = Ge, n = i.child, (i.subtreeFlags & 1028) !== 0 && n !== null) n.return = i, Ge = n;
    else for (; Ge !== null; ) {
      i = Ge;
      try {
        var We = i.alternate;
        if ((i.flags & 1024) !== 0) switch (i.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (We !== null) {
              var je = We.memoizedProps, Wt = We.memoizedState, q = i.stateNode, G = q.getSnapshotBeforeUpdate(i.elementType === i.type ? je : di(i.type, je), Wt);
              q.__reactInternalSnapshotBeforeUpdate = G;
            }
            break;
          case 3:
            var Q = i.stateNode.containerInfo;
            Q.nodeType === 1 ? Q.textContent = "" : Q.nodeType === 9 && Q.documentElement && Q.removeChild(Q.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(t(163));
        }
      } catch (Te) {
        Gt(i, i.return, Te);
      }
      if (n = i.sibling, n !== null) {
        n.return = i.return, Ge = n;
        break;
      }
      Ge = i.return;
    }
    return We = Vp, Vp = !1, We;
  }
  function Zo(n, i, a) {
    var c = i.updateQueue;
    if (c = c !== null ? c.lastEffect : null, c !== null) {
      var p = c = c.next;
      do {
        if ((p.tag & n) === n) {
          var g = p.destroy;
          p.destroy = void 0, g !== void 0 && Au(i, a, g);
        }
        p = p.next;
      } while (p !== c);
    }
  }
  function al(n, i) {
    if (i = i.updateQueue, i = i !== null ? i.lastEffect : null, i !== null) {
      var a = i = i.next;
      do {
        if ((a.tag & n) === n) {
          var c = a.create;
          a.destroy = c();
        }
        a = a.next;
      } while (a !== i);
    }
  }
  function Cu(n) {
    var i = n.ref;
    if (i !== null) {
      var a = n.stateNode;
      n.tag, n = a, typeof i == "function" ? i(n) : i.current = n;
    }
  }
  function Gp(n) {
    var i = n.alternate;
    i !== null && (n.alternate = null, Gp(i)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (i = n.stateNode, i !== null && (delete i[Ei], delete i[zo], delete i[Wc], delete i[yv], delete i[Sv])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Wp(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Xp(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || Wp(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function Ru(n, i, a) {
    var c = n.tag;
    if (c === 5 || c === 6) n = n.stateNode, i ? a.nodeType === 8 ? a.parentNode.insertBefore(n, i) : a.insertBefore(n, i) : (a.nodeType === 8 ? (i = a.parentNode, i.insertBefore(n, a)) : (i = a, i.appendChild(n)), a = a._reactRootContainer, a != null || i.onclick !== null || (i.onclick = Oa));
    else if (c !== 4 && (n = n.child, n !== null)) for (Ru(n, i, a), n = n.sibling; n !== null; ) Ru(n, i, a), n = n.sibling;
  }
  function Pu(n, i, a) {
    var c = n.tag;
    if (c === 5 || c === 6) n = n.stateNode, i ? a.insertBefore(n, i) : a.appendChild(n);
    else if (c !== 4 && (n = n.child, n !== null)) for (Pu(n, i, a), n = n.sibling; n !== null; ) Pu(n, i, a), n = n.sibling;
  }
  var un = null, fi = !1;
  function mr(n, i, a) {
    for (a = a.child; a !== null; ) jp(n, i, a), a = a.sibling;
  }
  function jp(n, i, a) {
    if (Ot && typeof Ot.onCommitFiberUnmount == "function") try {
      Ot.onCommitFiberUnmount(Dt, a);
    } catch {
    }
    switch (a.tag) {
      case 5:
        vn || Ds(a, i);
      case 6:
        var c = un, p = fi;
        un = null, mr(n, i, a), un = c, fi = p, un !== null && (fi ? (n = un, a = a.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(a) : n.removeChild(a)) : un.removeChild(a.stateNode));
        break;
      case 18:
        un !== null && (fi ? (n = un, a = a.stateNode, n.nodeType === 8 ? Gc(n.parentNode, a) : n.nodeType === 1 && Gc(n, a), Ro(n)) : Gc(un, a.stateNode));
        break;
      case 4:
        c = un, p = fi, un = a.stateNode.containerInfo, fi = !0, mr(n, i, a), un = c, fi = p;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!vn && (c = a.updateQueue, c !== null && (c = c.lastEffect, c !== null))) {
          p = c = c.next;
          do {
            var g = p, w = g.destroy;
            g = g.tag, w !== void 0 && ((g & 2) !== 0 || (g & 4) !== 0) && Au(a, i, w), p = p.next;
          } while (p !== c);
        }
        mr(n, i, a);
        break;
      case 1:
        if (!vn && (Ds(a, i), c = a.stateNode, typeof c.componentWillUnmount == "function")) try {
          c.props = a.memoizedProps, c.state = a.memoizedState, c.componentWillUnmount();
        } catch (N) {
          Gt(a, i, N);
        }
        mr(n, i, a);
        break;
      case 21:
        mr(n, i, a);
        break;
      case 22:
        a.mode & 1 ? (vn = (c = vn) || a.memoizedState !== null, mr(n, i, a), vn = c) : mr(n, i, a);
        break;
      default:
        mr(n, i, a);
    }
  }
  function Yp(n) {
    var i = n.updateQueue;
    if (i !== null) {
      n.updateQueue = null;
      var a = n.stateNode;
      a === null && (a = n.stateNode = new kv()), i.forEach(function(c) {
        var p = Yv.bind(null, n, c);
        a.has(c) || (a.add(c), c.then(p, p));
      });
    }
  }
  function hi(n, i) {
    var a = i.deletions;
    if (a !== null) for (var c = 0; c < a.length; c++) {
      var p = a[c];
      try {
        var g = n, w = i, N = w;
        e: for (; N !== null; ) {
          switch (N.tag) {
            case 5:
              un = N.stateNode, fi = !1;
              break e;
            case 3:
              un = N.stateNode.containerInfo, fi = !0;
              break e;
            case 4:
              un = N.stateNode.containerInfo, fi = !0;
              break e;
          }
          N = N.return;
        }
        if (un === null) throw Error(t(160));
        jp(g, w, p), un = null, fi = !1;
        var k = p.alternate;
        k !== null && (k.return = null), p.return = null;
      } catch (re) {
        Gt(p, i, re);
      }
    }
    if (i.subtreeFlags & 12854) for (i = i.child; i !== null; ) qp(i, n), i = i.sibling;
  }
  function qp(n, i) {
    var a = n.alternate, c = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (hi(i, n), bi(n), c & 4) {
          try {
            Zo(3, n, n.return), al(3, n);
          } catch (je) {
            Gt(n, n.return, je);
          }
          try {
            Zo(5, n, n.return);
          } catch (je) {
            Gt(n, n.return, je);
          }
        }
        break;
      case 1:
        hi(i, n), bi(n), c & 512 && a !== null && Ds(a, a.return);
        break;
      case 5:
        if (hi(i, n), bi(n), c & 512 && a !== null && Ds(a, a.return), n.flags & 32) {
          var p = n.stateNode;
          try {
            we(p, "");
          } catch (je) {
            Gt(n, n.return, je);
          }
        }
        if (c & 4 && (p = n.stateNode, p != null)) {
          var g = n.memoizedProps, w = a !== null ? a.memoizedProps : g, N = n.type, k = n.updateQueue;
          if (n.updateQueue = null, k !== null) try {
            N === "input" && g.type === "radio" && g.name != null && ct(p, g), pt(N, w);
            var re = pt(N, g);
            for (w = 0; w < k.length; w += 2) {
              var Se = k[w], Ee = k[w + 1];
              Se === "style" ? H(p, Ee) : Se === "dangerouslySetInnerHTML" ? vt(p, Ee) : Se === "children" ? we(p, Ee) : R(p, Se, Ee, re);
            }
            switch (N) {
              case "input":
                Ze(p, g);
                break;
              case "textarea":
                xe(p, g);
                break;
              case "select":
                var ye = p._wrapperState.wasMultiple;
                p._wrapperState.wasMultiple = !!g.multiple;
                var He = g.value;
                He != null ? b(p, !!g.multiple, He, !1) : ye !== !!g.multiple && (g.defaultValue != null ? b(
                  p,
                  !!g.multiple,
                  g.defaultValue,
                  !0
                ) : b(p, !!g.multiple, g.multiple ? [] : "", !1));
            }
            p[zo] = g;
          } catch (je) {
            Gt(n, n.return, je);
          }
        }
        break;
      case 6:
        if (hi(i, n), bi(n), c & 4) {
          if (n.stateNode === null) throw Error(t(162));
          p = n.stateNode, g = n.memoizedProps;
          try {
            p.nodeValue = g;
          } catch (je) {
            Gt(n, n.return, je);
          }
        }
        break;
      case 3:
        if (hi(i, n), bi(n), c & 4 && a !== null && a.memoizedState.isDehydrated) try {
          Ro(i.containerInfo);
        } catch (je) {
          Gt(n, n.return, je);
        }
        break;
      case 4:
        hi(i, n), bi(n);
        break;
      case 13:
        hi(i, n), bi(n), p = n.child, p.flags & 8192 && (g = p.memoizedState !== null, p.stateNode.isHidden = g, !g || p.alternate !== null && p.alternate.memoizedState !== null || (Nu = Ae())), c & 4 && Yp(n);
        break;
      case 22:
        if (Se = a !== null && a.memoizedState !== null, n.mode & 1 ? (vn = (re = vn) || Se, hi(i, n), vn = re) : hi(i, n), bi(n), c & 8192) {
          if (re = n.memoizedState !== null, (n.stateNode.isHidden = re) && !Se && (n.mode & 1) !== 0) for (Ge = n, Se = n.child; Se !== null; ) {
            for (Ee = Ge = Se; Ge !== null; ) {
              switch (ye = Ge, He = ye.child, ye.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Zo(4, ye, ye.return);
                  break;
                case 1:
                  Ds(ye, ye.return);
                  var We = ye.stateNode;
                  if (typeof We.componentWillUnmount == "function") {
                    c = ye, a = ye.return;
                    try {
                      i = c, We.props = i.memoizedProps, We.state = i.memoizedState, We.componentWillUnmount();
                    } catch (je) {
                      Gt(c, a, je);
                    }
                  }
                  break;
                case 5:
                  Ds(ye, ye.return);
                  break;
                case 22:
                  if (ye.memoizedState !== null) {
                    Zp(Ee);
                    continue;
                  }
              }
              He !== null ? (He.return = ye, Ge = He) : Zp(Ee);
            }
            Se = Se.sibling;
          }
          e: for (Se = null, Ee = n; ; ) {
            if (Ee.tag === 5) {
              if (Se === null) {
                Se = Ee;
                try {
                  p = Ee.stateNode, re ? (g = p.style, typeof g.setProperty == "function" ? g.setProperty("display", "none", "important") : g.display = "none") : (N = Ee.stateNode, k = Ee.memoizedProps.style, w = k != null && k.hasOwnProperty("display") ? k.display : null, N.style.display = it("display", w));
                } catch (je) {
                  Gt(n, n.return, je);
                }
              }
            } else if (Ee.tag === 6) {
              if (Se === null) try {
                Ee.stateNode.nodeValue = re ? "" : Ee.memoizedProps;
              } catch (je) {
                Gt(n, n.return, je);
              }
            } else if ((Ee.tag !== 22 && Ee.tag !== 23 || Ee.memoizedState === null || Ee === n) && Ee.child !== null) {
              Ee.child.return = Ee, Ee = Ee.child;
              continue;
            }
            if (Ee === n) break e;
            for (; Ee.sibling === null; ) {
              if (Ee.return === null || Ee.return === n) break e;
              Se === Ee && (Se = null), Ee = Ee.return;
            }
            Se === Ee && (Se = null), Ee.sibling.return = Ee.return, Ee = Ee.sibling;
          }
        }
        break;
      case 19:
        hi(i, n), bi(n), c & 4 && Yp(n);
        break;
      case 21:
        break;
      default:
        hi(
          i,
          n
        ), bi(n);
    }
  }
  function bi(n) {
    var i = n.flags;
    if (i & 2) {
      try {
        e: {
          for (var a = n.return; a !== null; ) {
            if (Wp(a)) {
              var c = a;
              break e;
            }
            a = a.return;
          }
          throw Error(t(160));
        }
        switch (c.tag) {
          case 5:
            var p = c.stateNode;
            c.flags & 32 && (we(p, ""), c.flags &= -33);
            var g = Xp(n);
            Pu(n, g, p);
            break;
          case 3:
          case 4:
            var w = c.stateNode.containerInfo, N = Xp(n);
            Ru(n, N, w);
            break;
          default:
            throw Error(t(161));
        }
      } catch (k) {
        Gt(n, n.return, k);
      }
      n.flags &= -3;
    }
    i & 4096 && (n.flags &= -4097);
  }
  function Bv(n, i, a) {
    Ge = n, $p(n);
  }
  function $p(n, i, a) {
    for (var c = (n.mode & 1) !== 0; Ge !== null; ) {
      var p = Ge, g = p.child;
      if (p.tag === 22 && c) {
        var w = p.memoizedState !== null || ol;
        if (!w) {
          var N = p.alternate, k = N !== null && N.memoizedState !== null || vn;
          N = ol;
          var re = vn;
          if (ol = w, (vn = k) && !re) for (Ge = p; Ge !== null; ) w = Ge, k = w.child, w.tag === 22 && w.memoizedState !== null ? Qp(p) : k !== null ? (k.return = w, Ge = k) : Qp(p);
          for (; g !== null; ) Ge = g, $p(g), g = g.sibling;
          Ge = p, ol = N, vn = re;
        }
        Kp(n);
      } else (p.subtreeFlags & 8772) !== 0 && g !== null ? (g.return = p, Ge = g) : Kp(n);
    }
  }
  function Kp(n) {
    for (; Ge !== null; ) {
      var i = Ge;
      if ((i.flags & 8772) !== 0) {
        var a = i.alternate;
        try {
          if ((i.flags & 8772) !== 0) switch (i.tag) {
            case 0:
            case 11:
            case 15:
              vn || al(5, i);
              break;
            case 1:
              var c = i.stateNode;
              if (i.flags & 4 && !vn) if (a === null) c.componentDidMount();
              else {
                var p = i.elementType === i.type ? a.memoizedProps : di(i.type, a.memoizedProps);
                c.componentDidUpdate(p, a.memoizedState, c.__reactInternalSnapshotBeforeUpdate);
              }
              var g = i.updateQueue;
              g !== null && Zh(i, g, c);
              break;
            case 3:
              var w = i.updateQueue;
              if (w !== null) {
                if (a = null, i.child !== null) switch (i.child.tag) {
                  case 5:
                    a = i.child.stateNode;
                    break;
                  case 1:
                    a = i.child.stateNode;
                }
                Zh(i, w, a);
              }
              break;
            case 5:
              var N = i.stateNode;
              if (a === null && i.flags & 4) {
                a = N;
                var k = i.memoizedProps;
                switch (i.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k.autoFocus && a.focus();
                    break;
                  case "img":
                    k.src && (a.src = k.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (i.memoizedState === null) {
                var re = i.alternate;
                if (re !== null) {
                  var Se = re.memoizedState;
                  if (Se !== null) {
                    var Ee = Se.dehydrated;
                    Ee !== null && Ro(Ee);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(t(163));
          }
          vn || i.flags & 512 && Cu(i);
        } catch (ye) {
          Gt(i, i.return, ye);
        }
      }
      if (i === n) {
        Ge = null;
        break;
      }
      if (a = i.sibling, a !== null) {
        a.return = i.return, Ge = a;
        break;
      }
      Ge = i.return;
    }
  }
  function Zp(n) {
    for (; Ge !== null; ) {
      var i = Ge;
      if (i === n) {
        Ge = null;
        break;
      }
      var a = i.sibling;
      if (a !== null) {
        a.return = i.return, Ge = a;
        break;
      }
      Ge = i.return;
    }
  }
  function Qp(n) {
    for (; Ge !== null; ) {
      var i = Ge;
      try {
        switch (i.tag) {
          case 0:
          case 11:
          case 15:
            var a = i.return;
            try {
              al(4, i);
            } catch (k) {
              Gt(i, a, k);
            }
            break;
          case 1:
            var c = i.stateNode;
            if (typeof c.componentDidMount == "function") {
              var p = i.return;
              try {
                c.componentDidMount();
              } catch (k) {
                Gt(i, p, k);
              }
            }
            var g = i.return;
            try {
              Cu(i);
            } catch (k) {
              Gt(i, g, k);
            }
            break;
          case 5:
            var w = i.return;
            try {
              Cu(i);
            } catch (k) {
              Gt(i, w, k);
            }
        }
      } catch (k) {
        Gt(i, i.return, k);
      }
      if (i === n) {
        Ge = null;
        break;
      }
      var N = i.sibling;
      if (N !== null) {
        N.return = i.return, Ge = N;
        break;
      }
      Ge = i.return;
    }
  }
  var zv = Math.ceil, ll = D.ReactCurrentDispatcher, Lu = D.ReactCurrentOwner, ni = D.ReactCurrentBatchConfig, yt = 0, on = null, jt = null, dn = 0, jn = 0, Ns = ur(0), Zt = 0, Qo = null, Vr = 0, cl = 0, Du = 0, Jo = null, Un = null, Nu = 0, Is = 1 / 0, Hi = null, ul = !1, Iu = null, gr = null, dl = !1, vr = null, fl = 0, ea = 0, Uu = null, hl = -1, pl = 0;
  function wn() {
    return (yt & 6) !== 0 ? Ae() : hl !== -1 ? hl : hl = Ae();
  }
  function _r(n) {
    return (n.mode & 1) === 0 ? 1 : (yt & 2) !== 0 && dn !== 0 ? dn & -dn : Ev.transition !== null ? (pl === 0 && (pl = hs()), pl) : (n = bt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : eh(n.type)), n);
  }
  function pi(n, i, a, c) {
    if (50 < ea) throw ea = 0, Uu = null, Error(t(185));
    nr(n, a, c), ((yt & 2) === 0 || n !== on) && (n === on && ((yt & 2) === 0 && (cl |= a), Zt === 4 && xr(n, dn)), Fn(n, c), a === 1 && yt === 0 && (i.mode & 1) === 0 && (Is = Ae() + 500, Va && fr()));
  }
  function Fn(n, i) {
    var a = n.callbackNode;
    Eo(n, i);
    var c = Nt(n, n === on ? dn : 0);
    if (c === 0) a !== null && j(a), n.callbackNode = null, n.callbackPriority = 0;
    else if (i = c & -c, n.callbackPriority !== i) {
      if (a != null && j(a), i === 1) n.tag === 0 ? Mv(em.bind(null, n)) : Bh(em.bind(null, n)), _v(function() {
        (yt & 6) === 0 && fr();
      }), a = null;
      else {
        switch (jf(c)) {
          case 1:
            a = nt;
            break;
          case 4:
            a = st;
            break;
          case 16:
            a = qe;
            break;
          case 536870912:
            a = Pt;
            break;
          default:
            a = qe;
        }
        a = lm(a, Jp.bind(null, n));
      }
      n.callbackPriority = i, n.callbackNode = a;
    }
  }
  function Jp(n, i) {
    if (hl = -1, pl = 0, (yt & 6) !== 0) throw Error(t(327));
    var a = n.callbackNode;
    if (Us() && n.callbackNode !== a) return null;
    var c = Nt(n, n === on ? dn : 0);
    if (c === 0) return null;
    if ((c & 30) !== 0 || (c & n.expiredLanes) !== 0 || i) i = ml(n, c);
    else {
      i = c;
      var p = yt;
      yt |= 2;
      var g = nm();
      (on !== n || dn !== i) && (Hi = null, Is = Ae() + 500, Wr(n, i));
      do
        try {
          Gv();
          break;
        } catch (N) {
          tm(n, N);
        }
      while (!0);
      Jc(), ll.current = g, yt = p, jt !== null ? i = 0 : (on = null, dn = 0, i = Zt);
    }
    if (i !== 0) {
      if (i === 2 && (p = hn(n), p !== 0 && (c = p, i = Fu(n, p))), i === 1) throw a = Qo, Wr(n, 0), xr(n, c), Fn(n, Ae()), a;
      if (i === 6) xr(n, c);
      else {
        if (p = n.current.alternate, (c & 30) === 0 && !Hv(p) && (i = ml(n, c), i === 2 && (g = hn(n), g !== 0 && (c = g, i = Fu(n, g))), i === 1)) throw a = Qo, Wr(n, 0), xr(n, c), Fn(n, Ae()), a;
        switch (n.finishedWork = p, n.finishedLanes = c, i) {
          case 0:
          case 1:
            throw Error(t(345));
          case 2:
            Xr(n, Un, Hi);
            break;
          case 3:
            if (xr(n, c), (c & 130023424) === c && (i = Nu + 500 - Ae(), 10 < i)) {
              if (Nt(n, 0) !== 0) break;
              if (p = n.suspendedLanes, (p & c) !== c) {
                wn(), n.pingedLanes |= n.suspendedLanes & p;
                break;
              }
              n.timeoutHandle = Vc(Xr.bind(null, n, Un, Hi), i);
              break;
            }
            Xr(n, Un, Hi);
            break;
          case 4:
            if (xr(n, c), (c & 4194240) === c) break;
            for (i = n.eventTimes, p = -1; 0 < c; ) {
              var w = 31 - Ve(c);
              g = 1 << w, w = i[w], w > p && (p = w), c &= ~g;
            }
            if (c = p, c = Ae() - c, c = (120 > c ? 120 : 480 > c ? 480 : 1080 > c ? 1080 : 1920 > c ? 1920 : 3e3 > c ? 3e3 : 4320 > c ? 4320 : 1960 * zv(c / 1960)) - c, 10 < c) {
              n.timeoutHandle = Vc(Xr.bind(null, n, Un, Hi), c);
              break;
            }
            Xr(n, Un, Hi);
            break;
          case 5:
            Xr(n, Un, Hi);
            break;
          default:
            throw Error(t(329));
        }
      }
    }
    return Fn(n, Ae()), n.callbackNode === a ? Jp.bind(null, n) : null;
  }
  function Fu(n, i) {
    var a = Jo;
    return n.current.memoizedState.isDehydrated && (Wr(n, i).flags |= 256), n = ml(n, i), n !== 2 && (i = Un, Un = a, i !== null && ku(i)), n;
  }
  function ku(n) {
    Un === null ? Un = n : Un.push.apply(Un, n);
  }
  function Hv(n) {
    for (var i = n; ; ) {
      if (i.flags & 16384) {
        var a = i.updateQueue;
        if (a !== null && (a = a.stores, a !== null)) for (var c = 0; c < a.length; c++) {
          var p = a[c], g = p.getSnapshot;
          p = p.value;
          try {
            if (!ci(g(), p)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (a = i.child, i.subtreeFlags & 16384 && a !== null) a.return = i, i = a;
      else {
        if (i === n) break;
        for (; i.sibling === null; ) {
          if (i.return === null || i.return === n) return !0;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
    }
    return !0;
  }
  function xr(n, i) {
    for (i &= ~Du, i &= ~cl, n.suspendedLanes |= i, n.pingedLanes &= ~i, n = n.expirationTimes; 0 < i; ) {
      var a = 31 - Ve(i), c = 1 << a;
      n[a] = -1, i &= ~c;
    }
  }
  function em(n) {
    if ((yt & 6) !== 0) throw Error(t(327));
    Us();
    var i = Nt(n, 0);
    if ((i & 1) === 0) return Fn(n, Ae()), null;
    var a = ml(n, i);
    if (n.tag !== 0 && a === 2) {
      var c = hn(n);
      c !== 0 && (i = c, a = Fu(n, c));
    }
    if (a === 1) throw a = Qo, Wr(n, 0), xr(n, i), Fn(n, Ae()), a;
    if (a === 6) throw Error(t(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = i, Xr(n, Un, Hi), Fn(n, Ae()), null;
  }
  function Ou(n, i) {
    var a = yt;
    yt |= 1;
    try {
      return n(i);
    } finally {
      yt = a, yt === 0 && (Is = Ae() + 500, Va && fr());
    }
  }
  function Gr(n) {
    vr !== null && vr.tag === 0 && (yt & 6) === 0 && Us();
    var i = yt;
    yt |= 1;
    var a = ni.transition, c = bt;
    try {
      if (ni.transition = null, bt = 1, n) return n();
    } finally {
      bt = c, ni.transition = a, yt = i, (yt & 6) === 0 && fr();
    }
  }
  function Bu() {
    jn = Ns.current, kt(Ns);
  }
  function Wr(n, i) {
    n.finishedWork = null, n.finishedLanes = 0;
    var a = n.timeoutHandle;
    if (a !== -1 && (n.timeoutHandle = -1, vv(a)), jt !== null) for (a = jt.return; a !== null; ) {
      var c = a;
      switch (qc(c), c.tag) {
        case 1:
          c = c.type.childContextTypes, c != null && za();
          break;
        case 3:
          Ps(), kt(Dn), kt(pn), au();
          break;
        case 5:
          su(c);
          break;
        case 4:
          Ps();
          break;
        case 13:
          kt(Ht);
          break;
        case 19:
          kt(Ht);
          break;
        case 10:
          eu(c.type._context);
          break;
        case 22:
        case 23:
          Bu();
      }
      a = a.return;
    }
    if (on = n, jt = n = yr(n.current, null), dn = jn = i, Zt = 0, Qo = null, Du = cl = Vr = 0, Un = Jo = null, Br !== null) {
      for (i = 0; i < Br.length; i++) if (a = Br[i], c = a.interleaved, c !== null) {
        a.interleaved = null;
        var p = c.next, g = a.pending;
        if (g !== null) {
          var w = g.next;
          g.next = p, c.next = w;
        }
        a.pending = c;
      }
      Br = null;
    }
    return n;
  }
  function tm(n, i) {
    do {
      var a = jt;
      try {
        if (Jc(), Qa.current = nl, Ja) {
          for (var c = Vt.memoizedState; c !== null; ) {
            var p = c.queue;
            p !== null && (p.pending = null), c = c.next;
          }
          Ja = !1;
        }
        if (Hr = 0, sn = Kt = Vt = null, jo = !1, Yo = 0, Lu.current = null, a === null || a.return === null) {
          Zt = 1, Qo = i, jt = null;
          break;
        }
        e: {
          var g = n, w = a.return, N = a, k = i;
          if (i = dn, N.flags |= 32768, k !== null && typeof k == "object" && typeof k.then == "function") {
            var re = k, Se = N, Ee = Se.tag;
            if ((Se.mode & 1) === 0 && (Ee === 0 || Ee === 11 || Ee === 15)) {
              var ye = Se.alternate;
              ye ? (Se.updateQueue = ye.updateQueue, Se.memoizedState = ye.memoizedState, Se.lanes = ye.lanes) : (Se.updateQueue = null, Se.memoizedState = null);
            }
            var He = bp(w);
            if (He !== null) {
              He.flags &= -257, Ap(He, w, N, g, i), He.mode & 1 && Tp(g, re, i), i = He, k = re;
              var We = i.updateQueue;
              if (We === null) {
                var je = /* @__PURE__ */ new Set();
                je.add(k), i.updateQueue = je;
              } else We.add(k);
              break e;
            } else {
              if ((i & 1) === 0) {
                Tp(g, re, i), zu();
                break e;
              }
              k = Error(t(426));
            }
          } else if (Bt && N.mode & 1) {
            var Wt = bp(w);
            if (Wt !== null) {
              (Wt.flags & 65536) === 0 && (Wt.flags |= 256), Ap(Wt, w, N, g, i), Zc(Ls(k, N));
              break e;
            }
          }
          g = k = Ls(k, N), Zt !== 4 && (Zt = 2), Jo === null ? Jo = [g] : Jo.push(g), g = w;
          do {
            switch (g.tag) {
              case 3:
                g.flags |= 65536, i &= -i, g.lanes |= i;
                var q = Ep(g, k, i);
                Kh(g, q);
                break e;
              case 1:
                N = k;
                var G = g.type, Q = g.stateNode;
                if ((g.flags & 128) === 0 && (typeof G.getDerivedStateFromError == "function" || Q !== null && typeof Q.componentDidCatch == "function" && (gr === null || !gr.has(Q)))) {
                  g.flags |= 65536, i &= -i, g.lanes |= i;
                  var Te = wp(g, N, i);
                  Kh(g, Te);
                  break e;
                }
            }
            g = g.return;
          } while (g !== null);
        }
        rm(a);
      } catch (Ke) {
        i = Ke, jt === a && a !== null && (jt = a = a.return);
        continue;
      }
      break;
    } while (!0);
  }
  function nm() {
    var n = ll.current;
    return ll.current = nl, n === null ? nl : n;
  }
  function zu() {
    (Zt === 0 || Zt === 3 || Zt === 2) && (Zt = 4), on === null || (Vr & 268435455) === 0 && (cl & 268435455) === 0 || xr(on, dn);
  }
  function ml(n, i) {
    var a = yt;
    yt |= 2;
    var c = nm();
    (on !== n || dn !== i) && (Hi = null, Wr(n, i));
    do
      try {
        Vv();
        break;
      } catch (p) {
        tm(n, p);
      }
    while (!0);
    if (Jc(), yt = a, ll.current = c, jt !== null) throw Error(t(261));
    return on = null, dn = 0, Zt;
  }
  function Vv() {
    for (; jt !== null; ) im(jt);
  }
  function Gv() {
    for (; jt !== null && !be(); ) im(jt);
  }
  function im(n) {
    var i = am(n.alternate, n, jn);
    n.memoizedProps = n.pendingProps, i === null ? rm(n) : jt = i, Lu.current = null;
  }
  function rm(n) {
    var i = n;
    do {
      var a = i.alternate;
      if (n = i.return, (i.flags & 32768) === 0) {
        if (a = Uv(a, i, jn), a !== null) {
          jt = a;
          return;
        }
      } else {
        if (a = Fv(a, i), a !== null) {
          a.flags &= 32767, jt = a;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          Zt = 6, jt = null;
          return;
        }
      }
      if (i = i.sibling, i !== null) {
        jt = i;
        return;
      }
      jt = i = n;
    } while (i !== null);
    Zt === 0 && (Zt = 5);
  }
  function Xr(n, i, a) {
    var c = bt, p = ni.transition;
    try {
      ni.transition = null, bt = 1, Wv(n, i, a, c);
    } finally {
      ni.transition = p, bt = c;
    }
    return null;
  }
  function Wv(n, i, a, c) {
    do
      Us();
    while (vr !== null);
    if ((yt & 6) !== 0) throw Error(t(327));
    a = n.finishedWork;
    var p = n.finishedLanes;
    if (a === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, a === n.current) throw Error(t(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var g = a.lanes | a.childLanes;
    if (wg(n, g), n === on && (jt = on = null, dn = 0), (a.subtreeFlags & 2064) === 0 && (a.flags & 2064) === 0 || dl || (dl = !0, lm(qe, function() {
      return Us(), null;
    })), g = (a.flags & 15990) !== 0, (a.subtreeFlags & 15990) !== 0 || g) {
      g = ni.transition, ni.transition = null;
      var w = bt;
      bt = 1;
      var N = yt;
      yt |= 4, Lu.current = null, Ov(n, a), qp(a, n), uv(zc), ba = !!Bc, zc = Bc = null, n.current = a, Bv(a), Be(), yt = N, bt = w, ni.transition = g;
    } else n.current = a;
    if (dl && (dl = !1, vr = n, fl = p), g = n.pendingLanes, g === 0 && (gr = null), St(a.stateNode), Fn(n, Ae()), i !== null) for (c = n.onRecoverableError, a = 0; a < i.length; a++) p = i[a], c(p.value, { componentStack: p.stack, digest: p.digest });
    if (ul) throw ul = !1, n = Iu, Iu = null, n;
    return (fl & 1) !== 0 && n.tag !== 0 && Us(), g = n.pendingLanes, (g & 1) !== 0 ? n === Uu ? ea++ : (ea = 0, Uu = n) : ea = 0, fr(), null;
  }
  function Us() {
    if (vr !== null) {
      var n = jf(fl), i = ni.transition, a = bt;
      try {
        if (ni.transition = null, bt = 16 > n ? 16 : n, vr === null) var c = !1;
        else {
          if (n = vr, vr = null, fl = 0, (yt & 6) !== 0) throw Error(t(331));
          var p = yt;
          for (yt |= 4, Ge = n.current; Ge !== null; ) {
            var g = Ge, w = g.child;
            if ((Ge.flags & 16) !== 0) {
              var N = g.deletions;
              if (N !== null) {
                for (var k = 0; k < N.length; k++) {
                  var re = N[k];
                  for (Ge = re; Ge !== null; ) {
                    var Se = Ge;
                    switch (Se.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Zo(8, Se, g);
                    }
                    var Ee = Se.child;
                    if (Ee !== null) Ee.return = Se, Ge = Ee;
                    else for (; Ge !== null; ) {
                      Se = Ge;
                      var ye = Se.sibling, He = Se.return;
                      if (Gp(Se), Se === re) {
                        Ge = null;
                        break;
                      }
                      if (ye !== null) {
                        ye.return = He, Ge = ye;
                        break;
                      }
                      Ge = He;
                    }
                  }
                }
                var We = g.alternate;
                if (We !== null) {
                  var je = We.child;
                  if (je !== null) {
                    We.child = null;
                    do {
                      var Wt = je.sibling;
                      je.sibling = null, je = Wt;
                    } while (je !== null);
                  }
                }
                Ge = g;
              }
            }
            if ((g.subtreeFlags & 2064) !== 0 && w !== null) w.return = g, Ge = w;
            else e: for (; Ge !== null; ) {
              if (g = Ge, (g.flags & 2048) !== 0) switch (g.tag) {
                case 0:
                case 11:
                case 15:
                  Zo(9, g, g.return);
              }
              var q = g.sibling;
              if (q !== null) {
                q.return = g.return, Ge = q;
                break e;
              }
              Ge = g.return;
            }
          }
          var G = n.current;
          for (Ge = G; Ge !== null; ) {
            w = Ge;
            var Q = w.child;
            if ((w.subtreeFlags & 2064) !== 0 && Q !== null) Q.return = w, Ge = Q;
            else e: for (w = G; Ge !== null; ) {
              if (N = Ge, (N.flags & 2048) !== 0) try {
                switch (N.tag) {
                  case 0:
                  case 11:
                  case 15:
                    al(9, N);
                }
              } catch (Ke) {
                Gt(N, N.return, Ke);
              }
              if (N === w) {
                Ge = null;
                break e;
              }
              var Te = N.sibling;
              if (Te !== null) {
                Te.return = N.return, Ge = Te;
                break e;
              }
              Ge = N.return;
            }
          }
          if (yt = p, fr(), Ot && typeof Ot.onPostCommitFiberRoot == "function") try {
            Ot.onPostCommitFiberRoot(Dt, n);
          } catch {
          }
          c = !0;
        }
        return c;
      } finally {
        bt = a, ni.transition = i;
      }
    }
    return !1;
  }
  function sm(n, i, a) {
    i = Ls(a, i), i = Ep(n, i, 1), n = pr(n, i, 1), i = wn(), n !== null && (nr(n, 1, i), Fn(n, i));
  }
  function Gt(n, i, a) {
    if (n.tag === 3) sm(n, n, a);
    else for (; i !== null; ) {
      if (i.tag === 3) {
        sm(i, n, a);
        break;
      } else if (i.tag === 1) {
        var c = i.stateNode;
        if (typeof i.type.getDerivedStateFromError == "function" || typeof c.componentDidCatch == "function" && (gr === null || !gr.has(c))) {
          n = Ls(a, n), n = wp(i, n, 1), i = pr(i, n, 1), n = wn(), i !== null && (nr(i, 1, n), Fn(i, n));
          break;
        }
      }
      i = i.return;
    }
  }
  function Xv(n, i, a) {
    var c = n.pingCache;
    c !== null && c.delete(i), i = wn(), n.pingedLanes |= n.suspendedLanes & a, on === n && (dn & a) === a && (Zt === 4 || Zt === 3 && (dn & 130023424) === dn && 500 > Ae() - Nu ? Wr(n, 0) : Du |= a), Fn(n, i);
  }
  function om(n, i) {
    i === 0 && ((n.mode & 1) === 0 ? i = 1 : (i = rn, rn <<= 1, (rn & 130023424) === 0 && (rn = 4194304)));
    var a = wn();
    n = Oi(n, i), n !== null && (nr(n, i, a), Fn(n, a));
  }
  function jv(n) {
    var i = n.memoizedState, a = 0;
    i !== null && (a = i.retryLane), om(n, a);
  }
  function Yv(n, i) {
    var a = 0;
    switch (n.tag) {
      case 13:
        var c = n.stateNode, p = n.memoizedState;
        p !== null && (a = p.retryLane);
        break;
      case 19:
        c = n.stateNode;
        break;
      default:
        throw Error(t(314));
    }
    c !== null && c.delete(i), om(n, a);
  }
  var am;
  am = function(n, i, a) {
    if (n !== null) if (n.memoizedProps !== i.pendingProps || Dn.current) In = !0;
    else {
      if ((n.lanes & a) === 0 && (i.flags & 128) === 0) return In = !1, Iv(n, i, a);
      In = (n.flags & 131072) !== 0;
    }
    else In = !1, Bt && (i.flags & 1048576) !== 0 && zh(i, Wa, i.index);
    switch (i.lanes = 0, i.tag) {
      case 2:
        var c = i.type;
        sl(n, i), n = i.pendingProps;
        var p = Es(i, pn.current);
        Rs(i, a), p = uu(null, i, c, n, p, a);
        var g = du();
        return i.flags |= 1, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0 ? (i.tag = 1, i.memoizedState = null, i.updateQueue = null, Nn(c) ? (g = !0, Ha(i)) : g = !1, i.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, iu(i), p.updater = il, i.stateNode = p, p._reactInternals = i, vu(i, c, n, a), i = Su(null, i, c, !0, g, a)) : (i.tag = 0, Bt && g && Yc(i), En(null, i, p, a), i = i.child), i;
      case 16:
        c = i.elementType;
        e: {
          switch (sl(n, i), n = i.pendingProps, p = c._init, c = p(c._payload), i.type = c, p = i.tag = $v(c), n = di(c, n), p) {
            case 0:
              i = yu(null, i, c, n, a);
              break e;
            case 1:
              i = Np(null, i, c, n, a);
              break e;
            case 11:
              i = Cp(null, i, c, n, a);
              break e;
            case 14:
              i = Rp(null, i, c, di(c.type, n), a);
              break e;
          }
          throw Error(t(
            306,
            c,
            ""
          ));
        }
        return i;
      case 0:
        return c = i.type, p = i.pendingProps, p = i.elementType === c ? p : di(c, p), yu(n, i, c, p, a);
      case 1:
        return c = i.type, p = i.pendingProps, p = i.elementType === c ? p : di(c, p), Np(n, i, c, p, a);
      case 3:
        e: {
          if (Ip(i), n === null) throw Error(t(387));
          c = i.pendingProps, g = i.memoizedState, p = g.element, $h(n, i), Ka(i, c, null, a);
          var w = i.memoizedState;
          if (c = w.element, g.isDehydrated) if (g = { element: c, isDehydrated: !1, cache: w.cache, pendingSuspenseBoundaries: w.pendingSuspenseBoundaries, transitions: w.transitions }, i.updateQueue.baseState = g, i.memoizedState = g, i.flags & 256) {
            p = Ls(Error(t(423)), i), i = Up(n, i, c, a, p);
            break e;
          } else if (c !== p) {
            p = Ls(Error(t(424)), i), i = Up(n, i, c, a, p);
            break e;
          } else for (Xn = cr(i.stateNode.containerInfo.firstChild), Wn = i, Bt = !0, ui = null, a = Yh(i, null, c, a), i.child = a; a; ) a.flags = a.flags & -3 | 4096, a = a.sibling;
          else {
            if (bs(), c === p) {
              i = zi(n, i, a);
              break e;
            }
            En(n, i, c, a);
          }
          i = i.child;
        }
        return i;
      case 5:
        return Qh(i), n === null && Kc(i), c = i.type, p = i.pendingProps, g = n !== null ? n.memoizedProps : null, w = p.children, Hc(c, p) ? w = null : g !== null && Hc(c, g) && (i.flags |= 32), Dp(n, i), En(n, i, w, a), i.child;
      case 6:
        return n === null && Kc(i), null;
      case 13:
        return Fp(n, i, a);
      case 4:
        return ru(i, i.stateNode.containerInfo), c = i.pendingProps, n === null ? i.child = As(i, null, c, a) : En(n, i, c, a), i.child;
      case 11:
        return c = i.type, p = i.pendingProps, p = i.elementType === c ? p : di(c, p), Cp(n, i, c, p, a);
      case 7:
        return En(n, i, i.pendingProps, a), i.child;
      case 8:
        return En(n, i, i.pendingProps.children, a), i.child;
      case 12:
        return En(n, i, i.pendingProps.children, a), i.child;
      case 10:
        e: {
          if (c = i.type._context, p = i.pendingProps, g = i.memoizedProps, w = p.value, It(Ya, c._currentValue), c._currentValue = w, g !== null) if (ci(g.value, w)) {
            if (g.children === p.children && !Dn.current) {
              i = zi(n, i, a);
              break e;
            }
          } else for (g = i.child, g !== null && (g.return = i); g !== null; ) {
            var N = g.dependencies;
            if (N !== null) {
              w = g.child;
              for (var k = N.firstContext; k !== null; ) {
                if (k.context === c) {
                  if (g.tag === 1) {
                    k = Bi(-1, a & -a), k.tag = 2;
                    var re = g.updateQueue;
                    if (re !== null) {
                      re = re.shared;
                      var Se = re.pending;
                      Se === null ? k.next = k : (k.next = Se.next, Se.next = k), re.pending = k;
                    }
                  }
                  g.lanes |= a, k = g.alternate, k !== null && (k.lanes |= a), tu(
                    g.return,
                    a,
                    i
                  ), N.lanes |= a;
                  break;
                }
                k = k.next;
              }
            } else if (g.tag === 10) w = g.type === i.type ? null : g.child;
            else if (g.tag === 18) {
              if (w = g.return, w === null) throw Error(t(341));
              w.lanes |= a, N = w.alternate, N !== null && (N.lanes |= a), tu(w, a, i), w = g.sibling;
            } else w = g.child;
            if (w !== null) w.return = g;
            else for (w = g; w !== null; ) {
              if (w === i) {
                w = null;
                break;
              }
              if (g = w.sibling, g !== null) {
                g.return = w.return, w = g;
                break;
              }
              w = w.return;
            }
            g = w;
          }
          En(n, i, p.children, a), i = i.child;
        }
        return i;
      case 9:
        return p = i.type, c = i.pendingProps.children, Rs(i, a), p = ei(p), c = c(p), i.flags |= 1, En(n, i, c, a), i.child;
      case 14:
        return c = i.type, p = di(c, i.pendingProps), p = di(c.type, p), Rp(n, i, c, p, a);
      case 15:
        return Pp(n, i, i.type, i.pendingProps, a);
      case 17:
        return c = i.type, p = i.pendingProps, p = i.elementType === c ? p : di(c, p), sl(n, i), i.tag = 1, Nn(c) ? (n = !0, Ha(i)) : n = !1, Rs(i, a), Sp(i, c, p), vu(i, c, p, a), Su(null, i, c, !0, n, a);
      case 19:
        return Op(n, i, a);
      case 22:
        return Lp(n, i, a);
    }
    throw Error(t(156, i.tag));
  };
  function lm(n, i) {
    return ie(n, i);
  }
  function qv(n, i, a, c) {
    this.tag = n, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = i, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = c, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function ii(n, i, a, c) {
    return new qv(n, i, a, c);
  }
  function Hu(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function $v(n) {
    if (typeof n == "function") return Hu(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === te) return 11;
      if (n === _e) return 14;
    }
    return 2;
  }
  function yr(n, i) {
    var a = n.alternate;
    return a === null ? (a = ii(n.tag, i, n.key, n.mode), a.elementType = n.elementType, a.type = n.type, a.stateNode = n.stateNode, a.alternate = n, n.alternate = a) : (a.pendingProps = i, a.type = n.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = n.flags & 14680064, a.childLanes = n.childLanes, a.lanes = n.lanes, a.child = n.child, a.memoizedProps = n.memoizedProps, a.memoizedState = n.memoizedState, a.updateQueue = n.updateQueue, i = n.dependencies, a.dependencies = i === null ? null : { lanes: i.lanes, firstContext: i.firstContext }, a.sibling = n.sibling, a.index = n.index, a.ref = n.ref, a;
  }
  function gl(n, i, a, c, p, g) {
    var w = 2;
    if (c = n, typeof n == "function") Hu(n) && (w = 1);
    else if (typeof n == "string") w = 5;
    else e: switch (n) {
      case I:
        return jr(a.children, p, g, i);
      case Y:
        w = 8, p |= 8;
        break;
      case ve:
        return n = ii(12, a, i, p | 2), n.elementType = ve, n.lanes = g, n;
      case J:
        return n = ii(13, a, i, p), n.elementType = J, n.lanes = g, n;
      case se:
        return n = ii(19, a, i, p), n.elementType = se, n.lanes = g, n;
      case he:
        return vl(a, p, g, i);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case T:
            w = 10;
            break e;
          case C:
            w = 9;
            break e;
          case te:
            w = 11;
            break e;
          case _e:
            w = 14;
            break e;
          case Z:
            w = 16, c = null;
            break e;
        }
        throw Error(t(130, n == null ? n : typeof n, ""));
    }
    return i = ii(w, a, i, p), i.elementType = n, i.type = c, i.lanes = g, i;
  }
  function jr(n, i, a, c) {
    return n = ii(7, n, c, i), n.lanes = a, n;
  }
  function vl(n, i, a, c) {
    return n = ii(22, n, c, i), n.elementType = he, n.lanes = a, n.stateNode = { isHidden: !1 }, n;
  }
  function Vu(n, i, a) {
    return n = ii(6, n, null, i), n.lanes = a, n;
  }
  function Gu(n, i, a) {
    return i = ii(4, n.children !== null ? n.children : [], n.key, i), i.lanes = a, i.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, i;
  }
  function Kv(n, i, a, c, p) {
    this.tag = i, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = wo(0), this.expirationTimes = wo(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = wo(0), this.identifierPrefix = c, this.onRecoverableError = p, this.mutableSourceEagerHydrationData = null;
  }
  function Wu(n, i, a, c, p, g, w, N, k) {
    return n = new Kv(n, i, a, N, k), i === 1 ? (i = 1, g === !0 && (i |= 8)) : i = 0, g = ii(3, null, null, i), n.current = g, g.stateNode = n, g.memoizedState = { element: c, isDehydrated: a, cache: null, transitions: null, pendingSuspenseBoundaries: null }, iu(g), n;
  }
  function Zv(n, i, a) {
    var c = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: F, key: c == null ? null : "" + c, children: n, containerInfo: i, implementation: a };
  }
  function cm(n) {
    if (!n) return dr;
    n = n._reactInternals;
    e: {
      if (Di(n) !== n || n.tag !== 1) throw Error(t(170));
      var i = n;
      do {
        switch (i.tag) {
          case 3:
            i = i.stateNode.context;
            break e;
          case 1:
            if (Nn(i.type)) {
              i = i.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        i = i.return;
      } while (i !== null);
      throw Error(t(171));
    }
    if (n.tag === 1) {
      var a = n.type;
      if (Nn(a)) return kh(n, a, i);
    }
    return i;
  }
  function um(n, i, a, c, p, g, w, N, k) {
    return n = Wu(a, c, !0, n, p, g, w, N, k), n.context = cm(null), a = n.current, c = wn(), p = _r(a), g = Bi(c, p), g.callback = i ?? null, pr(a, g, p), n.current.lanes = p, nr(n, p, c), Fn(n, c), n;
  }
  function _l(n, i, a, c) {
    var p = i.current, g = wn(), w = _r(p);
    return a = cm(a), i.context === null ? i.context = a : i.pendingContext = a, i = Bi(g, w), i.payload = { element: n }, c = c === void 0 ? null : c, c !== null && (i.callback = c), n = pr(p, i, w), n !== null && (pi(n, p, w, g), $a(n, p, w)), w;
  }
  function xl(n) {
    return n = n.current, n.child ? (n.child.tag === 5, n.child.stateNode) : null;
  }
  function dm(n, i) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var a = n.retryLane;
      n.retryLane = a !== 0 && a < i ? a : i;
    }
  }
  function Xu(n, i) {
    dm(n, i), (n = n.alternate) && dm(n, i);
  }
  function Qv() {
    return null;
  }
  var fm = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function ju(n) {
    this._internalRoot = n;
  }
  yl.prototype.render = ju.prototype.render = function(n) {
    var i = this._internalRoot;
    if (i === null) throw Error(t(409));
    _l(n, i, null, null);
  }, yl.prototype.unmount = ju.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var i = n.containerInfo;
      Gr(function() {
        _l(null, n, null, null);
      }), i[Ii] = null;
    }
  };
  function yl(n) {
    this._internalRoot = n;
  }
  yl.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var i = $f();
      n = { blockedOn: null, target: n, priority: i };
      for (var a = 0; a < or.length && i !== 0 && i < or[a].priority; a++) ;
      or.splice(a, 0, n), a === 0 && Qf(n);
    }
  };
  function Yu(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function Sl(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function hm() {
  }
  function Jv(n, i, a, c, p) {
    if (p) {
      if (typeof c == "function") {
        var g = c;
        c = function() {
          var re = xl(w);
          g.call(re);
        };
      }
      var w = um(i, c, n, 0, null, !1, !1, "", hm);
      return n._reactRootContainer = w, n[Ii] = w.current, Oo(n.nodeType === 8 ? n.parentNode : n), Gr(), w;
    }
    for (; p = n.lastChild; ) n.removeChild(p);
    if (typeof c == "function") {
      var N = c;
      c = function() {
        var re = xl(k);
        N.call(re);
      };
    }
    var k = Wu(n, 0, !1, null, null, !1, !1, "", hm);
    return n._reactRootContainer = k, n[Ii] = k.current, Oo(n.nodeType === 8 ? n.parentNode : n), Gr(function() {
      _l(i, k, a, c);
    }), k;
  }
  function Ml(n, i, a, c, p) {
    var g = a._reactRootContainer;
    if (g) {
      var w = g;
      if (typeof p == "function") {
        var N = p;
        p = function() {
          var k = xl(w);
          N.call(k);
        };
      }
      _l(i, w, n, p);
    } else w = Jv(a, i, n, p, c);
    return xl(w);
  }
  Yf = function(n) {
    switch (n.tag) {
      case 3:
        var i = n.stateNode;
        if (i.current.memoizedState.isDehydrated) {
          var a = Ni(i.pendingLanes);
          a !== 0 && (vc(i, a | 1), Fn(i, Ae()), (yt & 6) === 0 && (Is = Ae() + 500, fr()));
        }
        break;
      case 13:
        Gr(function() {
          var c = Oi(n, 1);
          if (c !== null) {
            var p = wn();
            pi(c, n, 1, p);
          }
        }), Xu(n, 1);
    }
  }, _c = function(n) {
    if (n.tag === 13) {
      var i = Oi(n, 134217728);
      if (i !== null) {
        var a = wn();
        pi(i, n, 134217728, a);
      }
      Xu(n, 134217728);
    }
  }, qf = function(n) {
    if (n.tag === 13) {
      var i = _r(n), a = Oi(n, i);
      if (a !== null) {
        var c = wn();
        pi(a, n, i, c);
      }
      Xu(n, i);
    }
  }, $f = function() {
    return bt;
  }, Kf = function(n, i) {
    var a = bt;
    try {
      return bt = n, i();
    } finally {
      bt = a;
    }
  }, le = function(n, i, a) {
    switch (i) {
      case "input":
        if (Ze(n, a), i = a.name, a.type === "radio" && i != null) {
          for (a = n; a.parentNode; ) a = a.parentNode;
          for (a = a.querySelectorAll("input[name=" + JSON.stringify("" + i) + '][type="radio"]'), i = 0; i < a.length; i++) {
            var c = a[i];
            if (c !== n && c.form === n.form) {
              var p = Ba(c);
              if (!p) throw Error(t(90));
              at(c), Ze(c, p);
            }
          }
        }
        break;
      case "textarea":
        xe(n, a);
        break;
      case "select":
        i = a.value, i != null && b(n, !!a.multiple, i, !1);
    }
  }, cn = Ou, xt = Gr;
  var e_ = { usingClientEntryPoint: !1, Events: [Ho, Ss, Ba, _t, zt, Ou] }, ta = { findFiberByHostInstance: Ur, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, t_ = { bundleType: ta.bundleType, version: ta.version, rendererPackageName: ta.rendererPackageName, rendererConfig: ta.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: D.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = X(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: ta.findFiberByHostInstance || Qv, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var El = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!El.isDisabled && El.supportsFiber) try {
      Dt = El.inject(t_), Ot = El;
    } catch {
    }
  }
  return kn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = e_, kn.createPortal = function(n, i) {
    var a = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Yu(i)) throw Error(t(200));
    return Zv(n, i, null, a);
  }, kn.createRoot = function(n, i) {
    if (!Yu(n)) throw Error(t(299));
    var a = !1, c = "", p = fm;
    return i != null && (i.unstable_strictMode === !0 && (a = !0), i.identifierPrefix !== void 0 && (c = i.identifierPrefix), i.onRecoverableError !== void 0 && (p = i.onRecoverableError)), i = Wu(n, 1, !1, null, null, a, !1, c, p), n[Ii] = i.current, Oo(n.nodeType === 8 ? n.parentNode : n), new ju(i);
  }, kn.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var i = n._reactInternals;
    if (i === void 0)
      throw typeof n.render == "function" ? Error(t(188)) : (n = Object.keys(n).join(","), Error(t(268, n)));
    return n = X(i), n = n === null ? null : n.stateNode, n;
  }, kn.flushSync = function(n) {
    return Gr(n);
  }, kn.hydrate = function(n, i, a) {
    if (!Sl(i)) throw Error(t(200));
    return Ml(null, n, i, !0, a);
  }, kn.hydrateRoot = function(n, i, a) {
    if (!Yu(n)) throw Error(t(405));
    var c = a != null && a.hydratedSources || null, p = !1, g = "", w = fm;
    if (a != null && (a.unstable_strictMode === !0 && (p = !0), a.identifierPrefix !== void 0 && (g = a.identifierPrefix), a.onRecoverableError !== void 0 && (w = a.onRecoverableError)), i = um(i, null, n, 1, a ?? null, p, !1, g, w), n[Ii] = i.current, Oo(n), c) for (n = 0; n < c.length; n++) a = c[n], p = a._getVersion, p = p(a._source), i.mutableSourceEagerHydrationData == null ? i.mutableSourceEagerHydrationData = [a, p] : i.mutableSourceEagerHydrationData.push(
      a,
      p
    );
    return new yl(i);
  }, kn.render = function(n, i, a) {
    if (!Sl(i)) throw Error(t(200));
    return Ml(null, n, i, !1, a);
  }, kn.unmountComponentAtNode = function(n) {
    if (!Sl(n)) throw Error(t(40));
    return n._reactRootContainer ? (Gr(function() {
      Ml(null, null, n, !1, function() {
        n._reactRootContainer = null, n[Ii] = null;
      });
    }), !0) : !1;
  }, kn.unstable_batchedUpdates = Ou, kn.unstable_renderSubtreeIntoContainer = function(n, i, a, c) {
    if (!Sl(a)) throw Error(t(200));
    if (n == null || n._reactInternals === void 0) throw Error(t(38));
    return Ml(n, i, a, !1, c);
  }, kn.version = "18.3.1-next-f1338f8080-20240426", kn;
}
var Sm;
function u_() {
  if (Sm) return Ku.exports;
  Sm = 1;
  function s() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (e) {
        console.error(e);
      }
  }
  return s(), Ku.exports = c_(), Ku.exports;
}
var Mm;
function d_() {
  if (Mm) return wl;
  Mm = 1;
  var s = u_();
  return wl.createRoot = s.createRoot, wl.hydrateRoot = s.hydrateRoot, wl;
}
var f_ = d_(), gt = Cf();
class h_ {
  context = null;
  master = null;
  muted = !1;
  unlock() {
    if (!this.muted)
      try {
        this.context || (this.context = new AudioContext(), this.master = this.context.createGain(), this.master.gain.value = 0.18, this.master.connect(this.context.destination)), this.context.resume().catch(() => {
        });
      } catch {
      }
  }
  setMuted(e) {
    this.muted = e, this.context && this.master && this.master.gain.setTargetAtTime(e ? 0 : 0.18, this.context.currentTime, 0.02);
  }
  play(e) {
    const t = this.context;
    if (!t || !this.master || this.muted) return;
    (e === "win" ? [440, 554, 659, 880] : e === "turn" ? [440, 659] : e === "chip" ? [1100, 1450] : e === "fold" ? [150] : [360]).forEach((o, l) => {
      const u = t.createOscillator(), d = t.createGain(), f = t.currentTime + l * 0.07, h = e === "win" ? 0.35 : 0.09;
      u.type = e === "card" ? "triangle" : "sine", u.frequency.setValueAtTime(o, f), u.frequency.exponentialRampToValueAtTime(o * 0.65, f + h), d.gain.setValueAtTime(0, f), d.gain.linearRampToValueAtTime(0.3, f + 6e-3), d.gain.exponentialRampToValueAtTime(1e-3, f + h), u.connect(d), d.connect(this.master), u.start(f), u.stop(f + h + 0.02), u.onended = () => {
        u.disconnect(), d.disconnect();
      };
    });
  }
  dispose() {
    this.context?.close().catch(() => {
    }), this.context = null, this.master = null;
  }
}
const Ud = (s) => s % 13 + 2, Ki = (s) => Math.floor(s / 13), va = ["♣", "♦", "♥", "♠"], sc = (s) => ({ 11: "J", 12: "Q", 13: "K", 14: "A" })[Ud(s)] ?? String(Ud(s)), p_ = (s) => `${sc(s)}${va[Ki(s)]}`, m_ = ["High card", "One pair", "Two pair", "Three of a kind", "Straight", "Flush", "Full house", "Four of a kind", "Straight flush"];
function g_(s) {
  const e = Array.from({ length: 52 }, (t, r) => r);
  for (let t = 51; t > 0; t--) {
    const r = Math.floor(s() * (t + 1));
    [e[t], e[r]] = [e[r], e[t]];
  }
  return e;
}
function v_(s) {
  if (s.length !== 5) throw new Error("A five-card hand is required.");
  const e = s.map(Ud).sort((h, m) => m - h), t = /* @__PURE__ */ new Map();
  for (const h of e) t.set(h, (t.get(h) ?? 0) + 1);
  const r = [...t].sort((h, m) => m[1] - h[1] || m[0] - h[0]), o = s.every((h) => Ki(h) === Ki(s[0])), l = t.size === 5 ? e[0] - e[4] === 4 ? e[0] : e.join(",") === "14,5,4,3,2" ? 5 : 0 : 0;
  let u = 0, d = e;
  l && o ? (u = 8, d = [l]) : r[0][1] === 4 ? (u = 7, d = r.map((h) => h[0])) : r[0][1] === 3 && r[1][1] === 2 ? (u = 6, d = r.map((h) => h[0])) : o ? u = 5 : l ? (u = 4, d = [l]) : r[0][1] === 3 ? (u = 3, d = r.map((h) => h[0])) : r[0][1] === 2 && r[1][1] === 2 ? (u = 2, d = r.map((h) => h[0])) : r[0][1] === 2 && (u = 1, d = r.map((h) => h[0]));
  let f = u;
  for (let h = 0; h < 5; h++) f = f * 15 + (d[h] ?? 0);
  return { score: f, category: u, name: u === 8 && l === 14 ? "Royal flush" : m_[u], cards: [...s] };
}
function oc(s) {
  if (s.length < 5 || s.length > 7 || new Set(s).size !== s.length || s.some((t) => !Number.isInteger(t) || t < 0 || t > 51)) throw new Error("Invalid poker cards.");
  let e;
  for (let t = 0; t < s.length - 4; t++)
    for (let r = t + 1; r < s.length - 3; r++)
      for (let o = r + 1; o < s.length - 2; o++)
        for (let l = o + 1; l < s.length - 1; l++)
          for (let u = l + 1; u < s.length; u++) {
            const d = v_([s[t], s[r], s[o], s[l], s[u]]);
            (!e || d.score > e.score) && (e = d);
          }
  return e;
}
const _i = [
  { name: "You", color: "#b8e58b", title: "The newcomer", style: "balanced" },
  { name: "Juno", color: "#e7ab71", title: "The wild card", style: "loose" },
  { name: "Moss", color: "#97bea8", title: "Quiet confidence", style: "tight" },
  { name: "Cleo", color: "#c6a3d9", title: "Always a read ahead", style: "balanced" },
  { name: "Rook", color: "#88b7d8", title: "Pressure makes diamonds", style: "aggressive" },
  { name: "Sol", color: "#e3ce84", title: "Here for the long game", style: "steady" }
], Fd = ["Pre-flop", "Flop", "Turn", "River"], Qt = (s) => Number.isSafeInteger(s) && s >= 0 && s <= 1e6, Em = (s) => structuredClone(s);
class no {
  constructor(e = Math.random, t = Array(6).fill(2e3)) {
    if (this.random = e, t.length < 2 || t.length > 6 || t.some((r) => !Qt(r)) || t.filter((r) => r > 0).length < 2)
      throw new Error("A table needs two to six funded seats.");
    this.state = {
      version: 1,
      revision: 0,
      handNumber: 0,
      phase: "ready",
      street: 0,
      dealer: -1,
      smallBlindSeat: -1,
      bigBlindSeat: -1,
      smallBlind: 10,
      bigBlind: 20,
      initialTotal: t.reduce((r, o) => r + o, 0),
      players: t.map((r, o) => ({ seat: o, stack: r, hole: [], folded: !1, bet: 0, committed: 0, startStack: r, action: "", actedAt: null })),
      deck: [],
      cursor: 0,
      board: [],
      currentBet: 0,
      lastFullRaise: 20,
      pending: [],
      actor: null,
      awards: [],
      results: [],
      log: [],
      history: []
    };
  }
  random;
  state;
  snapshot() {
    return Em(this.state);
  }
  get pot() {
    return this.state.players.reduce((e, t) => e + t.committed, 0);
  }
  startHand(e) {
    const t = this.state;
    if (t.phase !== "ready" && t.phase !== "complete") throw new Error("Finish this hand first.");
    const r = t.players.filter((u) => u.stack > 0);
    if (r.length < 2) throw new Error("The table is complete.");
    const o = e ? [...e] : g_(this.random);
    if (o.length !== 52 || new Set(o).size !== 52 || o.some((u) => !Number.isInteger(u) || u < 0 || u >= 52))
      throw new Error("The deck must contain all 52 unique cards.");
    const l = t.bigBlindSeat;
    t.handNumber++, t.street = 0, t.board = [], t.awards = [], t.results = [], t.log = [], t.deck = o, t.cursor = 0, t.currentBet = t.bigBlind, t.lastFullRaise = t.bigBlind;
    for (const u of t.players)
      u.hole = [], u.folded = u.stack === 0, u.bet = 0, u.committed = 0, u.startStack = u.stack, u.action = u.folded ? "Out" : "", u.actedAt = null;
    t.dealer = this.next(t.dealer, (u) => u.stack > 0), r.length === 2 && l >= 0 && (t.bigBlindSeat = this.next(l, (u) => u.stack > 0), t.dealer = this.next(t.bigBlindSeat, (u) => u.stack > 0)), t.smallBlindSeat = r.length === 2 ? t.dealer : this.next(t.dealer, (u) => u.stack > 0), t.bigBlindSeat = this.next(t.smallBlindSeat, (u) => u.stack > 0);
    for (let u = 0; u < 2; u++) {
      let d = t.dealer;
      for (let f = 0; f < r.length; f++)
        d = this.next(d, (h) => !h.folded), t.players[d].hole.push(this.draw());
    }
    this.pay(t.smallBlindSeat, t.smallBlind, "Small blind"), this.pay(t.bigBlindSeat, t.bigBlind, "Big blind"), t.phase = "betting", t.pending = this.orderAfter(t.bigBlindSeat).filter((u) => this.canAct(t.players[u])), this.selectActor(), this.changed();
  }
  legal(e = this.state.actor) {
    const t = this.state, r = { fold: !1, check: !1, call: 0, raise: !1, min: 0, max: 0, shortOnly: !1 };
    if (e === null || e !== t.actor || t.phase !== "betting") return r;
    const o = t.players[e], l = Math.max(0, t.currentBet - o.bet), u = o.bet + o.stack, d = t.currentBet < t.bigBlind ? t.bigBlind : t.currentBet + t.lastFullRaise, f = o.actedAt === null || o.actedAt === 0 || t.currentBet - o.actedAt >= t.lastFullRaise, h = t.players.some((m) => m.seat !== e && this.canAct(m));
    return {
      fold: !0,
      check: l === 0,
      call: Math.min(l, o.stack),
      raise: f && h && u > t.currentBet,
      min: Math.min(d, u),
      max: u,
      shortOnly: u < d
    };
  }
  act(e, t) {
    const r = this.state;
    if (r.actor !== e || r.phase !== "betting") throw new Error("It is not that seat’s turn.");
    const o = r.players[e], l = this.legal(e);
    if (t.type === "fold")
      o.folded = !0, o.action = "Fold", this.note(`${_i[e].name} folds`);
    else if (t.type === "check") {
      if (!l.check) throw new Error("A bet must be called or folded.");
      o.action = "Check", o.actedAt = r.currentBet, this.note(`${_i[e].name} checks`);
    } else if (t.type === "call") {
      if (l.call === 0) throw new Error("There is no bet to call.");
      this.pay(e, l.call, "Call"), o.actedAt = r.currentBet;
    } else {
      if (!l.raise || !Qt(t.to) || t.to < l.min || t.to > l.max)
        throw new Error("That raise is not legal.");
      const d = t.to - r.currentBet, f = d >= r.lastFullRaise || r.currentBet < r.bigBlind && t.to >= r.bigBlind, h = r.currentBet === 0;
      this.pay(e, t.to - o.bet, h ? "Bet" : "Raise"), r.currentBet = t.to, f && (r.lastFullRaise = Math.max(r.bigBlind, d)), o.actedAt = r.currentBet, r.pending = this.orderAfter(e).filter((m) => this.canAct(r.players[m]) && r.players[m].bet < r.currentBet);
    }
    r.pending = r.pending.filter((d) => d !== e && this.canAct(r.players[d]));
    const u = r.players.filter((d) => !d.folded && d.hole.length === 2);
    u.length === 1 ? this.settleUncontested(u[0].seat) : this.selectActor(), this.changed();
  }
  /** The controller calls this after a readable pause. Keeping street progression
   * explicit makes the same engine deterministic in tests and resumable on disk. */
  advance() {
    const e = this.state;
    if (e.phase === "showdown") {
      this.settleShowdown(), this.changed();
      return;
    }
    if (e.phase !== "transition") throw new Error("No street transition is pending.");
    if (e.street === 3) {
      e.phase = "showdown", this.changed();
      return;
    }
    e.street++, this.draw();
    for (let t = 0; t < (e.street === 1 ? 3 : 1); t++) e.board.push(this.draw());
    for (const t of e.players)
      t.bet = 0, t.actedAt = null, t.folded || (t.action = t.stack === 0 ? "All-in" : "");
    e.currentBet = 0, e.lastFullRaise = e.bigBlind, this.note(Fd[e.street]), e.phase = "betting", e.pending = this.orderAfter(e.dealer).filter((t) => this.canAct(e.players[t])), this.selectActor(), this.changed();
  }
  selectActor() {
    const e = this.state, t = e.players.filter((r) => this.canAct(r));
    if (t.length <= 1) {
      const r = t[0], o = Math.max(0, ...e.players.filter((l) => !l.folded && l.seat !== r?.seat).map((l) => l.bet));
      (!r || r.bet >= o) && (e.pending = []);
    }
    e.actor = e.pending[0] ?? null, e.actor === null && (this.returnUncalled(), e.phase = "transition");
  }
  canAct(e) {
    return !e.folded && e.hole.length === 2 && e.stack > 0;
  }
  next(e, t) {
    for (const r of this.orderAfter(e)) if (t(this.state.players[r])) return r;
    throw new Error("No eligible seat.");
  }
  orderAfter(e) {
    const t = this.state.players.length;
    return Array.from({ length: t }, (r, o) => (e + o + 1 + t) % t);
  }
  draw() {
    return this.state.deck[this.state.cursor++];
  }
  pay(e, t, r) {
    const o = this.state.players[e], l = Math.min(t, o.stack);
    o.stack -= l, o.bet += l, o.committed += l, o.action = o.stack === 0 ? `All-in ${o.bet}` : `${r} ${o.bet}`, this.note(`${_i[e].name} ${o.action.toLowerCase()}`);
  }
  note(e) {
    this.state.log = [...this.state.log, e].slice(-60);
  }
  returnUncalled() {
    const e = [...this.state.players].sort((r, o) => o.bet - r.bet), t = e[0].bet - e[1].bet;
    if (t > 0 && !e[0].folded) {
      const r = e[0];
      r.bet -= t, r.committed -= t, r.stack += t, this.note(`${_i[r.seat].name} receives ${t} uncalled chips back`);
    }
  }
  settleUncontested(e) {
    this.returnUncalled();
    const t = this.pot;
    this.state.awards = [{ amount: t, winners: [e], shares: [t], label: "Uncontested pot" }], this.state.results = [{ seat: e, hand: null, won: t }], this.state.players[e].stack += t, this.complete();
  }
  settleShowdown() {
    const e = this.state, t = e.players.filter((u) => !u.folded && u.hole.length === 2), r = new Map(t.map((u) => [u.seat, oc([...u.hole, ...e.board])]));
    e.results = t.map((u) => ({ seat: u.seat, hand: r.get(u.seat), won: 0 })), e.awards = [];
    const o = [...new Set(e.players.map((u) => u.committed).filter((u) => u > 0))].sort((u, d) => u - d);
    let l = 0;
    for (const u of o) {
      const d = e.players.filter((y) => y.committed >= u), f = (u - l) * d.length;
      l = u;
      const h = d.filter((y) => !y.folded), m = Math.max(...h.map((y) => r.get(y.seat).score)), _ = h.filter((y) => r.get(y.seat).score === m).map((y) => y.seat), v = this.orderAfter(e.dealer).filter((y) => _.includes(y));
      if (!v.length) throw new Error("A pot has no eligible winner.");
      const S = v.map((y, E) => Math.floor(f / v.length) + (E < f % v.length ? 1 : 0));
      v.forEach((y, E) => {
        e.players[y].stack += S[E], e.results.find((x) => x.seat === y).won += S[E];
      }), e.awards.push({ amount: f, winners: v, shares: S, label: e.awards.length ? `Side pot ${e.awards.length}` : "Main pot" });
    }
    this.complete();
  }
  complete() {
    const e = this.state, r = e.results.filter((o) => o.won > 0).map((o) => `${_i[o.seat].name} +${o.won}${o.hand ? ` · ${o.hand.name}` : ""}`).join(" / ");
    this.note(r), e.history = [{
      number: e.handNumber,
      board: [...e.board],
      summary: r,
      net: e.players[0].stack - e.players[0].startStack,
      log: [...e.log]
    }, ...e.history].slice(0, 12);
    for (const o of e.players)
      o.committed = 0, o.bet = 0;
    e.phase = "complete", e.actor = null, e.pending = [];
  }
  changed() {
    const e = this.state;
    if (e.revision++, e.players.some((t) => !Qt(t.stack) || !Qt(t.committed)) || e.players.reduce((t, r) => t + r.stack + r.committed, 0) !== e.initialTotal)
      throw new Error("Poker chip conservation failed.");
  }
  static restore(e, t = Math.random) {
    const r = Em(e), o = () => {
      throw new Error("The saved table could not be restored. Your saved data has been preserved.");
    };
    (!r || r.version !== 1 || !["ready", "betting", "transition", "showdown", "complete"].includes(r.phase) || !Array.isArray(r.players) || r.players.length < 2 || r.players.length > 6 || !Qt(r.revision) || !Qt(r.handNumber) || !Qt(r.initialTotal) || !Number.isInteger(r.street) || r.street < 0 || r.street > 3 || r.smallBlind !== 10 || r.bigBlind !== 20 || !Qt(r.currentBet) || !Qt(r.lastFullRaise) || r.lastFullRaise < 20) && o();
    const l = (h) => Number.isInteger(h) && Number(h) >= 0 && Number(h) < 52;
    for (const [h, m] of r.players.entries())
      (!m || m.seat !== h || !Qt(m.stack) || !Qt(m.bet) || !Qt(m.committed) || m.bet > m.committed || !Qt(m.startStack) || typeof m.folded != "boolean" || typeof m.action != "string" || m.action.length > 80 || !(m.actedAt === null || Qt(m.actedAt)) || !Array.isArray(m.hole) || ![0, 2].includes(m.hole.length) || !m.hole.every(l)) && o();
    (r.players.reduce((h, m) => h + m.stack + m.committed, 0) !== r.initialTotal || !Array.isArray(r.deck) || ![0, 52].includes(r.deck.length) || !r.deck.every(l) || new Set(r.deck).size !== r.deck.length || !Array.isArray(r.board) || ![0, 3, 4, 5].includes(r.board.length) || !r.board.every(l) || !Number.isInteger(r.cursor) || r.cursor < 0 || r.cursor > 52) && o();
    const u = [...r.board, ...r.players.flatMap((h) => h.hole)];
    (new Set(u).size !== u.length || u.some((h) => !r.deck.slice(0, r.cursor).includes(h))) && o();
    const d = (h) => Number.isInteger(h) && Number(h) >= 0 && Number(h) < r.players.length;
    (![r.dealer, r.smallBlindSeat, r.bigBlindSeat].every((h) => r.phase === "ready" ? h === -1 : d(h)) || !Array.isArray(r.pending) || new Set(r.pending).size !== r.pending.length || !r.pending.every(d) || r.pending.some((h) => r.players[h].folded || r.players[h].stack === 0 || r.players[h].hole.length !== 2) || (r.phase === "betting" ? !d(r.actor) || r.actor !== r.pending[0] : r.actor !== null || r.pending.length !== 0)) && o(), (!Array.isArray(r.log) || r.log.length > 60 || r.log.some((h) => typeof h != "string" || h.length > 300) || !Array.isArray(r.history) || r.history.length > 12 || !Array.isArray(r.results) || !Array.isArray(r.awards)) && o();
    for (const h of r.history) (!h || !Qt(h.number) || !Number.isSafeInteger(h.net) || typeof h.summary != "string" || h.summary.length > 800 || !Array.isArray(h.board) || h.board.length > 5 || !h.board.every(l) || !Array.isArray(h.log) || h.log.length > 60 || h.log.some((m) => typeof m != "string" || m.length > 300)) && o();
    for (const h of r.awards) (!h || !Qt(h.amount) || typeof h.label != "string" || h.label.length > 50 || !Array.isArray(h.winners) || !h.winners.every(d) || !Array.isArray(h.shares) || h.shares.length !== h.winners.length || !h.shares.every(Qt)) && o();
    for (const h of r.results) (!h || !d(h.seat) || !Qt(h.won) || h.hand !== null && (!h.hand || !Qt(h.hand.score) && !Number.isSafeInteger(h.hand.score) || typeof h.hand.name != "string" || h.hand.name.length > 40 || !Array.isArray(h.hand.cards) || h.hand.cards.length !== 5 || !h.hand.cards.every(l))) && o();
    const f = new no(t);
    return f.state = r, f;
  }
}
function __(s, e) {
  const t = s.actor;
  return {
    seat: t,
    hole: [...s.players[t].hole],
    board: [...s.board],
    opponents: s.players.filter((r) => r.seat !== t && !r.folded && r.hole.length === 2).length,
    pot: s.players.reduce((r, o) => r + o.committed, 0),
    bigBlind: s.bigBlind,
    currentBet: s.currentBet,
    bet: s.players[t].bet,
    legal: { ...e }
  };
}
function x_(s, e, t = 56) {
  const r = /* @__PURE__ */ new Set([...s.hole, ...s.board]), o = Array.from({ length: 52 }, (u, d) => d).filter((u) => !r.has(u));
  let l = 0;
  for (let u = 0; u < t; u++) {
    const d = [...o], f = 5 - s.board.length + s.opponents * 2;
    for (let y = 0; y < f; y++) {
      const E = y + Math.floor(e() * (d.length - y));
      [d[y], d[E]] = [d[E], d[y]];
    }
    let h = 5 - s.board.length;
    const m = [...s.board, ...d.slice(0, h)], _ = oc([...s.hole, ...m]).score;
    let v = 1, S = !1;
    for (let y = 0; y < s.opponents; y++) {
      const E = oc([d[h++], d[h++], ...m]).score;
      if (E > _) {
        S = !0;
        break;
      }
      E === _ && v++;
    }
    S || (l += 1 / v);
  }
  return l / t;
}
function y_(s, e = Math.random) {
  const t = _i[s.seat].style, r = t === "loose" ? 0.11 : t === "tight" ? -0.05 : t === "aggressive" ? 0.06 : 0, o = x_(s, e) + r + (e() - 0.5) * 0.1, l = s.legal.call / Math.max(1, s.pot + s.legal.call), u = e() < (t === "aggressive" ? 0.15 : t === "tight" ? 0.025 : 0.07);
  if (s.legal.raise && (o > Math.max(0.48, 1 / (s.opponents + 1) + 0.2) || u)) {
    const d = Math.round((s.pot + s.legal.call) * (t === "aggressive" ? 0.8 : 0.55));
    return { type: "raise", to: Math.min(s.legal.max, Math.max(s.legal.min, s.currentBet + Math.max(s.bigBlind, d))) };
  }
  return s.legal.check ? { type: "check" } : o >= l + (t === "tight" ? 0.08 : 0.015) || s.legal.call <= s.bigBlind && o > 0.14 ? { type: "call" } : { type: "fold" };
}
const Rf = "169", S_ = 0, wm = 1, M_ = 2, N0 = 1, I0 = 2, qi = 3, Lr = 0, zn = 1, $n = 2, Zi = 0, ro = 1, kd = 2, Tm = 3, bm = 4, E_ = 5, ns = 100, w_ = 101, T_ = 102, b_ = 103, A_ = 104, C_ = 200, R_ = 201, P_ = 202, L_ = 203, Od = 204, Bd = 205, D_ = 206, N_ = 207, I_ = 208, U_ = 209, F_ = 210, k_ = 211, O_ = 212, B_ = 213, z_ = 214, zd = 0, Hd = 1, Vd = 2, lo = 3, Gd = 4, Wd = 5, Xd = 6, jd = 7, U0 = 0, H_ = 1, V_ = 2, Pr = 0, F0 = 1, k0 = 2, O0 = 3, Pf = 4, G_ = 5, B0 = 6, z0 = 7, H0 = 300, co = 301, uo = 302, Yd = 303, qd = 304, pc = 306, $d = 1e3, rs = 1001, Kd = 1002, Bn = 1003, W_ = 1004, Tl = 1005, xi = 1006, Ju = 1007, ss = 1008, Ji = 1009, V0 = 1010, G0 = 1011, _a = 1012, Lf = 1013, os = 1014, Ci = 1015, Ri = 1016, Df = 1017, Nf = 1018, fo = 1020, W0 = 35902, X0 = 1021, j0 = 1022, Si = 1023, Y0 = 1024, q0 = 1025, so = 1026, ho = 1027, If = 1028, Uf = 1029, $0 = 1030, Ff = 1031, kf = 1033, Ql = 33776, Jl = 33777, ec = 33778, tc = 33779, Zd = 35840, Qd = 35841, Jd = 35842, ef = 35843, tf = 36196, nf = 37492, rf = 37496, sf = 37808, of = 37809, af = 37810, lf = 37811, cf = 37812, uf = 37813, df = 37814, ff = 37815, hf = 37816, pf = 37817, mf = 37818, gf = 37819, vf = 37820, _f = 37821, nc = 36492, xf = 36494, yf = 36495, K0 = 36283, Sf = 36284, Mf = 36285, Ef = 36286, X_ = 3200, j_ = 3201, Z0 = 0, Y_ = 1, Cr = "", yn = "srgb", Nr = "srgb-linear", Of = "display-p3", mc = "display-p3-linear", ac = "linear", Ut = "srgb", lc = "rec709", cc = "p3", Fs = 7680, Am = 519, q_ = 512, $_ = 513, K_ = 514, Q0 = 515, Z_ = 516, Q_ = 517, J_ = 518, ex = 519, wf = 35044, tx = 35048, Cm = "300 es", $i = 2e3, uc = 2001;
class vo {
  addEventListener(e, t) {
    this._listeners === void 0 && (this._listeners = {});
    const r = this._listeners;
    r[e] === void 0 && (r[e] = []), r[e].indexOf(t) === -1 && r[e].push(t);
  }
  hasEventListener(e, t) {
    if (this._listeners === void 0) return !1;
    const r = this._listeners;
    return r[e] !== void 0 && r[e].indexOf(t) !== -1;
  }
  removeEventListener(e, t) {
    if (this._listeners === void 0) return;
    const o = this._listeners[e];
    if (o !== void 0) {
      const l = o.indexOf(t);
      l !== -1 && o.splice(l, 1);
    }
  }
  dispatchEvent(e) {
    if (this._listeners === void 0) return;
    const r = this._listeners[e.type];
    if (r !== void 0) {
      e.target = this;
      const o = r.slice(0);
      for (let l = 0, u = o.length; l < u; l++)
        o[l].call(this, e);
      e.target = null;
    }
  }
}
const _n = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
let Rm = 1234567;
const ma = Math.PI / 180, po = 180 / Math.PI;
function Qi() {
  const s = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, r = Math.random() * 4294967295 | 0;
  return (_n[s & 255] + _n[s >> 8 & 255] + _n[s >> 16 & 255] + _n[s >> 24 & 255] + "-" + _n[e & 255] + _n[e >> 8 & 255] + "-" + _n[e >> 16 & 15 | 64] + _n[e >> 24 & 255] + "-" + _n[t & 63 | 128] + _n[t >> 8 & 255] + "-" + _n[t >> 16 & 255] + _n[t >> 24 & 255] + _n[r & 255] + _n[r >> 8 & 255] + _n[r >> 16 & 255] + _n[r >> 24 & 255]).toLowerCase();
}
function Cn(s, e, t) {
  return Math.max(e, Math.min(t, s));
}
function Bf(s, e) {
  return (s % e + e) % e;
}
function nx(s, e, t, r, o) {
  return r + (s - e) * (o - r) / (t - e);
}
function ix(s, e, t) {
  return s !== e ? (t - s) / (e - s) : 0;
}
function ga(s, e, t) {
  return (1 - t) * s + t * e;
}
function rx(s, e, t, r) {
  return ga(s, e, 1 - Math.exp(-t * r));
}
function sx(s, e = 1) {
  return e - Math.abs(Bf(s, e * 2) - e);
}
function ox(s, e, t) {
  return s <= e ? 0 : s >= t ? 1 : (s = (s - e) / (t - e), s * s * (3 - 2 * s));
}
function ax(s, e, t) {
  return s <= e ? 0 : s >= t ? 1 : (s = (s - e) / (t - e), s * s * s * (s * (s * 6 - 15) + 10));
}
function lx(s, e) {
  return s + Math.floor(Math.random() * (e - s + 1));
}
function cx(s, e) {
  return s + Math.random() * (e - s);
}
function ux(s) {
  return s * (0.5 - Math.random());
}
function dx(s) {
  s !== void 0 && (Rm = s);
  let e = Rm += 1831565813;
  return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
}
function fx(s) {
  return s * ma;
}
function hx(s) {
  return s * po;
}
function px(s) {
  return (s & s - 1) === 0 && s !== 0;
}
function mx(s) {
  return Math.pow(2, Math.ceil(Math.log(s) / Math.LN2));
}
function gx(s) {
  return Math.pow(2, Math.floor(Math.log(s) / Math.LN2));
}
function vx(s, e, t, r, o) {
  const l = Math.cos, u = Math.sin, d = l(t / 2), f = u(t / 2), h = l((e + r) / 2), m = u((e + r) / 2), _ = l((e - r) / 2), v = u((e - r) / 2), S = l((r - e) / 2), y = u((r - e) / 2);
  switch (o) {
    case "XYX":
      s.set(d * m, f * _, f * v, d * h);
      break;
    case "YZY":
      s.set(f * v, d * m, f * _, d * h);
      break;
    case "ZXZ":
      s.set(f * _, f * v, d * m, d * h);
      break;
    case "XZX":
      s.set(d * m, f * y, f * S, d * h);
      break;
    case "YXY":
      s.set(f * S, d * m, f * y, d * h);
      break;
    case "ZYZ":
      s.set(f * y, f * S, d * m, d * h);
      break;
    default:
      console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + o);
  }
}
function yi(s, e) {
  switch (e.constructor) {
    case Float32Array:
      return s;
    case Uint32Array:
      return s / 4294967295;
    case Uint16Array:
      return s / 65535;
    case Uint8Array:
      return s / 255;
    case Int32Array:
      return Math.max(s / 2147483647, -1);
    case Int16Array:
      return Math.max(s / 32767, -1);
    case Int8Array:
      return Math.max(s / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function At(s, e) {
  switch (e.constructor) {
    case Float32Array:
      return s;
    case Uint32Array:
      return Math.round(s * 4294967295);
    case Uint16Array:
      return Math.round(s * 65535);
    case Uint8Array:
      return Math.round(s * 255);
    case Int32Array:
      return Math.round(s * 2147483647);
    case Int16Array:
      return Math.round(s * 32767);
    case Int8Array:
      return Math.round(s * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const An = {
  DEG2RAD: ma,
  RAD2DEG: po,
  generateUUID: Qi,
  clamp: Cn,
  euclideanModulo: Bf,
  mapLinear: nx,
  inverseLerp: ix,
  lerp: ga,
  damp: rx,
  pingpong: sx,
  smoothstep: ox,
  smootherstep: ax,
  randInt: lx,
  randFloat: cx,
  randFloatSpread: ux,
  seededRandom: dx,
  degToRad: fx,
  radToDeg: hx,
  isPowerOfTwo: px,
  ceilPowerOfTwo: mx,
  floorPowerOfTwo: gx,
  setQuaternionFromProperEuler: vx,
  normalize: At,
  denormalize: yi
};
class Qe {
  constructor(e = 0, t = 0) {
    Qe.prototype.isVector2 = !0, this.x = e, this.y = t;
  }
  get width() {
    return this.x;
  }
  set width(e) {
    this.x = e;
  }
  get height() {
    return this.y;
  }
  set height(e) {
    this.y = e;
  }
  set(e, t) {
    return this.x = e, this.y = t, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this;
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  applyMatrix3(e) {
    const t = this.x, r = this.y, o = e.elements;
    return this.x = o[0] * t + o[3] * r + o[6], this.y = o[1] * t + o[4] * r + o[7], this;
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
  }
  clamp(e, t) {
    return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this;
  }
  clampScalar(e, t) {
    return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this;
  }
  clampLength(e, t) {
    const r = this.length();
    return this.divideScalar(r || 1).multiplyScalar(Math.max(e, Math.min(t, r)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y;
  }
  cross(e) {
    return this.x * e.y - this.y * e.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const r = this.dot(e) / t;
    return Math.acos(Cn(r, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const t = this.x - e.x, r = this.y - e.y;
    return t * t + r * r;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
  }
  lerpVectors(e, t, r) {
    return this.x = e.x + (t.x - e.x) * r, this.y = e.y + (t.y - e.y) * r, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this;
  }
  rotateAround(e, t) {
    const r = Math.cos(t), o = Math.sin(t), l = this.x - e.x, u = this.y - e.y;
    return this.x = l * r - u * o + e.x, this.y = l * o + u * r + e.y, this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class dt {
  constructor(e, t, r, o, l, u, d, f, h) {
    dt.prototype.isMatrix3 = !0, this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, r, o, l, u, d, f, h);
  }
  set(e, t, r, o, l, u, d, f, h) {
    const m = this.elements;
    return m[0] = e, m[1] = o, m[2] = d, m[3] = t, m[4] = l, m[5] = f, m[6] = r, m[7] = u, m[8] = h, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ), this;
  }
  copy(e) {
    const t = this.elements, r = e.elements;
    return t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = r[3], t[4] = r[4], t[5] = r[5], t[6] = r[6], t[7] = r[7], t[8] = r[8], this;
  }
  extractBasis(e, t, r) {
    return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), r.setFromMatrix3Column(this, 2), this;
  }
  setFromMatrix4(e) {
    const t = e.elements;
    return this.set(
      t[0],
      t[4],
      t[8],
      t[1],
      t[5],
      t[9],
      t[2],
      t[6],
      t[10]
    ), this;
  }
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, t) {
    const r = e.elements, o = t.elements, l = this.elements, u = r[0], d = r[3], f = r[6], h = r[1], m = r[4], _ = r[7], v = r[2], S = r[5], y = r[8], E = o[0], x = o[3], M = o[6], L = o[1], R = o[4], D = o[7], ee = o[2], F = o[5], I = o[8];
    return l[0] = u * E + d * L + f * ee, l[3] = u * x + d * R + f * F, l[6] = u * M + d * D + f * I, l[1] = h * E + m * L + _ * ee, l[4] = h * x + m * R + _ * F, l[7] = h * M + m * D + _ * I, l[2] = v * E + S * L + y * ee, l[5] = v * x + S * R + y * F, l[8] = v * M + S * D + y * I, this;
  }
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
  }
  determinant() {
    const e = this.elements, t = e[0], r = e[1], o = e[2], l = e[3], u = e[4], d = e[5], f = e[6], h = e[7], m = e[8];
    return t * u * m - t * d * h - r * l * m + r * d * f + o * l * h - o * u * f;
  }
  invert() {
    const e = this.elements, t = e[0], r = e[1], o = e[2], l = e[3], u = e[4], d = e[5], f = e[6], h = e[7], m = e[8], _ = m * u - d * h, v = d * f - m * l, S = h * l - u * f, y = t * _ + r * v + o * S;
    if (y === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const E = 1 / y;
    return e[0] = _ * E, e[1] = (o * h - m * r) * E, e[2] = (d * r - o * u) * E, e[3] = v * E, e[4] = (m * t - o * f) * E, e[5] = (o * l - d * t) * E, e[6] = S * E, e[7] = (r * f - h * t) * E, e[8] = (u * t - r * l) * E, this;
  }
  transpose() {
    let e;
    const t = this.elements;
    return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
  }
  getNormalMatrix(e) {
    return this.setFromMatrix4(e).invert().transpose();
  }
  transposeIntoArray(e) {
    const t = this.elements;
    return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
  }
  setUvTransform(e, t, r, o, l, u, d) {
    const f = Math.cos(l), h = Math.sin(l);
    return this.set(
      r * f,
      r * h,
      -r * (f * u + h * d) + u + e,
      -o * h,
      o * f,
      -o * (-h * u + f * d) + d + t,
      0,
      0,
      1
    ), this;
  }
  //
  scale(e, t) {
    return this.premultiply(ed.makeScale(e, t)), this;
  }
  rotate(e) {
    return this.premultiply(ed.makeRotation(-e)), this;
  }
  translate(e, t) {
    return this.premultiply(ed.makeTranslation(e, t)), this;
  }
  // for 2D Transforms
  makeTranslation(e, t) {
    return e.isVector2 ? this.set(
      1,
      0,
      e.x,
      0,
      1,
      e.y,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      e,
      0,
      1,
      t,
      0,
      0,
      1
    ), this;
  }
  makeRotation(e) {
    const t = Math.cos(e), r = Math.sin(e);
    return this.set(
      t,
      -r,
      0,
      r,
      t,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(e, t) {
    return this.set(
      e,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      1
    ), this;
  }
  //
  equals(e) {
    const t = this.elements, r = e.elements;
    for (let o = 0; o < 9; o++)
      if (t[o] !== r[o]) return !1;
    return !0;
  }
  fromArray(e, t = 0) {
    for (let r = 0; r < 9; r++)
      this.elements[r] = e[r + t];
    return this;
  }
  toArray(e = [], t = 0) {
    const r = this.elements;
    return e[t] = r[0], e[t + 1] = r[1], e[t + 2] = r[2], e[t + 3] = r[3], e[t + 4] = r[4], e[t + 5] = r[5], e[t + 6] = r[6], e[t + 7] = r[7], e[t + 8] = r[8], e;
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const ed = /* @__PURE__ */ new dt();
function J0(s) {
  for (let e = s.length - 1; e >= 0; --e)
    if (s[e] >= 65535) return !0;
  return !1;
}
function dc(s) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", s);
}
function _x() {
  const s = dc("canvas");
  return s.style.display = "block", s;
}
const Pm = {};
function ic(s) {
  s in Pm || (Pm[s] = !0, console.warn(s));
}
function xx(s, e, t) {
  return new Promise(function(r, o) {
    function l() {
      switch (s.clientWaitSync(e, s.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case s.WAIT_FAILED:
          o();
          break;
        case s.TIMEOUT_EXPIRED:
          setTimeout(l, t);
          break;
        default:
          r();
      }
    }
    setTimeout(l, t);
  });
}
function yx(s) {
  const e = s.elements;
  e[2] = 0.5 * e[2] + 0.5 * e[3], e[6] = 0.5 * e[6] + 0.5 * e[7], e[10] = 0.5 * e[10] + 0.5 * e[11], e[14] = 0.5 * e[14] + 0.5 * e[15];
}
function Sx(s) {
  const e = s.elements;
  e[11] === -1 ? (e[10] = -e[10] - 1, e[14] = -e[14]) : (e[10] = -e[10], e[14] = -e[14] + 1);
}
const Lm = /* @__PURE__ */ new dt().set(
  0.8224621,
  0.177538,
  0,
  0.0331941,
  0.9668058,
  0,
  0.0170827,
  0.0723974,
  0.9105199
), Dm = /* @__PURE__ */ new dt().set(
  1.2249401,
  -0.2249404,
  0,
  -0.0420569,
  1.0420571,
  0,
  -0.0196376,
  -0.0786361,
  1.0982735
), ia = {
  [Nr]: {
    transfer: ac,
    primaries: lc,
    luminanceCoefficients: [0.2126, 0.7152, 0.0722],
    toReference: (s) => s,
    fromReference: (s) => s
  },
  [yn]: {
    transfer: Ut,
    primaries: lc,
    luminanceCoefficients: [0.2126, 0.7152, 0.0722],
    toReference: (s) => s.convertSRGBToLinear(),
    fromReference: (s) => s.convertLinearToSRGB()
  },
  [mc]: {
    transfer: ac,
    primaries: cc,
    luminanceCoefficients: [0.2289, 0.6917, 0.0793],
    toReference: (s) => s.applyMatrix3(Dm),
    fromReference: (s) => s.applyMatrix3(Lm)
  },
  [Of]: {
    transfer: Ut,
    primaries: cc,
    luminanceCoefficients: [0.2289, 0.6917, 0.0793],
    toReference: (s) => s.convertSRGBToLinear().applyMatrix3(Dm),
    fromReference: (s) => s.applyMatrix3(Lm).convertLinearToSRGB()
  }
}, Mx = /* @__PURE__ */ new Set([Nr, mc]), Tt = {
  enabled: !0,
  _workingColorSpace: Nr,
  get workingColorSpace() {
    return this._workingColorSpace;
  },
  set workingColorSpace(s) {
    if (!Mx.has(s))
      throw new Error(`Unsupported working color space, "${s}".`);
    this._workingColorSpace = s;
  },
  convert: function(s, e, t) {
    if (this.enabled === !1 || e === t || !e || !t)
      return s;
    const r = ia[e].toReference, o = ia[t].fromReference;
    return o(r(s));
  },
  fromWorkingColorSpace: function(s, e) {
    return this.convert(s, this._workingColorSpace, e);
  },
  toWorkingColorSpace: function(s, e) {
    return this.convert(s, e, this._workingColorSpace);
  },
  getPrimaries: function(s) {
    return ia[s].primaries;
  },
  getTransfer: function(s) {
    return s === Cr ? ac : ia[s].transfer;
  },
  getLuminanceCoefficients: function(s, e = this._workingColorSpace) {
    return s.fromArray(ia[e].luminanceCoefficients);
  }
};
function oo(s) {
  return s < 0.04045 ? s * 0.0773993808 : Math.pow(s * 0.9478672986 + 0.0521327014, 2.4);
}
function td(s) {
  return s < 31308e-7 ? s * 12.92 : 1.055 * Math.pow(s, 0.41666) - 0.055;
}
let ks;
class Ex {
  static getDataURL(e) {
    if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u")
      return e.src;
    let t;
    if (e instanceof HTMLCanvasElement)
      t = e;
    else {
      ks === void 0 && (ks = dc("canvas")), ks.width = e.width, ks.height = e.height;
      const r = ks.getContext("2d");
      e instanceof ImageData ? r.putImageData(e, 0, 0) : r.drawImage(e, 0, 0, e.width, e.height), t = ks;
    }
    return t.width > 2048 || t.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", e), t.toDataURL("image/jpeg", 0.6)) : t.toDataURL("image/png");
  }
  static sRGBToLinear(e) {
    if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
      const t = dc("canvas");
      t.width = e.width, t.height = e.height;
      const r = t.getContext("2d");
      r.drawImage(e, 0, 0, e.width, e.height);
      const o = r.getImageData(0, 0, e.width, e.height), l = o.data;
      for (let u = 0; u < l.length; u++)
        l[u] = oo(l[u] / 255) * 255;
      return r.putImageData(o, 0, 0), t;
    } else if (e.data) {
      const t = e.data.slice(0);
      for (let r = 0; r < t.length; r++)
        t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[r] = Math.floor(oo(t[r] / 255) * 255) : t[r] = oo(t[r]);
      return {
        data: t,
        width: e.width,
        height: e.height
      };
    } else
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
  }
}
let wx = 0;
class eg {
  constructor(e = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: wx++ }), this.uuid = Qi(), this.data = e, this.dataReady = !0, this.version = 0;
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.images[this.uuid] !== void 0)
      return e.images[this.uuid];
    const r = {
      uuid: this.uuid,
      url: ""
    }, o = this.data;
    if (o !== null) {
      let l;
      if (Array.isArray(o)) {
        l = [];
        for (let u = 0, d = o.length; u < d; u++)
          o[u].isDataTexture ? l.push(nd(o[u].image)) : l.push(nd(o[u]));
      } else
        l = nd(o);
      r.url = l;
    }
    return t || (e.images[this.uuid] = r), r;
  }
}
function nd(s) {
  return typeof HTMLImageElement < "u" && s instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && s instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && s instanceof ImageBitmap ? Ex.getDataURL(s) : s.data ? {
    data: Array.from(s.data),
    width: s.width,
    height: s.height,
    type: s.data.constructor.name
  } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let Tx = 0;
class Mn extends vo {
  constructor(e = Mn.DEFAULT_IMAGE, t = Mn.DEFAULT_MAPPING, r = rs, o = rs, l = xi, u = ss, d = Si, f = Ji, h = Mn.DEFAULT_ANISOTROPY, m = Cr) {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: Tx++ }), this.uuid = Qi(), this.name = "", this.source = new eg(e), this.mipmaps = [], this.mapping = t, this.channel = 0, this.wrapS = r, this.wrapT = o, this.magFilter = l, this.minFilter = u, this.anisotropy = h, this.format = d, this.internalFormat = null, this.type = f, this.offset = new Qe(0, 0), this.repeat = new Qe(1, 1), this.center = new Qe(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new dt(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = m, this.userData = {}, this.version = 0, this.onUpdate = null, this.isRenderTargetTexture = !1, this.pmremVersion = 0;
  }
  get image() {
    return this.source.data;
  }
  set image(e = null) {
    this.source.data = e;
  }
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = !0, this;
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.textures[this.uuid] !== void 0)
      return e.textures[this.uuid];
    const r = {
      metadata: {
        version: 4.6,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(e).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment
    };
    return Object.keys(this.userData).length > 0 && (r.userData = this.userData), t || (e.textures[this.uuid] = r), r;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(e) {
    if (this.mapping !== H0) return e;
    if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1)
      switch (this.wrapS) {
        case $d:
          e.x = e.x - Math.floor(e.x);
          break;
        case rs:
          e.x = e.x < 0 ? 0 : 1;
          break;
        case Kd:
          Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x = e.x - Math.floor(e.x);
          break;
      }
    if (e.y < 0 || e.y > 1)
      switch (this.wrapT) {
        case $d:
          e.y = e.y - Math.floor(e.y);
          break;
        case rs:
          e.y = e.y < 0 ? 0 : 1;
          break;
        case Kd:
          Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y = e.y - Math.floor(e.y);
          break;
      }
    return this.flipY && (e.y = 1 - e.y), e;
  }
  set needsUpdate(e) {
    e === !0 && (this.version++, this.source.needsUpdate = !0);
  }
  set needsPMREMUpdate(e) {
    e === !0 && this.pmremVersion++;
  }
}
Mn.DEFAULT_IMAGE = null;
Mn.DEFAULT_MAPPING = H0;
Mn.DEFAULT_ANISOTROPY = 1;
class Lt {
  constructor(e = 0, t = 0, r = 0, o = 1) {
    Lt.prototype.isVector4 = !0, this.x = e, this.y = t, this.z = r, this.w = o;
  }
  get width() {
    return this.z;
  }
  set width(e) {
    this.z = e;
  }
  get height() {
    return this.w;
  }
  set height(e) {
    this.w = e;
  }
  set(e, t, r, o) {
    return this.x = e, this.y = t, this.z = r, this.w = o, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this.w = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setZ(e) {
    return this.z = e, this;
  }
  setW(e) {
    return this.w = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      case 3:
        this.w = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w !== void 0 ? e.w : 1, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this.w += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
  }
  applyMatrix4(e) {
    const t = this.x, r = this.y, o = this.z, l = this.w, u = e.elements;
    return this.x = u[0] * t + u[4] * r + u[8] * o + u[12] * l, this.y = u[1] * t + u[5] * r + u[9] * o + u[13] * l, this.z = u[2] * t + u[6] * r + u[10] * o + u[14] * l, this.w = u[3] * t + u[7] * r + u[11] * o + u[15] * l, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  setAxisAngleFromQuaternion(e) {
    this.w = 2 * Math.acos(e.w);
    const t = Math.sqrt(1 - e.w * e.w);
    return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
  }
  setAxisAngleFromRotationMatrix(e) {
    let t, r, o, l;
    const f = e.elements, h = f[0], m = f[4], _ = f[8], v = f[1], S = f[5], y = f[9], E = f[2], x = f[6], M = f[10];
    if (Math.abs(m - v) < 0.01 && Math.abs(_ - E) < 0.01 && Math.abs(y - x) < 0.01) {
      if (Math.abs(m + v) < 0.1 && Math.abs(_ + E) < 0.1 && Math.abs(y + x) < 0.1 && Math.abs(h + S + M - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      t = Math.PI;
      const R = (h + 1) / 2, D = (S + 1) / 2, ee = (M + 1) / 2, F = (m + v) / 4, I = (_ + E) / 4, Y = (y + x) / 4;
      return R > D && R > ee ? R < 0.01 ? (r = 0, o = 0.707106781, l = 0.707106781) : (r = Math.sqrt(R), o = F / r, l = I / r) : D > ee ? D < 0.01 ? (r = 0.707106781, o = 0, l = 0.707106781) : (o = Math.sqrt(D), r = F / o, l = Y / o) : ee < 0.01 ? (r = 0.707106781, o = 0.707106781, l = 0) : (l = Math.sqrt(ee), r = I / l, o = Y / l), this.set(r, o, l, t), this;
    }
    let L = Math.sqrt((x - y) * (x - y) + (_ - E) * (_ - E) + (v - m) * (v - m));
    return Math.abs(L) < 1e-3 && (L = 1), this.x = (x - y) / L, this.y = (_ - E) / L, this.z = (v - m) / L, this.w = Math.acos((h + S + M - 1) / 2), this;
  }
  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this.w = t[15], this;
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
  }
  clamp(e, t) {
    return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this.z = Math.max(e.z, Math.min(t.z, this.z)), this.w = Math.max(e.w, Math.min(t.w, this.w)), this;
  }
  clampScalar(e, t) {
    return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this.z = Math.max(e, Math.min(t, this.z)), this.w = Math.max(e, Math.min(t, this.w)), this;
  }
  clampLength(e, t) {
    const r = this.length();
    return this.divideScalar(r || 1).multiplyScalar(Math.max(e, Math.min(t, r)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
  }
  lerpVectors(e, t, r) {
    return this.x = e.x + (t.x - e.x) * r, this.y = e.y + (t.y - e.y) * r, this.z = e.z + (t.z - e.z) * r, this.w = e.w + (t.w - e.w) * r, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class bx extends vo {
  constructor(e = 1, t = 1, r = {}) {
    super(), this.isRenderTarget = !0, this.width = e, this.height = t, this.depth = 1, this.scissor = new Lt(0, 0, e, t), this.scissorTest = !1, this.viewport = new Lt(0, 0, e, t);
    const o = { width: e, height: t, depth: 1 };
    r = Object.assign({
      generateMipmaps: !1,
      internalFormat: null,
      minFilter: xi,
      depthBuffer: !0,
      stencilBuffer: !1,
      resolveDepthBuffer: !0,
      resolveStencilBuffer: !0,
      depthTexture: null,
      samples: 0,
      count: 1
    }, r);
    const l = new Mn(o, r.mapping, r.wrapS, r.wrapT, r.magFilter, r.minFilter, r.format, r.type, r.anisotropy, r.colorSpace);
    l.flipY = !1, l.generateMipmaps = r.generateMipmaps, l.internalFormat = r.internalFormat, this.textures = [];
    const u = r.count;
    for (let d = 0; d < u; d++)
      this.textures[d] = l.clone(), this.textures[d].isRenderTargetTexture = !0;
    this.depthBuffer = r.depthBuffer, this.stencilBuffer = r.stencilBuffer, this.resolveDepthBuffer = r.resolveDepthBuffer, this.resolveStencilBuffer = r.resolveStencilBuffer, this.depthTexture = r.depthTexture, this.samples = r.samples;
  }
  get texture() {
    return this.textures[0];
  }
  set texture(e) {
    this.textures[0] = e;
  }
  setSize(e, t, r = 1) {
    if (this.width !== e || this.height !== t || this.depth !== r) {
      this.width = e, this.height = t, this.depth = r;
      for (let o = 0, l = this.textures.length; o < l; o++)
        this.textures[o].image.width = e, this.textures[o].image.height = t, this.textures[o].image.depth = r;
      this.dispose();
    }
    this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
    for (let r = 0, o = e.textures.length; r < o; r++)
      this.textures[r] = e.textures[r].clone(), this.textures[r].isRenderTargetTexture = !0;
    const t = Object.assign({}, e.texture.image);
    return this.texture.source = new eg(t), this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class oi extends bx {
  constructor(e = 1, t = 1, r = {}) {
    super(e, t, r), this.isWebGLRenderTarget = !0;
  }
}
class tg extends Mn {
  constructor(e = null, t = 1, r = 1, o = 1) {
    super(null), this.isDataArrayTexture = !0, this.image = { data: e, width: t, height: r, depth: o }, this.magFilter = Bn, this.minFilter = Bn, this.wrapR = rs, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
  }
  addLayerUpdate(e) {
    this.layerUpdates.add(e);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class Ax extends Mn {
  constructor(e = null, t = 1, r = 1, o = 1) {
    super(null), this.isData3DTexture = !0, this.image = { data: e, width: t, height: r, depth: o }, this.magFilter = Bn, this.minFilter = Bn, this.wrapR = rs, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class as {
  constructor(e = 0, t = 0, r = 0, o = 1) {
    this.isQuaternion = !0, this._x = e, this._y = t, this._z = r, this._w = o;
  }
  static slerpFlat(e, t, r, o, l, u, d) {
    let f = r[o + 0], h = r[o + 1], m = r[o + 2], _ = r[o + 3];
    const v = l[u + 0], S = l[u + 1], y = l[u + 2], E = l[u + 3];
    if (d === 0) {
      e[t + 0] = f, e[t + 1] = h, e[t + 2] = m, e[t + 3] = _;
      return;
    }
    if (d === 1) {
      e[t + 0] = v, e[t + 1] = S, e[t + 2] = y, e[t + 3] = E;
      return;
    }
    if (_ !== E || f !== v || h !== S || m !== y) {
      let x = 1 - d;
      const M = f * v + h * S + m * y + _ * E, L = M >= 0 ? 1 : -1, R = 1 - M * M;
      if (R > Number.EPSILON) {
        const ee = Math.sqrt(R), F = Math.atan2(ee, M * L);
        x = Math.sin(x * F) / ee, d = Math.sin(d * F) / ee;
      }
      const D = d * L;
      if (f = f * x + v * D, h = h * x + S * D, m = m * x + y * D, _ = _ * x + E * D, x === 1 - d) {
        const ee = 1 / Math.sqrt(f * f + h * h + m * m + _ * _);
        f *= ee, h *= ee, m *= ee, _ *= ee;
      }
    }
    e[t] = f, e[t + 1] = h, e[t + 2] = m, e[t + 3] = _;
  }
  static multiplyQuaternionsFlat(e, t, r, o, l, u) {
    const d = r[o], f = r[o + 1], h = r[o + 2], m = r[o + 3], _ = l[u], v = l[u + 1], S = l[u + 2], y = l[u + 3];
    return e[t] = d * y + m * _ + f * S - h * v, e[t + 1] = f * y + m * v + h * _ - d * S, e[t + 2] = h * y + m * S + d * v - f * _, e[t + 3] = m * y - d * _ - f * v - h * S, e;
  }
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  get w() {
    return this._w;
  }
  set w(e) {
    this._w = e, this._onChangeCallback();
  }
  set(e, t, r, o) {
    return this._x = e, this._y = t, this._z = r, this._w = o, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(e) {
    return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
  }
  setFromEuler(e, t = !0) {
    const r = e._x, o = e._y, l = e._z, u = e._order, d = Math.cos, f = Math.sin, h = d(r / 2), m = d(o / 2), _ = d(l / 2), v = f(r / 2), S = f(o / 2), y = f(l / 2);
    switch (u) {
      case "XYZ":
        this._x = v * m * _ + h * S * y, this._y = h * S * _ - v * m * y, this._z = h * m * y + v * S * _, this._w = h * m * _ - v * S * y;
        break;
      case "YXZ":
        this._x = v * m * _ + h * S * y, this._y = h * S * _ - v * m * y, this._z = h * m * y - v * S * _, this._w = h * m * _ + v * S * y;
        break;
      case "ZXY":
        this._x = v * m * _ - h * S * y, this._y = h * S * _ + v * m * y, this._z = h * m * y + v * S * _, this._w = h * m * _ - v * S * y;
        break;
      case "ZYX":
        this._x = v * m * _ - h * S * y, this._y = h * S * _ + v * m * y, this._z = h * m * y - v * S * _, this._w = h * m * _ + v * S * y;
        break;
      case "YZX":
        this._x = v * m * _ + h * S * y, this._y = h * S * _ + v * m * y, this._z = h * m * y - v * S * _, this._w = h * m * _ - v * S * y;
        break;
      case "XZY":
        this._x = v * m * _ - h * S * y, this._y = h * S * _ - v * m * y, this._z = h * m * y + v * S * _, this._w = h * m * _ + v * S * y;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + u);
    }
    return t === !0 && this._onChangeCallback(), this;
  }
  setFromAxisAngle(e, t) {
    const r = t / 2, o = Math.sin(r);
    return this._x = e.x * o, this._y = e.y * o, this._z = e.z * o, this._w = Math.cos(r), this._onChangeCallback(), this;
  }
  setFromRotationMatrix(e) {
    const t = e.elements, r = t[0], o = t[4], l = t[8], u = t[1], d = t[5], f = t[9], h = t[2], m = t[6], _ = t[10], v = r + d + _;
    if (v > 0) {
      const S = 0.5 / Math.sqrt(v + 1);
      this._w = 0.25 / S, this._x = (m - f) * S, this._y = (l - h) * S, this._z = (u - o) * S;
    } else if (r > d && r > _) {
      const S = 2 * Math.sqrt(1 + r - d - _);
      this._w = (m - f) / S, this._x = 0.25 * S, this._y = (o + u) / S, this._z = (l + h) / S;
    } else if (d > _) {
      const S = 2 * Math.sqrt(1 + d - r - _);
      this._w = (l - h) / S, this._x = (o + u) / S, this._y = 0.25 * S, this._z = (f + m) / S;
    } else {
      const S = 2 * Math.sqrt(1 + _ - r - d);
      this._w = (u - o) / S, this._x = (l + h) / S, this._y = (f + m) / S, this._z = 0.25 * S;
    }
    return this._onChangeCallback(), this;
  }
  setFromUnitVectors(e, t) {
    let r = e.dot(t) + 1;
    return r < Number.EPSILON ? (r = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = r) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = r)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = r), this.normalize();
  }
  angleTo(e) {
    return 2 * Math.acos(Math.abs(Cn(this.dot(e), -1, 1)));
  }
  rotateTowards(e, t) {
    const r = this.angleTo(e);
    if (r === 0) return this;
    const o = Math.min(1, t / r);
    return this.slerp(e, o), this;
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  dot(e) {
    return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
  }
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  normalize() {
    let e = this.length();
    return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this;
  }
  multiply(e) {
    return this.multiplyQuaternions(this, e);
  }
  premultiply(e) {
    return this.multiplyQuaternions(e, this);
  }
  multiplyQuaternions(e, t) {
    const r = e._x, o = e._y, l = e._z, u = e._w, d = t._x, f = t._y, h = t._z, m = t._w;
    return this._x = r * m + u * d + o * h - l * f, this._y = o * m + u * f + l * d - r * h, this._z = l * m + u * h + r * f - o * d, this._w = u * m - r * d - o * f - l * h, this._onChangeCallback(), this;
  }
  slerp(e, t) {
    if (t === 0) return this;
    if (t === 1) return this.copy(e);
    const r = this._x, o = this._y, l = this._z, u = this._w;
    let d = u * e._w + r * e._x + o * e._y + l * e._z;
    if (d < 0 ? (this._w = -e._w, this._x = -e._x, this._y = -e._y, this._z = -e._z, d = -d) : this.copy(e), d >= 1)
      return this._w = u, this._x = r, this._y = o, this._z = l, this;
    const f = 1 - d * d;
    if (f <= Number.EPSILON) {
      const S = 1 - t;
      return this._w = S * u + t * this._w, this._x = S * r + t * this._x, this._y = S * o + t * this._y, this._z = S * l + t * this._z, this.normalize(), this;
    }
    const h = Math.sqrt(f), m = Math.atan2(h, d), _ = Math.sin((1 - t) * m) / h, v = Math.sin(t * m) / h;
    return this._w = u * _ + this._w * v, this._x = r * _ + this._x * v, this._y = o * _ + this._y * v, this._z = l * _ + this._z * v, this._onChangeCallback(), this;
  }
  slerpQuaternions(e, t, r) {
    return this.copy(e).slerp(t, r);
  }
  random() {
    const e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), r = Math.random(), o = Math.sqrt(1 - r), l = Math.sqrt(r);
    return this.set(
      o * Math.sin(e),
      o * Math.cos(e),
      l * Math.sin(t),
      l * Math.cos(t)
    );
  }
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
  }
  fromArray(e, t = 0) {
    return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
  }
  fromBufferAttribute(e, t) {
    return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class z {
  constructor(e = 0, t = 0, r = 0) {
    z.prototype.isVector3 = !0, this.x = e, this.y = t, this.z = r;
  }
  set(e, t, r) {
    return r === void 0 && (r = this.z), this.x = e, this.y = t, this.z = r, this;
  }
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this;
  }
  setX(e) {
    return this.x = e, this;
  }
  setY(e) {
    return this.y = e, this;
  }
  setZ(e) {
    return this.z = e, this;
  }
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this;
  }
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this;
  }
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this;
  }
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
  }
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
  }
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
  }
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this;
  }
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
  }
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
  }
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this;
  }
  multiplyVectors(e, t) {
    return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
  }
  applyEuler(e) {
    return this.applyQuaternion(Nm.setFromEuler(e));
  }
  applyAxisAngle(e, t) {
    return this.applyQuaternion(Nm.setFromAxisAngle(e, t));
  }
  applyMatrix3(e) {
    const t = this.x, r = this.y, o = this.z, l = e.elements;
    return this.x = l[0] * t + l[3] * r + l[6] * o, this.y = l[1] * t + l[4] * r + l[7] * o, this.z = l[2] * t + l[5] * r + l[8] * o, this;
  }
  applyNormalMatrix(e) {
    return this.applyMatrix3(e).normalize();
  }
  applyMatrix4(e) {
    const t = this.x, r = this.y, o = this.z, l = e.elements, u = 1 / (l[3] * t + l[7] * r + l[11] * o + l[15]);
    return this.x = (l[0] * t + l[4] * r + l[8] * o + l[12]) * u, this.y = (l[1] * t + l[5] * r + l[9] * o + l[13]) * u, this.z = (l[2] * t + l[6] * r + l[10] * o + l[14]) * u, this;
  }
  applyQuaternion(e) {
    const t = this.x, r = this.y, o = this.z, l = e.x, u = e.y, d = e.z, f = e.w, h = 2 * (u * o - d * r), m = 2 * (d * t - l * o), _ = 2 * (l * r - u * t);
    return this.x = t + f * h + u * _ - d * m, this.y = r + f * m + d * h - l * _, this.z = o + f * _ + l * m - u * h, this;
  }
  project(e) {
    return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
  }
  unproject(e) {
    return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
  }
  transformDirection(e) {
    const t = this.x, r = this.y, o = this.z, l = e.elements;
    return this.x = l[0] * t + l[4] * r + l[8] * o, this.y = l[1] * t + l[5] * r + l[9] * o, this.z = l[2] * t + l[6] * r + l[10] * o, this.normalize();
  }
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
  }
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
  }
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
  }
  clamp(e, t) {
    return this.x = Math.max(e.x, Math.min(t.x, this.x)), this.y = Math.max(e.y, Math.min(t.y, this.y)), this.z = Math.max(e.z, Math.min(t.z, this.z)), this;
  }
  clampScalar(e, t) {
    return this.x = Math.max(e, Math.min(t, this.x)), this.y = Math.max(e, Math.min(t, this.y)), this.z = Math.max(e, Math.min(t, this.z)), this;
  }
  clampLength(e, t) {
    const r = this.length();
    return this.divideScalar(r || 1).multiplyScalar(Math.max(e, Math.min(t, r)));
  }
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }
  // TODO lengthSquared?
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
  }
  lerpVectors(e, t, r) {
    return this.x = e.x + (t.x - e.x) * r, this.y = e.y + (t.y - e.y) * r, this.z = e.z + (t.z - e.z) * r, this;
  }
  cross(e) {
    return this.crossVectors(this, e);
  }
  crossVectors(e, t) {
    const r = e.x, o = e.y, l = e.z, u = t.x, d = t.y, f = t.z;
    return this.x = o * f - l * d, this.y = l * u - r * f, this.z = r * d - o * u, this;
  }
  projectOnVector(e) {
    const t = e.lengthSq();
    if (t === 0) return this.set(0, 0, 0);
    const r = e.dot(this) / t;
    return this.copy(e).multiplyScalar(r);
  }
  projectOnPlane(e) {
    return id.copy(this).projectOnVector(e), this.sub(id);
  }
  reflect(e) {
    return this.sub(id.copy(e).multiplyScalar(2 * this.dot(e)));
  }
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const r = this.dot(e) / t;
    return Math.acos(Cn(r, -1, 1));
  }
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  distanceToSquared(e) {
    const t = this.x - e.x, r = this.y - e.y, o = this.z - e.z;
    return t * t + r * r + o * o;
  }
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
  }
  setFromSpherical(e) {
    return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
  }
  setFromSphericalCoords(e, t, r) {
    const o = Math.sin(t) * e;
    return this.x = o * Math.sin(r), this.y = Math.cos(t) * e, this.z = o * Math.cos(r), this;
  }
  setFromCylindrical(e) {
    return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
  }
  setFromCylindricalCoords(e, t, r) {
    return this.x = e * Math.sin(t), this.y = r, this.z = e * Math.cos(t), this;
  }
  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this;
  }
  setFromMatrixScale(e) {
    const t = this.setFromMatrixColumn(e, 0).length(), r = this.setFromMatrixColumn(e, 1).length(), o = this.setFromMatrixColumn(e, 2).length();
    return this.x = t, this.y = r, this.z = o, this;
  }
  setFromMatrixColumn(e, t) {
    return this.fromArray(e.elements, t * 4);
  }
  setFromMatrix3Column(e, t) {
    return this.fromArray(e.elements, t * 3);
  }
  setFromEuler(e) {
    return this.x = e._x, this.y = e._y, this.z = e._z, this;
  }
  setFromColor(e) {
    return this.x = e.r, this.y = e.g, this.z = e.b, this;
  }
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z;
  }
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
  }
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
  }
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  randomDirection() {
    const e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, r = Math.sqrt(1 - t * t);
    return this.x = r * Math.cos(e), this.y = t, this.z = r * Math.sin(e), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const id = /* @__PURE__ */ new z(), Nm = /* @__PURE__ */ new as();
class ls {
  constructor(e = new z(1 / 0, 1 / 0, 1 / 0), t = new z(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = e, this.max = t;
  }
  set(e, t) {
    return this.min.copy(e), this.max.copy(t), this;
  }
  setFromArray(e) {
    this.makeEmpty();
    for (let t = 0, r = e.length; t < r; t += 3)
      this.expandByPoint(mi.fromArray(e, t));
    return this;
  }
  setFromBufferAttribute(e) {
    this.makeEmpty();
    for (let t = 0, r = e.count; t < r; t++)
      this.expandByPoint(mi.fromBufferAttribute(e, t));
    return this;
  }
  setFromPoints(e) {
    this.makeEmpty();
    for (let t = 0, r = e.length; t < r; t++)
      this.expandByPoint(e[t]);
    return this;
  }
  setFromCenterAndSize(e, t) {
    const r = mi.copy(t).multiplyScalar(0.5);
    return this.min.copy(e).sub(r), this.max.copy(e).add(r), this;
  }
  setFromObject(e, t = !1) {
    return this.makeEmpty(), this.expandByObject(e, t);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  getCenter(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
  }
  expandByPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }
  expandByVector(e) {
    return this.min.sub(e), this.max.add(e), this;
  }
  expandByScalar(e) {
    return this.min.addScalar(-e), this.max.addScalar(e), this;
  }
  expandByObject(e, t = !1) {
    e.updateWorldMatrix(!1, !1);
    const r = e.geometry;
    if (r !== void 0) {
      const l = r.getAttribute("position");
      if (t === !0 && l !== void 0 && e.isInstancedMesh !== !0)
        for (let u = 0, d = l.count; u < d; u++)
          e.isMesh === !0 ? e.getVertexPosition(u, mi) : mi.fromBufferAttribute(l, u), mi.applyMatrix4(e.matrixWorld), this.expandByPoint(mi);
      else
        e.boundingBox !== void 0 ? (e.boundingBox === null && e.computeBoundingBox(), bl.copy(e.boundingBox)) : (r.boundingBox === null && r.computeBoundingBox(), bl.copy(r.boundingBox)), bl.applyMatrix4(e.matrixWorld), this.union(bl);
    }
    const o = e.children;
    for (let l = 0, u = o.length; l < u; l++)
      this.expandByObject(o[l], t);
    return this;
  }
  containsPoint(e) {
    return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
  }
  containsBox(e) {
    return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
  }
  getParameter(e, t) {
    return t.set(
      (e.x - this.min.x) / (this.max.x - this.min.x),
      (e.y - this.min.y) / (this.max.y - this.min.y),
      (e.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  intersectsBox(e) {
    return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
  }
  intersectsSphere(e) {
    return this.clampPoint(e.center, mi), mi.distanceToSquared(e.center) <= e.radius * e.radius;
  }
  intersectsPlane(e) {
    let t, r;
    return e.normal.x > 0 ? (t = e.normal.x * this.min.x, r = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, r = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, r += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, r += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, r += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, r += e.normal.z * this.min.z), t <= -e.constant && r >= -e.constant;
  }
  intersectsTriangle(e) {
    if (this.isEmpty())
      return !1;
    this.getCenter(ra), Al.subVectors(this.max, ra), Os.subVectors(e.a, ra), Bs.subVectors(e.b, ra), zs.subVectors(e.c, ra), Mr.subVectors(Bs, Os), Er.subVectors(zs, Bs), Yr.subVectors(Os, zs);
    let t = [
      0,
      -Mr.z,
      Mr.y,
      0,
      -Er.z,
      Er.y,
      0,
      -Yr.z,
      Yr.y,
      Mr.z,
      0,
      -Mr.x,
      Er.z,
      0,
      -Er.x,
      Yr.z,
      0,
      -Yr.x,
      -Mr.y,
      Mr.x,
      0,
      -Er.y,
      Er.x,
      0,
      -Yr.y,
      Yr.x,
      0
    ];
    return !rd(t, Os, Bs, zs, Al) || (t = [1, 0, 0, 0, 1, 0, 0, 0, 1], !rd(t, Os, Bs, zs, Al)) ? !1 : (Cl.crossVectors(Mr, Er), t = [Cl.x, Cl.y, Cl.z], rd(t, Os, Bs, zs, Al));
  }
  clampPoint(e, t) {
    return t.copy(e).clamp(this.min, this.max);
  }
  distanceToPoint(e) {
    return this.clampPoint(e, mi).distanceTo(e);
  }
  getBoundingSphere(e) {
    return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(mi).length() * 0.5), e;
  }
  intersect(e) {
    return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
  }
  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }
  applyMatrix4(e) {
    return this.isEmpty() ? this : (Vi[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), Vi[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), Vi[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), Vi[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), Vi[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), Vi[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), Vi[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), Vi[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(Vi), this);
  }
  translate(e) {
    return this.min.add(e), this.max.add(e), this;
  }
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
}
const Vi = [
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z(),
  /* @__PURE__ */ new z()
], mi = /* @__PURE__ */ new z(), bl = /* @__PURE__ */ new ls(), Os = /* @__PURE__ */ new z(), Bs = /* @__PURE__ */ new z(), zs = /* @__PURE__ */ new z(), Mr = /* @__PURE__ */ new z(), Er = /* @__PURE__ */ new z(), Yr = /* @__PURE__ */ new z(), ra = /* @__PURE__ */ new z(), Al = /* @__PURE__ */ new z(), Cl = /* @__PURE__ */ new z(), qr = /* @__PURE__ */ new z();
function rd(s, e, t, r, o) {
  for (let l = 0, u = s.length - 3; l <= u; l += 3) {
    qr.fromArray(s, l);
    const d = o.x * Math.abs(qr.x) + o.y * Math.abs(qr.y) + o.z * Math.abs(qr.z), f = e.dot(qr), h = t.dot(qr), m = r.dot(qr);
    if (Math.max(-Math.max(f, h, m), Math.min(f, h, m)) > d)
      return !1;
  }
  return !0;
}
const Cx = /* @__PURE__ */ new ls(), sa = /* @__PURE__ */ new z(), sd = /* @__PURE__ */ new z();
class _o {
  constructor(e = new z(), t = -1) {
    this.isSphere = !0, this.center = e, this.radius = t;
  }
  set(e, t) {
    return this.center.copy(e), this.radius = t, this;
  }
  setFromPoints(e, t) {
    const r = this.center;
    t !== void 0 ? r.copy(t) : Cx.setFromPoints(e).getCenter(r);
    let o = 0;
    for (let l = 0, u = e.length; l < u; l++)
      o = Math.max(o, r.distanceToSquared(e[l]));
    return this.radius = Math.sqrt(o), this;
  }
  copy(e) {
    return this.center.copy(e.center), this.radius = e.radius, this;
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  containsPoint(e) {
    return e.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(e) {
    return e.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(e) {
    const t = this.radius + e.radius;
    return e.center.distanceToSquared(this.center) <= t * t;
  }
  intersectsBox(e) {
    return e.intersectsSphere(this);
  }
  intersectsPlane(e) {
    return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(e, t) {
    const r = this.center.distanceToSquared(e);
    return t.copy(e), r > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
  }
  getBoundingBox(e) {
    return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
  }
  applyMatrix4(e) {
    return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this;
  }
  translate(e) {
    return this.center.add(e), this;
  }
  expandByPoint(e) {
    if (this.isEmpty())
      return this.center.copy(e), this.radius = 0, this;
    sa.subVectors(e, this.center);
    const t = sa.lengthSq();
    if (t > this.radius * this.radius) {
      const r = Math.sqrt(t), o = (r - this.radius) * 0.5;
      this.center.addScaledVector(sa, o / r), this.radius += o;
    }
    return this;
  }
  union(e) {
    return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === !0 ? this.radius = Math.max(this.radius, e.radius) : (sd.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(sa.copy(e.center).add(sd)), this.expandByPoint(sa.copy(e.center).sub(sd))), this);
  }
  equals(e) {
    return e.center.equals(this.center) && e.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Gi = /* @__PURE__ */ new z(), od = /* @__PURE__ */ new z(), Rl = /* @__PURE__ */ new z(), wr = /* @__PURE__ */ new z(), ad = /* @__PURE__ */ new z(), Pl = /* @__PURE__ */ new z(), ld = /* @__PURE__ */ new z();
class ng {
  constructor(e = new z(), t = new z(0, 0, -1)) {
    this.origin = e, this.direction = t;
  }
  set(e, t) {
    return this.origin.copy(e), this.direction.copy(t), this;
  }
  copy(e) {
    return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
  }
  at(e, t) {
    return t.copy(this.origin).addScaledVector(this.direction, e);
  }
  lookAt(e) {
    return this.direction.copy(e).sub(this.origin).normalize(), this;
  }
  recast(e) {
    return this.origin.copy(this.at(e, Gi)), this;
  }
  closestPointToPoint(e, t) {
    t.subVectors(e, this.origin);
    const r = t.dot(this.direction);
    return r < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, r);
  }
  distanceToPoint(e) {
    return Math.sqrt(this.distanceSqToPoint(e));
  }
  distanceSqToPoint(e) {
    const t = Gi.subVectors(e, this.origin).dot(this.direction);
    return t < 0 ? this.origin.distanceToSquared(e) : (Gi.copy(this.origin).addScaledVector(this.direction, t), Gi.distanceToSquared(e));
  }
  distanceSqToSegment(e, t, r, o) {
    od.copy(e).add(t).multiplyScalar(0.5), Rl.copy(t).sub(e).normalize(), wr.copy(this.origin).sub(od);
    const l = e.distanceTo(t) * 0.5, u = -this.direction.dot(Rl), d = wr.dot(this.direction), f = -wr.dot(Rl), h = wr.lengthSq(), m = Math.abs(1 - u * u);
    let _, v, S, y;
    if (m > 0)
      if (_ = u * f - d, v = u * d - f, y = l * m, _ >= 0)
        if (v >= -y)
          if (v <= y) {
            const E = 1 / m;
            _ *= E, v *= E, S = _ * (_ + u * v + 2 * d) + v * (u * _ + v + 2 * f) + h;
          } else
            v = l, _ = Math.max(0, -(u * v + d)), S = -_ * _ + v * (v + 2 * f) + h;
        else
          v = -l, _ = Math.max(0, -(u * v + d)), S = -_ * _ + v * (v + 2 * f) + h;
      else
        v <= -y ? (_ = Math.max(0, -(-u * l + d)), v = _ > 0 ? -l : Math.min(Math.max(-l, -f), l), S = -_ * _ + v * (v + 2 * f) + h) : v <= y ? (_ = 0, v = Math.min(Math.max(-l, -f), l), S = v * (v + 2 * f) + h) : (_ = Math.max(0, -(u * l + d)), v = _ > 0 ? l : Math.min(Math.max(-l, -f), l), S = -_ * _ + v * (v + 2 * f) + h);
    else
      v = u > 0 ? -l : l, _ = Math.max(0, -(u * v + d)), S = -_ * _ + v * (v + 2 * f) + h;
    return r && r.copy(this.origin).addScaledVector(this.direction, _), o && o.copy(od).addScaledVector(Rl, v), S;
  }
  intersectSphere(e, t) {
    Gi.subVectors(e.center, this.origin);
    const r = Gi.dot(this.direction), o = Gi.dot(Gi) - r * r, l = e.radius * e.radius;
    if (o > l) return null;
    const u = Math.sqrt(l - o), d = r - u, f = r + u;
    return f < 0 ? null : d < 0 ? this.at(f, t) : this.at(d, t);
  }
  intersectsSphere(e) {
    return this.distanceSqToPoint(e.center) <= e.radius * e.radius;
  }
  distanceToPlane(e) {
    const t = e.normal.dot(this.direction);
    if (t === 0)
      return e.distanceToPoint(this.origin) === 0 ? 0 : null;
    const r = -(this.origin.dot(e.normal) + e.constant) / t;
    return r >= 0 ? r : null;
  }
  intersectPlane(e, t) {
    const r = this.distanceToPlane(e);
    return r === null ? null : this.at(r, t);
  }
  intersectsPlane(e) {
    const t = e.distanceToPoint(this.origin);
    return t === 0 || e.normal.dot(this.direction) * t < 0;
  }
  intersectBox(e, t) {
    let r, o, l, u, d, f;
    const h = 1 / this.direction.x, m = 1 / this.direction.y, _ = 1 / this.direction.z, v = this.origin;
    return h >= 0 ? (r = (e.min.x - v.x) * h, o = (e.max.x - v.x) * h) : (r = (e.max.x - v.x) * h, o = (e.min.x - v.x) * h), m >= 0 ? (l = (e.min.y - v.y) * m, u = (e.max.y - v.y) * m) : (l = (e.max.y - v.y) * m, u = (e.min.y - v.y) * m), r > u || l > o || ((l > r || isNaN(r)) && (r = l), (u < o || isNaN(o)) && (o = u), _ >= 0 ? (d = (e.min.z - v.z) * _, f = (e.max.z - v.z) * _) : (d = (e.max.z - v.z) * _, f = (e.min.z - v.z) * _), r > f || d > o) || ((d > r || r !== r) && (r = d), (f < o || o !== o) && (o = f), o < 0) ? null : this.at(r >= 0 ? r : o, t);
  }
  intersectsBox(e) {
    return this.intersectBox(e, Gi) !== null;
  }
  intersectTriangle(e, t, r, o, l) {
    ad.subVectors(t, e), Pl.subVectors(r, e), ld.crossVectors(ad, Pl);
    let u = this.direction.dot(ld), d;
    if (u > 0) {
      if (o) return null;
      d = 1;
    } else if (u < 0)
      d = -1, u = -u;
    else
      return null;
    wr.subVectors(this.origin, e);
    const f = d * this.direction.dot(Pl.crossVectors(wr, Pl));
    if (f < 0)
      return null;
    const h = d * this.direction.dot(ad.cross(wr));
    if (h < 0 || f + h > u)
      return null;
    const m = -d * wr.dot(ld);
    return m < 0 ? null : this.at(m / u, l);
  }
  applyMatrix4(e) {
    return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
  }
  equals(e) {
    return e.origin.equals(this.origin) && e.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Rt {
  constructor(e, t, r, o, l, u, d, f, h, m, _, v, S, y, E, x) {
    Rt.prototype.isMatrix4 = !0, this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, r, o, l, u, d, f, h, m, _, v, S, y, E, x);
  }
  set(e, t, r, o, l, u, d, f, h, m, _, v, S, y, E, x) {
    const M = this.elements;
    return M[0] = e, M[4] = t, M[8] = r, M[12] = o, M[1] = l, M[5] = u, M[9] = d, M[13] = f, M[2] = h, M[6] = m, M[10] = _, M[14] = v, M[3] = S, M[7] = y, M[11] = E, M[15] = x, this;
  }
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  clone() {
    return new Rt().fromArray(this.elements);
  }
  copy(e) {
    const t = this.elements, r = e.elements;
    return t[0] = r[0], t[1] = r[1], t[2] = r[2], t[3] = r[3], t[4] = r[4], t[5] = r[5], t[6] = r[6], t[7] = r[7], t[8] = r[8], t[9] = r[9], t[10] = r[10], t[11] = r[11], t[12] = r[12], t[13] = r[13], t[14] = r[14], t[15] = r[15], this;
  }
  copyPosition(e) {
    const t = this.elements, r = e.elements;
    return t[12] = r[12], t[13] = r[13], t[14] = r[14], this;
  }
  setFromMatrix3(e) {
    const t = e.elements;
    return this.set(
      t[0],
      t[3],
      t[6],
      0,
      t[1],
      t[4],
      t[7],
      0,
      t[2],
      t[5],
      t[8],
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractBasis(e, t, r) {
    return e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), r.setFromMatrixColumn(this, 2), this;
  }
  makeBasis(e, t, r) {
    return this.set(
      e.x,
      t.x,
      r.x,
      0,
      e.y,
      t.y,
      r.y,
      0,
      e.z,
      t.z,
      r.z,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  extractRotation(e) {
    const t = this.elements, r = e.elements, o = 1 / Hs.setFromMatrixColumn(e, 0).length(), l = 1 / Hs.setFromMatrixColumn(e, 1).length(), u = 1 / Hs.setFromMatrixColumn(e, 2).length();
    return t[0] = r[0] * o, t[1] = r[1] * o, t[2] = r[2] * o, t[3] = 0, t[4] = r[4] * l, t[5] = r[5] * l, t[6] = r[6] * l, t[7] = 0, t[8] = r[8] * u, t[9] = r[9] * u, t[10] = r[10] * u, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }
  makeRotationFromEuler(e) {
    const t = this.elements, r = e.x, o = e.y, l = e.z, u = Math.cos(r), d = Math.sin(r), f = Math.cos(o), h = Math.sin(o), m = Math.cos(l), _ = Math.sin(l);
    if (e.order === "XYZ") {
      const v = u * m, S = u * _, y = d * m, E = d * _;
      t[0] = f * m, t[4] = -f * _, t[8] = h, t[1] = S + y * h, t[5] = v - E * h, t[9] = -d * f, t[2] = E - v * h, t[6] = y + S * h, t[10] = u * f;
    } else if (e.order === "YXZ") {
      const v = f * m, S = f * _, y = h * m, E = h * _;
      t[0] = v + E * d, t[4] = y * d - S, t[8] = u * h, t[1] = u * _, t[5] = u * m, t[9] = -d, t[2] = S * d - y, t[6] = E + v * d, t[10] = u * f;
    } else if (e.order === "ZXY") {
      const v = f * m, S = f * _, y = h * m, E = h * _;
      t[0] = v - E * d, t[4] = -u * _, t[8] = y + S * d, t[1] = S + y * d, t[5] = u * m, t[9] = E - v * d, t[2] = -u * h, t[6] = d, t[10] = u * f;
    } else if (e.order === "ZYX") {
      const v = u * m, S = u * _, y = d * m, E = d * _;
      t[0] = f * m, t[4] = y * h - S, t[8] = v * h + E, t[1] = f * _, t[5] = E * h + v, t[9] = S * h - y, t[2] = -h, t[6] = d * f, t[10] = u * f;
    } else if (e.order === "YZX") {
      const v = u * f, S = u * h, y = d * f, E = d * h;
      t[0] = f * m, t[4] = E - v * _, t[8] = y * _ + S, t[1] = _, t[5] = u * m, t[9] = -d * m, t[2] = -h * m, t[6] = S * _ + y, t[10] = v - E * _;
    } else if (e.order === "XZY") {
      const v = u * f, S = u * h, y = d * f, E = d * h;
      t[0] = f * m, t[4] = -_, t[8] = h * m, t[1] = v * _ + E, t[5] = u * m, t[9] = S * _ - y, t[2] = y * _ - S, t[6] = d * m, t[10] = E * _ + v;
    }
    return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }
  makeRotationFromQuaternion(e) {
    return this.compose(Rx, e, Px);
  }
  lookAt(e, t, r) {
    const o = this.elements;
    return Yn.subVectors(e, t), Yn.lengthSq() === 0 && (Yn.z = 1), Yn.normalize(), Tr.crossVectors(r, Yn), Tr.lengthSq() === 0 && (Math.abs(r.z) === 1 ? Yn.x += 1e-4 : Yn.z += 1e-4, Yn.normalize(), Tr.crossVectors(r, Yn)), Tr.normalize(), Ll.crossVectors(Yn, Tr), o[0] = Tr.x, o[4] = Ll.x, o[8] = Yn.x, o[1] = Tr.y, o[5] = Ll.y, o[9] = Yn.y, o[2] = Tr.z, o[6] = Ll.z, o[10] = Yn.z, this;
  }
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  multiplyMatrices(e, t) {
    const r = e.elements, o = t.elements, l = this.elements, u = r[0], d = r[4], f = r[8], h = r[12], m = r[1], _ = r[5], v = r[9], S = r[13], y = r[2], E = r[6], x = r[10], M = r[14], L = r[3], R = r[7], D = r[11], ee = r[15], F = o[0], I = o[4], Y = o[8], ve = o[12], T = o[1], C = o[5], te = o[9], J = o[13], se = o[2], _e = o[6], Z = o[10], he = o[14], O = o[3], ue = o[7], ae = o[11], U = o[15];
    return l[0] = u * F + d * T + f * se + h * O, l[4] = u * I + d * C + f * _e + h * ue, l[8] = u * Y + d * te + f * Z + h * ae, l[12] = u * ve + d * J + f * he + h * U, l[1] = m * F + _ * T + v * se + S * O, l[5] = m * I + _ * C + v * _e + S * ue, l[9] = m * Y + _ * te + v * Z + S * ae, l[13] = m * ve + _ * J + v * he + S * U, l[2] = y * F + E * T + x * se + M * O, l[6] = y * I + E * C + x * _e + M * ue, l[10] = y * Y + E * te + x * Z + M * ae, l[14] = y * ve + E * J + x * he + M * U, l[3] = L * F + R * T + D * se + ee * O, l[7] = L * I + R * C + D * _e + ee * ue, l[11] = L * Y + R * te + D * Z + ee * ae, l[15] = L * ve + R * J + D * he + ee * U, this;
  }
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
  }
  determinant() {
    const e = this.elements, t = e[0], r = e[4], o = e[8], l = e[12], u = e[1], d = e[5], f = e[9], h = e[13], m = e[2], _ = e[6], v = e[10], S = e[14], y = e[3], E = e[7], x = e[11], M = e[15];
    return y * (+l * f * _ - o * h * _ - l * d * v + r * h * v + o * d * S - r * f * S) + E * (+t * f * S - t * h * v + l * u * v - o * u * S + o * h * m - l * f * m) + x * (+t * h * _ - t * d * S - l * u * _ + r * u * S + l * d * m - r * h * m) + M * (-o * d * m - t * f * _ + t * d * v + o * u * _ - r * u * v + r * f * m);
  }
  transpose() {
    const e = this.elements;
    let t;
    return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
  }
  setPosition(e, t, r) {
    const o = this.elements;
    return e.isVector3 ? (o[12] = e.x, o[13] = e.y, o[14] = e.z) : (o[12] = e, o[13] = t, o[14] = r), this;
  }
  invert() {
    const e = this.elements, t = e[0], r = e[1], o = e[2], l = e[3], u = e[4], d = e[5], f = e[6], h = e[7], m = e[8], _ = e[9], v = e[10], S = e[11], y = e[12], E = e[13], x = e[14], M = e[15], L = _ * x * h - E * v * h + E * f * S - d * x * S - _ * f * M + d * v * M, R = y * v * h - m * x * h - y * f * S + u * x * S + m * f * M - u * v * M, D = m * E * h - y * _ * h + y * d * S - u * E * S - m * d * M + u * _ * M, ee = y * _ * f - m * E * f - y * d * v + u * E * v + m * d * x - u * _ * x, F = t * L + r * R + o * D + l * ee;
    if (F === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const I = 1 / F;
    return e[0] = L * I, e[1] = (E * v * l - _ * x * l - E * o * S + r * x * S + _ * o * M - r * v * M) * I, e[2] = (d * x * l - E * f * l + E * o * h - r * x * h - d * o * M + r * f * M) * I, e[3] = (_ * f * l - d * v * l - _ * o * h + r * v * h + d * o * S - r * f * S) * I, e[4] = R * I, e[5] = (m * x * l - y * v * l + y * o * S - t * x * S - m * o * M + t * v * M) * I, e[6] = (y * f * l - u * x * l - y * o * h + t * x * h + u * o * M - t * f * M) * I, e[7] = (u * v * l - m * f * l + m * o * h - t * v * h - u * o * S + t * f * S) * I, e[8] = D * I, e[9] = (y * _ * l - m * E * l - y * r * S + t * E * S + m * r * M - t * _ * M) * I, e[10] = (u * E * l - y * d * l + y * r * h - t * E * h - u * r * M + t * d * M) * I, e[11] = (m * d * l - u * _ * l - m * r * h + t * _ * h + u * r * S - t * d * S) * I, e[12] = ee * I, e[13] = (m * E * o - y * _ * o + y * r * v - t * E * v - m * r * x + t * _ * x) * I, e[14] = (y * d * o - u * E * o - y * r * f + t * E * f + u * r * x - t * d * x) * I, e[15] = (u * _ * o - m * d * o + m * r * f - t * _ * f - u * r * v + t * d * v) * I, this;
  }
  scale(e) {
    const t = this.elements, r = e.x, o = e.y, l = e.z;
    return t[0] *= r, t[4] *= o, t[8] *= l, t[1] *= r, t[5] *= o, t[9] *= l, t[2] *= r, t[6] *= o, t[10] *= l, t[3] *= r, t[7] *= o, t[11] *= l, this;
  }
  getMaxScaleOnAxis() {
    const e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], r = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], o = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
    return Math.sqrt(Math.max(t, r, o));
  }
  makeTranslation(e, t, r) {
    return e.isVector3 ? this.set(
      1,
      0,
      0,
      e.x,
      0,
      1,
      0,
      e.y,
      0,
      0,
      1,
      e.z,
      0,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      0,
      e,
      0,
      1,
      0,
      t,
      0,
      0,
      1,
      r,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationX(e) {
    const t = Math.cos(e), r = Math.sin(e);
    return this.set(
      1,
      0,
      0,
      0,
      0,
      t,
      -r,
      0,
      0,
      r,
      t,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationY(e) {
    const t = Math.cos(e), r = Math.sin(e);
    return this.set(
      t,
      0,
      r,
      0,
      0,
      1,
      0,
      0,
      -r,
      0,
      t,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationZ(e) {
    const t = Math.cos(e), r = Math.sin(e);
    return this.set(
      t,
      -r,
      0,
      0,
      r,
      t,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeRotationAxis(e, t) {
    const r = Math.cos(t), o = Math.sin(t), l = 1 - r, u = e.x, d = e.y, f = e.z, h = l * u, m = l * d;
    return this.set(
      h * u + r,
      h * d - o * f,
      h * f + o * d,
      0,
      h * d + o * f,
      m * d + r,
      m * f - o * u,
      0,
      h * f - o * d,
      m * f + o * u,
      l * f * f + r,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeScale(e, t, r) {
    return this.set(
      e,
      0,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      0,
      r,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  makeShear(e, t, r, o, l, u) {
    return this.set(
      1,
      r,
      l,
      0,
      e,
      1,
      u,
      0,
      t,
      o,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  compose(e, t, r) {
    const o = this.elements, l = t._x, u = t._y, d = t._z, f = t._w, h = l + l, m = u + u, _ = d + d, v = l * h, S = l * m, y = l * _, E = u * m, x = u * _, M = d * _, L = f * h, R = f * m, D = f * _, ee = r.x, F = r.y, I = r.z;
    return o[0] = (1 - (E + M)) * ee, o[1] = (S + D) * ee, o[2] = (y - R) * ee, o[3] = 0, o[4] = (S - D) * F, o[5] = (1 - (v + M)) * F, o[6] = (x + L) * F, o[7] = 0, o[8] = (y + R) * I, o[9] = (x - L) * I, o[10] = (1 - (v + E)) * I, o[11] = 0, o[12] = e.x, o[13] = e.y, o[14] = e.z, o[15] = 1, this;
  }
  decompose(e, t, r) {
    const o = this.elements;
    let l = Hs.set(o[0], o[1], o[2]).length();
    const u = Hs.set(o[4], o[5], o[6]).length(), d = Hs.set(o[8], o[9], o[10]).length();
    this.determinant() < 0 && (l = -l), e.x = o[12], e.y = o[13], e.z = o[14], gi.copy(this);
    const h = 1 / l, m = 1 / u, _ = 1 / d;
    return gi.elements[0] *= h, gi.elements[1] *= h, gi.elements[2] *= h, gi.elements[4] *= m, gi.elements[5] *= m, gi.elements[6] *= m, gi.elements[8] *= _, gi.elements[9] *= _, gi.elements[10] *= _, t.setFromRotationMatrix(gi), r.x = l, r.y = u, r.z = d, this;
  }
  makePerspective(e, t, r, o, l, u, d = $i) {
    const f = this.elements, h = 2 * l / (t - e), m = 2 * l / (r - o), _ = (t + e) / (t - e), v = (r + o) / (r - o);
    let S, y;
    if (d === $i)
      S = -(u + l) / (u - l), y = -2 * u * l / (u - l);
    else if (d === uc)
      S = -u / (u - l), y = -u * l / (u - l);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + d);
    return f[0] = h, f[4] = 0, f[8] = _, f[12] = 0, f[1] = 0, f[5] = m, f[9] = v, f[13] = 0, f[2] = 0, f[6] = 0, f[10] = S, f[14] = y, f[3] = 0, f[7] = 0, f[11] = -1, f[15] = 0, this;
  }
  makeOrthographic(e, t, r, o, l, u, d = $i) {
    const f = this.elements, h = 1 / (t - e), m = 1 / (r - o), _ = 1 / (u - l), v = (t + e) * h, S = (r + o) * m;
    let y, E;
    if (d === $i)
      y = (u + l) * _, E = -2 * _;
    else if (d === uc)
      y = l * _, E = -1 * _;
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + d);
    return f[0] = 2 * h, f[4] = 0, f[8] = 0, f[12] = -v, f[1] = 0, f[5] = 2 * m, f[9] = 0, f[13] = -S, f[2] = 0, f[6] = 0, f[10] = E, f[14] = -y, f[3] = 0, f[7] = 0, f[11] = 0, f[15] = 1, this;
  }
  equals(e) {
    const t = this.elements, r = e.elements;
    for (let o = 0; o < 16; o++)
      if (t[o] !== r[o]) return !1;
    return !0;
  }
  fromArray(e, t = 0) {
    for (let r = 0; r < 16; r++)
      this.elements[r] = e[r + t];
    return this;
  }
  toArray(e = [], t = 0) {
    const r = this.elements;
    return e[t] = r[0], e[t + 1] = r[1], e[t + 2] = r[2], e[t + 3] = r[3], e[t + 4] = r[4], e[t + 5] = r[5], e[t + 6] = r[6], e[t + 7] = r[7], e[t + 8] = r[8], e[t + 9] = r[9], e[t + 10] = r[10], e[t + 11] = r[11], e[t + 12] = r[12], e[t + 13] = r[13], e[t + 14] = r[14], e[t + 15] = r[15], e;
  }
}
const Hs = /* @__PURE__ */ new z(), gi = /* @__PURE__ */ new Rt(), Rx = /* @__PURE__ */ new z(0, 0, 0), Px = /* @__PURE__ */ new z(1, 1, 1), Tr = /* @__PURE__ */ new z(), Ll = /* @__PURE__ */ new z(), Yn = /* @__PURE__ */ new z(), Im = /* @__PURE__ */ new Rt(), Um = /* @__PURE__ */ new as();
class ai {
  constructor(e = 0, t = 0, r = 0, o = ai.DEFAULT_ORDER) {
    this.isEuler = !0, this._x = e, this._y = t, this._z = r, this._order = o;
  }
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  get order() {
    return this._order;
  }
  set order(e) {
    this._order = e, this._onChangeCallback();
  }
  set(e, t, r, o = this._order) {
    return this._x = e, this._y = t, this._z = r, this._order = o, this._onChangeCallback(), this;
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(e) {
    return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
  }
  setFromRotationMatrix(e, t = this._order, r = !0) {
    const o = e.elements, l = o[0], u = o[4], d = o[8], f = o[1], h = o[5], m = o[9], _ = o[2], v = o[6], S = o[10];
    switch (t) {
      case "XYZ":
        this._y = Math.asin(Cn(d, -1, 1)), Math.abs(d) < 0.9999999 ? (this._x = Math.atan2(-m, S), this._z = Math.atan2(-u, l)) : (this._x = Math.atan2(v, h), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-Cn(m, -1, 1)), Math.abs(m) < 0.9999999 ? (this._y = Math.atan2(d, S), this._z = Math.atan2(f, h)) : (this._y = Math.atan2(-_, l), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(Cn(v, -1, 1)), Math.abs(v) < 0.9999999 ? (this._y = Math.atan2(-_, S), this._z = Math.atan2(-u, h)) : (this._y = 0, this._z = Math.atan2(f, l));
        break;
      case "ZYX":
        this._y = Math.asin(-Cn(_, -1, 1)), Math.abs(_) < 0.9999999 ? (this._x = Math.atan2(v, S), this._z = Math.atan2(f, l)) : (this._x = 0, this._z = Math.atan2(-u, h));
        break;
      case "YZX":
        this._z = Math.asin(Cn(f, -1, 1)), Math.abs(f) < 0.9999999 ? (this._x = Math.atan2(-m, h), this._y = Math.atan2(-_, l)) : (this._x = 0, this._y = Math.atan2(d, S));
        break;
      case "XZY":
        this._z = Math.asin(-Cn(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._x = Math.atan2(v, h), this._y = Math.atan2(d, l)) : (this._x = Math.atan2(-m, S), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
    }
    return this._order = t, r === !0 && this._onChangeCallback(), this;
  }
  setFromQuaternion(e, t, r) {
    return Im.makeRotationFromQuaternion(e), this.setFromRotationMatrix(Im, t, r);
  }
  setFromVector3(e, t = this._order) {
    return this.set(e.x, e.y, e.z, t);
  }
  reorder(e) {
    return Um.setFromEuler(this), this.setFromQuaternion(Um, e);
  }
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
  }
  fromArray(e) {
    return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
ai.DEFAULT_ORDER = "XYZ";
class ig {
  constructor() {
    this.mask = 1;
  }
  set(e) {
    this.mask = (1 << e | 0) >>> 0;
  }
  enable(e) {
    this.mask |= 1 << e | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(e) {
    this.mask ^= 1 << e | 0;
  }
  disable(e) {
    this.mask &= ~(1 << e | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(e) {
    return (this.mask & e.mask) !== 0;
  }
  isEnabled(e) {
    return (this.mask & (1 << e | 0)) !== 0;
  }
}
let Lx = 0;
const Fm = /* @__PURE__ */ new z(), Vs = /* @__PURE__ */ new as(), Wi = /* @__PURE__ */ new Rt(), Dl = /* @__PURE__ */ new z(), oa = /* @__PURE__ */ new z(), Dx = /* @__PURE__ */ new z(), Nx = /* @__PURE__ */ new as(), km = /* @__PURE__ */ new z(1, 0, 0), Om = /* @__PURE__ */ new z(0, 1, 0), Bm = /* @__PURE__ */ new z(0, 0, 1), zm = { type: "added" }, Ix = { type: "removed" }, Gs = { type: "childadded", child: null }, cd = { type: "childremoved", child: null };
class Xt extends vo {
  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: Lx++ }), this.uuid = Qi(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = Xt.DEFAULT_UP.clone();
    const e = new z(), t = new ai(), r = new as(), o = new z(1, 1, 1);
    function l() {
      r.setFromEuler(t, !1);
    }
    function u() {
      t.setFromQuaternion(r, void 0, !1);
    }
    t._onChange(l), r._onChange(u), Object.defineProperties(this, {
      position: {
        configurable: !0,
        enumerable: !0,
        value: e
      },
      rotation: {
        configurable: !0,
        enumerable: !0,
        value: t
      },
      quaternion: {
        configurable: !0,
        enumerable: !0,
        value: r
      },
      scale: {
        configurable: !0,
        enumerable: !0,
        value: o
      },
      modelViewMatrix: {
        value: new Rt()
      },
      normalMatrix: {
        value: new dt()
      }
    }), this.matrix = new Rt(), this.matrixWorld = new Rt(), this.matrixAutoUpdate = Xt.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new ig(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.userData = {};
  }
  onBeforeShadow() {
  }
  onAfterShadow() {
  }
  onBeforeRender() {
  }
  onAfterRender() {
  }
  applyMatrix4(e) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  applyQuaternion(e) {
    return this.quaternion.premultiply(e), this;
  }
  setRotationFromAxisAngle(e, t) {
    this.quaternion.setFromAxisAngle(e, t);
  }
  setRotationFromEuler(e) {
    this.quaternion.setFromEuler(e, !0);
  }
  setRotationFromMatrix(e) {
    this.quaternion.setFromRotationMatrix(e);
  }
  setRotationFromQuaternion(e) {
    this.quaternion.copy(e);
  }
  rotateOnAxis(e, t) {
    return Vs.setFromAxisAngle(e, t), this.quaternion.multiply(Vs), this;
  }
  rotateOnWorldAxis(e, t) {
    return Vs.setFromAxisAngle(e, t), this.quaternion.premultiply(Vs), this;
  }
  rotateX(e) {
    return this.rotateOnAxis(km, e);
  }
  rotateY(e) {
    return this.rotateOnAxis(Om, e);
  }
  rotateZ(e) {
    return this.rotateOnAxis(Bm, e);
  }
  translateOnAxis(e, t) {
    return Fm.copy(e).applyQuaternion(this.quaternion), this.position.add(Fm.multiplyScalar(t)), this;
  }
  translateX(e) {
    return this.translateOnAxis(km, e);
  }
  translateY(e) {
    return this.translateOnAxis(Om, e);
  }
  translateZ(e) {
    return this.translateOnAxis(Bm, e);
  }
  localToWorld(e) {
    return this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(e) {
    return this.updateWorldMatrix(!0, !1), e.applyMatrix4(Wi.copy(this.matrixWorld).invert());
  }
  lookAt(e, t, r) {
    e.isVector3 ? Dl.copy(e) : Dl.set(e, t, r);
    const o = this.parent;
    this.updateWorldMatrix(!0, !1), oa.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? Wi.lookAt(oa, Dl, this.up) : Wi.lookAt(Dl, oa, this.up), this.quaternion.setFromRotationMatrix(Wi), o && (Wi.extractRotation(o.matrixWorld), Vs.setFromRotationMatrix(Wi), this.quaternion.premultiply(Vs.invert()));
  }
  add(e) {
    if (arguments.length > 1) {
      for (let t = 0; t < arguments.length; t++)
        this.add(arguments[t]);
      return this;
    }
    return e === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(zm), Gs.child = e, this.dispatchEvent(Gs), Gs.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", e), this);
  }
  remove(e) {
    if (arguments.length > 1) {
      for (let r = 0; r < arguments.length; r++)
        this.remove(arguments[r]);
      return this;
    }
    const t = this.children.indexOf(e);
    return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(Ix), cd.child = e, this.dispatchEvent(cd), cd.child = null), this;
  }
  removeFromParent() {
    const e = this.parent;
    return e !== null && e.remove(this), this;
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(e) {
    return this.updateWorldMatrix(!0, !1), Wi.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(!0, !1), Wi.multiply(e.parent.matrixWorld)), e.applyMatrix4(Wi), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(!1, !0), e.dispatchEvent(zm), Gs.child = e, this.dispatchEvent(Gs), Gs.child = null, this;
  }
  getObjectById(e) {
    return this.getObjectByProperty("id", e);
  }
  getObjectByName(e) {
    return this.getObjectByProperty("name", e);
  }
  getObjectByProperty(e, t) {
    if (this[e] === t) return this;
    for (let r = 0, o = this.children.length; r < o; r++) {
      const u = this.children[r].getObjectByProperty(e, t);
      if (u !== void 0)
        return u;
    }
  }
  getObjectsByProperty(e, t, r = []) {
    this[e] === t && r.push(this);
    const o = this.children;
    for (let l = 0, u = o.length; l < u; l++)
      o[l].getObjectsByProperty(e, t, r);
    return r;
  }
  getWorldPosition(e) {
    return this.updateWorldMatrix(!0, !1), e.setFromMatrixPosition(this.matrixWorld);
  }
  getWorldQuaternion(e) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(oa, e, Dx), e;
  }
  getWorldScale(e) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(oa, Nx, e), e;
  }
  getWorldDirection(e) {
    this.updateWorldMatrix(!0, !1);
    const t = this.matrixWorld.elements;
    return e.set(t[8], t[9], t[10]).normalize();
  }
  raycast() {
  }
  traverse(e) {
    e(this);
    const t = this.children;
    for (let r = 0, o = t.length; r < o; r++)
      t[r].traverse(e);
  }
  traverseVisible(e) {
    if (this.visible === !1) return;
    e(this);
    const t = this.children;
    for (let r = 0, o = t.length; r < o; r++)
      t[r].traverseVisible(e);
  }
  traverseAncestors(e) {
    const t = this.parent;
    t !== null && (e(t), t.traverseAncestors(e));
  }
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
  }
  updateMatrixWorld(e) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, e = !0);
    const t = this.children;
    for (let r = 0, o = t.length; r < o; r++)
      t[r].updateMatrixWorld(e);
  }
  updateWorldMatrix(e, t) {
    const r = this.parent;
    if (e === !0 && r !== null && r.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), t === !0) {
      const o = this.children;
      for (let l = 0, u = o.length; l < u; l++)
        o[l].updateWorldMatrix(!1, !0);
    }
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string", r = {};
    t && (e = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, r.metadata = {
      version: 4.6,
      type: "Object",
      generator: "Object3D.toJSON"
    });
    const o = {};
    o.uuid = this.uuid, o.type = this.type, this.name !== "" && (o.name = this.name), this.castShadow === !0 && (o.castShadow = !0), this.receiveShadow === !0 && (o.receiveShadow = !0), this.visible === !1 && (o.visible = !1), this.frustumCulled === !1 && (o.frustumCulled = !1), this.renderOrder !== 0 && (o.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (o.userData = this.userData), o.layers = this.layers.mask, o.matrix = this.matrix.toArray(), o.up = this.up.toArray(), this.matrixAutoUpdate === !1 && (o.matrixAutoUpdate = !1), this.isInstancedMesh && (o.type = "InstancedMesh", o.count = this.count, o.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (o.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (o.type = "BatchedMesh", o.perObjectFrustumCulled = this.perObjectFrustumCulled, o.sortObjects = this.sortObjects, o.drawRanges = this._drawRanges, o.reservedRanges = this._reservedRanges, o.visibility = this._visibility, o.active = this._active, o.bounds = this._bounds.map((d) => ({
      boxInitialized: d.boxInitialized,
      boxMin: d.box.min.toArray(),
      boxMax: d.box.max.toArray(),
      sphereInitialized: d.sphereInitialized,
      sphereRadius: d.sphere.radius,
      sphereCenter: d.sphere.center.toArray()
    })), o.maxInstanceCount = this._maxInstanceCount, o.maxVertexCount = this._maxVertexCount, o.maxIndexCount = this._maxIndexCount, o.geometryInitialized = this._geometryInitialized, o.geometryCount = this._geometryCount, o.matricesTexture = this._matricesTexture.toJSON(e), this._colorsTexture !== null && (o.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (o.boundingSphere = {
      center: o.boundingSphere.center.toArray(),
      radius: o.boundingSphere.radius
    }), this.boundingBox !== null && (o.boundingBox = {
      min: o.boundingBox.min.toArray(),
      max: o.boundingBox.max.toArray()
    }));
    function l(d, f) {
      return d[f.uuid] === void 0 && (d[f.uuid] = f.toJSON(e)), f.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? o.background = this.background.toJSON() : this.background.isTexture && (o.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (o.environment = this.environment.toJSON(e).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      o.geometry = l(e.geometries, this.geometry);
      const d = this.geometry.parameters;
      if (d !== void 0 && d.shapes !== void 0) {
        const f = d.shapes;
        if (Array.isArray(f))
          for (let h = 0, m = f.length; h < m; h++) {
            const _ = f[h];
            l(e.shapes, _);
          }
        else
          l(e.shapes, f);
      }
    }
    if (this.isSkinnedMesh && (o.bindMode = this.bindMode, o.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (l(e.skeletons, this.skeleton), o.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const d = [];
        for (let f = 0, h = this.material.length; f < h; f++)
          d.push(l(e.materials, this.material[f]));
        o.material = d;
      } else
        o.material = l(e.materials, this.material);
    if (this.children.length > 0) {
      o.children = [];
      for (let d = 0; d < this.children.length; d++)
        o.children.push(this.children[d].toJSON(e).object);
    }
    if (this.animations.length > 0) {
      o.animations = [];
      for (let d = 0; d < this.animations.length; d++) {
        const f = this.animations[d];
        o.animations.push(l(e.animations, f));
      }
    }
    if (t) {
      const d = u(e.geometries), f = u(e.materials), h = u(e.textures), m = u(e.images), _ = u(e.shapes), v = u(e.skeletons), S = u(e.animations), y = u(e.nodes);
      d.length > 0 && (r.geometries = d), f.length > 0 && (r.materials = f), h.length > 0 && (r.textures = h), m.length > 0 && (r.images = m), _.length > 0 && (r.shapes = _), v.length > 0 && (r.skeletons = v), S.length > 0 && (r.animations = S), y.length > 0 && (r.nodes = y);
    }
    return r.object = o, r;
    function u(d) {
      const f = [];
      for (const h in d) {
        const m = d[h];
        delete m.metadata, f.push(m);
      }
      return f;
    }
  }
  clone(e) {
    return new this.constructor().copy(this, e);
  }
  copy(e, t = !0) {
    if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === !0)
      for (let r = 0; r < e.children.length; r++) {
        const o = e.children[r];
        this.add(o.clone());
      }
    return this;
  }
}
Xt.DEFAULT_UP = /* @__PURE__ */ new z(0, 1, 0);
Xt.DEFAULT_MATRIX_AUTO_UPDATE = !0;
Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const vi = /* @__PURE__ */ new z(), Xi = /* @__PURE__ */ new z(), ud = /* @__PURE__ */ new z(), ji = /* @__PURE__ */ new z(), Ws = /* @__PURE__ */ new z(), Xs = /* @__PURE__ */ new z(), Hm = /* @__PURE__ */ new z(), dd = /* @__PURE__ */ new z(), fd = /* @__PURE__ */ new z(), hd = /* @__PURE__ */ new z(), pd = /* @__PURE__ */ new Lt(), md = /* @__PURE__ */ new Lt(), gd = /* @__PURE__ */ new Lt();
class si {
  constructor(e = new z(), t = new z(), r = new z()) {
    this.a = e, this.b = t, this.c = r;
  }
  static getNormal(e, t, r, o) {
    o.subVectors(r, t), vi.subVectors(e, t), o.cross(vi);
    const l = o.lengthSq();
    return l > 0 ? o.multiplyScalar(1 / Math.sqrt(l)) : o.set(0, 0, 0);
  }
  // static/instance method to calculate barycentric coordinates
  // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
  static getBarycoord(e, t, r, o, l) {
    vi.subVectors(o, t), Xi.subVectors(r, t), ud.subVectors(e, t);
    const u = vi.dot(vi), d = vi.dot(Xi), f = vi.dot(ud), h = Xi.dot(Xi), m = Xi.dot(ud), _ = u * h - d * d;
    if (_ === 0)
      return l.set(0, 0, 0), null;
    const v = 1 / _, S = (h * f - d * m) * v, y = (u * m - d * f) * v;
    return l.set(1 - S - y, y, S);
  }
  static containsPoint(e, t, r, o) {
    return this.getBarycoord(e, t, r, o, ji) === null ? !1 : ji.x >= 0 && ji.y >= 0 && ji.x + ji.y <= 1;
  }
  static getInterpolation(e, t, r, o, l, u, d, f) {
    return this.getBarycoord(e, t, r, o, ji) === null ? (f.x = 0, f.y = 0, "z" in f && (f.z = 0), "w" in f && (f.w = 0), null) : (f.setScalar(0), f.addScaledVector(l, ji.x), f.addScaledVector(u, ji.y), f.addScaledVector(d, ji.z), f);
  }
  static getInterpolatedAttribute(e, t, r, o, l, u) {
    return pd.setScalar(0), md.setScalar(0), gd.setScalar(0), pd.fromBufferAttribute(e, t), md.fromBufferAttribute(e, r), gd.fromBufferAttribute(e, o), u.setScalar(0), u.addScaledVector(pd, l.x), u.addScaledVector(md, l.y), u.addScaledVector(gd, l.z), u;
  }
  static isFrontFacing(e, t, r, o) {
    return vi.subVectors(r, t), Xi.subVectors(e, t), vi.cross(Xi).dot(o) < 0;
  }
  set(e, t, r) {
    return this.a.copy(e), this.b.copy(t), this.c.copy(r), this;
  }
  setFromPointsAndIndices(e, t, r, o) {
    return this.a.copy(e[t]), this.b.copy(e[r]), this.c.copy(e[o]), this;
  }
  setFromAttributeAndIndices(e, t, r, o) {
    return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, r), this.c.fromBufferAttribute(e, o), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
  }
  getArea() {
    return vi.subVectors(this.c, this.b), Xi.subVectors(this.a, this.b), vi.cross(Xi).length() * 0.5;
  }
  getMidpoint(e) {
    return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  getNormal(e) {
    return si.getNormal(this.a, this.b, this.c, e);
  }
  getPlane(e) {
    return e.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(e, t) {
    return si.getBarycoord(e, this.a, this.b, this.c, t);
  }
  getInterpolation(e, t, r, o, l) {
    return si.getInterpolation(e, this.a, this.b, this.c, t, r, o, l);
  }
  containsPoint(e) {
    return si.containsPoint(e, this.a, this.b, this.c);
  }
  isFrontFacing(e) {
    return si.isFrontFacing(this.a, this.b, this.c, e);
  }
  intersectsBox(e) {
    return e.intersectsTriangle(this);
  }
  closestPointToPoint(e, t) {
    const r = this.a, o = this.b, l = this.c;
    let u, d;
    Ws.subVectors(o, r), Xs.subVectors(l, r), dd.subVectors(e, r);
    const f = Ws.dot(dd), h = Xs.dot(dd);
    if (f <= 0 && h <= 0)
      return t.copy(r);
    fd.subVectors(e, o);
    const m = Ws.dot(fd), _ = Xs.dot(fd);
    if (m >= 0 && _ <= m)
      return t.copy(o);
    const v = f * _ - m * h;
    if (v <= 0 && f >= 0 && m <= 0)
      return u = f / (f - m), t.copy(r).addScaledVector(Ws, u);
    hd.subVectors(e, l);
    const S = Ws.dot(hd), y = Xs.dot(hd);
    if (y >= 0 && S <= y)
      return t.copy(l);
    const E = S * h - f * y;
    if (E <= 0 && h >= 0 && y <= 0)
      return d = h / (h - y), t.copy(r).addScaledVector(Xs, d);
    const x = m * y - S * _;
    if (x <= 0 && _ - m >= 0 && S - y >= 0)
      return Hm.subVectors(l, o), d = (_ - m) / (_ - m + (S - y)), t.copy(o).addScaledVector(Hm, d);
    const M = 1 / (x + E + v);
    return u = E * M, d = v * M, t.copy(r).addScaledVector(Ws, u).addScaledVector(Xs, d);
  }
  equals(e) {
    return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
  }
}
const rg = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
}, br = { h: 0, s: 0, l: 0 }, Nl = { h: 0, s: 0, l: 0 };
function vd(s, e, t) {
  return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? s + (e - s) * 6 * t : t < 1 / 2 ? e : t < 2 / 3 ? s + (e - s) * 6 * (2 / 3 - t) : s;
}
class lt {
  constructor(e, t, r) {
    return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, r);
  }
  set(e, t, r) {
    if (t === void 0 && r === void 0) {
      const o = e;
      o && o.isColor ? this.copy(o) : typeof o == "number" ? this.setHex(o) : typeof o == "string" && this.setStyle(o);
    } else
      this.setRGB(e, t, r);
    return this;
  }
  setScalar(e) {
    return this.r = e, this.g = e, this.b = e, this;
  }
  setHex(e, t = yn) {
    return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, Tt.toWorkingColorSpace(this, t), this;
  }
  setRGB(e, t, r, o = Tt.workingColorSpace) {
    return this.r = e, this.g = t, this.b = r, Tt.toWorkingColorSpace(this, o), this;
  }
  setHSL(e, t, r, o = Tt.workingColorSpace) {
    if (e = Bf(e, 1), t = Cn(t, 0, 1), r = Cn(r, 0, 1), t === 0)
      this.r = this.g = this.b = r;
    else {
      const l = r <= 0.5 ? r * (1 + t) : r + t - r * t, u = 2 * r - l;
      this.r = vd(u, l, e + 1 / 3), this.g = vd(u, l, e), this.b = vd(u, l, e - 1 / 3);
    }
    return Tt.toWorkingColorSpace(this, o), this;
  }
  setStyle(e, t = yn) {
    function r(l) {
      l !== void 0 && parseFloat(l) < 1 && console.warn("THREE.Color: Alpha component of " + e + " will be ignored.");
    }
    let o;
    if (o = /^(\w+)\(([^\)]*)\)/.exec(e)) {
      let l;
      const u = o[1], d = o[2];
      switch (u) {
        case "rgb":
        case "rgba":
          if (l = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))
            return r(l[4]), this.setRGB(
              Math.min(255, parseInt(l[1], 10)) / 255,
              Math.min(255, parseInt(l[2], 10)) / 255,
              Math.min(255, parseInt(l[3], 10)) / 255,
              t
            );
          if (l = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))
            return r(l[4]), this.setRGB(
              Math.min(100, parseInt(l[1], 10)) / 100,
              Math.min(100, parseInt(l[2], 10)) / 100,
              Math.min(100, parseInt(l[3], 10)) / 100,
              t
            );
          break;
        case "hsl":
        case "hsla":
          if (l = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))
            return r(l[4]), this.setHSL(
              parseFloat(l[1]) / 360,
              parseFloat(l[2]) / 100,
              parseFloat(l[3]) / 100,
              t
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + e);
      }
    } else if (o = /^\#([A-Fa-f\d]+)$/.exec(e)) {
      const l = o[1], u = l.length;
      if (u === 3)
        return this.setRGB(
          parseInt(l.charAt(0), 16) / 15,
          parseInt(l.charAt(1), 16) / 15,
          parseInt(l.charAt(2), 16) / 15,
          t
        );
      if (u === 6)
        return this.setHex(parseInt(l, 16), t);
      console.warn("THREE.Color: Invalid hex color " + e);
    } else if (e && e.length > 0)
      return this.setColorName(e, t);
    return this;
  }
  setColorName(e, t = yn) {
    const r = rg[e.toLowerCase()];
    return r !== void 0 ? this.setHex(r, t) : console.warn("THREE.Color: Unknown color " + e), this;
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(e) {
    return this.r = e.r, this.g = e.g, this.b = e.b, this;
  }
  copySRGBToLinear(e) {
    return this.r = oo(e.r), this.g = oo(e.g), this.b = oo(e.b), this;
  }
  copyLinearToSRGB(e) {
    return this.r = td(e.r), this.g = td(e.g), this.b = td(e.b), this;
  }
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  getHex(e = yn) {
    return Tt.fromWorkingColorSpace(xn.copy(this), e), Math.round(Cn(xn.r * 255, 0, 255)) * 65536 + Math.round(Cn(xn.g * 255, 0, 255)) * 256 + Math.round(Cn(xn.b * 255, 0, 255));
  }
  getHexString(e = yn) {
    return ("000000" + this.getHex(e).toString(16)).slice(-6);
  }
  getHSL(e, t = Tt.workingColorSpace) {
    Tt.fromWorkingColorSpace(xn.copy(this), t);
    const r = xn.r, o = xn.g, l = xn.b, u = Math.max(r, o, l), d = Math.min(r, o, l);
    let f, h;
    const m = (d + u) / 2;
    if (d === u)
      f = 0, h = 0;
    else {
      const _ = u - d;
      switch (h = m <= 0.5 ? _ / (u + d) : _ / (2 - u - d), u) {
        case r:
          f = (o - l) / _ + (o < l ? 6 : 0);
          break;
        case o:
          f = (l - r) / _ + 2;
          break;
        case l:
          f = (r - o) / _ + 4;
          break;
      }
      f /= 6;
    }
    return e.h = f, e.s = h, e.l = m, e;
  }
  getRGB(e, t = Tt.workingColorSpace) {
    return Tt.fromWorkingColorSpace(xn.copy(this), t), e.r = xn.r, e.g = xn.g, e.b = xn.b, e;
  }
  getStyle(e = yn) {
    Tt.fromWorkingColorSpace(xn.copy(this), e);
    const t = xn.r, r = xn.g, o = xn.b;
    return e !== yn ? `color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${o.toFixed(3)})` : `rgb(${Math.round(t * 255)},${Math.round(r * 255)},${Math.round(o * 255)})`;
  }
  offsetHSL(e, t, r) {
    return this.getHSL(br), this.setHSL(br.h + e, br.s + t, br.l + r);
  }
  add(e) {
    return this.r += e.r, this.g += e.g, this.b += e.b, this;
  }
  addColors(e, t) {
    return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
  }
  addScalar(e) {
    return this.r += e, this.g += e, this.b += e, this;
  }
  sub(e) {
    return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
  }
  multiply(e) {
    return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
  }
  multiplyScalar(e) {
    return this.r *= e, this.g *= e, this.b *= e, this;
  }
  lerp(e, t) {
    return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
  }
  lerpColors(e, t, r) {
    return this.r = e.r + (t.r - e.r) * r, this.g = e.g + (t.g - e.g) * r, this.b = e.b + (t.b - e.b) * r, this;
  }
  lerpHSL(e, t) {
    this.getHSL(br), e.getHSL(Nl);
    const r = ga(br.h, Nl.h, t), o = ga(br.s, Nl.s, t), l = ga(br.l, Nl.l, t);
    return this.setHSL(r, o, l), this;
  }
  setFromVector3(e) {
    return this.r = e.x, this.g = e.y, this.b = e.z, this;
  }
  applyMatrix3(e) {
    const t = this.r, r = this.g, o = this.b, l = e.elements;
    return this.r = l[0] * t + l[3] * r + l[6] * o, this.g = l[1] * t + l[4] * r + l[7] * o, this.b = l[2] * t + l[5] * r + l[8] * o, this;
  }
  equals(e) {
    return e.r === this.r && e.g === this.g && e.b === this.b;
  }
  fromArray(e, t = 0) {
    return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
  }
  toArray(e = [], t = 0) {
    return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
  }
  fromBufferAttribute(e, t) {
    return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const xn = /* @__PURE__ */ new lt();
lt.NAMES = rg;
let Ux = 0;
class cs extends vo {
  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: Ux++ }), this.uuid = Qi(), this.name = "", this.type = "Material", this.blending = ro, this.side = Lr, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = Od, this.blendDst = Bd, this.blendEquation = ns, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new lt(0, 0, 0), this.blendAlpha = 0, this.depthFunc = lo, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = Am, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = Fs, this.stencilZFail = Fs, this.stencilZPass = Fs, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(e) {
    this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
  }
  // onBeforeRender and onBeforeCompile only supported in WebGLRenderer
  onBeforeRender() {
  }
  onBeforeCompile() {
  }
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(e) {
    if (e !== void 0)
      for (const t in e) {
        const r = e[t];
        if (r === void 0) {
          console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);
          continue;
        }
        const o = this[t];
        if (o === void 0) {
          console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);
          continue;
        }
        o && o.isColor ? o.set(r) : o && o.isVector3 && r && r.isVector3 ? o.copy(r) : this[t] = r;
      }
  }
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    t && (e = {
      textures: {},
      images: {}
    });
    const r = {
      metadata: {
        version: 4.6,
        type: "Material",
        generator: "Material.toJSON"
      }
    };
    r.uuid = this.uuid, r.type = this.type, this.name !== "" && (r.name = this.name), this.color && this.color.isColor && (r.color = this.color.getHex()), this.roughness !== void 0 && (r.roughness = this.roughness), this.metalness !== void 0 && (r.metalness = this.metalness), this.sheen !== void 0 && (r.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (r.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (r.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (r.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (r.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (r.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (r.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (r.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (r.shininess = this.shininess), this.clearcoat !== void 0 && (r.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (r.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (r.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (r.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (r.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, r.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (r.dispersion = this.dispersion), this.iridescence !== void 0 && (r.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (r.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (r.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (r.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (r.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (r.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (r.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (r.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (r.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (r.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (r.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (r.lightMap = this.lightMap.toJSON(e).uuid, r.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (r.aoMap = this.aoMap.toJSON(e).uuid, r.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (r.bumpMap = this.bumpMap.toJSON(e).uuid, r.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (r.normalMap = this.normalMap.toJSON(e).uuid, r.normalMapType = this.normalMapType, r.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (r.displacementMap = this.displacementMap.toJSON(e).uuid, r.displacementScale = this.displacementScale, r.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (r.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (r.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (r.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (r.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (r.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (r.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (r.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (r.combine = this.combine)), this.envMapRotation !== void 0 && (r.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (r.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (r.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (r.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (r.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (r.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (r.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (r.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (r.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (r.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (r.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (r.size = this.size), this.shadowSide !== null && (r.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (r.sizeAttenuation = this.sizeAttenuation), this.blending !== ro && (r.blending = this.blending), this.side !== Lr && (r.side = this.side), this.vertexColors === !0 && (r.vertexColors = !0), this.opacity < 1 && (r.opacity = this.opacity), this.transparent === !0 && (r.transparent = !0), this.blendSrc !== Od && (r.blendSrc = this.blendSrc), this.blendDst !== Bd && (r.blendDst = this.blendDst), this.blendEquation !== ns && (r.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (r.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (r.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (r.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (r.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (r.blendAlpha = this.blendAlpha), this.depthFunc !== lo && (r.depthFunc = this.depthFunc), this.depthTest === !1 && (r.depthTest = this.depthTest), this.depthWrite === !1 && (r.depthWrite = this.depthWrite), this.colorWrite === !1 && (r.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (r.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== Am && (r.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (r.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (r.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== Fs && (r.stencilFail = this.stencilFail), this.stencilZFail !== Fs && (r.stencilZFail = this.stencilZFail), this.stencilZPass !== Fs && (r.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (r.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (r.rotation = this.rotation), this.polygonOffset === !0 && (r.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (r.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (r.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (r.linewidth = this.linewidth), this.dashSize !== void 0 && (r.dashSize = this.dashSize), this.gapSize !== void 0 && (r.gapSize = this.gapSize), this.scale !== void 0 && (r.scale = this.scale), this.dithering === !0 && (r.dithering = !0), this.alphaTest > 0 && (r.alphaTest = this.alphaTest), this.alphaHash === !0 && (r.alphaHash = !0), this.alphaToCoverage === !0 && (r.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (r.premultipliedAlpha = !0), this.forceSinglePass === !0 && (r.forceSinglePass = !0), this.wireframe === !0 && (r.wireframe = !0), this.wireframeLinewidth > 1 && (r.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (r.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (r.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (r.flatShading = !0), this.visible === !1 && (r.visible = !1), this.toneMapped === !1 && (r.toneMapped = !1), this.fog === !1 && (r.fog = !1), Object.keys(this.userData).length > 0 && (r.userData = this.userData);
    function o(l) {
      const u = [];
      for (const d in l) {
        const f = l[d];
        delete f.metadata, u.push(f);
      }
      return u;
    }
    if (t) {
      const l = o(e.textures), u = o(e.images);
      l.length > 0 && (r.textures = l), u.length > 0 && (r.images = u);
    }
    return r;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
    const t = e.clippingPlanes;
    let r = null;
    if (t !== null) {
      const o = t.length;
      r = new Array(o);
      for (let l = 0; l !== o; ++l)
        r[l] = t[l].clone();
    }
    return this.clippingPlanes = r, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  onBuild() {
    console.warn("Material: onBuild() has been removed.");
  }
}
class Dr extends cs {
  constructor(e) {
    super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new lt(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new ai(), this.combine = U0, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
  }
}
const Yt = /* @__PURE__ */ new z(), Il = /* @__PURE__ */ new Qe();
class Kn {
  constructor(e, t, r = !1) {
    if (Array.isArray(e))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, this.name = "", this.array = e, this.itemSize = t, this.count = e !== void 0 ? e.length / t : 0, this.normalized = r, this.usage = wf, this.updateRanges = [], this.gpuType = Ci, this.version = 0;
  }
  onUploadCallback() {
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  setUsage(e) {
    return this.usage = e, this;
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(e) {
    return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
  }
  copyAt(e, t, r) {
    e *= this.itemSize, r *= t.itemSize;
    for (let o = 0, l = this.itemSize; o < l; o++)
      this.array[e + o] = t.array[r + o];
    return this;
  }
  copyArray(e) {
    return this.array.set(e), this;
  }
  applyMatrix3(e) {
    if (this.itemSize === 2)
      for (let t = 0, r = this.count; t < r; t++)
        Il.fromBufferAttribute(this, t), Il.applyMatrix3(e), this.setXY(t, Il.x, Il.y);
    else if (this.itemSize === 3)
      for (let t = 0, r = this.count; t < r; t++)
        Yt.fromBufferAttribute(this, t), Yt.applyMatrix3(e), this.setXYZ(t, Yt.x, Yt.y, Yt.z);
    return this;
  }
  applyMatrix4(e) {
    for (let t = 0, r = this.count; t < r; t++)
      Yt.fromBufferAttribute(this, t), Yt.applyMatrix4(e), this.setXYZ(t, Yt.x, Yt.y, Yt.z);
    return this;
  }
  applyNormalMatrix(e) {
    for (let t = 0, r = this.count; t < r; t++)
      Yt.fromBufferAttribute(this, t), Yt.applyNormalMatrix(e), this.setXYZ(t, Yt.x, Yt.y, Yt.z);
    return this;
  }
  transformDirection(e) {
    for (let t = 0, r = this.count; t < r; t++)
      Yt.fromBufferAttribute(this, t), Yt.transformDirection(e), this.setXYZ(t, Yt.x, Yt.y, Yt.z);
    return this;
  }
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  getComponent(e, t) {
    let r = this.array[e * this.itemSize + t];
    return this.normalized && (r = yi(r, this.array)), r;
  }
  setComponent(e, t, r) {
    return this.normalized && (r = At(r, this.array)), this.array[e * this.itemSize + t] = r, this;
  }
  getX(e) {
    let t = this.array[e * this.itemSize];
    return this.normalized && (t = yi(t, this.array)), t;
  }
  setX(e, t) {
    return this.normalized && (t = At(t, this.array)), this.array[e * this.itemSize] = t, this;
  }
  getY(e) {
    let t = this.array[e * this.itemSize + 1];
    return this.normalized && (t = yi(t, this.array)), t;
  }
  setY(e, t) {
    return this.normalized && (t = At(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
  }
  getZ(e) {
    let t = this.array[e * this.itemSize + 2];
    return this.normalized && (t = yi(t, this.array)), t;
  }
  setZ(e, t) {
    return this.normalized && (t = At(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
  }
  getW(e) {
    let t = this.array[e * this.itemSize + 3];
    return this.normalized && (t = yi(t, this.array)), t;
  }
  setW(e, t) {
    return this.normalized && (t = At(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
  }
  setXY(e, t, r) {
    return e *= this.itemSize, this.normalized && (t = At(t, this.array), r = At(r, this.array)), this.array[e + 0] = t, this.array[e + 1] = r, this;
  }
  setXYZ(e, t, r, o) {
    return e *= this.itemSize, this.normalized && (t = At(t, this.array), r = At(r, this.array), o = At(o, this.array)), this.array[e + 0] = t, this.array[e + 1] = r, this.array[e + 2] = o, this;
  }
  setXYZW(e, t, r, o, l) {
    return e *= this.itemSize, this.normalized && (t = At(t, this.array), r = At(r, this.array), o = At(o, this.array), l = At(l, this.array)), this.array[e + 0] = t, this.array[e + 1] = r, this.array[e + 2] = o, this.array[e + 3] = l, this;
  }
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const e = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (e.name = this.name), this.usage !== wf && (e.usage = this.usage), e;
  }
}
class sg extends Kn {
  constructor(e, t, r) {
    super(new Uint16Array(e), t, r);
  }
}
class og extends Kn {
  constructor(e, t, r) {
    super(new Uint32Array(e), t, r);
  }
}
class fn extends Kn {
  constructor(e, t, r) {
    super(new Float32Array(e), t, r);
  }
}
let Fx = 0;
const ri = /* @__PURE__ */ new Rt(), _d = /* @__PURE__ */ new Xt(), js = /* @__PURE__ */ new z(), qn = /* @__PURE__ */ new ls(), aa = /* @__PURE__ */ new ls(), ln = /* @__PURE__ */ new z();
class Ln extends vo {
  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: Fx++ }), this.uuid = Qi(), this.name = "", this.type = "BufferGeometry", this.index = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  getIndex() {
    return this.index;
  }
  setIndex(e) {
    return Array.isArray(e) ? this.index = new (J0(e) ? og : sg)(e, 1) : this.index = e, this;
  }
  getAttribute(e) {
    return this.attributes[e];
  }
  setAttribute(e, t) {
    return this.attributes[e] = t, this;
  }
  deleteAttribute(e) {
    return delete this.attributes[e], this;
  }
  hasAttribute(e) {
    return this.attributes[e] !== void 0;
  }
  addGroup(e, t, r = 0) {
    this.groups.push({
      start: e,
      count: t,
      materialIndex: r
    });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(e, t) {
    this.drawRange.start = e, this.drawRange.count = t;
  }
  applyMatrix4(e) {
    const t = this.attributes.position;
    t !== void 0 && (t.applyMatrix4(e), t.needsUpdate = !0);
    const r = this.attributes.normal;
    if (r !== void 0) {
      const l = new dt().getNormalMatrix(e);
      r.applyNormalMatrix(l), r.needsUpdate = !0;
    }
    const o = this.attributes.tangent;
    return o !== void 0 && (o.transformDirection(e), o.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  applyQuaternion(e) {
    return ri.makeRotationFromQuaternion(e), this.applyMatrix4(ri), this;
  }
  rotateX(e) {
    return ri.makeRotationX(e), this.applyMatrix4(ri), this;
  }
  rotateY(e) {
    return ri.makeRotationY(e), this.applyMatrix4(ri), this;
  }
  rotateZ(e) {
    return ri.makeRotationZ(e), this.applyMatrix4(ri), this;
  }
  translate(e, t, r) {
    return ri.makeTranslation(e, t, r), this.applyMatrix4(ri), this;
  }
  scale(e, t, r) {
    return ri.makeScale(e, t, r), this.applyMatrix4(ri), this;
  }
  lookAt(e) {
    return _d.lookAt(e), _d.updateMatrix(), this.applyMatrix4(_d.matrix), this;
  }
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(js).negate(), this.translate(js.x, js.y, js.z), this;
  }
  setFromPoints(e) {
    const t = [];
    for (let r = 0, o = e.length; r < o; r++) {
      const l = e[r];
      t.push(l.x, l.y, l.z || 0);
    }
    return this.setAttribute("position", new fn(t, 3)), this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new ls());
    const e = this.attributes.position, t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(
        new z(-1 / 0, -1 / 0, -1 / 0),
        new z(1 / 0, 1 / 0, 1 / 0)
      );
      return;
    }
    if (e !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(e), t)
        for (let r = 0, o = t.length; r < o; r++) {
          const l = t[r];
          qn.setFromBufferAttribute(l), this.morphTargetsRelative ? (ln.addVectors(this.boundingBox.min, qn.min), this.boundingBox.expandByPoint(ln), ln.addVectors(this.boundingBox.max, qn.max), this.boundingBox.expandByPoint(ln)) : (this.boundingBox.expandByPoint(qn.min), this.boundingBox.expandByPoint(qn.max));
        }
    } else
      this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new _o());
    const e = this.attributes.position, t = this.morphAttributes.position;
    if (e && e.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new z(), 1 / 0);
      return;
    }
    if (e) {
      const r = this.boundingSphere.center;
      if (qn.setFromBufferAttribute(e), t)
        for (let l = 0, u = t.length; l < u; l++) {
          const d = t[l];
          aa.setFromBufferAttribute(d), this.morphTargetsRelative ? (ln.addVectors(qn.min, aa.min), qn.expandByPoint(ln), ln.addVectors(qn.max, aa.max), qn.expandByPoint(ln)) : (qn.expandByPoint(aa.min), qn.expandByPoint(aa.max));
        }
      qn.getCenter(r);
      let o = 0;
      for (let l = 0, u = e.count; l < u; l++)
        ln.fromBufferAttribute(e, l), o = Math.max(o, r.distanceToSquared(ln));
      if (t)
        for (let l = 0, u = t.length; l < u; l++) {
          const d = t[l], f = this.morphTargetsRelative;
          for (let h = 0, m = d.count; h < m; h++)
            ln.fromBufferAttribute(d, h), f && (js.fromBufferAttribute(e, h), ln.add(js)), o = Math.max(o, r.distanceToSquared(ln));
        }
      this.boundingSphere.radius = Math.sqrt(o), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  computeTangents() {
    const e = this.index, t = this.attributes;
    if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
      console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const r = t.position, o = t.normal, l = t.uv;
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new Kn(new Float32Array(4 * r.count), 4));
    const u = this.getAttribute("tangent"), d = [], f = [];
    for (let Y = 0; Y < r.count; Y++)
      d[Y] = new z(), f[Y] = new z();
    const h = new z(), m = new z(), _ = new z(), v = new Qe(), S = new Qe(), y = new Qe(), E = new z(), x = new z();
    function M(Y, ve, T) {
      h.fromBufferAttribute(r, Y), m.fromBufferAttribute(r, ve), _.fromBufferAttribute(r, T), v.fromBufferAttribute(l, Y), S.fromBufferAttribute(l, ve), y.fromBufferAttribute(l, T), m.sub(h), _.sub(h), S.sub(v), y.sub(v);
      const C = 1 / (S.x * y.y - y.x * S.y);
      isFinite(C) && (E.copy(m).multiplyScalar(y.y).addScaledVector(_, -S.y).multiplyScalar(C), x.copy(_).multiplyScalar(S.x).addScaledVector(m, -y.x).multiplyScalar(C), d[Y].add(E), d[ve].add(E), d[T].add(E), f[Y].add(x), f[ve].add(x), f[T].add(x));
    }
    let L = this.groups;
    L.length === 0 && (L = [{
      start: 0,
      count: e.count
    }]);
    for (let Y = 0, ve = L.length; Y < ve; ++Y) {
      const T = L[Y], C = T.start, te = T.count;
      for (let J = C, se = C + te; J < se; J += 3)
        M(
          e.getX(J + 0),
          e.getX(J + 1),
          e.getX(J + 2)
        );
    }
    const R = new z(), D = new z(), ee = new z(), F = new z();
    function I(Y) {
      ee.fromBufferAttribute(o, Y), F.copy(ee);
      const ve = d[Y];
      R.copy(ve), R.sub(ee.multiplyScalar(ee.dot(ve))).normalize(), D.crossVectors(F, ve);
      const C = D.dot(f[Y]) < 0 ? -1 : 1;
      u.setXYZW(Y, R.x, R.y, R.z, C);
    }
    for (let Y = 0, ve = L.length; Y < ve; ++Y) {
      const T = L[Y], C = T.start, te = T.count;
      for (let J = C, se = C + te; J < se; J += 3)
        I(e.getX(J + 0)), I(e.getX(J + 1)), I(e.getX(J + 2));
    }
  }
  computeVertexNormals() {
    const e = this.index, t = this.getAttribute("position");
    if (t !== void 0) {
      let r = this.getAttribute("normal");
      if (r === void 0)
        r = new Kn(new Float32Array(t.count * 3), 3), this.setAttribute("normal", r);
      else
        for (let v = 0, S = r.count; v < S; v++)
          r.setXYZ(v, 0, 0, 0);
      const o = new z(), l = new z(), u = new z(), d = new z(), f = new z(), h = new z(), m = new z(), _ = new z();
      if (e)
        for (let v = 0, S = e.count; v < S; v += 3) {
          const y = e.getX(v + 0), E = e.getX(v + 1), x = e.getX(v + 2);
          o.fromBufferAttribute(t, y), l.fromBufferAttribute(t, E), u.fromBufferAttribute(t, x), m.subVectors(u, l), _.subVectors(o, l), m.cross(_), d.fromBufferAttribute(r, y), f.fromBufferAttribute(r, E), h.fromBufferAttribute(r, x), d.add(m), f.add(m), h.add(m), r.setXYZ(y, d.x, d.y, d.z), r.setXYZ(E, f.x, f.y, f.z), r.setXYZ(x, h.x, h.y, h.z);
        }
      else
        for (let v = 0, S = t.count; v < S; v += 3)
          o.fromBufferAttribute(t, v + 0), l.fromBufferAttribute(t, v + 1), u.fromBufferAttribute(t, v + 2), m.subVectors(u, l), _.subVectors(o, l), m.cross(_), r.setXYZ(v + 0, m.x, m.y, m.z), r.setXYZ(v + 1, m.x, m.y, m.z), r.setXYZ(v + 2, m.x, m.y, m.z);
      this.normalizeNormals(), r.needsUpdate = !0;
    }
  }
  normalizeNormals() {
    const e = this.attributes.normal;
    for (let t = 0, r = e.count; t < r; t++)
      ln.fromBufferAttribute(e, t), ln.normalize(), e.setXYZ(t, ln.x, ln.y, ln.z);
  }
  toNonIndexed() {
    function e(d, f) {
      const h = d.array, m = d.itemSize, _ = d.normalized, v = new h.constructor(f.length * m);
      let S = 0, y = 0;
      for (let E = 0, x = f.length; E < x; E++) {
        d.isInterleavedBufferAttribute ? S = f[E] * d.data.stride + d.offset : S = f[E] * m;
        for (let M = 0; M < m; M++)
          v[y++] = h[S++];
      }
      return new Kn(v, m, _);
    }
    if (this.index === null)
      return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const t = new Ln(), r = this.index.array, o = this.attributes;
    for (const d in o) {
      const f = o[d], h = e(f, r);
      t.setAttribute(d, h);
    }
    const l = this.morphAttributes;
    for (const d in l) {
      const f = [], h = l[d];
      for (let m = 0, _ = h.length; m < _; m++) {
        const v = h[m], S = e(v, r);
        f.push(S);
      }
      t.morphAttributes[d] = f;
    }
    t.morphTargetsRelative = this.morphTargetsRelative;
    const u = this.groups;
    for (let d = 0, f = u.length; d < f; d++) {
      const h = u[d];
      t.addGroup(h.start, h.count, h.materialIndex);
    }
    return t;
  }
  toJSON() {
    const e = {
      metadata: {
        version: 4.6,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON"
      }
    };
    if (e.uuid = this.uuid, e.type = this.type, this.name !== "" && (e.name = this.name), Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0) {
      const f = this.parameters;
      for (const h in f)
        f[h] !== void 0 && (e[h] = f[h]);
      return e;
    }
    e.data = { attributes: {} };
    const t = this.index;
    t !== null && (e.data.index = {
      type: t.array.constructor.name,
      array: Array.prototype.slice.call(t.array)
    });
    const r = this.attributes;
    for (const f in r) {
      const h = r[f];
      e.data.attributes[f] = h.toJSON(e.data);
    }
    const o = {};
    let l = !1;
    for (const f in this.morphAttributes) {
      const h = this.morphAttributes[f], m = [];
      for (let _ = 0, v = h.length; _ < v; _++) {
        const S = h[_];
        m.push(S.toJSON(e.data));
      }
      m.length > 0 && (o[f] = m, l = !0);
    }
    l && (e.data.morphAttributes = o, e.data.morphTargetsRelative = this.morphTargetsRelative);
    const u = this.groups;
    u.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(u)));
    const d = this.boundingSphere;
    return d !== null && (e.data.boundingSphere = {
      center: d.center.toArray(),
      radius: d.radius
    }), e;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(e) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const t = {};
    this.name = e.name;
    const r = e.index;
    r !== null && this.setIndex(r.clone(t));
    const o = e.attributes;
    for (const h in o) {
      const m = o[h];
      this.setAttribute(h, m.clone(t));
    }
    const l = e.morphAttributes;
    for (const h in l) {
      const m = [], _ = l[h];
      for (let v = 0, S = _.length; v < S; v++)
        m.push(_[v].clone(t));
      this.morphAttributes[h] = m;
    }
    this.morphTargetsRelative = e.morphTargetsRelative;
    const u = e.groups;
    for (let h = 0, m = u.length; h < m; h++) {
      const _ = u[h];
      this.addGroup(_.start, _.count, _.materialIndex);
    }
    const d = e.boundingBox;
    d !== null && (this.boundingBox = d.clone());
    const f = e.boundingSphere;
    return f !== null && (this.boundingSphere = f.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this;
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const Vm = /* @__PURE__ */ new Rt(), $r = /* @__PURE__ */ new ng(), Ul = /* @__PURE__ */ new _o(), Gm = /* @__PURE__ */ new z(), Fl = /* @__PURE__ */ new z(), kl = /* @__PURE__ */ new z(), Ol = /* @__PURE__ */ new z(), xd = /* @__PURE__ */ new z(), Bl = /* @__PURE__ */ new z(), Wm = /* @__PURE__ */ new z(), zl = /* @__PURE__ */ new z();
class Ct extends Xt {
  constructor(e = new Ln(), t = new Dr()) {
    super(), this.isMesh = !0, this.type = "Mesh", this.geometry = e, this.material = t, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes, r = Object.keys(t);
    if (r.length > 0) {
      const o = t[r[0]];
      if (o !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let l = 0, u = o.length; l < u; l++) {
          const d = o[l].name || String(l);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[d] = l;
        }
      }
    }
  }
  getVertexPosition(e, t) {
    const r = this.geometry, o = r.attributes.position, l = r.morphAttributes.position, u = r.morphTargetsRelative;
    t.fromBufferAttribute(o, e);
    const d = this.morphTargetInfluences;
    if (l && d) {
      Bl.set(0, 0, 0);
      for (let f = 0, h = l.length; f < h; f++) {
        const m = d[f], _ = l[f];
        m !== 0 && (xd.fromBufferAttribute(_, e), u ? Bl.addScaledVector(xd, m) : Bl.addScaledVector(xd.sub(t), m));
      }
      t.add(Bl);
    }
    return t;
  }
  raycast(e, t) {
    const r = this.geometry, o = this.material, l = this.matrixWorld;
    o !== void 0 && (r.boundingSphere === null && r.computeBoundingSphere(), Ul.copy(r.boundingSphere), Ul.applyMatrix4(l), $r.copy(e.ray).recast(e.near), !(Ul.containsPoint($r.origin) === !1 && ($r.intersectSphere(Ul, Gm) === null || $r.origin.distanceToSquared(Gm) > (e.far - e.near) ** 2)) && (Vm.copy(l).invert(), $r.copy(e.ray).applyMatrix4(Vm), !(r.boundingBox !== null && $r.intersectsBox(r.boundingBox) === !1) && this._computeIntersections(e, t, $r)));
  }
  _computeIntersections(e, t, r) {
    let o;
    const l = this.geometry, u = this.material, d = l.index, f = l.attributes.position, h = l.attributes.uv, m = l.attributes.uv1, _ = l.attributes.normal, v = l.groups, S = l.drawRange;
    if (d !== null)
      if (Array.isArray(u))
        for (let y = 0, E = v.length; y < E; y++) {
          const x = v[y], M = u[x.materialIndex], L = Math.max(x.start, S.start), R = Math.min(d.count, Math.min(x.start + x.count, S.start + S.count));
          for (let D = L, ee = R; D < ee; D += 3) {
            const F = d.getX(D), I = d.getX(D + 1), Y = d.getX(D + 2);
            o = Hl(this, M, e, r, h, m, _, F, I, Y), o && (o.faceIndex = Math.floor(D / 3), o.face.materialIndex = x.materialIndex, t.push(o));
          }
        }
      else {
        const y = Math.max(0, S.start), E = Math.min(d.count, S.start + S.count);
        for (let x = y, M = E; x < M; x += 3) {
          const L = d.getX(x), R = d.getX(x + 1), D = d.getX(x + 2);
          o = Hl(this, u, e, r, h, m, _, L, R, D), o && (o.faceIndex = Math.floor(x / 3), t.push(o));
        }
      }
    else if (f !== void 0)
      if (Array.isArray(u))
        for (let y = 0, E = v.length; y < E; y++) {
          const x = v[y], M = u[x.materialIndex], L = Math.max(x.start, S.start), R = Math.min(f.count, Math.min(x.start + x.count, S.start + S.count));
          for (let D = L, ee = R; D < ee; D += 3) {
            const F = D, I = D + 1, Y = D + 2;
            o = Hl(this, M, e, r, h, m, _, F, I, Y), o && (o.faceIndex = Math.floor(D / 3), o.face.materialIndex = x.materialIndex, t.push(o));
          }
        }
      else {
        const y = Math.max(0, S.start), E = Math.min(f.count, S.start + S.count);
        for (let x = y, M = E; x < M; x += 3) {
          const L = x, R = x + 1, D = x + 2;
          o = Hl(this, u, e, r, h, m, _, L, R, D), o && (o.faceIndex = Math.floor(x / 3), t.push(o));
        }
      }
  }
}
function kx(s, e, t, r, o, l, u, d) {
  let f;
  if (e.side === zn ? f = r.intersectTriangle(u, l, o, !0, d) : f = r.intersectTriangle(o, l, u, e.side === Lr, d), f === null) return null;
  zl.copy(d), zl.applyMatrix4(s.matrixWorld);
  const h = t.ray.origin.distanceTo(zl);
  return h < t.near || h > t.far ? null : {
    distance: h,
    point: zl.clone(),
    object: s
  };
}
function Hl(s, e, t, r, o, l, u, d, f, h) {
  s.getVertexPosition(d, Fl), s.getVertexPosition(f, kl), s.getVertexPosition(h, Ol);
  const m = kx(s, e, t, r, Fl, kl, Ol, Wm);
  if (m) {
    const _ = new z();
    si.getBarycoord(Wm, Fl, kl, Ol, _), o && (m.uv = si.getInterpolatedAttribute(o, d, f, h, _, new Qe())), l && (m.uv1 = si.getInterpolatedAttribute(l, d, f, h, _, new Qe())), u && (m.normal = si.getInterpolatedAttribute(u, d, f, h, _, new z()), m.normal.dot(r.direction) > 0 && m.normal.multiplyScalar(-1));
    const v = {
      a: d,
      b: f,
      c: h,
      normal: new z(),
      materialIndex: 0
    };
    si.getNormal(Fl, kl, Ol, v.normal), m.face = v, m.barycoord = _;
  }
  return m;
}
class xo extends Ln {
  constructor(e = 1, t = 1, r = 1, o = 1, l = 1, u = 1) {
    super(), this.type = "BoxGeometry", this.parameters = {
      width: e,
      height: t,
      depth: r,
      widthSegments: o,
      heightSegments: l,
      depthSegments: u
    };
    const d = this;
    o = Math.floor(o), l = Math.floor(l), u = Math.floor(u);
    const f = [], h = [], m = [], _ = [];
    let v = 0, S = 0;
    y("z", "y", "x", -1, -1, r, t, e, u, l, 0), y("z", "y", "x", 1, -1, r, t, -e, u, l, 1), y("x", "z", "y", 1, 1, e, r, t, o, u, 2), y("x", "z", "y", 1, -1, e, r, -t, o, u, 3), y("x", "y", "z", 1, -1, e, t, r, o, l, 4), y("x", "y", "z", -1, -1, e, t, -r, o, l, 5), this.setIndex(f), this.setAttribute("position", new fn(h, 3)), this.setAttribute("normal", new fn(m, 3)), this.setAttribute("uv", new fn(_, 2));
    function y(E, x, M, L, R, D, ee, F, I, Y, ve) {
      const T = D / I, C = ee / Y, te = D / 2, J = ee / 2, se = F / 2, _e = I + 1, Z = Y + 1;
      let he = 0, O = 0;
      const ue = new z();
      for (let ae = 0; ae < Z; ae++) {
        const U = ae * C - J;
        for (let oe = 0; oe < _e; oe++) {
          const Fe = oe * T - te;
          ue[E] = Fe * L, ue[x] = U * R, ue[M] = se, h.push(ue.x, ue.y, ue.z), ue[E] = 0, ue[x] = 0, ue[M] = F > 0 ? 1 : -1, m.push(ue.x, ue.y, ue.z), _.push(oe / I), _.push(1 - ae / Y), he += 1;
        }
      }
      for (let ae = 0; ae < Y; ae++)
        for (let U = 0; U < I; U++) {
          const oe = v + U + _e * ae, Fe = v + U + _e * (ae + 1), K = v + (U + 1) + _e * (ae + 1), ce = v + (U + 1) + _e * ae;
          f.push(oe, Fe, ce), f.push(Fe, K, ce), O += 6;
        }
      d.addGroup(S, O, ve), S += O, v += he;
    }
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  static fromJSON(e) {
    return new xo(e.width, e.height, e.depth, e.widthSegments, e.heightSegments, e.depthSegments);
  }
}
function mo(s) {
  const e = {};
  for (const t in s) {
    e[t] = {};
    for (const r in s[t]) {
      const o = s[t][r];
      o && (o.isColor || o.isMatrix3 || o.isMatrix4 || o.isVector2 || o.isVector3 || o.isVector4 || o.isTexture || o.isQuaternion) ? o.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), e[t][r] = null) : e[t][r] = o.clone() : Array.isArray(o) ? e[t][r] = o.slice() : e[t][r] = o;
    }
  }
  return e;
}
function bn(s) {
  const e = {};
  for (let t = 0; t < s.length; t++) {
    const r = mo(s[t]);
    for (const o in r)
      e[o] = r[o];
  }
  return e;
}
function Ox(s) {
  const e = [];
  for (let t = 0; t < s.length; t++)
    e.push(s[t].clone());
  return e;
}
function ag(s) {
  const e = s.getRenderTarget();
  return e === null ? s.outputColorSpace : e.isXRRenderTarget === !0 ? e.texture.colorSpace : Tt.workingColorSpace;
}
const xa = { clone: mo, merge: bn };
var Bx = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, zx = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class Pn extends cs {
  constructor(e) {
    super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Bx, this.fragmentShader = zx, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
      clipCullDistance: !1,
      // set to use vertex shader clipping
      multiDraw: !1
      // set to use vertex shader multi_draw / enable gl_DrawID
    }, this.defaultAttributeValues = {
      color: [1, 1, 1],
      uv: [0, 0],
      uv1: [0, 0]
    }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, e !== void 0 && this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = mo(e.uniforms), this.uniformsGroups = Ox(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    t.glslVersion = this.glslVersion, t.uniforms = {};
    for (const o in this.uniforms) {
      const u = this.uniforms[o].value;
      u && u.isTexture ? t.uniforms[o] = {
        type: "t",
        value: u.toJSON(e).uuid
      } : u && u.isColor ? t.uniforms[o] = {
        type: "c",
        value: u.getHex()
      } : u && u.isVector2 ? t.uniforms[o] = {
        type: "v2",
        value: u.toArray()
      } : u && u.isVector3 ? t.uniforms[o] = {
        type: "v3",
        value: u.toArray()
      } : u && u.isVector4 ? t.uniforms[o] = {
        type: "v4",
        value: u.toArray()
      } : u && u.isMatrix3 ? t.uniforms[o] = {
        type: "m3",
        value: u.toArray()
      } : u && u.isMatrix4 ? t.uniforms[o] = {
        type: "m4",
        value: u.toArray()
      } : t.uniforms[o] = {
        value: u
      };
    }
    Object.keys(this.defines).length > 0 && (t.defines = this.defines), t.vertexShader = this.vertexShader, t.fragmentShader = this.fragmentShader, t.lights = this.lights, t.clipping = this.clipping;
    const r = {};
    for (const o in this.extensions)
      this.extensions[o] === !0 && (r[o] = !0);
    return Object.keys(r).length > 0 && (t.extensions = r), t;
  }
}
class lg extends Xt {
  constructor() {
    super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new Rt(), this.projectionMatrix = new Rt(), this.projectionMatrixInverse = new Rt(), this.coordinateSystem = $i;
  }
  copy(e, t) {
    return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
  }
  getWorldDirection(e) {
    return super.getWorldDirection(e).negate();
  }
  updateMatrixWorld(e) {
    super.updateMatrixWorld(e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(e, t) {
    super.updateWorldMatrix(e, t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Ar = /* @__PURE__ */ new z(), Xm = /* @__PURE__ */ new Qe(), jm = /* @__PURE__ */ new Qe();
class Rn extends lg {
  constructor(e = 50, t = 1, r = 0.1, o = 2e3) {
    super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = r, this.far = o, this.focus = 10, this.aspect = t, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
  }
  /**
   * Sets the FOV by focal length in respect to the current .filmGauge.
   *
   * The default film gauge is 35, so that the focal length can be specified for
   * a 35mm (full frame) camera.
   *
   * Values for focal length and film gauge must have the same unit.
   */
  setFocalLength(e) {
    const t = 0.5 * this.getFilmHeight() / e;
    this.fov = po * 2 * Math.atan(t), this.updateProjectionMatrix();
  }
  /**
   * Calculates the focal length from the current .fov and .filmGauge.
   */
  getFocalLength() {
    const e = Math.tan(ma * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / e;
  }
  getEffectiveFOV() {
    return po * 2 * Math.atan(
      Math.tan(ma * 0.5 * this.fov) / this.zoom
    );
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  /**
   * Computes the 2D bounds of the camera's viewable rectangle at a given distance along the viewing direction.
   * Sets minTarget and maxTarget to the coordinates of the lower-left and upper-right corners of the view rectangle.
   */
  getViewBounds(e, t, r) {
    Ar.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), t.set(Ar.x, Ar.y).multiplyScalar(-e / Ar.z), Ar.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), r.set(Ar.x, Ar.y).multiplyScalar(-e / Ar.z);
  }
  /**
   * Computes the width and height of the camera's viewable rectangle at a given distance along the viewing direction.
   * Copies the result into the target Vector2, where x is width and y is height.
   */
  getViewSize(e, t) {
    return this.getViewBounds(e, Xm, jm), t.subVectors(jm, Xm);
  }
  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
   * the monitors are in grid like this
   *
   *   +---+---+---+
   *   | A | B | C |
   *   +---+---+---+
   *   | D | E | F |
   *   +---+---+---+
   *
   * then for each monitor you would call it like this
   *
   *   const w = 1920;
   *   const h = 1080;
   *   const fullWidth = w * 3;
   *   const fullHeight = h * 2;
   *
   *   --A--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
   *   --B--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
   *   --C--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
   *   --D--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
   *   --E--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
   *   --F--
   *   camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
   *
   *   Note there is no reason monitors have to be the same size or in a grid.
   */
  setViewOffset(e, t, r, o, l, u) {
    this.aspect = e / t, this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = r, this.view.offsetY = o, this.view.width = l, this.view.height = u, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const e = this.near;
    let t = e * Math.tan(ma * 0.5 * this.fov) / this.zoom, r = 2 * t, o = this.aspect * r, l = -0.5 * o;
    const u = this.view;
    if (this.view !== null && this.view.enabled) {
      const f = u.fullWidth, h = u.fullHeight;
      l += u.offsetX * o / f, t -= u.offsetY * r / h, o *= u.width / f, r *= u.height / h;
    }
    const d = this.filmOffset;
    d !== 0 && (l += e * d / this.getFilmWidth()), this.projectionMatrix.makePerspective(l, l + o, t, t - r, e, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, this.view !== null && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t;
  }
}
const Ys = -90, qs = 1;
class Hx extends Xt {
  constructor(e, t, r) {
    super(), this.type = "CubeCamera", this.renderTarget = r, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const o = new Rn(Ys, qs, e, t);
    o.layers = this.layers, this.add(o);
    const l = new Rn(Ys, qs, e, t);
    l.layers = this.layers, this.add(l);
    const u = new Rn(Ys, qs, e, t);
    u.layers = this.layers, this.add(u);
    const d = new Rn(Ys, qs, e, t);
    d.layers = this.layers, this.add(d);
    const f = new Rn(Ys, qs, e, t);
    f.layers = this.layers, this.add(f);
    const h = new Rn(Ys, qs, e, t);
    h.layers = this.layers, this.add(h);
  }
  updateCoordinateSystem() {
    const e = this.coordinateSystem, t = this.children.concat(), [r, o, l, u, d, f] = t;
    for (const h of t) this.remove(h);
    if (e === $i)
      r.up.set(0, 1, 0), r.lookAt(1, 0, 0), o.up.set(0, 1, 0), o.lookAt(-1, 0, 0), l.up.set(0, 0, -1), l.lookAt(0, 1, 0), u.up.set(0, 0, 1), u.lookAt(0, -1, 0), d.up.set(0, 1, 0), d.lookAt(0, 0, 1), f.up.set(0, 1, 0), f.lookAt(0, 0, -1);
    else if (e === uc)
      r.up.set(0, -1, 0), r.lookAt(-1, 0, 0), o.up.set(0, -1, 0), o.lookAt(1, 0, 0), l.up.set(0, 0, 1), l.lookAt(0, 1, 0), u.up.set(0, 0, -1), u.lookAt(0, -1, 0), d.up.set(0, -1, 0), d.lookAt(0, 0, 1), f.up.set(0, -1, 0), f.lookAt(0, 0, -1);
    else
      throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
    for (const h of t)
      this.add(h), h.updateMatrixWorld();
  }
  update(e, t) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: r, activeMipmapLevel: o } = this;
    this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
    const [l, u, d, f, h, m] = this.children, _ = e.getRenderTarget(), v = e.getActiveCubeFace(), S = e.getActiveMipmapLevel(), y = e.xr.enabled;
    e.xr.enabled = !1;
    const E = r.texture.generateMipmaps;
    r.texture.generateMipmaps = !1, e.setRenderTarget(r, 0, o), e.render(t, l), e.setRenderTarget(r, 1, o), e.render(t, u), e.setRenderTarget(r, 2, o), e.render(t, d), e.setRenderTarget(r, 3, o), e.render(t, f), e.setRenderTarget(r, 4, o), e.render(t, h), r.texture.generateMipmaps = E, e.setRenderTarget(r, 5, o), e.render(t, m), e.setRenderTarget(_, v, S), e.xr.enabled = y, r.texture.needsPMREMUpdate = !0;
  }
}
class cg extends Mn {
  constructor(e, t, r, o, l, u, d, f, h, m) {
    e = e !== void 0 ? e : [], t = t !== void 0 ? t : co, super(e, t, r, o, l, u, d, f, h, m), this.isCubeTexture = !0, this.flipY = !1;
  }
  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}
class Vx extends oi {
  constructor(e = 1, t = {}) {
    super(e, e, t), this.isWebGLCubeRenderTarget = !0;
    const r = { width: e, height: e, depth: 1 }, o = [r, r, r, r, r, r];
    this.texture = new cg(o, t.mapping, t.wrapS, t.wrapT, t.magFilter, t.minFilter, t.format, t.type, t.anisotropy, t.colorSpace), this.texture.isRenderTargetTexture = !0, this.texture.generateMipmaps = t.generateMipmaps !== void 0 ? t.generateMipmaps : !1, this.texture.minFilter = t.minFilter !== void 0 ? t.minFilter : xi;
  }
  fromEquirectangularTexture(e, t) {
    this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
    const r = {
      uniforms: {
        tEquirect: { value: null }
      },
      vertexShader: (
        /* glsl */
        `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`
      ),
      fragmentShader: (
        /* glsl */
        `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
      )
    }, o = new xo(5, 5, 5), l = new Pn({
      name: "CubemapFromEquirect",
      uniforms: mo(r.uniforms),
      vertexShader: r.vertexShader,
      fragmentShader: r.fragmentShader,
      side: zn,
      blending: Zi
    });
    l.uniforms.tEquirect.value = t;
    const u = new Ct(o, l), d = t.minFilter;
    return t.minFilter === ss && (t.minFilter = xi), new Hx(1, 10, this).update(e, u), t.minFilter = d, u.geometry.dispose(), u.material.dispose(), this;
  }
  clear(e, t, r, o) {
    const l = e.getRenderTarget();
    for (let u = 0; u < 6; u++)
      e.setRenderTarget(this, u), e.clear(t, r, o);
    e.setRenderTarget(l);
  }
}
const yd = /* @__PURE__ */ new z(), Gx = /* @__PURE__ */ new z(), Wx = /* @__PURE__ */ new dt();
class es {
  constructor(e = new z(1, 0, 0), t = 0) {
    this.isPlane = !0, this.normal = e, this.constant = t;
  }
  set(e, t) {
    return this.normal.copy(e), this.constant = t, this;
  }
  setComponents(e, t, r, o) {
    return this.normal.set(e, t, r), this.constant = o, this;
  }
  setFromNormalAndCoplanarPoint(e, t) {
    return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
  }
  setFromCoplanarPoints(e, t, r) {
    const o = yd.subVectors(r, t).cross(Gx.subVectors(e, t)).normalize();
    return this.setFromNormalAndCoplanarPoint(o, e), this;
  }
  copy(e) {
    return this.normal.copy(e.normal), this.constant = e.constant, this;
  }
  normalize() {
    const e = 1 / this.normal.length();
    return this.normal.multiplyScalar(e), this.constant *= e, this;
  }
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  distanceToPoint(e) {
    return this.normal.dot(e) + this.constant;
  }
  distanceToSphere(e) {
    return this.distanceToPoint(e.center) - e.radius;
  }
  projectPoint(e, t) {
    return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
  }
  intersectLine(e, t) {
    const r = e.delta(yd), o = this.normal.dot(r);
    if (o === 0)
      return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
    const l = -(e.start.dot(this.normal) + this.constant) / o;
    return l < 0 || l > 1 ? null : t.copy(e.start).addScaledVector(r, l);
  }
  intersectsLine(e) {
    const t = this.distanceToPoint(e.start), r = this.distanceToPoint(e.end);
    return t < 0 && r > 0 || r < 0 && t > 0;
  }
  intersectsBox(e) {
    return e.intersectsPlane(this);
  }
  intersectsSphere(e) {
    return e.intersectsPlane(this);
  }
  coplanarPoint(e) {
    return e.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(e, t) {
    const r = t || Wx.getNormalMatrix(e), o = this.coplanarPoint(yd).applyMatrix4(e), l = this.normal.applyMatrix3(r).normalize();
    return this.constant = -o.dot(l), this;
  }
  translate(e) {
    return this.constant -= e.dot(this.normal), this;
  }
  equals(e) {
    return e.normal.equals(this.normal) && e.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Kr = /* @__PURE__ */ new _o(), Vl = /* @__PURE__ */ new z();
class zf {
  constructor(e = new es(), t = new es(), r = new es(), o = new es(), l = new es(), u = new es()) {
    this.planes = [e, t, r, o, l, u];
  }
  set(e, t, r, o, l, u) {
    const d = this.planes;
    return d[0].copy(e), d[1].copy(t), d[2].copy(r), d[3].copy(o), d[4].copy(l), d[5].copy(u), this;
  }
  copy(e) {
    const t = this.planes;
    for (let r = 0; r < 6; r++)
      t[r].copy(e.planes[r]);
    return this;
  }
  setFromProjectionMatrix(e, t = $i) {
    const r = this.planes, o = e.elements, l = o[0], u = o[1], d = o[2], f = o[3], h = o[4], m = o[5], _ = o[6], v = o[7], S = o[8], y = o[9], E = o[10], x = o[11], M = o[12], L = o[13], R = o[14], D = o[15];
    if (r[0].setComponents(f - l, v - h, x - S, D - M).normalize(), r[1].setComponents(f + l, v + h, x + S, D + M).normalize(), r[2].setComponents(f + u, v + m, x + y, D + L).normalize(), r[3].setComponents(f - u, v - m, x - y, D - L).normalize(), r[4].setComponents(f - d, v - _, x - E, D - R).normalize(), t === $i)
      r[5].setComponents(f + d, v + _, x + E, D + R).normalize();
    else if (t === uc)
      r[5].setComponents(d, _, E, R).normalize();
    else
      throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
    return this;
  }
  intersectsObject(e) {
    if (e.boundingSphere !== void 0)
      e.boundingSphere === null && e.computeBoundingSphere(), Kr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
    else {
      const t = e.geometry;
      t.boundingSphere === null && t.computeBoundingSphere(), Kr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);
    }
    return this.intersectsSphere(Kr);
  }
  intersectsSprite(e) {
    return Kr.center.set(0, 0, 0), Kr.radius = 0.7071067811865476, Kr.applyMatrix4(e.matrixWorld), this.intersectsSphere(Kr);
  }
  intersectsSphere(e) {
    const t = this.planes, r = e.center, o = -e.radius;
    for (let l = 0; l < 6; l++)
      if (t[l].distanceToPoint(r) < o)
        return !1;
    return !0;
  }
  intersectsBox(e) {
    const t = this.planes;
    for (let r = 0; r < 6; r++) {
      const o = t[r];
      if (Vl.x = o.normal.x > 0 ? e.max.x : e.min.x, Vl.y = o.normal.y > 0 ? e.max.y : e.min.y, Vl.z = o.normal.z > 0 ? e.max.z : e.min.z, o.distanceToPoint(Vl) < 0)
        return !1;
    }
    return !0;
  }
  containsPoint(e) {
    const t = this.planes;
    for (let r = 0; r < 6; r++)
      if (t[r].distanceToPoint(e) < 0)
        return !1;
    return !0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
function ug() {
  let s = null, e = !1, t = null, r = null;
  function o(l, u) {
    t(l, u), r = s.requestAnimationFrame(o);
  }
  return {
    start: function() {
      e !== !0 && t !== null && (r = s.requestAnimationFrame(o), e = !0);
    },
    stop: function() {
      s.cancelAnimationFrame(r), e = !1;
    },
    setAnimationLoop: function(l) {
      t = l;
    },
    setContext: function(l) {
      s = l;
    }
  };
}
function Xx(s) {
  const e = /* @__PURE__ */ new WeakMap();
  function t(d, f) {
    const h = d.array, m = d.usage, _ = h.byteLength, v = s.createBuffer();
    s.bindBuffer(f, v), s.bufferData(f, h, m), d.onUploadCallback();
    let S;
    if (h instanceof Float32Array)
      S = s.FLOAT;
    else if (h instanceof Uint16Array)
      d.isFloat16BufferAttribute ? S = s.HALF_FLOAT : S = s.UNSIGNED_SHORT;
    else if (h instanceof Int16Array)
      S = s.SHORT;
    else if (h instanceof Uint32Array)
      S = s.UNSIGNED_INT;
    else if (h instanceof Int32Array)
      S = s.INT;
    else if (h instanceof Int8Array)
      S = s.BYTE;
    else if (h instanceof Uint8Array)
      S = s.UNSIGNED_BYTE;
    else if (h instanceof Uint8ClampedArray)
      S = s.UNSIGNED_BYTE;
    else
      throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + h);
    return {
      buffer: v,
      type: S,
      bytesPerElement: h.BYTES_PER_ELEMENT,
      version: d.version,
      size: _
    };
  }
  function r(d, f, h) {
    const m = f.array, _ = f.updateRanges;
    if (s.bindBuffer(h, d), _.length === 0)
      s.bufferSubData(h, 0, m);
    else {
      _.sort((S, y) => S.start - y.start);
      let v = 0;
      for (let S = 1; S < _.length; S++) {
        const y = _[v], E = _[S];
        E.start <= y.start + y.count + 1 ? y.count = Math.max(
          y.count,
          E.start + E.count - y.start
        ) : (++v, _[v] = E);
      }
      _.length = v + 1;
      for (let S = 0, y = _.length; S < y; S++) {
        const E = _[S];
        s.bufferSubData(
          h,
          E.start * m.BYTES_PER_ELEMENT,
          m,
          E.start,
          E.count
        );
      }
      f.clearUpdateRanges();
    }
    f.onUploadCallback();
  }
  function o(d) {
    return d.isInterleavedBufferAttribute && (d = d.data), e.get(d);
  }
  function l(d) {
    d.isInterleavedBufferAttribute && (d = d.data);
    const f = e.get(d);
    f && (s.deleteBuffer(f.buffer), e.delete(d));
  }
  function u(d, f) {
    if (d.isInterleavedBufferAttribute && (d = d.data), d.isGLBufferAttribute) {
      const m = e.get(d);
      (!m || m.version < d.version) && e.set(d, {
        buffer: d.buffer,
        type: d.type,
        bytesPerElement: d.elementSize,
        version: d.version
      });
      return;
    }
    const h = e.get(d);
    if (h === void 0)
      e.set(d, t(d, f));
    else if (h.version < d.version) {
      if (h.size !== d.array.byteLength)
        throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      r(h.buffer, d, f), h.version = d.version;
    }
  }
  return {
    get: o,
    remove: l,
    update: u
  };
}
class Pi extends Ln {
  constructor(e = 1, t = 1, r = 1, o = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = {
      width: e,
      height: t,
      widthSegments: r,
      heightSegments: o
    };
    const l = e / 2, u = t / 2, d = Math.floor(r), f = Math.floor(o), h = d + 1, m = f + 1, _ = e / d, v = t / f, S = [], y = [], E = [], x = [];
    for (let M = 0; M < m; M++) {
      const L = M * v - u;
      for (let R = 0; R < h; R++) {
        const D = R * _ - l;
        y.push(D, -L, 0), E.push(0, 0, 1), x.push(R / d), x.push(1 - M / f);
      }
    }
    for (let M = 0; M < f; M++)
      for (let L = 0; L < d; L++) {
        const R = L + h * M, D = L + h * (M + 1), ee = L + 1 + h * (M + 1), F = L + 1 + h * M;
        S.push(R, D, F), S.push(D, ee, F);
      }
    this.setIndex(S), this.setAttribute("position", new fn(y, 3)), this.setAttribute("normal", new fn(E, 3)), this.setAttribute("uv", new fn(x, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  static fromJSON(e) {
    return new Pi(e.width, e.height, e.widthSegments, e.heightSegments);
  }
}
var jx = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, Yx = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, qx = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, $x = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Kx = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, Zx = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, Qx = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, Jx = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, ey = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`, ty = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, ny = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, iy = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, ry = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, sy = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, oy = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, ay = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, ly = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, cy = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, uy = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, dy = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, fy = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, hy = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`, py = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`, my = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, gy = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, vy = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, _y = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, xy = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, yy = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, Sy = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, My = "gl_FragColor = linearToOutputTexel( gl_FragColor );", Ey = `
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, wy = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, Ty = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, by = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, Ay = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, Cy = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, Ry = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, Py = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, Ly = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, Dy = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, Ny = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, Iy = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, Uy = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, Fy = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, ky = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, Oy = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, By = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, zy = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, Hy = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, Vy = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, Gy = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, Wy = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, Xy = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, jy = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, Yy = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, qy = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, $y = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Ky = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Zy = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, Qy = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, Jy = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, eS = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, tS = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, nS = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, iS = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, rS = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, sS = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, oS = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, aS = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`, lS = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, cS = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, uS = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, dS = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, fS = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, hS = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, pS = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, mS = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, gS = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, vS = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, _S = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, xS = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, yS = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, SS = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, MS = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, ES = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, wS = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, TS = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, bS = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, AS = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`, CS = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, RS = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, PS = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, LS = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, DS = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, NS = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, IS = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, US = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, FS = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, kS = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, OS = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, BS = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, zS = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, HS = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, VS = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, GS = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, WS = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const XS = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, jS = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, YS = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, qS = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, $S = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, KS = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, ZS = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, QS = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`, JS = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, e1 = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, t1 = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, n1 = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, i1 = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, r1 = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, s1 = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, o1 = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, a1 = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, l1 = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, c1 = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, u1 = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, d1 = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, f1 = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, h1 = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, p1 = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, m1 = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, g1 = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, v1 = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, _1 = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, x1 = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, y1 = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, S1 = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, M1 = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, E1 = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, w1 = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, ut = {
  alphahash_fragment: jx,
  alphahash_pars_fragment: Yx,
  alphamap_fragment: qx,
  alphamap_pars_fragment: $x,
  alphatest_fragment: Kx,
  alphatest_pars_fragment: Zx,
  aomap_fragment: Qx,
  aomap_pars_fragment: Jx,
  batching_pars_vertex: ey,
  batching_vertex: ty,
  begin_vertex: ny,
  beginnormal_vertex: iy,
  bsdfs: ry,
  iridescence_fragment: sy,
  bumpmap_pars_fragment: oy,
  clipping_planes_fragment: ay,
  clipping_planes_pars_fragment: ly,
  clipping_planes_pars_vertex: cy,
  clipping_planes_vertex: uy,
  color_fragment: dy,
  color_pars_fragment: fy,
  color_pars_vertex: hy,
  color_vertex: py,
  common: my,
  cube_uv_reflection_fragment: gy,
  defaultnormal_vertex: vy,
  displacementmap_pars_vertex: _y,
  displacementmap_vertex: xy,
  emissivemap_fragment: yy,
  emissivemap_pars_fragment: Sy,
  colorspace_fragment: My,
  colorspace_pars_fragment: Ey,
  envmap_fragment: wy,
  envmap_common_pars_fragment: Ty,
  envmap_pars_fragment: by,
  envmap_pars_vertex: Ay,
  envmap_physical_pars_fragment: Oy,
  envmap_vertex: Cy,
  fog_vertex: Ry,
  fog_pars_vertex: Py,
  fog_fragment: Ly,
  fog_pars_fragment: Dy,
  gradientmap_pars_fragment: Ny,
  lightmap_pars_fragment: Iy,
  lights_lambert_fragment: Uy,
  lights_lambert_pars_fragment: Fy,
  lights_pars_begin: ky,
  lights_toon_fragment: By,
  lights_toon_pars_fragment: zy,
  lights_phong_fragment: Hy,
  lights_phong_pars_fragment: Vy,
  lights_physical_fragment: Gy,
  lights_physical_pars_fragment: Wy,
  lights_fragment_begin: Xy,
  lights_fragment_maps: jy,
  lights_fragment_end: Yy,
  logdepthbuf_fragment: qy,
  logdepthbuf_pars_fragment: $y,
  logdepthbuf_pars_vertex: Ky,
  logdepthbuf_vertex: Zy,
  map_fragment: Qy,
  map_pars_fragment: Jy,
  map_particle_fragment: eS,
  map_particle_pars_fragment: tS,
  metalnessmap_fragment: nS,
  metalnessmap_pars_fragment: iS,
  morphinstance_vertex: rS,
  morphcolor_vertex: sS,
  morphnormal_vertex: oS,
  morphtarget_pars_vertex: aS,
  morphtarget_vertex: lS,
  normal_fragment_begin: cS,
  normal_fragment_maps: uS,
  normal_pars_fragment: dS,
  normal_pars_vertex: fS,
  normal_vertex: hS,
  normalmap_pars_fragment: pS,
  clearcoat_normal_fragment_begin: mS,
  clearcoat_normal_fragment_maps: gS,
  clearcoat_pars_fragment: vS,
  iridescence_pars_fragment: _S,
  opaque_fragment: xS,
  packing: yS,
  premultiplied_alpha_fragment: SS,
  project_vertex: MS,
  dithering_fragment: ES,
  dithering_pars_fragment: wS,
  roughnessmap_fragment: TS,
  roughnessmap_pars_fragment: bS,
  shadowmap_pars_fragment: AS,
  shadowmap_pars_vertex: CS,
  shadowmap_vertex: RS,
  shadowmask_pars_fragment: PS,
  skinbase_vertex: LS,
  skinning_pars_vertex: DS,
  skinning_vertex: NS,
  skinnormal_vertex: IS,
  specularmap_fragment: US,
  specularmap_pars_fragment: FS,
  tonemapping_fragment: kS,
  tonemapping_pars_fragment: OS,
  transmission_fragment: BS,
  transmission_pars_fragment: zS,
  uv_pars_fragment: HS,
  uv_pars_vertex: VS,
  uv_vertex: GS,
  worldpos_vertex: WS,
  background_vert: XS,
  background_frag: jS,
  backgroundCube_vert: YS,
  backgroundCube_frag: qS,
  cube_vert: $S,
  cube_frag: KS,
  depth_vert: ZS,
  depth_frag: QS,
  distanceRGBA_vert: JS,
  distanceRGBA_frag: e1,
  equirect_vert: t1,
  equirect_frag: n1,
  linedashed_vert: i1,
  linedashed_frag: r1,
  meshbasic_vert: s1,
  meshbasic_frag: o1,
  meshlambert_vert: a1,
  meshlambert_frag: l1,
  meshmatcap_vert: c1,
  meshmatcap_frag: u1,
  meshnormal_vert: d1,
  meshnormal_frag: f1,
  meshphong_vert: h1,
  meshphong_frag: p1,
  meshphysical_vert: m1,
  meshphysical_frag: g1,
  meshtoon_vert: v1,
  meshtoon_frag: _1,
  points_vert: x1,
  points_frag: y1,
  shadow_vert: S1,
  shadow_frag: M1,
  sprite_vert: E1,
  sprite_frag: w1
}, Ne = {
  common: {
    diffuse: { value: /* @__PURE__ */ new lt(16777215) },
    opacity: { value: 1 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new dt() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new dt() },
    alphaTest: { value: 0 }
  },
  specularmap: {
    specularMap: { value: null },
    specularMapTransform: { value: /* @__PURE__ */ new dt() }
  },
  envmap: {
    envMap: { value: null },
    envMapRotation: { value: /* @__PURE__ */ new dt() },
    flipEnvMap: { value: -1 },
    reflectivity: { value: 1 },
    // basic, lambert, phong
    ior: { value: 1.5 },
    // physical
    refractionRatio: { value: 0.98 }
    // basic, lambert, phong
  },
  aomap: {
    aoMap: { value: null },
    aoMapIntensity: { value: 1 },
    aoMapTransform: { value: /* @__PURE__ */ new dt() }
  },
  lightmap: {
    lightMap: { value: null },
    lightMapIntensity: { value: 1 },
    lightMapTransform: { value: /* @__PURE__ */ new dt() }
  },
  bumpmap: {
    bumpMap: { value: null },
    bumpMapTransform: { value: /* @__PURE__ */ new dt() },
    bumpScale: { value: 1 }
  },
  normalmap: {
    normalMap: { value: null },
    normalMapTransform: { value: /* @__PURE__ */ new dt() },
    normalScale: { value: /* @__PURE__ */ new Qe(1, 1) }
  },
  displacementmap: {
    displacementMap: { value: null },
    displacementMapTransform: { value: /* @__PURE__ */ new dt() },
    displacementScale: { value: 1 },
    displacementBias: { value: 0 }
  },
  emissivemap: {
    emissiveMap: { value: null },
    emissiveMapTransform: { value: /* @__PURE__ */ new dt() }
  },
  metalnessmap: {
    metalnessMap: { value: null },
    metalnessMapTransform: { value: /* @__PURE__ */ new dt() }
  },
  roughnessmap: {
    roughnessMap: { value: null },
    roughnessMapTransform: { value: /* @__PURE__ */ new dt() }
  },
  gradientmap: {
    gradientMap: { value: null }
  },
  fog: {
    fogDensity: { value: 25e-5 },
    fogNear: { value: 1 },
    fogFar: { value: 2e3 },
    fogColor: { value: /* @__PURE__ */ new lt(16777215) }
  },
  lights: {
    ambientLightColor: { value: [] },
    lightProbe: { value: [] },
    directionalLights: { value: [], properties: {
      direction: {},
      color: {}
    } },
    directionalLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    directionalShadowMap: { value: [] },
    directionalShadowMatrix: { value: [] },
    spotLights: { value: [], properties: {
      color: {},
      position: {},
      direction: {},
      distance: {},
      coneCos: {},
      penumbraCos: {},
      decay: {}
    } },
    spotLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    spotLightMap: { value: [] },
    spotShadowMap: { value: [] },
    spotLightMatrix: { value: [] },
    pointLights: { value: [], properties: {
      color: {},
      position: {},
      decay: {},
      distance: {}
    } },
    pointLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {},
      shadowCameraNear: {},
      shadowCameraFar: {}
    } },
    pointShadowMap: { value: [] },
    pointShadowMatrix: { value: [] },
    hemisphereLights: { value: [], properties: {
      direction: {},
      skyColor: {},
      groundColor: {}
    } },
    // TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
    rectAreaLights: { value: [], properties: {
      color: {},
      position: {},
      width: {},
      height: {}
    } },
    ltc_1: { value: null },
    ltc_2: { value: null }
  },
  points: {
    diffuse: { value: /* @__PURE__ */ new lt(16777215) },
    opacity: { value: 1 },
    size: { value: 1 },
    scale: { value: 1 },
    map: { value: null },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new dt() },
    alphaTest: { value: 0 },
    uvTransform: { value: /* @__PURE__ */ new dt() }
  },
  sprite: {
    diffuse: { value: /* @__PURE__ */ new lt(16777215) },
    opacity: { value: 1 },
    center: { value: /* @__PURE__ */ new Qe(0.5, 0.5) },
    rotation: { value: 0 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new dt() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new dt() },
    alphaTest: { value: 0 }
  }
}, Ai = {
  basic: {
    uniforms: /* @__PURE__ */ bn([
      Ne.common,
      Ne.specularmap,
      Ne.envmap,
      Ne.aomap,
      Ne.lightmap,
      Ne.fog
    ]),
    vertexShader: ut.meshbasic_vert,
    fragmentShader: ut.meshbasic_frag
  },
  lambert: {
    uniforms: /* @__PURE__ */ bn([
      Ne.common,
      Ne.specularmap,
      Ne.envmap,
      Ne.aomap,
      Ne.lightmap,
      Ne.emissivemap,
      Ne.bumpmap,
      Ne.normalmap,
      Ne.displacementmap,
      Ne.fog,
      Ne.lights,
      {
        emissive: { value: /* @__PURE__ */ new lt(0) }
      }
    ]),
    vertexShader: ut.meshlambert_vert,
    fragmentShader: ut.meshlambert_frag
  },
  phong: {
    uniforms: /* @__PURE__ */ bn([
      Ne.common,
      Ne.specularmap,
      Ne.envmap,
      Ne.aomap,
      Ne.lightmap,
      Ne.emissivemap,
      Ne.bumpmap,
      Ne.normalmap,
      Ne.displacementmap,
      Ne.fog,
      Ne.lights,
      {
        emissive: { value: /* @__PURE__ */ new lt(0) },
        specular: { value: /* @__PURE__ */ new lt(1118481) },
        shininess: { value: 30 }
      }
    ]),
    vertexShader: ut.meshphong_vert,
    fragmentShader: ut.meshphong_frag
  },
  standard: {
    uniforms: /* @__PURE__ */ bn([
      Ne.common,
      Ne.envmap,
      Ne.aomap,
      Ne.lightmap,
      Ne.emissivemap,
      Ne.bumpmap,
      Ne.normalmap,
      Ne.displacementmap,
      Ne.roughnessmap,
      Ne.metalnessmap,
      Ne.fog,
      Ne.lights,
      {
        emissive: { value: /* @__PURE__ */ new lt(0) },
        roughness: { value: 1 },
        metalness: { value: 0 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: ut.meshphysical_vert,
    fragmentShader: ut.meshphysical_frag
  },
  toon: {
    uniforms: /* @__PURE__ */ bn([
      Ne.common,
      Ne.aomap,
      Ne.lightmap,
      Ne.emissivemap,
      Ne.bumpmap,
      Ne.normalmap,
      Ne.displacementmap,
      Ne.gradientmap,
      Ne.fog,
      Ne.lights,
      {
        emissive: { value: /* @__PURE__ */ new lt(0) }
      }
    ]),
    vertexShader: ut.meshtoon_vert,
    fragmentShader: ut.meshtoon_frag
  },
  matcap: {
    uniforms: /* @__PURE__ */ bn([
      Ne.common,
      Ne.bumpmap,
      Ne.normalmap,
      Ne.displacementmap,
      Ne.fog,
      {
        matcap: { value: null }
      }
    ]),
    vertexShader: ut.meshmatcap_vert,
    fragmentShader: ut.meshmatcap_frag
  },
  points: {
    uniforms: /* @__PURE__ */ bn([
      Ne.points,
      Ne.fog
    ]),
    vertexShader: ut.points_vert,
    fragmentShader: ut.points_frag
  },
  dashed: {
    uniforms: /* @__PURE__ */ bn([
      Ne.common,
      Ne.fog,
      {
        scale: { value: 1 },
        dashSize: { value: 1 },
        totalSize: { value: 2 }
      }
    ]),
    vertexShader: ut.linedashed_vert,
    fragmentShader: ut.linedashed_frag
  },
  depth: {
    uniforms: /* @__PURE__ */ bn([
      Ne.common,
      Ne.displacementmap
    ]),
    vertexShader: ut.depth_vert,
    fragmentShader: ut.depth_frag
  },
  normal: {
    uniforms: /* @__PURE__ */ bn([
      Ne.common,
      Ne.bumpmap,
      Ne.normalmap,
      Ne.displacementmap,
      {
        opacity: { value: 1 }
      }
    ]),
    vertexShader: ut.meshnormal_vert,
    fragmentShader: ut.meshnormal_frag
  },
  sprite: {
    uniforms: /* @__PURE__ */ bn([
      Ne.sprite,
      Ne.fog
    ]),
    vertexShader: ut.sprite_vert,
    fragmentShader: ut.sprite_frag
  },
  background: {
    uniforms: {
      uvTransform: { value: /* @__PURE__ */ new dt() },
      t2D: { value: null },
      backgroundIntensity: { value: 1 }
    },
    vertexShader: ut.background_vert,
    fragmentShader: ut.background_frag
  },
  backgroundCube: {
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 },
      backgroundBlurriness: { value: 0 },
      backgroundIntensity: { value: 1 },
      backgroundRotation: { value: /* @__PURE__ */ new dt() }
    },
    vertexShader: ut.backgroundCube_vert,
    fragmentShader: ut.backgroundCube_frag
  },
  cube: {
    uniforms: {
      tCube: { value: null },
      tFlip: { value: -1 },
      opacity: { value: 1 }
    },
    vertexShader: ut.cube_vert,
    fragmentShader: ut.cube_frag
  },
  equirect: {
    uniforms: {
      tEquirect: { value: null }
    },
    vertexShader: ut.equirect_vert,
    fragmentShader: ut.equirect_frag
  },
  distanceRGBA: {
    uniforms: /* @__PURE__ */ bn([
      Ne.common,
      Ne.displacementmap,
      {
        referencePosition: { value: /* @__PURE__ */ new z() },
        nearDistance: { value: 1 },
        farDistance: { value: 1e3 }
      }
    ]),
    vertexShader: ut.distanceRGBA_vert,
    fragmentShader: ut.distanceRGBA_frag
  },
  shadow: {
    uniforms: /* @__PURE__ */ bn([
      Ne.lights,
      Ne.fog,
      {
        color: { value: /* @__PURE__ */ new lt(0) },
        opacity: { value: 1 }
      }
    ]),
    vertexShader: ut.shadow_vert,
    fragmentShader: ut.shadow_frag
  }
};
Ai.physical = {
  uniforms: /* @__PURE__ */ bn([
    Ai.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: /* @__PURE__ */ new dt() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: /* @__PURE__ */ new dt() },
      clearcoatNormalScale: { value: /* @__PURE__ */ new Qe(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: /* @__PURE__ */ new dt() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: /* @__PURE__ */ new dt() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: /* @__PURE__ */ new dt() },
      sheen: { value: 0 },
      sheenColor: { value: /* @__PURE__ */ new lt(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: /* @__PURE__ */ new dt() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: /* @__PURE__ */ new dt() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: /* @__PURE__ */ new dt() },
      transmissionSamplerSize: { value: /* @__PURE__ */ new Qe() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: /* @__PURE__ */ new dt() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: /* @__PURE__ */ new lt(0) },
      specularColor: { value: /* @__PURE__ */ new lt(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: /* @__PURE__ */ new dt() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: /* @__PURE__ */ new dt() },
      anisotropyVector: { value: /* @__PURE__ */ new Qe() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: /* @__PURE__ */ new dt() }
    }
  ]),
  vertexShader: ut.meshphysical_vert,
  fragmentShader: ut.meshphysical_frag
};
const Gl = { r: 0, b: 0, g: 0 }, Zr = /* @__PURE__ */ new ai(), T1 = /* @__PURE__ */ new Rt();
function b1(s, e, t, r, o, l, u) {
  const d = new lt(0);
  let f = l === !0 ? 0 : 1, h, m, _ = null, v = 0, S = null;
  function y(L) {
    let R = L.isScene === !0 ? L.background : null;
    return R && R.isTexture && (R = (L.backgroundBlurriness > 0 ? t : e).get(R)), R;
  }
  function E(L) {
    let R = !1;
    const D = y(L);
    D === null ? M(d, f) : D && D.isColor && (M(D, 1), R = !0);
    const ee = s.xr.getEnvironmentBlendMode();
    ee === "additive" ? r.buffers.color.setClear(0, 0, 0, 1, u) : ee === "alpha-blend" && r.buffers.color.setClear(0, 0, 0, 0, u), (s.autoClear || R) && (r.buffers.depth.setTest(!0), r.buffers.depth.setMask(!0), r.buffers.color.setMask(!0), s.clear(s.autoClearColor, s.autoClearDepth, s.autoClearStencil));
  }
  function x(L, R) {
    const D = y(R);
    D && (D.isCubeTexture || D.mapping === pc) ? (m === void 0 && (m = new Ct(
      new xo(1, 1, 1),
      new Pn({
        name: "BackgroundCubeMaterial",
        uniforms: mo(Ai.backgroundCube.uniforms),
        vertexShader: Ai.backgroundCube.vertexShader,
        fragmentShader: Ai.backgroundCube.fragmentShader,
        side: zn,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), m.geometry.deleteAttribute("normal"), m.geometry.deleteAttribute("uv"), m.onBeforeRender = function(ee, F, I) {
      this.matrixWorld.copyPosition(I.matrixWorld);
    }, Object.defineProperty(m.material, "envMap", {
      get: function() {
        return this.uniforms.envMap.value;
      }
    }), o.update(m)), Zr.copy(R.backgroundRotation), Zr.x *= -1, Zr.y *= -1, Zr.z *= -1, D.isCubeTexture && D.isRenderTargetTexture === !1 && (Zr.y *= -1, Zr.z *= -1), m.material.uniforms.envMap.value = D, m.material.uniforms.flipEnvMap.value = D.isCubeTexture && D.isRenderTargetTexture === !1 ? -1 : 1, m.material.uniforms.backgroundBlurriness.value = R.backgroundBlurriness, m.material.uniforms.backgroundIntensity.value = R.backgroundIntensity, m.material.uniforms.backgroundRotation.value.setFromMatrix4(T1.makeRotationFromEuler(Zr)), m.material.toneMapped = Tt.getTransfer(D.colorSpace) !== Ut, (_ !== D || v !== D.version || S !== s.toneMapping) && (m.material.needsUpdate = !0, _ = D, v = D.version, S = s.toneMapping), m.layers.enableAll(), L.unshift(m, m.geometry, m.material, 0, 0, null)) : D && D.isTexture && (h === void 0 && (h = new Ct(
      new Pi(2, 2),
      new Pn({
        name: "BackgroundMaterial",
        uniforms: mo(Ai.background.uniforms),
        vertexShader: Ai.background.vertexShader,
        fragmentShader: Ai.background.fragmentShader,
        side: Lr,
        depthTest: !1,
        depthWrite: !1,
        fog: !1
      })
    ), h.geometry.deleteAttribute("normal"), Object.defineProperty(h.material, "map", {
      get: function() {
        return this.uniforms.t2D.value;
      }
    }), o.update(h)), h.material.uniforms.t2D.value = D, h.material.uniforms.backgroundIntensity.value = R.backgroundIntensity, h.material.toneMapped = Tt.getTransfer(D.colorSpace) !== Ut, D.matrixAutoUpdate === !0 && D.updateMatrix(), h.material.uniforms.uvTransform.value.copy(D.matrix), (_ !== D || v !== D.version || S !== s.toneMapping) && (h.material.needsUpdate = !0, _ = D, v = D.version, S = s.toneMapping), h.layers.enableAll(), L.unshift(h, h.geometry, h.material, 0, 0, null));
  }
  function M(L, R) {
    L.getRGB(Gl, ag(s)), r.buffers.color.setClear(Gl.r, Gl.g, Gl.b, R, u);
  }
  return {
    getClearColor: function() {
      return d;
    },
    setClearColor: function(L, R = 1) {
      d.set(L), f = R, M(d, f);
    },
    getClearAlpha: function() {
      return f;
    },
    setClearAlpha: function(L) {
      f = L, M(d, f);
    },
    render: E,
    addToRenderList: x
  };
}
function A1(s, e) {
  const t = s.getParameter(s.MAX_VERTEX_ATTRIBS), r = {}, o = v(null);
  let l = o, u = !1;
  function d(T, C, te, J, se) {
    let _e = !1;
    const Z = _(J, te, C);
    l !== Z && (l = Z, h(l.object)), _e = S(T, J, te, se), _e && y(T, J, te, se), se !== null && e.update(se, s.ELEMENT_ARRAY_BUFFER), (_e || u) && (u = !1, D(T, C, te, J), se !== null && s.bindBuffer(s.ELEMENT_ARRAY_BUFFER, e.get(se).buffer));
  }
  function f() {
    return s.createVertexArray();
  }
  function h(T) {
    return s.bindVertexArray(T);
  }
  function m(T) {
    return s.deleteVertexArray(T);
  }
  function _(T, C, te) {
    const J = te.wireframe === !0;
    let se = r[T.id];
    se === void 0 && (se = {}, r[T.id] = se);
    let _e = se[C.id];
    _e === void 0 && (_e = {}, se[C.id] = _e);
    let Z = _e[J];
    return Z === void 0 && (Z = v(f()), _e[J] = Z), Z;
  }
  function v(T) {
    const C = [], te = [], J = [];
    for (let se = 0; se < t; se++)
      C[se] = 0, te[se] = 0, J[se] = 0;
    return {
      // for backward compatibility on non-VAO support browser
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: C,
      enabledAttributes: te,
      attributeDivisors: J,
      object: T,
      attributes: {},
      index: null
    };
  }
  function S(T, C, te, J) {
    const se = l.attributes, _e = C.attributes;
    let Z = 0;
    const he = te.getAttributes();
    for (const O in he)
      if (he[O].location >= 0) {
        const ae = se[O];
        let U = _e[O];
        if (U === void 0 && (O === "instanceMatrix" && T.instanceMatrix && (U = T.instanceMatrix), O === "instanceColor" && T.instanceColor && (U = T.instanceColor)), ae === void 0 || ae.attribute !== U || U && ae.data !== U.data) return !0;
        Z++;
      }
    return l.attributesNum !== Z || l.index !== J;
  }
  function y(T, C, te, J) {
    const se = {}, _e = C.attributes;
    let Z = 0;
    const he = te.getAttributes();
    for (const O in he)
      if (he[O].location >= 0) {
        let ae = _e[O];
        ae === void 0 && (O === "instanceMatrix" && T.instanceMatrix && (ae = T.instanceMatrix), O === "instanceColor" && T.instanceColor && (ae = T.instanceColor));
        const U = {};
        U.attribute = ae, ae && ae.data && (U.data = ae.data), se[O] = U, Z++;
      }
    l.attributes = se, l.attributesNum = Z, l.index = J;
  }
  function E() {
    const T = l.newAttributes;
    for (let C = 0, te = T.length; C < te; C++)
      T[C] = 0;
  }
  function x(T) {
    M(T, 0);
  }
  function M(T, C) {
    const te = l.newAttributes, J = l.enabledAttributes, se = l.attributeDivisors;
    te[T] = 1, J[T] === 0 && (s.enableVertexAttribArray(T), J[T] = 1), se[T] !== C && (s.vertexAttribDivisor(T, C), se[T] = C);
  }
  function L() {
    const T = l.newAttributes, C = l.enabledAttributes;
    for (let te = 0, J = C.length; te < J; te++)
      C[te] !== T[te] && (s.disableVertexAttribArray(te), C[te] = 0);
  }
  function R(T, C, te, J, se, _e, Z) {
    Z === !0 ? s.vertexAttribIPointer(T, C, te, se, _e) : s.vertexAttribPointer(T, C, te, J, se, _e);
  }
  function D(T, C, te, J) {
    E();
    const se = J.attributes, _e = te.getAttributes(), Z = C.defaultAttributeValues;
    for (const he in _e) {
      const O = _e[he];
      if (O.location >= 0) {
        let ue = se[he];
        if (ue === void 0 && (he === "instanceMatrix" && T.instanceMatrix && (ue = T.instanceMatrix), he === "instanceColor" && T.instanceColor && (ue = T.instanceColor)), ue !== void 0) {
          const ae = ue.normalized, U = ue.itemSize, oe = e.get(ue);
          if (oe === void 0) continue;
          const Fe = oe.buffer, K = oe.type, ce = oe.bytesPerElement, pe = K === s.INT || K === s.UNSIGNED_INT || ue.gpuType === Lf;
          if (ue.isInterleavedBufferAttribute) {
            const Me = ue.data, Re = Me.stride, Le = ue.offset;
            if (Me.isInstancedInterleavedBuffer) {
              for (let Je = 0; Je < O.locationSize; Je++)
                M(O.location + Je, Me.meshPerAttribute);
              T.isInstancedMesh !== !0 && J._maxInstanceCount === void 0 && (J._maxInstanceCount = Me.meshPerAttribute * Me.count);
            } else
              for (let Je = 0; Je < O.locationSize; Je++)
                x(O.location + Je);
            s.bindBuffer(s.ARRAY_BUFFER, Fe);
            for (let Je = 0; Je < O.locationSize; Je++)
              R(
                O.location + Je,
                U / O.locationSize,
                K,
                ae,
                Re * ce,
                (Le + U / O.locationSize * Je) * ce,
                pe
              );
          } else {
            if (ue.isInstancedBufferAttribute) {
              for (let Me = 0; Me < O.locationSize; Me++)
                M(O.location + Me, ue.meshPerAttribute);
              T.isInstancedMesh !== !0 && J._maxInstanceCount === void 0 && (J._maxInstanceCount = ue.meshPerAttribute * ue.count);
            } else
              for (let Me = 0; Me < O.locationSize; Me++)
                x(O.location + Me);
            s.bindBuffer(s.ARRAY_BUFFER, Fe);
            for (let Me = 0; Me < O.locationSize; Me++)
              R(
                O.location + Me,
                U / O.locationSize,
                K,
                ae,
                U * ce,
                U / O.locationSize * Me * ce,
                pe
              );
          }
        } else if (Z !== void 0) {
          const ae = Z[he];
          if (ae !== void 0)
            switch (ae.length) {
              case 2:
                s.vertexAttrib2fv(O.location, ae);
                break;
              case 3:
                s.vertexAttrib3fv(O.location, ae);
                break;
              case 4:
                s.vertexAttrib4fv(O.location, ae);
                break;
              default:
                s.vertexAttrib1fv(O.location, ae);
            }
        }
      }
    }
    L();
  }
  function ee() {
    Y();
    for (const T in r) {
      const C = r[T];
      for (const te in C) {
        const J = C[te];
        for (const se in J)
          m(J[se].object), delete J[se];
        delete C[te];
      }
      delete r[T];
    }
  }
  function F(T) {
    if (r[T.id] === void 0) return;
    const C = r[T.id];
    for (const te in C) {
      const J = C[te];
      for (const se in J)
        m(J[se].object), delete J[se];
      delete C[te];
    }
    delete r[T.id];
  }
  function I(T) {
    for (const C in r) {
      const te = r[C];
      if (te[T.id] === void 0) continue;
      const J = te[T.id];
      for (const se in J)
        m(J[se].object), delete J[se];
      delete te[T.id];
    }
  }
  function Y() {
    ve(), u = !0, l !== o && (l = o, h(l.object));
  }
  function ve() {
    o.geometry = null, o.program = null, o.wireframe = !1;
  }
  return {
    setup: d,
    reset: Y,
    resetDefaultState: ve,
    dispose: ee,
    releaseStatesOfGeometry: F,
    releaseStatesOfProgram: I,
    initAttributes: E,
    enableAttribute: x,
    disableUnusedAttributes: L
  };
}
function C1(s, e, t) {
  let r;
  function o(h) {
    r = h;
  }
  function l(h, m) {
    s.drawArrays(r, h, m), t.update(m, r, 1);
  }
  function u(h, m, _) {
    _ !== 0 && (s.drawArraysInstanced(r, h, m, _), t.update(m, r, _));
  }
  function d(h, m, _) {
    if (_ === 0) return;
    e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r, h, 0, m, 0, _);
    let S = 0;
    for (let y = 0; y < _; y++)
      S += m[y];
    t.update(S, r, 1);
  }
  function f(h, m, _, v) {
    if (_ === 0) return;
    const S = e.get("WEBGL_multi_draw");
    if (S === null)
      for (let y = 0; y < h.length; y++)
        u(h[y], m[y], v[y]);
    else {
      S.multiDrawArraysInstancedWEBGL(r, h, 0, m, 0, v, 0, _);
      let y = 0;
      for (let E = 0; E < _; E++)
        y += m[E];
      for (let E = 0; E < v.length; E++)
        t.update(y, r, v[E]);
    }
  }
  this.setMode = o, this.render = l, this.renderInstances = u, this.renderMultiDraw = d, this.renderMultiDrawInstances = f;
}
function R1(s, e, t, r) {
  let o;
  function l() {
    if (o !== void 0) return o;
    if (e.has("EXT_texture_filter_anisotropic") === !0) {
      const I = e.get("EXT_texture_filter_anisotropic");
      o = s.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else
      o = 0;
    return o;
  }
  function u(I) {
    return !(I !== Si && r.convert(I) !== s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function d(I) {
    const Y = I === Ri && (e.has("EXT_color_buffer_half_float") || e.has("EXT_color_buffer_float"));
    return !(I !== Ji && r.convert(I) !== s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE) && // Edge and Chrome Mac < 52 (#9513)
    I !== Ci && !Y);
  }
  function f(I) {
    if (I === "highp") {
      if (s.getShaderPrecisionFormat(s.VERTEX_SHADER, s.HIGH_FLOAT).precision > 0 && s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.HIGH_FLOAT).precision > 0)
        return "highp";
      I = "mediump";
    }
    return I === "mediump" && s.getShaderPrecisionFormat(s.VERTEX_SHADER, s.MEDIUM_FLOAT).precision > 0 && s.getShaderPrecisionFormat(s.FRAGMENT_SHADER, s.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  let h = t.precision !== void 0 ? t.precision : "highp";
  const m = f(h);
  m !== h && (console.warn("THREE.WebGLRenderer:", h, "not supported, using", m, "instead."), h = m);
  const _ = t.logarithmicDepthBuffer === !0, v = t.reverseDepthBuffer === !0 && e.has("EXT_clip_control");
  if (v === !0) {
    const I = e.get("EXT_clip_control");
    I.clipControlEXT(I.LOWER_LEFT_EXT, I.ZERO_TO_ONE_EXT);
  }
  const S = s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS), y = s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS), E = s.getParameter(s.MAX_TEXTURE_SIZE), x = s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE), M = s.getParameter(s.MAX_VERTEX_ATTRIBS), L = s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS), R = s.getParameter(s.MAX_VARYING_VECTORS), D = s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS), ee = y > 0, F = s.getParameter(s.MAX_SAMPLES);
  return {
    isWebGL2: !0,
    // keeping this for backwards compatibility
    getMaxAnisotropy: l,
    getMaxPrecision: f,
    textureFormatReadable: u,
    textureTypeReadable: d,
    precision: h,
    logarithmicDepthBuffer: _,
    reverseDepthBuffer: v,
    maxTextures: S,
    maxVertexTextures: y,
    maxTextureSize: E,
    maxCubemapSize: x,
    maxAttributes: M,
    maxVertexUniforms: L,
    maxVaryings: R,
    maxFragmentUniforms: D,
    vertexTextures: ee,
    maxSamples: F
  };
}
function P1(s) {
  const e = this;
  let t = null, r = 0, o = !1, l = !1;
  const u = new es(), d = new dt(), f = { value: null, needsUpdate: !1 };
  this.uniform = f, this.numPlanes = 0, this.numIntersection = 0, this.init = function(_, v) {
    const S = _.length !== 0 || v || // enable state of previous frame - the clipping code has to
    // run another frame in order to reset the state:
    r !== 0 || o;
    return o = v, r = _.length, S;
  }, this.beginShadows = function() {
    l = !0, m(null);
  }, this.endShadows = function() {
    l = !1;
  }, this.setGlobalState = function(_, v) {
    t = m(_, v, 0);
  }, this.setState = function(_, v, S) {
    const y = _.clippingPlanes, E = _.clipIntersection, x = _.clipShadows, M = s.get(_);
    if (!o || y === null || y.length === 0 || l && !x)
      l ? m(null) : h();
    else {
      const L = l ? 0 : r, R = L * 4;
      let D = M.clippingState || null;
      f.value = D, D = m(y, v, R, S);
      for (let ee = 0; ee !== R; ++ee)
        D[ee] = t[ee];
      M.clippingState = D, this.numIntersection = E ? this.numPlanes : 0, this.numPlanes += L;
    }
  };
  function h() {
    f.value !== t && (f.value = t, f.needsUpdate = r > 0), e.numPlanes = r, e.numIntersection = 0;
  }
  function m(_, v, S, y) {
    const E = _ !== null ? _.length : 0;
    let x = null;
    if (E !== 0) {
      if (x = f.value, y !== !0 || x === null) {
        const M = S + E * 4, L = v.matrixWorldInverse;
        d.getNormalMatrix(L), (x === null || x.length < M) && (x = new Float32Array(M));
        for (let R = 0, D = S; R !== E; ++R, D += 4)
          u.copy(_[R]).applyMatrix4(L, d), u.normal.toArray(x, D), x[D + 3] = u.constant;
      }
      f.value = x, f.needsUpdate = !0;
    }
    return e.numPlanes = E, e.numIntersection = 0, x;
  }
}
function L1(s) {
  let e = /* @__PURE__ */ new WeakMap();
  function t(u, d) {
    return d === Yd ? u.mapping = co : d === qd && (u.mapping = uo), u;
  }
  function r(u) {
    if (u && u.isTexture) {
      const d = u.mapping;
      if (d === Yd || d === qd)
        if (e.has(u)) {
          const f = e.get(u).texture;
          return t(f, u.mapping);
        } else {
          const f = u.image;
          if (f && f.height > 0) {
            const h = new Vx(f.height);
            return h.fromEquirectangularTexture(s, u), e.set(u, h), u.addEventListener("dispose", o), t(h.texture, u.mapping);
          } else
            return null;
        }
    }
    return u;
  }
  function o(u) {
    const d = u.target;
    d.removeEventListener("dispose", o);
    const f = e.get(d);
    f !== void 0 && (e.delete(d), f.dispose());
  }
  function l() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: r,
    dispose: l
  };
}
class dg extends lg {
  constructor(e = -1, t = 1, r = 1, o = -1, l = 0.1, u = 2e3) {
    super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = t, this.top = r, this.bottom = o, this.near = l, this.far = u, this.updateProjectionMatrix();
  }
  copy(e, t) {
    return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this;
  }
  setViewOffset(e, t, r, o, l, u) {
    this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = r, this.view.offsetY = o, this.view.width = l, this.view.height = u, this.updateProjectionMatrix();
  }
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    const e = (this.right - this.left) / (2 * this.zoom), t = (this.top - this.bottom) / (2 * this.zoom), r = (this.right + this.left) / 2, o = (this.top + this.bottom) / 2;
    let l = r - e, u = r + e, d = o + t, f = o - t;
    if (this.view !== null && this.view.enabled) {
      const h = (this.right - this.left) / this.view.fullWidth / this.zoom, m = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      l += h * this.view.offsetX, u = l + h * this.view.width, d -= m * this.view.offsetY, f = d - m * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(l, u, d, f, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, this.view !== null && (t.object.view = Object.assign({}, this.view)), t;
  }
}
const io = 4, Ym = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], is = 20, Sd = /* @__PURE__ */ new dg(), qm = /* @__PURE__ */ new lt();
let Md = null, Ed = 0, wd = 0, Td = !1;
const ts = (1 + Math.sqrt(5)) / 2, $s = 1 / ts, $m = [
  /* @__PURE__ */ new z(-ts, $s, 0),
  /* @__PURE__ */ new z(ts, $s, 0),
  /* @__PURE__ */ new z(-$s, 0, ts),
  /* @__PURE__ */ new z($s, 0, ts),
  /* @__PURE__ */ new z(0, ts, -$s),
  /* @__PURE__ */ new z(0, ts, $s),
  /* @__PURE__ */ new z(-1, 1, -1),
  /* @__PURE__ */ new z(1, 1, -1),
  /* @__PURE__ */ new z(-1, 1, 1),
  /* @__PURE__ */ new z(1, 1, 1)
];
class Km {
  constructor(e) {
    this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
  }
  /**
   * Generates a PMREM from a supplied Scene, which can be faster than using an
   * image if networking bandwidth is low. Optional sigma specifies a blur radius
   * in radians to be applied to the scene before PMREM generation. Optional near
   * and far planes ensure the scene is rendered in its entirety (the cubeCamera
   * is placed at the origin).
   */
  fromScene(e, t = 0, r = 0.1, o = 100) {
    Md = this._renderer.getRenderTarget(), Ed = this._renderer.getActiveCubeFace(), wd = this._renderer.getActiveMipmapLevel(), Td = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(256);
    const l = this._allocateTargets();
    return l.depthBuffer = !0, this._sceneToCubeUV(e, r, o, l), t > 0 && this._blur(l, 0, 0, t), this._applyPMREM(l), this._cleanup(l), l;
  }
  /**
   * Generates a PMREM from an equirectangular texture, which can be either LDR
   * or HDR. The ideal input image size is 1k (1024 x 512),
   * as this matches best with the 256 x 256 cubemap output.
   * The smallest supported equirectangular image size is 64 x 32.
   */
  fromEquirectangular(e, t = null) {
    return this._fromTexture(e, t);
  }
  /**
   * Generates a PMREM from an cubemap texture, which can be either LDR
   * or HDR. The ideal input cube size is 256 x 256,
   * as this matches best with the 256 x 256 cubemap output.
   * The smallest supported cube size is 16 x 16.
   */
  fromCubemap(e, t = null) {
    return this._fromTexture(e, t);
  }
  /**
   * Pre-compiles the cubemap shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = Jm(), this._compileMaterial(this._cubemapMaterial));
  }
  /**
   * Pre-compiles the equirectangular shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = Qm(), this._compileMaterial(this._equirectMaterial));
  }
  /**
   * Disposes of the PMREMGenerator's internal memory. Note that PMREMGenerator is a static class,
   * so you should not need more than one PMREMGenerator object. If you do, calling dispose() on
   * one of them will cause any others to also become unusable.
   */
  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
  }
  // private interface
  _setSize(e) {
    this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let e = 0; e < this._lodPlanes.length; e++)
      this._lodPlanes[e].dispose();
  }
  _cleanup(e) {
    this._renderer.setRenderTarget(Md, Ed, wd), this._renderer.xr.enabled = Td, e.scissorTest = !1, Wl(e, 0, 0, e.width, e.height);
  }
  _fromTexture(e, t) {
    e.mapping === co || e.mapping === uo ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), Md = this._renderer.getRenderTarget(), Ed = this._renderer.getActiveCubeFace(), wd = this._renderer.getActiveMipmapLevel(), Td = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
    const r = t || this._allocateTargets();
    return this._textureToCubeUV(e, r), this._applyPMREM(r), this._cleanup(r), r;
  }
  _allocateTargets() {
    const e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, r = {
      magFilter: xi,
      minFilter: xi,
      generateMipmaps: !1,
      type: Ri,
      format: Si,
      colorSpace: Nr,
      depthBuffer: !1
    }, o = Zm(e, t, r);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = Zm(e, t, r);
      const { _lodMax: l } = this;
      ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = D1(l)), this._blurMaterial = N1(l, e, t);
    }
    return o;
  }
  _compileMaterial(e) {
    const t = new Ct(this._lodPlanes[0], e);
    this._renderer.compile(t, Sd);
  }
  _sceneToCubeUV(e, t, r, o) {
    const d = new Rn(90, 1, t, r), f = [1, -1, 1, 1, 1, 1], h = [1, 1, 1, -1, -1, -1], m = this._renderer, _ = m.autoClear, v = m.toneMapping;
    m.getClearColor(qm), m.toneMapping = Pr, m.autoClear = !1;
    const S = new Dr({
      name: "PMREM.Background",
      side: zn,
      depthWrite: !1,
      depthTest: !1
    }), y = new Ct(new xo(), S);
    let E = !1;
    const x = e.background;
    x ? x.isColor && (S.color.copy(x), e.background = null, E = !0) : (S.color.copy(qm), E = !0);
    for (let M = 0; M < 6; M++) {
      const L = M % 3;
      L === 0 ? (d.up.set(0, f[M], 0), d.lookAt(h[M], 0, 0)) : L === 1 ? (d.up.set(0, 0, f[M]), d.lookAt(0, h[M], 0)) : (d.up.set(0, f[M], 0), d.lookAt(0, 0, h[M]));
      const R = this._cubeSize;
      Wl(o, L * R, M > 2 ? R : 0, R, R), m.setRenderTarget(o), E && m.render(y, d), m.render(e, d);
    }
    y.geometry.dispose(), y.material.dispose(), m.toneMapping = v, m.autoClear = _, e.background = x;
  }
  _textureToCubeUV(e, t) {
    const r = this._renderer, o = e.mapping === co || e.mapping === uo;
    o ? (this._cubemapMaterial === null && (this._cubemapMaterial = Jm()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Qm());
    const l = o ? this._cubemapMaterial : this._equirectMaterial, u = new Ct(this._lodPlanes[0], l), d = l.uniforms;
    d.envMap.value = e;
    const f = this._cubeSize;
    Wl(t, 0, 0, 3 * f, 2 * f), r.setRenderTarget(t), r.render(u, Sd);
  }
  _applyPMREM(e) {
    const t = this._renderer, r = t.autoClear;
    t.autoClear = !1;
    const o = this._lodPlanes.length;
    for (let l = 1; l < o; l++) {
      const u = Math.sqrt(this._sigmas[l] * this._sigmas[l] - this._sigmas[l - 1] * this._sigmas[l - 1]), d = $m[(o - l - 1) % $m.length];
      this._blur(e, l - 1, l, u, d);
    }
    t.autoClear = r;
  }
  /**
   * This is a two-pass Gaussian blur for a cubemap. Normally this is done
   * vertically and horizontally, but this breaks down on a cube. Here we apply
   * the blur latitudinally (around the poles), and then longitudinally (towards
   * the poles) to approximate the orthogonally-separable blur. It is least
   * accurate at the poles, but still does a decent job.
   */
  _blur(e, t, r, o, l) {
    const u = this._pingPongRenderTarget;
    this._halfBlur(
      e,
      u,
      t,
      r,
      o,
      "latitudinal",
      l
    ), this._halfBlur(
      u,
      e,
      r,
      r,
      o,
      "longitudinal",
      l
    );
  }
  _halfBlur(e, t, r, o, l, u, d) {
    const f = this._renderer, h = this._blurMaterial;
    u !== "latitudinal" && u !== "longitudinal" && console.error(
      "blur direction must be either latitudinal or longitudinal!"
    );
    const m = 3, _ = new Ct(this._lodPlanes[o], h), v = h.uniforms, S = this._sizeLods[r] - 1, y = isFinite(l) ? Math.PI / (2 * S) : 2 * Math.PI / (2 * is - 1), E = l / y, x = isFinite(l) ? 1 + Math.floor(m * E) : is;
    x > is && console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${is}`);
    const M = [];
    let L = 0;
    for (let I = 0; I < is; ++I) {
      const Y = I / E, ve = Math.exp(-Y * Y / 2);
      M.push(ve), I === 0 ? L += ve : I < x && (L += 2 * ve);
    }
    for (let I = 0; I < M.length; I++)
      M[I] = M[I] / L;
    v.envMap.value = e.texture, v.samples.value = x, v.weights.value = M, v.latitudinal.value = u === "latitudinal", d && (v.poleAxis.value = d);
    const { _lodMax: R } = this;
    v.dTheta.value = y, v.mipInt.value = R - r;
    const D = this._sizeLods[o], ee = 3 * D * (o > R - io ? o - R + io : 0), F = 4 * (this._cubeSize - D);
    Wl(t, ee, F, 3 * D, 2 * D), f.setRenderTarget(t), f.render(_, Sd);
  }
}
function D1(s) {
  const e = [], t = [], r = [];
  let o = s;
  const l = s - io + 1 + Ym.length;
  for (let u = 0; u < l; u++) {
    const d = Math.pow(2, o);
    t.push(d);
    let f = 1 / d;
    u > s - io ? f = Ym[u - s + io - 1] : u === 0 && (f = 0), r.push(f);
    const h = 1 / (d - 2), m = -h, _ = 1 + h, v = [m, m, _, m, _, _, m, m, _, _, m, _], S = 6, y = 6, E = 3, x = 2, M = 1, L = new Float32Array(E * y * S), R = new Float32Array(x * y * S), D = new Float32Array(M * y * S);
    for (let F = 0; F < S; F++) {
      const I = F % 3 * 2 / 3 - 1, Y = F > 2 ? 0 : -1, ve = [
        I,
        Y,
        0,
        I + 2 / 3,
        Y,
        0,
        I + 2 / 3,
        Y + 1,
        0,
        I,
        Y,
        0,
        I + 2 / 3,
        Y + 1,
        0,
        I,
        Y + 1,
        0
      ];
      L.set(ve, E * y * F), R.set(v, x * y * F);
      const T = [F, F, F, F, F, F];
      D.set(T, M * y * F);
    }
    const ee = new Ln();
    ee.setAttribute("position", new Kn(L, E)), ee.setAttribute("uv", new Kn(R, x)), ee.setAttribute("faceIndex", new Kn(D, M)), e.push(ee), o > io && o--;
  }
  return { lodPlanes: e, sizeLods: t, sigmas: r };
}
function Zm(s, e, t) {
  const r = new oi(s, e, t);
  return r.texture.mapping = pc, r.texture.name = "PMREM.cubeUv", r.scissorTest = !0, r;
}
function Wl(s, e, t, r, o) {
  s.viewport.set(e, t, r, o), s.scissor.set(e, t, r, o);
}
function N1(s, e, t) {
  const r = new Float32Array(is), o = new z(0, 1, 0);
  return new Pn({
    name: "SphericalGaussianBlur",
    defines: {
      n: is,
      CUBEUV_TEXEL_WIDTH: 1 / e,
      CUBEUV_TEXEL_HEIGHT: 1 / t,
      CUBEUV_MAX_MIP: `${s}.0`
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: r },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: o }
    },
    vertexShader: Hf(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`
    ),
    blending: Zi,
    depthTest: !1,
    depthWrite: !1
  });
}
function Qm() {
  return new Pn({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: { value: null }
    },
    vertexShader: Hf(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`
    ),
    blending: Zi,
    depthTest: !1,
    depthWrite: !1
  });
}
function Jm() {
  return new Pn({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 }
    },
    vertexShader: Hf(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`
    ),
    blending: Zi,
    depthTest: !1,
    depthWrite: !1
  });
}
function Hf() {
  return (
    /* glsl */
    `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`
  );
}
function I1(s) {
  let e = /* @__PURE__ */ new WeakMap(), t = null;
  function r(d) {
    if (d && d.isTexture) {
      const f = d.mapping, h = f === Yd || f === qd, m = f === co || f === uo;
      if (h || m) {
        let _ = e.get(d);
        const v = _ !== void 0 ? _.texture.pmremVersion : 0;
        if (d.isRenderTargetTexture && d.pmremVersion !== v)
          return t === null && (t = new Km(s)), _ = h ? t.fromEquirectangular(d, _) : t.fromCubemap(d, _), _.texture.pmremVersion = d.pmremVersion, e.set(d, _), _.texture;
        if (_ !== void 0)
          return _.texture;
        {
          const S = d.image;
          return h && S && S.height > 0 || m && S && o(S) ? (t === null && (t = new Km(s)), _ = h ? t.fromEquirectangular(d) : t.fromCubemap(d), _.texture.pmremVersion = d.pmremVersion, e.set(d, _), d.addEventListener("dispose", l), _.texture) : null;
        }
      }
    }
    return d;
  }
  function o(d) {
    let f = 0;
    const h = 6;
    for (let m = 0; m < h; m++)
      d[m] !== void 0 && f++;
    return f === h;
  }
  function l(d) {
    const f = d.target;
    f.removeEventListener("dispose", l);
    const h = e.get(f);
    h !== void 0 && (e.delete(f), h.dispose());
  }
  function u() {
    e = /* @__PURE__ */ new WeakMap(), t !== null && (t.dispose(), t = null);
  }
  return {
    get: r,
    dispose: u
  };
}
function U1(s) {
  const e = {};
  function t(r) {
    if (e[r] !== void 0)
      return e[r];
    let o;
    switch (r) {
      case "WEBGL_depth_texture":
        o = s.getExtension("WEBGL_depth_texture") || s.getExtension("MOZ_WEBGL_depth_texture") || s.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        o = s.getExtension("EXT_texture_filter_anisotropic") || s.getExtension("MOZ_EXT_texture_filter_anisotropic") || s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        o = s.getExtension("WEBGL_compressed_texture_s3tc") || s.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        o = s.getExtension("WEBGL_compressed_texture_pvrtc") || s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        o = s.getExtension(r);
    }
    return e[r] = o, o;
  }
  return {
    has: function(r) {
      return t(r) !== null;
    },
    init: function() {
      t("EXT_color_buffer_float"), t("WEBGL_clip_cull_distance"), t("OES_texture_float_linear"), t("EXT_color_buffer_half_float"), t("WEBGL_multisampled_render_to_texture"), t("WEBGL_render_shared_exponent");
    },
    get: function(r) {
      const o = t(r);
      return o === null && ic("THREE.WebGLRenderer: " + r + " extension not supported."), o;
    }
  };
}
function F1(s, e, t, r) {
  const o = {}, l = /* @__PURE__ */ new WeakMap();
  function u(_) {
    const v = _.target;
    v.index !== null && e.remove(v.index);
    for (const y in v.attributes)
      e.remove(v.attributes[y]);
    for (const y in v.morphAttributes) {
      const E = v.morphAttributes[y];
      for (let x = 0, M = E.length; x < M; x++)
        e.remove(E[x]);
    }
    v.removeEventListener("dispose", u), delete o[v.id];
    const S = l.get(v);
    S && (e.remove(S), l.delete(v)), r.releaseStatesOfGeometry(v), v.isInstancedBufferGeometry === !0 && delete v._maxInstanceCount, t.memory.geometries--;
  }
  function d(_, v) {
    return o[v.id] === !0 || (v.addEventListener("dispose", u), o[v.id] = !0, t.memory.geometries++), v;
  }
  function f(_) {
    const v = _.attributes;
    for (const y in v)
      e.update(v[y], s.ARRAY_BUFFER);
    const S = _.morphAttributes;
    for (const y in S) {
      const E = S[y];
      for (let x = 0, M = E.length; x < M; x++)
        e.update(E[x], s.ARRAY_BUFFER);
    }
  }
  function h(_) {
    const v = [], S = _.index, y = _.attributes.position;
    let E = 0;
    if (S !== null) {
      const L = S.array;
      E = S.version;
      for (let R = 0, D = L.length; R < D; R += 3) {
        const ee = L[R + 0], F = L[R + 1], I = L[R + 2];
        v.push(ee, F, F, I, I, ee);
      }
    } else if (y !== void 0) {
      const L = y.array;
      E = y.version;
      for (let R = 0, D = L.length / 3 - 1; R < D; R += 3) {
        const ee = R + 0, F = R + 1, I = R + 2;
        v.push(ee, F, F, I, I, ee);
      }
    } else
      return;
    const x = new (J0(v) ? og : sg)(v, 1);
    x.version = E;
    const M = l.get(_);
    M && e.remove(M), l.set(_, x);
  }
  function m(_) {
    const v = l.get(_);
    if (v) {
      const S = _.index;
      S !== null && v.version < S.version && h(_);
    } else
      h(_);
    return l.get(_);
  }
  return {
    get: d,
    update: f,
    getWireframeAttribute: m
  };
}
function k1(s, e, t) {
  let r;
  function o(v) {
    r = v;
  }
  let l, u;
  function d(v) {
    l = v.type, u = v.bytesPerElement;
  }
  function f(v, S) {
    s.drawElements(r, S, l, v * u), t.update(S, r, 1);
  }
  function h(v, S, y) {
    y !== 0 && (s.drawElementsInstanced(r, S, l, v * u, y), t.update(S, r, y));
  }
  function m(v, S, y) {
    if (y === 0) return;
    e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r, S, 0, l, v, 0, y);
    let x = 0;
    for (let M = 0; M < y; M++)
      x += S[M];
    t.update(x, r, 1);
  }
  function _(v, S, y, E) {
    if (y === 0) return;
    const x = e.get("WEBGL_multi_draw");
    if (x === null)
      for (let M = 0; M < v.length; M++)
        h(v[M] / u, S[M], E[M]);
    else {
      x.multiDrawElementsInstancedWEBGL(r, S, 0, l, v, 0, E, 0, y);
      let M = 0;
      for (let L = 0; L < y; L++)
        M += S[L];
      for (let L = 0; L < E.length; L++)
        t.update(M, r, E[L]);
    }
  }
  this.setMode = o, this.setIndex = d, this.render = f, this.renderInstances = h, this.renderMultiDraw = m, this.renderMultiDrawInstances = _;
}
function O1(s) {
  const e = {
    geometries: 0,
    textures: 0
  }, t = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0
  };
  function r(l, u, d) {
    switch (t.calls++, u) {
      case s.TRIANGLES:
        t.triangles += d * (l / 3);
        break;
      case s.LINES:
        t.lines += d * (l / 2);
        break;
      case s.LINE_STRIP:
        t.lines += d * (l - 1);
        break;
      case s.LINE_LOOP:
        t.lines += d * l;
        break;
      case s.POINTS:
        t.points += d * l;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", u);
        break;
    }
  }
  function o() {
    t.calls = 0, t.triangles = 0, t.points = 0, t.lines = 0;
  }
  return {
    memory: e,
    render: t,
    programs: null,
    autoReset: !0,
    reset: o,
    update: r
  };
}
function B1(s, e, t) {
  const r = /* @__PURE__ */ new WeakMap(), o = new Lt();
  function l(u, d, f) {
    const h = u.morphTargetInfluences, m = d.morphAttributes.position || d.morphAttributes.normal || d.morphAttributes.color, _ = m !== void 0 ? m.length : 0;
    let v = r.get(d);
    if (v === void 0 || v.count !== _) {
      let ve = function() {
        I.dispose(), r.delete(d), d.removeEventListener("dispose", ve);
      };
      v !== void 0 && v.texture.dispose();
      const S = d.morphAttributes.position !== void 0, y = d.morphAttributes.normal !== void 0, E = d.morphAttributes.color !== void 0, x = d.morphAttributes.position || [], M = d.morphAttributes.normal || [], L = d.morphAttributes.color || [];
      let R = 0;
      S === !0 && (R = 1), y === !0 && (R = 2), E === !0 && (R = 3);
      let D = d.attributes.position.count * R, ee = 1;
      D > e.maxTextureSize && (ee = Math.ceil(D / e.maxTextureSize), D = e.maxTextureSize);
      const F = new Float32Array(D * ee * 4 * _), I = new tg(F, D, ee, _);
      I.type = Ci, I.needsUpdate = !0;
      const Y = R * 4;
      for (let T = 0; T < _; T++) {
        const C = x[T], te = M[T], J = L[T], se = D * ee * 4 * T;
        for (let _e = 0; _e < C.count; _e++) {
          const Z = _e * Y;
          S === !0 && (o.fromBufferAttribute(C, _e), F[se + Z + 0] = o.x, F[se + Z + 1] = o.y, F[se + Z + 2] = o.z, F[se + Z + 3] = 0), y === !0 && (o.fromBufferAttribute(te, _e), F[se + Z + 4] = o.x, F[se + Z + 5] = o.y, F[se + Z + 6] = o.z, F[se + Z + 7] = 0), E === !0 && (o.fromBufferAttribute(J, _e), F[se + Z + 8] = o.x, F[se + Z + 9] = o.y, F[se + Z + 10] = o.z, F[se + Z + 11] = J.itemSize === 4 ? o.w : 1);
        }
      }
      v = {
        count: _,
        texture: I,
        size: new Qe(D, ee)
      }, r.set(d, v), d.addEventListener("dispose", ve);
    }
    if (u.isInstancedMesh === !0 && u.morphTexture !== null)
      f.getUniforms().setValue(s, "morphTexture", u.morphTexture, t);
    else {
      let S = 0;
      for (let E = 0; E < h.length; E++)
        S += h[E];
      const y = d.morphTargetsRelative ? 1 : 1 - S;
      f.getUniforms().setValue(s, "morphTargetBaseInfluence", y), f.getUniforms().setValue(s, "morphTargetInfluences", h);
    }
    f.getUniforms().setValue(s, "morphTargetsTexture", v.texture, t), f.getUniforms().setValue(s, "morphTargetsTextureSize", v.size);
  }
  return {
    update: l
  };
}
function z1(s, e, t, r) {
  let o = /* @__PURE__ */ new WeakMap();
  function l(f) {
    const h = r.render.frame, m = f.geometry, _ = e.get(f, m);
    if (o.get(_) !== h && (e.update(_), o.set(_, h)), f.isInstancedMesh && (f.hasEventListener("dispose", d) === !1 && f.addEventListener("dispose", d), o.get(f) !== h && (t.update(f.instanceMatrix, s.ARRAY_BUFFER), f.instanceColor !== null && t.update(f.instanceColor, s.ARRAY_BUFFER), o.set(f, h))), f.isSkinnedMesh) {
      const v = f.skeleton;
      o.get(v) !== h && (v.update(), o.set(v, h));
    }
    return _;
  }
  function u() {
    o = /* @__PURE__ */ new WeakMap();
  }
  function d(f) {
    const h = f.target;
    h.removeEventListener("dispose", d), t.remove(h.instanceMatrix), h.instanceColor !== null && t.remove(h.instanceColor);
  }
  return {
    update: l,
    dispose: u
  };
}
class fg extends Mn {
  constructor(e, t, r, o, l, u, d, f, h, m = so) {
    if (m !== so && m !== ho)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    r === void 0 && m === so && (r = os), r === void 0 && m === ho && (r = fo), super(null, o, l, u, d, f, m, r, h), this.isDepthTexture = !0, this.image = { width: e, height: t }, this.magFilter = d !== void 0 ? d : Bn, this.minFilter = f !== void 0 ? f : Bn, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
  }
  copy(e) {
    return super.copy(e), this.compareFunction = e.compareFunction, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.compareFunction !== null && (t.compareFunction = this.compareFunction), t;
  }
}
const hg = /* @__PURE__ */ new Mn(), e0 = /* @__PURE__ */ new fg(1, 1), pg = /* @__PURE__ */ new tg(), mg = /* @__PURE__ */ new Ax(), gg = /* @__PURE__ */ new cg(), t0 = [], n0 = [], i0 = new Float32Array(16), r0 = new Float32Array(9), s0 = new Float32Array(4);
function yo(s, e, t) {
  const r = s[0];
  if (r <= 0 || r > 0) return s;
  const o = e * t;
  let l = t0[o];
  if (l === void 0 && (l = new Float32Array(o), t0[o] = l), e !== 0) {
    r.toArray(l, 0);
    for (let u = 1, d = 0; u !== e; ++u)
      d += t, s[u].toArray(l, d);
  }
  return l;
}
function en(s, e) {
  if (s.length !== e.length) return !1;
  for (let t = 0, r = s.length; t < r; t++)
    if (s[t] !== e[t]) return !1;
  return !0;
}
function tn(s, e) {
  for (let t = 0, r = e.length; t < r; t++)
    s[t] = e[t];
}
function gc(s, e) {
  let t = n0[e];
  t === void 0 && (t = new Int32Array(e), n0[e] = t);
  for (let r = 0; r !== e; ++r)
    t[r] = s.allocateTextureUnit();
  return t;
}
function H1(s, e) {
  const t = this.cache;
  t[0] !== e && (s.uniform1f(this.addr, e), t[0] = e);
}
function V1(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (s.uniform2f(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (en(t, e)) return;
    s.uniform2fv(this.addr, e), tn(t, e);
  }
}
function G1(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (s.uniform3f(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else if (e.r !== void 0)
    (t[0] !== e.r || t[1] !== e.g || t[2] !== e.b) && (s.uniform3f(this.addr, e.r, e.g, e.b), t[0] = e.r, t[1] = e.g, t[2] = e.b);
  else {
    if (en(t, e)) return;
    s.uniform3fv(this.addr, e), tn(t, e);
  }
}
function W1(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (s.uniform4f(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (en(t, e)) return;
    s.uniform4fv(this.addr, e), tn(t, e);
  }
}
function X1(s, e) {
  const t = this.cache, r = e.elements;
  if (r === void 0) {
    if (en(t, e)) return;
    s.uniformMatrix2fv(this.addr, !1, e), tn(t, e);
  } else {
    if (en(t, r)) return;
    s0.set(r), s.uniformMatrix2fv(this.addr, !1, s0), tn(t, r);
  }
}
function j1(s, e) {
  const t = this.cache, r = e.elements;
  if (r === void 0) {
    if (en(t, e)) return;
    s.uniformMatrix3fv(this.addr, !1, e), tn(t, e);
  } else {
    if (en(t, r)) return;
    r0.set(r), s.uniformMatrix3fv(this.addr, !1, r0), tn(t, r);
  }
}
function Y1(s, e) {
  const t = this.cache, r = e.elements;
  if (r === void 0) {
    if (en(t, e)) return;
    s.uniformMatrix4fv(this.addr, !1, e), tn(t, e);
  } else {
    if (en(t, r)) return;
    i0.set(r), s.uniformMatrix4fv(this.addr, !1, i0), tn(t, r);
  }
}
function q1(s, e) {
  const t = this.cache;
  t[0] !== e && (s.uniform1i(this.addr, e), t[0] = e);
}
function $1(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (s.uniform2i(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (en(t, e)) return;
    s.uniform2iv(this.addr, e), tn(t, e);
  }
}
function K1(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (s.uniform3i(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else {
    if (en(t, e)) return;
    s.uniform3iv(this.addr, e), tn(t, e);
  }
}
function Z1(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (s.uniform4i(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (en(t, e)) return;
    s.uniform4iv(this.addr, e), tn(t, e);
  }
}
function Q1(s, e) {
  const t = this.cache;
  t[0] !== e && (s.uniform1ui(this.addr, e), t[0] = e);
}
function J1(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) && (s.uniform2ui(this.addr, e.x, e.y), t[0] = e.x, t[1] = e.y);
  else {
    if (en(t, e)) return;
    s.uniform2uiv(this.addr, e), tn(t, e);
  }
}
function eM(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) && (s.uniform3ui(this.addr, e.x, e.y, e.z), t[0] = e.x, t[1] = e.y, t[2] = e.z);
  else {
    if (en(t, e)) return;
    s.uniform3uiv(this.addr, e), tn(t, e);
  }
}
function tM(s, e) {
  const t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) && (s.uniform4ui(this.addr, e.x, e.y, e.z, e.w), t[0] = e.x, t[1] = e.y, t[2] = e.z, t[3] = e.w);
  else {
    if (en(t, e)) return;
    s.uniform4uiv(this.addr, e), tn(t, e);
  }
}
function nM(s, e, t) {
  const r = this.cache, o = t.allocateTextureUnit();
  r[0] !== o && (s.uniform1i(this.addr, o), r[0] = o);
  let l;
  this.type === s.SAMPLER_2D_SHADOW ? (e0.compareFunction = Q0, l = e0) : l = hg, t.setTexture2D(e || l, o);
}
function iM(s, e, t) {
  const r = this.cache, o = t.allocateTextureUnit();
  r[0] !== o && (s.uniform1i(this.addr, o), r[0] = o), t.setTexture3D(e || mg, o);
}
function rM(s, e, t) {
  const r = this.cache, o = t.allocateTextureUnit();
  r[0] !== o && (s.uniform1i(this.addr, o), r[0] = o), t.setTextureCube(e || gg, o);
}
function sM(s, e, t) {
  const r = this.cache, o = t.allocateTextureUnit();
  r[0] !== o && (s.uniform1i(this.addr, o), r[0] = o), t.setTexture2DArray(e || pg, o);
}
function oM(s) {
  switch (s) {
    case 5126:
      return H1;
    // FLOAT
    case 35664:
      return V1;
    // _VEC2
    case 35665:
      return G1;
    // _VEC3
    case 35666:
      return W1;
    // _VEC4
    case 35674:
      return X1;
    // _MAT2
    case 35675:
      return j1;
    // _MAT3
    case 35676:
      return Y1;
    // _MAT4
    case 5124:
    case 35670:
      return q1;
    // INT, BOOL
    case 35667:
    case 35671:
      return $1;
    // _VEC2
    case 35668:
    case 35672:
      return K1;
    // _VEC3
    case 35669:
    case 35673:
      return Z1;
    // _VEC4
    case 5125:
      return Q1;
    // UINT
    case 36294:
      return J1;
    // _VEC2
    case 36295:
      return eM;
    // _VEC3
    case 36296:
      return tM;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return nM;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return iM;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return rM;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return sM;
  }
}
function aM(s, e) {
  s.uniform1fv(this.addr, e);
}
function lM(s, e) {
  const t = yo(e, this.size, 2);
  s.uniform2fv(this.addr, t);
}
function cM(s, e) {
  const t = yo(e, this.size, 3);
  s.uniform3fv(this.addr, t);
}
function uM(s, e) {
  const t = yo(e, this.size, 4);
  s.uniform4fv(this.addr, t);
}
function dM(s, e) {
  const t = yo(e, this.size, 4);
  s.uniformMatrix2fv(this.addr, !1, t);
}
function fM(s, e) {
  const t = yo(e, this.size, 9);
  s.uniformMatrix3fv(this.addr, !1, t);
}
function hM(s, e) {
  const t = yo(e, this.size, 16);
  s.uniformMatrix4fv(this.addr, !1, t);
}
function pM(s, e) {
  s.uniform1iv(this.addr, e);
}
function mM(s, e) {
  s.uniform2iv(this.addr, e);
}
function gM(s, e) {
  s.uniform3iv(this.addr, e);
}
function vM(s, e) {
  s.uniform4iv(this.addr, e);
}
function _M(s, e) {
  s.uniform1uiv(this.addr, e);
}
function xM(s, e) {
  s.uniform2uiv(this.addr, e);
}
function yM(s, e) {
  s.uniform3uiv(this.addr, e);
}
function SM(s, e) {
  s.uniform4uiv(this.addr, e);
}
function MM(s, e, t) {
  const r = this.cache, o = e.length, l = gc(t, o);
  en(r, l) || (s.uniform1iv(this.addr, l), tn(r, l));
  for (let u = 0; u !== o; ++u)
    t.setTexture2D(e[u] || hg, l[u]);
}
function EM(s, e, t) {
  const r = this.cache, o = e.length, l = gc(t, o);
  en(r, l) || (s.uniform1iv(this.addr, l), tn(r, l));
  for (let u = 0; u !== o; ++u)
    t.setTexture3D(e[u] || mg, l[u]);
}
function wM(s, e, t) {
  const r = this.cache, o = e.length, l = gc(t, o);
  en(r, l) || (s.uniform1iv(this.addr, l), tn(r, l));
  for (let u = 0; u !== o; ++u)
    t.setTextureCube(e[u] || gg, l[u]);
}
function TM(s, e, t) {
  const r = this.cache, o = e.length, l = gc(t, o);
  en(r, l) || (s.uniform1iv(this.addr, l), tn(r, l));
  for (let u = 0; u !== o; ++u)
    t.setTexture2DArray(e[u] || pg, l[u]);
}
function bM(s) {
  switch (s) {
    case 5126:
      return aM;
    // FLOAT
    case 35664:
      return lM;
    // _VEC2
    case 35665:
      return cM;
    // _VEC3
    case 35666:
      return uM;
    // _VEC4
    case 35674:
      return dM;
    // _MAT2
    case 35675:
      return fM;
    // _MAT3
    case 35676:
      return hM;
    // _MAT4
    case 5124:
    case 35670:
      return pM;
    // INT, BOOL
    case 35667:
    case 35671:
      return mM;
    // _VEC2
    case 35668:
    case 35672:
      return gM;
    // _VEC3
    case 35669:
    case 35673:
      return vM;
    // _VEC4
    case 5125:
      return _M;
    // UINT
    case 36294:
      return xM;
    // _VEC2
    case 36295:
      return yM;
    // _VEC3
    case 36296:
      return SM;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return MM;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return EM;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return wM;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return TM;
  }
}
class AM {
  constructor(e, t, r) {
    this.id = e, this.addr = r, this.cache = [], this.type = t.type, this.setValue = oM(t.type);
  }
}
class CM {
  constructor(e, t, r) {
    this.id = e, this.addr = r, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = bM(t.type);
  }
}
class RM {
  constructor(e) {
    this.id = e, this.seq = [], this.map = {};
  }
  setValue(e, t, r) {
    const o = this.seq;
    for (let l = 0, u = o.length; l !== u; ++l) {
      const d = o[l];
      d.setValue(e, t[d.id], r);
    }
  }
}
const bd = /(\w+)(\])?(\[|\.)?/g;
function o0(s, e) {
  s.seq.push(e), s.map[e.id] = e;
}
function PM(s, e, t) {
  const r = s.name, o = r.length;
  for (bd.lastIndex = 0; ; ) {
    const l = bd.exec(r), u = bd.lastIndex;
    let d = l[1];
    const f = l[2] === "]", h = l[3];
    if (f && (d = d | 0), h === void 0 || h === "[" && u + 2 === o) {
      o0(t, h === void 0 ? new AM(d, s, e) : new CM(d, s, e));
      break;
    } else {
      let _ = t.map[d];
      _ === void 0 && (_ = new RM(d), o0(t, _)), t = _;
    }
  }
}
class rc {
  constructor(e, t) {
    this.seq = [], this.map = {};
    const r = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
    for (let o = 0; o < r; ++o) {
      const l = e.getActiveUniform(t, o), u = e.getUniformLocation(t, l.name);
      PM(l, u, this);
    }
  }
  setValue(e, t, r, o) {
    const l = this.map[t];
    l !== void 0 && l.setValue(e, r, o);
  }
  setOptional(e, t, r) {
    const o = t[r];
    o !== void 0 && this.setValue(e, r, o);
  }
  static upload(e, t, r, o) {
    for (let l = 0, u = t.length; l !== u; ++l) {
      const d = t[l], f = r[d.id];
      f.needsUpdate !== !1 && d.setValue(e, f.value, o);
    }
  }
  static seqWithValue(e, t) {
    const r = [];
    for (let o = 0, l = e.length; o !== l; ++o) {
      const u = e[o];
      u.id in t && r.push(u);
    }
    return r;
  }
}
function a0(s, e, t) {
  const r = s.createShader(e);
  return s.shaderSource(r, t), s.compileShader(r), r;
}
const LM = 37297;
let DM = 0;
function NM(s, e) {
  const t = s.split(`
`), r = [], o = Math.max(e - 6, 0), l = Math.min(e + 6, t.length);
  for (let u = o; u < l; u++) {
    const d = u + 1;
    r.push(`${d === e ? ">" : " "} ${d}: ${t[u]}`);
  }
  return r.join(`
`);
}
function IM(s) {
  const e = Tt.getPrimaries(Tt.workingColorSpace), t = Tt.getPrimaries(s);
  let r;
  switch (e === t ? r = "" : e === cc && t === lc ? r = "LinearDisplayP3ToLinearSRGB" : e === lc && t === cc && (r = "LinearSRGBToLinearDisplayP3"), s) {
    case Nr:
    case mc:
      return [r, "LinearTransferOETF"];
    case yn:
    case Of:
      return [r, "sRGBTransferOETF"];
    default:
      return console.warn("THREE.WebGLProgram: Unsupported color space:", s), [r, "LinearTransferOETF"];
  }
}
function l0(s, e, t) {
  const r = s.getShaderParameter(e, s.COMPILE_STATUS), o = s.getShaderInfoLog(e).trim();
  if (r && o === "") return "";
  const l = /ERROR: 0:(\d+)/.exec(o);
  if (l) {
    const u = parseInt(l[1]);
    return t.toUpperCase() + `

` + o + `

` + NM(s.getShaderSource(e), u);
  } else
    return o;
}
function UM(s, e) {
  const t = IM(e);
  return `vec4 ${s}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`;
}
function FM(s, e) {
  let t;
  switch (e) {
    case F0:
      t = "Linear";
      break;
    case k0:
      t = "Reinhard";
      break;
    case O0:
      t = "Cineon";
      break;
    case Pf:
      t = "ACESFilmic";
      break;
    case B0:
      t = "AgX";
      break;
    case z0:
      t = "Neutral";
      break;
    case G_:
      t = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", e), t = "Linear";
  }
  return "vec3 " + s + "( vec3 color ) { return " + t + "ToneMapping( color ); }";
}
const Xl = /* @__PURE__ */ new z();
function kM() {
  Tt.getLuminanceCoefficients(Xl);
  const s = Xl.x.toFixed(4), e = Xl.y.toFixed(4), t = Xl.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,
    "	return dot( weights, rgb );",
    "}"
  ].join(`
`);
}
function OM(s) {
  return [
    s.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
    s.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""
  ].filter(pa).join(`
`);
}
function BM(s) {
  const e = [];
  for (const t in s) {
    const r = s[t];
    r !== !1 && e.push("#define " + t + " " + r);
  }
  return e.join(`
`);
}
function zM(s, e) {
  const t = {}, r = s.getProgramParameter(e, s.ACTIVE_ATTRIBUTES);
  for (let o = 0; o < r; o++) {
    const l = s.getActiveAttrib(e, o), u = l.name;
    let d = 1;
    l.type === s.FLOAT_MAT2 && (d = 2), l.type === s.FLOAT_MAT3 && (d = 3), l.type === s.FLOAT_MAT4 && (d = 4), t[u] = {
      type: l.type,
      location: s.getAttribLocation(e, u),
      locationSize: d
    };
  }
  return t;
}
function pa(s) {
  return s !== "";
}
function c0(s, e) {
  const t = e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
  return s.replace(/NUM_DIR_LIGHTS/g, e.numDirLights).replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, t).replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, e.numPointLights).replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows);
}
function u0(s, e) {
  return s.replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, e.numClippingPlanes - e.numClipIntersection);
}
const HM = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Tf(s) {
  return s.replace(HM, GM);
}
const VM = /* @__PURE__ */ new Map();
function GM(s, e) {
  let t = ut[e];
  if (t === void 0) {
    const r = VM.get(e);
    if (r !== void 0)
      t = ut[r], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', e, r);
    else
      throw new Error("Can not resolve #include <" + e + ">");
  }
  return Tf(t);
}
const WM = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function d0(s) {
  return s.replace(WM, XM);
}
function XM(s, e, t, r) {
  let o = "";
  for (let l = parseInt(e); l < parseInt(t); l++)
    o += r.replace(/\[\s*i\s*\]/g, "[ " + l + " ]").replace(/UNROLLED_LOOP_INDEX/g, l);
  return o;
}
function f0(s) {
  let e = `precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;
  return s.precision === "highp" ? e += `
#define HIGH_PRECISION` : s.precision === "mediump" ? e += `
#define MEDIUM_PRECISION` : s.precision === "lowp" && (e += `
#define LOW_PRECISION`), e;
}
function jM(s) {
  let e = "SHADOWMAP_TYPE_BASIC";
  return s.shadowMapType === N0 ? e = "SHADOWMAP_TYPE_PCF" : s.shadowMapType === I0 ? e = "SHADOWMAP_TYPE_PCF_SOFT" : s.shadowMapType === qi && (e = "SHADOWMAP_TYPE_VSM"), e;
}
function YM(s) {
  let e = "ENVMAP_TYPE_CUBE";
  if (s.envMap)
    switch (s.envMapMode) {
      case co:
      case uo:
        e = "ENVMAP_TYPE_CUBE";
        break;
      case pc:
        e = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
  return e;
}
function qM(s) {
  let e = "ENVMAP_MODE_REFLECTION";
  return s.envMap && s.envMapMode === uo && (e = "ENVMAP_MODE_REFRACTION"), e;
}
function $M(s) {
  let e = "ENVMAP_BLENDING_NONE";
  if (s.envMap)
    switch (s.combine) {
      case U0:
        e = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case H_:
        e = "ENVMAP_BLENDING_MIX";
        break;
      case V_:
        e = "ENVMAP_BLENDING_ADD";
        break;
    }
  return e;
}
function KM(s) {
  const e = s.envMapCubeUVHeight;
  if (e === null) return null;
  const t = Math.log2(e) - 2, r = 1 / e;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, t), 112)), texelHeight: r, maxMip: t };
}
function ZM(s, e, t, r) {
  const o = s.getContext(), l = t.defines;
  let u = t.vertexShader, d = t.fragmentShader;
  const f = jM(t), h = YM(t), m = qM(t), _ = $M(t), v = KM(t), S = OM(t), y = BM(l), E = o.createProgram();
  let x, M, L = t.glslVersion ? "#version " + t.glslVersion + `
` : "";
  t.isRawShaderMaterial ? (x = [
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    y
  ].filter(pa).join(`
`), x.length > 0 && (x += `
`), M = [
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    y
  ].filter(pa).join(`
`), M.length > 0 && (M += `
`)) : (x = [
    f0(t),
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    y,
    t.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
    t.batching ? "#define USE_BATCHING" : "",
    t.batchingColor ? "#define USE_BATCHING_COLOR" : "",
    t.instancing ? "#define USE_INSTANCING" : "",
    t.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
    t.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
    t.useFog && t.fog ? "#define USE_FOG" : "",
    t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
    t.map ? "#define USE_MAP" : "",
    t.envMap ? "#define USE_ENVMAP" : "",
    t.envMap ? "#define " + m : "",
    t.lightMap ? "#define USE_LIGHTMAP" : "",
    t.aoMap ? "#define USE_AOMAP" : "",
    t.bumpMap ? "#define USE_BUMPMAP" : "",
    t.normalMap ? "#define USE_NORMALMAP" : "",
    t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    t.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
    t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    t.anisotropy ? "#define USE_ANISOTROPY" : "",
    t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    t.specularMap ? "#define USE_SPECULARMAP" : "",
    t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    t.metalnessMap ? "#define USE_METALNESSMAP" : "",
    t.alphaMap ? "#define USE_ALPHAMAP" : "",
    t.alphaHash ? "#define USE_ALPHAHASH" : "",
    t.transmission ? "#define USE_TRANSMISSION" : "",
    t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    //
    t.mapUv ? "#define MAP_UV " + t.mapUv : "",
    t.alphaMapUv ? "#define ALPHAMAP_UV " + t.alphaMapUv : "",
    t.lightMapUv ? "#define LIGHTMAP_UV " + t.lightMapUv : "",
    t.aoMapUv ? "#define AOMAP_UV " + t.aoMapUv : "",
    t.emissiveMapUv ? "#define EMISSIVEMAP_UV " + t.emissiveMapUv : "",
    t.bumpMapUv ? "#define BUMPMAP_UV " + t.bumpMapUv : "",
    t.normalMapUv ? "#define NORMALMAP_UV " + t.normalMapUv : "",
    t.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + t.displacementMapUv : "",
    t.metalnessMapUv ? "#define METALNESSMAP_UV " + t.metalnessMapUv : "",
    t.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + t.roughnessMapUv : "",
    t.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + t.anisotropyMapUv : "",
    t.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + t.clearcoatMapUv : "",
    t.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + t.clearcoatNormalMapUv : "",
    t.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + t.clearcoatRoughnessMapUv : "",
    t.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + t.iridescenceMapUv : "",
    t.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + t.iridescenceThicknessMapUv : "",
    t.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + t.sheenColorMapUv : "",
    t.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + t.sheenRoughnessMapUv : "",
    t.specularMapUv ? "#define SPECULARMAP_UV " + t.specularMapUv : "",
    t.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + t.specularColorMapUv : "",
    t.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + t.specularIntensityMapUv : "",
    t.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + t.transmissionMapUv : "",
    t.thicknessMapUv ? "#define THICKNESSMAP_UV " + t.thicknessMapUv : "",
    //
    t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
    t.vertexColors ? "#define USE_COLOR" : "",
    t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    t.vertexUv1s ? "#define USE_UV1" : "",
    t.vertexUv2s ? "#define USE_UV2" : "",
    t.vertexUv3s ? "#define USE_UV3" : "",
    t.pointsUvs ? "#define USE_POINTS_UV" : "",
    t.flatShading ? "#define FLAT_SHADED" : "",
    t.skinning ? "#define USE_SKINNING" : "",
    t.morphTargets ? "#define USE_MORPHTARGETS" : "",
    t.morphNormals && t.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
    t.morphColors ? "#define USE_MORPHCOLORS" : "",
    t.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + t.morphTextureStride : "",
    t.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + t.morphTargetsCount : "",
    t.doubleSided ? "#define DOUBLE_SIDED" : "",
    t.flipSided ? "#define FLIP_SIDED" : "",
    t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    t.shadowMapEnabled ? "#define " + f : "",
    t.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
    t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    t.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 modelMatrix;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat3 normalMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    "#ifdef USE_INSTANCING",
    "	attribute mat4 instanceMatrix;",
    "#endif",
    "#ifdef USE_INSTANCING_COLOR",
    "	attribute vec3 instanceColor;",
    "#endif",
    "#ifdef USE_INSTANCING_MORPH",
    "	uniform sampler2D morphTexture;",
    "#endif",
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "#ifdef USE_UV1",
    "	attribute vec2 uv1;",
    "#endif",
    "#ifdef USE_UV2",
    "	attribute vec2 uv2;",
    "#endif",
    "#ifdef USE_UV3",
    "	attribute vec2 uv3;",
    "#endif",
    "#ifdef USE_TANGENT",
    "	attribute vec4 tangent;",
    "#endif",
    "#if defined( USE_COLOR_ALPHA )",
    "	attribute vec4 color;",
    "#elif defined( USE_COLOR )",
    "	attribute vec3 color;",
    "#endif",
    "#ifdef USE_SKINNING",
    "	attribute vec4 skinIndex;",
    "	attribute vec4 skinWeight;",
    "#endif",
    `
`
  ].filter(pa).join(`
`), M = [
    f0(t),
    "#define SHADER_TYPE " + t.shaderType,
    "#define SHADER_NAME " + t.shaderName,
    y,
    t.useFog && t.fog ? "#define USE_FOG" : "",
    t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
    t.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
    t.map ? "#define USE_MAP" : "",
    t.matcap ? "#define USE_MATCAP" : "",
    t.envMap ? "#define USE_ENVMAP" : "",
    t.envMap ? "#define " + h : "",
    t.envMap ? "#define " + m : "",
    t.envMap ? "#define " + _ : "",
    v ? "#define CUBEUV_TEXEL_WIDTH " + v.texelWidth : "",
    v ? "#define CUBEUV_TEXEL_HEIGHT " + v.texelHeight : "",
    v ? "#define CUBEUV_MAX_MIP " + v.maxMip + ".0" : "",
    t.lightMap ? "#define USE_LIGHTMAP" : "",
    t.aoMap ? "#define USE_AOMAP" : "",
    t.bumpMap ? "#define USE_BUMPMAP" : "",
    t.normalMap ? "#define USE_NORMALMAP" : "",
    t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    t.anisotropy ? "#define USE_ANISOTROPY" : "",
    t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    t.clearcoat ? "#define USE_CLEARCOAT" : "",
    t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    t.dispersion ? "#define USE_DISPERSION" : "",
    t.iridescence ? "#define USE_IRIDESCENCE" : "",
    t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    t.specularMap ? "#define USE_SPECULARMAP" : "",
    t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    t.metalnessMap ? "#define USE_METALNESSMAP" : "",
    t.alphaMap ? "#define USE_ALPHAMAP" : "",
    t.alphaTest ? "#define USE_ALPHATEST" : "",
    t.alphaHash ? "#define USE_ALPHAHASH" : "",
    t.sheen ? "#define USE_SHEEN" : "",
    t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    t.transmission ? "#define USE_TRANSMISSION" : "",
    t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
    t.vertexColors || t.instancingColor || t.batchingColor ? "#define USE_COLOR" : "",
    t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    t.vertexUv1s ? "#define USE_UV1" : "",
    t.vertexUv2s ? "#define USE_UV2" : "",
    t.vertexUv3s ? "#define USE_UV3" : "",
    t.pointsUvs ? "#define USE_POINTS_UV" : "",
    t.gradientMap ? "#define USE_GRADIENTMAP" : "",
    t.flatShading ? "#define FLAT_SHADED" : "",
    t.doubleSided ? "#define DOUBLE_SIDED" : "",
    t.flipSided ? "#define FLIP_SIDED" : "",
    t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    t.shadowMapEnabled ? "#define " + f : "",
    t.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
    t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    t.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
    t.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    t.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 viewMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    t.toneMapping !== Pr ? "#define TONE_MAPPING" : "",
    t.toneMapping !== Pr ? ut.tonemapping_pars_fragment : "",
    // this code is required here because it is used by the toneMapping() function defined below
    t.toneMapping !== Pr ? FM("toneMapping", t.toneMapping) : "",
    t.dithering ? "#define DITHERING" : "",
    t.opaque ? "#define OPAQUE" : "",
    ut.colorspace_pars_fragment,
    // this code is required here because it is used by the various encoding/decoding function defined below
    UM("linearToOutputTexel", t.outputColorSpace),
    kM(),
    t.useDepthPacking ? "#define DEPTH_PACKING " + t.depthPacking : "",
    `
`
  ].filter(pa).join(`
`)), u = Tf(u), u = c0(u, t), u = u0(u, t), d = Tf(d), d = c0(d, t), d = u0(d, t), u = d0(u), d = d0(d), t.isRawShaderMaterial !== !0 && (L = `#version 300 es
`, x = [
    S,
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"
  ].join(`
`) + `
` + x, M = [
    "#define varying in",
    t.glslVersion === Cm ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
    t.glslVersion === Cm ? "" : "#define gl_FragColor pc_fragColor",
    "#define gl_FragDepthEXT gl_FragDepth",
    "#define texture2D texture",
    "#define textureCube texture",
    "#define texture2DProj textureProj",
    "#define texture2DLodEXT textureLod",
    "#define texture2DProjLodEXT textureProjLod",
    "#define textureCubeLodEXT textureLod",
    "#define texture2DGradEXT textureGrad",
    "#define texture2DProjGradEXT textureProjGrad",
    "#define textureCubeGradEXT textureGrad"
  ].join(`
`) + `
` + M);
  const R = L + x + u, D = L + M + d, ee = a0(o, o.VERTEX_SHADER, R), F = a0(o, o.FRAGMENT_SHADER, D);
  o.attachShader(E, ee), o.attachShader(E, F), t.index0AttributeName !== void 0 ? o.bindAttribLocation(E, 0, t.index0AttributeName) : t.morphTargets === !0 && o.bindAttribLocation(E, 0, "position"), o.linkProgram(E);
  function I(C) {
    if (s.debug.checkShaderErrors) {
      const te = o.getProgramInfoLog(E).trim(), J = o.getShaderInfoLog(ee).trim(), se = o.getShaderInfoLog(F).trim();
      let _e = !0, Z = !0;
      if (o.getProgramParameter(E, o.LINK_STATUS) === !1)
        if (_e = !1, typeof s.debug.onShaderError == "function")
          s.debug.onShaderError(o, E, ee, F);
        else {
          const he = l0(o, ee, "vertex"), O = l0(o, F, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " + o.getError() + " - VALIDATE_STATUS " + o.getProgramParameter(E, o.VALIDATE_STATUS) + `

Material Name: ` + C.name + `
Material Type: ` + C.type + `

Program Info Log: ` + te + `
` + he + `
` + O
          );
        }
      else te !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", te) : (J === "" || se === "") && (Z = !1);
      Z && (C.diagnostics = {
        runnable: _e,
        programLog: te,
        vertexShader: {
          log: J,
          prefix: x
        },
        fragmentShader: {
          log: se,
          prefix: M
        }
      });
    }
    o.deleteShader(ee), o.deleteShader(F), Y = new rc(o, E), ve = zM(o, E);
  }
  let Y;
  this.getUniforms = function() {
    return Y === void 0 && I(this), Y;
  };
  let ve;
  this.getAttributes = function() {
    return ve === void 0 && I(this), ve;
  };
  let T = t.rendererExtensionParallelShaderCompile === !1;
  return this.isReady = function() {
    return T === !1 && (T = o.getProgramParameter(E, LM)), T;
  }, this.destroy = function() {
    r.releaseStatesOfProgram(this), o.deleteProgram(E), this.program = void 0;
  }, this.type = t.shaderType, this.name = t.shaderName, this.id = DM++, this.cacheKey = e, this.usedTimes = 1, this.program = E, this.vertexShader = ee, this.fragmentShader = F, this;
}
let QM = 0;
class JM {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(e) {
    const t = e.vertexShader, r = e.fragmentShader, o = this._getShaderStage(t), l = this._getShaderStage(r), u = this._getShaderCacheForMaterial(e);
    return u.has(o) === !1 && (u.add(o), o.usedTimes++), u.has(l) === !1 && (u.add(l), l.usedTimes++), this;
  }
  remove(e) {
    const t = this.materialCache.get(e);
    for (const r of t)
      r.usedTimes--, r.usedTimes === 0 && this.shaderCache.delete(r.code);
    return this.materialCache.delete(e), this;
  }
  getVertexShaderID(e) {
    return this._getShaderStage(e.vertexShader).id;
  }
  getFragmentShaderID(e) {
    return this._getShaderStage(e.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(e) {
    const t = this.materialCache;
    let r = t.get(e);
    return r === void 0 && (r = /* @__PURE__ */ new Set(), t.set(e, r)), r;
  }
  _getShaderStage(e) {
    const t = this.shaderCache;
    let r = t.get(e);
    return r === void 0 && (r = new eE(e), t.set(e, r)), r;
  }
}
class eE {
  constructor(e) {
    this.id = QM++, this.code = e, this.usedTimes = 0;
  }
}
function tE(s, e, t, r, o, l, u) {
  const d = new ig(), f = new JM(), h = /* @__PURE__ */ new Set(), m = [], _ = o.logarithmicDepthBuffer, v = o.reverseDepthBuffer, S = o.vertexTextures;
  let y = o.precision;
  const E = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distanceRGBA",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite"
  };
  function x(T) {
    return h.add(T), T === 0 ? "uv" : `uv${T}`;
  }
  function M(T, C, te, J, se) {
    const _e = J.fog, Z = se.geometry, he = T.isMeshStandardMaterial ? J.environment : null, O = (T.isMeshStandardMaterial ? t : e).get(T.envMap || he), ue = O && O.mapping === pc ? O.image.height : null, ae = E[T.type];
    T.precision !== null && (y = o.getMaxPrecision(T.precision), y !== T.precision && console.warn("THREE.WebGLProgram.getParameters:", T.precision, "not supported, using", y, "instead."));
    const U = Z.morphAttributes.position || Z.morphAttributes.normal || Z.morphAttributes.color, oe = U !== void 0 ? U.length : 0;
    let Fe = 0;
    Z.morphAttributes.position !== void 0 && (Fe = 1), Z.morphAttributes.normal !== void 0 && (Fe = 2), Z.morphAttributes.color !== void 0 && (Fe = 3);
    let K, ce, pe, Me;
    if (ae) {
      const nn = Ai[ae];
      K = nn.vertexShader, ce = nn.fragmentShader;
    } else
      K = T.vertexShader, ce = T.fragmentShader, f.update(T), pe = f.getVertexShaderID(T), Me = f.getFragmentShaderID(T);
    const Re = s.getRenderTarget(), Le = se.isInstancedMesh === !0, Je = se.isBatchedMesh === !0, ft = !!T.map, at = !!T.matcap, B = !!O, qt = !!T.aoMap, ht = !!T.lightMap, ct = !!T.bumpMap, Ze = !!T.normalMap, Ce = !!T.displacementMap, ke = !!T.emissiveMap, P = !!T.metalnessMap, b = !!T.roughnessMap, $ = T.anisotropy > 0, fe = T.clearcoat > 0, xe = T.dispersion > 0, de = T.iridescence > 0, Xe = T.sheen > 0, Pe = T.transmission > 0, Oe = $ && !!T.anisotropyMap, vt = fe && !!T.clearcoatMap, we = fe && !!T.clearcoatNormalMap, Ue = fe && !!T.clearcoatRoughnessMap, rt = de && !!T.iridescenceMap, it = de && !!T.iridescenceThicknessMap, H = Xe && !!T.sheenColorMap, me = Xe && !!T.sheenRoughnessMap, $e = !!T.specularMap, pt = !!T.specularColorMap, V = !!T.specularIntensityMap, Ie = Pe && !!T.transmissionMap, le = Pe && !!T.thicknessMap, ge = !!T.gradientMap, De = !!T.alphaMap, ze = T.alphaTest > 0, _t = !!T.alphaHash, zt = !!T.extensions;
    let cn = Pr;
    T.toneMapped && (Re === null || Re.isXRRenderTarget === !0) && (cn = s.toneMapping);
    const xt = {
      shaderID: ae,
      shaderType: T.type,
      shaderName: T.name,
      vertexShader: K,
      fragmentShader: ce,
      defines: T.defines,
      customVertexShaderID: pe,
      customFragmentShaderID: Me,
      isRawShaderMaterial: T.isRawShaderMaterial === !0,
      glslVersion: T.glslVersion,
      precision: y,
      batching: Je,
      batchingColor: Je && se._colorsTexture !== null,
      instancing: Le,
      instancingColor: Le && se.instanceColor !== null,
      instancingMorph: Le && se.morphTexture !== null,
      supportsVertexTextures: S,
      outputColorSpace: Re === null ? s.outputColorSpace : Re.isXRRenderTarget === !0 ? Re.texture.colorSpace : Nr,
      alphaToCoverage: !!T.alphaToCoverage,
      map: ft,
      matcap: at,
      envMap: B,
      envMapMode: B && O.mapping,
      envMapCubeUVHeight: ue,
      aoMap: qt,
      lightMap: ht,
      bumpMap: ct,
      normalMap: Ze,
      displacementMap: S && Ce,
      emissiveMap: ke,
      normalMapObjectSpace: Ze && T.normalMapType === Y_,
      normalMapTangentSpace: Ze && T.normalMapType === Z0,
      metalnessMap: P,
      roughnessMap: b,
      anisotropy: $,
      anisotropyMap: Oe,
      clearcoat: fe,
      clearcoatMap: vt,
      clearcoatNormalMap: we,
      clearcoatRoughnessMap: Ue,
      dispersion: xe,
      iridescence: de,
      iridescenceMap: rt,
      iridescenceThicknessMap: it,
      sheen: Xe,
      sheenColorMap: H,
      sheenRoughnessMap: me,
      specularMap: $e,
      specularColorMap: pt,
      specularIntensityMap: V,
      transmission: Pe,
      transmissionMap: Ie,
      thicknessMap: le,
      gradientMap: ge,
      opaque: T.transparent === !1 && T.blending === ro && T.alphaToCoverage === !1,
      alphaMap: De,
      alphaTest: ze,
      alphaHash: _t,
      combine: T.combine,
      //
      mapUv: ft && x(T.map.channel),
      aoMapUv: qt && x(T.aoMap.channel),
      lightMapUv: ht && x(T.lightMap.channel),
      bumpMapUv: ct && x(T.bumpMap.channel),
      normalMapUv: Ze && x(T.normalMap.channel),
      displacementMapUv: Ce && x(T.displacementMap.channel),
      emissiveMapUv: ke && x(T.emissiveMap.channel),
      metalnessMapUv: P && x(T.metalnessMap.channel),
      roughnessMapUv: b && x(T.roughnessMap.channel),
      anisotropyMapUv: Oe && x(T.anisotropyMap.channel),
      clearcoatMapUv: vt && x(T.clearcoatMap.channel),
      clearcoatNormalMapUv: we && x(T.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: Ue && x(T.clearcoatRoughnessMap.channel),
      iridescenceMapUv: rt && x(T.iridescenceMap.channel),
      iridescenceThicknessMapUv: it && x(T.iridescenceThicknessMap.channel),
      sheenColorMapUv: H && x(T.sheenColorMap.channel),
      sheenRoughnessMapUv: me && x(T.sheenRoughnessMap.channel),
      specularMapUv: $e && x(T.specularMap.channel),
      specularColorMapUv: pt && x(T.specularColorMap.channel),
      specularIntensityMapUv: V && x(T.specularIntensityMap.channel),
      transmissionMapUv: Ie && x(T.transmissionMap.channel),
      thicknessMapUv: le && x(T.thicknessMap.channel),
      alphaMapUv: De && x(T.alphaMap.channel),
      //
      vertexTangents: !!Z.attributes.tangent && (Ze || $),
      vertexColors: T.vertexColors,
      vertexAlphas: T.vertexColors === !0 && !!Z.attributes.color && Z.attributes.color.itemSize === 4,
      pointsUvs: se.isPoints === !0 && !!Z.attributes.uv && (ft || De),
      fog: !!_e,
      useFog: T.fog === !0,
      fogExp2: !!_e && _e.isFogExp2,
      flatShading: T.flatShading === !0,
      sizeAttenuation: T.sizeAttenuation === !0,
      logarithmicDepthBuffer: _,
      reverseDepthBuffer: v,
      skinning: se.isSkinnedMesh === !0,
      morphTargets: Z.morphAttributes.position !== void 0,
      morphNormals: Z.morphAttributes.normal !== void 0,
      morphColors: Z.morphAttributes.color !== void 0,
      morphTargetsCount: oe,
      morphTextureStride: Fe,
      numDirLights: C.directional.length,
      numPointLights: C.point.length,
      numSpotLights: C.spot.length,
      numSpotLightMaps: C.spotLightMap.length,
      numRectAreaLights: C.rectArea.length,
      numHemiLights: C.hemi.length,
      numDirLightShadows: C.directionalShadowMap.length,
      numPointLightShadows: C.pointShadowMap.length,
      numSpotLightShadows: C.spotShadowMap.length,
      numSpotLightShadowsWithMaps: C.numSpotLightShadowsWithMaps,
      numLightProbes: C.numLightProbes,
      numClippingPlanes: u.numPlanes,
      numClipIntersection: u.numIntersection,
      dithering: T.dithering,
      shadowMapEnabled: s.shadowMap.enabled && te.length > 0,
      shadowMapType: s.shadowMap.type,
      toneMapping: cn,
      decodeVideoTexture: ft && T.map.isVideoTexture === !0 && Tt.getTransfer(T.map.colorSpace) === Ut,
      premultipliedAlpha: T.premultipliedAlpha,
      doubleSided: T.side === $n,
      flipSided: T.side === zn,
      useDepthPacking: T.depthPacking >= 0,
      depthPacking: T.depthPacking || 0,
      index0AttributeName: T.index0AttributeName,
      extensionClipCullDistance: zt && T.extensions.clipCullDistance === !0 && r.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw: (zt && T.extensions.multiDraw === !0 || Je) && r.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: r.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: T.customProgramCacheKey()
    };
    return xt.vertexUv1s = h.has(1), xt.vertexUv2s = h.has(2), xt.vertexUv3s = h.has(3), h.clear(), xt;
  }
  function L(T) {
    const C = [];
    if (T.shaderID ? C.push(T.shaderID) : (C.push(T.customVertexShaderID), C.push(T.customFragmentShaderID)), T.defines !== void 0)
      for (const te in T.defines)
        C.push(te), C.push(T.defines[te]);
    return T.isRawShaderMaterial === !1 && (R(C, T), D(C, T), C.push(s.outputColorSpace)), C.push(T.customProgramCacheKey), C.join();
  }
  function R(T, C) {
    T.push(C.precision), T.push(C.outputColorSpace), T.push(C.envMapMode), T.push(C.envMapCubeUVHeight), T.push(C.mapUv), T.push(C.alphaMapUv), T.push(C.lightMapUv), T.push(C.aoMapUv), T.push(C.bumpMapUv), T.push(C.normalMapUv), T.push(C.displacementMapUv), T.push(C.emissiveMapUv), T.push(C.metalnessMapUv), T.push(C.roughnessMapUv), T.push(C.anisotropyMapUv), T.push(C.clearcoatMapUv), T.push(C.clearcoatNormalMapUv), T.push(C.clearcoatRoughnessMapUv), T.push(C.iridescenceMapUv), T.push(C.iridescenceThicknessMapUv), T.push(C.sheenColorMapUv), T.push(C.sheenRoughnessMapUv), T.push(C.specularMapUv), T.push(C.specularColorMapUv), T.push(C.specularIntensityMapUv), T.push(C.transmissionMapUv), T.push(C.thicknessMapUv), T.push(C.combine), T.push(C.fogExp2), T.push(C.sizeAttenuation), T.push(C.morphTargetsCount), T.push(C.morphAttributeCount), T.push(C.numDirLights), T.push(C.numPointLights), T.push(C.numSpotLights), T.push(C.numSpotLightMaps), T.push(C.numHemiLights), T.push(C.numRectAreaLights), T.push(C.numDirLightShadows), T.push(C.numPointLightShadows), T.push(C.numSpotLightShadows), T.push(C.numSpotLightShadowsWithMaps), T.push(C.numLightProbes), T.push(C.shadowMapType), T.push(C.toneMapping), T.push(C.numClippingPlanes), T.push(C.numClipIntersection), T.push(C.depthPacking);
  }
  function D(T, C) {
    d.disableAll(), C.supportsVertexTextures && d.enable(0), C.instancing && d.enable(1), C.instancingColor && d.enable(2), C.instancingMorph && d.enable(3), C.matcap && d.enable(4), C.envMap && d.enable(5), C.normalMapObjectSpace && d.enable(6), C.normalMapTangentSpace && d.enable(7), C.clearcoat && d.enable(8), C.iridescence && d.enable(9), C.alphaTest && d.enable(10), C.vertexColors && d.enable(11), C.vertexAlphas && d.enable(12), C.vertexUv1s && d.enable(13), C.vertexUv2s && d.enable(14), C.vertexUv3s && d.enable(15), C.vertexTangents && d.enable(16), C.anisotropy && d.enable(17), C.alphaHash && d.enable(18), C.batching && d.enable(19), C.dispersion && d.enable(20), C.batchingColor && d.enable(21), T.push(d.mask), d.disableAll(), C.fog && d.enable(0), C.useFog && d.enable(1), C.flatShading && d.enable(2), C.logarithmicDepthBuffer && d.enable(3), C.reverseDepthBuffer && d.enable(4), C.skinning && d.enable(5), C.morphTargets && d.enable(6), C.morphNormals && d.enable(7), C.morphColors && d.enable(8), C.premultipliedAlpha && d.enable(9), C.shadowMapEnabled && d.enable(10), C.doubleSided && d.enable(11), C.flipSided && d.enable(12), C.useDepthPacking && d.enable(13), C.dithering && d.enable(14), C.transmission && d.enable(15), C.sheen && d.enable(16), C.opaque && d.enable(17), C.pointsUvs && d.enable(18), C.decodeVideoTexture && d.enable(19), C.alphaToCoverage && d.enable(20), T.push(d.mask);
  }
  function ee(T) {
    const C = E[T.type];
    let te;
    if (C) {
      const J = Ai[C];
      te = xa.clone(J.uniforms);
    } else
      te = T.uniforms;
    return te;
  }
  function F(T, C) {
    let te;
    for (let J = 0, se = m.length; J < se; J++) {
      const _e = m[J];
      if (_e.cacheKey === C) {
        te = _e, ++te.usedTimes;
        break;
      }
    }
    return te === void 0 && (te = new ZM(s, C, T, l), m.push(te)), te;
  }
  function I(T) {
    if (--T.usedTimes === 0) {
      const C = m.indexOf(T);
      m[C] = m[m.length - 1], m.pop(), T.destroy();
    }
  }
  function Y(T) {
    f.remove(T);
  }
  function ve() {
    f.dispose();
  }
  return {
    getParameters: M,
    getProgramCacheKey: L,
    getUniforms: ee,
    acquireProgram: F,
    releaseProgram: I,
    releaseShaderCache: Y,
    // Exposed for resource monitoring & error feedback via renderer.info:
    programs: m,
    dispose: ve
  };
}
function nE() {
  let s = /* @__PURE__ */ new WeakMap();
  function e(u) {
    return s.has(u);
  }
  function t(u) {
    let d = s.get(u);
    return d === void 0 && (d = {}, s.set(u, d)), d;
  }
  function r(u) {
    s.delete(u);
  }
  function o(u, d, f) {
    s.get(u)[d] = f;
  }
  function l() {
    s = /* @__PURE__ */ new WeakMap();
  }
  return {
    has: e,
    get: t,
    remove: r,
    update: o,
    dispose: l
  };
}
function iE(s, e) {
  return s.groupOrder !== e.groupOrder ? s.groupOrder - e.groupOrder : s.renderOrder !== e.renderOrder ? s.renderOrder - e.renderOrder : s.material.id !== e.material.id ? s.material.id - e.material.id : s.z !== e.z ? s.z - e.z : s.id - e.id;
}
function h0(s, e) {
  return s.groupOrder !== e.groupOrder ? s.groupOrder - e.groupOrder : s.renderOrder !== e.renderOrder ? s.renderOrder - e.renderOrder : s.z !== e.z ? e.z - s.z : s.id - e.id;
}
function p0() {
  const s = [];
  let e = 0;
  const t = [], r = [], o = [];
  function l() {
    e = 0, t.length = 0, r.length = 0, o.length = 0;
  }
  function u(_, v, S, y, E, x) {
    let M = s[e];
    return M === void 0 ? (M = {
      id: _.id,
      object: _,
      geometry: v,
      material: S,
      groupOrder: y,
      renderOrder: _.renderOrder,
      z: E,
      group: x
    }, s[e] = M) : (M.id = _.id, M.object = _, M.geometry = v, M.material = S, M.groupOrder = y, M.renderOrder = _.renderOrder, M.z = E, M.group = x), e++, M;
  }
  function d(_, v, S, y, E, x) {
    const M = u(_, v, S, y, E, x);
    S.transmission > 0 ? r.push(M) : S.transparent === !0 ? o.push(M) : t.push(M);
  }
  function f(_, v, S, y, E, x) {
    const M = u(_, v, S, y, E, x);
    S.transmission > 0 ? r.unshift(M) : S.transparent === !0 ? o.unshift(M) : t.unshift(M);
  }
  function h(_, v) {
    t.length > 1 && t.sort(_ || iE), r.length > 1 && r.sort(v || h0), o.length > 1 && o.sort(v || h0);
  }
  function m() {
    for (let _ = e, v = s.length; _ < v; _++) {
      const S = s[_];
      if (S.id === null) break;
      S.id = null, S.object = null, S.geometry = null, S.material = null, S.group = null;
    }
  }
  return {
    opaque: t,
    transmissive: r,
    transparent: o,
    init: l,
    push: d,
    unshift: f,
    finish: m,
    sort: h
  };
}
function rE() {
  let s = /* @__PURE__ */ new WeakMap();
  function e(r, o) {
    const l = s.get(r);
    let u;
    return l === void 0 ? (u = new p0(), s.set(r, [u])) : o >= l.length ? (u = new p0(), l.push(u)) : u = l[o], u;
  }
  function t() {
    s = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: e,
    dispose: t
  };
}
function sE() {
  const s = {};
  return {
    get: function(e) {
      if (s[e.id] !== void 0)
        return s[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = {
            direction: new z(),
            color: new lt()
          };
          break;
        case "SpotLight":
          t = {
            position: new z(),
            direction: new z(),
            color: new lt(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0
          };
          break;
        case "PointLight":
          t = {
            position: new z(),
            color: new lt(),
            distance: 0,
            decay: 0
          };
          break;
        case "HemisphereLight":
          t = {
            direction: new z(),
            skyColor: new lt(),
            groundColor: new lt()
          };
          break;
        case "RectAreaLight":
          t = {
            color: new lt(),
            position: new z(),
            halfWidth: new z(),
            halfHeight: new z()
          };
          break;
      }
      return s[e.id] = t, t;
    }
  };
}
function oE() {
  const s = {};
  return {
    get: function(e) {
      if (s[e.id] !== void 0)
        return s[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Qe()
          };
          break;
        case "SpotLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Qe()
          };
          break;
        case "PointLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Qe(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3
          };
          break;
      }
      return s[e.id] = t, t;
    }
  };
}
let aE = 0;
function lE(s, e) {
  return (e.castShadow ? 2 : 0) - (s.castShadow ? 2 : 0) + (e.map ? 1 : 0) - (s.map ? 1 : 0);
}
function cE(s) {
  const e = new sE(), t = oE(), r = {
    version: 0,
    hash: {
      directionalLength: -1,
      pointLength: -1,
      spotLength: -1,
      rectAreaLength: -1,
      hemiLength: -1,
      numDirectionalShadows: -1,
      numPointShadows: -1,
      numSpotShadows: -1,
      numSpotMaps: -1,
      numLightProbes: -1
    },
    ambient: [0, 0, 0],
    probe: [],
    directional: [],
    directionalShadow: [],
    directionalShadowMap: [],
    directionalShadowMatrix: [],
    spot: [],
    spotLightMap: [],
    spotShadow: [],
    spotShadowMap: [],
    spotLightMatrix: [],
    rectArea: [],
    rectAreaLTC1: null,
    rectAreaLTC2: null,
    point: [],
    pointShadow: [],
    pointShadowMap: [],
    pointShadowMatrix: [],
    hemi: [],
    numSpotLightShadowsWithMaps: 0,
    numLightProbes: 0
  };
  for (let h = 0; h < 9; h++) r.probe.push(new z());
  const o = new z(), l = new Rt(), u = new Rt();
  function d(h) {
    let m = 0, _ = 0, v = 0;
    for (let ve = 0; ve < 9; ve++) r.probe[ve].set(0, 0, 0);
    let S = 0, y = 0, E = 0, x = 0, M = 0, L = 0, R = 0, D = 0, ee = 0, F = 0, I = 0;
    h.sort(lE);
    for (let ve = 0, T = h.length; ve < T; ve++) {
      const C = h[ve], te = C.color, J = C.intensity, se = C.distance, _e = C.shadow && C.shadow.map ? C.shadow.map.texture : null;
      if (C.isAmbientLight)
        m += te.r * J, _ += te.g * J, v += te.b * J;
      else if (C.isLightProbe) {
        for (let Z = 0; Z < 9; Z++)
          r.probe[Z].addScaledVector(C.sh.coefficients[Z], J);
        I++;
      } else if (C.isDirectionalLight) {
        const Z = e.get(C);
        if (Z.color.copy(C.color).multiplyScalar(C.intensity), C.castShadow) {
          const he = C.shadow, O = t.get(C);
          O.shadowIntensity = he.intensity, O.shadowBias = he.bias, O.shadowNormalBias = he.normalBias, O.shadowRadius = he.radius, O.shadowMapSize = he.mapSize, r.directionalShadow[S] = O, r.directionalShadowMap[S] = _e, r.directionalShadowMatrix[S] = C.shadow.matrix, L++;
        }
        r.directional[S] = Z, S++;
      } else if (C.isSpotLight) {
        const Z = e.get(C);
        Z.position.setFromMatrixPosition(C.matrixWorld), Z.color.copy(te).multiplyScalar(J), Z.distance = se, Z.coneCos = Math.cos(C.angle), Z.penumbraCos = Math.cos(C.angle * (1 - C.penumbra)), Z.decay = C.decay, r.spot[E] = Z;
        const he = C.shadow;
        if (C.map && (r.spotLightMap[ee] = C.map, ee++, he.updateMatrices(C), C.castShadow && F++), r.spotLightMatrix[E] = he.matrix, C.castShadow) {
          const O = t.get(C);
          O.shadowIntensity = he.intensity, O.shadowBias = he.bias, O.shadowNormalBias = he.normalBias, O.shadowRadius = he.radius, O.shadowMapSize = he.mapSize, r.spotShadow[E] = O, r.spotShadowMap[E] = _e, D++;
        }
        E++;
      } else if (C.isRectAreaLight) {
        const Z = e.get(C);
        Z.color.copy(te).multiplyScalar(J), Z.halfWidth.set(C.width * 0.5, 0, 0), Z.halfHeight.set(0, C.height * 0.5, 0), r.rectArea[x] = Z, x++;
      } else if (C.isPointLight) {
        const Z = e.get(C);
        if (Z.color.copy(C.color).multiplyScalar(C.intensity), Z.distance = C.distance, Z.decay = C.decay, C.castShadow) {
          const he = C.shadow, O = t.get(C);
          O.shadowIntensity = he.intensity, O.shadowBias = he.bias, O.shadowNormalBias = he.normalBias, O.shadowRadius = he.radius, O.shadowMapSize = he.mapSize, O.shadowCameraNear = he.camera.near, O.shadowCameraFar = he.camera.far, r.pointShadow[y] = O, r.pointShadowMap[y] = _e, r.pointShadowMatrix[y] = C.shadow.matrix, R++;
        }
        r.point[y] = Z, y++;
      } else if (C.isHemisphereLight) {
        const Z = e.get(C);
        Z.skyColor.copy(C.color).multiplyScalar(J), Z.groundColor.copy(C.groundColor).multiplyScalar(J), r.hemi[M] = Z, M++;
      }
    }
    x > 0 && (s.has("OES_texture_float_linear") === !0 ? (r.rectAreaLTC1 = Ne.LTC_FLOAT_1, r.rectAreaLTC2 = Ne.LTC_FLOAT_2) : (r.rectAreaLTC1 = Ne.LTC_HALF_1, r.rectAreaLTC2 = Ne.LTC_HALF_2)), r.ambient[0] = m, r.ambient[1] = _, r.ambient[2] = v;
    const Y = r.hash;
    (Y.directionalLength !== S || Y.pointLength !== y || Y.spotLength !== E || Y.rectAreaLength !== x || Y.hemiLength !== M || Y.numDirectionalShadows !== L || Y.numPointShadows !== R || Y.numSpotShadows !== D || Y.numSpotMaps !== ee || Y.numLightProbes !== I) && (r.directional.length = S, r.spot.length = E, r.rectArea.length = x, r.point.length = y, r.hemi.length = M, r.directionalShadow.length = L, r.directionalShadowMap.length = L, r.pointShadow.length = R, r.pointShadowMap.length = R, r.spotShadow.length = D, r.spotShadowMap.length = D, r.directionalShadowMatrix.length = L, r.pointShadowMatrix.length = R, r.spotLightMatrix.length = D + ee - F, r.spotLightMap.length = ee, r.numSpotLightShadowsWithMaps = F, r.numLightProbes = I, Y.directionalLength = S, Y.pointLength = y, Y.spotLength = E, Y.rectAreaLength = x, Y.hemiLength = M, Y.numDirectionalShadows = L, Y.numPointShadows = R, Y.numSpotShadows = D, Y.numSpotMaps = ee, Y.numLightProbes = I, r.version = aE++);
  }
  function f(h, m) {
    let _ = 0, v = 0, S = 0, y = 0, E = 0;
    const x = m.matrixWorldInverse;
    for (let M = 0, L = h.length; M < L; M++) {
      const R = h[M];
      if (R.isDirectionalLight) {
        const D = r.directional[_];
        D.direction.setFromMatrixPosition(R.matrixWorld), o.setFromMatrixPosition(R.target.matrixWorld), D.direction.sub(o), D.direction.transformDirection(x), _++;
      } else if (R.isSpotLight) {
        const D = r.spot[S];
        D.position.setFromMatrixPosition(R.matrixWorld), D.position.applyMatrix4(x), D.direction.setFromMatrixPosition(R.matrixWorld), o.setFromMatrixPosition(R.target.matrixWorld), D.direction.sub(o), D.direction.transformDirection(x), S++;
      } else if (R.isRectAreaLight) {
        const D = r.rectArea[y];
        D.position.setFromMatrixPosition(R.matrixWorld), D.position.applyMatrix4(x), u.identity(), l.copy(R.matrixWorld), l.premultiply(x), u.extractRotation(l), D.halfWidth.set(R.width * 0.5, 0, 0), D.halfHeight.set(0, R.height * 0.5, 0), D.halfWidth.applyMatrix4(u), D.halfHeight.applyMatrix4(u), y++;
      } else if (R.isPointLight) {
        const D = r.point[v];
        D.position.setFromMatrixPosition(R.matrixWorld), D.position.applyMatrix4(x), v++;
      } else if (R.isHemisphereLight) {
        const D = r.hemi[E];
        D.direction.setFromMatrixPosition(R.matrixWorld), D.direction.transformDirection(x), E++;
      }
    }
  }
  return {
    setup: d,
    setupView: f,
    state: r
  };
}
function m0(s) {
  const e = new cE(s), t = [], r = [];
  function o(m) {
    h.camera = m, t.length = 0, r.length = 0;
  }
  function l(m) {
    t.push(m);
  }
  function u(m) {
    r.push(m);
  }
  function d() {
    e.setup(t);
  }
  function f(m) {
    e.setupView(t, m);
  }
  const h = {
    lightsArray: t,
    shadowsArray: r,
    camera: null,
    lights: e,
    transmissionRenderTarget: {}
  };
  return {
    init: o,
    state: h,
    setupLights: d,
    setupLightsView: f,
    pushLight: l,
    pushShadow: u
  };
}
function uE(s) {
  let e = /* @__PURE__ */ new WeakMap();
  function t(o, l = 0) {
    const u = e.get(o);
    let d;
    return u === void 0 ? (d = new m0(s), e.set(o, [d])) : l >= u.length ? (d = new m0(s), u.push(d)) : d = u[l], d;
  }
  function r() {
    e = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: t,
    dispose: r
  };
}
class dE extends cs {
  constructor(e) {
    super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = X_, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
  }
}
class fE extends cs {
  constructor(e) {
    super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
  }
}
const hE = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, pE = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function mE(s, e, t) {
  let r = new zf();
  const o = new Qe(), l = new Qe(), u = new Lt(), d = new dE({ depthPacking: j_ }), f = new fE(), h = {}, m = t.maxTextureSize, _ = { [Lr]: zn, [zn]: Lr, [$n]: $n }, v = new Pn({
    defines: {
      VSM_SAMPLES: 8
    },
    uniforms: {
      shadow_pass: { value: null },
      resolution: { value: new Qe() },
      radius: { value: 4 }
    },
    vertexShader: hE,
    fragmentShader: pE
  }), S = v.clone();
  S.defines.HORIZONTAL_PASS = 1;
  const y = new Ln();
  y.setAttribute(
    "position",
    new Kn(
      new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
      3
    )
  );
  const E = new Ct(y, v), x = this;
  this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = N0;
  let M = this.type;
  this.render = function(F, I, Y) {
    if (x.enabled === !1 || x.autoUpdate === !1 && x.needsUpdate === !1 || F.length === 0) return;
    const ve = s.getRenderTarget(), T = s.getActiveCubeFace(), C = s.getActiveMipmapLevel(), te = s.state;
    te.setBlending(Zi), te.buffers.color.setClear(1, 1, 1, 1), te.buffers.depth.setTest(!0), te.setScissorTest(!1);
    const J = M !== qi && this.type === qi, se = M === qi && this.type !== qi;
    for (let _e = 0, Z = F.length; _e < Z; _e++) {
      const he = F[_e], O = he.shadow;
      if (O === void 0) {
        console.warn("THREE.WebGLShadowMap:", he, "has no shadow.");
        continue;
      }
      if (O.autoUpdate === !1 && O.needsUpdate === !1) continue;
      o.copy(O.mapSize);
      const ue = O.getFrameExtents();
      if (o.multiply(ue), l.copy(O.mapSize), (o.x > m || o.y > m) && (o.x > m && (l.x = Math.floor(m / ue.x), o.x = l.x * ue.x, O.mapSize.x = l.x), o.y > m && (l.y = Math.floor(m / ue.y), o.y = l.y * ue.y, O.mapSize.y = l.y)), O.map === null || J === !0 || se === !0) {
        const U = this.type !== qi ? { minFilter: Bn, magFilter: Bn } : {};
        O.map !== null && O.map.dispose(), O.map = new oi(o.x, o.y, U), O.map.texture.name = he.name + ".shadowMap", O.camera.updateProjectionMatrix();
      }
      s.setRenderTarget(O.map), s.clear();
      const ae = O.getViewportCount();
      for (let U = 0; U < ae; U++) {
        const oe = O.getViewport(U);
        u.set(
          l.x * oe.x,
          l.y * oe.y,
          l.x * oe.z,
          l.y * oe.w
        ), te.viewport(u), O.updateMatrices(he, U), r = O.getFrustum(), D(I, Y, O.camera, he, this.type);
      }
      O.isPointLightShadow !== !0 && this.type === qi && L(O, Y), O.needsUpdate = !1;
    }
    M = this.type, x.needsUpdate = !1, s.setRenderTarget(ve, T, C);
  };
  function L(F, I) {
    const Y = e.update(E);
    v.defines.VSM_SAMPLES !== F.blurSamples && (v.defines.VSM_SAMPLES = F.blurSamples, S.defines.VSM_SAMPLES = F.blurSamples, v.needsUpdate = !0, S.needsUpdate = !0), F.mapPass === null && (F.mapPass = new oi(o.x, o.y)), v.uniforms.shadow_pass.value = F.map.texture, v.uniforms.resolution.value = F.mapSize, v.uniforms.radius.value = F.radius, s.setRenderTarget(F.mapPass), s.clear(), s.renderBufferDirect(I, null, Y, v, E, null), S.uniforms.shadow_pass.value = F.mapPass.texture, S.uniforms.resolution.value = F.mapSize, S.uniforms.radius.value = F.radius, s.setRenderTarget(F.map), s.clear(), s.renderBufferDirect(I, null, Y, S, E, null);
  }
  function R(F, I, Y, ve) {
    let T = null;
    const C = Y.isPointLight === !0 ? F.customDistanceMaterial : F.customDepthMaterial;
    if (C !== void 0)
      T = C;
    else if (T = Y.isPointLight === !0 ? f : d, s.localClippingEnabled && I.clipShadows === !0 && Array.isArray(I.clippingPlanes) && I.clippingPlanes.length !== 0 || I.displacementMap && I.displacementScale !== 0 || I.alphaMap && I.alphaTest > 0 || I.map && I.alphaTest > 0) {
      const te = T.uuid, J = I.uuid;
      let se = h[te];
      se === void 0 && (se = {}, h[te] = se);
      let _e = se[J];
      _e === void 0 && (_e = T.clone(), se[J] = _e, I.addEventListener("dispose", ee)), T = _e;
    }
    if (T.visible = I.visible, T.wireframe = I.wireframe, ve === qi ? T.side = I.shadowSide !== null ? I.shadowSide : I.side : T.side = I.shadowSide !== null ? I.shadowSide : _[I.side], T.alphaMap = I.alphaMap, T.alphaTest = I.alphaTest, T.map = I.map, T.clipShadows = I.clipShadows, T.clippingPlanes = I.clippingPlanes, T.clipIntersection = I.clipIntersection, T.displacementMap = I.displacementMap, T.displacementScale = I.displacementScale, T.displacementBias = I.displacementBias, T.wireframeLinewidth = I.wireframeLinewidth, T.linewidth = I.linewidth, Y.isPointLight === !0 && T.isMeshDistanceMaterial === !0) {
      const te = s.properties.get(T);
      te.light = Y;
    }
    return T;
  }
  function D(F, I, Y, ve, T) {
    if (F.visible === !1) return;
    if (F.layers.test(I.layers) && (F.isMesh || F.isLine || F.isPoints) && (F.castShadow || F.receiveShadow && T === qi) && (!F.frustumCulled || r.intersectsObject(F))) {
      F.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse, F.matrixWorld);
      const J = e.update(F), se = F.material;
      if (Array.isArray(se)) {
        const _e = J.groups;
        for (let Z = 0, he = _e.length; Z < he; Z++) {
          const O = _e[Z], ue = se[O.materialIndex];
          if (ue && ue.visible) {
            const ae = R(F, ue, ve, T);
            F.onBeforeShadow(s, F, I, Y, J, ae, O), s.renderBufferDirect(Y, null, J, ae, F, O), F.onAfterShadow(s, F, I, Y, J, ae, O);
          }
        }
      } else if (se.visible) {
        const _e = R(F, se, ve, T);
        F.onBeforeShadow(s, F, I, Y, J, _e, null), s.renderBufferDirect(Y, null, J, _e, F, null), F.onAfterShadow(s, F, I, Y, J, _e, null);
      }
    }
    const te = F.children;
    for (let J = 0, se = te.length; J < se; J++)
      D(te[J], I, Y, ve, T);
  }
  function ee(F) {
    F.target.removeEventListener("dispose", ee);
    for (const Y in h) {
      const ve = h[Y], T = F.target.uuid;
      T in ve && (ve[T].dispose(), delete ve[T]);
    }
  }
}
const gE = {
  [zd]: Hd,
  [Vd]: Xd,
  [Gd]: jd,
  [lo]: Wd,
  [Hd]: zd,
  [Xd]: Vd,
  [jd]: Gd,
  [Wd]: lo
};
function vE(s) {
  function e() {
    let V = !1;
    const Ie = new Lt();
    let le = null;
    const ge = new Lt(0, 0, 0, 0);
    return {
      setMask: function(De) {
        le !== De && !V && (s.colorMask(De, De, De, De), le = De);
      },
      setLocked: function(De) {
        V = De;
      },
      setClear: function(De, ze, _t, zt, cn) {
        cn === !0 && (De *= zt, ze *= zt, _t *= zt), Ie.set(De, ze, _t, zt), ge.equals(Ie) === !1 && (s.clearColor(De, ze, _t, zt), ge.copy(Ie));
      },
      reset: function() {
        V = !1, le = null, ge.set(-1, 0, 0, 0);
      }
    };
  }
  function t() {
    let V = !1, Ie = !1, le = null, ge = null, De = null;
    return {
      setReversed: function(ze) {
        Ie = ze;
      },
      setTest: function(ze) {
        ze ? pe(s.DEPTH_TEST) : Me(s.DEPTH_TEST);
      },
      setMask: function(ze) {
        le !== ze && !V && (s.depthMask(ze), le = ze);
      },
      setFunc: function(ze) {
        if (Ie && (ze = gE[ze]), ge !== ze) {
          switch (ze) {
            case zd:
              s.depthFunc(s.NEVER);
              break;
            case Hd:
              s.depthFunc(s.ALWAYS);
              break;
            case Vd:
              s.depthFunc(s.LESS);
              break;
            case lo:
              s.depthFunc(s.LEQUAL);
              break;
            case Gd:
              s.depthFunc(s.EQUAL);
              break;
            case Wd:
              s.depthFunc(s.GEQUAL);
              break;
            case Xd:
              s.depthFunc(s.GREATER);
              break;
            case jd:
              s.depthFunc(s.NOTEQUAL);
              break;
            default:
              s.depthFunc(s.LEQUAL);
          }
          ge = ze;
        }
      },
      setLocked: function(ze) {
        V = ze;
      },
      setClear: function(ze) {
        De !== ze && (s.clearDepth(ze), De = ze);
      },
      reset: function() {
        V = !1, le = null, ge = null, De = null;
      }
    };
  }
  function r() {
    let V = !1, Ie = null, le = null, ge = null, De = null, ze = null, _t = null, zt = null, cn = null;
    return {
      setTest: function(xt) {
        V || (xt ? pe(s.STENCIL_TEST) : Me(s.STENCIL_TEST));
      },
      setMask: function(xt) {
        Ie !== xt && !V && (s.stencilMask(xt), Ie = xt);
      },
      setFunc: function(xt, nn, Zn) {
        (le !== xt || ge !== nn || De !== Zn) && (s.stencilFunc(xt, nn, Zn), le = xt, ge = nn, De = Zn);
      },
      setOp: function(xt, nn, Zn) {
        (ze !== xt || _t !== nn || zt !== Zn) && (s.stencilOp(xt, nn, Zn), ze = xt, _t = nn, zt = Zn);
      },
      setLocked: function(xt) {
        V = xt;
      },
      setClear: function(xt) {
        cn !== xt && (s.clearStencil(xt), cn = xt);
      },
      reset: function() {
        V = !1, Ie = null, le = null, ge = null, De = null, ze = null, _t = null, zt = null, cn = null;
      }
    };
  }
  const o = new e(), l = new t(), u = new r(), d = /* @__PURE__ */ new WeakMap(), f = /* @__PURE__ */ new WeakMap();
  let h = {}, m = {}, _ = /* @__PURE__ */ new WeakMap(), v = [], S = null, y = !1, E = null, x = null, M = null, L = null, R = null, D = null, ee = null, F = new lt(0, 0, 0), I = 0, Y = !1, ve = null, T = null, C = null, te = null, J = null;
  const se = s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let _e = !1, Z = 0;
  const he = s.getParameter(s.VERSION);
  he.indexOf("WebGL") !== -1 ? (Z = parseFloat(/^WebGL (\d)/.exec(he)[1]), _e = Z >= 1) : he.indexOf("OpenGL ES") !== -1 && (Z = parseFloat(/^OpenGL ES (\d)/.exec(he)[1]), _e = Z >= 2);
  let O = null, ue = {};
  const ae = s.getParameter(s.SCISSOR_BOX), U = s.getParameter(s.VIEWPORT), oe = new Lt().fromArray(ae), Fe = new Lt().fromArray(U);
  function K(V, Ie, le, ge) {
    const De = new Uint8Array(4), ze = s.createTexture();
    s.bindTexture(V, ze), s.texParameteri(V, s.TEXTURE_MIN_FILTER, s.NEAREST), s.texParameteri(V, s.TEXTURE_MAG_FILTER, s.NEAREST);
    for (let _t = 0; _t < le; _t++)
      V === s.TEXTURE_3D || V === s.TEXTURE_2D_ARRAY ? s.texImage3D(Ie, 0, s.RGBA, 1, 1, ge, 0, s.RGBA, s.UNSIGNED_BYTE, De) : s.texImage2D(Ie + _t, 0, s.RGBA, 1, 1, 0, s.RGBA, s.UNSIGNED_BYTE, De);
    return ze;
  }
  const ce = {};
  ce[s.TEXTURE_2D] = K(s.TEXTURE_2D, s.TEXTURE_2D, 1), ce[s.TEXTURE_CUBE_MAP] = K(s.TEXTURE_CUBE_MAP, s.TEXTURE_CUBE_MAP_POSITIVE_X, 6), ce[s.TEXTURE_2D_ARRAY] = K(s.TEXTURE_2D_ARRAY, s.TEXTURE_2D_ARRAY, 1, 1), ce[s.TEXTURE_3D] = K(s.TEXTURE_3D, s.TEXTURE_3D, 1, 1), o.setClear(0, 0, 0, 1), l.setClear(1), u.setClear(0), pe(s.DEPTH_TEST), l.setFunc(lo), ht(!1), ct(wm), pe(s.CULL_FACE), B(Zi);
  function pe(V) {
    h[V] !== !0 && (s.enable(V), h[V] = !0);
  }
  function Me(V) {
    h[V] !== !1 && (s.disable(V), h[V] = !1);
  }
  function Re(V, Ie) {
    return m[V] !== Ie ? (s.bindFramebuffer(V, Ie), m[V] = Ie, V === s.DRAW_FRAMEBUFFER && (m[s.FRAMEBUFFER] = Ie), V === s.FRAMEBUFFER && (m[s.DRAW_FRAMEBUFFER] = Ie), !0) : !1;
  }
  function Le(V, Ie) {
    let le = v, ge = !1;
    if (V) {
      le = _.get(Ie), le === void 0 && (le = [], _.set(Ie, le));
      const De = V.textures;
      if (le.length !== De.length || le[0] !== s.COLOR_ATTACHMENT0) {
        for (let ze = 0, _t = De.length; ze < _t; ze++)
          le[ze] = s.COLOR_ATTACHMENT0 + ze;
        le.length = De.length, ge = !0;
      }
    } else
      le[0] !== s.BACK && (le[0] = s.BACK, ge = !0);
    ge && s.drawBuffers(le);
  }
  function Je(V) {
    return S !== V ? (s.useProgram(V), S = V, !0) : !1;
  }
  const ft = {
    [ns]: s.FUNC_ADD,
    [w_]: s.FUNC_SUBTRACT,
    [T_]: s.FUNC_REVERSE_SUBTRACT
  };
  ft[b_] = s.MIN, ft[A_] = s.MAX;
  const at = {
    [C_]: s.ZERO,
    [R_]: s.ONE,
    [P_]: s.SRC_COLOR,
    [Od]: s.SRC_ALPHA,
    [F_]: s.SRC_ALPHA_SATURATE,
    [I_]: s.DST_COLOR,
    [D_]: s.DST_ALPHA,
    [L_]: s.ONE_MINUS_SRC_COLOR,
    [Bd]: s.ONE_MINUS_SRC_ALPHA,
    [U_]: s.ONE_MINUS_DST_COLOR,
    [N_]: s.ONE_MINUS_DST_ALPHA,
    [k_]: s.CONSTANT_COLOR,
    [O_]: s.ONE_MINUS_CONSTANT_COLOR,
    [B_]: s.CONSTANT_ALPHA,
    [z_]: s.ONE_MINUS_CONSTANT_ALPHA
  };
  function B(V, Ie, le, ge, De, ze, _t, zt, cn, xt) {
    if (V === Zi) {
      y === !0 && (Me(s.BLEND), y = !1);
      return;
    }
    if (y === !1 && (pe(s.BLEND), y = !0), V !== E_) {
      if (V !== E || xt !== Y) {
        if ((x !== ns || R !== ns) && (s.blendEquation(s.FUNC_ADD), x = ns, R = ns), xt)
          switch (V) {
            case ro:
              s.blendFuncSeparate(s.ONE, s.ONE_MINUS_SRC_ALPHA, s.ONE, s.ONE_MINUS_SRC_ALPHA);
              break;
            case kd:
              s.blendFunc(s.ONE, s.ONE);
              break;
            case Tm:
              s.blendFuncSeparate(s.ZERO, s.ONE_MINUS_SRC_COLOR, s.ZERO, s.ONE);
              break;
            case bm:
              s.blendFuncSeparate(s.ZERO, s.SRC_COLOR, s.ZERO, s.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", V);
              break;
          }
        else
          switch (V) {
            case ro:
              s.blendFuncSeparate(s.SRC_ALPHA, s.ONE_MINUS_SRC_ALPHA, s.ONE, s.ONE_MINUS_SRC_ALPHA);
              break;
            case kd:
              s.blendFunc(s.SRC_ALPHA, s.ONE);
              break;
            case Tm:
              s.blendFuncSeparate(s.ZERO, s.ONE_MINUS_SRC_COLOR, s.ZERO, s.ONE);
              break;
            case bm:
              s.blendFunc(s.ZERO, s.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", V);
              break;
          }
        M = null, L = null, D = null, ee = null, F.set(0, 0, 0), I = 0, E = V, Y = xt;
      }
      return;
    }
    De = De || Ie, ze = ze || le, _t = _t || ge, (Ie !== x || De !== R) && (s.blendEquationSeparate(ft[Ie], ft[De]), x = Ie, R = De), (le !== M || ge !== L || ze !== D || _t !== ee) && (s.blendFuncSeparate(at[le], at[ge], at[ze], at[_t]), M = le, L = ge, D = ze, ee = _t), (zt.equals(F) === !1 || cn !== I) && (s.blendColor(zt.r, zt.g, zt.b, cn), F.copy(zt), I = cn), E = V, Y = !1;
  }
  function qt(V, Ie) {
    V.side === $n ? Me(s.CULL_FACE) : pe(s.CULL_FACE);
    let le = V.side === zn;
    Ie && (le = !le), ht(le), V.blending === ro && V.transparent === !1 ? B(Zi) : B(V.blending, V.blendEquation, V.blendSrc, V.blendDst, V.blendEquationAlpha, V.blendSrcAlpha, V.blendDstAlpha, V.blendColor, V.blendAlpha, V.premultipliedAlpha), l.setFunc(V.depthFunc), l.setTest(V.depthTest), l.setMask(V.depthWrite), o.setMask(V.colorWrite);
    const ge = V.stencilWrite;
    u.setTest(ge), ge && (u.setMask(V.stencilWriteMask), u.setFunc(V.stencilFunc, V.stencilRef, V.stencilFuncMask), u.setOp(V.stencilFail, V.stencilZFail, V.stencilZPass)), Ce(V.polygonOffset, V.polygonOffsetFactor, V.polygonOffsetUnits), V.alphaToCoverage === !0 ? pe(s.SAMPLE_ALPHA_TO_COVERAGE) : Me(s.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function ht(V) {
    ve !== V && (V ? s.frontFace(s.CW) : s.frontFace(s.CCW), ve = V);
  }
  function ct(V) {
    V !== S_ ? (pe(s.CULL_FACE), V !== T && (V === wm ? s.cullFace(s.BACK) : V === M_ ? s.cullFace(s.FRONT) : s.cullFace(s.FRONT_AND_BACK))) : Me(s.CULL_FACE), T = V;
  }
  function Ze(V) {
    V !== C && (_e && s.lineWidth(V), C = V);
  }
  function Ce(V, Ie, le) {
    V ? (pe(s.POLYGON_OFFSET_FILL), (te !== Ie || J !== le) && (s.polygonOffset(Ie, le), te = Ie, J = le)) : Me(s.POLYGON_OFFSET_FILL);
  }
  function ke(V) {
    V ? pe(s.SCISSOR_TEST) : Me(s.SCISSOR_TEST);
  }
  function P(V) {
    V === void 0 && (V = s.TEXTURE0 + se - 1), O !== V && (s.activeTexture(V), O = V);
  }
  function b(V, Ie, le) {
    le === void 0 && (O === null ? le = s.TEXTURE0 + se - 1 : le = O);
    let ge = ue[le];
    ge === void 0 && (ge = { type: void 0, texture: void 0 }, ue[le] = ge), (ge.type !== V || ge.texture !== Ie) && (O !== le && (s.activeTexture(le), O = le), s.bindTexture(V, Ie || ce[V]), ge.type = V, ge.texture = Ie);
  }
  function $() {
    const V = ue[O];
    V !== void 0 && V.type !== void 0 && (s.bindTexture(V.type, null), V.type = void 0, V.texture = void 0);
  }
  function fe() {
    try {
      s.compressedTexImage2D.apply(s, arguments);
    } catch (V) {
      console.error("THREE.WebGLState:", V);
    }
  }
  function xe() {
    try {
      s.compressedTexImage3D.apply(s, arguments);
    } catch (V) {
      console.error("THREE.WebGLState:", V);
    }
  }
  function de() {
    try {
      s.texSubImage2D.apply(s, arguments);
    } catch (V) {
      console.error("THREE.WebGLState:", V);
    }
  }
  function Xe() {
    try {
      s.texSubImage3D.apply(s, arguments);
    } catch (V) {
      console.error("THREE.WebGLState:", V);
    }
  }
  function Pe() {
    try {
      s.compressedTexSubImage2D.apply(s, arguments);
    } catch (V) {
      console.error("THREE.WebGLState:", V);
    }
  }
  function Oe() {
    try {
      s.compressedTexSubImage3D.apply(s, arguments);
    } catch (V) {
      console.error("THREE.WebGLState:", V);
    }
  }
  function vt() {
    try {
      s.texStorage2D.apply(s, arguments);
    } catch (V) {
      console.error("THREE.WebGLState:", V);
    }
  }
  function we() {
    try {
      s.texStorage3D.apply(s, arguments);
    } catch (V) {
      console.error("THREE.WebGLState:", V);
    }
  }
  function Ue() {
    try {
      s.texImage2D.apply(s, arguments);
    } catch (V) {
      console.error("THREE.WebGLState:", V);
    }
  }
  function rt() {
    try {
      s.texImage3D.apply(s, arguments);
    } catch (V) {
      console.error("THREE.WebGLState:", V);
    }
  }
  function it(V) {
    oe.equals(V) === !1 && (s.scissor(V.x, V.y, V.z, V.w), oe.copy(V));
  }
  function H(V) {
    Fe.equals(V) === !1 && (s.viewport(V.x, V.y, V.z, V.w), Fe.copy(V));
  }
  function me(V, Ie) {
    let le = f.get(Ie);
    le === void 0 && (le = /* @__PURE__ */ new WeakMap(), f.set(Ie, le));
    let ge = le.get(V);
    ge === void 0 && (ge = s.getUniformBlockIndex(Ie, V.name), le.set(V, ge));
  }
  function $e(V, Ie) {
    const ge = f.get(Ie).get(V);
    d.get(Ie) !== ge && (s.uniformBlockBinding(Ie, ge, V.__bindingPointIndex), d.set(Ie, ge));
  }
  function pt() {
    s.disable(s.BLEND), s.disable(s.CULL_FACE), s.disable(s.DEPTH_TEST), s.disable(s.POLYGON_OFFSET_FILL), s.disable(s.SCISSOR_TEST), s.disable(s.STENCIL_TEST), s.disable(s.SAMPLE_ALPHA_TO_COVERAGE), s.blendEquation(s.FUNC_ADD), s.blendFunc(s.ONE, s.ZERO), s.blendFuncSeparate(s.ONE, s.ZERO, s.ONE, s.ZERO), s.blendColor(0, 0, 0, 0), s.colorMask(!0, !0, !0, !0), s.clearColor(0, 0, 0, 0), s.depthMask(!0), s.depthFunc(s.LESS), s.clearDepth(1), s.stencilMask(4294967295), s.stencilFunc(s.ALWAYS, 0, 4294967295), s.stencilOp(s.KEEP, s.KEEP, s.KEEP), s.clearStencil(0), s.cullFace(s.BACK), s.frontFace(s.CCW), s.polygonOffset(0, 0), s.activeTexture(s.TEXTURE0), s.bindFramebuffer(s.FRAMEBUFFER, null), s.bindFramebuffer(s.DRAW_FRAMEBUFFER, null), s.bindFramebuffer(s.READ_FRAMEBUFFER, null), s.useProgram(null), s.lineWidth(1), s.scissor(0, 0, s.canvas.width, s.canvas.height), s.viewport(0, 0, s.canvas.width, s.canvas.height), h = {}, O = null, ue = {}, m = {}, _ = /* @__PURE__ */ new WeakMap(), v = [], S = null, y = !1, E = null, x = null, M = null, L = null, R = null, D = null, ee = null, F = new lt(0, 0, 0), I = 0, Y = !1, ve = null, T = null, C = null, te = null, J = null, oe.set(0, 0, s.canvas.width, s.canvas.height), Fe.set(0, 0, s.canvas.width, s.canvas.height), o.reset(), l.reset(), u.reset();
  }
  return {
    buffers: {
      color: o,
      depth: l,
      stencil: u
    },
    enable: pe,
    disable: Me,
    bindFramebuffer: Re,
    drawBuffers: Le,
    useProgram: Je,
    setBlending: B,
    setMaterial: qt,
    setFlipSided: ht,
    setCullFace: ct,
    setLineWidth: Ze,
    setPolygonOffset: Ce,
    setScissorTest: ke,
    activeTexture: P,
    bindTexture: b,
    unbindTexture: $,
    compressedTexImage2D: fe,
    compressedTexImage3D: xe,
    texImage2D: Ue,
    texImage3D: rt,
    updateUBOMapping: me,
    uniformBlockBinding: $e,
    texStorage2D: vt,
    texStorage3D: we,
    texSubImage2D: de,
    texSubImage3D: Xe,
    compressedTexSubImage2D: Pe,
    compressedTexSubImage3D: Oe,
    scissor: it,
    viewport: H,
    reset: pt
  };
}
function g0(s, e, t, r) {
  const o = _E(r);
  switch (t) {
    // https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml
    case X0:
      return s * e;
    case Y0:
      return s * e;
    case q0:
      return s * e * 2;
    case If:
      return s * e / o.components * o.byteLength;
    case Uf:
      return s * e / o.components * o.byteLength;
    case $0:
      return s * e * 2 / o.components * o.byteLength;
    case Ff:
      return s * e * 2 / o.components * o.byteLength;
    case j0:
      return s * e * 3 / o.components * o.byteLength;
    case Si:
      return s * e * 4 / o.components * o.byteLength;
    case kf:
      return s * e * 4 / o.components * o.byteLength;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_s3tc_srgb/
    case Ql:
    case Jl:
      return Math.floor((s + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case ec:
    case tc:
      return Math.floor((s + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_pvrtc/
    case Qd:
    case ef:
      return Math.max(s, 16) * Math.max(e, 8) / 4;
    case Zd:
    case Jd:
      return Math.max(s, 8) * Math.max(e, 8) / 2;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_etc/
    case tf:
    case nf:
      return Math.floor((s + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case rf:
      return Math.floor((s + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_astc/
    case sf:
      return Math.floor((s + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case of:
      return Math.floor((s + 4) / 5) * Math.floor((e + 3) / 4) * 16;
    case af:
      return Math.floor((s + 4) / 5) * Math.floor((e + 4) / 5) * 16;
    case lf:
      return Math.floor((s + 5) / 6) * Math.floor((e + 4) / 5) * 16;
    case cf:
      return Math.floor((s + 5) / 6) * Math.floor((e + 5) / 6) * 16;
    case uf:
      return Math.floor((s + 7) / 8) * Math.floor((e + 4) / 5) * 16;
    case df:
      return Math.floor((s + 7) / 8) * Math.floor((e + 5) / 6) * 16;
    case ff:
      return Math.floor((s + 7) / 8) * Math.floor((e + 7) / 8) * 16;
    case hf:
      return Math.floor((s + 9) / 10) * Math.floor((e + 4) / 5) * 16;
    case pf:
      return Math.floor((s + 9) / 10) * Math.floor((e + 5) / 6) * 16;
    case mf:
      return Math.floor((s + 9) / 10) * Math.floor((e + 7) / 8) * 16;
    case gf:
      return Math.floor((s + 9) / 10) * Math.floor((e + 9) / 10) * 16;
    case vf:
      return Math.floor((s + 11) / 12) * Math.floor((e + 9) / 10) * 16;
    case _f:
      return Math.floor((s + 11) / 12) * Math.floor((e + 11) / 12) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_bptc/
    case nc:
    case xf:
    case yf:
      return Math.ceil(s / 4) * Math.ceil(e / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_rgtc/
    case K0:
    case Sf:
      return Math.ceil(s / 4) * Math.ceil(e / 4) * 8;
    case Mf:
    case Ef:
      return Math.ceil(s / 4) * Math.ceil(e / 4) * 16;
  }
  throw new Error(
    `Unable to determine texture byte length for ${t} format.`
  );
}
function _E(s) {
  switch (s) {
    case Ji:
    case V0:
      return { byteLength: 1, components: 1 };
    case _a:
    case G0:
    case Ri:
      return { byteLength: 2, components: 1 };
    case Df:
    case Nf:
      return { byteLength: 2, components: 4 };
    case os:
    case Lf:
    case Ci:
      return { byteLength: 4, components: 1 };
    case W0:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${s}.`);
}
function xE(s, e, t, r, o, l, u) {
  const d = e.has("WEBGL_multisampled_render_to_texture") ? e.get("WEBGL_multisampled_render_to_texture") : null, f = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), h = new Qe(), m = /* @__PURE__ */ new WeakMap();
  let _;
  const v = /* @__PURE__ */ new WeakMap();
  let S = !1;
  try {
    S = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function y(P, b) {
    return S ? (
      // eslint-disable-next-line compat/compat
      new OffscreenCanvas(P, b)
    ) : dc("canvas");
  }
  function E(P, b, $) {
    let fe = 1;
    const xe = ke(P);
    if ((xe.width > $ || xe.height > $) && (fe = $ / Math.max(xe.width, xe.height)), fe < 1)
      if (typeof HTMLImageElement < "u" && P instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && P instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && P instanceof ImageBitmap || typeof VideoFrame < "u" && P instanceof VideoFrame) {
        const de = Math.floor(fe * xe.width), Xe = Math.floor(fe * xe.height);
        _ === void 0 && (_ = y(de, Xe));
        const Pe = b ? y(de, Xe) : _;
        return Pe.width = de, Pe.height = Xe, Pe.getContext("2d").drawImage(P, 0, 0, de, Xe), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + xe.width + "x" + xe.height + ") to (" + de + "x" + Xe + ")."), Pe;
      } else
        return "data" in P && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + xe.width + "x" + xe.height + ")."), P;
    return P;
  }
  function x(P) {
    return P.generateMipmaps && P.minFilter !== Bn && P.minFilter !== xi;
  }
  function M(P) {
    s.generateMipmap(P);
  }
  function L(P, b, $, fe, xe = !1) {
    if (P !== null) {
      if (s[P] !== void 0) return s[P];
      console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + P + "'");
    }
    let de = b;
    if (b === s.RED && ($ === s.FLOAT && (de = s.R32F), $ === s.HALF_FLOAT && (de = s.R16F), $ === s.UNSIGNED_BYTE && (de = s.R8)), b === s.RED_INTEGER && ($ === s.UNSIGNED_BYTE && (de = s.R8UI), $ === s.UNSIGNED_SHORT && (de = s.R16UI), $ === s.UNSIGNED_INT && (de = s.R32UI), $ === s.BYTE && (de = s.R8I), $ === s.SHORT && (de = s.R16I), $ === s.INT && (de = s.R32I)), b === s.RG && ($ === s.FLOAT && (de = s.RG32F), $ === s.HALF_FLOAT && (de = s.RG16F), $ === s.UNSIGNED_BYTE && (de = s.RG8)), b === s.RG_INTEGER && ($ === s.UNSIGNED_BYTE && (de = s.RG8UI), $ === s.UNSIGNED_SHORT && (de = s.RG16UI), $ === s.UNSIGNED_INT && (de = s.RG32UI), $ === s.BYTE && (de = s.RG8I), $ === s.SHORT && (de = s.RG16I), $ === s.INT && (de = s.RG32I)), b === s.RGB_INTEGER && ($ === s.UNSIGNED_BYTE && (de = s.RGB8UI), $ === s.UNSIGNED_SHORT && (de = s.RGB16UI), $ === s.UNSIGNED_INT && (de = s.RGB32UI), $ === s.BYTE && (de = s.RGB8I), $ === s.SHORT && (de = s.RGB16I), $ === s.INT && (de = s.RGB32I)), b === s.RGBA_INTEGER && ($ === s.UNSIGNED_BYTE && (de = s.RGBA8UI), $ === s.UNSIGNED_SHORT && (de = s.RGBA16UI), $ === s.UNSIGNED_INT && (de = s.RGBA32UI), $ === s.BYTE && (de = s.RGBA8I), $ === s.SHORT && (de = s.RGBA16I), $ === s.INT && (de = s.RGBA32I)), b === s.RGB && $ === s.UNSIGNED_INT_5_9_9_9_REV && (de = s.RGB9_E5), b === s.RGBA) {
      const Xe = xe ? ac : Tt.getTransfer(fe);
      $ === s.FLOAT && (de = s.RGBA32F), $ === s.HALF_FLOAT && (de = s.RGBA16F), $ === s.UNSIGNED_BYTE && (de = Xe === Ut ? s.SRGB8_ALPHA8 : s.RGBA8), $ === s.UNSIGNED_SHORT_4_4_4_4 && (de = s.RGBA4), $ === s.UNSIGNED_SHORT_5_5_5_1 && (de = s.RGB5_A1);
    }
    return (de === s.R16F || de === s.R32F || de === s.RG16F || de === s.RG32F || de === s.RGBA16F || de === s.RGBA32F) && e.get("EXT_color_buffer_float"), de;
  }
  function R(P, b) {
    let $;
    return P ? b === null || b === os || b === fo ? $ = s.DEPTH24_STENCIL8 : b === Ci ? $ = s.DEPTH32F_STENCIL8 : b === _a && ($ = s.DEPTH24_STENCIL8, console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : b === null || b === os || b === fo ? $ = s.DEPTH_COMPONENT24 : b === Ci ? $ = s.DEPTH_COMPONENT32F : b === _a && ($ = s.DEPTH_COMPONENT16), $;
  }
  function D(P, b) {
    return x(P) === !0 || P.isFramebufferTexture && P.minFilter !== Bn && P.minFilter !== xi ? Math.log2(Math.max(b.width, b.height)) + 1 : P.mipmaps !== void 0 && P.mipmaps.length > 0 ? P.mipmaps.length : P.isCompressedTexture && Array.isArray(P.image) ? b.mipmaps.length : 1;
  }
  function ee(P) {
    const b = P.target;
    b.removeEventListener("dispose", ee), I(b), b.isVideoTexture && m.delete(b);
  }
  function F(P) {
    const b = P.target;
    b.removeEventListener("dispose", F), ve(b);
  }
  function I(P) {
    const b = r.get(P);
    if (b.__webglInit === void 0) return;
    const $ = P.source, fe = v.get($);
    if (fe) {
      const xe = fe[b.__cacheKey];
      xe.usedTimes--, xe.usedTimes === 0 && Y(P), Object.keys(fe).length === 0 && v.delete($);
    }
    r.remove(P);
  }
  function Y(P) {
    const b = r.get(P);
    s.deleteTexture(b.__webglTexture);
    const $ = P.source, fe = v.get($);
    delete fe[b.__cacheKey], u.memory.textures--;
  }
  function ve(P) {
    const b = r.get(P);
    if (P.depthTexture && P.depthTexture.dispose(), P.isWebGLCubeRenderTarget)
      for (let fe = 0; fe < 6; fe++) {
        if (Array.isArray(b.__webglFramebuffer[fe]))
          for (let xe = 0; xe < b.__webglFramebuffer[fe].length; xe++) s.deleteFramebuffer(b.__webglFramebuffer[fe][xe]);
        else
          s.deleteFramebuffer(b.__webglFramebuffer[fe]);
        b.__webglDepthbuffer && s.deleteRenderbuffer(b.__webglDepthbuffer[fe]);
      }
    else {
      if (Array.isArray(b.__webglFramebuffer))
        for (let fe = 0; fe < b.__webglFramebuffer.length; fe++) s.deleteFramebuffer(b.__webglFramebuffer[fe]);
      else
        s.deleteFramebuffer(b.__webglFramebuffer);
      if (b.__webglDepthbuffer && s.deleteRenderbuffer(b.__webglDepthbuffer), b.__webglMultisampledFramebuffer && s.deleteFramebuffer(b.__webglMultisampledFramebuffer), b.__webglColorRenderbuffer)
        for (let fe = 0; fe < b.__webglColorRenderbuffer.length; fe++)
          b.__webglColorRenderbuffer[fe] && s.deleteRenderbuffer(b.__webglColorRenderbuffer[fe]);
      b.__webglDepthRenderbuffer && s.deleteRenderbuffer(b.__webglDepthRenderbuffer);
    }
    const $ = P.textures;
    for (let fe = 0, xe = $.length; fe < xe; fe++) {
      const de = r.get($[fe]);
      de.__webglTexture && (s.deleteTexture(de.__webglTexture), u.memory.textures--), r.remove($[fe]);
    }
    r.remove(P);
  }
  let T = 0;
  function C() {
    T = 0;
  }
  function te() {
    const P = T;
    return P >= o.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + P + " texture units while this GPU supports only " + o.maxTextures), T += 1, P;
  }
  function J(P) {
    const b = [];
    return b.push(P.wrapS), b.push(P.wrapT), b.push(P.wrapR || 0), b.push(P.magFilter), b.push(P.minFilter), b.push(P.anisotropy), b.push(P.internalFormat), b.push(P.format), b.push(P.type), b.push(P.generateMipmaps), b.push(P.premultiplyAlpha), b.push(P.flipY), b.push(P.unpackAlignment), b.push(P.colorSpace), b.join();
  }
  function se(P, b) {
    const $ = r.get(P);
    if (P.isVideoTexture && Ze(P), P.isRenderTargetTexture === !1 && P.version > 0 && $.__version !== P.version) {
      const fe = P.image;
      if (fe === null)
        console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
      else if (fe.complete === !1)
        console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        Fe($, P, b);
        return;
      }
    }
    t.bindTexture(s.TEXTURE_2D, $.__webglTexture, s.TEXTURE0 + b);
  }
  function _e(P, b) {
    const $ = r.get(P);
    if (P.version > 0 && $.__version !== P.version) {
      Fe($, P, b);
      return;
    }
    t.bindTexture(s.TEXTURE_2D_ARRAY, $.__webglTexture, s.TEXTURE0 + b);
  }
  function Z(P, b) {
    const $ = r.get(P);
    if (P.version > 0 && $.__version !== P.version) {
      Fe($, P, b);
      return;
    }
    t.bindTexture(s.TEXTURE_3D, $.__webglTexture, s.TEXTURE0 + b);
  }
  function he(P, b) {
    const $ = r.get(P);
    if (P.version > 0 && $.__version !== P.version) {
      K($, P, b);
      return;
    }
    t.bindTexture(s.TEXTURE_CUBE_MAP, $.__webglTexture, s.TEXTURE0 + b);
  }
  const O = {
    [$d]: s.REPEAT,
    [rs]: s.CLAMP_TO_EDGE,
    [Kd]: s.MIRRORED_REPEAT
  }, ue = {
    [Bn]: s.NEAREST,
    [W_]: s.NEAREST_MIPMAP_NEAREST,
    [Tl]: s.NEAREST_MIPMAP_LINEAR,
    [xi]: s.LINEAR,
    [Ju]: s.LINEAR_MIPMAP_NEAREST,
    [ss]: s.LINEAR_MIPMAP_LINEAR
  }, ae = {
    [q_]: s.NEVER,
    [ex]: s.ALWAYS,
    [$_]: s.LESS,
    [Q0]: s.LEQUAL,
    [K_]: s.EQUAL,
    [J_]: s.GEQUAL,
    [Z_]: s.GREATER,
    [Q_]: s.NOTEQUAL
  };
  function U(P, b) {
    if (b.type === Ci && e.has("OES_texture_float_linear") === !1 && (b.magFilter === xi || b.magFilter === Ju || b.magFilter === Tl || b.magFilter === ss || b.minFilter === xi || b.minFilter === Ju || b.minFilter === Tl || b.minFilter === ss) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), s.texParameteri(P, s.TEXTURE_WRAP_S, O[b.wrapS]), s.texParameteri(P, s.TEXTURE_WRAP_T, O[b.wrapT]), (P === s.TEXTURE_3D || P === s.TEXTURE_2D_ARRAY) && s.texParameteri(P, s.TEXTURE_WRAP_R, O[b.wrapR]), s.texParameteri(P, s.TEXTURE_MAG_FILTER, ue[b.magFilter]), s.texParameteri(P, s.TEXTURE_MIN_FILTER, ue[b.minFilter]), b.compareFunction && (s.texParameteri(P, s.TEXTURE_COMPARE_MODE, s.COMPARE_REF_TO_TEXTURE), s.texParameteri(P, s.TEXTURE_COMPARE_FUNC, ae[b.compareFunction])), e.has("EXT_texture_filter_anisotropic") === !0) {
      if (b.magFilter === Bn || b.minFilter !== Tl && b.minFilter !== ss || b.type === Ci && e.has("OES_texture_float_linear") === !1) return;
      if (b.anisotropy > 1 || r.get(b).__currentAnisotropy) {
        const $ = e.get("EXT_texture_filter_anisotropic");
        s.texParameterf(P, $.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(b.anisotropy, o.getMaxAnisotropy())), r.get(b).__currentAnisotropy = b.anisotropy;
      }
    }
  }
  function oe(P, b) {
    let $ = !1;
    P.__webglInit === void 0 && (P.__webglInit = !0, b.addEventListener("dispose", ee));
    const fe = b.source;
    let xe = v.get(fe);
    xe === void 0 && (xe = {}, v.set(fe, xe));
    const de = J(b);
    if (de !== P.__cacheKey) {
      xe[de] === void 0 && (xe[de] = {
        texture: s.createTexture(),
        usedTimes: 0
      }, u.memory.textures++, $ = !0), xe[de].usedTimes++;
      const Xe = xe[P.__cacheKey];
      Xe !== void 0 && (xe[P.__cacheKey].usedTimes--, Xe.usedTimes === 0 && Y(b)), P.__cacheKey = de, P.__webglTexture = xe[de].texture;
    }
    return $;
  }
  function Fe(P, b, $) {
    let fe = s.TEXTURE_2D;
    (b.isDataArrayTexture || b.isCompressedArrayTexture) && (fe = s.TEXTURE_2D_ARRAY), b.isData3DTexture && (fe = s.TEXTURE_3D);
    const xe = oe(P, b), de = b.source;
    t.bindTexture(fe, P.__webglTexture, s.TEXTURE0 + $);
    const Xe = r.get(de);
    if (de.version !== Xe.__version || xe === !0) {
      t.activeTexture(s.TEXTURE0 + $);
      const Pe = Tt.getPrimaries(Tt.workingColorSpace), Oe = b.colorSpace === Cr ? null : Tt.getPrimaries(b.colorSpace), vt = b.colorSpace === Cr || Pe === Oe ? s.NONE : s.BROWSER_DEFAULT_WEBGL;
      s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, b.flipY), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, b.premultiplyAlpha), s.pixelStorei(s.UNPACK_ALIGNMENT, b.unpackAlignment), s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, vt);
      let we = E(b.image, !1, o.maxTextureSize);
      we = Ce(b, we);
      const Ue = l.convert(b.format, b.colorSpace), rt = l.convert(b.type);
      let it = L(b.internalFormat, Ue, rt, b.colorSpace, b.isVideoTexture);
      U(fe, b);
      let H;
      const me = b.mipmaps, $e = b.isVideoTexture !== !0, pt = Xe.__version === void 0 || xe === !0, V = de.dataReady, Ie = D(b, we);
      if (b.isDepthTexture)
        it = R(b.format === ho, b.type), pt && ($e ? t.texStorage2D(s.TEXTURE_2D, 1, it, we.width, we.height) : t.texImage2D(s.TEXTURE_2D, 0, it, we.width, we.height, 0, Ue, rt, null));
      else if (b.isDataTexture)
        if (me.length > 0) {
          $e && pt && t.texStorage2D(s.TEXTURE_2D, Ie, it, me[0].width, me[0].height);
          for (let le = 0, ge = me.length; le < ge; le++)
            H = me[le], $e ? V && t.texSubImage2D(s.TEXTURE_2D, le, 0, 0, H.width, H.height, Ue, rt, H.data) : t.texImage2D(s.TEXTURE_2D, le, it, H.width, H.height, 0, Ue, rt, H.data);
          b.generateMipmaps = !1;
        } else
          $e ? (pt && t.texStorage2D(s.TEXTURE_2D, Ie, it, we.width, we.height), V && t.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, we.width, we.height, Ue, rt, we.data)) : t.texImage2D(s.TEXTURE_2D, 0, it, we.width, we.height, 0, Ue, rt, we.data);
      else if (b.isCompressedTexture)
        if (b.isCompressedArrayTexture) {
          $e && pt && t.texStorage3D(s.TEXTURE_2D_ARRAY, Ie, it, me[0].width, me[0].height, we.depth);
          for (let le = 0, ge = me.length; le < ge; le++)
            if (H = me[le], b.format !== Si)
              if (Ue !== null)
                if ($e) {
                  if (V)
                    if (b.layerUpdates.size > 0) {
                      const De = g0(H.width, H.height, b.format, b.type);
                      for (const ze of b.layerUpdates) {
                        const _t = H.data.subarray(
                          ze * De / H.data.BYTES_PER_ELEMENT,
                          (ze + 1) * De / H.data.BYTES_PER_ELEMENT
                        );
                        t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY, le, 0, 0, ze, H.width, H.height, 1, Ue, _t, 0, 0);
                      }
                      b.clearLayerUpdates();
                    } else
                      t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY, le, 0, 0, 0, H.width, H.height, we.depth, Ue, H.data, 0, 0);
                } else
                  t.compressedTexImage3D(s.TEXTURE_2D_ARRAY, le, it, H.width, H.height, we.depth, 0, H.data, 0, 0);
              else
                console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
            else
              $e ? V && t.texSubImage3D(s.TEXTURE_2D_ARRAY, le, 0, 0, 0, H.width, H.height, we.depth, Ue, rt, H.data) : t.texImage3D(s.TEXTURE_2D_ARRAY, le, it, H.width, H.height, we.depth, 0, Ue, rt, H.data);
        } else {
          $e && pt && t.texStorage2D(s.TEXTURE_2D, Ie, it, me[0].width, me[0].height);
          for (let le = 0, ge = me.length; le < ge; le++)
            H = me[le], b.format !== Si ? Ue !== null ? $e ? V && t.compressedTexSubImage2D(s.TEXTURE_2D, le, 0, 0, H.width, H.height, Ue, H.data) : t.compressedTexImage2D(s.TEXTURE_2D, le, it, H.width, H.height, 0, H.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : $e ? V && t.texSubImage2D(s.TEXTURE_2D, le, 0, 0, H.width, H.height, Ue, rt, H.data) : t.texImage2D(s.TEXTURE_2D, le, it, H.width, H.height, 0, Ue, rt, H.data);
        }
      else if (b.isDataArrayTexture)
        if ($e) {
          if (pt && t.texStorage3D(s.TEXTURE_2D_ARRAY, Ie, it, we.width, we.height, we.depth), V)
            if (b.layerUpdates.size > 0) {
              const le = g0(we.width, we.height, b.format, b.type);
              for (const ge of b.layerUpdates) {
                const De = we.data.subarray(
                  ge * le / we.data.BYTES_PER_ELEMENT,
                  (ge + 1) * le / we.data.BYTES_PER_ELEMENT
                );
                t.texSubImage3D(s.TEXTURE_2D_ARRAY, 0, 0, 0, ge, we.width, we.height, 1, Ue, rt, De);
              }
              b.clearLayerUpdates();
            } else
              t.texSubImage3D(s.TEXTURE_2D_ARRAY, 0, 0, 0, 0, we.width, we.height, we.depth, Ue, rt, we.data);
        } else
          t.texImage3D(s.TEXTURE_2D_ARRAY, 0, it, we.width, we.height, we.depth, 0, Ue, rt, we.data);
      else if (b.isData3DTexture)
        $e ? (pt && t.texStorage3D(s.TEXTURE_3D, Ie, it, we.width, we.height, we.depth), V && t.texSubImage3D(s.TEXTURE_3D, 0, 0, 0, 0, we.width, we.height, we.depth, Ue, rt, we.data)) : t.texImage3D(s.TEXTURE_3D, 0, it, we.width, we.height, we.depth, 0, Ue, rt, we.data);
      else if (b.isFramebufferTexture) {
        if (pt)
          if ($e)
            t.texStorage2D(s.TEXTURE_2D, Ie, it, we.width, we.height);
          else {
            let le = we.width, ge = we.height;
            for (let De = 0; De < Ie; De++)
              t.texImage2D(s.TEXTURE_2D, De, it, le, ge, 0, Ue, rt, null), le >>= 1, ge >>= 1;
          }
      } else if (me.length > 0) {
        if ($e && pt) {
          const le = ke(me[0]);
          t.texStorage2D(s.TEXTURE_2D, Ie, it, le.width, le.height);
        }
        for (let le = 0, ge = me.length; le < ge; le++)
          H = me[le], $e ? V && t.texSubImage2D(s.TEXTURE_2D, le, 0, 0, Ue, rt, H) : t.texImage2D(s.TEXTURE_2D, le, it, Ue, rt, H);
        b.generateMipmaps = !1;
      } else if ($e) {
        if (pt) {
          const le = ke(we);
          t.texStorage2D(s.TEXTURE_2D, Ie, it, le.width, le.height);
        }
        V && t.texSubImage2D(s.TEXTURE_2D, 0, 0, 0, Ue, rt, we);
      } else
        t.texImage2D(s.TEXTURE_2D, 0, it, Ue, rt, we);
      x(b) && M(fe), Xe.__version = de.version, b.onUpdate && b.onUpdate(b);
    }
    P.__version = b.version;
  }
  function K(P, b, $) {
    if (b.image.length !== 6) return;
    const fe = oe(P, b), xe = b.source;
    t.bindTexture(s.TEXTURE_CUBE_MAP, P.__webglTexture, s.TEXTURE0 + $);
    const de = r.get(xe);
    if (xe.version !== de.__version || fe === !0) {
      t.activeTexture(s.TEXTURE0 + $);
      const Xe = Tt.getPrimaries(Tt.workingColorSpace), Pe = b.colorSpace === Cr ? null : Tt.getPrimaries(b.colorSpace), Oe = b.colorSpace === Cr || Xe === Pe ? s.NONE : s.BROWSER_DEFAULT_WEBGL;
      s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, b.flipY), s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, b.premultiplyAlpha), s.pixelStorei(s.UNPACK_ALIGNMENT, b.unpackAlignment), s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL, Oe);
      const vt = b.isCompressedTexture || b.image[0].isCompressedTexture, we = b.image[0] && b.image[0].isDataTexture, Ue = [];
      for (let ge = 0; ge < 6; ge++)
        !vt && !we ? Ue[ge] = E(b.image[ge], !0, o.maxCubemapSize) : Ue[ge] = we ? b.image[ge].image : b.image[ge], Ue[ge] = Ce(b, Ue[ge]);
      const rt = Ue[0], it = l.convert(b.format, b.colorSpace), H = l.convert(b.type), me = L(b.internalFormat, it, H, b.colorSpace), $e = b.isVideoTexture !== !0, pt = de.__version === void 0 || fe === !0, V = xe.dataReady;
      let Ie = D(b, rt);
      U(s.TEXTURE_CUBE_MAP, b);
      let le;
      if (vt) {
        $e && pt && t.texStorage2D(s.TEXTURE_CUBE_MAP, Ie, me, rt.width, rt.height);
        for (let ge = 0; ge < 6; ge++) {
          le = Ue[ge].mipmaps;
          for (let De = 0; De < le.length; De++) {
            const ze = le[De];
            b.format !== Si ? it !== null ? $e ? V && t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, De, 0, 0, ze.width, ze.height, it, ze.data) : t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, De, me, ze.width, ze.height, 0, ze.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : $e ? V && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, De, 0, 0, ze.width, ze.height, it, H, ze.data) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, De, me, ze.width, ze.height, 0, it, H, ze.data);
          }
        }
      } else {
        if (le = b.mipmaps, $e && pt) {
          le.length > 0 && Ie++;
          const ge = ke(Ue[0]);
          t.texStorage2D(s.TEXTURE_CUBE_MAP, Ie, me, ge.width, ge.height);
        }
        for (let ge = 0; ge < 6; ge++)
          if (we) {
            $e ? V && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, 0, 0, 0, Ue[ge].width, Ue[ge].height, it, H, Ue[ge].data) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, 0, me, Ue[ge].width, Ue[ge].height, 0, it, H, Ue[ge].data);
            for (let De = 0; De < le.length; De++) {
              const _t = le[De].image[ge].image;
              $e ? V && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, De + 1, 0, 0, _t.width, _t.height, it, H, _t.data) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, De + 1, me, _t.width, _t.height, 0, it, H, _t.data);
            }
          } else {
            $e ? V && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, 0, 0, 0, it, H, Ue[ge]) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, 0, me, it, H, Ue[ge]);
            for (let De = 0; De < le.length; De++) {
              const ze = le[De];
              $e ? V && t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, De + 1, 0, 0, it, H, ze.image[ge]) : t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X + ge, De + 1, me, it, H, ze.image[ge]);
            }
          }
      }
      x(b) && M(s.TEXTURE_CUBE_MAP), de.__version = xe.version, b.onUpdate && b.onUpdate(b);
    }
    P.__version = b.version;
  }
  function ce(P, b, $, fe, xe, de) {
    const Xe = l.convert($.format, $.colorSpace), Pe = l.convert($.type), Oe = L($.internalFormat, Xe, Pe, $.colorSpace);
    if (!r.get(b).__hasExternalTextures) {
      const we = Math.max(1, b.width >> de), Ue = Math.max(1, b.height >> de);
      xe === s.TEXTURE_3D || xe === s.TEXTURE_2D_ARRAY ? t.texImage3D(xe, de, Oe, we, Ue, b.depth, 0, Xe, Pe, null) : t.texImage2D(xe, de, Oe, we, Ue, 0, Xe, Pe, null);
    }
    t.bindFramebuffer(s.FRAMEBUFFER, P), ct(b) ? d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, fe, xe, r.get($).__webglTexture, 0, ht(b)) : (xe === s.TEXTURE_2D || xe >= s.TEXTURE_CUBE_MAP_POSITIVE_X && xe <= s.TEXTURE_CUBE_MAP_NEGATIVE_Z) && s.framebufferTexture2D(s.FRAMEBUFFER, fe, xe, r.get($).__webglTexture, de), t.bindFramebuffer(s.FRAMEBUFFER, null);
  }
  function pe(P, b, $) {
    if (s.bindRenderbuffer(s.RENDERBUFFER, P), b.depthBuffer) {
      const fe = b.depthTexture, xe = fe && fe.isDepthTexture ? fe.type : null, de = R(b.stencilBuffer, xe), Xe = b.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, Pe = ht(b);
      ct(b) ? d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER, Pe, de, b.width, b.height) : $ ? s.renderbufferStorageMultisample(s.RENDERBUFFER, Pe, de, b.width, b.height) : s.renderbufferStorage(s.RENDERBUFFER, de, b.width, b.height), s.framebufferRenderbuffer(s.FRAMEBUFFER, Xe, s.RENDERBUFFER, P);
    } else {
      const fe = b.textures;
      for (let xe = 0; xe < fe.length; xe++) {
        const de = fe[xe], Xe = l.convert(de.format, de.colorSpace), Pe = l.convert(de.type), Oe = L(de.internalFormat, Xe, Pe, de.colorSpace), vt = ht(b);
        $ && ct(b) === !1 ? s.renderbufferStorageMultisample(s.RENDERBUFFER, vt, Oe, b.width, b.height) : ct(b) ? d.renderbufferStorageMultisampleEXT(s.RENDERBUFFER, vt, Oe, b.width, b.height) : s.renderbufferStorage(s.RENDERBUFFER, Oe, b.width, b.height);
      }
    }
    s.bindRenderbuffer(s.RENDERBUFFER, null);
  }
  function Me(P, b) {
    if (b && b.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
    if (t.bindFramebuffer(s.FRAMEBUFFER, P), !(b.depthTexture && b.depthTexture.isDepthTexture))
      throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    (!r.get(b.depthTexture).__webglTexture || b.depthTexture.image.width !== b.width || b.depthTexture.image.height !== b.height) && (b.depthTexture.image.width = b.width, b.depthTexture.image.height = b.height, b.depthTexture.needsUpdate = !0), se(b.depthTexture, 0);
    const fe = r.get(b.depthTexture).__webglTexture, xe = ht(b);
    if (b.depthTexture.format === so)
      ct(b) ? d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, s.DEPTH_ATTACHMENT, s.TEXTURE_2D, fe, 0, xe) : s.framebufferTexture2D(s.FRAMEBUFFER, s.DEPTH_ATTACHMENT, s.TEXTURE_2D, fe, 0);
    else if (b.depthTexture.format === ho)
      ct(b) ? d.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER, s.DEPTH_STENCIL_ATTACHMENT, s.TEXTURE_2D, fe, 0, xe) : s.framebufferTexture2D(s.FRAMEBUFFER, s.DEPTH_STENCIL_ATTACHMENT, s.TEXTURE_2D, fe, 0);
    else
      throw new Error("Unknown depthTexture format");
  }
  function Re(P) {
    const b = r.get(P), $ = P.isWebGLCubeRenderTarget === !0;
    if (b.__boundDepthTexture !== P.depthTexture) {
      const fe = P.depthTexture;
      if (b.__depthDisposeCallback && b.__depthDisposeCallback(), fe) {
        const xe = () => {
          delete b.__boundDepthTexture, delete b.__depthDisposeCallback, fe.removeEventListener("dispose", xe);
        };
        fe.addEventListener("dispose", xe), b.__depthDisposeCallback = xe;
      }
      b.__boundDepthTexture = fe;
    }
    if (P.depthTexture && !b.__autoAllocateDepthBuffer) {
      if ($) throw new Error("target.depthTexture not supported in Cube render targets");
      Me(b.__webglFramebuffer, P);
    } else if ($) {
      b.__webglDepthbuffer = [];
      for (let fe = 0; fe < 6; fe++)
        if (t.bindFramebuffer(s.FRAMEBUFFER, b.__webglFramebuffer[fe]), b.__webglDepthbuffer[fe] === void 0)
          b.__webglDepthbuffer[fe] = s.createRenderbuffer(), pe(b.__webglDepthbuffer[fe], P, !1);
        else {
          const xe = P.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, de = b.__webglDepthbuffer[fe];
          s.bindRenderbuffer(s.RENDERBUFFER, de), s.framebufferRenderbuffer(s.FRAMEBUFFER, xe, s.RENDERBUFFER, de);
        }
    } else if (t.bindFramebuffer(s.FRAMEBUFFER, b.__webglFramebuffer), b.__webglDepthbuffer === void 0)
      b.__webglDepthbuffer = s.createRenderbuffer(), pe(b.__webglDepthbuffer, P, !1);
    else {
      const fe = P.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, xe = b.__webglDepthbuffer;
      s.bindRenderbuffer(s.RENDERBUFFER, xe), s.framebufferRenderbuffer(s.FRAMEBUFFER, fe, s.RENDERBUFFER, xe);
    }
    t.bindFramebuffer(s.FRAMEBUFFER, null);
  }
  function Le(P, b, $) {
    const fe = r.get(P);
    b !== void 0 && ce(fe.__webglFramebuffer, P, P.texture, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, 0), $ !== void 0 && Re(P);
  }
  function Je(P) {
    const b = P.texture, $ = r.get(P), fe = r.get(b);
    P.addEventListener("dispose", F);
    const xe = P.textures, de = P.isWebGLCubeRenderTarget === !0, Xe = xe.length > 1;
    if (Xe || (fe.__webglTexture === void 0 && (fe.__webglTexture = s.createTexture()), fe.__version = b.version, u.memory.textures++), de) {
      $.__webglFramebuffer = [];
      for (let Pe = 0; Pe < 6; Pe++)
        if (b.mipmaps && b.mipmaps.length > 0) {
          $.__webglFramebuffer[Pe] = [];
          for (let Oe = 0; Oe < b.mipmaps.length; Oe++)
            $.__webglFramebuffer[Pe][Oe] = s.createFramebuffer();
        } else
          $.__webglFramebuffer[Pe] = s.createFramebuffer();
    } else {
      if (b.mipmaps && b.mipmaps.length > 0) {
        $.__webglFramebuffer = [];
        for (let Pe = 0; Pe < b.mipmaps.length; Pe++)
          $.__webglFramebuffer[Pe] = s.createFramebuffer();
      } else
        $.__webglFramebuffer = s.createFramebuffer();
      if (Xe)
        for (let Pe = 0, Oe = xe.length; Pe < Oe; Pe++) {
          const vt = r.get(xe[Pe]);
          vt.__webglTexture === void 0 && (vt.__webglTexture = s.createTexture(), u.memory.textures++);
        }
      if (P.samples > 0 && ct(P) === !1) {
        $.__webglMultisampledFramebuffer = s.createFramebuffer(), $.__webglColorRenderbuffer = [], t.bindFramebuffer(s.FRAMEBUFFER, $.__webglMultisampledFramebuffer);
        for (let Pe = 0; Pe < xe.length; Pe++) {
          const Oe = xe[Pe];
          $.__webglColorRenderbuffer[Pe] = s.createRenderbuffer(), s.bindRenderbuffer(s.RENDERBUFFER, $.__webglColorRenderbuffer[Pe]);
          const vt = l.convert(Oe.format, Oe.colorSpace), we = l.convert(Oe.type), Ue = L(Oe.internalFormat, vt, we, Oe.colorSpace, P.isXRRenderTarget === !0), rt = ht(P);
          s.renderbufferStorageMultisample(s.RENDERBUFFER, rt, Ue, P.width, P.height), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + Pe, s.RENDERBUFFER, $.__webglColorRenderbuffer[Pe]);
        }
        s.bindRenderbuffer(s.RENDERBUFFER, null), P.depthBuffer && ($.__webglDepthRenderbuffer = s.createRenderbuffer(), pe($.__webglDepthRenderbuffer, P, !0)), t.bindFramebuffer(s.FRAMEBUFFER, null);
      }
    }
    if (de) {
      t.bindTexture(s.TEXTURE_CUBE_MAP, fe.__webglTexture), U(s.TEXTURE_CUBE_MAP, b);
      for (let Pe = 0; Pe < 6; Pe++)
        if (b.mipmaps && b.mipmaps.length > 0)
          for (let Oe = 0; Oe < b.mipmaps.length; Oe++)
            ce($.__webglFramebuffer[Pe][Oe], P, b, s.COLOR_ATTACHMENT0, s.TEXTURE_CUBE_MAP_POSITIVE_X + Pe, Oe);
        else
          ce($.__webglFramebuffer[Pe], P, b, s.COLOR_ATTACHMENT0, s.TEXTURE_CUBE_MAP_POSITIVE_X + Pe, 0);
      x(b) && M(s.TEXTURE_CUBE_MAP), t.unbindTexture();
    } else if (Xe) {
      for (let Pe = 0, Oe = xe.length; Pe < Oe; Pe++) {
        const vt = xe[Pe], we = r.get(vt);
        t.bindTexture(s.TEXTURE_2D, we.__webglTexture), U(s.TEXTURE_2D, vt), ce($.__webglFramebuffer, P, vt, s.COLOR_ATTACHMENT0 + Pe, s.TEXTURE_2D, 0), x(vt) && M(s.TEXTURE_2D);
      }
      t.unbindTexture();
    } else {
      let Pe = s.TEXTURE_2D;
      if ((P.isWebGL3DRenderTarget || P.isWebGLArrayRenderTarget) && (Pe = P.isWebGL3DRenderTarget ? s.TEXTURE_3D : s.TEXTURE_2D_ARRAY), t.bindTexture(Pe, fe.__webglTexture), U(Pe, b), b.mipmaps && b.mipmaps.length > 0)
        for (let Oe = 0; Oe < b.mipmaps.length; Oe++)
          ce($.__webglFramebuffer[Oe], P, b, s.COLOR_ATTACHMENT0, Pe, Oe);
      else
        ce($.__webglFramebuffer, P, b, s.COLOR_ATTACHMENT0, Pe, 0);
      x(b) && M(Pe), t.unbindTexture();
    }
    P.depthBuffer && Re(P);
  }
  function ft(P) {
    const b = P.textures;
    for (let $ = 0, fe = b.length; $ < fe; $++) {
      const xe = b[$];
      if (x(xe)) {
        const de = P.isWebGLCubeRenderTarget ? s.TEXTURE_CUBE_MAP : s.TEXTURE_2D, Xe = r.get(xe).__webglTexture;
        t.bindTexture(de, Xe), M(de), t.unbindTexture();
      }
    }
  }
  const at = [], B = [];
  function qt(P) {
    if (P.samples > 0) {
      if (ct(P) === !1) {
        const b = P.textures, $ = P.width, fe = P.height;
        let xe = s.COLOR_BUFFER_BIT;
        const de = P.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT, Xe = r.get(P), Pe = b.length > 1;
        if (Pe)
          for (let Oe = 0; Oe < b.length; Oe++)
            t.bindFramebuffer(s.FRAMEBUFFER, Xe.__webglMultisampledFramebuffer), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + Oe, s.RENDERBUFFER, null), t.bindFramebuffer(s.FRAMEBUFFER, Xe.__webglFramebuffer), s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0 + Oe, s.TEXTURE_2D, null, 0);
        t.bindFramebuffer(s.READ_FRAMEBUFFER, Xe.__webglMultisampledFramebuffer), t.bindFramebuffer(s.DRAW_FRAMEBUFFER, Xe.__webglFramebuffer);
        for (let Oe = 0; Oe < b.length; Oe++) {
          if (P.resolveDepthBuffer && (P.depthBuffer && (xe |= s.DEPTH_BUFFER_BIT), P.stencilBuffer && P.resolveStencilBuffer && (xe |= s.STENCIL_BUFFER_BIT)), Pe) {
            s.framebufferRenderbuffer(s.READ_FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.RENDERBUFFER, Xe.__webglColorRenderbuffer[Oe]);
            const vt = r.get(b[Oe]).__webglTexture;
            s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, vt, 0);
          }
          s.blitFramebuffer(0, 0, $, fe, 0, 0, $, fe, xe, s.NEAREST), f === !0 && (at.length = 0, B.length = 0, at.push(s.COLOR_ATTACHMENT0 + Oe), P.depthBuffer && P.resolveDepthBuffer === !1 && (at.push(de), B.push(de), s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER, B)), s.invalidateFramebuffer(s.READ_FRAMEBUFFER, at));
        }
        if (t.bindFramebuffer(s.READ_FRAMEBUFFER, null), t.bindFramebuffer(s.DRAW_FRAMEBUFFER, null), Pe)
          for (let Oe = 0; Oe < b.length; Oe++) {
            t.bindFramebuffer(s.FRAMEBUFFER, Xe.__webglMultisampledFramebuffer), s.framebufferRenderbuffer(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0 + Oe, s.RENDERBUFFER, Xe.__webglColorRenderbuffer[Oe]);
            const vt = r.get(b[Oe]).__webglTexture;
            t.bindFramebuffer(s.FRAMEBUFFER, Xe.__webglFramebuffer), s.framebufferTexture2D(s.DRAW_FRAMEBUFFER, s.COLOR_ATTACHMENT0 + Oe, s.TEXTURE_2D, vt, 0);
          }
        t.bindFramebuffer(s.DRAW_FRAMEBUFFER, Xe.__webglMultisampledFramebuffer);
      } else if (P.depthBuffer && P.resolveDepthBuffer === !1 && f) {
        const b = P.stencilBuffer ? s.DEPTH_STENCIL_ATTACHMENT : s.DEPTH_ATTACHMENT;
        s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER, [b]);
      }
    }
  }
  function ht(P) {
    return Math.min(o.maxSamples, P.samples);
  }
  function ct(P) {
    const b = r.get(P);
    return P.samples > 0 && e.has("WEBGL_multisampled_render_to_texture") === !0 && b.__useRenderToTexture !== !1;
  }
  function Ze(P) {
    const b = u.render.frame;
    m.get(P) !== b && (m.set(P, b), P.update());
  }
  function Ce(P, b) {
    const $ = P.colorSpace, fe = P.format, xe = P.type;
    return P.isCompressedTexture === !0 || P.isVideoTexture === !0 || $ !== Nr && $ !== Cr && (Tt.getTransfer($) === Ut ? (fe !== Si || xe !== Ji) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", $)), b;
  }
  function ke(P) {
    return typeof HTMLImageElement < "u" && P instanceof HTMLImageElement ? (h.width = P.naturalWidth || P.width, h.height = P.naturalHeight || P.height) : typeof VideoFrame < "u" && P instanceof VideoFrame ? (h.width = P.displayWidth, h.height = P.displayHeight) : (h.width = P.width, h.height = P.height), h;
  }
  this.allocateTextureUnit = te, this.resetTextureUnits = C, this.setTexture2D = se, this.setTexture2DArray = _e, this.setTexture3D = Z, this.setTextureCube = he, this.rebindTextures = Le, this.setupRenderTarget = Je, this.updateRenderTargetMipmap = ft, this.updateMultisampleRenderTarget = qt, this.setupDepthRenderbuffer = Re, this.setupFrameBufferTexture = ce, this.useMultisampledRTT = ct;
}
function yE(s, e) {
  function t(r, o = Cr) {
    let l;
    const u = Tt.getTransfer(o);
    if (r === Ji) return s.UNSIGNED_BYTE;
    if (r === Df) return s.UNSIGNED_SHORT_4_4_4_4;
    if (r === Nf) return s.UNSIGNED_SHORT_5_5_5_1;
    if (r === W0) return s.UNSIGNED_INT_5_9_9_9_REV;
    if (r === V0) return s.BYTE;
    if (r === G0) return s.SHORT;
    if (r === _a) return s.UNSIGNED_SHORT;
    if (r === Lf) return s.INT;
    if (r === os) return s.UNSIGNED_INT;
    if (r === Ci) return s.FLOAT;
    if (r === Ri) return s.HALF_FLOAT;
    if (r === X0) return s.ALPHA;
    if (r === j0) return s.RGB;
    if (r === Si) return s.RGBA;
    if (r === Y0) return s.LUMINANCE;
    if (r === q0) return s.LUMINANCE_ALPHA;
    if (r === so) return s.DEPTH_COMPONENT;
    if (r === ho) return s.DEPTH_STENCIL;
    if (r === If) return s.RED;
    if (r === Uf) return s.RED_INTEGER;
    if (r === $0) return s.RG;
    if (r === Ff) return s.RG_INTEGER;
    if (r === kf) return s.RGBA_INTEGER;
    if (r === Ql || r === Jl || r === ec || r === tc)
      if (u === Ut)
        if (l = e.get("WEBGL_compressed_texture_s3tc_srgb"), l !== null) {
          if (r === Ql) return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (r === Jl) return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (r === ec) return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (r === tc) return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else
          return null;
      else if (l = e.get("WEBGL_compressed_texture_s3tc"), l !== null) {
        if (r === Ql) return l.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (r === Jl) return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (r === ec) return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (r === tc) return l.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else
        return null;
    if (r === Zd || r === Qd || r === Jd || r === ef)
      if (l = e.get("WEBGL_compressed_texture_pvrtc"), l !== null) {
        if (r === Zd) return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (r === Qd) return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (r === Jd) return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (r === ef) return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else
        return null;
    if (r === tf || r === nf || r === rf)
      if (l = e.get("WEBGL_compressed_texture_etc"), l !== null) {
        if (r === tf || r === nf) return u === Ut ? l.COMPRESSED_SRGB8_ETC2 : l.COMPRESSED_RGB8_ETC2;
        if (r === rf) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : l.COMPRESSED_RGBA8_ETC2_EAC;
      } else
        return null;
    if (r === sf || r === of || r === af || r === lf || r === cf || r === uf || r === df || r === ff || r === hf || r === pf || r === mf || r === gf || r === vf || r === _f)
      if (l = e.get("WEBGL_compressed_texture_astc"), l !== null) {
        if (r === sf) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : l.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (r === of) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : l.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (r === af) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : l.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (r === lf) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : l.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (r === cf) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : l.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (r === uf) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : l.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (r === df) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : l.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (r === ff) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : l.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (r === hf) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : l.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (r === pf) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : l.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (r === mf) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : l.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (r === gf) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : l.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (r === vf) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : l.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (r === _f) return u === Ut ? l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : l.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else
        return null;
    if (r === nc || r === xf || r === yf)
      if (l = e.get("EXT_texture_compression_bptc"), l !== null) {
        if (r === nc) return u === Ut ? l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : l.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (r === xf) return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (r === yf) return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else
        return null;
    if (r === K0 || r === Sf || r === Mf || r === Ef)
      if (l = e.get("EXT_texture_compression_rgtc"), l !== null) {
        if (r === nc) return l.COMPRESSED_RED_RGTC1_EXT;
        if (r === Sf) return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (r === Mf) return l.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (r === Ef) return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else
        return null;
    return r === fo ? s.UNSIGNED_INT_24_8 : s[r] !== void 0 ? s[r] : null;
  }
  return { convert: t };
}
class SE extends Rn {
  constructor(e = []) {
    super(), this.isArrayCamera = !0, this.cameras = e;
  }
}
class Jt extends Xt {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}
const ME = { type: "move" };
class Ad {
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  getHandSpace() {
    return this._hand === null && (this._hand = new Jt(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
  }
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new Jt(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new z(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new z()), this._targetRay;
  }
  getGripSpace() {
    return this._grip === null && (this._grip = new Jt(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new z(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new z()), this._grip;
  }
  dispatchEvent(e) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this;
  }
  connect(e) {
    if (e && e.hand) {
      const t = this._hand;
      if (t)
        for (const r of e.hand.values())
          this._getHandJoint(t, r);
    }
    return this.dispatchEvent({ type: "connected", data: e }), this;
  }
  disconnect(e) {
    return this.dispatchEvent({ type: "disconnected", data: e }), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
  }
  update(e, t, r) {
    let o = null, l = null, u = null;
    const d = this._targetRay, f = this._grip, h = this._hand;
    if (e && t.session.visibilityState !== "visible-blurred") {
      if (h && e.hand) {
        u = !0;
        for (const E of e.hand.values()) {
          const x = t.getJointPose(E, r), M = this._getHandJoint(h, E);
          x !== null && (M.matrix.fromArray(x.transform.matrix), M.matrix.decompose(M.position, M.rotation, M.scale), M.matrixWorldNeedsUpdate = !0, M.jointRadius = x.radius), M.visible = x !== null;
        }
        const m = h.joints["index-finger-tip"], _ = h.joints["thumb-tip"], v = m.position.distanceTo(_.position), S = 0.02, y = 5e-3;
        h.inputState.pinching && v > S + y ? (h.inputState.pinching = !1, this.dispatchEvent({
          type: "pinchend",
          handedness: e.handedness,
          target: this
        })) : !h.inputState.pinching && v <= S - y && (h.inputState.pinching = !0, this.dispatchEvent({
          type: "pinchstart",
          handedness: e.handedness,
          target: this
        }));
      } else
        f !== null && e.gripSpace && (l = t.getPose(e.gripSpace, r), l !== null && (f.matrix.fromArray(l.transform.matrix), f.matrix.decompose(f.position, f.rotation, f.scale), f.matrixWorldNeedsUpdate = !0, l.linearVelocity ? (f.hasLinearVelocity = !0, f.linearVelocity.copy(l.linearVelocity)) : f.hasLinearVelocity = !1, l.angularVelocity ? (f.hasAngularVelocity = !0, f.angularVelocity.copy(l.angularVelocity)) : f.hasAngularVelocity = !1));
      d !== null && (o = t.getPose(e.targetRaySpace, r), o === null && l !== null && (o = l), o !== null && (d.matrix.fromArray(o.transform.matrix), d.matrix.decompose(d.position, d.rotation, d.scale), d.matrixWorldNeedsUpdate = !0, o.linearVelocity ? (d.hasLinearVelocity = !0, d.linearVelocity.copy(o.linearVelocity)) : d.hasLinearVelocity = !1, o.angularVelocity ? (d.hasAngularVelocity = !0, d.angularVelocity.copy(o.angularVelocity)) : d.hasAngularVelocity = !1, this.dispatchEvent(ME)));
    }
    return d !== null && (d.visible = o !== null), f !== null && (f.visible = l !== null), h !== null && (h.visible = u !== null), this;
  }
  // private method
  _getHandJoint(e, t) {
    if (e.joints[t.jointName] === void 0) {
      const r = new Jt();
      r.matrixAutoUpdate = !1, r.visible = !1, e.joints[t.jointName] = r, e.add(r);
    }
    return e.joints[t.jointName];
  }
}
const EE = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, wE = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class TE {
  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }
  init(e, t, r) {
    if (this.texture === null) {
      const o = new Mn(), l = e.properties.get(o);
      l.__webglTexture = t.texture, (t.depthNear != r.depthNear || t.depthFar != r.depthFar) && (this.depthNear = t.depthNear, this.depthFar = t.depthFar), this.texture = o;
    }
  }
  getMesh(e) {
    if (this.texture !== null && this.mesh === null) {
      const t = e.cameras[0].viewport, r = new Pn({
        vertexShader: EE,
        fragmentShader: wE,
        uniforms: {
          depthColor: { value: this.texture },
          depthWidth: { value: t.z },
          depthHeight: { value: t.w }
        }
      });
      this.mesh = new Ct(new Pi(20, 20), r);
    }
    return this.mesh;
  }
  reset() {
    this.texture = null, this.mesh = null;
  }
  getDepthTexture() {
    return this.texture;
  }
}
class bE extends vo {
  constructor(e, t) {
    super();
    const r = this;
    let o = null, l = 1, u = null, d = "local-floor", f = 1, h = null, m = null, _ = null, v = null, S = null, y = null;
    const E = new TE(), x = t.getContextAttributes();
    let M = null, L = null;
    const R = [], D = [], ee = new Qe();
    let F = null;
    const I = new Rn();
    I.layers.enable(1), I.viewport = new Lt();
    const Y = new Rn();
    Y.layers.enable(2), Y.viewport = new Lt();
    const ve = [I, Y], T = new SE();
    T.layers.enable(1), T.layers.enable(2);
    let C = null, te = null;
    this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(K) {
      let ce = R[K];
      return ce === void 0 && (ce = new Ad(), R[K] = ce), ce.getTargetRaySpace();
    }, this.getControllerGrip = function(K) {
      let ce = R[K];
      return ce === void 0 && (ce = new Ad(), R[K] = ce), ce.getGripSpace();
    }, this.getHand = function(K) {
      let ce = R[K];
      return ce === void 0 && (ce = new Ad(), R[K] = ce), ce.getHandSpace();
    };
    function J(K) {
      const ce = D.indexOf(K.inputSource);
      if (ce === -1)
        return;
      const pe = R[ce];
      pe !== void 0 && (pe.update(K.inputSource, K.frame, h || u), pe.dispatchEvent({ type: K.type, data: K.inputSource }));
    }
    function se() {
      o.removeEventListener("select", J), o.removeEventListener("selectstart", J), o.removeEventListener("selectend", J), o.removeEventListener("squeeze", J), o.removeEventListener("squeezestart", J), o.removeEventListener("squeezeend", J), o.removeEventListener("end", se), o.removeEventListener("inputsourceschange", _e);
      for (let K = 0; K < R.length; K++) {
        const ce = D[K];
        ce !== null && (D[K] = null, R[K].disconnect(ce));
      }
      C = null, te = null, E.reset(), e.setRenderTarget(M), S = null, v = null, _ = null, o = null, L = null, Fe.stop(), r.isPresenting = !1, e.setPixelRatio(F), e.setSize(ee.width, ee.height, !1), r.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(K) {
      l = K, r.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(K) {
      d = K, r.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return h || u;
    }, this.setReferenceSpace = function(K) {
      h = K;
    }, this.getBaseLayer = function() {
      return v !== null ? v : S;
    }, this.getBinding = function() {
      return _;
    }, this.getFrame = function() {
      return y;
    }, this.getSession = function() {
      return o;
    }, this.setSession = async function(K) {
      if (o = K, o !== null) {
        if (M = e.getRenderTarget(), o.addEventListener("select", J), o.addEventListener("selectstart", J), o.addEventListener("selectend", J), o.addEventListener("squeeze", J), o.addEventListener("squeezestart", J), o.addEventListener("squeezeend", J), o.addEventListener("end", se), o.addEventListener("inputsourceschange", _e), x.xrCompatible !== !0 && await t.makeXRCompatible(), F = e.getPixelRatio(), e.getSize(ee), o.renderState.layers === void 0) {
          const ce = {
            antialias: x.antialias,
            alpha: !0,
            depth: x.depth,
            stencil: x.stencil,
            framebufferScaleFactor: l
          };
          S = new XRWebGLLayer(o, t, ce), o.updateRenderState({ baseLayer: S }), e.setPixelRatio(1), e.setSize(S.framebufferWidth, S.framebufferHeight, !1), L = new oi(
            S.framebufferWidth,
            S.framebufferHeight,
            {
              format: Si,
              type: Ji,
              colorSpace: e.outputColorSpace,
              stencilBuffer: x.stencil
            }
          );
        } else {
          let ce = null, pe = null, Me = null;
          x.depth && (Me = x.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, ce = x.stencil ? ho : so, pe = x.stencil ? fo : os);
          const Re = {
            colorFormat: t.RGBA8,
            depthFormat: Me,
            scaleFactor: l
          };
          _ = new XRWebGLBinding(o, t), v = _.createProjectionLayer(Re), o.updateRenderState({ layers: [v] }), e.setPixelRatio(1), e.setSize(v.textureWidth, v.textureHeight, !1), L = new oi(
            v.textureWidth,
            v.textureHeight,
            {
              format: Si,
              type: Ji,
              depthTexture: new fg(v.textureWidth, v.textureHeight, pe, void 0, void 0, void 0, void 0, void 0, void 0, ce),
              stencilBuffer: x.stencil,
              colorSpace: e.outputColorSpace,
              samples: x.antialias ? 4 : 0,
              resolveDepthBuffer: v.ignoreDepthValues === !1
            }
          );
        }
        L.isXRRenderTarget = !0, this.setFoveation(f), h = null, u = await o.requestReferenceSpace(d), Fe.setContext(o), Fe.start(), r.isPresenting = !0, r.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (o !== null)
        return o.environmentBlendMode;
    }, this.getDepthTexture = function() {
      return E.getDepthTexture();
    };
    function _e(K) {
      for (let ce = 0; ce < K.removed.length; ce++) {
        const pe = K.removed[ce], Me = D.indexOf(pe);
        Me >= 0 && (D[Me] = null, R[Me].disconnect(pe));
      }
      for (let ce = 0; ce < K.added.length; ce++) {
        const pe = K.added[ce];
        let Me = D.indexOf(pe);
        if (Me === -1) {
          for (let Le = 0; Le < R.length; Le++)
            if (Le >= D.length) {
              D.push(pe), Me = Le;
              break;
            } else if (D[Le] === null) {
              D[Le] = pe, Me = Le;
              break;
            }
          if (Me === -1) break;
        }
        const Re = R[Me];
        Re && Re.connect(pe);
      }
    }
    const Z = new z(), he = new z();
    function O(K, ce, pe) {
      Z.setFromMatrixPosition(ce.matrixWorld), he.setFromMatrixPosition(pe.matrixWorld);
      const Me = Z.distanceTo(he), Re = ce.projectionMatrix.elements, Le = pe.projectionMatrix.elements, Je = Re[14] / (Re[10] - 1), ft = Re[14] / (Re[10] + 1), at = (Re[9] + 1) / Re[5], B = (Re[9] - 1) / Re[5], qt = (Re[8] - 1) / Re[0], ht = (Le[8] + 1) / Le[0], ct = Je * qt, Ze = Je * ht, Ce = Me / (-qt + ht), ke = Ce * -qt;
      if (ce.matrixWorld.decompose(K.position, K.quaternion, K.scale), K.translateX(ke), K.translateZ(Ce), K.matrixWorld.compose(K.position, K.quaternion, K.scale), K.matrixWorldInverse.copy(K.matrixWorld).invert(), Re[10] === -1)
        K.projectionMatrix.copy(ce.projectionMatrix), K.projectionMatrixInverse.copy(ce.projectionMatrixInverse);
      else {
        const P = Je + Ce, b = ft + Ce, $ = ct - ke, fe = Ze + (Me - ke), xe = at * ft / b * P, de = B * ft / b * P;
        K.projectionMatrix.makePerspective($, fe, xe, de, P, b), K.projectionMatrixInverse.copy(K.projectionMatrix).invert();
      }
    }
    function ue(K, ce) {
      ce === null ? K.matrixWorld.copy(K.matrix) : K.matrixWorld.multiplyMatrices(ce.matrixWorld, K.matrix), K.matrixWorldInverse.copy(K.matrixWorld).invert();
    }
    this.updateCamera = function(K) {
      if (o === null) return;
      let ce = K.near, pe = K.far;
      E.texture !== null && (E.depthNear > 0 && (ce = E.depthNear), E.depthFar > 0 && (pe = E.depthFar)), T.near = Y.near = I.near = ce, T.far = Y.far = I.far = pe, (C !== T.near || te !== T.far) && (o.updateRenderState({
        depthNear: T.near,
        depthFar: T.far
      }), C = T.near, te = T.far);
      const Me = K.parent, Re = T.cameras;
      ue(T, Me);
      for (let Le = 0; Le < Re.length; Le++)
        ue(Re[Le], Me);
      Re.length === 2 ? O(T, I, Y) : T.projectionMatrix.copy(I.projectionMatrix), ae(K, T, Me);
    };
    function ae(K, ce, pe) {
      pe === null ? K.matrix.copy(ce.matrixWorld) : (K.matrix.copy(pe.matrixWorld), K.matrix.invert(), K.matrix.multiply(ce.matrixWorld)), K.matrix.decompose(K.position, K.quaternion, K.scale), K.updateMatrixWorld(!0), K.projectionMatrix.copy(ce.projectionMatrix), K.projectionMatrixInverse.copy(ce.projectionMatrixInverse), K.isPerspectiveCamera && (K.fov = po * 2 * Math.atan(1 / K.projectionMatrix.elements[5]), K.zoom = 1);
    }
    this.getCamera = function() {
      return T;
    }, this.getFoveation = function() {
      if (!(v === null && S === null))
        return f;
    }, this.setFoveation = function(K) {
      f = K, v !== null && (v.fixedFoveation = K), S !== null && S.fixedFoveation !== void 0 && (S.fixedFoveation = K);
    }, this.hasDepthSensing = function() {
      return E.texture !== null;
    }, this.getDepthSensingMesh = function() {
      return E.getMesh(T);
    };
    let U = null;
    function oe(K, ce) {
      if (m = ce.getViewerPose(h || u), y = ce, m !== null) {
        const pe = m.views;
        S !== null && (e.setRenderTargetFramebuffer(L, S.framebuffer), e.setRenderTarget(L));
        let Me = !1;
        pe.length !== T.cameras.length && (T.cameras.length = 0, Me = !0);
        for (let Le = 0; Le < pe.length; Le++) {
          const Je = pe[Le];
          let ft = null;
          if (S !== null)
            ft = S.getViewport(Je);
          else {
            const B = _.getViewSubImage(v, Je);
            ft = B.viewport, Le === 0 && (e.setRenderTargetTextures(
              L,
              B.colorTexture,
              v.ignoreDepthValues ? void 0 : B.depthStencilTexture
            ), e.setRenderTarget(L));
          }
          let at = ve[Le];
          at === void 0 && (at = new Rn(), at.layers.enable(Le), at.viewport = new Lt(), ve[Le] = at), at.matrix.fromArray(Je.transform.matrix), at.matrix.decompose(at.position, at.quaternion, at.scale), at.projectionMatrix.fromArray(Je.projectionMatrix), at.projectionMatrixInverse.copy(at.projectionMatrix).invert(), at.viewport.set(ft.x, ft.y, ft.width, ft.height), Le === 0 && (T.matrix.copy(at.matrix), T.matrix.decompose(T.position, T.quaternion, T.scale)), Me === !0 && T.cameras.push(at);
        }
        const Re = o.enabledFeatures;
        if (Re && Re.includes("depth-sensing")) {
          const Le = _.getDepthInformation(pe[0]);
          Le && Le.isValid && Le.texture && E.init(e, Le, o.renderState);
        }
      }
      for (let pe = 0; pe < R.length; pe++) {
        const Me = D[pe], Re = R[pe];
        Me !== null && Re !== void 0 && Re.update(Me, ce, h || u);
      }
      U && U(K, ce), ce.detectedPlanes && r.dispatchEvent({ type: "planesdetected", data: ce }), y = null;
    }
    const Fe = new ug();
    Fe.setAnimationLoop(oe), this.setAnimationLoop = function(K) {
      U = K;
    }, this.dispose = function() {
    };
  }
}
const Qr = /* @__PURE__ */ new ai(), AE = /* @__PURE__ */ new Rt();
function CE(s, e) {
  function t(x, M) {
    x.matrixAutoUpdate === !0 && x.updateMatrix(), M.value.copy(x.matrix);
  }
  function r(x, M) {
    M.color.getRGB(x.fogColor.value, ag(s)), M.isFog ? (x.fogNear.value = M.near, x.fogFar.value = M.far) : M.isFogExp2 && (x.fogDensity.value = M.density);
  }
  function o(x, M, L, R, D) {
    M.isMeshBasicMaterial || M.isMeshLambertMaterial ? l(x, M) : M.isMeshToonMaterial ? (l(x, M), _(x, M)) : M.isMeshPhongMaterial ? (l(x, M), m(x, M)) : M.isMeshStandardMaterial ? (l(x, M), v(x, M), M.isMeshPhysicalMaterial && S(x, M, D)) : M.isMeshMatcapMaterial ? (l(x, M), y(x, M)) : M.isMeshDepthMaterial ? l(x, M) : M.isMeshDistanceMaterial ? (l(x, M), E(x, M)) : M.isMeshNormalMaterial ? l(x, M) : M.isLineBasicMaterial ? (u(x, M), M.isLineDashedMaterial && d(x, M)) : M.isPointsMaterial ? f(x, M, L, R) : M.isSpriteMaterial ? h(x, M) : M.isShadowMaterial ? (x.color.value.copy(M.color), x.opacity.value = M.opacity) : M.isShaderMaterial && (M.uniformsNeedUpdate = !1);
  }
  function l(x, M) {
    x.opacity.value = M.opacity, M.color && x.diffuse.value.copy(M.color), M.emissive && x.emissive.value.copy(M.emissive).multiplyScalar(M.emissiveIntensity), M.map && (x.map.value = M.map, t(M.map, x.mapTransform)), M.alphaMap && (x.alphaMap.value = M.alphaMap, t(M.alphaMap, x.alphaMapTransform)), M.bumpMap && (x.bumpMap.value = M.bumpMap, t(M.bumpMap, x.bumpMapTransform), x.bumpScale.value = M.bumpScale, M.side === zn && (x.bumpScale.value *= -1)), M.normalMap && (x.normalMap.value = M.normalMap, t(M.normalMap, x.normalMapTransform), x.normalScale.value.copy(M.normalScale), M.side === zn && x.normalScale.value.negate()), M.displacementMap && (x.displacementMap.value = M.displacementMap, t(M.displacementMap, x.displacementMapTransform), x.displacementScale.value = M.displacementScale, x.displacementBias.value = M.displacementBias), M.emissiveMap && (x.emissiveMap.value = M.emissiveMap, t(M.emissiveMap, x.emissiveMapTransform)), M.specularMap && (x.specularMap.value = M.specularMap, t(M.specularMap, x.specularMapTransform)), M.alphaTest > 0 && (x.alphaTest.value = M.alphaTest);
    const L = e.get(M), R = L.envMap, D = L.envMapRotation;
    R && (x.envMap.value = R, Qr.copy(D), Qr.x *= -1, Qr.y *= -1, Qr.z *= -1, R.isCubeTexture && R.isRenderTargetTexture === !1 && (Qr.y *= -1, Qr.z *= -1), x.envMapRotation.value.setFromMatrix4(AE.makeRotationFromEuler(Qr)), x.flipEnvMap.value = R.isCubeTexture && R.isRenderTargetTexture === !1 ? -1 : 1, x.reflectivity.value = M.reflectivity, x.ior.value = M.ior, x.refractionRatio.value = M.refractionRatio), M.lightMap && (x.lightMap.value = M.lightMap, x.lightMapIntensity.value = M.lightMapIntensity, t(M.lightMap, x.lightMapTransform)), M.aoMap && (x.aoMap.value = M.aoMap, x.aoMapIntensity.value = M.aoMapIntensity, t(M.aoMap, x.aoMapTransform));
  }
  function u(x, M) {
    x.diffuse.value.copy(M.color), x.opacity.value = M.opacity, M.map && (x.map.value = M.map, t(M.map, x.mapTransform));
  }
  function d(x, M) {
    x.dashSize.value = M.dashSize, x.totalSize.value = M.dashSize + M.gapSize, x.scale.value = M.scale;
  }
  function f(x, M, L, R) {
    x.diffuse.value.copy(M.color), x.opacity.value = M.opacity, x.size.value = M.size * L, x.scale.value = R * 0.5, M.map && (x.map.value = M.map, t(M.map, x.uvTransform)), M.alphaMap && (x.alphaMap.value = M.alphaMap, t(M.alphaMap, x.alphaMapTransform)), M.alphaTest > 0 && (x.alphaTest.value = M.alphaTest);
  }
  function h(x, M) {
    x.diffuse.value.copy(M.color), x.opacity.value = M.opacity, x.rotation.value = M.rotation, M.map && (x.map.value = M.map, t(M.map, x.mapTransform)), M.alphaMap && (x.alphaMap.value = M.alphaMap, t(M.alphaMap, x.alphaMapTransform)), M.alphaTest > 0 && (x.alphaTest.value = M.alphaTest);
  }
  function m(x, M) {
    x.specular.value.copy(M.specular), x.shininess.value = Math.max(M.shininess, 1e-4);
  }
  function _(x, M) {
    M.gradientMap && (x.gradientMap.value = M.gradientMap);
  }
  function v(x, M) {
    x.metalness.value = M.metalness, M.metalnessMap && (x.metalnessMap.value = M.metalnessMap, t(M.metalnessMap, x.metalnessMapTransform)), x.roughness.value = M.roughness, M.roughnessMap && (x.roughnessMap.value = M.roughnessMap, t(M.roughnessMap, x.roughnessMapTransform)), M.envMap && (x.envMapIntensity.value = M.envMapIntensity);
  }
  function S(x, M, L) {
    x.ior.value = M.ior, M.sheen > 0 && (x.sheenColor.value.copy(M.sheenColor).multiplyScalar(M.sheen), x.sheenRoughness.value = M.sheenRoughness, M.sheenColorMap && (x.sheenColorMap.value = M.sheenColorMap, t(M.sheenColorMap, x.sheenColorMapTransform)), M.sheenRoughnessMap && (x.sheenRoughnessMap.value = M.sheenRoughnessMap, t(M.sheenRoughnessMap, x.sheenRoughnessMapTransform))), M.clearcoat > 0 && (x.clearcoat.value = M.clearcoat, x.clearcoatRoughness.value = M.clearcoatRoughness, M.clearcoatMap && (x.clearcoatMap.value = M.clearcoatMap, t(M.clearcoatMap, x.clearcoatMapTransform)), M.clearcoatRoughnessMap && (x.clearcoatRoughnessMap.value = M.clearcoatRoughnessMap, t(M.clearcoatRoughnessMap, x.clearcoatRoughnessMapTransform)), M.clearcoatNormalMap && (x.clearcoatNormalMap.value = M.clearcoatNormalMap, t(M.clearcoatNormalMap, x.clearcoatNormalMapTransform), x.clearcoatNormalScale.value.copy(M.clearcoatNormalScale), M.side === zn && x.clearcoatNormalScale.value.negate())), M.dispersion > 0 && (x.dispersion.value = M.dispersion), M.iridescence > 0 && (x.iridescence.value = M.iridescence, x.iridescenceIOR.value = M.iridescenceIOR, x.iridescenceThicknessMinimum.value = M.iridescenceThicknessRange[0], x.iridescenceThicknessMaximum.value = M.iridescenceThicknessRange[1], M.iridescenceMap && (x.iridescenceMap.value = M.iridescenceMap, t(M.iridescenceMap, x.iridescenceMapTransform)), M.iridescenceThicknessMap && (x.iridescenceThicknessMap.value = M.iridescenceThicknessMap, t(M.iridescenceThicknessMap, x.iridescenceThicknessMapTransform))), M.transmission > 0 && (x.transmission.value = M.transmission, x.transmissionSamplerMap.value = L.texture, x.transmissionSamplerSize.value.set(L.width, L.height), M.transmissionMap && (x.transmissionMap.value = M.transmissionMap, t(M.transmissionMap, x.transmissionMapTransform)), x.thickness.value = M.thickness, M.thicknessMap && (x.thicknessMap.value = M.thicknessMap, t(M.thicknessMap, x.thicknessMapTransform)), x.attenuationDistance.value = M.attenuationDistance, x.attenuationColor.value.copy(M.attenuationColor)), M.anisotropy > 0 && (x.anisotropyVector.value.set(M.anisotropy * Math.cos(M.anisotropyRotation), M.anisotropy * Math.sin(M.anisotropyRotation)), M.anisotropyMap && (x.anisotropyMap.value = M.anisotropyMap, t(M.anisotropyMap, x.anisotropyMapTransform))), x.specularIntensity.value = M.specularIntensity, x.specularColor.value.copy(M.specularColor), M.specularColorMap && (x.specularColorMap.value = M.specularColorMap, t(M.specularColorMap, x.specularColorMapTransform)), M.specularIntensityMap && (x.specularIntensityMap.value = M.specularIntensityMap, t(M.specularIntensityMap, x.specularIntensityMapTransform));
  }
  function y(x, M) {
    M.matcap && (x.matcap.value = M.matcap);
  }
  function E(x, M) {
    const L = e.get(M).light;
    x.referencePosition.value.setFromMatrixPosition(L.matrixWorld), x.nearDistance.value = L.shadow.camera.near, x.farDistance.value = L.shadow.camera.far;
  }
  return {
    refreshFogUniforms: r,
    refreshMaterialUniforms: o
  };
}
function RE(s, e, t, r) {
  let o = {}, l = {}, u = [];
  const d = s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);
  function f(L, R) {
    const D = R.program;
    r.uniformBlockBinding(L, D);
  }
  function h(L, R) {
    let D = o[L.id];
    D === void 0 && (y(L), D = m(L), o[L.id] = D, L.addEventListener("dispose", x));
    const ee = R.program;
    r.updateUBOMapping(L, ee);
    const F = e.render.frame;
    l[L.id] !== F && (v(L), l[L.id] = F);
  }
  function m(L) {
    const R = _();
    L.__bindingPointIndex = R;
    const D = s.createBuffer(), ee = L.__size, F = L.usage;
    return s.bindBuffer(s.UNIFORM_BUFFER, D), s.bufferData(s.UNIFORM_BUFFER, ee, F), s.bindBuffer(s.UNIFORM_BUFFER, null), s.bindBufferBase(s.UNIFORM_BUFFER, R, D), D;
  }
  function _() {
    for (let L = 0; L < d; L++)
      if (u.indexOf(L) === -1)
        return u.push(L), L;
    return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function v(L) {
    const R = o[L.id], D = L.uniforms, ee = L.__cache;
    s.bindBuffer(s.UNIFORM_BUFFER, R);
    for (let F = 0, I = D.length; F < I; F++) {
      const Y = Array.isArray(D[F]) ? D[F] : [D[F]];
      for (let ve = 0, T = Y.length; ve < T; ve++) {
        const C = Y[ve];
        if (S(C, F, ve, ee) === !0) {
          const te = C.__offset, J = Array.isArray(C.value) ? C.value : [C.value];
          let se = 0;
          for (let _e = 0; _e < J.length; _e++) {
            const Z = J[_e], he = E(Z);
            typeof Z == "number" || typeof Z == "boolean" ? (C.__data[0] = Z, s.bufferSubData(s.UNIFORM_BUFFER, te + se, C.__data)) : Z.isMatrix3 ? (C.__data[0] = Z.elements[0], C.__data[1] = Z.elements[1], C.__data[2] = Z.elements[2], C.__data[3] = 0, C.__data[4] = Z.elements[3], C.__data[5] = Z.elements[4], C.__data[6] = Z.elements[5], C.__data[7] = 0, C.__data[8] = Z.elements[6], C.__data[9] = Z.elements[7], C.__data[10] = Z.elements[8], C.__data[11] = 0) : (Z.toArray(C.__data, se), se += he.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          s.bufferSubData(s.UNIFORM_BUFFER, te, C.__data);
        }
      }
    }
    s.bindBuffer(s.UNIFORM_BUFFER, null);
  }
  function S(L, R, D, ee) {
    const F = L.value, I = R + "_" + D;
    if (ee[I] === void 0)
      return typeof F == "number" || typeof F == "boolean" ? ee[I] = F : ee[I] = F.clone(), !0;
    {
      const Y = ee[I];
      if (typeof F == "number" || typeof F == "boolean") {
        if (Y !== F)
          return ee[I] = F, !0;
      } else if (Y.equals(F) === !1)
        return Y.copy(F), !0;
    }
    return !1;
  }
  function y(L) {
    const R = L.uniforms;
    let D = 0;
    const ee = 16;
    for (let I = 0, Y = R.length; I < Y; I++) {
      const ve = Array.isArray(R[I]) ? R[I] : [R[I]];
      for (let T = 0, C = ve.length; T < C; T++) {
        const te = ve[T], J = Array.isArray(te.value) ? te.value : [te.value];
        for (let se = 0, _e = J.length; se < _e; se++) {
          const Z = J[se], he = E(Z), O = D % ee, ue = O % he.boundary, ae = O + ue;
          D += ue, ae !== 0 && ee - ae < he.storage && (D += ee - ae), te.__data = new Float32Array(he.storage / Float32Array.BYTES_PER_ELEMENT), te.__offset = D, D += he.storage;
        }
      }
    }
    const F = D % ee;
    return F > 0 && (D += ee - F), L.__size = D, L.__cache = {}, this;
  }
  function E(L) {
    const R = {
      boundary: 0,
      // bytes
      storage: 0
      // bytes
    };
    return typeof L == "number" || typeof L == "boolean" ? (R.boundary = 4, R.storage = 4) : L.isVector2 ? (R.boundary = 8, R.storage = 8) : L.isVector3 || L.isColor ? (R.boundary = 16, R.storage = 12) : L.isVector4 ? (R.boundary = 16, R.storage = 16) : L.isMatrix3 ? (R.boundary = 48, R.storage = 48) : L.isMatrix4 ? (R.boundary = 64, R.storage = 64) : L.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", L), R;
  }
  function x(L) {
    const R = L.target;
    R.removeEventListener("dispose", x);
    const D = u.indexOf(R.__bindingPointIndex);
    u.splice(D, 1), s.deleteBuffer(o[R.id]), delete o[R.id], delete l[R.id];
  }
  function M() {
    for (const L in o)
      s.deleteBuffer(o[L]);
    u = [], o = {}, l = {};
  }
  return {
    bind: f,
    update: h,
    dispose: M
  };
}
class PE {
  constructor(e = {}) {
    const {
      canvas: t = _x(),
      context: r = null,
      depth: o = !0,
      stencil: l = !1,
      alpha: u = !1,
      antialias: d = !1,
      premultipliedAlpha: f = !0,
      preserveDrawingBuffer: h = !1,
      powerPreference: m = "default",
      failIfMajorPerformanceCaveat: _ = !1
    } = e;
    this.isWebGLRenderer = !0;
    let v;
    if (r !== null) {
      if (typeof WebGLRenderingContext < "u" && r instanceof WebGLRenderingContext)
        throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      v = r.getContextAttributes().alpha;
    } else
      v = u;
    const S = new Uint32Array(4), y = new Int32Array(4);
    let E = null, x = null;
    const M = [], L = [];
    this.domElement = t, this.debug = {
      /**
       * Enables error checking and reporting when shader programs are being compiled
       * @type {boolean}
       */
      checkShaderErrors: !0,
      /**
       * Callback for custom error reporting.
       * @type {?Function}
       */
      onShaderError: null
    }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this._outputColorSpace = yn, this.toneMapping = Pr, this.toneMappingExposure = 1;
    const R = this;
    let D = !1, ee = 0, F = 0, I = null, Y = -1, ve = null;
    const T = new Lt(), C = new Lt();
    let te = null;
    const J = new lt(0);
    let se = 0, _e = t.width, Z = t.height, he = 1, O = null, ue = null;
    const ae = new Lt(0, 0, _e, Z), U = new Lt(0, 0, _e, Z);
    let oe = !1;
    const Fe = new zf();
    let K = !1, ce = !1;
    const pe = new Rt(), Me = new Rt(), Re = new z(), Le = new Lt(), Je = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: !0 };
    let ft = !1;
    function at() {
      return I === null ? he : 1;
    }
    let B = r;
    function qt(A, X) {
      return t.getContext(A, X);
    }
    try {
      const A = {
        alpha: !0,
        depth: o,
        stencil: l,
        antialias: d,
        premultipliedAlpha: f,
        preserveDrawingBuffer: h,
        powerPreference: m,
        failIfMajorPerformanceCaveat: _
      };
      if ("setAttribute" in t && t.setAttribute("data-engine", `three.js r${Rf}`), t.addEventListener("webglcontextlost", ge, !1), t.addEventListener("webglcontextrestored", De, !1), t.addEventListener("webglcontextcreationerror", ze, !1), B === null) {
        const X = "webgl2";
        if (B = qt(X, A), B === null)
          throw qt(X) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
    } catch (A) {
      throw console.error("THREE.WebGLRenderer: " + A.message), A;
    }
    let ht, ct, Ze, Ce, ke, P, b, $, fe, xe, de, Xe, Pe, Oe, vt, we, Ue, rt, it, H, me, $e, pt, V;
    function Ie() {
      ht = new U1(B), ht.init(), $e = new yE(B, ht), ct = new R1(B, ht, e, $e), Ze = new vE(B), ct.reverseDepthBuffer && Ze.buffers.depth.setReversed(!0), Ce = new O1(B), ke = new nE(), P = new xE(B, ht, Ze, ke, ct, $e, Ce), b = new L1(R), $ = new I1(R), fe = new Xx(B), pt = new A1(B, fe), xe = new F1(B, fe, Ce, pt), de = new z1(B, xe, fe, Ce), it = new B1(B, ct, P), we = new P1(ke), Xe = new tE(R, b, $, ht, ct, pt, we), Pe = new CE(R, ke), Oe = new rE(), vt = new uE(ht), rt = new b1(R, b, $, Ze, de, v, f), Ue = new mE(R, de, ct), V = new RE(B, Ce, ct, Ze), H = new C1(B, ht, Ce), me = new k1(B, ht, Ce), Ce.programs = Xe.programs, R.capabilities = ct, R.extensions = ht, R.properties = ke, R.renderLists = Oe, R.shadowMap = Ue, R.state = Ze, R.info = Ce;
    }
    Ie();
    const le = new bE(R, B);
    this.xr = le, this.getContext = function() {
      return B;
    }, this.getContextAttributes = function() {
      return B.getContextAttributes();
    }, this.forceContextLoss = function() {
      const A = ht.get("WEBGL_lose_context");
      A && A.loseContext();
    }, this.forceContextRestore = function() {
      const A = ht.get("WEBGL_lose_context");
      A && A.restoreContext();
    }, this.getPixelRatio = function() {
      return he;
    }, this.setPixelRatio = function(A) {
      A !== void 0 && (he = A, this.setSize(_e, Z, !1));
    }, this.getSize = function(A) {
      return A.set(_e, Z);
    }, this.setSize = function(A, X, ne = !0) {
      if (le.isPresenting) {
        console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      _e = A, Z = X, t.width = Math.floor(A * he), t.height = Math.floor(X * he), ne === !0 && (t.style.width = A + "px", t.style.height = X + "px"), this.setViewport(0, 0, A, X);
    }, this.getDrawingBufferSize = function(A) {
      return A.set(_e * he, Z * he).floor();
    }, this.setDrawingBufferSize = function(A, X, ne) {
      _e = A, Z = X, he = ne, t.width = Math.floor(A * ne), t.height = Math.floor(X * ne), this.setViewport(0, 0, A, X);
    }, this.getCurrentViewport = function(A) {
      return A.copy(T);
    }, this.getViewport = function(A) {
      return A.copy(ae);
    }, this.setViewport = function(A, X, ne, ie) {
      A.isVector4 ? ae.set(A.x, A.y, A.z, A.w) : ae.set(A, X, ne, ie), Ze.viewport(T.copy(ae).multiplyScalar(he).round());
    }, this.getScissor = function(A) {
      return A.copy(U);
    }, this.setScissor = function(A, X, ne, ie) {
      A.isVector4 ? U.set(A.x, A.y, A.z, A.w) : U.set(A, X, ne, ie), Ze.scissor(C.copy(U).multiplyScalar(he).round());
    }, this.getScissorTest = function() {
      return oe;
    }, this.setScissorTest = function(A) {
      Ze.setScissorTest(oe = A);
    }, this.setOpaqueSort = function(A) {
      O = A;
    }, this.setTransparentSort = function(A) {
      ue = A;
    }, this.getClearColor = function(A) {
      return A.copy(rt.getClearColor());
    }, this.setClearColor = function() {
      rt.setClearColor.apply(rt, arguments);
    }, this.getClearAlpha = function() {
      return rt.getClearAlpha();
    }, this.setClearAlpha = function() {
      rt.setClearAlpha.apply(rt, arguments);
    }, this.clear = function(A = !0, X = !0, ne = !0) {
      let ie = 0;
      if (A) {
        let j = !1;
        if (I !== null) {
          const be = I.texture.format;
          j = be === kf || be === Ff || be === Uf;
        }
        if (j) {
          const be = I.texture.type, Be = be === Ji || be === os || be === _a || be === fo || be === Df || be === Nf, Ae = rt.getClearColor(), Ye = rt.getClearAlpha(), nt = Ae.r, st = Ae.g, qe = Ae.b;
          Be ? (S[0] = nt, S[1] = st, S[2] = qe, S[3] = Ye, B.clearBufferuiv(B.COLOR, 0, S)) : (y[0] = nt, y[1] = st, y[2] = qe, y[3] = Ye, B.clearBufferiv(B.COLOR, 0, y));
        } else
          ie |= B.COLOR_BUFFER_BIT;
      }
      X && (ie |= B.DEPTH_BUFFER_BIT, B.clearDepth(this.capabilities.reverseDepthBuffer ? 0 : 1)), ne && (ie |= B.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), B.clear(ie);
    }, this.clearColor = function() {
      this.clear(!0, !1, !1);
    }, this.clearDepth = function() {
      this.clear(!1, !0, !1);
    }, this.clearStencil = function() {
      this.clear(!1, !1, !0);
    }, this.dispose = function() {
      t.removeEventListener("webglcontextlost", ge, !1), t.removeEventListener("webglcontextrestored", De, !1), t.removeEventListener("webglcontextcreationerror", ze, !1), Oe.dispose(), vt.dispose(), ke.dispose(), b.dispose(), $.dispose(), de.dispose(), pt.dispose(), V.dispose(), Xe.dispose(), le.dispose(), le.removeEventListener("sessionstart", er), le.removeEventListener("sessionend", us), Hn.stop();
    };
    function ge(A) {
      A.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), D = !0;
    }
    function De() {
      console.log("THREE.WebGLRenderer: Context Restored."), D = !1;
      const A = Ce.autoReset, X = Ue.enabled, ne = Ue.autoUpdate, ie = Ue.needsUpdate, j = Ue.type;
      Ie(), Ce.autoReset = A, Ue.enabled = X, Ue.autoUpdate = ne, Ue.needsUpdate = ie, Ue.type = j;
    }
    function ze(A) {
      console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", A.statusMessage);
    }
    function _t(A) {
      const X = A.target;
      X.removeEventListener("dispose", _t), zt(X);
    }
    function zt(A) {
      cn(A), ke.remove(A);
    }
    function cn(A) {
      const X = ke.get(A).programs;
      X !== void 0 && (X.forEach(function(ne) {
        Xe.releaseProgram(ne);
      }), A.isShaderMaterial && Xe.releaseShaderCache(A));
    }
    this.renderBufferDirect = function(A, X, ne, ie, j, be) {
      X === null && (X = Je);
      const Be = j.isMesh && j.matrixWorld.determinant() < 0, Ae = Di(A, X, ne, ie, j);
      Ze.setMaterial(ie, Be);
      let Ye = ne.index, nt = 1;
      if (ie.wireframe === !0) {
        if (Ye = xe.getWireframeAttribute(ne), Ye === void 0) return;
        nt = 2;
      }
      const st = ne.drawRange, qe = ne.attributes.position;
      let wt = st.start * nt, Pt = (st.start + st.count) * nt;
      be !== null && (wt = Math.max(wt, be.start * nt), Pt = Math.min(Pt, (be.start + be.count) * nt)), Ye !== null ? (wt = Math.max(wt, 0), Pt = Math.min(Pt, Ye.count)) : qe != null && (wt = Math.max(wt, 0), Pt = Math.min(Pt, qe.count));
      const Dt = Pt - wt;
      if (Dt < 0 || Dt === 1 / 0) return;
      pt.setup(j, ie, Ae, ne, Ye);
      let Ot, St = H;
      if (Ye !== null && (Ot = fe.get(Ye), St = me, St.setIndex(Ot)), j.isMesh)
        ie.wireframe === !0 ? (Ze.setLineWidth(ie.wireframeLinewidth * at()), St.setMode(B.LINES)) : St.setMode(B.TRIANGLES);
      else if (j.isLine) {
        let Ve = ie.linewidth;
        Ve === void 0 && (Ve = 1), Ze.setLineWidth(Ve * at()), j.isLineSegments ? St.setMode(B.LINES) : j.isLineLoop ? St.setMode(B.LINE_LOOP) : St.setMode(B.LINE_STRIP);
      } else j.isPoints ? St.setMode(B.POINTS) : j.isSprite && St.setMode(B.TRIANGLES);
      if (j.isBatchedMesh)
        if (j._multiDrawInstances !== null)
          St.renderMultiDrawInstances(j._multiDrawStarts, j._multiDrawCounts, j._multiDrawCount, j._multiDrawInstances);
        else if (ht.get("WEBGL_multi_draw"))
          St.renderMultiDraw(j._multiDrawStarts, j._multiDrawCounts, j._multiDrawCount);
        else {
          const Ve = j._multiDrawStarts, $t = j._multiDrawCounts, Mt = j._multiDrawCount, Vn = Ye ? fe.get(Ye).bytesPerElement : 1, li = ke.get(ie).currentProgram.getUniforms();
          for (let rn = 0; rn < Mt; rn++)
            li.setValue(B, "_gl_DrawID", rn), St.render(Ve[rn] / Vn, $t[rn]);
        }
      else if (j.isInstancedMesh)
        St.renderInstances(wt, Dt, j.count);
      else if (ne.isInstancedBufferGeometry) {
        const Ve = ne._maxInstanceCount !== void 0 ? ne._maxInstanceCount : 1 / 0, $t = Math.min(ne.instanceCount, Ve);
        St.renderInstances(wt, Dt, $t);
      } else
        St.render(wt, Dt);
    };
    function xt(A, X, ne) {
      A.transparent === !0 && A.side === $n && A.forceSinglePass === !1 ? (A.side = zn, A.needsUpdate = !0, fs(A, X, ne), A.side = Lr, A.needsUpdate = !0, fs(A, X, ne), A.side = $n) : fs(A, X, ne);
    }
    this.compile = function(A, X, ne = null) {
      ne === null && (ne = A), x = vt.get(ne), x.init(X), L.push(x), ne.traverseVisible(function(j) {
        j.isLight && j.layers.test(X.layers) && (x.pushLight(j), j.castShadow && x.pushShadow(j));
      }), A !== ne && A.traverseVisible(function(j) {
        j.isLight && j.layers.test(X.layers) && (x.pushLight(j), j.castShadow && x.pushShadow(j));
      }), x.setupLights();
      const ie = /* @__PURE__ */ new Set();
      return A.traverse(function(j) {
        if (!(j.isMesh || j.isPoints || j.isLine || j.isSprite))
          return;
        const be = j.material;
        if (be)
          if (Array.isArray(be))
            for (let Be = 0; Be < be.length; Be++) {
              const Ae = be[Be];
              xt(Ae, ne, j), ie.add(Ae);
            }
          else
            xt(be, ne, j), ie.add(be);
      }), L.pop(), x = null, ie;
    }, this.compileAsync = function(A, X, ne = null) {
      const ie = this.compile(A, X, ne);
      return new Promise((j) => {
        function be() {
          if (ie.forEach(function(Be) {
            ke.get(Be).currentProgram.isReady() && ie.delete(Be);
          }), ie.size === 0) {
            j(A);
            return;
          }
          setTimeout(be, 10);
        }
        ht.get("KHR_parallel_shader_compile") !== null ? be() : setTimeout(be, 10);
      });
    };
    let nn = null;
    function Zn(A) {
      nn && nn(A);
    }
    function er() {
      Hn.stop();
    }
    function us() {
      Hn.start();
    }
    const Hn = new ug();
    Hn.setAnimationLoop(Zn), typeof self < "u" && Hn.setContext(self), this.setAnimationLoop = function(A) {
      nn = A, le.setAnimationLoop(A), A === null ? Hn.stop() : Hn.start();
    }, le.addEventListener("sessionstart", er), le.addEventListener("sessionend", us), this.render = function(A, X) {
      if (X !== void 0 && X.isCamera !== !0) {
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (D === !0) return;
      if (A.matrixWorldAutoUpdate === !0 && A.updateMatrixWorld(), X.parent === null && X.matrixWorldAutoUpdate === !0 && X.updateMatrixWorld(), le.enabled === !0 && le.isPresenting === !0 && (le.cameraAutoUpdate === !0 && le.updateCamera(X), X = le.getCamera()), A.isScene === !0 && A.onBeforeRender(R, A, X, I), x = vt.get(A, L.length), x.init(X), L.push(x), Me.multiplyMatrices(X.projectionMatrix, X.matrixWorldInverse), Fe.setFromProjectionMatrix(Me), ce = this.localClippingEnabled, K = we.init(this.clippingPlanes, ce), E = Oe.get(A, M.length), E.init(), M.push(E), le.enabled === !0 && le.isPresenting === !0) {
        const be = R.xr.getDepthSensingMesh();
        be !== null && Mo(be, X, -1 / 0, R.sortObjects);
      }
      Mo(A, X, 0, R.sortObjects), E.finish(), R.sortObjects === !0 && E.sort(O, ue), ft = le.enabled === !1 || le.isPresenting === !1 || le.hasDepthSensing() === !1, ft && rt.addToRenderList(E, A), this.info.render.frame++, K === !0 && we.beginShadows();
      const ne = x.state.shadowsArray;
      Ue.render(ne, A, X), K === !0 && we.endShadows(), this.info.autoReset === !0 && this.info.reset();
      const ie = E.opaque, j = E.transmissive;
      if (x.setupLights(), X.isArrayCamera) {
        const be = X.cameras;
        if (j.length > 0)
          for (let Be = 0, Ae = be.length; Be < Ae; Be++) {
            const Ye = be[Be];
            Ir(ie, j, A, Ye);
          }
        ft && rt.render(A);
        for (let Be = 0, Ae = be.length; Be < Ae; Be++) {
          const Ye = be[Be];
          tr(E, A, Ye, Ye.viewport);
        }
      } else
        j.length > 0 && Ir(ie, j, A, X), ft && rt.render(A), tr(E, A, X);
      I !== null && (P.updateMultisampleRenderTarget(I), P.updateRenderTargetMipmap(I)), A.isScene === !0 && A.onAfterRender(R, A, X), pt.resetDefaultState(), Y = -1, ve = null, L.pop(), L.length > 0 ? (x = L[L.length - 1], K === !0 && we.setGlobalState(R.clippingPlanes, x.state.camera)) : x = null, M.pop(), M.length > 0 ? E = M[M.length - 1] : E = null;
    };
    function Mo(A, X, ne, ie) {
      if (A.visible === !1) return;
      if (A.layers.test(X.layers)) {
        if (A.isGroup)
          ne = A.renderOrder;
        else if (A.isLOD)
          A.autoUpdate === !0 && A.update(X);
        else if (A.isLight)
          x.pushLight(A), A.castShadow && x.pushShadow(A);
        else if (A.isSprite) {
          if (!A.frustumCulled || Fe.intersectsSprite(A)) {
            ie && Le.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Me);
            const Be = de.update(A), Ae = A.material;
            Ae.visible && E.push(A, Be, Ae, ne, Le.z, null);
          }
        } else if ((A.isMesh || A.isLine || A.isPoints) && (!A.frustumCulled || Fe.intersectsObject(A))) {
          const Be = de.update(A), Ae = A.material;
          if (ie && (A.boundingSphere !== void 0 ? (A.boundingSphere === null && A.computeBoundingSphere(), Le.copy(A.boundingSphere.center)) : (Be.boundingSphere === null && Be.computeBoundingSphere(), Le.copy(Be.boundingSphere.center)), Le.applyMatrix4(A.matrixWorld).applyMatrix4(Me)), Array.isArray(Ae)) {
            const Ye = Be.groups;
            for (let nt = 0, st = Ye.length; nt < st; nt++) {
              const qe = Ye[nt], wt = Ae[qe.materialIndex];
              wt && wt.visible && E.push(A, Be, wt, ne, Le.z, qe);
            }
          } else Ae.visible && E.push(A, Be, Ae, ne, Le.z, null);
        }
      }
      const be = A.children;
      for (let Be = 0, Ae = be.length; Be < Ae; Be++)
        Mo(be[Be], X, ne, ie);
    }
    function tr(A, X, ne, ie) {
      const j = A.opaque, be = A.transmissive, Be = A.transparent;
      x.setupLightsView(ne), K === !0 && we.setGlobalState(R.clippingPlanes, ne), ie && Ze.viewport(T.copy(ie)), j.length > 0 && Li(j, X, ne), be.length > 0 && Li(be, X, ne), Be.length > 0 && Li(Be, X, ne), Ze.buffers.depth.setTest(!0), Ze.buffers.depth.setMask(!0), Ze.buffers.color.setMask(!0), Ze.setPolygonOffset(!1);
    }
    function Ir(A, X, ne, ie) {
      if ((ne.isScene === !0 ? ne.overrideMaterial : null) !== null)
        return;
      x.state.transmissionRenderTarget[ie.id] === void 0 && (x.state.transmissionRenderTarget[ie.id] = new oi(1, 1, {
        generateMipmaps: !0,
        type: ht.has("EXT_color_buffer_half_float") || ht.has("EXT_color_buffer_float") ? Ri : Ji,
        minFilter: ss,
        samples: 4,
        stencilBuffer: l,
        resolveDepthBuffer: !1,
        resolveStencilBuffer: !1,
        colorSpace: Tt.workingColorSpace
      }));
      const be = x.state.transmissionRenderTarget[ie.id], Be = ie.viewport || T;
      be.setSize(Be.z, Be.w);
      const Ae = R.getRenderTarget();
      R.setRenderTarget(be), R.getClearColor(J), se = R.getClearAlpha(), se < 1 && R.setClearColor(16777215, 0.5), R.clear(), ft && rt.render(ne);
      const Ye = R.toneMapping;
      R.toneMapping = Pr;
      const nt = ie.viewport;
      if (ie.viewport !== void 0 && (ie.viewport = void 0), x.setupLightsView(ie), K === !0 && we.setGlobalState(R.clippingPlanes, ie), Li(A, ne, ie), P.updateMultisampleRenderTarget(be), P.updateRenderTargetMipmap(be), ht.has("WEBGL_multisampled_render_to_texture") === !1) {
        let st = !1;
        for (let qe = 0, wt = X.length; qe < wt; qe++) {
          const Pt = X[qe], Dt = Pt.object, Ot = Pt.geometry, St = Pt.material, Ve = Pt.group;
          if (St.side === $n && Dt.layers.test(ie.layers)) {
            const $t = St.side;
            St.side = zn, St.needsUpdate = !0, ds(Dt, ne, ie, Ot, St, Ve), St.side = $t, St.needsUpdate = !0, st = !0;
          }
        }
        st === !0 && (P.updateMultisampleRenderTarget(be), P.updateRenderTargetMipmap(be));
      }
      R.setRenderTarget(Ae), R.setClearColor(J, se), nt !== void 0 && (ie.viewport = nt), R.toneMapping = Ye;
    }
    function Li(A, X, ne) {
      const ie = X.isScene === !0 ? X.overrideMaterial : null;
      for (let j = 0, be = A.length; j < be; j++) {
        const Be = A[j], Ae = Be.object, Ye = Be.geometry, nt = ie === null ? Be.material : ie, st = Be.group;
        Ae.layers.test(ne.layers) && ds(Ae, X, ne, Ye, nt, st);
      }
    }
    function ds(A, X, ne, ie, j, be) {
      A.onBeforeRender(R, X, ne, ie, j, be), A.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse, A.matrixWorld), A.normalMatrix.getNormalMatrix(A.modelViewMatrix), j.onBeforeRender(R, X, ne, ie, A, be), j.transparent === !0 && j.side === $n && j.forceSinglePass === !1 ? (j.side = zn, j.needsUpdate = !0, R.renderBufferDirect(ne, X, ie, j, A, be), j.side = Lr, j.needsUpdate = !0, R.renderBufferDirect(ne, X, ie, j, A, be), j.side = $n) : R.renderBufferDirect(ne, X, ie, j, A, be), A.onAfterRender(R, X, ne, ie, j, be);
    }
    function fs(A, X, ne) {
      X.isScene !== !0 && (X = Je);
      const ie = ke.get(A), j = x.state.lights, be = x.state.shadowsArray, Be = j.state.version, Ae = Xe.getParameters(A, j.state, be, X, ne), Ye = Xe.getProgramCacheKey(Ae);
      let nt = ie.programs;
      ie.environment = A.isMeshStandardMaterial ? X.environment : null, ie.fog = X.fog, ie.envMap = (A.isMeshStandardMaterial ? $ : b).get(A.envMap || ie.environment), ie.envMapRotation = ie.environment !== null && A.envMap === null ? X.environmentRotation : A.envMapRotation, nt === void 0 && (A.addEventListener("dispose", _t), nt = /* @__PURE__ */ new Map(), ie.programs = nt);
      let st = nt.get(Ye);
      if (st !== void 0) {
        if (ie.currentProgram === st && ie.lightsStateVersion === Be)
          return Sa(A, Ae), st;
      } else
        Ae.uniforms = Xe.getUniforms(A), A.onBeforeCompile(Ae, R), st = Xe.acquireProgram(Ae, Ye), nt.set(Ye, st), ie.uniforms = Ae.uniforms;
      const qe = ie.uniforms;
      return (!A.isShaderMaterial && !A.isRawShaderMaterial || A.clipping === !0) && (qe.clippingPlanes = we.uniform), Sa(A, Ae), ie.needsLights = Ea(A), ie.lightsStateVersion = Be, ie.needsLights && (qe.ambientLightColor.value = j.state.ambient, qe.lightProbe.value = j.state.probe, qe.directionalLights.value = j.state.directional, qe.directionalLightShadows.value = j.state.directionalShadow, qe.spotLights.value = j.state.spot, qe.spotLightShadows.value = j.state.spotShadow, qe.rectAreaLights.value = j.state.rectArea, qe.ltc_1.value = j.state.rectAreaLTC1, qe.ltc_2.value = j.state.rectAreaLTC2, qe.pointLights.value = j.state.point, qe.pointLightShadows.value = j.state.pointShadow, qe.hemisphereLights.value = j.state.hemi, qe.directionalShadowMap.value = j.state.directionalShadowMap, qe.directionalShadowMatrix.value = j.state.directionalShadowMatrix, qe.spotShadowMap.value = j.state.spotShadowMap, qe.spotLightMatrix.value = j.state.spotLightMatrix, qe.spotLightMap.value = j.state.spotLightMap, qe.pointShadowMap.value = j.state.pointShadowMap, qe.pointShadowMatrix.value = j.state.pointShadowMatrix), ie.currentProgram = st, ie.uniformsList = null, st;
    }
    function ya(A) {
      if (A.uniformsList === null) {
        const X = A.currentProgram.getUniforms();
        A.uniformsList = rc.seqWithValue(X.seq, A.uniforms);
      }
      return A.uniformsList;
    }
    function Sa(A, X) {
      const ne = ke.get(A);
      ne.outputColorSpace = X.outputColorSpace, ne.batching = X.batching, ne.batchingColor = X.batchingColor, ne.instancing = X.instancing, ne.instancingColor = X.instancingColor, ne.instancingMorph = X.instancingMorph, ne.skinning = X.skinning, ne.morphTargets = X.morphTargets, ne.morphNormals = X.morphNormals, ne.morphColors = X.morphColors, ne.morphTargetsCount = X.morphTargetsCount, ne.numClippingPlanes = X.numClippingPlanes, ne.numIntersection = X.numClipIntersection, ne.vertexAlphas = X.vertexAlphas, ne.vertexTangents = X.vertexTangents, ne.toneMapping = X.toneMapping;
    }
    function Di(A, X, ne, ie, j) {
      X.isScene !== !0 && (X = Je), P.resetTextureUnits();
      const be = X.fog, Be = ie.isMeshStandardMaterial ? X.environment : null, Ae = I === null ? R.outputColorSpace : I.isXRRenderTarget === !0 ? I.texture.colorSpace : Nr, Ye = (ie.isMeshStandardMaterial ? $ : b).get(ie.envMap || Be), nt = ie.vertexColors === !0 && !!ne.attributes.color && ne.attributes.color.itemSize === 4, st = !!ne.attributes.tangent && (!!ie.normalMap || ie.anisotropy > 0), qe = !!ne.morphAttributes.position, wt = !!ne.morphAttributes.normal, Pt = !!ne.morphAttributes.color;
      let Dt = Pr;
      ie.toneMapped && (I === null || I.isXRRenderTarget === !0) && (Dt = R.toneMapping);
      const Ot = ne.morphAttributes.position || ne.morphAttributes.normal || ne.morphAttributes.color, St = Ot !== void 0 ? Ot.length : 0, Ve = ke.get(ie), $t = x.state.lights;
      if (K === !0 && (ce === !0 || A !== ve)) {
        const hn = A === ve && ie.id === Y;
        we.setState(ie, A, hn);
      }
      let Mt = !1;
      ie.version === Ve.__version ? (Ve.needsLights && Ve.lightsStateVersion !== $t.state.version || Ve.outputColorSpace !== Ae || j.isBatchedMesh && Ve.batching === !1 || !j.isBatchedMesh && Ve.batching === !0 || j.isBatchedMesh && Ve.batchingColor === !0 && j.colorTexture === null || j.isBatchedMesh && Ve.batchingColor === !1 && j.colorTexture !== null || j.isInstancedMesh && Ve.instancing === !1 || !j.isInstancedMesh && Ve.instancing === !0 || j.isSkinnedMesh && Ve.skinning === !1 || !j.isSkinnedMesh && Ve.skinning === !0 || j.isInstancedMesh && Ve.instancingColor === !0 && j.instanceColor === null || j.isInstancedMesh && Ve.instancingColor === !1 && j.instanceColor !== null || j.isInstancedMesh && Ve.instancingMorph === !0 && j.morphTexture === null || j.isInstancedMesh && Ve.instancingMorph === !1 && j.morphTexture !== null || Ve.envMap !== Ye || ie.fog === !0 && Ve.fog !== be || Ve.numClippingPlanes !== void 0 && (Ve.numClippingPlanes !== we.numPlanes || Ve.numIntersection !== we.numIntersection) || Ve.vertexAlphas !== nt || Ve.vertexTangents !== st || Ve.morphTargets !== qe || Ve.morphNormals !== wt || Ve.morphColors !== Pt || Ve.toneMapping !== Dt || Ve.morphTargetsCount !== St) && (Mt = !0) : (Mt = !0, Ve.__version = ie.version);
      let Vn = Ve.currentProgram;
      Mt === !0 && (Vn = fs(ie, X, j));
      let li = !1, rn = !1, Ni = !1;
      const Nt = Vn.getUniforms(), Mi = Ve.uniforms;
      if (Ze.useProgram(Vn.program) && (li = !0, rn = !0, Ni = !0), ie.id !== Y && (Y = ie.id, rn = !0), li || ve !== A) {
        ct.reverseDepthBuffer ? (pe.copy(A.projectionMatrix), yx(pe), Sx(pe), Nt.setValue(B, "projectionMatrix", pe)) : Nt.setValue(B, "projectionMatrix", A.projectionMatrix), Nt.setValue(B, "viewMatrix", A.matrixWorldInverse);
        const hn = Nt.map.cameraPosition;
        hn !== void 0 && hn.setValue(B, Re.setFromMatrixPosition(A.matrixWorld)), ct.logarithmicDepthBuffer && Nt.setValue(
          B,
          "logDepthBufFC",
          2 / (Math.log(A.far + 1) / Math.LN2)
        ), (ie.isMeshPhongMaterial || ie.isMeshToonMaterial || ie.isMeshLambertMaterial || ie.isMeshBasicMaterial || ie.isMeshStandardMaterial || ie.isShaderMaterial) && Nt.setValue(B, "isOrthographic", A.isOrthographicCamera === !0), ve !== A && (ve = A, rn = !0, Ni = !0);
      }
      if (j.isSkinnedMesh) {
        Nt.setOptional(B, j, "bindMatrix"), Nt.setOptional(B, j, "bindMatrixInverse");
        const hn = j.skeleton;
        hn && (hn.boneTexture === null && hn.computeBoneTexture(), Nt.setValue(B, "boneTexture", hn.boneTexture, P));
      }
      j.isBatchedMesh && (Nt.setOptional(B, j, "batchingTexture"), Nt.setValue(B, "batchingTexture", j._matricesTexture, P), Nt.setOptional(B, j, "batchingIdTexture"), Nt.setValue(B, "batchingIdTexture", j._indirectTexture, P), Nt.setOptional(B, j, "batchingColorTexture"), j._colorsTexture !== null && Nt.setValue(B, "batchingColorTexture", j._colorsTexture, P));
      const Eo = ne.morphAttributes;
      if ((Eo.position !== void 0 || Eo.normal !== void 0 || Eo.color !== void 0) && it.update(j, ne, Vn), (rn || Ve.receiveShadow !== j.receiveShadow) && (Ve.receiveShadow = j.receiveShadow, Nt.setValue(B, "receiveShadow", j.receiveShadow)), ie.isMeshGouraudMaterial && ie.envMap !== null && (Mi.envMap.value = Ye, Mi.flipEnvMap.value = Ye.isCubeTexture && Ye.isRenderTargetTexture === !1 ? -1 : 1), ie.isMeshStandardMaterial && ie.envMap === null && X.environment !== null && (Mi.envMapIntensity.value = X.environmentIntensity), rn && (Nt.setValue(B, "toneMappingExposure", R.toneMappingExposure), Ve.needsLights && Ma(Mi, Ni), be && ie.fog === !0 && Pe.refreshFogUniforms(Mi, be), Pe.refreshMaterialUniforms(Mi, ie, he, Z, x.state.transmissionRenderTarget[A.id]), rc.upload(B, ya(Ve), Mi, P)), ie.isShaderMaterial && ie.uniformsNeedUpdate === !0 && (rc.upload(B, ya(Ve), Mi, P), ie.uniformsNeedUpdate = !1), ie.isSpriteMaterial && Nt.setValue(B, "center", j.center), Nt.setValue(B, "modelViewMatrix", j.modelViewMatrix), Nt.setValue(B, "normalMatrix", j.normalMatrix), Nt.setValue(B, "modelMatrix", j.matrixWorld), ie.isShaderMaterial || ie.isRawShaderMaterial) {
        const hn = ie.uniformsGroups;
        for (let hs = 0, wo = hn.length; hs < wo; hs++) {
          const nr = hn[hs];
          V.update(nr, Vn), V.bind(nr, Vn);
        }
      }
      return Vn;
    }
    function Ma(A, X) {
      A.ambientLightColor.needsUpdate = X, A.lightProbe.needsUpdate = X, A.directionalLights.needsUpdate = X, A.directionalLightShadows.needsUpdate = X, A.pointLights.needsUpdate = X, A.pointLightShadows.needsUpdate = X, A.spotLights.needsUpdate = X, A.spotLightShadows.needsUpdate = X, A.rectAreaLights.needsUpdate = X, A.hemisphereLights.needsUpdate = X;
    }
    function Ea(A) {
      return A.isMeshLambertMaterial || A.isMeshToonMaterial || A.isMeshPhongMaterial || A.isMeshStandardMaterial || A.isShadowMaterial || A.isShaderMaterial && A.lights === !0;
    }
    this.getActiveCubeFace = function() {
      return ee;
    }, this.getActiveMipmapLevel = function() {
      return F;
    }, this.getRenderTarget = function() {
      return I;
    }, this.setRenderTargetTextures = function(A, X, ne) {
      ke.get(A.texture).__webglTexture = X, ke.get(A.depthTexture).__webglTexture = ne;
      const ie = ke.get(A);
      ie.__hasExternalTextures = !0, ie.__autoAllocateDepthBuffer = ne === void 0, ie.__autoAllocateDepthBuffer || ht.has("WEBGL_multisampled_render_to_texture") === !0 && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), ie.__useRenderToTexture = !1);
    }, this.setRenderTargetFramebuffer = function(A, X) {
      const ne = ke.get(A);
      ne.__webglFramebuffer = X, ne.__useDefaultFramebuffer = X === void 0;
    }, this.setRenderTarget = function(A, X = 0, ne = 0) {
      I = A, ee = X, F = ne;
      let ie = !0, j = null, be = !1, Be = !1;
      if (A) {
        const Ye = ke.get(A);
        if (Ye.__useDefaultFramebuffer !== void 0)
          Ze.bindFramebuffer(B.FRAMEBUFFER, null), ie = !1;
        else if (Ye.__webglFramebuffer === void 0)
          P.setupRenderTarget(A);
        else if (Ye.__hasExternalTextures)
          P.rebindTextures(A, ke.get(A.texture).__webglTexture, ke.get(A.depthTexture).__webglTexture);
        else if (A.depthBuffer) {
          const qe = A.depthTexture;
          if (Ye.__boundDepthTexture !== qe) {
            if (qe !== null && ke.has(qe) && (A.width !== qe.image.width || A.height !== qe.image.height))
              throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
            P.setupDepthRenderbuffer(A);
          }
        }
        const nt = A.texture;
        (nt.isData3DTexture || nt.isDataArrayTexture || nt.isCompressedArrayTexture) && (Be = !0);
        const st = ke.get(A).__webglFramebuffer;
        A.isWebGLCubeRenderTarget ? (Array.isArray(st[X]) ? j = st[X][ne] : j = st[X], be = !0) : A.samples > 0 && P.useMultisampledRTT(A) === !1 ? j = ke.get(A).__webglMultisampledFramebuffer : Array.isArray(st) ? j = st[ne] : j = st, T.copy(A.viewport), C.copy(A.scissor), te = A.scissorTest;
      } else
        T.copy(ae).multiplyScalar(he).floor(), C.copy(U).multiplyScalar(he).floor(), te = oe;
      if (Ze.bindFramebuffer(B.FRAMEBUFFER, j) && ie && Ze.drawBuffers(A, j), Ze.viewport(T), Ze.scissor(C), Ze.setScissorTest(te), be) {
        const Ye = ke.get(A.texture);
        B.framebufferTexture2D(B.FRAMEBUFFER, B.COLOR_ATTACHMENT0, B.TEXTURE_CUBE_MAP_POSITIVE_X + X, Ye.__webglTexture, ne);
      } else if (Be) {
        const Ye = ke.get(A.texture), nt = X || 0;
        B.framebufferTextureLayer(B.FRAMEBUFFER, B.COLOR_ATTACHMENT0, Ye.__webglTexture, ne || 0, nt);
      }
      Y = -1;
    }, this.readRenderTargetPixels = function(A, X, ne, ie, j, be, Be) {
      if (!(A && A.isWebGLRenderTarget)) {
        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let Ae = ke.get(A).__webglFramebuffer;
      if (A.isWebGLCubeRenderTarget && Be !== void 0 && (Ae = Ae[Be]), Ae) {
        Ze.bindFramebuffer(B.FRAMEBUFFER, Ae);
        try {
          const Ye = A.texture, nt = Ye.format, st = Ye.type;
          if (!ct.textureFormatReadable(nt)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!ct.textureTypeReadable(st)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          X >= 0 && X <= A.width - ie && ne >= 0 && ne <= A.height - j && B.readPixels(X, ne, ie, j, $e.convert(nt), $e.convert(st), be);
        } finally {
          const Ye = I !== null ? ke.get(I).__webglFramebuffer : null;
          Ze.bindFramebuffer(B.FRAMEBUFFER, Ye);
        }
      }
    }, this.readRenderTargetPixelsAsync = async function(A, X, ne, ie, j, be, Be) {
      if (!(A && A.isWebGLRenderTarget))
        throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
      let Ae = ke.get(A).__webglFramebuffer;
      if (A.isWebGLCubeRenderTarget && Be !== void 0 && (Ae = Ae[Be]), Ae) {
        const Ye = A.texture, nt = Ye.format, st = Ye.type;
        if (!ct.textureFormatReadable(nt))
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
        if (!ct.textureTypeReadable(st))
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
        if (X >= 0 && X <= A.width - ie && ne >= 0 && ne <= A.height - j) {
          Ze.bindFramebuffer(B.FRAMEBUFFER, Ae);
          const qe = B.createBuffer();
          B.bindBuffer(B.PIXEL_PACK_BUFFER, qe), B.bufferData(B.PIXEL_PACK_BUFFER, be.byteLength, B.STREAM_READ), B.readPixels(X, ne, ie, j, $e.convert(nt), $e.convert(st), 0);
          const wt = I !== null ? ke.get(I).__webglFramebuffer : null;
          Ze.bindFramebuffer(B.FRAMEBUFFER, wt);
          const Pt = B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return B.flush(), await xx(B, Pt, 4), B.bindBuffer(B.PIXEL_PACK_BUFFER, qe), B.getBufferSubData(B.PIXEL_PACK_BUFFER, 0, be), B.deleteBuffer(qe), B.deleteSync(Pt), be;
        } else
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
      }
    }, this.copyFramebufferToTexture = function(A, X = null, ne = 0) {
      A.isTexture !== !0 && (ic("WebGLRenderer: copyFramebufferToTexture function signature has changed."), X = arguments[0] || null, A = arguments[1]);
      const ie = Math.pow(2, -ne), j = Math.floor(A.image.width * ie), be = Math.floor(A.image.height * ie), Be = X !== null ? X.x : 0, Ae = X !== null ? X.y : 0;
      P.setTexture2D(A, 0), B.copyTexSubImage2D(B.TEXTURE_2D, ne, 0, 0, Be, Ae, j, be), Ze.unbindTexture();
    }, this.copyTextureToTexture = function(A, X, ne = null, ie = null, j = 0) {
      A.isTexture !== !0 && (ic("WebGLRenderer: copyTextureToTexture function signature has changed."), ie = arguments[0] || null, A = arguments[1], X = arguments[2], j = arguments[3] || 0, ne = null);
      let be, Be, Ae, Ye, nt, st;
      ne !== null ? (be = ne.max.x - ne.min.x, Be = ne.max.y - ne.min.y, Ae = ne.min.x, Ye = ne.min.y) : (be = A.image.width, Be = A.image.height, Ae = 0, Ye = 0), ie !== null ? (nt = ie.x, st = ie.y) : (nt = 0, st = 0);
      const qe = $e.convert(X.format), wt = $e.convert(X.type);
      P.setTexture2D(X, 0), B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL, X.flipY), B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL, X.premultiplyAlpha), B.pixelStorei(B.UNPACK_ALIGNMENT, X.unpackAlignment);
      const Pt = B.getParameter(B.UNPACK_ROW_LENGTH), Dt = B.getParameter(B.UNPACK_IMAGE_HEIGHT), Ot = B.getParameter(B.UNPACK_SKIP_PIXELS), St = B.getParameter(B.UNPACK_SKIP_ROWS), Ve = B.getParameter(B.UNPACK_SKIP_IMAGES), $t = A.isCompressedTexture ? A.mipmaps[j] : A.image;
      B.pixelStorei(B.UNPACK_ROW_LENGTH, $t.width), B.pixelStorei(B.UNPACK_IMAGE_HEIGHT, $t.height), B.pixelStorei(B.UNPACK_SKIP_PIXELS, Ae), B.pixelStorei(B.UNPACK_SKIP_ROWS, Ye), A.isDataTexture ? B.texSubImage2D(B.TEXTURE_2D, j, nt, st, be, Be, qe, wt, $t.data) : A.isCompressedTexture ? B.compressedTexSubImage2D(B.TEXTURE_2D, j, nt, st, $t.width, $t.height, qe, $t.data) : B.texSubImage2D(B.TEXTURE_2D, j, nt, st, be, Be, qe, wt, $t), B.pixelStorei(B.UNPACK_ROW_LENGTH, Pt), B.pixelStorei(B.UNPACK_IMAGE_HEIGHT, Dt), B.pixelStorei(B.UNPACK_SKIP_PIXELS, Ot), B.pixelStorei(B.UNPACK_SKIP_ROWS, St), B.pixelStorei(B.UNPACK_SKIP_IMAGES, Ve), j === 0 && X.generateMipmaps && B.generateMipmap(B.TEXTURE_2D), Ze.unbindTexture();
    }, this.copyTextureToTexture3D = function(A, X, ne = null, ie = null, j = 0) {
      A.isTexture !== !0 && (ic("WebGLRenderer: copyTextureToTexture3D function signature has changed."), ne = arguments[0] || null, ie = arguments[1] || null, A = arguments[2], X = arguments[3], j = arguments[4] || 0);
      let be, Be, Ae, Ye, nt, st, qe, wt, Pt;
      const Dt = A.isCompressedTexture ? A.mipmaps[j] : A.image;
      ne !== null ? (be = ne.max.x - ne.min.x, Be = ne.max.y - ne.min.y, Ae = ne.max.z - ne.min.z, Ye = ne.min.x, nt = ne.min.y, st = ne.min.z) : (be = Dt.width, Be = Dt.height, Ae = Dt.depth, Ye = 0, nt = 0, st = 0), ie !== null ? (qe = ie.x, wt = ie.y, Pt = ie.z) : (qe = 0, wt = 0, Pt = 0);
      const Ot = $e.convert(X.format), St = $e.convert(X.type);
      let Ve;
      if (X.isData3DTexture)
        P.setTexture3D(X, 0), Ve = B.TEXTURE_3D;
      else if (X.isDataArrayTexture || X.isCompressedArrayTexture)
        P.setTexture2DArray(X, 0), Ve = B.TEXTURE_2D_ARRAY;
      else {
        console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");
        return;
      }
      B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL, X.flipY), B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL, X.premultiplyAlpha), B.pixelStorei(B.UNPACK_ALIGNMENT, X.unpackAlignment);
      const $t = B.getParameter(B.UNPACK_ROW_LENGTH), Mt = B.getParameter(B.UNPACK_IMAGE_HEIGHT), Vn = B.getParameter(B.UNPACK_SKIP_PIXELS), li = B.getParameter(B.UNPACK_SKIP_ROWS), rn = B.getParameter(B.UNPACK_SKIP_IMAGES);
      B.pixelStorei(B.UNPACK_ROW_LENGTH, Dt.width), B.pixelStorei(B.UNPACK_IMAGE_HEIGHT, Dt.height), B.pixelStorei(B.UNPACK_SKIP_PIXELS, Ye), B.pixelStorei(B.UNPACK_SKIP_ROWS, nt), B.pixelStorei(B.UNPACK_SKIP_IMAGES, st), A.isDataTexture || A.isData3DTexture ? B.texSubImage3D(Ve, j, qe, wt, Pt, be, Be, Ae, Ot, St, Dt.data) : X.isCompressedArrayTexture ? B.compressedTexSubImage3D(Ve, j, qe, wt, Pt, be, Be, Ae, Ot, Dt.data) : B.texSubImage3D(Ve, j, qe, wt, Pt, be, Be, Ae, Ot, St, Dt), B.pixelStorei(B.UNPACK_ROW_LENGTH, $t), B.pixelStorei(B.UNPACK_IMAGE_HEIGHT, Mt), B.pixelStorei(B.UNPACK_SKIP_PIXELS, Vn), B.pixelStorei(B.UNPACK_SKIP_ROWS, li), B.pixelStorei(B.UNPACK_SKIP_IMAGES, rn), j === 0 && X.generateMipmaps && B.generateMipmap(Ve), Ze.unbindTexture();
    }, this.initRenderTarget = function(A) {
      ke.get(A).__webglFramebuffer === void 0 && P.setupRenderTarget(A);
    }, this.initTexture = function(A) {
      A.isCubeTexture ? P.setTextureCube(A, 0) : A.isData3DTexture ? P.setTexture3D(A, 0) : A.isDataArrayTexture || A.isCompressedArrayTexture ? P.setTexture2DArray(A, 0) : P.setTexture2D(A, 0), Ze.unbindTexture();
    }, this.resetState = function() {
      ee = 0, F = 0, I = null, Ze.reset(), pt.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  get coordinateSystem() {
    return $i;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(e) {
    this._outputColorSpace = e;
    const t = this.getContext();
    t.drawingBufferColorSpace = e === Of ? "display-p3" : "srgb", t.unpackColorSpace = Tt.workingColorSpace === mc ? "display-p3" : "srgb";
  }
}
class Vf {
  constructor(e, t = 25e-5) {
    this.isFogExp2 = !0, this.name = "", this.color = new lt(e), this.density = t;
  }
  clone() {
    return new Vf(this.color, this.density);
  }
  toJSON() {
    return {
      type: "FogExp2",
      name: this.name,
      color: this.color.getHex(),
      density: this.density
    };
  }
}
class LE extends Xt {
  constructor() {
    super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new ai(), this.environmentIntensity = 1, this.environmentRotation = new ai(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(e, t) {
    return super.copy(e, t), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.fog !== null && (t.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (t.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (t.object.backgroundIntensity = this.backgroundIntensity), t.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (t.object.environmentIntensity = this.environmentIntensity), t.object.environmentRotation = this.environmentRotation.toArray(), t;
  }
}
class DE {
  constructor(e, t) {
    this.isInterleavedBuffer = !0, this.array = e, this.stride = t, this.count = e !== void 0 ? e.length / t : 0, this.usage = wf, this.updateRanges = [], this.version = 0, this.uuid = Qi();
  }
  onUploadCallback() {
  }
  set needsUpdate(e) {
    e === !0 && this.version++;
  }
  setUsage(e) {
    return this.usage = e, this;
  }
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(e) {
    return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this;
  }
  copyAt(e, t, r) {
    e *= this.stride, r *= t.stride;
    for (let o = 0, l = this.stride; o < l; o++)
      this.array[e + o] = t.array[r + o];
    return this;
  }
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  clone(e) {
    e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Qi()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
    const t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]), r = new this.constructor(t, this.stride);
    return r.setUsage(this.usage), r;
  }
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  toJSON(e) {
    return e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Qi()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), {
      uuid: this.uuid,
      buffer: this.array.buffer._uuid,
      type: this.array.constructor.name,
      stride: this.stride
    };
  }
}
const Tn = /* @__PURE__ */ new z();
class fc {
  constructor(e, t, r, o = !1) {
    this.isInterleavedBufferAttribute = !0, this.name = "", this.data = e, this.itemSize = t, this.offset = r, this.normalized = o;
  }
  get count() {
    return this.data.count;
  }
  get array() {
    return this.data.array;
  }
  set needsUpdate(e) {
    this.data.needsUpdate = e;
  }
  applyMatrix4(e) {
    for (let t = 0, r = this.data.count; t < r; t++)
      Tn.fromBufferAttribute(this, t), Tn.applyMatrix4(e), this.setXYZ(t, Tn.x, Tn.y, Tn.z);
    return this;
  }
  applyNormalMatrix(e) {
    for (let t = 0, r = this.count; t < r; t++)
      Tn.fromBufferAttribute(this, t), Tn.applyNormalMatrix(e), this.setXYZ(t, Tn.x, Tn.y, Tn.z);
    return this;
  }
  transformDirection(e) {
    for (let t = 0, r = this.count; t < r; t++)
      Tn.fromBufferAttribute(this, t), Tn.transformDirection(e), this.setXYZ(t, Tn.x, Tn.y, Tn.z);
    return this;
  }
  getComponent(e, t) {
    let r = this.array[e * this.data.stride + this.offset + t];
    return this.normalized && (r = yi(r, this.array)), r;
  }
  setComponent(e, t, r) {
    return this.normalized && (r = At(r, this.array)), this.data.array[e * this.data.stride + this.offset + t] = r, this;
  }
  setX(e, t) {
    return this.normalized && (t = At(t, this.array)), this.data.array[e * this.data.stride + this.offset] = t, this;
  }
  setY(e, t) {
    return this.normalized && (t = At(t, this.array)), this.data.array[e * this.data.stride + this.offset + 1] = t, this;
  }
  setZ(e, t) {
    return this.normalized && (t = At(t, this.array)), this.data.array[e * this.data.stride + this.offset + 2] = t, this;
  }
  setW(e, t) {
    return this.normalized && (t = At(t, this.array)), this.data.array[e * this.data.stride + this.offset + 3] = t, this;
  }
  getX(e) {
    let t = this.data.array[e * this.data.stride + this.offset];
    return this.normalized && (t = yi(t, this.array)), t;
  }
  getY(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 1];
    return this.normalized && (t = yi(t, this.array)), t;
  }
  getZ(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 2];
    return this.normalized && (t = yi(t, this.array)), t;
  }
  getW(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 3];
    return this.normalized && (t = yi(t, this.array)), t;
  }
  setXY(e, t, r) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = At(t, this.array), r = At(r, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = r, this;
  }
  setXYZ(e, t, r, o) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = At(t, this.array), r = At(r, this.array), o = At(o, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = r, this.data.array[e + 2] = o, this;
  }
  setXYZW(e, t, r, o, l) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = At(t, this.array), r = At(r, this.array), o = At(o, this.array), l = At(l, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = r, this.data.array[e + 2] = o, this.data.array[e + 3] = l, this;
  }
  clone(e) {
    if (e === void 0) {
      console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let r = 0; r < this.count; r++) {
        const o = r * this.data.stride + this.offset;
        for (let l = 0; l < this.itemSize; l++)
          t.push(this.data.array[o + l]);
      }
      return new Kn(new this.array.constructor(t), this.itemSize, this.normalized);
    } else
      return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.clone(e)), new fc(e.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
  }
  toJSON(e) {
    if (e === void 0) {
      console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let r = 0; r < this.count; r++) {
        const o = r * this.data.stride + this.offset;
        for (let l = 0; l < this.itemSize; l++)
          t.push(this.data.array[o + l]);
      }
      return {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: t,
        normalized: this.normalized
      };
    } else
      return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)), {
        isInterleavedBufferAttribute: !0,
        itemSize: this.itemSize,
        data: this.data.uuid,
        offset: this.offset,
        normalized: this.normalized
      };
  }
}
class vg extends cs {
  constructor(e) {
    super(), this.isSpriteMaterial = !0, this.type = "SpriteMaterial", this.color = new lt(16777215), this.map = null, this.alphaMap = null, this.rotation = 0, this.sizeAttenuation = !0, this.transparent = !0, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.rotation = e.rotation, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
  }
}
let Ks;
const la = /* @__PURE__ */ new z(), Zs = /* @__PURE__ */ new z(), Qs = /* @__PURE__ */ new z(), Js = /* @__PURE__ */ new Qe(), ca = /* @__PURE__ */ new Qe(), _g = /* @__PURE__ */ new Rt(), jl = /* @__PURE__ */ new z(), ua = /* @__PURE__ */ new z(), Yl = /* @__PURE__ */ new z(), v0 = /* @__PURE__ */ new Qe(), Cd = /* @__PURE__ */ new Qe(), _0 = /* @__PURE__ */ new Qe();
class xg extends Xt {
  constructor(e = new vg()) {
    if (super(), this.isSprite = !0, this.type = "Sprite", Ks === void 0) {
      Ks = new Ln();
      const t = new Float32Array([
        -0.5,
        -0.5,
        0,
        0,
        0,
        0.5,
        -0.5,
        0,
        1,
        0,
        0.5,
        0.5,
        0,
        1,
        1,
        -0.5,
        0.5,
        0,
        0,
        1
      ]), r = new DE(t, 5);
      Ks.setIndex([0, 1, 2, 0, 2, 3]), Ks.setAttribute("position", new fc(r, 3, 0, !1)), Ks.setAttribute("uv", new fc(r, 2, 3, !1));
    }
    this.geometry = Ks, this.material = e, this.center = new Qe(0.5, 0.5);
  }
  raycast(e, t) {
    e.camera === null && console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'), Zs.setFromMatrixScale(this.matrixWorld), _g.copy(e.camera.matrixWorld), this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse, this.matrixWorld), Qs.setFromMatrixPosition(this.modelViewMatrix), e.camera.isPerspectiveCamera && this.material.sizeAttenuation === !1 && Zs.multiplyScalar(-Qs.z);
    const r = this.material.rotation;
    let o, l;
    r !== 0 && (l = Math.cos(r), o = Math.sin(r));
    const u = this.center;
    ql(jl.set(-0.5, -0.5, 0), Qs, u, Zs, o, l), ql(ua.set(0.5, -0.5, 0), Qs, u, Zs, o, l), ql(Yl.set(0.5, 0.5, 0), Qs, u, Zs, o, l), v0.set(0, 0), Cd.set(1, 0), _0.set(1, 1);
    let d = e.ray.intersectTriangle(jl, ua, Yl, !1, la);
    if (d === null && (ql(ua.set(-0.5, 0.5, 0), Qs, u, Zs, o, l), Cd.set(0, 1), d = e.ray.intersectTriangle(jl, Yl, ua, !1, la), d === null))
      return;
    const f = e.ray.origin.distanceTo(la);
    f < e.near || f > e.far || t.push({
      distance: f,
      point: la.clone(),
      uv: si.getInterpolation(la, jl, ua, Yl, v0, Cd, _0, new Qe()),
      face: null,
      object: this
    });
  }
  copy(e, t) {
    return super.copy(e, t), e.center !== void 0 && this.center.copy(e.center), this.material = e.material, this;
  }
}
function ql(s, e, t, r, o, l) {
  Js.subVectors(s, t).addScalar(0.5).multiply(r), o !== void 0 ? (ca.x = l * Js.x - o * Js.y, ca.y = o * Js.x + l * Js.y) : ca.copy(Js), s.copy(e), s.x += ca.x, s.y += ca.y, s.applyMatrix4(_g);
}
class NE extends Mn {
  constructor(e = null, t = 1, r = 1, o, l, u, d, f, h = Bn, m = Bn, _, v) {
    super(null, u, d, f, h, m, o, l, _, v), this.isDataTexture = !0, this.image = { data: e, width: t, height: r }, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class bf extends Kn {
  constructor(e, t, r, o = 1) {
    super(e, t, r), this.isInstancedBufferAttribute = !0, this.meshPerAttribute = o;
  }
  copy(e) {
    return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this;
  }
  toJSON() {
    const e = super.toJSON();
    return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = !0, e;
  }
}
const eo = /* @__PURE__ */ new Rt(), x0 = /* @__PURE__ */ new Rt(), $l = [], y0 = /* @__PURE__ */ new ls(), IE = /* @__PURE__ */ new Rt(), da = /* @__PURE__ */ new Ct(), fa = /* @__PURE__ */ new _o();
class hc extends Ct {
  constructor(e, t, r) {
    super(e, t), this.isInstancedMesh = !0, this.instanceMatrix = new bf(new Float32Array(r * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = r, this.boundingBox = null, this.boundingSphere = null;
    for (let o = 0; o < r; o++)
      this.setMatrixAt(o, IE);
  }
  computeBoundingBox() {
    const e = this.geometry, t = this.count;
    this.boundingBox === null && (this.boundingBox = new ls()), e.boundingBox === null && e.computeBoundingBox(), this.boundingBox.makeEmpty();
    for (let r = 0; r < t; r++)
      this.getMatrixAt(r, eo), y0.copy(e.boundingBox).applyMatrix4(eo), this.boundingBox.union(y0);
  }
  computeBoundingSphere() {
    const e = this.geometry, t = this.count;
    this.boundingSphere === null && (this.boundingSphere = new _o()), e.boundingSphere === null && e.computeBoundingSphere(), this.boundingSphere.makeEmpty();
    for (let r = 0; r < t; r++)
      this.getMatrixAt(r, eo), fa.copy(e.boundingSphere).applyMatrix4(eo), this.boundingSphere.union(fa);
  }
  copy(e, t) {
    return super.copy(e, t), this.instanceMatrix.copy(e.instanceMatrix), e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()), e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
  }
  getColorAt(e, t) {
    t.fromArray(this.instanceColor.array, e * 3);
  }
  getMatrixAt(e, t) {
    t.fromArray(this.instanceMatrix.array, e * 16);
  }
  getMorphAt(e, t) {
    const r = t.morphTargetInfluences, o = this.morphTexture.source.data.data, l = r.length + 1, u = e * l + 1;
    for (let d = 0; d < r.length; d++)
      r[d] = o[u + d];
  }
  raycast(e, t) {
    const r = this.matrixWorld, o = this.count;
    if (da.geometry = this.geometry, da.material = this.material, da.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), fa.copy(this.boundingSphere), fa.applyMatrix4(r), e.ray.intersectsSphere(fa) !== !1))
      for (let l = 0; l < o; l++) {
        this.getMatrixAt(l, eo), x0.multiplyMatrices(r, eo), da.matrixWorld = x0, da.raycast(e, $l);
        for (let u = 0, d = $l.length; u < d; u++) {
          const f = $l[u];
          f.instanceId = l, f.object = this, t.push(f);
        }
        $l.length = 0;
      }
  }
  setColorAt(e, t) {
    this.instanceColor === null && (this.instanceColor = new bf(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), t.toArray(this.instanceColor.array, e * 3);
  }
  setMatrixAt(e, t) {
    t.toArray(this.instanceMatrix.array, e * 16);
  }
  setMorphAt(e, t) {
    const r = t.morphTargetInfluences, o = r.length + 1;
    this.morphTexture === null && (this.morphTexture = new NE(new Float32Array(o * this.count), o, this.count, If, Ci));
    const l = this.morphTexture.source.data.data;
    let u = 0;
    for (let h = 0; h < r.length; h++)
      u += r[h];
    const d = this.geometry.morphTargetsRelative ? 1 : 1 - u, f = o * e;
    l[f] = d, l.set(r, f + 1);
  }
  updateMorphTargets() {
  }
  dispose() {
    return this.dispatchEvent({ type: "dispose" }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null), this;
  }
}
class yg extends cs {
  constructor(e) {
    super(), this.isPointsMaterial = !0, this.type = "PointsMaterial", this.color = new lt(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = !0, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
  }
}
const S0 = /* @__PURE__ */ new Rt(), Af = /* @__PURE__ */ new ng(), Kl = /* @__PURE__ */ new _o(), Zl = /* @__PURE__ */ new z();
class M0 extends Xt {
  constructor(e = new Ln(), t = new yg()) {
    super(), this.isPoints = !0, this.type = "Points", this.geometry = e, this.material = t, this.updateMorphTargets();
  }
  copy(e, t) {
    return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
  }
  raycast(e, t) {
    const r = this.geometry, o = this.matrixWorld, l = e.params.Points.threshold, u = r.drawRange;
    if (r.boundingSphere === null && r.computeBoundingSphere(), Kl.copy(r.boundingSphere), Kl.applyMatrix4(o), Kl.radius += l, e.ray.intersectsSphere(Kl) === !1) return;
    S0.copy(o).invert(), Af.copy(e.ray).applyMatrix4(S0);
    const d = l / ((this.scale.x + this.scale.y + this.scale.z) / 3), f = d * d, h = r.index, _ = r.attributes.position;
    if (h !== null) {
      const v = Math.max(0, u.start), S = Math.min(h.count, u.start + u.count);
      for (let y = v, E = S; y < E; y++) {
        const x = h.getX(y);
        Zl.fromBufferAttribute(_, x), E0(Zl, x, f, o, e, t, this);
      }
    } else {
      const v = Math.max(0, u.start), S = Math.min(_.count, u.start + u.count);
      for (let y = v, E = S; y < E; y++)
        Zl.fromBufferAttribute(_, y), E0(Zl, y, f, o, e, t, this);
    }
  }
  updateMorphTargets() {
    const t = this.geometry.morphAttributes, r = Object.keys(t);
    if (r.length > 0) {
      const o = t[r[0]];
      if (o !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let l = 0, u = o.length; l < u; l++) {
          const d = o[l].name || String(l);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[d] = l;
        }
      }
    }
  }
}
function E0(s, e, t, r, o, l, u) {
  const d = Af.distanceSqToPoint(s);
  if (d < t) {
    const f = new z();
    Af.closestPointToPoint(s, f), f.applyMatrix4(r);
    const h = o.ray.origin.distanceTo(f);
    if (h < o.near || h > o.far) return;
    l.push({
      distance: h,
      distanceToRay: Math.sqrt(d),
      point: f,
      index: e,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: u
    });
  }
}
class ao extends Mn {
  constructor(e, t, r, o, l, u, d, f, h) {
    super(e, t, r, o, l, u, d, f, h), this.isCanvasTexture = !0, this.needsUpdate = !0;
  }
}
class Rr extends Ln {
  constructor(e = 1, t = 1, r = 1, o = 32, l = 1, u = !1, d = 0, f = Math.PI * 2) {
    super(), this.type = "CylinderGeometry", this.parameters = {
      radiusTop: e,
      radiusBottom: t,
      height: r,
      radialSegments: o,
      heightSegments: l,
      openEnded: u,
      thetaStart: d,
      thetaLength: f
    };
    const h = this;
    o = Math.floor(o), l = Math.floor(l);
    const m = [], _ = [], v = [], S = [];
    let y = 0;
    const E = [], x = r / 2;
    let M = 0;
    L(), u === !1 && (e > 0 && R(!0), t > 0 && R(!1)), this.setIndex(m), this.setAttribute("position", new fn(_, 3)), this.setAttribute("normal", new fn(v, 3)), this.setAttribute("uv", new fn(S, 2));
    function L() {
      const D = new z(), ee = new z();
      let F = 0;
      const I = (t - e) / r;
      for (let Y = 0; Y <= l; Y++) {
        const ve = [], T = Y / l, C = T * (t - e) + e;
        for (let te = 0; te <= o; te++) {
          const J = te / o, se = J * f + d, _e = Math.sin(se), Z = Math.cos(se);
          ee.x = C * _e, ee.y = -T * r + x, ee.z = C * Z, _.push(ee.x, ee.y, ee.z), D.set(_e, I, Z).normalize(), v.push(D.x, D.y, D.z), S.push(J, 1 - T), ve.push(y++);
        }
        E.push(ve);
      }
      for (let Y = 0; Y < o; Y++)
        for (let ve = 0; ve < l; ve++) {
          const T = E[ve][Y], C = E[ve + 1][Y], te = E[ve + 1][Y + 1], J = E[ve][Y + 1];
          e > 0 && (m.push(T, C, J), F += 3), t > 0 && (m.push(C, te, J), F += 3);
        }
      h.addGroup(M, F, 0), M += F;
    }
    function R(D) {
      const ee = y, F = new Qe(), I = new z();
      let Y = 0;
      const ve = D === !0 ? e : t, T = D === !0 ? 1 : -1;
      for (let te = 1; te <= o; te++)
        _.push(0, x * T, 0), v.push(0, T, 0), S.push(0.5, 0.5), y++;
      const C = y;
      for (let te = 0; te <= o; te++) {
        const se = te / o * f + d, _e = Math.cos(se), Z = Math.sin(se);
        I.x = ve * Z, I.y = x * T, I.z = ve * _e, _.push(I.x, I.y, I.z), v.push(0, T, 0), F.x = _e * 0.5 + 0.5, F.y = Z * 0.5 * T + 0.5, S.push(F.x, F.y), y++;
      }
      for (let te = 0; te < o; te++) {
        const J = ee + te, se = C + te;
        D === !0 ? m.push(se, se + 1, J) : m.push(se + 1, se, J), Y += 3;
      }
      h.addGroup(M, Y, D === !0 ? 1 : 2), M += Y;
    }
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  static fromJSON(e) {
    return new Rr(e.radiusTop, e.radiusBottom, e.height, e.radialSegments, e.heightSegments, e.openEnded, e.thetaStart, e.thetaLength);
  }
}
class Gf extends Ln {
  constructor(e = 1, t = 0.4, r = 12, o = 48, l = Math.PI * 2) {
    super(), this.type = "TorusGeometry", this.parameters = {
      radius: e,
      tube: t,
      radialSegments: r,
      tubularSegments: o,
      arc: l
    }, r = Math.floor(r), o = Math.floor(o);
    const u = [], d = [], f = [], h = [], m = new z(), _ = new z(), v = new z();
    for (let S = 0; S <= r; S++)
      for (let y = 0; y <= o; y++) {
        const E = y / o * l, x = S / r * Math.PI * 2;
        _.x = (e + t * Math.cos(x)) * Math.cos(E), _.y = (e + t * Math.cos(x)) * Math.sin(E), _.z = t * Math.sin(x), d.push(_.x, _.y, _.z), m.x = e * Math.cos(E), m.y = e * Math.sin(E), v.subVectors(_, m).normalize(), f.push(v.x, v.y, v.z), h.push(y / o), h.push(S / r);
      }
    for (let S = 1; S <= r; S++)
      for (let y = 1; y <= o; y++) {
        const E = (o + 1) * S + y - 1, x = (o + 1) * (S - 1) + y - 1, M = (o + 1) * (S - 1) + y, L = (o + 1) * S + y;
        u.push(E, x, L), u.push(x, M, L);
      }
    this.setIndex(u), this.setAttribute("position", new fn(d, 3)), this.setAttribute("normal", new fn(f, 3)), this.setAttribute("uv", new fn(h, 2));
  }
  copy(e) {
    return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
  }
  static fromJSON(e) {
    return new Gf(e.radius, e.tube, e.radialSegments, e.tubularSegments, e.arc);
  }
}
class UE extends Pn {
  constructor(e) {
    super(e), this.isRawShaderMaterial = !0, this.type = "RawShaderMaterial";
  }
}
class Sn extends cs {
  constructor(e) {
    super(), this.isMeshStandardMaterial = !0, this.defines = { STANDARD: "" }, this.type = "MeshStandardMaterial", this.color = new lt(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new lt(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = Z0, this.normalScale = new Qe(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new ai(), this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(e);
  }
  copy(e) {
    return super.copy(e), this.defines = { STANDARD: "" }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
  }
}
class Wf extends Xt {
  constructor(e, t = 1) {
    super(), this.isLight = !0, this.type = "Light", this.color = new lt(e), this.intensity = t;
  }
  dispose() {
  }
  copy(e, t) {
    return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, this.groundColor !== void 0 && (t.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (t.object.distance = this.distance), this.angle !== void 0 && (t.object.angle = this.angle), this.decay !== void 0 && (t.object.decay = this.decay), this.penumbra !== void 0 && (t.object.penumbra = this.penumbra), this.shadow !== void 0 && (t.object.shadow = this.shadow.toJSON()), this.target !== void 0 && (t.object.target = this.target.uuid), t;
  }
}
class FE extends Wf {
  constructor(e, t, r) {
    super(e, r), this.isHemisphereLight = !0, this.type = "HemisphereLight", this.position.copy(Xt.DEFAULT_UP), this.updateMatrix(), this.groundColor = new lt(t);
  }
  copy(e, t) {
    return super.copy(e, t), this.groundColor.copy(e.groundColor), this;
  }
}
const Rd = /* @__PURE__ */ new Rt(), w0 = /* @__PURE__ */ new z(), T0 = /* @__PURE__ */ new z();
class Sg {
  constructor(e) {
    this.camera = e, this.intensity = 1, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new Qe(512, 512), this.map = null, this.mapPass = null, this.matrix = new Rt(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new zf(), this._frameExtents = new Qe(1, 1), this._viewportCount = 1, this._viewports = [
      new Lt(0, 0, 1, 1)
    ];
  }
  getViewportCount() {
    return this._viewportCount;
  }
  getFrustum() {
    return this._frustum;
  }
  updateMatrices(e) {
    const t = this.camera, r = this.matrix;
    w0.setFromMatrixPosition(e.matrixWorld), t.position.copy(w0), T0.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(T0), t.updateMatrixWorld(), Rd.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), this._frustum.setFromProjectionMatrix(Rd), r.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0,
      0,
      1
    ), r.multiply(Rd);
  }
  getViewport(e) {
    return this._viewports[e];
  }
  getFrameExtents() {
    return this._frameExtents;
  }
  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }
  copy(e) {
    return this.camera = e.camera.clone(), this.intensity = e.intensity, this.bias = e.bias, this.radius = e.radius, this.mapSize.copy(e.mapSize), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    const e = {};
    return this.intensity !== 1 && (e.intensity = this.intensity), this.bias !== 0 && (e.bias = this.bias), this.normalBias !== 0 && (e.normalBias = this.normalBias), this.radius !== 1 && (e.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(!1).object, delete e.camera.matrix, e;
  }
}
class kE extends Sg {
  constructor() {
    super(new Rn(50, 1, 0.5, 500)), this.isSpotLightShadow = !0, this.focus = 1;
  }
  updateMatrices(e) {
    const t = this.camera, r = po * 2 * e.angle * this.focus, o = this.mapSize.width / this.mapSize.height, l = e.distance || t.far;
    (r !== t.fov || o !== t.aspect || l !== t.far) && (t.fov = r, t.aspect = o, t.far = l, t.updateProjectionMatrix()), super.updateMatrices(e);
  }
  copy(e) {
    return super.copy(e), this.focus = e.focus, this;
  }
}
class OE extends Wf {
  constructor(e, t, r = 0, o = Math.PI / 3, l = 0, u = 2) {
    super(e, t), this.isSpotLight = !0, this.type = "SpotLight", this.position.copy(Xt.DEFAULT_UP), this.updateMatrix(), this.target = new Xt(), this.distance = r, this.angle = o, this.penumbra = l, this.decay = u, this.map = null, this.shadow = new kE();
  }
  get power() {
    return this.intensity * Math.PI;
  }
  set power(e) {
    this.intensity = e / Math.PI;
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(e, t) {
    return super.copy(e, t), this.distance = e.distance, this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay, this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
  }
}
const b0 = /* @__PURE__ */ new Rt(), ha = /* @__PURE__ */ new z(), Pd = /* @__PURE__ */ new z();
class BE extends Sg {
  constructor() {
    super(new Rn(90, 1, 0.5, 500)), this.isPointLightShadow = !0, this._frameExtents = new Qe(4, 2), this._viewportCount = 6, this._viewports = [
      // These viewports map a cube-map onto a 2D texture with the
      // following orientation:
      //
      //  xzXZ
      //   y Y
      //
      // X - Positive x direction
      // x - Negative x direction
      // Y - Positive y direction
      // y - Negative y direction
      // Z - Positive z direction
      // z - Negative z direction
      // positive X
      new Lt(2, 1, 1, 1),
      // negative X
      new Lt(0, 1, 1, 1),
      // positive Z
      new Lt(3, 1, 1, 1),
      // negative Z
      new Lt(1, 1, 1, 1),
      // positive Y
      new Lt(3, 0, 1, 1),
      // negative Y
      new Lt(1, 0, 1, 1)
    ], this._cubeDirections = [
      new z(1, 0, 0),
      new z(-1, 0, 0),
      new z(0, 0, 1),
      new z(0, 0, -1),
      new z(0, 1, 0),
      new z(0, -1, 0)
    ], this._cubeUps = [
      new z(0, 1, 0),
      new z(0, 1, 0),
      new z(0, 1, 0),
      new z(0, 1, 0),
      new z(0, 0, 1),
      new z(0, 0, -1)
    ];
  }
  updateMatrices(e, t = 0) {
    const r = this.camera, o = this.matrix, l = e.distance || r.far;
    l !== r.far && (r.far = l, r.updateProjectionMatrix()), ha.setFromMatrixPosition(e.matrixWorld), r.position.copy(ha), Pd.copy(r.position), Pd.add(this._cubeDirections[t]), r.up.copy(this._cubeUps[t]), r.lookAt(Pd), r.updateMatrixWorld(), o.makeTranslation(-ha.x, -ha.y, -ha.z), b0.multiplyMatrices(r.projectionMatrix, r.matrixWorldInverse), this._frustum.setFromProjectionMatrix(b0);
  }
}
class A0 extends Wf {
  constructor(e, t, r = 0, o = 2) {
    super(e, t), this.isPointLight = !0, this.type = "PointLight", this.distance = r, this.decay = o, this.shadow = new BE();
  }
  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(e) {
    this.intensity = e / (4 * Math.PI);
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(e, t) {
    return super.copy(e, t), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this;
  }
}
class zE {
  constructor(e = !0) {
    this.autoStart = e, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = !1;
  }
  start() {
    this.startTime = C0(), this.oldTime = this.startTime, this.elapsedTime = 0, this.running = !0;
  }
  stop() {
    this.getElapsedTime(), this.running = !1, this.autoStart = !1;
  }
  getElapsedTime() {
    return this.getDelta(), this.elapsedTime;
  }
  getDelta() {
    let e = 0;
    if (this.autoStart && !this.running)
      return this.start(), 0;
    if (this.running) {
      const t = C0();
      e = (t - this.oldTime) / 1e3, this.oldTime = t, this.elapsedTime += e;
    }
    return e;
  }
}
function C0() {
  return performance.now();
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
  revision: Rf
} }));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = Rf);
const Mg = {
  name: "CopyShader",
  uniforms: {
    tDiffuse: { value: null },
    opacity: { value: 1 }
  },
  vertexShader: (
    /* glsl */
    `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
  ),
  fragmentShader: (
    /* glsl */
    `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`
  )
};
class So {
  constructor() {
    this.isPass = !0, this.enabled = !0, this.needsSwap = !0, this.clear = !1, this.renderToScreen = !1;
  }
  setSize() {
  }
  render() {
    console.error("THREE.Pass: .render() must be implemented in derived pass.");
  }
  dispose() {
  }
}
const HE = new dg(-1, 1, 1, -1, 0, 1);
class VE extends Ln {
  constructor() {
    super(), this.setAttribute("position", new fn([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute("uv", new fn([0, 2, 0, 0, 2, 0], 2));
  }
}
const GE = new VE();
class Xf {
  constructor(e) {
    this._mesh = new Ct(GE, e);
  }
  dispose() {
    this._mesh.geometry.dispose();
  }
  render(e) {
    e.render(this._mesh, HE);
  }
  get material() {
    return this._mesh.material;
  }
  set material(e) {
    this._mesh.material = e;
  }
}
class WE extends So {
  constructor(e, t) {
    super(), this.textureID = t !== void 0 ? t : "tDiffuse", e instanceof Pn ? (this.uniforms = e.uniforms, this.material = e) : e && (this.uniforms = xa.clone(e.uniforms), this.material = new Pn({
      name: e.name !== void 0 ? e.name : "unspecified",
      defines: Object.assign({}, e.defines),
      uniforms: this.uniforms,
      vertexShader: e.vertexShader,
      fragmentShader: e.fragmentShader
    })), this.fsQuad = new Xf(this.material);
  }
  render(e, t, r) {
    this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = r.texture), this.fsQuad.material = this.material, this.renderToScreen ? (e.setRenderTarget(null), this.fsQuad.render(e)) : (e.setRenderTarget(t), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this.fsQuad.render(e));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class R0 extends So {
  constructor(e, t) {
    super(), this.scene = e, this.camera = t, this.clear = !0, this.needsSwap = !1, this.inverse = !1;
  }
  render(e, t, r) {
    const o = e.getContext(), l = e.state;
    l.buffers.color.setMask(!1), l.buffers.depth.setMask(!1), l.buffers.color.setLocked(!0), l.buffers.depth.setLocked(!0);
    let u, d;
    this.inverse ? (u = 0, d = 1) : (u = 1, d = 0), l.buffers.stencil.setTest(!0), l.buffers.stencil.setOp(o.REPLACE, o.REPLACE, o.REPLACE), l.buffers.stencil.setFunc(o.ALWAYS, u, 4294967295), l.buffers.stencil.setClear(d), l.buffers.stencil.setLocked(!0), e.setRenderTarget(r), this.clear && e.clear(), e.render(this.scene, this.camera), e.setRenderTarget(t), this.clear && e.clear(), e.render(this.scene, this.camera), l.buffers.color.setLocked(!1), l.buffers.depth.setLocked(!1), l.buffers.color.setMask(!0), l.buffers.depth.setMask(!0), l.buffers.stencil.setLocked(!1), l.buffers.stencil.setFunc(o.EQUAL, 1, 4294967295), l.buffers.stencil.setOp(o.KEEP, o.KEEP, o.KEEP), l.buffers.stencil.setLocked(!0);
  }
}
class XE extends So {
  constructor() {
    super(), this.needsSwap = !1;
  }
  render(e) {
    e.state.buffers.stencil.setLocked(!1), e.state.buffers.stencil.setTest(!1);
  }
}
class jE {
  constructor(e, t) {
    if (this.renderer = e, this._pixelRatio = e.getPixelRatio(), t === void 0) {
      const r = e.getSize(new Qe());
      this._width = r.width, this._height = r.height, t = new oi(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: Ri }), t.texture.name = "EffectComposer.rt1";
    } else
      this._width = t.width, this._height = t.height;
    this.renderTarget1 = t, this.renderTarget2 = t.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, this.passes = [], this.copyPass = new WE(Mg), this.copyPass.material.blending = Zi, this.clock = new zE();
  }
  swapBuffers() {
    const e = this.readBuffer;
    this.readBuffer = this.writeBuffer, this.writeBuffer = e;
  }
  addPass(e) {
    this.passes.push(e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  insertPass(e, t) {
    this.passes.splice(t, 0, e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  removePass(e) {
    const t = this.passes.indexOf(e);
    t !== -1 && this.passes.splice(t, 1);
  }
  isLastEnabledPass(e) {
    for (let t = e + 1; t < this.passes.length; t++)
      if (this.passes[t].enabled)
        return !1;
    return !0;
  }
  render(e) {
    e === void 0 && (e = this.clock.getDelta());
    const t = this.renderer.getRenderTarget();
    let r = !1;
    for (let o = 0, l = this.passes.length; o < l; o++) {
      const u = this.passes[o];
      if (u.enabled !== !1) {
        if (u.renderToScreen = this.renderToScreen && this.isLastEnabledPass(o), u.render(this.renderer, this.writeBuffer, this.readBuffer, e, r), u.needsSwap) {
          if (r) {
            const d = this.renderer.getContext(), f = this.renderer.state.buffers.stencil;
            f.setFunc(d.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, e), f.setFunc(d.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        R0 !== void 0 && (u instanceof R0 ? r = !0 : u instanceof XE && (r = !1));
      }
    }
    this.renderer.setRenderTarget(t);
  }
  reset(e) {
    if (e === void 0) {
      const t = this.renderer.getSize(new Qe());
      this._pixelRatio = this.renderer.getPixelRatio(), this._width = t.width, this._height = t.height, e = this.renderTarget1.clone(), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.renderTarget1 = e, this.renderTarget2 = e.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2;
  }
  setSize(e, t) {
    this._width = e, this._height = t;
    const r = this._width * this._pixelRatio, o = this._height * this._pixelRatio;
    this.renderTarget1.setSize(r, o), this.renderTarget2.setSize(r, o);
    for (let l = 0; l < this.passes.length; l++)
      this.passes[l].setSize(r, o);
  }
  setPixelRatio(e) {
    this._pixelRatio = e, this.setSize(this._width, this._height);
  }
  dispose() {
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose();
  }
}
class YE extends So {
  constructor(e, t, r = null, o = null, l = null) {
    super(), this.scene = e, this.camera = t, this.overrideMaterial = r, this.clearColor = o, this.clearAlpha = l, this.clear = !0, this.clearDepth = !1, this.needsSwap = !1, this._oldClearColor = new lt();
  }
  render(e, t, r) {
    const o = e.autoClear;
    e.autoClear = !1;
    let l, u;
    this.overrideMaterial !== null && (u = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor !== null && (e.getClearColor(this._oldClearColor), e.setClearColor(this.clearColor, e.getClearAlpha())), this.clearAlpha !== null && (l = e.getClearAlpha(), e.setClearAlpha(this.clearAlpha)), this.clearDepth == !0 && e.clearDepth(), e.setRenderTarget(this.renderToScreen ? null : r), this.clear === !0 && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), e.render(this.scene, this.camera), this.clearColor !== null && e.setClearColor(this._oldClearColor), this.clearAlpha !== null && e.setClearAlpha(l), this.overrideMaterial !== null && (this.scene.overrideMaterial = u), e.autoClear = o;
  }
}
const qE = {
  uniforms: {
    tDiffuse: { value: null },
    luminosityThreshold: { value: 1 },
    smoothWidth: { value: 1 },
    defaultColor: { value: new lt(0) },
    defaultOpacity: { value: 0 }
  },
  vertexShader: (
    /* glsl */
    `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
  ),
  fragmentShader: (
    /* glsl */
    `

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`
  )
};
class go extends So {
  constructor(e, t, r, o) {
    super(), this.strength = t !== void 0 ? t : 1, this.radius = r, this.threshold = o, this.resolution = e !== void 0 ? new Qe(e.x, e.y) : new Qe(256, 256), this.clearColor = new lt(0, 0, 0), this.renderTargetsHorizontal = [], this.renderTargetsVertical = [], this.nMips = 5;
    let l = Math.round(this.resolution.x / 2), u = Math.round(this.resolution.y / 2);
    this.renderTargetBright = new oi(l, u, { type: Ri }), this.renderTargetBright.texture.name = "UnrealBloomPass.bright", this.renderTargetBright.texture.generateMipmaps = !1;
    for (let _ = 0; _ < this.nMips; _++) {
      const v = new oi(l, u, { type: Ri });
      v.texture.name = "UnrealBloomPass.h" + _, v.texture.generateMipmaps = !1, this.renderTargetsHorizontal.push(v);
      const S = new oi(l, u, { type: Ri });
      S.texture.name = "UnrealBloomPass.v" + _, S.texture.generateMipmaps = !1, this.renderTargetsVertical.push(S), l = Math.round(l / 2), u = Math.round(u / 2);
    }
    const d = qE;
    this.highPassUniforms = xa.clone(d.uniforms), this.highPassUniforms.luminosityThreshold.value = o, this.highPassUniforms.smoothWidth.value = 0.01, this.materialHighPassFilter = new Pn({
      uniforms: this.highPassUniforms,
      vertexShader: d.vertexShader,
      fragmentShader: d.fragmentShader
    }), this.separableBlurMaterials = [];
    const f = [3, 5, 7, 9, 11];
    l = Math.round(this.resolution.x / 2), u = Math.round(this.resolution.y / 2);
    for (let _ = 0; _ < this.nMips; _++)
      this.separableBlurMaterials.push(this.getSeperableBlurMaterial(f[_])), this.separableBlurMaterials[_].uniforms.invSize.value = new Qe(1 / l, 1 / u), l = Math.round(l / 2), u = Math.round(u / 2);
    this.compositeMaterial = this.getCompositeMaterial(this.nMips), this.compositeMaterial.uniforms.blurTexture1.value = this.renderTargetsVertical[0].texture, this.compositeMaterial.uniforms.blurTexture2.value = this.renderTargetsVertical[1].texture, this.compositeMaterial.uniforms.blurTexture3.value = this.renderTargetsVertical[2].texture, this.compositeMaterial.uniforms.blurTexture4.value = this.renderTargetsVertical[3].texture, this.compositeMaterial.uniforms.blurTexture5.value = this.renderTargetsVertical[4].texture, this.compositeMaterial.uniforms.bloomStrength.value = t, this.compositeMaterial.uniforms.bloomRadius.value = 0.1;
    const h = [1, 0.8, 0.6, 0.4, 0.2];
    this.compositeMaterial.uniforms.bloomFactors.value = h, this.bloomTintColors = [new z(1, 1, 1), new z(1, 1, 1), new z(1, 1, 1), new z(1, 1, 1), new z(1, 1, 1)], this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors;
    const m = Mg;
    this.copyUniforms = xa.clone(m.uniforms), this.blendMaterial = new Pn({
      uniforms: this.copyUniforms,
      vertexShader: m.vertexShader,
      fragmentShader: m.fragmentShader,
      blending: kd,
      depthTest: !1,
      depthWrite: !1,
      transparent: !0
    }), this.enabled = !0, this.needsSwap = !1, this._oldClearColor = new lt(), this.oldClearAlpha = 1, this.basic = new Dr(), this.fsQuad = new Xf(null);
  }
  dispose() {
    for (let e = 0; e < this.renderTargetsHorizontal.length; e++)
      this.renderTargetsHorizontal[e].dispose();
    for (let e = 0; e < this.renderTargetsVertical.length; e++)
      this.renderTargetsVertical[e].dispose();
    this.renderTargetBright.dispose();
    for (let e = 0; e < this.separableBlurMaterials.length; e++)
      this.separableBlurMaterials[e].dispose();
    this.compositeMaterial.dispose(), this.blendMaterial.dispose(), this.basic.dispose(), this.fsQuad.dispose();
  }
  setSize(e, t) {
    let r = Math.round(e / 2), o = Math.round(t / 2);
    this.renderTargetBright.setSize(r, o);
    for (let l = 0; l < this.nMips; l++)
      this.renderTargetsHorizontal[l].setSize(r, o), this.renderTargetsVertical[l].setSize(r, o), this.separableBlurMaterials[l].uniforms.invSize.value = new Qe(1 / r, 1 / o), r = Math.round(r / 2), o = Math.round(o / 2);
  }
  render(e, t, r, o, l) {
    e.getClearColor(this._oldClearColor), this.oldClearAlpha = e.getClearAlpha();
    const u = e.autoClear;
    e.autoClear = !1, e.setClearColor(this.clearColor, 0), l && e.state.buffers.stencil.setTest(!1), this.renderToScreen && (this.fsQuad.material = this.basic, this.basic.map = r.texture, e.setRenderTarget(null), e.clear(), this.fsQuad.render(e)), this.highPassUniforms.tDiffuse.value = r.texture, this.highPassUniforms.luminosityThreshold.value = this.threshold, this.fsQuad.material = this.materialHighPassFilter, e.setRenderTarget(this.renderTargetBright), e.clear(), this.fsQuad.render(e);
    let d = this.renderTargetBright;
    for (let f = 0; f < this.nMips; f++)
      this.fsQuad.material = this.separableBlurMaterials[f], this.separableBlurMaterials[f].uniforms.colorTexture.value = d.texture, this.separableBlurMaterials[f].uniforms.direction.value = go.BlurDirectionX, e.setRenderTarget(this.renderTargetsHorizontal[f]), e.clear(), this.fsQuad.render(e), this.separableBlurMaterials[f].uniforms.colorTexture.value = this.renderTargetsHorizontal[f].texture, this.separableBlurMaterials[f].uniforms.direction.value = go.BlurDirectionY, e.setRenderTarget(this.renderTargetsVertical[f]), e.clear(), this.fsQuad.render(e), d = this.renderTargetsVertical[f];
    this.fsQuad.material = this.compositeMaterial, this.compositeMaterial.uniforms.bloomStrength.value = this.strength, this.compositeMaterial.uniforms.bloomRadius.value = this.radius, this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors, e.setRenderTarget(this.renderTargetsHorizontal[0]), e.clear(), this.fsQuad.render(e), this.fsQuad.material = this.blendMaterial, this.copyUniforms.tDiffuse.value = this.renderTargetsHorizontal[0].texture, l && e.state.buffers.stencil.setTest(!0), this.renderToScreen ? (e.setRenderTarget(null), this.fsQuad.render(e)) : (e.setRenderTarget(r), this.fsQuad.render(e)), e.setClearColor(this._oldClearColor, this.oldClearAlpha), e.autoClear = u;
  }
  getSeperableBlurMaterial(e) {
    const t = [];
    for (let r = 0; r < e; r++)
      t.push(0.39894 * Math.exp(-0.5 * r * r / (e * e)) / e);
    return new Pn({
      defines: {
        KERNEL_RADIUS: e
      },
      uniforms: {
        colorTexture: { value: null },
        invSize: { value: new Qe(0.5, 0.5) },
        // inverse texture size
        direction: { value: new Qe(0.5, 0.5) },
        gaussianCoefficients: { value: t }
        // precomputed Gaussian coefficients
      },
      vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
      fragmentShader: `#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`
    });
  }
  getCompositeMaterial(e) {
    return new Pn({
      defines: {
        NUM_MIPS: e
      },
      uniforms: {
        blurTexture1: { value: null },
        blurTexture2: { value: null },
        blurTexture3: { value: null },
        blurTexture4: { value: null },
        blurTexture5: { value: null },
        bloomStrength: { value: 1 },
        bloomFactors: { value: null },
        bloomTintColors: { value: null },
        bloomRadius: { value: 0 }
      },
      vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
      fragmentShader: `varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`
    });
  }
}
go.BlurDirectionX = new Qe(1, 0);
go.BlurDirectionY = new Qe(0, 1);
const $E = {
  name: "OutputShader",
  uniforms: {
    tDiffuse: { value: null },
    toneMappingExposure: { value: 1 }
  },
  vertexShader: (
    /* glsl */
    `
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`
  ),
  fragmentShader: (
    /* glsl */
    `
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`
  )
};
class KE extends So {
  constructor() {
    super();
    const e = $E;
    this.uniforms = xa.clone(e.uniforms), this.material = new UE({
      name: e.name,
      uniforms: this.uniforms,
      vertexShader: e.vertexShader,
      fragmentShader: e.fragmentShader
    }), this.fsQuad = new Xf(this.material), this._outputColorSpace = null, this._toneMapping = null;
  }
  render(e, t, r) {
    this.uniforms.tDiffuse.value = r.texture, this.uniforms.toneMappingExposure.value = e.toneMappingExposure, (this._outputColorSpace !== e.outputColorSpace || this._toneMapping !== e.toneMapping) && (this._outputColorSpace = e.outputColorSpace, this._toneMapping = e.toneMapping, this.material.defines = {}, Tt.getTransfer(this._outputColorSpace) === Ut && (this.material.defines.SRGB_TRANSFER = ""), this._toneMapping === F0 ? this.material.defines.LINEAR_TONE_MAPPING = "" : this._toneMapping === k0 ? this.material.defines.REINHARD_TONE_MAPPING = "" : this._toneMapping === O0 ? this.material.defines.CINEON_TONE_MAPPING = "" : this._toneMapping === Pf ? this.material.defines.ACES_FILMIC_TONE_MAPPING = "" : this._toneMapping === B0 ? this.material.defines.AGX_TONE_MAPPING = "" : this._toneMapping === z0 && (this.material.defines.NEUTRAL_TONE_MAPPING = ""), this.material.needsUpdate = !0), this.renderToScreen === !0 ? (e.setRenderTarget(null), this.fsQuad.render(e)) : (e.setRenderTarget(t), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this.fsQuad.render(e));
  }
  dispose() {
    this.material.dispose(), this.fsQuad.dispose();
  }
}
class to {
  constructor(e) {
    this.step = e;
  }
  step;
  cells = /* @__PURE__ */ new Map();
  ellipsoid(e, t, r, o) {
    const [l, u, d] = e, [f, h, m] = t, _ = this.step;
    for (let v = Math.floor((l - f) / _); v <= Math.ceil((l + f) / _); v++)
      for (let S = Math.floor((u - h) / _); S <= Math.ceil((u + h) / _); S++)
        for (let y = Math.floor((d - m) / _); y <= Math.ceil((d + m) / _); y++) {
          const E = v * _, x = S * _, M = y * _;
          ((E - l) / f) ** 2 + ((x - u) / h) ** 2 + ((M - d) / m) ** 2 > 1 || o && !o(E, x, M) || this.cells.set((v + 512) * 1048576 + (S + 512) * 1024 + y + 512, { x: E, y: x, z: M, color: r });
        }
  }
  limb(e, t, r, o) {
    const l = new z(...e).distanceTo(new z(...t)), u = Math.max(2, Math.ceil(l / (Math.min(...r) * 0.7)));
    for (let d = 0; d <= u; d++) this.ellipsoid(e.map((f, h) => f + (t[h] - f) * d / u), r, o);
  }
  mesh(e, t) {
    const r = [...this.cells].filter(([h]) => [1, -1, 1024, -1024, 1048576, -1048576].some((m) => !this.cells.has(h + m))), o = new Float32Array(r.length * 3), l = e.clone();
    l.setAttribute("surfaceNormal", new bf(o, 3));
    const u = new hc(l, t, r.length), d = new Rt(), f = new lt();
    return r.forEach(([h, m], _) => {
      d.makeScale(this.step, this.step, this.step), d.setPosition(m.x, m.y, m.z), u.setMatrixAt(_, d);
      const v = Math.sin(m.x * 892 + m.y * 331 + m.z * 731) * 0.023;
      f.set(m.color).multiplyScalar(1 + v), u.setColorAt(_, f);
      const S = new z();
      for (let y = -1; y <= 1; y++) for (let E = -1; E <= 1; E++) for (let x = -1; x <= 1; x++)
        if (!(!y && !E && !x))
          for (let M = 1; M <= 3; M++)
            this.cells.has(h + (y * 1048576 + E * 1024 + x) * M) || S.addScaledVector(new z(y, E, x), 1 / (M * (y * y + E * E + x * x)));
      S.normalize(), o.set([S.x, S.y, S.z], _ * 3);
    }), u.castShadow = !0, u.receiveShadow = !1, u.computeBoundingSphere(), this.cells.clear(), u;
  }
}
function Eg() {
  const s = new Sn({ roughness: 0.88 });
  return s.onBeforeCompile = (e) => {
    e.vertexShader = `attribute vec3 surfaceNormal;
${e.vertexShader}`.replace(
      "#include <beginnormal_vertex>",
      `#include <beginnormal_vertex>
objectNormal = normalize(mix(objectNormal, surfaceNormal, 0.94));`
    );
  }, s.customProgramCacheKey = () => "poker-sculpture-envelope-v1", s;
}
const ZE = [
  { skin: "#bb8565", shadow: "#916047", hair: "#281b16", jacket: "#202824", shirt: "#b7b2a2" },
  { skin: "#c69a7c", shadow: "#986a54", hair: "#30231e", jacket: "#342924", shirt: "#837965" },
  { skin: "#bea189", shadow: "#947764", hair: "#59544b", jacket: "#242b2b", shirt: "#bbb3a4" },
  { skin: "#b58b72", shadow: "#8d6150", hair: "#201b1c", jacket: "#342730", shirt: "#2a2928" },
  { skin: "#805845", shadow: "#5d3b2f", hair: "#171515", jacket: "#242a31", shirt: "#b7ae9c" },
  { skin: "#c9a183", shadow: "#9b7760", hair: "#a79a82", jacket: "#343c34", shirt: "#a49b84" }
];
function QE(s, e, t) {
  const r = ZE[s], o = new Jt(), l = new Jt(), u = new Jt(), d = new Jt(), f = new Jt(), h = new Jt(), m = s === 3, _ = new to(9e-3);
  _.ellipsoid([0, 0.99, -0.02], [m ? 0.19 : 0.225, 0.31, 0.115], r.jacket), _.ellipsoid([0, 1.13, 0.035], [0.135, 0.185, 0.099], r.shirt);
  for (const y of [-1, 1])
    _.ellipsoid([y * 0.105, 1.04, 0.065], [0.092, 0.27, 0.085], r.jacket), _.limb([y * 0.052, 1.24, 0.115], [y * 0.105, 1.02, 0.133], [0.03, 0.035, 0.019], s === 1 ? "#574236" : "#41423e"), _.ellipsoid([y * 0.215, 1.19, -0.01], [0.078, 0.092, 0.1], r.jacket), _.limb([y * 0.23, 1.15, 0.015], [y * 0.27, 0.89, 0.17], [0.063, 0.07, 0.067], r.jacket), _.ellipsoid([y * 0.105, 0.61, 0.13], [0.1, 0.12, 0.28], "#1c1d1c"), _.limb([y * 0.12, 0.58, 0.35], [y * 0.12, 0.15, 0.37], [0.077, 0.085, 0.085], "#20211f"), _.ellipsoid([y * 0.12, 0.085, 0.42], [0.08, 0.064, 0.16], "#121414");
  _.ellipsoid([0, 1.285, -6e-3], [0.054, 0.096, 0.056], r.skin);
  for (const y of [-1, 1]) _.limb([y * 0.045, 1.28, 0.04], [y * 0.065, 1.2, 0.11], [0.026, 0.025, 0.015], r.shirt);
  for (let y = 0; y < 3; y++) _.ellipsoid([0.023, 1.035 - y * 0.085, 0.15], [0.01, 0.01, 7e-3], "#a59676");
  o.add(_.mesh(e, t));
  for (const y of [-1, 1]) {
    const E = new to(45e-4);
    if (y === -1) {
      E.limb([-0.27, 0.89, 0.16], [-0.15, 0.945, 0.29], [0.054, 0.039, 0.053], r.jacket), E.ellipsoid([-0.145, 0.954, 0.3], [0.039, 0.027, 0.036], r.shirt), E.ellipsoid([-0.14, 0.972, 0.337], [0.035, 0.037, 0.023], r.skin);
      for (let L = 0; L < 4; L++) {
        const R = -0.162 + L * 0.014;
        E.limb([R, 0.977, 0.35], [R, 1.006 - Math.abs(L - 1) * 4e-3, 0.36], [68e-4, 0.011, 9e-3], r.skin), E.ellipsoid([R, 1.012 - Math.abs(L - 1) * 4e-3, 0.352], [67e-4, 9e-3, 0.011], r.skin);
      }
      E.limb([-0.112, 0.973, 0.349], [-0.102, 1.001, 0.36], [0.01, 0.015, 9e-3], r.skin);
    } else {
      E.limb([y * 0.27, 0.89, 0.16], [y * 0.18, 0.842, 0.39], [0.057, 0.042, 0.058], r.jacket), E.ellipsoid([y * 0.178, 0.842, 0.4], [0.043, 0.026, 0.041], r.shirt), E.ellipsoid([y * 0.17, 0.837, 0.46], [0.04, 0.02, 0.065], r.skin);
      for (let L = 0; L < 4; L++) {
        const R = y * 0.17 + (L - 1.5) * 0.017, D = 0.515 + (0.025 - Math.abs(L - 1.4) * 0.012);
        E.limb([R, 0.833, 0.49], [R + y * 0.012, 0.828, D + 0.033], [8e-3, 9e-3, 0.018], r.skin), E.ellipsoid([R + y * 0.012, 0.837, D + 0.021], [5e-3, 25e-4, 9e-3], "#c1a38d");
      }
      E.limb([y * 0.137, 0.837, 0.44], [y * 0.11, 0.827, 0.475], [0.014, 0.012, 0.021], r.skin), y === -1 && s !== 3 && E.ellipsoid([y * 0.19, 0.87, 0.386], [0.029, 7e-3, 0.027], "#a48c60");
    }
    const x = y === -1 ? d : f, M = E.mesh(e, t);
    M.position.set(-y * 0.27, -0.89, -0.16), x.position.set(y * 0.27, 0.89, 0.16), x.add(M), o.add(x);
  }
  h.position.set(0.13, 0.157, 0.186), h.rotation.set(0.2, 0, -0.1), d.add(h);
  const v = new to(45e-4);
  v.ellipsoid([0, 0.02, -8e-3], [m ? 0.08 : 0.087, 0.111, 0.085], r.skin), v.ellipsoid([0, -0.05, 0.014], [0.069, 0.077, 0.071], r.skin), v.ellipsoid([0, -0.097, 0.037], [0.042, 0.026, 0.038], r.skin);
  for (const y of [-1, 1])
    v.ellipsoid([y * 0.079, -8e-3, -8e-3], [0.016, 0.035, 0.021], r.shadow), v.ellipsoid([y * 0.085, -6e-3, -3e-3], [0.013, 0.028, 0.016], r.skin), v.ellipsoid([y * 0.05, -0.02, 0.06], [0.031, 0.032, 0.028], r.skin), v.ellipsoid([y * 0.034, 0.026, 0.073], [0.028, 0.021, 0.012], r.shadow), v.ellipsoid([y * 0.034, 0.034, 0.076], [0.029, 0.01, 0.018], r.skin), v.ellipsoid([y * 0.035, 0.042, 0.084], [0.024, 5e-3, 5e-3], r.hair), v.ellipsoid([y * 0.035, 6e-3, 0.077], [0.023, 7e-3, 0.012], r.skin);
  v.ellipsoid([0, 5e-3, 0.079], [0.013, 0.039, 0.024], r.skin), v.ellipsoid([0, -0.02, 0.099], [0.019, 0.015, 0.023], r.skin);
  for (const y of [-1, 1])
    v.ellipsoid([y * 0.017, -0.024, 0.089], [0.013, 0.012, 0.016], r.skin), v.ellipsoid([y * 0.012, -0.032, 0.101], [5e-3, 35e-4, 4e-3], r.shadow);
  v.ellipsoid([0, -0.061, 0.08], [0.029, 7e-3, 8e-3], m ? "#8c4e48" : "#8f5b4d"), v.ellipsoid([0, -0.053, 0.08], [0.028, 5e-3, 7e-3], "#775044"), v.ellipsoid([0, -0.057, 0.087], [0.022, 18e-4, 3e-3], "#47332c"), v.ellipsoid(
    [0, 0.045, -0.025],
    [0.091, 0.099, 0.083],
    r.hair,
    (y, E, x) => x < -0.027 || E > 0.079 + Math.sin(y * 28 + s) * 9e-3 || Math.abs(y) > 0.075 && E > 0.013
  );
  for (let y = 0; y < 24; y++) {
    const E = y * 2.4;
    v.ellipsoid([Math.cos(E) * 0.065, 0.103 + Math.sin(y * 0.82) * 8e-3, -0.025 + Math.sin(E) * 0.05], [0.026, 0.023, 0.03], y % 5 === 0 && s === 5 ? "#c1b49a" : r.hair);
  }
  if (m) for (const y of [-1, 1])
    v.ellipsoid([y * 0.079, -0.041, -0.04], [0.03, 0.128, 0.062], r.hair), v.ellipsoid([y * 0.085, -0.032, 9e-3], [4e-3, 9e-3, 4e-3], "#cbb280");
  (s === 1 || s === 4) && v.ellipsoid(
    [0, -0.082, 0.024],
    [0.06, 0.045, 0.064],
    r.hair,
    (y, E, x) => x > 0.048 && E < -0.071 || Math.abs(y) > 0.054 && E < -0.029
  ), l.add(v.mesh(e, t));
  const S = new to(22e-4);
  for (const y of [-1, 1])
    S.ellipsoid([y * 0.034, 0.019, 0.082], [0.0175, 7e-3, 9e-3], "#afa99c"), S.ellipsoid([y * 0.034, 0.019, 0.089], [65e-4, 65e-4, 35e-4], s === 2 ? "#506667" : "#554333"), S.ellipsoid([y * 0.034, 0.019, 0.092], [32e-4, 4e-3, 2e-3], "#0d1010"), S.ellipsoid([y * 0.033, 0.022, 0.094], [15e-4, 15e-4, 1e-3], "#e7d7bf");
  if (u.add(S.mesh(e, t)), l.add(u), s === 2 || s === 5) {
    const y = new to(3e-3);
    for (const E of [-1, 1])
      y.ellipsoid(
        [E * 0.035, 0.02, 0.094],
        [0.027, 0.02, 3e-3],
        "#56514a",
        (x, M) => ((x - E * 0.035) / 0.022) ** 2 + ((M - 0.02) / 0.015) ** 2 > 1
      ), y.limb([E * 0.06, 0.024, 0.09], [E * 0.085, 0.026, -5e-3], [25e-4, 3e-3, 3e-3], "#56514a");
    y.limb([-0.01, 0.025, 0.097], [0.01, 0.025, 0.097], [3e-3, 2e-3, 3e-3], "#72634c"), l.add(y.mesh(e, t));
  }
  return l.scale.set(m ? 0.91 : s === 1 ? 1.06 : s === 2 ? 0.94 : 1, s === 5 ? 1.08 : s === 4 ? 0.97 : 1, 1), l.position.set(0, 1.41, 4e-3), o.add(l), o.scale.set(s === 1 ? 1.05 : m ? 0.96 : 1, s === 2 ? 0.97 : s === 4 ? 1.035 : 1, 1), { root: o, head: l, leftArm: d, rightArm: f, cards: h, eyes: u, seat: s };
}
class JE {
  constructor(e, t) {
    this.texture = t;
    const r = Eg();
    for (const [v, S] of [[this.left, !1], [this.right, !0]]) {
      const y = new to(22e-4), E = "#a9846b";
      if (y.limb([S ? 0.04 : -0.04, -0.17, 0.045], [0, -0.01, 0], [0.029, 0.039, 0.026], "#272b2c"), y.ellipsoid([0, -7e-3, 0], [0.029, 0.018, 0.025], "#aaa391"), y.ellipsoid([0, 0.028, 0], [0.032, 0.044, 0.017], E), S) {
        for (let x = 0; x < 4; x++) {
          const M = -0.022 + x * 0.014, L = x < 2 ? 0.077 + x * 3e-3 : 0.057 - (x - 2) * 0.01;
          y.limb([M, 0.055, 0], [M - 5e-3, L + 8e-3, -0.012], [75e-4, 0.012, 0.01], E), y.limb([M - 5e-3, L + 8e-3, -0.012], [M - 0.011, L - 3e-3, -0.038], [75e-4, 9e-3, 0.013], E), y.ellipsoid([M - 0.012, L - 3e-3, -0.047], [55e-4, 7e-3, 15e-4], "#bda087");
        }
        y.limb([-0.027, 0.023, 7e-3], [-0.04, 0.045, 0.014], [0.012, 0.016, 0.012], E), y.limb([-0.04, 0.045, 0.014], [-0.022, 0.055, -0.01], [0.01, 0.01, 0.014], E);
      } else {
        y.limb([-0.022, 0.052, -9e-3], [-0.018, 0.085, -0.018], [9e-3, 0.013, 9e-3], E), y.limb([-0.018, 0.085, -0.018], [0.01, 0.093, -0.014], [8e-3, 9e-3, 8e-3], E);
        for (let x = 0; x < 3; x++) {
          const M = -0.01 + x * 0.014, L = 0.055 - x * 8e-3;
          y.limb([M, L, -4e-3], [M, L + 0.012, -0.03], [8e-3, 0.01, 0.012], E), y.limb([M, L + 0.012, -0.03], [M, L - 5e-3, -0.038], [8e-3, 0.012, 8e-3], E);
        }
        y.limb([0.027, 0.021, 4e-3], [0.039, 0.052, 0.016], [0.012, 0.017, 0.012], E), y.limb([0.039, 0.052, 0.016], [0.012, 0.078, 0.013], [0.012, 0.013, 9e-3], E), y.ellipsoid([0.012, 0.079, 0.021], [8e-3, 0.01, 18e-4], "#c0a78e");
      }
      v.add(y.mesh(e, r)), this.root.add(v);
    }
    this.fan.position.set(-0.01, 0.124, 0), this.left.add(this.fan);
    for (let v = 0; v < 2; v++) {
      const S = new Ct(new Pi(0.072, 0.101), new Dr({ color: "#bcb6aa", side: $n }));
      S.position.set((v - 0.5) * 0.025, 0, v * 1e-3), S.rotation.z = (v - 0.5) * -0.16, this.fan.add(S), this.paper.push(S);
    }
    const o = new Jt();
    o.position.set(-0.019, 0.079, -0.029), o.quaternion.setFromUnitVectors(new z(0, 1, 0), new z(1, 0.08, -0.25).normalize()), o.scale.setScalar(0.78), this.right.add(o), this.mouthLocal.set(0, -0.073 * 0.78, 0).applyQuaternion(o.quaternion).add(o.position);
    const l = new Ct(new Rr(75e-4, 8e-3, 0.145, 14), new Sn({ color: "#52311f", roughness: 0.92 }));
    o.add(l);
    for (let v = 0; v < 14; v++) {
      const S = new Ct(new Gf(77e-4, 45e-5, 3, 14), new Sn({ color: "#39261c", roughness: 1 }));
      S.rotation.x = Math.PI / 2, S.position.y = -0.061 + v * 9e-3, o.add(S);
    }
    const u = new Ct(new Rr(81e-4, 81e-4, 0.018, 14), new Sn({ color: "#b79751", roughness: 0.4, metalness: 0.4 }));
    u.position.y = -0.035, o.add(u);
    const d = new Ct(new Rr(78e-4, 75e-4, 0.018, 14), new Sn({ color: "#68615a", roughness: 1 }));
    d.position.y = 0.076, o.add(d), this.ember = new Sn({ color: "#842711", emissive: "#ed4012", emissiveIntensity: 0.5, roughness: 1 });
    const f = new Ct(new Rr(72e-4, 72e-4, 2e-3, 14), this.ember);
    f.position.y = 0.086, o.add(f), this.cigarTip = f;
    const h = document.createElement("canvas");
    h.width = h.height = 64;
    const m = h.getContext("2d"), _ = m.createRadialGradient(32, 32, 0, 32, 32, 32);
    _.addColorStop(0, "#d7d2c860"), _.addColorStop(0.4, "#b6b5b028"), _.addColorStop(1, "#aab1b000"), m.fillStyle = _, m.fillRect(0, 0, 64, 64), this.smokeTexture = new ao(h);
  }
  texture;
  root = new Jt();
  left = new Jt();
  right = new Jt();
  fan = new Jt();
  paper = [];
  smoke = [];
  ember;
  cigarTip;
  smokeTexture;
  smokingAt = -100;
  dealtAt = -100;
  foldAt = -100;
  visibleHand = !1;
  lastHand = 0;
  lastEmission = 0;
  active = !1;
  inspecting = !1;
  mouthLocal = new z();
  restingRotation = new as().setFromEuler(new ai(0.1, -0.35, -0.08));
  smokingRotation = new as().setFromEuler(new ai(0.04, -0.1, -0.06));
  setActive(e) {
    this.active = e, this.root.visible = e;
  }
  setInspection(e) {
    e && !this.inspecting && (this.smokingAt = -100), this.inspecting = e;
  }
  update(e, t, r) {
    const o = performance.now() / 1e3;
    r !== this.lastHand && (this.dealtAt = o, this.lastHand = r), t && this.visibleHand && (this.foldAt = o), this.visibleHand = e.length === 2 && !t, e.forEach((l, u) => {
      const d = this.paper[u].material;
      d.map = this.texture(l), d.needsUpdate = !0;
    });
  }
  smokeCigar() {
    const e = performance.now() / 1e3;
    return !this.active || this.inspecting || e - this.smokingAt < 4.2 ? !1 : (this.smokingAt = e, !0);
  }
  frame(e, t) {
    const r = e - this.smokingAt, o = e - this.dealtAt, l = e - this.foldAt, u = r < 0.9 ? An.smoothstep(r, 0, 0.9) : r < 2 ? 1 : 1 - An.smoothstep(r, 2, 3.2), d = t ? 0 : Math.sin(e * 1.1) * 15e-4, f = this.visibleHand ? 0 : An.smoothstep(l, 0, 0.7), h = 1 - An.smoothstep(o, 0.35, 1.25);
    this.left.visible = this.visibleHand || l < 0.8, this.left.position.set(-0.205, -0.205 + d - Math.max(f, h) * 0.24, -0.47), this.left.rotation.set(-0.18, 0.24, 0.1 + f * 0.55);
    const _ = new z(0, -0.12, -0.16).sub(this.mouthLocal.clone().applyQuaternion(this.smokingRotation));
    this.right.position.lerpVectors(new z(0.235, -0.19 + d, -0.5), _, u), this.right.quaternion.slerpQuaternions(this.restingRotation, this.smokingRotation, u), this.ember.emissiveIntensity = 0.5 + u * 2.5;
    const v = r > 1.8 && r < 3.8;
    if (this.active && !this.inspecting && !t && e - this.lastEmission > (v ? 0.07 : 0.25)) {
      this.lastEmission = e;
      const S = new vg({ map: this.smokeTexture, color: "#b5b6b1", transparent: !0, depthWrite: !1, opacity: 0.25 }), y = new xg(S), E = e * 71;
      this.root.updateWorldMatrix(!0, !0);
      const x = v ? new z(0, -0.02, -0.22) : this.root.worldToLocal(this.cigarTip.getWorldPosition(new z()));
      y.position.copy(x), this.root.add(y), this.smoke.push({ mesh: y, birth: e, seed: E, origin: x });
    }
    for (let S = this.smoke.length - 1; S >= 0; S--) {
      const y = this.smoke[S], E = e - y.birth;
      if (E > 2.6 || !this.active || this.inspecting || t) {
        y.mesh.material.dispose(), y.mesh.removeFromParent(), this.smoke.splice(S, 1);
        continue;
      }
      y.mesh.position.copy(y.origin).add(new z(Math.sin(E * 2 + y.seed) * E * 0.024, E * 0.055, -E * 0.045)), y.mesh.scale.setScalar(0.021 + E * 0.04), y.mesh.material.rotation = y.seed + E * 0.3, y.mesh.material.opacity = Math.sin(E / 2.6 * Math.PI) * 0.27;
    }
  }
  dispose() {
    this.smokeTexture.dispose();
  }
}
const Ld = [500, 100, 25, 5, 1];
class ew {
  inventory = [];
  nextId = 1;
  previous = null;
  amount(e) {
    return this.inventory.filter((t) => t.account === e).reduce((t, r) => t + r.value, 0);
  }
  transfer(e, t, r) {
    if (r > this.amount(e)) throw new Error(`Visual chip transfer exceeds ${e}.`);
    for (; r > 0; ) {
      const o = this.inventory.filter((f) => f.account === e).sort((f, h) => h.value - f.value || h.id - f.id), l = o.find((f) => f.value <= r);
      if (l) {
        l.account = t, r -= l.value;
        continue;
      }
      const u = o.at(-1), d = Ld[Ld.indexOf(u.value) + 1];
      if (!d) throw new Error("A one-chip unit cannot be split.");
      this.inventory = this.inventory.filter((f) => f.id !== u.id);
      for (let f = 0; f < u.value / d; f++) this.inventory.push({ id: this.nextId++, value: d, account: e, origin: u.origin ?? u.id });
    }
  }
  sync(e) {
    const t = e.players.flatMap((l) => [{ account: `bank:${l.seat}`, amount: l.stack }, { account: `bet:${l.seat}`, amount: l.bet }]);
    t.push({ account: "pot", amount: e.players.reduce((l, u) => l + u.committed - u.bet, 0) });
    const r = this.previous;
    if (r && e.revision === r.revision && e.handNumber === r.handNumber && e.deck.join() === r.deck.join() && t.every(({ account: l, amount: u }) => this.amount(l) === u))
      return this.previous = e, this.inventory.map((l) => ({ ...l }));
    if (!r || e.revision !== r.revision + 1 || e.initialTotal !== r.initialTotal || e.handNumber < r.handNumber || e.handNumber > r.handNumber + 1 || e.handNumber === 1 && e.revision === 1 && r.phase !== "ready" && e.deck.join() !== r.deck.join()) {
      this.inventory = [];
      for (const { account: l, amount: u } of t) {
        let d = u;
        for (const f of Ld)
          if (!(f === 500 && u <= 3e3 && l !== "pot"))
            for (; d >= f; )
              this.inventory.push({ id: this.nextId++, value: f, account: l }), d -= f;
      }
    } else {
      if (e.phase === "complete" || e.street !== r.street)
        for (const l of e.players) this.transfer(`bet:${l.seat}`, "pot", this.amount(`bet:${l.seat}`));
      for (const l of e.players) {
        const u = `bank:${l.seat}`, d = `bet:${l.seat}`, f = this.amount(u) - l.stack;
        if (f > 0) this.transfer(u, d, f);
        else if (f < 0) {
          const h = Math.min(-f, this.amount(d));
          this.transfer(d, u, h), this.transfer("pot", u, -f - h);
        }
      }
    }
    for (const { account: l, amount: u } of t) if (this.amount(l) !== u) throw new Error(`Visual ${l} diverged from poker ledger.`);
    return this.previous = e, this.inventory.map((l) => ({ ...l }));
  }
}
const On = { feltY: 0.7925, feltX: 1.69, feltZ: 0.915, exponent: 2.7, cardY: 0.7931 }, tw = 0.64;
function P0(s, e, t) {
  const [r, o] = t[s];
  return new z(r * 0.72 + (e - 0.5) * 0.112, On.cardY, s === 0 ? tw : o * 0.54);
}
function nw(s, e) {
  const [t, r] = e[s];
  return new z(s === 0 ? -0.22 : t * 0.73 - 0.13, On.feltY + 6e-3, s === 0 ? 0.7 : r * 0.6);
}
function L0(s, e, t) {
  const r = Math.cos(s), o = Math.sin(s), l = 2 / On.exponent;
  return [Math.sign(r) * Math.abs(r) ** l * e, Math.sign(o) * Math.abs(o) ** l * t];
}
function iw() {
  const s = new Jt(), e = 192, t = [
    [1.9, 1.125, 0.755],
    [1.91, 1.135, 0.805],
    [1.895, 1.12, 0.835],
    [1.87, 1.095, 0.843],
    [1.75, 0.975, 0.843],
    [1.738, 0.963, 0.843],
    [1.73, 0.955, 0.843],
    [1.712, 0.937, 0.832],
    [On.feltX, On.feltZ, On.feltY]
  ], r = [], o = [];
  for (const [_, v, S] of t) for (let y = 0; y <= e; y++) {
    const [E, x] = L0(y / e * Math.PI * 2, _, v);
    r.push(E, S, x);
  }
  const l = new Ln();
  for (let _ = 0; _ < t.length - 1; _++) {
    const v = o.length;
    for (let S = 0; S < e; S++) {
      const y = _ * (e + 1) + S, E = y + e + 1;
      o.push(y, E, y + 1, y + 1, E, E + 1);
    }
    l.addGroup(v, o.length - v, _ === 5 ? 2 : _ < 2 ? 0 : 1);
  }
  l.setAttribute("position", new fn(r, 3)), l.setIndex(o), l.computeVertexNormals();
  const u = new Ct(l, [
    new Sn({ color: "#33251f", roughness: 0.72 }),
    new Sn({ color: "#242521", roughness: 0.84 }),
    new Sn({ color: "#9b8252", metalness: 0.45, roughness: 0.58 })
  ]);
  u.name = "table-rail", u.castShadow = !0, u.receiveShadow = !0, s.add(u);
  const d = [0, On.feltY, 0], f = [];
  for (let _ = 0; _ <= e; _++) {
    const [v, S] = L0(_ / e * Math.PI * 2, On.feltX, On.feltZ);
    d.push(v, On.feltY, S), _ < e && f.push(0, _ + 2, _ + 1);
  }
  const h = new Ln();
  h.setAttribute("position", new fn(d, 3)), h.setIndex(f), h.computeVertexNormals();
  const m = new Ct(h, new Sn({ color: "#22473e", roughness: 1 }));
  return m.name = "table-felt", m.receiveShadow = !0, s.add(m), s;
}
const Dd = [500, 100, 25, 5, 1], Nd = ["#373138", "#3b536f", "#456d55", "#883f35", "#b7ad97"];
class rw {
  constructor(e) {
    this.seats = e, Dd.forEach((t, r) => {
      const o = document.createElement("canvas");
      o.width = o.height = 128;
      const l = o.getContext("2d");
      l.fillStyle = Nd[r], l.fillRect(0, 0, 128, 128);
      for (let S = 0; S < 8; S++) {
        const y = S * Math.PI / 4;
        l.save(), l.translate(64, 64), l.rotate(y), l.fillStyle = "#d4c7aa", l.fillRect(-6, -64, 12, 17), l.restore();
      }
      l.beginPath(), l.arc(64, 64, 39, 0, Math.PI * 2), l.fillStyle = "#bbae91", l.fill(), l.strokeStyle = Nd[r], l.lineWidth = 2, l.beginPath(), l.arc(64, 64, 34, 0, Math.PI * 2), l.stroke(), l.fillStyle = "#292924", l.textAlign = "center", l.textBaseline = "middle", l.font = "bold 28px Georgia", l.fillText(String(t), 64, 65);
      const u = new ao(o);
      u.colorSpace = yn, this.textures.push(u);
      const d = document.createElement("canvas");
      d.width = 128, d.height = 8;
      const f = d.getContext("2d");
      f.fillStyle = Nd[r], f.fillRect(0, 0, 128, 8), f.fillStyle = "#d0c0a1";
      for (let S = 0; S < 8; S++) f.fillRect(S * 16 + 4, 1, 5, 6);
      const h = new ao(d);
      h.colorSpace = yn, this.textures.push(h);
      const m = new Sn({ map: h, roughness: 0.7, color: "#bdbdbd" }), _ = new Sn({ map: u, roughness: 0.75, color: "#bdbdbd" }), v = new hc(this.geometry, [m, _, _], 512);
      v.instanceMatrix.setUsage(tx), v.count = 0, v.frustumCulled = !1, v.castShadow = !0, v.receiveShadow = !0, this.meshes.set(t, v), this.root.add(v);
    });
  }
  seats;
  root = new Jt();
  tokens = /* @__PURE__ */ new Map();
  meshes = /* @__PURE__ */ new Map();
  textures = [];
  ledger = new ew();
  geometry = new Rr(0.026, 0.026, 55e-4, 32);
  dummy = new Xt();
  anchor(e) {
    const t = On.feltY + 275e-5;
    if (e === "pot") return new z(0, t, -0.36);
    const [r, o] = e.split(":"), l = Number(o), [u, d] = this.seats[l];
    return r === "bet" ? new z(u * 0.46, t, d * 0.28) : l === 0 ? new z(0.52, t, 0.7) : new z(u * 0.72 + 0.1, t, d * 0.61);
  }
  update(e) {
    const t = performance.now() / 1e3, r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), l = this.ledger.sync(e).sort((u, d) => u.id - d.id);
    for (const u of l) {
      const d = String(u.id), f = u.account, h = Dd.indexOf(u.value), m = `${f}:${u.value}`, _ = o.get(m) ?? 0;
      o.set(m, _ + 1);
      const v = this.anchor(f);
      v.x += (h - 2) * 0.06, v.z += Math.floor(_ / 12) * 0.06 * (v.z > 0 ? -1 : 1), v.y += _ % 12 * 55e-4;
      const S = this.tokens.get(d);
      if (S && S.group === f && S.target.distanceToSquared(v) < 1e-8) {
        r.set(d, S);
        continue;
      }
      const y = u.origin === void 0 ? void 0 : this.tokens.get(String(u.origin)), E = S?.current.clone() ?? y?.current.clone() ?? v.clone();
      r.set(d, {
        key: d,
        denomination: u.value,
        group: f,
        target: v,
        start: E,
        current: E.clone(),
        born: t,
        delay: S && S.group !== f ? Math.min(0.22, _ * 0.015) : 0
      });
    }
    this.tokens = r;
  }
  frame(e, t) {
    const r = new Map(Dd.map((o) => [o, 0]));
    for (const o of this.tokens.values()) {
      const l = t ? 1 : An.clamp((e - o.born - o.delay) / 0.75, 0, 1), u = 1 - (1 - l) ** 3;
      o.current.lerpVectors(o.start, o.target, u), this.dummy.position.copy(o.current), this.dummy.rotation.set(0, Number(o.key) * 1.3, 0), this.dummy.scale.setScalar(1), this.dummy.updateMatrix();
      const d = r.get(o.denomination);
      d < 512 && this.meshes.get(o.denomination).setMatrixAt(d, this.dummy.matrix), r.set(o.denomination, d + 1);
    }
    for (const [o, l] of this.meshes)
      l.count = Math.min(512, r.get(o)), l.instanceMatrix.needsUpdate = !0;
  }
  dispose() {
    this.textures.forEach((e) => e.dispose());
  }
}
class sw {
  constructor(e, t) {
    this.seats = e, this.texture = t;
  }
  seats;
  texture;
  root = new Jt();
  cards = /* @__PURE__ */ new Map();
  flights = [];
  previous = null;
  inspecting = !1;
  inspectedCards = [];
  card(e, t) {
    let r = this.cards.get(e);
    return r || (r = new Ct(new Pi(0.104, 0.145), new Dr({ color: "#bdb6a6", side: $n })), this.cards.set(e, r), this.root.add(r)), r.material.map = this.texture(t), r.material.needsUpdate = !0, r.rotation.x = -Math.PI / 2, r;
  }
  update(e) {
    const t = performance.now() / 1e3, r = this.previous, o = r?.handNumber !== e.handNumber || r?.deck.join() !== e.deck.join();
    if (o) {
      for (const d of this.cards.values())
        d.geometry.dispose(), d.material.dispose(), d.removeFromParent();
      this.cards.clear(), this.flights = [];
    }
    e.board.forEach((d, f) => {
      const h = `board:${f}`;
      if (this.cards.has(h)) return;
      const m = this.card(h, d), _ = new z((f - 2) * 0.122, On.cardY, -0.06);
      m.rotation.z = 0, this.flights.push({ mesh: m, start: new z(0, 0.95, -0.87), end: _, time: t, duration: 0.62, delay: (f - (r?.board.length ?? 0)) * 0.2, disappear: !1, spin: -0.18 });
    });
    const l = e.phase === "showdown" || e.phase === "complete" && e.results.some((d) => d.hand), u = r?.phase === "showdown" || r?.phase === "complete" && r.results.some((d) => d.hand);
    for (const d of e.players) {
      if (d.hole.length !== 2) continue;
      const [f, h] = this.seats[d.seat];
      for (let m = 0; m < 2; m++) {
        const _ = `seat:${d.seat}:${m}`, v = P0(d.seat, m, this.seats);
        if (l && (o || !u) && !d.folded) {
          const S = this.card(_, d.hole[m]);
          this.flights.push({ mesh: S, start: o ? v.clone() : new z(f * 0.9, 1.06, h * 0.77), end: v, time: t, duration: 0.65, delay: o ? 0 : d.seat * 0.1, disappear: !1, spin: 0.4 });
        } else if (o && !d.folded) {
          const S = this.card(_, null);
          this.flights.push({ mesh: S, start: new z(0, 0.96, -0.84), end: v, time: t, duration: 0.54, delay: m * 0.7 + d.seat * 0.105, disappear: !0, spin: 0.25 });
        } else if (d.folded && !r?.players[d.seat].folded) {
          const S = this.card(_, null);
          this.flights.push({ mesh: S, start: new z(f * 0.79, 0.98, h * 0.72), end: new z(-0.2 + m * 0.07, On.cardY, -0.65), time: t, duration: 0.68, delay: m * 0.08, disappear: !0, spin: 0.55 });
        }
      }
    }
    this.previous = e, this.updateInspection();
  }
  setInspection(e) {
    this.inspecting !== e && (this.inspecting = e, this.updateInspection());
  }
  updateInspection() {
    const e = this.previous, t = e?.players[0], r = e?.phase === "showdown" || e?.phase === "complete" && e.results.some((l) => l.hand), o = this.inspecting && !!t && !t.folded && t.hole.length === 2 && !r;
    if (o && !this.inspectedCards.length) for (let l = 0; l < 2; l++) {
      const u = new Ct(new Pi(0.104, 0.145), new Dr({ color: "#bdb6a6", side: $n }));
      u.name = "player-inspection-card", u.rotation.x = -Math.PI / 2, u.position.copy(P0(0, l, this.seats)), this.root.add(u), this.inspectedCards.push(u);
    }
    this.inspectedCards.forEach((l, u) => {
      if (l.visible = o, o) {
        const d = l.material;
        d.map = this.texture(t.hole[u]), d.needsUpdate = !0;
      }
    });
  }
  frame(e, t) {
    for (let r = this.flights.length - 1; r >= 0; r--) {
      const o = this.flights[r], l = t ? 1 : An.clamp((e - o.time - o.delay) / o.duration, 0, 1);
      o.mesh.position.lerpVectors(o.start, o.end, 1 - (1 - l) ** 3), o.mesh.position.y += Math.sin(l * Math.PI) * 0.045, o.mesh.rotation.z = (1 - l) * o.spin, o.mesh.visible = e >= o.time + o.delay && !(o.disappear && l >= 1), l >= 1 && this.flights.splice(r, 1);
    }
  }
}
const Jr = [[0, 1.7], [-1.91, -0.43], [-1.15, -1.13], [0, -1.4], [1.15, -1.13], [1.91, -0.43]];
class ow {
  constructor(e, t, r = () => {
  }) {
    this.container = e, this.onFailure = t, this.onLayout = r, this.renderer = new PE({ antialias: !0, powerPreference: "high-performance" }), this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)), this.renderer.setClearColor("#090a0c"), this.renderer.outputColorSpace = yn, this.renderer.toneMapping = Pf, this.renderer.toneMappingExposure = 1.28, this.renderer.shadowMap.enabled = !0, this.renderer.shadowMap.type = I0, this.renderer.domElement.setAttribute("aria-label", "Seated first-person view of a dimly lit poker table, detailed voxel opponents, and an amber-lit bar"), this.renderer.domElement.setAttribute("role", "img"), e.append(this.renderer.domElement), this.renderer.domElement.addEventListener("webglcontextlost", this.lost), e.parentElement?.addEventListener("pointermove", this.look), e.parentElement?.addEventListener("pointerleave", this.centerLook), this.scene.fog = new Vf("#0a0b10", 0.048), this.scene.add(new FE("#96abc1", "#241a14", 0.43));
    const o = new OE("#ffdeb7", 25, 12, 0.91, 0.78, 1.6);
    o.position.set(-0.65, 3.05, 1.2), o.target.position.set(0, 0.82, -0.3), o.castShadow = !0, o.shadow.mapSize.set(2048, 2048), o.shadow.bias = -8e-5, o.shadow.normalBias = 0.013, this.scene.add(o, o.target);
    for (const [h, m, _, v, S] of [["#e6bd91", 4, 1.8, 1.9, 1.4], ["#728dca", 9, -2.7, 2.3, -2.5], ["#ef9e4b", 7, 0.3, 1.9, -3.3]]) {
      const y = new A0(h, m, 8, 1.5);
      y.position.set(_, v, S), this.scene.add(y);
    }
    this.buildRoom();
    const l = Eg();
    this.materials.set("humans", l);
    for (let h = 1; h < 6; h++) {
      const m = QE(h, this.geometry, l), [_, v] = Jr[h];
      m.root.position.set(_, 0, v), m.root.rotation.y = Math.atan2(-_ * 0.8, 0.65 - v), this.people.push(m), this.scene.add(m.root);
      const S = new Jt();
      S.position.copy(m.root.position), S.rotation.copy(m.root.rotation), this.box(S, "#211d1a", 0, 0.57, -0.04, 0.46, 0.1, 0.4), this.box(S, "#28231e", 0, 1, -0.205, 0.44, 0.75, 0.065);
      for (const y of [-0.18, 0.18]) this.box(S, "#292824", y, 0.29, -0.04, 0.03, 0.56, 0.03);
      this.scene.add(S);
      for (let y = 0; y < 2; y++) {
        const E = new Ct(new Pi(0.07, 0.103), new Dr({ map: this.cardTexture(null), color: "#d0c4ae", side: $n }));
        E.position.set((y - 0.5) * 0.031, 0, y * 2e-3), E.rotation.z = (y - 0.5) * -0.23, m.cards.add(E);
      }
    }
    this.hero = new JE(this.geometry, (h) => this.cardTexture(h)), this.camera.add(this.hero.root), this.scene.add(this.camera), this.chips = new rw(Jr), this.scene.add(this.chips.root), this.cardField = new sw(Jr, (h) => this.cardTexture(h)), this.scene.add(this.cardField.root), this.dealer = new Ct(new Rr(0.039, 0.039, 0.012, 32), this.material("#b9af99")), this.dealer.visible = !1, this.scene.add(this.dealer);
    const u = new Ln(), d = new Float32Array(450);
    for (let h = 0; h < 150; h++)
      d[h * 3] = Math.sin(h * 78.23) * 3.4, d[h * 3 + 1] = 0.85 + (Math.sin(h * 12.87) + 1) * 1.2, d[h * 3 + 2] = Math.cos(h * 61.23) * 2.7 - 1.5;
    u.setAttribute("position", new Kn(d, 3)), this.dust = new M0(u, new yg({ color: "#b69a70", size: 5e-3, transparent: !0, opacity: 0.26, depthWrite: !1 })), this.scene.add(this.dust);
    const f = new oi(1100, 800, { type: Ri, samples: 4 });
    this.composer = new jE(this.renderer, f), this.composer.addPass(new YE(this.scene, this.camera)), this.bloom = new go(new Qe(1100, 800), 0.18, 0.45, 4), this.output = new KE(), this.composer.addPass(this.bloom), this.composer.addPass(this.output), this.observer = new ResizeObserver(() => this.resize()), this.observer.observe(e), this.resize(), this.frame();
  }
  container;
  onFailure;
  onLayout;
  scene = new LE();
  camera = new Rn(70, 1.4, 0.035, 35);
  labelCamera = new Rn(70, 1.4, 0.035, 35);
  renderer;
  composer;
  bloom;
  output;
  geometry = new xo(1, 1, 1);
  materials = /* @__PURE__ */ new Map();
  textures = /* @__PURE__ */ new Map();
  people = [];
  hero;
  chips;
  cardField;
  dealer;
  gestures = /* @__PURE__ */ new Map();
  handTime = 0;
  state = null;
  signature = "";
  raf = 0;
  start = performance.now();
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  observer;
  alive = !0;
  orbit = 0;
  inspecting = !1;
  inspectionBlend = 0;
  lastFrame = performance.now();
  pointer = new Qe();
  gaze = new Qe();
  dust;
  lost = (e) => {
    e.preventDefault(), this.onFailure();
  };
  look = (e) => {
    const t = this.container.getBoundingClientRect();
    this.pointer.set((e.clientX - t.left) / t.width - 0.5, (e.clientY - t.top) / t.height - 0.5);
  };
  centerLook = () => this.pointer.set(0, 0);
  material(e) {
    let t = this.materials.get(e);
    return t || (t = new Sn({ color: e, roughness: 0.72 }), this.materials.set(e, t)), t;
  }
  box(e, t, r, o, l, u, d, f) {
    const h = new Ct(this.geometry, this.material(t));
    return h.position.set(r, o, l), h.scale.set(u, d, f), h.castShadow = !0, h.receiveShadow = !0, e.add(h), h;
  }
  glow(e, t, r, o, l, u, d, f = 3) {
    const h = new Ct(this.geometry, new Sn({ color: e, emissive: e, emissiveIntensity: f }));
    h.position.set(t, r, o), h.scale.set(l, u, d), this.scene.add(h);
  }
  buildRoom() {
    const e = [], t = (l, u, d, f, h, m, _) => e.push({ color: l, position: [u, d, f], size: [h, m, _] });
    t("#151311", 0, -0.06, -1, 12, 0.1, 13);
    for (let l = 0; l < 28; l++) for (let u = 0; u < 25; u++)
      t(["#322821", "#2b2421", "#352a25", "#292420"][(u * 7 + l * 3) % 4], (u - 12) * 0.39 + l % 2 * 0.19, l * 0.13 + 0.04, -5.3, 0.377, 0.117, 0.12);
    t("#161716", -4.8, 1.8, -1.2, 0.12, 3.6, 8), t("#181614", 4.8, 1.8, -1.2, 0.12, 3.6, 8), t("#10100f", 0, 3.6, -1.2, 10, 0.12, 9);
    for (let l = -4; l <= 4; l++) t("#221d18", l, 3.4, -1.1, 0.12, 0.23, 8);
    t("#14181a", 0, 1.93, -5.15, 4.5, 2.5, 0.08);
    for (const l of [-2.3, -0.76, 0.76, 2.3]) t("#705333", l, 1.87, -5, 0.035, 2.3, 0.1);
    for (const l of [1.13, 1.8, 2.48]) {
      t("#4a3526", 0, l, -4.89, 4.65, 0.055, 0.47), this.glow("#f2b269", 0, l - 0.032, -4.95, 4.3, 0.012, 0.03);
      for (let u = 0; u < 20; u++) {
        const d = -2.1 + u * 0.22, f = 0.22 + u % 4 * 0.038, h = ["#574125", "#253e30", "#65452a", "#334132", "#604029"][u % 5];
        t(h, d, l + f / 2 + 0.032, -4.87, 0.078, f, 0.078), t(h, d, l + f + 0.06, -4.87, 0.039, 0.076, 0.039), t("#a49673", d, l + f + 0.106, -4.87, 0.043, 0.018, 0.043), t(u % 3 ? "#9c8863" : "#3c332a", d, l + f * 0.47, -4.825, 0.063, f * 0.34, 3e-3);
      }
    }
    t("#201712", 0, 0.55, -3.82, 5.4, 1.1, 0.68);
    for (let l = -2.5; l < 2.6; l += 0.39)
      t("#34241c", l, 0.54, -3.46, 0.35, 0.91, 0.027), t("#6b5032", l, 0.91, -3.44, 0.3, 0.016, 0.016);
    t("#392e26", 0, 1.12, -3.76, 5.7, 0.1, 0.92), t("#8b673d", 0, 0.16, -3.18, 5.3, 0.035, 0.035);
    for (const l of [-1.7, -0.55, 0.65, 1.8])
      t("#171818", l, 0.36, -2.98, 0.036, 0.69, 0.036), t("#2b201c", l, 0.72, -2.98, 0.36, 0.09, 0.36), t("#27221d", l, 0.045, -2.98, 0.34, 0.06, 0.34);
    t("#151719", -3.55, 2.01, -5.17, 1.35, 2.15, 0.15);
    for (let l = 0; l < 3; l++) for (let u = 0; u < 3; u++) {
      t("#26303d", -3.96 + l * 0.41, 1.34 + u * 0.65, -5.05, 0.37, 0.6, 0.05);
      for (let d = 0; d < 6; d++) t("#354355", -4.1 + l * 0.41 + d * 0.055, 1.26 + u * 0.65 + Math.sin(d * 7) * 0.2, -5.015, 3e-3, 0.12 + d * 0.021, 2e-3);
    }
    for (const l of [-3, 3]) {
      t("#705232", l, 2.25, -5.04, 0.07, 0.36, 0.13), t("#a47d46", l, 2.3, -4.89, 0.26, 0.22, 0.19), this.glow("#ffce8d", l, 2.16, -4.9, 0.17, 0.035, 0.12);
      const u = new A0("#eaaa65", 2, 2.5, 1.5);
      u.position.set(l, 2.14, -4.6), this.scene.add(u);
    }
    this.sign("THE RIVER", 3.55, 2.33, -5.08, 1.85, 0.42), this.sign("PRIVATE CARD ROOM", 3.55, 1.98, -5.07, 1.85, 0.18, !0), this.scene.add(iw()), t("#211a16", 0, 0.65, 0, 3, 0.2, 1.7), t("#181615", 0, 0.32, 0, 1.6, 0.6, 0.65);
    for (const l of [-1.08, 1.08]) {
      t("#5a4936", l, 3.12, -0.06, 0.012, 0.9, 0.012);
      for (let u = 0; u < 9; u++) t("#51412d", l, 2.76 - u * 0.014, -0.06, 0.18 + u * 0.04, 0.015, 0.15 + u * 0.027);
      this.glow("#ffdca1", l, 2.637, -0.06, 0.42, 8e-3, 0.29, 5);
    }
    const r = new hc(this.geometry, new Sn({ roughness: 0.83 }), e.length), o = new Xt();
    e.forEach((l, u) => {
      o.position.set(...l.position), o.scale.set(...l.size), o.updateMatrix(), r.setMatrixAt(u, o.matrix), r.setColorAt(u, new lt(l.color));
    }), r.castShadow = !0, r.receiveShadow = !0, this.scene.add(r), this.feltMark();
  }
  feltMark() {
    const e = document.createElement("canvas");
    e.width = 1024, e.height = 512;
    const t = e.getContext("2d");
    t.textAlign = "center", t.strokeStyle = "#d6c18a50", t.lineWidth = 2, t.beginPath(), t.ellipse(512, 256, 445, 180, 0, 0, Math.PI * 2), t.stroke(), t.fillStyle = "#d6c18a75", t.font = "26px Georgia", t.fillText("T H E   R I V E R   C L U B", 512, 337), t.font = "16px Georgia", t.fillText("NO LIMIT  ·  GOOD COMPANY", 512, 365);
    const r = new ao(e);
    r.colorSpace = yn, this.textures.set("felt", r);
    const o = new Ct(new Pi(2.9, 1.35), new Sn({ map: r, transparent: !0, depthWrite: !1, roughness: 1 }));
    o.rotation.x = -Math.PI / 2, o.position.set(0, On.feltY + 1e-4, 0), this.scene.add(o);
  }
  sign(e, t, r, o, l, u, d = !1) {
    const f = document.createElement("canvas");
    f.width = 1024, f.height = 160;
    const h = f.getContext("2d");
    h.textAlign = "center", h.textBaseline = "middle", h.fillStyle = d ? "#c8a471" : "#e9be87", h.font = `${d ? 40 : 80}px Georgia`, h.fillText(e, 512, 80);
    const m = new ao(f);
    m.colorSpace = yn, this.textures.set(e, m);
    const _ = new Ct(new Pi(l, u), new Dr({ map: m, color: d ? "#8d785c" : "#ffd49b", transparent: !0, toneMapped: !1 }));
    _.position.set(t, r, o), this.scene.add(_);
  }
  setOrbit(e) {
    this.orbit = e, this.resize();
  }
  setInspection(e) {
    this.inspecting = e;
  }
  projectSeat(e) {
    if (e === 0) return { x: 12, y: 83 };
    const [t, r] = Jr[e], o = new z(t, 1.79, r).project(this.labelCamera);
    return { x: Math.max(7, Math.min(93, (o.x + 1) * 50)), y: (-o.y + 1) * 50 };
  }
  resize() {
    const e = this.container.clientWidth, t = Math.max(1, this.container.clientHeight);
    this.camera.aspect = e / t, this.camera.position.set(this.orbit * 0.12, 1.43, 2.02), this.camera.lookAt(this.orbit * 0.3, 1.03, -0.6), this.camera.updateProjectionMatrix(), this.camera.updateMatrixWorld(), this.renderer.setSize(e, t), this.composer.setSize(e, t), this.labelCamera.aspect = this.camera.aspect, this.labelCamera.position.copy(this.camera.position), this.labelCamera.lookAt(this.orbit * 0.3, 1.03, -0.6), this.labelCamera.updateProjectionMatrix(), this.labelCamera.updateMatrixWorld(), this.onLayout();
  }
  cardTexture(e) {
    const t = e === null ? "back" : String(e), r = this.textures.get(t);
    if (r) return r;
    const o = document.createElement("canvas");
    o.width = 256, o.height = 356;
    const l = o.getContext("2d");
    if (l.fillStyle = e === null ? "#65412f" : "#e8dfc9", l.fillRect(0, 0, 256, 356), l.strokeStyle = e === null ? "#a68d5d" : "#cdbf9d", l.lineWidth = 6, l.strokeRect(10, 10, 236, 336), e === null) {
      l.strokeStyle = "#a48a584f", l.lineWidth = 1;
      for (let d = -300; d < 550; d += 14)
        l.beginPath(), l.moveTo(d, 0), l.lineTo(d + 356, 356), l.stroke(), l.beginPath(), l.moveTo(d, 0), l.lineTo(d - 356, 356), l.stroke();
      l.fillStyle = "#b9a176", l.textAlign = "center", l.font = "50px Georgia", l.fillText("♠", 128, 190);
    } else
      l.fillStyle = [1, 2].includes(Ki(e)) ? "#a22f29" : "#172823", l.font = "bold 63px Georgia", l.fillText(sc(e), 18, 68), l.font = "48px Georgia", l.fillText(va[Ki(e)], 19, 119), l.font = "115px Georgia", l.textAlign = "center", l.fillText(va[Ki(e)], 133, 247), l.save(), l.translate(256, 356), l.rotate(Math.PI), l.textAlign = "left", l.font = "bold 43px Georgia", l.fillText(sc(e), 16, 52), l.restore();
    const u = new ao(o);
    return u.colorSpace = yn, u.anisotropy = this.renderer.capabilities.getMaxAnisotropy(), this.textures.set(t, u), u;
  }
  setPlaying(e) {
    this.hero.setActive(e);
  }
  smokeCigar() {
    return !this.inspecting && this.hero.smokeCigar();
  }
  update(e) {
    const t = this.state, r = performance.now() / 1e3;
    t?.handNumber !== e.handNumber && (this.handTime = r, this.gestures.clear());
    for (const u of e.players) {
      const d = t?.players[u.seat];
      !d || t?.handNumber !== e.handNumber || (u.folded && !d.folded ? this.gestures.set(u.seat, { kind: "fold", time: r }) : u.committed > d.committed ? this.gestures.set(u.seat, { kind: "bet", time: r }) : u.action === "Check" && d.action !== "Check" && this.gestures.set(u.seat, { kind: "check", time: r }), e.phase === "complete" && t.phase !== "complete" && e.results.some((f) => f.seat === u.seat && f.won > 0) && this.gestures.set(u.seat, { kind: "win", time: r }));
    }
    this.state = e, this.chips.update(e);
    const o = JSON.stringify([e.handNumber, e.board, e.phase, e.players.map((u) => [u.hole, u.folded, u.stack, u.bet]), e.dealer]);
    if (o === this.signature) return;
    this.signature = o;
    const l = e.phase === "showdown" || e.phase === "complete" && e.results.some((u) => u.hand);
    this.hero.update(e.players[0].hole, e.players[0].folded || l, e.handNumber), this.cardField.update(e), this.dealer.visible = e.dealer >= 0, e.dealer >= 0 && this.dealer.position.copy(nw(e.dealer, Jr));
  }
  frame = () => {
    if (!this.alive) return;
    const e = performance.now(), t = (e - this.start) / 1e3, r = Math.min(0.1, (e - this.lastFrame) / 1e3);
    this.lastFrame = e, this.inspectionBlend = this.reduced.matches ? Number(this.inspecting) : An.lerp(this.inspectionBlend, Number(this.inspecting), 1 - Math.exp(-r * 12));
    const o = this.inspectionBlend;
    this.gaze.lerp(this.reduced.matches ? new Qe() : this.pointer, 0.045), this.camera.position.set(this.orbit * 0.12 * (1 - o), An.lerp(1.43, 1.95, o), An.lerp(2.02, 1.05, o)), this.camera.lookAt(An.lerp(this.orbit * 0.3 + this.gaze.x * 0.11, 0.14, o), An.lerp(1.03 - this.gaze.y * 0.055, 0.793, o), An.lerp(-0.6, 0.3, o)), this.camera.fov = An.lerp(70, 55, o), this.camera.updateProjectionMatrix(), this.hero.root.position.y = -o * 0.8, this.hero.setInspection(this.inspecting || o > 0.01), this.cardField.setInspection(o > 0.45), this.people.forEach(({ root: l, head: u, leftArm: d, rightArm: f, cards: h, eyes: m, seat: _ }) => {
      const v = this.state?.actor === _, S = this.state?.players[_], y = this.gestures.get(_), E = e / 1e3 - (y?.time ?? -100), x = !this.reduced.matches, M = E < 1.25 ? Math.sin(Math.min(1, E / 1.25) * Math.PI) : 0, L = v ? Math.max(0, Math.sin(t * 1.6 + _)) : Math.max(0, Math.sin(t * 0.42 + _ * 2.1) - 0.75) * 2, R = An.smoothstep(e / 1e3 - this.handTime, 1 + _ * 0.08, 1.7 + _ * 0.08), D = this.state?.phase === "showdown" || this.state?.phase === "complete" && this.state.results.some((I) => I.hand);
      h.visible = !!S?.hole.length && !S.folded && !D && R > 0.3, l.position.y = this.reduced.matches ? 0 : Math.sin(t * 1.05 + _ * 1.7) * 15e-4;
      const ee = this.state?.actor ?? 0, F = Jr[ee][0];
      u.rotation.y = x ? Math.sin(t * 0.27 + _ * 1.3) * 0.045 + (v ? -0.06 : An.clamp((F - Jr[_][0]) * 0.045, -0.13, 0.13)) : 0, u.rotation.x = x ? L * 0.15 + (y?.kind === "win" ? -M * 0.06 : 0) : 0, d.rotation.x = x ? -0.1 - L * 0.23 + (1 - R) * 0.35 : -0.1, d.rotation.y = x ? Math.sin(t * 0.4 + _) * 0.035 : 0, (S?.folded || D) && (d.rotation.x = 0.42), y?.kind === "fold" && E < 1.25 && x && (d.rotation.x = -0.18 + M * 0.8), f.rotation.y = x && y?.kind === "bet" ? -M * 0.16 : 0, f.rotation.x = x && y?.kind === "bet" ? -M * 0.16 : x && y?.kind === "check" && E < 0.8 ? Math.sin(E * Math.PI * 6) * 0.045 : 0, f.position.z = 0.16 + (x && y?.kind === "bet" ? M * 0.012 : 0), u.rotation.z = x ? (_ === 1 ? 0.035 : _ === 3 ? -0.025 : 0) + Math.sin(t * 0.35 + _) * 0.012 : 0, m.scale.y = !this.reduced.matches && (t + _ * 1.73) % 5.4 < 0.13 ? 0.08 : 1;
    }), this.dust.rotation.y = this.reduced.matches ? 0 : Math.sin(t * 0.02) * 0.08, this.hero.frame(e / 1e3, this.reduced.matches), this.chips.frame(e / 1e3, this.reduced.matches), this.cardField.frame(e / 1e3, this.reduced.matches), this.composer.render(), this.raf = requestAnimationFrame(this.frame);
  };
  dispose() {
    this.alive = !1, cancelAnimationFrame(this.raf), this.observer.disconnect(), this.renderer.domElement.removeEventListener("webglcontextlost", this.lost), this.container.parentElement?.removeEventListener("pointermove", this.look), this.container.parentElement?.removeEventListener("pointerleave", this.centerLook);
    const e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set();
    this.scene.traverse((r) => {
      if (r instanceof Ct || r instanceof M0 || r instanceof xg) {
        e.add(r.geometry);
        for (const o of Array.isArray(r.material) ? r.material : [r.material]) t.add(o);
        r instanceof hc && r.dispose();
      }
    }), e.forEach((r) => r.dispose()), t.forEach((r) => r.dispose()), this.materials.forEach((r) => r.dispose()), this.textures.forEach((r) => r.dispose()), this.hero.dispose(), this.chips.dispose(), this.bloom.dispose(), this.output.dispose(), this.composer.dispose(), this.renderer.dispose(), this.renderer.domElement.remove();
  }
}
const D0 = "poker.table.v1", Yi = (s) => s.toLocaleString("en-US"), aw = (s) => s instanceof HTMLElement && !!s.closest("button, input, select, textarea, a, [contenteditable]"), lw = (s) => s instanceof HTMLElement && !!s.closest("input, select, textarea, [contenteditable]");
function Id({ card: s, small: e = !1, highlight: t = !1 }) {
  return /* @__PURE__ */ W.jsx(
    "span",
    {
      className: `playing-card ${e ? "small" : ""} ${s === null ? "back" : ""} ${t ? "winning" : ""} ${s !== null && [1, 2].includes(Ki(s)) ? "red" : ""}`,
      "aria-label": s === null ? "Face-down card" : p_(s),
      children: s !== null ? /* @__PURE__ */ W.jsxs(W.Fragment, { children: [
        /* @__PURE__ */ W.jsx("b", { children: sc(s) }),
        /* @__PURE__ */ W.jsx("span", { children: va[Ki(s)] }),
        /* @__PURE__ */ W.jsx("i", { children: va[Ki(s)] })
      ] }) : /* @__PURE__ */ W.jsx("span", { children: "◆" })
    }
  );
}
function cw({ api: s }) {
  const [e, t] = gt.useState(null), r = gt.useRef(null), [o, l] = gt.useState(!0), [u, d] = gt.useState(!0), [f, h] = gt.useState(!1), [m, _] = gt.useState(!1), [v, S] = gt.useState(""), [y, E] = gt.useState(!1), [x, M] = gt.useState(!1), [L, R] = gt.useState(!1), [D, ee] = gt.useState("relaxed"), [F, I] = gt.useState(null), [Y, ve] = gt.useState(!1), [T, C] = gt.useState(40), [te, J] = gt.useState(!1), [se, _e] = gt.useState(!1), [Z, he] = gt.useState(!1), O = gt.useRef(!1), [ue, ae] = gt.useState(0), [U, oe] = gt.useState(0), Fe = gt.useRef(null), K = gt.useRef(null), ce = gt.useRef(null), pe = gt.useRef(null), Me = gt.useRef(!0), Re = gt.useRef(!1), Le = gt.useRef({ muted: !1, speed: "relaxed" });
  gt.useEffect(() => {
    Me.current = !0, pe.current = new h_();
    let H = !0;
    return s.storage.get(D0).then((me) => {
      if (H) {
        if (me !== void 0) {
          if (!me || typeof me != "object" || typeof me.muted != "boolean" || !["relaxed", "brisk"].includes(me.speed))
            throw new Error("The saved table format is invalid. Your saved data has been preserved.");
          me.table !== null && (r.current = no.restore(me.table), t(r.current.snapshot())), Le.current = { muted: me.muted, speed: me.speed }, R(me.muted), ee(me.speed), pe.current?.setMuted(me.muted);
        }
        l(!1);
      }
    }).catch((me) => {
      H && (S(me instanceof Error ? me.message : "Could not read saved progress."), E(!0), l(!1));
    }), () => {
      H = !1, Me.current = !1, pe.current?.dispose(), pe.current = null;
    };
  }, [s]), gt.useEffect(() => {
    try {
      const H = new ow(Fe.current, () => {
        M(!0), h(!0);
      }, () => oe((me) => me + 1));
      return ce.current = H, oe((me) => me + 1), H.update(r.current?.snapshot() ?? new no().snapshot()), () => {
        H.dispose(), ce.current = null;
      };
    } catch {
      M(!0);
    }
  }, []), gt.useEffect(() => {
    try {
      e && ce.current?.update(e);
    } catch (H) {
      console.error("Poker scene projection failed; saved hand is preserved.", H), M(!0), h(!0);
    }
  }, [e, U]), gt.useEffect(() => {
    ce.current?.setOrbit(ue), oe((H) => H + 1);
  }, [ue]), gt.useEffect(() => {
    ce.current?.setPlaying(!u);
  }, [u, U]), gt.useEffect(() => {
    ce.current?.setInspection(Z);
  }, [Z, U]), gt.useEffect(() => {
    (u || f || F || Y || v || x) && (O.current = !1, he(!1));
  }, [u, f, F, Y, v, x]), gt.useEffect(() => {
    const H = (pt) => {
      pt.code === "Space" && O.current && (O.current = !1, he(!1));
    }, me = () => {
      O.current = !1, he(!1);
    }, $e = () => {
      document.hidden && me();
    };
    return window.addEventListener("keyup", H), window.addEventListener("blur", me), document.addEventListener("visibilitychange", $e), () => {
      window.removeEventListener("keyup", H), window.removeEventListener("blur", me), document.removeEventListener("visibilitychange", $e);
    };
  }, []);
  const Je = async (H) => {
    Re.current = !0, _(!0);
    try {
      await s.storage.set(D0, { table: H, ...Le.current }), Me.current && (S(""), E(!1));
    } catch {
      Me.current && (S("Your last action is still on this table, but could not be saved. Retry saving to continue."), h(!0));
    } finally {
      Re.current = !1, Me.current && _(!1);
    }
  }, ft = () => {
    const H = r.current.snapshot();
    t(H), Je(H);
  }, at = (H) => {
    if (!(Re.current || !r.current || r.current.snapshot().actor !== 0 || f || x || v))
      try {
        pe.current?.unlock(), r.current.act(0, H), pe.current?.play(H.type === "fold" ? "fold" : "chip"), K.current?.focus({ preventScroll: !0 }), ft();
      } catch (me) {
        S(me instanceof Error ? me.message : "That action is unavailable.");
      }
  };
  gt.useEffect(() => {
    if (!e || u || f || F || m || v || x || o) return;
    const { phase: H, actor: me } = e;
    if (H === "complete" || H === "ready" || H === "betting" && me === 0) return;
    const $e = D === "brisk" ? H === "betting" ? 500 : 850 : H === "betting" ? 1150 : 1450, pt = window.setTimeout(() => {
      const V = r.current;
      if (!(!V || Re.current))
        try {
          H === "betting" && me !== null ? (V.act(me, y_(__(V.snapshot(), V.legal()))), pe.current?.play("chip")) : (V.advance(), pe.current?.play(V.snapshot().phase === "complete" ? "win" : "card")), ft();
        } catch (Ie) {
          S(Ie instanceof Error ? Ie.message : "The table needs attention."), h(!0);
        }
    }, $e);
    return () => window.clearTimeout(pt);
  }, [e, u, f, F, m, v, x, o, D]), gt.useEffect(() => {
    const H = () => {
      r.current && !u && h(!0);
    }, me = () => {
      document.hidden && H();
    };
    return window.addEventListener("blur", H), document.addEventListener("visibilitychange", me), () => {
      window.removeEventListener("blur", H), document.removeEventListener("visibilitychange", me);
    };
  }, [u]), gt.useEffect(() => {
    e?.actor === 0 && !u && pe.current?.play("turn"), J(!1);
    const H = r.current?.legal().min;
    H && C(H);
  }, [e?.revision, u]);
  const B = () => {
    o || Re.current || x || y || (pe.current?.unlock(), r.current || (r.current = new no(), r.current.startHand(), ft(), pe.current?.play("card")), d(!1), h(!1), K.current?.focus({ preventScroll: !0 }));
  }, qt = () => {
    Re.current || o || x || (r.current = new no(), r.current.startHand(), ve(!1), I(null), S(""), E(!1), h(!1), d(!1), pe.current?.unlock(), pe.current?.play("card"), K.current?.focus({ preventScroll: !0 }), ft());
  }, ht = () => {
    Re.current || !r.current || e?.phase !== "complete" || (r.current.startHand(), pe.current?.play("card"), K.current?.focus({ preventScroll: !0 }), ft());
  }, ct = (H) => {
    h(!0), I(H);
  }, Ze = () => {
    if (Re.current || o || y) return;
    const H = !L;
    R(H), Le.current.muted = H, pe.current?.setMuted(H), H || pe.current?.unlock(), Je(r.current?.snapshot() ?? null);
  }, Ce = e, ke = r.current?.legal() ?? { check: !1, call: 0, raise: !1, min: 0, max: 0 }, P = Ce?.players[0], b = Ce?.phase === "betting" && Ce.actor === 0, $ = !b || f || !!F || m || !!v || x, fe = Ce?.players.filter((H) => H.stack > 0).length ?? 6, xe = Ce?.phase === "complete", de = xe && fe === 1, Xe = xe && P?.stack === 0, Pe = Ce?.players.reduce((H, me) => H + me.committed, 0) ?? 0, Oe = Ce?.awards.reduce((H, me) => H + me.amount, 0) ?? 0, vt = P?.hole.length === 2 && (Ce?.board.length ?? 0) >= 3 ? oc([...P.hole, ...Ce.board]) : null, we = xe ? Ce?.results.find((H) => H.seat === 0 && H.won > 0)?.hand?.cards ?? [] : [], Ue = Number.isFinite(T) ? Math.max(ke.min, Math.min(ke.max, Math.floor(T))) : ke.min, rt = Ce?.phase === "showdown" || xe && Ce?.results.some((H) => H.hand), it = xe ? de ? "The table is yours." : Xe ? "A good run. Another seat awaits." : Ce.history[0]?.summary : Ce?.phase === "showdown" ? "Cards on the table." : Ce?.phase === "transition" ? "The next chapter…" : b ? "Your move." : Ce?.actor != null ? `${_i[Ce.actor].name} is thinking…` : "Welcome to the club.";
  return /* @__PURE__ */ W.jsxs(
    "main",
    {
      className: `poker ${Z ? "inspecting" : ""}`,
      ref: K,
      tabIndex: -1,
      "data-phase": Ce?.phase ?? "lobby",
      "data-actor": Ce?.actor ?? "",
      onPointerDown: () => pe.current?.unlock(),
      onKeyDown: (H) => {
        if (H.metaKey || H.ctrlKey || H.altKey || H.nativeEvent.isComposing) return;
        if (H.key === "Escape") {
          H.preventDefault(), H.stopPropagation(), Y ? ve(!1) : F ? I(null) : te ? J(!1) : se ? _e(!1) : Z ? (O.current = !1, he(!1)) : u || h(($e) => !$e);
          return;
        }
        if (H.key.toLowerCase() === "s" && !u && !f && !F && !Y && !v && !x && !(H.target instanceof HTMLElement && H.target.closest("input, select, textarea, [contenteditable]"))) {
          H.preventDefault(), H.repeat || ce.current?.smokeCigar();
          return;
        }
        if (lw(H.target)) return;
        if (H.code === "Space" && !aw(H.target) && !u && !f && !F && !Y && !v && !x) {
          H.preventDefault(), H.repeat || (O.current = !0, he(!0));
          return;
        }
        if (H.repeat) return;
        const me = H.key.toLowerCase();
        me === "m" && (H.preventDefault(), Ze()), $ || (me === "f" && (H.preventDefault(), at({ type: "fold" })), me === "c" && (H.preventDefault(), at({ type: ke.check ? "check" : "call" })));
      },
      children: [
        /* @__PURE__ */ W.jsxs("header", { className: "header", children: [
          /* @__PURE__ */ W.jsxs("button", { className: "brand", onClick: () => {
            d(!0), h(!0);
          }, "aria-label": "Back to poker lobby", children: [
            /* @__PURE__ */ W.jsx("span", { className: "brand-mark", children: "♠" }),
            /* @__PURE__ */ W.jsxs("span", { children: [
              "AGENT CODE ",
              /* @__PURE__ */ W.jsx("b", { children: "POKER" })
            ] })
          ] }),
          /* @__PURE__ */ W.jsxs("span", { className: "header-location", children: [
            /* @__PURE__ */ W.jsx("i", {}),
            " THE RIVER CLUB ",
            /* @__PURE__ */ W.jsx("em", { children: " / " }),
            " NO-LIMIT HOLD’EM"
          ] }),
          /* @__PURE__ */ W.jsxs("div", { className: "header-tools", children: [
            /* @__PURE__ */ W.jsx("button", { onClick: Ze, disabled: o || m || y, "aria-label": L ? "Unmute sound" : "Mute sound", title: "Sound (M)", children: L ? "♪̸" : "♪" }),
            /* @__PURE__ */ W.jsx("button", { onClick: () => ct("rules"), "aria-label": "How to play", title: "How to play", children: "?" }),
            /* @__PURE__ */ W.jsx("button", { onClick: () => ct("settings"), "aria-label": "Settings", title: "Settings", children: "⚙" }),
            !u && /* @__PURE__ */ W.jsx("button", { onClick: () => h((H) => !H), "aria-label": f ? "Resume table" : "Pause table", title: "Pause (Esc)", children: f ? "▶" : "Ⅱ" })
          ] })
        ] }),
        /* @__PURE__ */ W.jsxs("section", { className: "room", "aria-label": "Poker room", children: [
          /* @__PURE__ */ W.jsx("div", { className: "scene", ref: Fe }),
          /* @__PURE__ */ W.jsx("div", { className: "room-vignette" }),
          !u && Ce && /* @__PURE__ */ W.jsxs(W.Fragment, { children: [
            /* @__PURE__ */ W.jsxs("div", { className: "table-info", children: [
              /* @__PURE__ */ W.jsx("span", { className: "live-dot" }),
              " TABLE 01 ",
              /* @__PURE__ */ W.jsx("span", { children: "·" }),
              " HAND ",
              String(Ce.handNumber).padStart(3, "0"),
              " ",
              /* @__PURE__ */ W.jsx("span", { children: "·" }),
              " BLINDS 10 / 20"
            ] }),
            /* @__PURE__ */ W.jsxs("div", { className: "room-top-right", children: [
              /* @__PURE__ */ W.jsxs("button", { onClick: () => {
                he((H) => !H), K.current?.focus({ preventScroll: !0 });
              }, disabled: f || !!F || !!v || x, "aria-pressed": Z, title: "Hold Space to inspect cards and chips", children: [
                Z ? "Look up" : "Cards & chips",
                " ",
                /* @__PURE__ */ W.jsx("kbd", { children: "Space" })
              ] }),
              /* @__PURE__ */ W.jsxs("button", { onClick: () => ce.current?.smokeCigar(), disabled: f || !!F || !!v || x || Z, title: "Smoke cigar (S)", children: [
                "Cigar ",
                /* @__PURE__ */ W.jsx("kbd", { children: "S" })
              ] }),
              /* @__PURE__ */ W.jsxs("button", { onClick: () => _e((H) => !H), "aria-expanded": se, "aria-label": "Inspect community cards", children: [
                Fd[Ce.street],
                " ▾"
              ] }),
              /* @__PURE__ */ W.jsx("button", { onClick: () => ct("history"), children: "Hand history ↗" })
            ] }),
            Ce.players.map((H, me) => {
              if (me === 0) return null;
              const $e = ce.current?.projectSeat(me) ?? { x: 50, y: 50 };
              return /* @__PURE__ */ W.jsxs(
                "div",
                {
                  className: `seat ${Ce.actor === me ? "active" : ""} ${H.folded ? "folded" : ""} ${H.stack === 0 && !H.committed ? "out" : ""}`,
                  style: { left: `${$e.x}%`, top: `${$e.y}%`, "--seat-color": _i[me].color },
                  children: [
                    /* @__PURE__ */ W.jsxs("div", { className: "seat-name", children: [
                      /* @__PURE__ */ W.jsx("span", { className: "seat-dot" }),
                      _i[me].name,
                      Ce.dealer === me && /* @__PURE__ */ W.jsx("b", { className: "dealer-badge", title: "Dealer button", children: "D" }),
                      Ce.smallBlindSeat === me && /* @__PURE__ */ W.jsx("small", { children: "SB" }),
                      Ce.bigBlindSeat === me && /* @__PURE__ */ W.jsx("small", { children: "BB" })
                    ] }),
                    /* @__PURE__ */ W.jsx("strong", { children: Yi(H.stack) }),
                    /* @__PURE__ */ W.jsx("span", { className: "seat-action", children: Ce.actor === me ? me === 0 ? "YOUR TURN" : "THINKING" : H.action || _i[me].title }),
                    rt && me > 0 && !H.folded && /* @__PURE__ */ W.jsx("div", { className: "opponent-cards", children: H.hole.map((pt) => /* @__PURE__ */ W.jsx(Id, { card: pt, small: !0 }, pt)) })
                  ]
                },
                me
              );
            }),
            /* @__PURE__ */ W.jsxs("div", { className: "pot-label", children: [
              /* @__PURE__ */ W.jsx("span", { children: xe ? "POT AWARDED" : "IN THE POT" }),
              /* @__PURE__ */ W.jsxs("strong", { children: [
                "◈ ",
                Yi(xe ? Oe : Pe)
              ] }),
              Ce.awards.length > 1 && /* @__PURE__ */ W.jsxs("small", { children: [
                Ce.awards.length - 1,
                " side pot",
                Ce.awards.length > 2 ? "s" : ""
              ] })
            ] }),
            /* @__PURE__ */ W.jsxs("div", { className: "room-caption", children: [
              /* @__PURE__ */ W.jsx("span", { children: "THE RIVER CLUB" }),
              /* @__PURE__ */ W.jsx("i", { children: "Make yourself comfortable." })
            ] })
          ] }),
          u && /* @__PURE__ */ W.jsxs("div", { className: "lobby", children: [
            /* @__PURE__ */ W.jsxs("div", { className: "lobby-copy", children: [
              /* @__PURE__ */ W.jsxs("div", { className: "eyebrow", children: [
                /* @__PURE__ */ W.jsx("span", {}),
                " A PRIVATE TABLE. A LONG NIGHT."
              ] }),
              /* @__PURE__ */ W.jsx("h1", { children: "The River Club." }),
              /* @__PURE__ */ W.jsx("p", { children: "Pull up a chair. Leave the world outside." }),
              /* @__PURE__ */ W.jsxs("button", { className: "primary enter-button", onClick: B, disabled: o || m || x || y, children: [
                o ? "Preparing your seat…" : Ce ? "Return to your table" : "Take a seat",
                " ",
                /* @__PURE__ */ W.jsx("span", { children: "↗" })
              ] }),
              /* @__PURE__ */ W.jsxs("div", { className: "lobby-details", children: [
                /* @__PURE__ */ W.jsx("span", { children: "NO-LIMIT TEXAS HOLD’EM" }),
                /* @__PURE__ */ W.jsx("span", { children: "2,000 CHIPS TO START" }),
                /* @__PURE__ */ W.jsx("span", { children: "YOURS TO PLAY. NOTHING TO PAY." })
              ] })
            ] }),
            /* @__PURE__ */ W.jsxs("div", { className: "lobby-bottom", children: [
              /* @__PURE__ */ W.jsx("span", { children: "EST. BETWEEN COMMITS" }),
              /* @__PURE__ */ W.jsx("span", { children: "Procedural world · Local opponents · Saved on this device" })
            ] })
          ] }),
          !u && f && !F && !v && !Y && /* @__PURE__ */ W.jsx("div", { className: "scrim", children: /* @__PURE__ */ W.jsxs("div", { className: "pause-card", children: [
            /* @__PURE__ */ W.jsx("span", { className: "eyebrow", children: "NO RUSH" }),
            /* @__PURE__ */ W.jsx("h2", { children: "Your seat is saved." }),
            /* @__PURE__ */ W.jsx("p", { children: "The whole table waits for you." }),
            /* @__PURE__ */ W.jsxs("button", { className: "primary", onClick: () => {
              pe.current?.unlock(), h(!1), K.current?.focus();
            }, children: [
              "Back to the table ",
              /* @__PURE__ */ W.jsx("span", { children: "→" })
            ] }),
            /* @__PURE__ */ W.jsx("button", { className: "text-button", onClick: () => d(!0), children: "Visit the lobby" })
          ] }) }),
          x && /* @__PURE__ */ W.jsx("div", { className: "scrim", children: /* @__PURE__ */ W.jsxs("div", { className: "pause-card", role: "alert", children: [
            /* @__PURE__ */ W.jsx("h2", { children: "The room couldn’t open." }),
            /* @__PURE__ */ W.jsx("p", { children: "WebGL is unavailable. Reopen Poker to try again. Your saved table is kept." })
          ] }) })
        ] }),
        !u && Ce ? /* @__PURE__ */ W.jsxs(W.Fragment, { children: [
          se && /* @__PURE__ */ W.jsx("section", { className: "board-inspector", "aria-label": "Community cards", children: /* @__PURE__ */ W.jsx("div", { className: "board-cards", children: Array.from({ length: 5 }, (H, me) => Ce.board[me] !== void 0 ? /* @__PURE__ */ W.jsx(Id, { card: Ce.board[me], small: !0, highlight: we.includes(Ce.board[me]) }, me) : /* @__PURE__ */ W.jsx("span", { className: "empty-card", children: me < 3 ? "F" : me === 3 ? "T" : "R" }, me)) }) }),
          /* @__PURE__ */ W.jsxs("div", { className: "bankroll-tag", children: [
            /* @__PURE__ */ W.jsxs("span", { children: [
              "YOUR STACK",
              Ce.dealer === 0 ? " · DEALER" : "",
              Ce.smallBlindSeat === 0 ? " · SB" : "",
              Ce.bigBlindSeat === 0 ? " · BB" : ""
            ] }),
            /* @__PURE__ */ W.jsx("strong", { children: Yi(P?.stack ?? 0) }),
            /* @__PURE__ */ W.jsx("small", { children: P?.folded ? "Folded" : vt?.name ?? "Practice chips" })
          ] }),
          /* @__PURE__ */ W.jsx("div", { className: "sr-only", "aria-label": "Your hand", children: P?.hole.map((H) => /* @__PURE__ */ W.jsx(Id, { card: H }, H)) }),
          /* @__PURE__ */ W.jsxs("div", { className: `table-whisper ${b || xe ? "with-actions" : ""}`, role: "status", "aria-live": "polite", children: [
            /* @__PURE__ */ W.jsx("strong", { children: it }),
            /* @__PURE__ */ W.jsx("small", { children: m ? "Saving…" : f ? "Paused" : xe ? `Net ${P.stack - P.startStack >= 0 ? "+" : ""}${Yi(P.stack - P.startStack)}` : Ce.log.at(-1) })
          ] }),
          (b || xe) && !f && !F && !v && /* @__PURE__ */ W.jsx("section", { className: "quick-actions", "aria-label": "Poker actions", children: xe ? /* @__PURE__ */ W.jsxs("button", { className: "primary", disabled: m || x, onClick: de || Xe ? () => ve(!0) : ht, children: [
            de || Xe ? "New table" : "Deal next hand",
            " ",
            /* @__PURE__ */ W.jsx("span", { children: "→" })
          ] }) : /* @__PURE__ */ W.jsxs(W.Fragment, { children: [
            te && /* @__PURE__ */ W.jsxs("div", { className: "raise-popover", role: "group", "aria-label": "Set your raise", children: [
              /* @__PURE__ */ W.jsxs("div", { className: "raise-controls", children: [
                /* @__PURE__ */ W.jsxs("label", { htmlFor: "raise-size", children: [
                  Ce.currentBet === 0 ? "BET" : "RAISE",
                  " TO"
                ] }),
                /* @__PURE__ */ W.jsx("input", { id: "raise-size", type: "number", inputMode: "numeric", min: ke.min, max: ke.max, step: 1, value: T, onChange: (H) => C(Number(H.target.value)), disabled: $ || !ke.raise }),
                /* @__PURE__ */ W.jsx("div", { className: "bet-presets", children: [["Min", ke.min], ["½ pot", Ce.currentBet + Math.round((Pe + ke.call) / 2)], ["Pot", Ce.currentBet + Pe + ke.call], ["All-in", ke.max]].map(([H, me]) => /* @__PURE__ */ W.jsx("button", { disabled: $ || !ke.raise, onClick: () => C(Math.max(ke.min, Math.min(ke.max, Number(me)))), children: H }, H)) })
              ] }),
              /* @__PURE__ */ W.jsx("input", { className: "raise-slider", "aria-label": "Raise amount", type: "range", min: ke.min, max: Math.max(ke.min, ke.max), value: Ue, step: 1, onChange: (H) => C(Number(H.target.value)), disabled: $ || !ke.raise }),
              /* @__PURE__ */ W.jsxs("button", { className: "primary confirm-raise", disabled: $ || !ke.raise, onClick: () => at({ type: "raise", to: Ue }), children: [
                Ce.currentBet === 0 ? "Bet" : "Raise to",
                " ",
                Yi(Ue)
              ] })
            ] }),
            /* @__PURE__ */ W.jsxs("button", { className: "fold-button", onClick: () => at({ type: "fold" }), disabled: $, children: [
              "Fold ",
              /* @__PURE__ */ W.jsx("kbd", { children: "F" })
            ] }),
            /* @__PURE__ */ W.jsxs("button", { className: "call-button", onClick: () => at({ type: ke.check ? "check" : "call" }), disabled: $, children: [
              ke.check ? "Check" : `Call ${Yi(ke.call)}`,
              " ",
              /* @__PURE__ */ W.jsx("kbd", { children: "C" })
            ] }),
            /* @__PURE__ */ W.jsxs("button", { className: "primary", disabled: $ || !ke.raise, "aria-expanded": te, onClick: () => J((H) => !H), children: [
              Ce.currentBet === 0 ? "Bet" : "Raise",
              " ▴"
            ] })
          ] }) })
        ] }) : /* @__PURE__ */ W.jsxs("footer", { className: "lobby-footer", children: [
          /* @__PURE__ */ W.jsx("span", { className: "lobby-footer-mark", children: "♣ ♦ ♥ ♠" }),
          /* @__PURE__ */ W.jsx("span", { children: "A poker room for the moments between." }),
          /* @__PURE__ */ W.jsx("button", { onClick: () => ct("rules"), children: "New to the table? Learn the rules ↗" })
        ] }),
        F && /* @__PURE__ */ W.jsx("div", { className: "panel-scrim", onClick: () => I(null), children: /* @__PURE__ */ W.jsxs("aside", { className: "side-panel", role: "dialog", "aria-modal": "true", "aria-label": F === "history" ? "Hand history" : F === "rules" ? "How to play" : "Settings", onClick: (H) => H.stopPropagation(), children: [
          /* @__PURE__ */ W.jsxs("header", { children: [
            /* @__PURE__ */ W.jsx("span", { className: "eyebrow", children: "THE RIVER CLUB" }),
            /* @__PURE__ */ W.jsx("button", { "aria-label": "Close panel", onClick: () => I(null), children: "×" })
          ] }),
          /* @__PURE__ */ W.jsx("h2", { children: F === "history" ? "The hands we played." : F === "rules" ? "Find your seat." : "Make it yours." }),
          F === "history" ? /* @__PURE__ */ W.jsxs("div", { className: "history-list", children: [
            Ce && /* @__PURE__ */ W.jsxs("details", { open: !0, children: [
              /* @__PURE__ */ W.jsxs("summary", { children: [
                "Hand ",
                Ce.handNumber,
                " · ",
                xe ? "Complete" : Fd[Ce.street]
              ] }),
              Ce.log.map((H, me) => /* @__PURE__ */ W.jsx("p", { children: H }, me)),
              Ce.awards.map((H, me) => /* @__PURE__ */ W.jsxs("p", { className: "pot-history", children: [
                H.label,
                ": ",
                Yi(H.amount),
                " → ",
                H.winners.map(($e, pt) => `${_i[$e].name} ${Yi(H.shares[pt])}`).join(", ")
              ] }, `pot${me}`))
            ] }),
            Ce?.history.filter((H) => H.number !== Ce.handNumber).map((H) => /* @__PURE__ */ W.jsxs("details", { children: [
              /* @__PURE__ */ W.jsxs("summary", { children: [
                "Hand ",
                H.number,
                " ",
                /* @__PURE__ */ W.jsxs("b", { children: [
                  H.net >= 0 ? "+" : "",
                  Yi(H.net)
                ] })
              ] }),
              /* @__PURE__ */ W.jsx("strong", { children: H.summary }),
              H.log.map((me, $e) => /* @__PURE__ */ W.jsx("p", { children: me }, $e))
            ] }, H.number)),
            !Ce && /* @__PURE__ */ W.jsx("p", { children: "Your first story starts at the table." })
          ] }) : F === "settings" ? /* @__PURE__ */ W.jsxs("div", { className: "settings-content", children: [
            /* @__PURE__ */ W.jsxs("label", { children: [
              "Table pace",
              /* @__PURE__ */ W.jsxs("select", { value: D, disabled: m || o || y, onChange: (H) => {
                const me = H.target.value;
                ee(me), Le.current.speed = me, Je(r.current?.snapshot() ?? null);
              }, children: [
                /* @__PURE__ */ W.jsx("option", { value: "relaxed", children: "Relaxed" }),
                /* @__PURE__ */ W.jsx("option", { value: "brisk", children: "Brisk" })
              ] })
            ] }),
            /* @__PURE__ */ W.jsx("p", { children: "How long opponents take between decisions." }),
            /* @__PURE__ */ W.jsxs("label", { children: [
              "Sound",
              /* @__PURE__ */ W.jsx("button", { onClick: Ze, disabled: m || o || y, "aria-pressed": !L, children: L ? "Off" : "On" })
            ] }),
            /* @__PURE__ */ W.jsxs("label", { children: [
              "Camera angle",
              /* @__PURE__ */ W.jsx("input", { type: "range", min: -1, max: 1, step: 0.1, value: ue, onChange: (H) => ae(Number(H.target.value)) })
            ] }),
            /* @__PURE__ */ W.jsx("p", { children: "Motion follows your device’s reduced-motion preference." }),
            /* @__PURE__ */ W.jsx("div", { className: "settings-divider" }),
            /* @__PURE__ */ W.jsx("h3", { children: "A fresh table" }),
            /* @__PURE__ */ W.jsx("p", { children: "Start everyone with 2,000 practice chips. This replaces your current table and hand history." }),
            /* @__PURE__ */ W.jsx("button", { className: "secondary", onClick: () => ve(!0), disabled: m || o, children: "Start a new table" })
          ] }) : /* @__PURE__ */ W.jsxs("div", { className: "rules-content", children: [
            /* @__PURE__ */ W.jsx("p", { children: "Build the best five-card hand using your two cards and the five shared cards. You can use both, one, or neither of your cards." }),
            /* @__PURE__ */ W.jsx("h3", { children: "A hand in four acts" }),
            /* @__PURE__ */ W.jsxs("p", { children: [
              /* @__PURE__ */ W.jsx("b", { children: "Pre-flop:" }),
              " two private cards. ",
              /* @__PURE__ */ W.jsx("b", { children: "Flop:" }),
              " three shared cards. ",
              /* @__PURE__ */ W.jsx("b", { children: "Turn:" }),
              " one more. ",
              /* @__PURE__ */ W.jsx("b", { children: "River:" }),
              " the last card. Betting follows each street."
            ] }),
            /* @__PURE__ */ W.jsx("h3", { children: "Your move" }),
            /* @__PURE__ */ W.jsxs("p", { children: [
              /* @__PURE__ */ W.jsx("b", { children: "Check" }),
              " when nothing is owed. ",
              /* @__PURE__ */ W.jsx("b", { children: "Call" }),
              " to match. ",
              /* @__PURE__ */ W.jsx("b", { children: "Raise" }),
              " to increase the total bet for this street. ",
              /* @__PURE__ */ W.jsx("b", { children: "Fold" }),
              " to leave the hand. “Raise to” includes chips you already put in this street."
            ] }),
            /* @__PURE__ */ W.jsx("h3", { children: "All-in means all-in" }),
            /* @__PURE__ */ W.jsx("p", { children: "You can only win the chips you match. Additional bets form side pots. A short all-in may require a call without reopening a raise. Ties split each pot; odd chips go clockwise from the dealer." }),
            /* @__PURE__ */ W.jsx("h3", { children: "From strongest to weakest" }),
            /* @__PURE__ */ W.jsx("ol", { children: ["Straight flush", "Four of a kind", "Full house", "Flush", "Straight", "Three of a kind", "Two pair", "One pair", "High card"].map((H) => /* @__PURE__ */ W.jsx("li", { children: H }, H)) }),
            /* @__PURE__ */ W.jsx("p", { children: "Blinds stay at 10/20. Eliminated seats sit out; a moving button rotates through funded seats. Beat the table, or start fresh any time. Bots use their own cards and public information." }),
            /* @__PURE__ */ W.jsx("h3", { children: "Keyboard" }),
            /* @__PURE__ */ W.jsxs("p", { children: [
              /* @__PURE__ */ W.jsx("kbd", { children: "F" }),
              " fold · ",
              /* @__PURE__ */ W.jsx("kbd", { children: "C" }),
              " check/call · ",
              /* @__PURE__ */ W.jsx("kbd", { children: "M" }),
              " sound · ",
              /* @__PURE__ */ W.jsx("kbd", { children: "Esc" }),
              " pause. Buttons and text fields keep their normal keyboard behavior."
            ] }),
            /* @__PURE__ */ W.jsx("p", { children: "Everything is local. All chips are free practice currency." })
          ] })
        ] }) }),
        v && /* @__PURE__ */ W.jsxs("div", { className: "save-alert", role: "alert", children: [
          /* @__PURE__ */ W.jsx("strong", { children: y ? "Saved table needs attention" : "Table paused" }),
          /* @__PURE__ */ W.jsx("p", { children: v }),
          !y && /* @__PURE__ */ W.jsx("button", { className: "primary", disabled: m, onClick: () => {
            Je(r.current?.snapshot() ?? null);
          }, children: "Retry save" }),
          /* @__PURE__ */ W.jsx("button", { className: "text-button", disabled: m, onClick: () => ve(!0), children: "Start a new table instead" })
        ] }),
        Y && /* @__PURE__ */ W.jsx("div", { className: "panel-scrim", children: /* @__PURE__ */ W.jsxs("div", { className: "confirm-card", role: "alertdialog", "aria-modal": "true", "aria-labelledby": "fresh-title", children: [
          /* @__PURE__ */ W.jsx("span", { className: "eyebrow", children: "FRESH FELT" }),
          /* @__PURE__ */ W.jsx("h2", { id: "fresh-title", children: "Start a new table?" }),
          /* @__PURE__ */ W.jsx("p", { children: "Your current hand, chip stacks, and history will be replaced. Everyone starts with 2,000 practice chips." }),
          /* @__PURE__ */ W.jsxs("div", { children: [
            /* @__PURE__ */ W.jsx("button", { className: "secondary", onClick: () => ve(!1), children: "Keep this table" }),
            /* @__PURE__ */ W.jsx("button", { className: "primary", disabled: m || x, onClick: qt, children: "Start fresh" })
          ] })
        ] }) })
      ]
    }
  );
}
const uw = ":root{color-scheme:dark;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif}*{box-sizing:border-box}body{margin:0}button,input,select{font:inherit}button{cursor:pointer}button:disabled{cursor:default;opacity:.38}button,input,select{outline-offset:4px}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #d9eab4}button{transition:background .16s,border-color .16s,transform .16s}button:not(:disabled):active{transform:translateY(1px)}.poker{width:1100px;height:800px;position:relative;overflow:hidden;background:#14251e;color:#f3ebd7;border-radius:10px;outline:none;--cream: #f3ebd7;--dim: #a5b2a4;--gold: #d6bd80;--green: #c1db9c;font-size:13px}.header{height:60px;display:flex;align-items:center;gap:24px;padding:0 25px;background:#16261f;border-bottom:1px solid #ffffff13;position:relative;z-index:3}.brand{display:flex;align-items:center;gap:11px;color:var(--cream);background:none;border:0;padding:0;letter-spacing:2px;font-size:10px;text-align:left}.brand b{display:block;font-size:17px;letter-spacing:5px;margin-top:1px}.brand-mark{display:grid;place-items:center;width:34px;height:36px;color:#dfc78d;border:1px solid #958456;font-size:28px;background:#26382a;clip-path:polygon(20% 0,80% 0,100% 20%,100% 80%,80% 100%,20% 100%,0 80%,0 20%)}.header-location{margin:auto;font-size:9px;letter-spacing:1.8px;color:#aeb6a3}.header-location i,.live-dot,.eyebrow>span{width:5px;height:5px;display:inline-block;background:#c8da9c;margin-right:9px;box-shadow:0 0 10px #bfdc8277}.header-location em{color:#61745e;margin:0 12px}.header-tools{display:flex;gap:5px}.header-tools button{width:31px;height:31px;background:transparent;border:1px solid #52634855;color:#c4cbb8;font-size:18px;border-radius:4px}.header-tools button:hover{background:#354733}.room{height:500px;position:relative;isolation:isolate;overflow:hidden}.scene,.room-vignette{position:absolute;inset:0}.scene canvas{display:block;width:100%;height:100%}.room-vignette{pointer-events:none;background:linear-gradient(#0a1a1830,transparent 22%,transparent 77%,#11251f6b);box-shadow:inset 0 0 90px #071d172b}.table-info{position:absolute;left:25px;top:20px;color:#d8dfc9;letter-spacing:1.6px;font-size:9px;text-shadow:0 1px 4px #13241d}.table-info>span:not(.live-dot){color:#8d9e86;margin:0 6px}.room-top-right{position:absolute;right:25px;top:15px;display:flex;gap:18px;align-items:center}.room-top-right>span{color:#dfd4b2;font-family:Georgia,serif;font-size:17px}.room-top-right button{border:1px solid #e0d4a530;background:#152920bb;color:#d7d7bf;padding:8px 12px;border-radius:3px;font-size:10px}.seat{position:absolute;transform:translate(-50%,-50%);min-width:112px;padding:8px 12px 7px;border:1px solid #e1d9ae2d;border-top:2px solid var(--seat-color);background:#14271fe8;border-radius:4px;text-align:center;pointer-events:none;box-shadow:0 5px 12px #07150e38;transition:opacity .2s,border-color .2s,background .2s}.seat.active{background:#354933f5;border-color:#c9db91;box-shadow:0 0 0 3px #cee8a21b,0 6px 20px #061b1155}.seat.folded{opacity:.6}.seat.out{opacity:.36}.seat-name{display:flex;gap:5px;align-items:center;justify-content:center;font-size:11px;font-weight:600}.seat-dot{width:5px;height:5px;border-radius:50%;background:var(--seat-color)}.seat strong{display:block;font-size:14px;font-weight:500;margin-top:3px;font-variant-numeric:tabular-nums;color:#f0e0b7}.seat-action{display:block;margin-top:4px;font-size:8px;letter-spacing:1px;color:#b8c1a9}.seat.active .seat-action{color:#e0efb9}.seat small{font-size:8px;font-weight:400;color:#a4b29c}.dealer-badge{width:13px;height:13px;display:inline-grid;place-items:center;background:#e4d2a0;color:#314a34;border-radius:50%;font-size:8px}.opponent-cards{position:absolute;display:flex;gap:4px;top:calc(100% + 7px);left:50%;transform:translate(-50%)}.opponent-cards .playing-card.small{width:28px;height:38px}.opponent-cards .playing-card b{font-size:13px}.opponent-cards .playing-card span{font-size:10px}.opponent-cards .playing-card i{display:none}.pot-label{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);pointer-events:none;text-align:center;color:#f2e6c5;text-shadow:0 2px 7px #16332f}.pot-label>span{display:block;font-size:8px;letter-spacing:2.6px;color:#c6d4b8}.pot-label strong{display:block;margin-top:4px;font-size:24px;font-family:Georgia,serif;font-weight:400}.pot-label small{display:block;font-size:9px;margin-top:3px;color:#ced8b9}.room-caption{position:absolute;bottom:17px;left:25px;color:#d3d3b2;display:flex;flex-direction:column;gap:4px}.room-caption span{font-size:8px;letter-spacing:2.2px}.room-caption i{font-family:Georgia,serif;font-size:12px;color:#b1bda2}.lobby{position:absolute;inset:0;background:linear-gradient(90deg,#10231eec,#14271fd6 31%,#18302948 60%,#13281e00)}.lobby-copy{padding:66px 0 0 50px}.eyebrow{font-size:9px;font-weight:500;letter-spacing:2px;color:#d1c79f}h1{font-family:Georgia,Times New Roman,serif;font-size:60px;font-weight:400;line-height:1.02;letter-spacing:-2.5px;margin:26px 0 18px}.lobby-copy p{font-size:14px;line-height:1.8;color:#bcc5b3;margin:0 0 23px}.primary{border:1px solid #d5e7b1;background:#c5dca4;color:#213724;padding:12px 20px;font-size:12px;font-weight:650;border-radius:3px}.primary:hover:not(:disabled){background:#def0c1;border-color:#e5f6c9;box-shadow:0 2px 14px #d4ed9318}.primary>span{margin-left:20px}.enter-button{width:224px;display:flex;align-items:center;justify-content:space-between;font-size:14px;padding:16px 20px}.enter-button span{font-size:22px}.lobby-details{display:flex;gap:16px;margin-top:23px;font-size:7px;letter-spacing:1.1px;color:#aab69b}.lobby-bottom{position:absolute;left:50px;right:30px;bottom:20px;display:flex;justify-content:space-between;color:#acb699;font-size:8px;letter-spacing:1px}.poker:has(.lobby) .room{height:646px}.poker:has(.lobby) .lobby-copy{padding-top:115px}.poker:has(.lobby) h1{font-size:69px}.lobby-footer{display:flex;align-items:center;gap:24px;height:94px;padding:0 34px;background:#17291f;color:#afbda5;font-family:Georgia,serif;font-size:16px}.lobby-footer-mark{font-family:Georgia,serif;font-size:22px;color:#ccb781;letter-spacing:5px}.lobby-footer button{margin-left:auto;border:none;background:none;color:#bfcdab;font-size:11px;font-family:-apple-system,sans-serif}.table-strip{height:90px;padding:13px 27px;display:flex;align-items:center;gap:20px;background:#203429;border-top:1px solid #aec0852b;border-bottom:1px solid #0b1b1460}.street-label{width:76px;flex-shrink:0}.street-label span,.your-hand>div>span{display:block;font-size:8px;letter-spacing:1.8px;color:#a9b596}.street-label strong{display:block;margin-top:6px;font-family:Georgia,serif;font-size:18px;font-weight:400}.board-cards{display:flex;gap:6px}.playing-card{position:relative;display:inline-block;flex-shrink:0;width:53px;height:74px;background:#f3eddb;color:#223b31;border:1px solid #ddcfab;border-radius:4px;box-shadow:0 2px 3px #0003;padding:5px 7px;text-align:left;font-family:Georgia,serif}.playing-card b{font-size:24px;line-height:1;font-weight:700;display:block}.playing-card>span{font-size:20px;line-height:1;display:block}.playing-card i{position:absolute;bottom:4px;right:5px;font-size:26px;font-style:normal}.playing-card.red{color:#b63f38}.playing-card.winning{box-shadow:0 0 0 2px #d5e896,0 0 15px #d5e89644}.playing-card.small{width:38px;height:54px;padding:4px 5px}.playing-card.small b{font-size:18px}.playing-card.small>span{font-size:15px}.playing-card.small i{font-size:19px;bottom:3px;right:3px}.empty-card{width:38px;height:54px;border:1px dashed #8ea57844;border-radius:4px;display:grid;place-items:center;font-family:Georgia,serif;color:#899e7755;font-size:13px}.playing-card.back{background:repeating-conic-gradient(#ad7755 0% 25%,#bd875f 0% 50%) 50% / 8px 8px;border:3px solid #dbbd88;color:#f1d3a0}.table-status{margin-left:auto;text-align:right;max-width:600px;padding-left:15px}.table-status strong{display:inline;font-family:Georgia,serif;font-size:17px;font-weight:400;color:#eee6cb}.table-status small{display:block;margin-top:6px;font-size:10px;color:#a8b69b}.turn-indicator{display:inline-block;width:6px;height:6px;background:#d8e8a8;border-radius:50%;margin-right:8px;box-shadow:0 0 10px #d8e8a899}.action-deck{height:150px;display:flex;padding:18px 27px 20px;align-items:center;gap:32px;background:linear-gradient(115deg,#14271e,#1a2f23)}.your-hand{width:346px;display:flex;align-items:center;gap:17px;flex-shrink:0}.hole-cards{display:flex;gap:7px}.hole-cards .playing-card:first-child{transform:rotate(-5deg) translateY(1px)}.hole-cards .playing-card:last-child{transform:rotate(5deg) translateY(1px)}.your-hand strong{display:block;font-family:Georgia,serif;font-size:17px;font-weight:400;margin:7px 0}.your-hand small{color:#a8b598;font-size:10px}.betting-controls{flex:1}.raise-controls{display:flex;align-items:center;gap:9px}.raise-controls label{font-size:8px;letter-spacing:1.4px;color:#b4c3a5}.raise-controls input{width:78px;background:#0e2119;border:1px solid #81986944;border-radius:3px;color:#f0e5c9;padding:5px 6px;font-size:12px}.bet-presets{display:flex;margin-left:auto;gap:5px}.bet-presets button{color:#b9c6a8;background:#283e2c;border:1px solid #879c6240;border-radius:3px;padding:6px 13px;font-size:10px}.bet-presets button:hover:not(:disabled){background:#405536}.raise-slider{display:block;width:100%;height:12px;margin:5px 0 7px;accent-color:#bdd996}.action-buttons{display:flex;gap:8px}.action-buttons>button{flex:1;height:42px;border-radius:3px;font-size:12px}.fold-button{background:#283c2e;border:1px solid #76846177;color:#c4cbb3}.call-button{background:#435e3d;border:1px solid #8ca970;color:#edf0d9}.raise-button{flex:1.45!important}.raise-button b{margin-left:8px}kbd{font-family:inherit;display:inline-block;font-size:8px;border:1px solid #b5c29344;padding:1px 4px;border-radius:2px;margin-left:5px;color:#a8bb8f}.hand-finished{margin-left:auto;text-align:right}.hand-finished>span{display:block;margin-bottom:14px;color:#bdc8ab;font-family:Georgia,serif;font-size:17px}.hand-finished button{min-width:215px}.scrim{position:absolute;inset:0;z-index:10;display:grid;place-items:center;background:#0b1e19a8;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}.pause-card,.confirm-card{width:390px;padding:35px;text-align:center;border:1px solid #8b9b6a55;background:#20352a;box-shadow:0 24px 80px #05110d66;border-radius:5px}h2{font-family:Georgia,serif;font-size:33px;font-weight:400;letter-spacing:-1px;margin:14px 0}.pause-card p,.confirm-card p{color:#b9c6ad;line-height:1.7;margin-bottom:22px}.text-button{display:block;border:0;background:none;color:#b8c5aa;font-size:11px;padding:12px;margin:5px auto 0;text-decoration:underline;text-underline-offset:4px}.panel-scrim{position:absolute;inset:0;z-index:20;display:flex;justify-content:flex-end;background:#071b1788;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}.side-panel{width:410px;height:100%;background:#1d3228;border-left:1px solid #a4b97b55;padding:30px;overflow:auto;box-shadow:-25px 0 80px #081c1655}.side-panel header{display:flex;justify-content:space-between;align-items:center}.side-panel header button{color:#c4cdb5;background:none;border:none;font-size:25px}.side-panel h2{font-size:31px;margin:26px 0}.side-panel h3{font-family:Georgia,serif;font-size:19px;font-weight:400;margin:24px 0 8px}.side-panel p{line-height:1.7;color:#bdc9b2;font-size:12px}.rules-content ol{columns:2;padding-left:18px;color:#c9d5ba;font-size:12px;line-height:2}.rules-content b{color:#e6e5ce;font-weight:600}.settings-content label{display:flex;align-items:center;justify-content:space-between;margin-top:28px;color:#dfdec6;font-size:13px}.settings-content select,.settings-content label button{background:#344b33;border:1px solid #7d986355;color:#e2e6cb;border-radius:3px;padding:8px 12px}.settings-content input{accent-color:#c0d99b;width:150px}.settings-divider{border-top:1px solid #80976444;margin:30px 0}.secondary{background:#2f4834;border:1px solid #8a9d6c77;color:#dce2c7;border-radius:3px;padding:12px 18px;font-size:12px}.history-list details{border-bottom:1px solid #7e946144;padding:14px 0}.history-list summary{cursor:pointer;font-size:13px;color:#e1dfc3}.history-list summary b{float:right;color:#c6de9f;font-variant-numeric:tabular-nums}.history-list p{font-size:11px;margin:8px 0}.history-list strong{display:block;color:#d5dfa9;font-size:12px;margin-top:14px}.history-list .pot-history{color:#d1dfa1;border-left:2px solid #b7c88f;padding-left:9px}.save-alert{position:absolute;z-index:25;left:50%;top:45%;transform:translate(-50%,-50%);width:430px;background:#2f3928;padding:28px;border:1px solid #d3ba72;box-shadow:0 0 0 800px #0b1c18b0;border-radius:5px}.save-alert strong{font-family:Georgia,serif;font-size:25px;font-weight:400}.save-alert p{line-height:1.7;color:#d3d3b6}.panel-scrim:has(.confirm-card){z-index:30;align-items:center;justify-content:center}.confirm-card{width:450px}.confirm-card>div{display:flex;justify-content:center;gap:10px}@media(prefers-reduced-motion:reduce){*,*:before,*:after{transition:none!important;animation:none!important}}.poker{background:#0c0d0e;--cream: #e7dcc8;--dim: #99978f;--gold: #bca175;--green: #bca175;border-radius:7px}.header{position:absolute;inset:0 0 auto;height:54px;background:linear-gradient(#0c0d0ef0,#0c0d0e90);border-bottom:1px solid #c5a87818}.brand-mark{background:#26211a;border-color:#7b694c}.header-location{color:#a29b8b}.header-location i,.live-dot,.eyebrow>span{background:#c3a875;box-shadow:0 0 10px #c3a87544}.header-tools button{border-color:#a2917030;color:#b7aa94}.header-tools button:hover{background:#50453344}.room,.poker:has(.lobby) .room{position:absolute;inset:0;height:800px}.room-vignette{background:linear-gradient(#06070a24,transparent 22%,transparent 65%,#070809aa);box-shadow:inset 0 0 110px #0007}.table-info{top:76px;color:#bbb2a0}.room-top-right{top:69px}.room-top-right>span{font-size:13px;color:#baa88b}.room-top-right button{background:#12131390;border-color:#c1a77e24}.seat{min-width:88px;padding:5px 9px;background:#121213ad;border:1px solid #a88c5d38;border-top:1px solid #bda27780;border-radius:2px;box-shadow:0 5px 20px #0003;-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}.seat.active{background:#342e23d9;border-color:#c7aa79;box-shadow:0 0 22px #c7aa7915}.seat strong{font-size:12px;color:#d9c7a6}.seat-name{font-size:10px}.seat-action{letter-spacing:.4px;color:#aba295}.seat-dot{display:none}.pot-label{top:58%}.pot-label strong{font-size:20px}.pot-label>span{color:#b6aa8d}.room-caption{display:none}.lobby{background:linear-gradient(0deg,#0a0b0df5,#0a0b0d80 24%,transparent 55%)}.lobby-copy,.poker:has(.lobby) .lobby-copy{position:absolute;left:0;right:0;bottom:75px;padding:0;text-align:center}.poker:has(.lobby) h1{font-size:43px;letter-spacing:-1px;margin:14px 0 12px}.lobby-copy p{font-size:12px;color:#b3a997;line-height:1.6;margin-bottom:17px}.eyebrow{color:#bca580;font-size:8px}.enter-button{margin:auto;width:205px;padding:12px 18px}.primary{background:#bda47c;border-color:#d4be98;color:#221e18}.primary:hover:not(:disabled){background:#d4bd97;border-color:#e4cc9f}.lobby-details{justify-content:center;color:#8f8777;margin-top:17px}.lobby-bottom{left:28px;right:28px;bottom:23px;color:#726d61}.lobby-footer{display:none}.table-strip{position:absolute;bottom:118px;left:0;right:0;height:77px;background:linear-gradient(90deg,#111315dd,#111315a8);border-color:#a18b6530;padding:10px 25px;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}.action-deck{position:absolute;bottom:0;left:0;right:0;height:118px;padding:12px 25px;background:#0f1113ec;gap:24px}.your-hand{width:330px}.your-hand strong{font-size:16px}.table-status strong{font-size:15px}.table-status small,.your-hand small,.street-label span,.your-hand>div>span{color:#9c9485}.raise-controls input{background:#181a1c;border-color:#a18b6544}.bet-presets button{background:#262624;border-color:#8d7a5540;color:#bcb09a}.bet-presets button:hover:not(:disabled){background:#413b30}.raise-slider{accent-color:#c1a67a}.fold-button{background:#242627;border-color:#77705e66;color:#b8b1a3}.call-button{background:#424033;border-color:#908362;color:#e6dcc9}.empty-card{border-color:#a3927044;color:#a3927044}.scrim{background:#07090bbb}.pause-card,.confirm-card,.side-panel{background:#191b1d;border-color:#9d825544}.panel-scrim{background:#07090b88}.pause-card p,.confirm-card p,.side-panel p{color:#b5ad9e}.quick-actions{position:absolute;bottom:22px;left:50%;transform:translate(-50%);display:flex;gap:7px;padding:6px;background:#111315b8;border:1px solid #b9a07835;border-radius:5px;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.quick-actions>button{min-width:112px;height:40px;border-radius:3px;font-size:12px}.raise-popover{position:absolute;left:50%;bottom:calc(100% + 10px);transform:translate(-50%);width:430px;padding:16px;border:1px solid #b9a07855;border-radius:5px;background:#171918f5;box-shadow:0 10px 40px #0006}.raise-popover .raise-controls{flex-wrap:wrap}.raise-popover .bet-presets{margin-left:auto}.raise-popover .bet-presets button{padding:5px 9px}.raise-popover .raise-slider{margin:13px 0}.confirm-raise{display:block;width:100%}.bankroll-tag{position:absolute;left:26px;bottom:23px;color:#d3c3a6;text-shadow:0 2px 8px #000;pointer-events:none}.bankroll-tag>span{display:block;font-size:8px;letter-spacing:1.5px;color:#a79b83}.bankroll-tag strong{display:block;font:24px/1.25 Georgia,serif;margin:4px 0}.bankroll-tag small{color:#9f998b;font-size:10px}.table-whisper{position:absolute;bottom:26px;left:50%;transform:translate(-50%);text-align:center;text-shadow:0 2px 10px #000;pointer-events:none;max-width:60%}.table-whisper.with-actions{bottom:85px}.table-whisper strong{font:15px Georgia,serif;color:#dbceb5}.table-whisper small{display:block;font-size:10px;color:#9c9689;margin-top:5px}.board-inspector{position:absolute;right:25px;top:112px;padding:12px;background:#111315ed;border:1px solid #b9a07844;border-radius:5px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.poker.inspecting .seat,.poker.inspecting .pot-label{visibility:hidden}.room-top-right button[aria-pressed=true]{border-color:#c9ad80;background:#423a2dcc}", fw = i_({
  mount(s, e) {
    const t = document.createElement("style");
    t.textContent = uw, document.head.append(t);
    const r = f_.createRoot(s);
    return r.render(/* @__PURE__ */ W.jsx(cw, { api: e.api })), () => {
      r.unmount(), t.remove();
    };
  }
});
export {
  fw as default
};
