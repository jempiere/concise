import {fileURLToPath} from 'url'
const __cdf = () => fileURLToPath(import.meta.url);
const __cdn = () => __cdf().substring(0, __cdf().lastIndexOf('/') + 1);


// ### The Accumulator is comparable to a "String Builder" class.
// It builds strings, and has a `clear` function for inlining.
class Acc {
		//Creates a new accumulator initialized to `def`.
    constructor(def = '') {
        this.raw = def
    }
		//Appends strings to the end of the accumualator.
    push(...a) {
        a.forEach(e => this.raw += e);
        return this
    }
		//Returns and clears from the accumulator.
    clear(a = '') {
        a = this.raw + a;
        this.raw = '';
        return t
    }
		//Static length property for the accumulator.
    get length() {
        return this.raw.length
    }
}

// ### `Flag` is a simple boolean wrapper. The flag will always have a status of
// ### either `true` or `false`, always accessible by the `raw` getter.
class Flag {
		//Creates a new flag initialized to `bool`.
    constructor(bool = false) {
        this.bool = bool
    }
		//Will set the flag to true.
    raise() {
        this.bool = true
    }
		//Will set the flag to false.
    lower() {
        this.bool = false
    }
		//Will toggle the flag.
    toggle() {
        this.bool = !this.bool
    }
		//Will set the flag to it's argument, `bool`.
    set(bool) {
        this.bool = bool
    }
		//Gets the flag's value in a funciton call.
    get() {
        return this.bool
    }
		//This is an alias. see `get()`.
    is() {
        return this.bool
    }
		//Getter that returns the flag's value
    get raw() {
        return this.bool
    }
}

// ### `Daisy` is a functional paradigm, named after "Daisy Chaining".
// Array-accessible, method-chainable, and option-heavy.
class Daisy extends Array {
		//Creates a new Daisy initialized to `fill`, repeated over `len` spots.
    constructor(len = 10, fill = 0) {
        super();
        this.length = len;
        this.fill(fill);
        this.marker = '❁';
        this.ended = false;
        this.end_data = [];
        this.silent = false;
    }
		//Called whenever a string representation is necessary.
		//It returns a clean, nice string analogue to an array.
    toString() {
        return (this.ended) ? '' + this.end_data : super.toString()
    }
		//This is a chaining method, similar to `Array.map`. It will always
		//edit inline, and return itself. It can be passed a function, which
		//can take an element and an index.
    chain(fn) {
        if (this.ended)
            if (this.silent) return this;
            else this.panic();
        let res = [];
        this.forEach((e, i) => res.push(fn(e, i)));
        this.stall(...res);
        return this;
    }
		//Logs the current state of the chain, and if it's ended it will
		//log it's final value. It has an optional marker, set to an ascii flower.
    log(msg = '') {
        if (this.ended) console.log(this.marker, msg, '' + this.end_data)
        else console.log(this.marker, msg, '' + this);
        return this;
    }
		//Ends the chain, similar to `Array.reduce`. This will *NOT* edit in place,
		//but instead will return a value and save it to the `fin` getter.
    end(iv = 0, fn) {
        if (this.ended)
            if (this.silent) return this.end_data;
            else this.panic();
        let c = iv;
        let l = 0;
        let i;
        if (typeof iv == 'string') l = '';
        fn = typeof fn !== 'function' ? (a, b) => a + b : fn;
        for (i = 0; i < this.length; i++) {
            l = fn(l, c, i, this);
            c = this[i];
        }
        this.ended = true;
        this.end_data = fn(l, c, i, this);
        return this.end_data;
    }
		//Appends all items `...v` to the Daisy.
    add(...v) {
        this.push(...v);
        return this;
    }

		//Iterates an iterable AFTER the chain and calls an optional function on it.
		//In order to allow for multiple-return values, it *UNWRAPS* arrays--so if you
		//want to return an array, *DOUBLE WRAP IT*.
    iter(iterable, fn) {
        fn = (typeof fn === 'function') ? fn : n => n;
        iterable.forEach((el, idx) => this.add(...check(fn(el, idx))));
        return this;

        function check(arg) {
            if (type(arg) == 'array') return arg
            else return [arg]
        }
    }
		//Iterates an iterable INTO the chain, starting at `i=0`. Do not use if
		//you wish to not overwrite values.
    collapse(iterable, fn2) {
        fn2 = (typeof fn2 === 'function') ? fn2 : n => n;
        let fn = (e, i) => this[i] = fn2(e);
        iterable.forEach(fn);
        return this;
    }
		//Drops the last element of the array, and if `chain` is set to false
		//then it returns it too!
    unpop(chain = true) {
        let i = this.shift();
        return (chain) ? this : i;
    }
		//Drops the first element of the array, and if `chain` is set to false
		//then it returns it too!
    pop(chain = true) {
        let i = this.pop();
        return (chain) ? this : i;
    }
		//Alters-in-place the value at index `i` and replaces it with `v`.
    change(i, v) {
        this[i] = v;
        return this;
    }
		//Getter that returns the Daisy's contents as an array.
    get raw() {
        let n = [];
        this.forEach(b => n.push(b));
        return n;
    }
		//Getter that returns the Daisy's end state, or panics if it doesn't yet have one.
    get fin() {
        if (this.ended) return this.end_data;
        if (!this.ended)
            if (this.silent) return;
        this.panic();
    }
		//Getter that returns the Daisy's length.
    get length() {
        return this.length
    }
		//Silences the Daisy, so error messages are suppressed.
    silence() {
        this.silent = true;
        return this;
    }
		//Reverses a silence, so error messages are no longer suppressed.
    unsilence() {
        this.silent = false;
        return this;
    }
		//Sets the marker to be used in logging.
    set_marker(char) {
        this.marker = char;
        return this;
    }
		//Clears every value in the chain and replaces it with arguments.
    stall(...a) {
        this.length = 0;
        this.push(...a);
        return this;
    }
		//Does nothing.
    nothing() {}
		//Throws an Error.
    panic() {
        throw new Error('Chain ended previously.');
        }
		//Defines iterator behavior.
    [Symbol.iterator]() {
        let i = 0;
        let Done = false;
        return {
            next: () => {
                Done = (i++ >= this.length);
                return {
                    done: Done,
                    value: this[i - 1],
                }
            }
        }
    }
}
// ### A typed, ordered version of an Array.
class Struct extends Array {
		//Returns a new Struct with default arguments.
    constructor(...args) {
        super(...args);
        this.type = 'undefined';
    }
		//Sets a javascript datatype for the Struct.
    setType(type) {
        let types = ['undefined', 'object', 'boolean', 'number', 'bigint', 'string', 'symbol', 'function'];
        this.type = (types.includes(type)) ? type : 'undefined';
        let acc = new Struct();
        if (this.type !== 'undefined') {
            for (let i of this)
                if (typeof i == this.type) acc.push(i);
            this.#clr(acc);
        } else {
            throw new TypeError('Type Mismatch: Valid Types are \'' + types.toString() + '\' but received Type \'' + this.type + '\'');
        }
        return this;
    }

		//Private method, clears and replaces everything.
    # clr([...args]) {
        this.length = 0;
        this.push(...args);
    }
		//Shuffles the struct in place.
    shuffle() { /*void*/
        let m = this.length;
        while (m) {
            const i = Math.floor(Math.random() * m--);
            [this[m], this[i]] = [this[i], this[m]];
        }
        return this;
    }
		//Iterates over the struct.
    * next() {
        for (let i of this) yield i;
    }

		//Returns a random element from the Struct. Not cryptographically secure.
    random() {
        return this[~~(Math.random() * this.length)];
    }
		//Returns an array of all of the unique items in the Struct.
    unique() { /*Returns an array*/
        return [...(new Set(this))];
    }
		//Returns the average of all values in a numeric Struct, or otherwise warns
		//against use.
    average() {
        if (this.type == 'number') {
            return (this.reduce(a, b => a + b, 0) / this.length);
        } else {
            console.warn('Type Mismatch: Was Expecting Type \'number\' but recieved Type ' + this.type);
        }
    }
		//Defines iteration behavior.
    [Symbol.iterator]() {
        let i = 0;
        let Done = false;
        return {
            next: () => {
                Done = (i++ >= this.length);
                return {
                    done: Done,
                    value: this[i - 1],
                }
            }
        }
    }


}

// ### String Methods
//Capitalizes each word in a string, split by spaces.
const capitalize = str => str.split('').map(n => (n[0].toUpperCase() + n.substring(1))).join('');
//Decapitalizes each word in a string, split by spaces.
const decapitalize = str => str.split('').map(n => (n[0].toLowerCase() + n.substring(1))).join('');

// ### Math Methods
//Returns the smallest of a set of values. Comparable to Math.min.
const min = (...args) => args.reduce((a, b) => (a < b) ? a : b);
//Returns the largest of a set of values. Comparable to Math.max.
const max = (...args) => args.reduce((a, b) => (a > b) ? a : b);

//Round the number down.
const floor = (n) => ~~(n);
//Round the number up.
const ceil = (n) => ~~(n + 1);
//Round the number using standard rules to a set number of places.
const round = (n, p = 0) => (~~((n * 10 * * p) + 0.5) / 10 * * p);

//Return the absolute value of the number.
const abs = (n) => (n < 0) ? 0 - n : n;
//Return the mean of a set of numbers.
const mean = (...nums) => (nums.reduce((a, v) => a + v, 0)) / nums.length;
//Alias. See `mean()`.
const avg = mean;

//Return the square root of a number. Comparable to Math.sqrt.
const sqrt = (n) => n * * (0.5);
//Returns the `r`th root of a number.
const root = (n, r) => n * * (1 / r);
//Returns the hypot of a triangle with two given points. Comparable to Math.hypotenuse.
const dist = (x0, y0, x1, y1) => sqrt(((x1 - x0) * * 2) + ((y1 - y0) * * 2));

// ### Math Conversion Methods
//Converts degrees to radians.
const d2r = d => d * (Math.PI / 180.0);
//Converts radians to degrees.
const r2d = r => r * (180 / Math.PI);

//Converts celsius to fahrenheit.
const c2f = (cel) => cel * 9 / 5 + 32;
//Converts fahrenheit to celsius.
const f2c = (fah) => (fah - 32) * 5 / 9;

//Tests if a number is even.
const even = (n) => n % 2 === 0;
//Alias. See `abs()`.
const unsign = n => abs(n);


// ### Micro Random Library
//Returns a pseudorandom number. Not cryptographically secure.
const random = Math.random;
//Returns a pseudorandom integer. Not cryptographically secure.
const randint = (min = 0, max = 1) => floor(random() * (max - min + 1)) + min;
//Returns a pseudorandom index of an array. Not cryptographically secure.
const randex = (arr) => arr[~~(random() * arr.length)];

// ### Array Methods
//Shuffles an array and returns it.
const shuffle = ([...arr]) => {
    let m = arr.length;
    while (m) {
        const i = floor(random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]]
    }
    return arr
}
//Flattens an array completely.
const flatten = ([...arr]) => arr.flat(Infinity)

// ### Number Manipulation Methods
//Returns either a range from 0 to `n1`-1 or a range from `n1` to `n2`. Step optional.
//Use a string for small decimals in the step.
const range = function*(n1, n2, s = 1) {
    if (n1 < 0) yield n1;
    let i = 0;
    if (n2)
        for (i = n1; i < (round(n2 + s, `${s}`.split('.')[1].length + 2)); i = round(i + s, `${s}`.split('.')[1].length + 2)) yield i;
    else
        for (i = 0; i < n1; i = round(i + s, `${s}`.split('.')[1].length + 2)) yield i;
    return i;
}
//Returns whether a number is prime or not using a seive.
const isPrime = n => {
    let a = new Array(n + 1).fill(true);
    a[0] = a[1] = false;
    for (let i = 2; i < sqrt(n); i++)
        for (let j = 2; i * j <= n; j++)
            a[i * j] = false;
    let res = a.reduce((acc, val, ind) => ((val) ? acc.concat(ind) : acc), []);
    return (res.pop() == n);
}
//Returns the two closest factors of a number n. Slow.
const closeFactors = n => {
    let a = 0;
    if (isPrime(n)) {
        a++;
        n--;
    }
    let test = floor(sqrt(n));
    while (n % test != 0) test--;
    return [test, n / test, a];
}

// ### Debugging Methods
//Alias for `console.log()`.
const log = console.log()
//Debugs a message, using dashes to an index, part of a message with a header, or both.
const debug = (msg, i) => {
    if (typeof msg == 'number')
        log(`${'-'.repeat(msg)}`)
    else if (typeof msg == 'string' && typeof i !== 'number')
        log(`@:${msg}`)
    else if (typeof msg == 'string')
        log(`@:${msg}\n${'-'.repeat(i-2)}^`);
    else throw new TypeError(`Recieved ${type(msg)}, was expecting number or string.`)
}
//returns the constructor name of an object.
const type = (obj) => (obj.constructor.toString().split(' ')[1]).replaceAll(')', '').replaceAll('(', '').toLowerCase();
//Standard assert equals function.
const assertEq = (a, b, msg) => {
    if (a == b) return true;
    throw new Error(msg);
}
//Standard assert function.
const assert = (a, msg) => assertEq(a, true, msg)

//Foramts a number to a locale string.
const formatNumber = (n, d, l = "en-US") => parseFloat(n.toFixed(d)).toLocaleString(l);

// ### Object Structures
//verifies that `obj` contains `props`.
const verifyObject = (obj, ...props) => {
    let res = true;
    for (let prop of props) {
        if (!res) return res;
        if (typeof obj[prop] == 'undefined') res = false;
    }
    return res;
}
//Creates an "enum" that uses Symbols for representation. It is wrapped around a
//frozen Object.
const Enum = (...a) => {
    let res = {};
    a.forEach(e => res['' + e] = Symbol.for('' + e));
    return Object.freeze(res);
}
//Allows a function to run only once by nullifying a reference after use.
const once = (b, ctx) => {
    let r;
    return function() {
        if (b) {
            r = b.apply(ctx || this, arguments);
            b = null;
        }
        return r;
    }
}

// Casting Calls
//Casts a string into a byte array.
const BYTES = (...str) => new Daisy(0, 0).iter(str.join('').split(''), c => c.charCodeAt(0)).raw;
//Casts a string or number into an integer.
const INT = (n, radix = 10) => floor(parseFloat('' + n, radix));
//Casts a string or number into a float.
const FLOAT = (n, radix = 10) => parseFloat('' + n, radix);
//calls toString on anything.
const STRING = n => '' + n;
//casts Strings, Floats, Ints, and Objects into arrays.
const ARRAY = arg => {
    if (Array.isArray(arg)) return arg
    if (STRING(arg) === arg) return arg.split('')
    if (FLOAT(arg) === arg) return [arg]
    if (INT(arg) === arg) return new Array(arg)
    if (typeof arg === 'object') return Array.from(arg)
    else return []
}

// ### Utility Functions
//Standard sleep function. Takes milliseconds. Use await.
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

//Custom require function. Compare to `require()` in Node.js.
//Input a filename in the same directory as concise.mjs, add an optional array of
//properties, and specify the scope (in browser, it will be window).
const req = async(fn, props = [], scope = global) => {
    Object.entries(await import(__cdn() + fn)).forEach(([name, exp]) => { //uses this file as it's root1
        if (props.length == 0) scope[name] = exp;
        else
            for (let i of props)
                if (i == name) scope['' + name] = exp;
    })
}

//An Error-adjusting Timer that takes an interval in milliseconds,
//a function on what to do each `interval`, and an onerror function. It is
//async, so use await.

class Timer {
		//returns a new Timer object.
    constructor(interval, wf, ef) {
        this.interval = interval;
        this.i = 0;
        this.wf = this.#vf(wf, () => {
            this.i++
        });
        this.ef = this.#vf(ef);

        this.expected = 0;
        this.timeout = undefined;

    }

		//Steps the timer forward.
    step(that) {
        let drift = (Date.now() - that.expected);
        if (drift > that.interval) this.ef();
        this.wf();
        that.expected += that.interval;
        that.timeout = setTimeout(() => this.step(that), max(0, that.interval - drift));
    }
		//Starts the timer going.
    start() {
        this.expected = Date.now() + this.interval;
        this.timeout = setTimeout(() => this.step(this), this.interval);
    }
		//Stops the timer.
    stop() {
        clearTimeout(this.timeout);
        this.wf();
    }

		//Private method, cleans up default args.
    #
    vf(func, def = () => {}) {
        return (typeof func !== 'undefined' && typeof func == 'function') ? (...args) => {
            def();
            func(...args);
        } : def;
    }

}

// ### DOM Utilities

//Converts hex codes to hsv strings.
const hex2hsv = hex => {
    hex = (hex[0] == '#') ? hex.substr(1) : hex;
    let comps = [],
        acc = '';
    for (let char of hex)
        if (acc.length + 1 == 2) {
            comps.push('0x' + acc + char);
            acc = ''
        } else acc += char;

    if (acc) comps.push('0x' + acc);
    comps = comps.map(n => n / 255);

    let h, s, v;
    let maxc = max(...comps);
    let micn = min(...comps);
    let delta = maxc - minc;

    v = maxc;

    if (maxc == minc) return [0, 0, v];

    s = delta / maxc;

    let red_comp = (maxc - comps[0]) / delta;
    let gre_comp = (maxc - comps[1]) / delta;
    let blu_comp = (maxc = comps[2]) / delta;

    h = (comps[0] == maxc) ? 0 + blu_comp - gre_comp : (comps[1] == maxc) ? 2 + red_comp - blu_comp : 4 + gre_comp - red_comp;

    h %= 6;
    return [h * 60, s * 100, v * 100];

}
//List of dom aliases.
const dom = {
    idGet: (id) => window.document.getElementById(id),
    tagGets: (tag) => window.document.getElementsByTagName(tag),
    tanGets: (tag) => window.document.getElementsByTagNameNS(tag),
    clGets: (cls) => window.document.getElementsByClassName(cls),
    nameGets: (name) => window.document.getElementsByName(name),
    sel: () => window.document.getSelection(),
    listen: (act = '', func) => window.document.addEventListener(act, func),
    unlisten: (act, func) => window.document.removeEventListener(act, func),
    createElement: (el) => window.document.createElement(el),
    createTextNode: (text) => window.document.createTextNode(text),
    appendChild: (el) => window.document.appendChild(el),
    removeChild: (el) => window.document.removeChild(el),
    forms: () => window.document.forms,
    getSelection: () => window.document.getSelection(),
    activeElement: () => window.document.activeElement,
}
//Separated dom alias for specified properties.
const dom$ = (el) => window.document[el];
//Links media devices.
const linkDevice = (player, video = true, audio = true) => {
    MediaDevices.getUserMedia({
        video, audio
    }).then(stream => {
        player.src = stream;
    }).catch(e => console.err(e));
}
//Fetches HTML from a file.
const fetchHTML = async path => {
    let response = await fetch(path);
    let htmlstr = await response.text();
    return htmlstr;
}
//Exports.
export {
    Acc, Flag, Daisy, Struct,
    capitalize, decapitalize,
    min, max, floor, ceil, round,
    abs, mean, avg, sqrt, root, dist,
    d2r, r2d, c2f, f2c, even, unsign,
    random, randint,
    randex, shuffle, flatten,
    range, isPrime, closeFactors,
    log, debug, type,
    assertEq, assert,
    formatNumber, verifyObject, Enum, once,
    BYTES, INT, FLOAT, STRING, ARRAY,
    sleep, req, Timer,
    hex2hsv, dom, dom$, linkDevice, fetchHTML
}
