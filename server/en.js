function r(t) {
    var e = K(R(K(t, this.k - 1), this.mu), this.k + 1)
        , n = I(U(t, this.k + 1), U(R(e, this.modulus), this.k + 1));
    n.isNeg && (n = C(n, this.bkplus1));
    for (var i = V(n, this.modulus) >= 0; i;)
        i = V(n = I(n, this.modulus), this.modulus) >= 0;
    return n
}
function o(t, e) {
    var n = R(t, e);
    return this.modulo(n)
}
function a(t, e) {
    var n = new v;
    n.digits[0] = 1;
    for (var i = t, r = e; 0 != (1 & r.digits[0]) && (n = this.multiplyMod(n, i)),
        0 != (r = L(r, 1)).digits[0] || 0 != F(r);)
        i = this.multiplyMod(i, i);
    return n
}
var s, c, u, l = 16, d = l, h = 65536, f = h >>> 1, p = h * h, g = h - 1;
function m(t) {
    s = new Array(t);
    for (var e = 0; e < s.length; e++)
        s[e] = 0;
    c = new v,
        (u = new v).digits[0] = 1
}
function v(t) {
    this.digits = "boolean" == typeof t && 1 == t ? null : s.slice(0),
        this.isNeg = !1
}
function _(t) {
    var e = new v(!0);
    return e.digits = t.digits.slice(0),
        e.isNeg = t.isNeg,
        e
}
function y(t) {
    for (var e = "", n = t.length - 1; n > -1; --n)
        e += t.charAt(n);
    return e
}
m(20),
    function (t) {
        var e = new v;
        e.isNeg = t < 0,
            t = Math.abs(t);
        for (var n = 0; t > 0;)
            e.digits[n++] = t & g,
                t >>= l
    }(1e15);
var b = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");
function w(t, e) {
    var n = new v;
    n.digits[0] = e;
    for (var i = z(t, n), r = b[i[1].digits[0]]; 1 == V(i[0], c);)
        i = z(i[0], n),
            digit = i[1].digits[0],
            r += b[i[1].digits[0]];
    return (t.isNeg ? "-" : "") + y(r)
}
var k = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
function x(t) {
    var e = "";
    for (i = 0; i < 4; ++i)
        e += k[15 & t],
            t >>>= 4;
    return y(e)
}
function A(t) {
    for (var e = "", n = (F(t),
        F(t)); n > -1; --n)
        e += x(t.digits[n]);
    return e
}
function T(t) {
    return t >= 48 && t <= 57 ? t - 48 : t >= 65 && t <= 90 ? 10 + t - 65 : t >= 97 && t <= 122 ? 10 + t - 97 : 0
}
function S(t) {
    for (var e = 0, n = Math.min(t.length, 4), i = 0; i < n; ++i)
        e <<= 4,
            e |= T(t.charCodeAt(i));
    return e
}
function P(t) {
    for (var e = new v, n = t.length, i = 0; n > 0; n -= 4,
        ++i)
        e.digits[i] = S(t.substr(Math.max(n - 4, 0), Math.min(n, 4)));
    return e
}
function E(t) {
    for (var e = "", n = F(t); n > -1; --n)
        e += D(t.digits[n]);
    return e
}
function D(t) {
    var e = String.fromCharCode(255 & t);
    return t >>>= 8,
        String.fromCharCode(255 & t) + e
}
function C(t, e) {
    var n;
    if (t.isNeg != e.isNeg)
        e.isNeg = !e.isNeg,
            n = I(t, e),
            e.isNeg = !e.isNeg;
    else {
        n = new v;
        for (var i, r = 0, o = 0; o < t.digits.length; ++o)
            i = t.digits[o] + e.digits[o] + r,
                n.digits[o] = 65535 & i,
                r = Number(i >= h);
        n.isNeg = t.isNeg
    }
    return n
}
function I(t, e) {
    var n;
    if (t.isNeg != e.isNeg)
        e.isNeg = !e.isNeg,
            n = C(t, e),
            e.isNeg = !e.isNeg;
    else {
        var i, r;
        n = new v,
            r = 0;
        for (var o = 0; o < t.digits.length; ++o)
            i = t.digits[o] - e.digits[o] + r,
                n.digits[o] = 65535 & i,
                n.digits[o] < 0 && (n.digits[o] += h),
                r = 0 - Number(i < 0);
        if (-1 == r) {
            for (r = 0,
                o = 0; o < t.digits.length; ++o)
                i = 0 - n.digits[o] + r,
                    n.digits[o] = 65535 & i,
                    n.digits[o] < 0 && (n.digits[o] += h),
                    r = 0 - Number(i < 0);
            n.isNeg = !t.isNeg
        } else
            n.isNeg = t.isNeg
    }
    return n
}
function F(t) {
    for (var e = t.digits.length - 1; e > 0 && 0 == t.digits[e];)
        --e;
    return e
}
function M(t) {
    var e, n = F(t), i = t.digits[n], r = (n + 1) * d;
    for (e = r; e > r - d && 0 == (32768 & i); --e)
        i <<= 1;
    return e
}
function R(t, e) {
    for (var n, i, r, o = new v, a = F(t), s = F(e), c = 0; c <= s; ++c) {
        n = 0,
            r = c;
        for (var u = 0; u <= a; ++u,
            ++r)
            i = o.digits[r] + t.digits[u] * e.digits[c] + n,
                o.digits[r] = i & g,
                n = i >>> l;
        o.digits[c + a + 1] = n
    }
    return o.isNeg = t.isNeg != e.isNeg,
        o
}
function j(t, e) {
    var n, i, r, o = new v;
    n = F(t),
        i = 0;
    for (var a = 0; a <= n; ++a)
        r = o.digits[a] + t.digits[a] * e + i,
            o.digits[a] = r & g,
            i = r >>> l;
    return o.digits[1 + n] = i,
        o
}
function B(t, e, n, i, r) {
    for (var o = Math.min(e + r, t.length), a = e, s = i; a < o; ++a,
        ++s)
        n[s] = t[a]
}
var q = new Array(0, 32768, 49152, 57344, 61440, 63488, 64512, 65024, 65280, 65408, 65472, 65504, 65520, 65528, 65532, 65534, 65535);
function O(t, e) {
    var n = Math.floor(e / d)
        , i = new v;
    B(t.digits, 0, i.digits, n, i.digits.length - n);
    for (var r = e % d, o = d - r, a = i.digits.length - 1, s = a - 1; a > 0; --a,
        --s)
        i.digits[a] = i.digits[a] << r & g | (i.digits[s] & q[r]) >>> o;
    return i.digits[0] = i.digits[a] << r & g,
        i.isNeg = t.isNeg,
        i
}
var N = new Array(0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535);
function L(t, e) {
    var n = Math.floor(e / d)
        , i = new v;
    B(t.digits, n, i.digits, 0, t.digits.length - n);
    for (var r = e % d, o = d - r, a = 0, s = a + 1; a < i.digits.length - 1; ++a,
        ++s)
        i.digits[a] = i.digits[a] >>> r | (i.digits[s] & N[r]) << o;
    return i.digits[i.digits.length - 1] >>>= r,
        i.isNeg = t.isNeg,
        i
}
function H(t, e) {
    var n = new v;
    return B(t.digits, 0, n.digits, e, n.digits.length - e),
        n
}
function K(t, e) {
    var n = new v;
    return B(t.digits, e, n.digits, 0, n.digits.length - e),
        n
}
function U(t, e) {
    var n = new v;
    return B(t.digits, 0, n.digits, 0, e),
        n
}
function V(t, e) {
    if (t.isNeg != e.isNeg)
        return 1 - 2 * Number(t.isNeg);
    for (var n = t.digits.length - 1; n >= 0; --n)
        if (t.digits[n] != e.digits[n])
            return t.isNeg ? 1 - 2 * Number(t.digits[n] > e.digits[n]) : 1 - 2 * Number(t.digits[n] < e.digits[n]);
    return 0
}
function z(t, e) {
    var n, i, r = M(t), o = M(e), a = e.isNeg;
    if (r < o)
        return t.isNeg ? ((n = _(u)).isNeg = !e.isNeg,
            t.isNeg = !1,
            e.isNeg = !1,
            i = I(e, t),
            t.isNeg = !0,
            e.isNeg = a) : (n = new v,
                i = _(t)),
            new Array(n, i);
    n = new v,
        i = t;
    for (var s = Math.ceil(o / d) - 1, c = 0; e.digits[s] < f;)
        e = O(e, 1),
            ++c,
            ++o,
            s = Math.ceil(o / d) - 1;
    i = O(i, c),
        r += c;
    for (var l = Math.ceil(r / d) - 1, m = H(e, l - s); -1 != V(i, m);)
        ++n.digits[l - s],
            i = I(i, m);
    for (var y = l; y > s; --y) {
        var b = y >= i.digits.length ? 0 : i.digits[y]
            , w = y - 1 >= i.digits.length ? 0 : i.digits[y - 1]
            , k = y - 2 >= i.digits.length ? 0 : i.digits[y - 2]
            , x = s >= e.digits.length ? 0 : e.digits[s]
            , A = s - 1 >= e.digits.length ? 0 : e.digits[s - 1];
        n.digits[y - s - 1] = b == x ? g : Math.floor((b * h + w) / x);
        for (var T = n.digits[y - s - 1] * (x * h + A), S = b * p + (w * h + k); T > S;)
            --n.digits[y - s - 1],
                T = n.digits[y - s - 1] * (x * h | A),
                S = b * h * h + (w * h + k);
        (i = I(i, j(m = H(e, y - s - 1), n.digits[y - s - 1]))).isNeg && (i = C(i, m),
            --n.digits[y - s - 1])
    }
    return i = L(i, c),
        n.isNeg = t.isNeg != a,
        t.isNeg && (n = a ? C(n, u) : I(n, u),
            i = I(e = L(e, c), i)),
        0 == i.digits[0] && 0 == F(i) && (i.isNeg = !1),
        new Array(n, i)
}
var J = {
    NoPadding: "NoPadding",
    PKCS1Padding: "PKCS1Padding",
    RawEncoding: "RawEncoding",
    NumericEncoding: "NumericEncoding"
};
var exports = {
    RSAAPP: J,
    setMaxDigits: m,
    RSAKeyPair: function (t, e, n, i) {
        this.e = P(t),
            this.d = P(e),
            this.m = P(n),
            this.chunkSize = "number" != typeof i ? 2 * F(this.m) : i / 8,
            this.radix = 16,
            this.barrett = new function (t) {
                this.modulus = _(t),
                    this.k = F(this.modulus) + 1;
                var e = new v;
                e.digits[2 * this.k] = 1,
                    this.mu = z(e, this.modulus)[0],
                    this.bkplus1 = new v,
                    this.bkplus1.digits[this.k + 1] = 1,
                    this.modulo = r,
                    this.multiplyMod = o,
                    this.powMod = a
            }
                (this.m)
    },
    encryptedString: function (t, e, n, i) {
        var r, o, a, s, c, u, l, d, h, f = new Array, p = e.length, g = "";
        for (s = "string" == typeof n ? n == J.NoPadding ? 1 : n == J.PKCS1Padding ? 2 : 0 : 0,
            c = "string" == typeof i && i == J.RawEncoding ? 1 : 0,
            1 == s ? p > t.chunkSize && (p = t.chunkSize) : 2 == s && p > t.chunkSize - 11 && (p = t.chunkSize - 11),
            r = 0,
            o = 2 == s ? p - 1 : t.chunkSize - 1; r < p;)
            s ? f[o] = e.charCodeAt(r) : f[r] = e.charCodeAt(r),
                r++,
                o--;
        for (1 == s && (r = 0),
            o = t.chunkSize - p % t.chunkSize; o > 0;) {
            if (2 == s) {
                for (u = Math.floor(256 * Math.random()); !u;)
                    u = Math.floor(256 * Math.random());
                f[r] = u
            } else
                f[r] = 0;
            r++,
                o--
        }
        for (2 == s && (f[p] = 0,
            f[t.chunkSize - 2] = 2,
            f[t.chunkSize - 1] = 0),
            l = f.length,
            r = 0; r < l; r += t.chunkSize) {
            for (d = new v,
                o = 0,
                a = r; a < r + t.chunkSize; ++o)
                d.digits[o] = f[a++],
                    d.digits[o] += f[a++] << 8;
            h = t.barrett.powMod(d, t.e),
                g += 1 == c ? E(h) : 16 == t.radix ? A(h) : w(h, t.radix)
        }
        return g
    }
}

function enen(phone, ttt = '') {
    exports.setMaxDigits(131)

    var tt = 'E710C1CE1A8B580F69393020157514EB96AC72997AF751CE041BE799BC9EF112031F5F9709F2362B25ED0CB7173A0FFCB012A40EA015063DEEFA137F137C88788752D5B4D538DE123A46AF95901BC4626DD012917FA1B0973F0B44A8427A7A3FDDAD087316F8CAE594705256F4D8B5C889ABAA886A8C9CE32697A48F4548ADB9'
    if (ttt) {
        tt = ttt
    }
    var nn = new exports.RSAKeyPair("3", "10001", tt, 1024);
    phone = phone + ''

    return Buffer.from(exports.encryptedString(nn, encodeURIComponent(phone), 'PKCS1Padding', 'RawEncoding'), 'binary').toString(
        'base64'
    )
}
module.exports = {
    enen
}

