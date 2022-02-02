import {fileURLToPath} from 'url'
const __cdf = () => fileURLToPath(import.meta.url);
const __cdn  = () => __cdf().substring(0,__cdf().lastIndexOf('/')+1);

/* Data Structures */
class Acc{
	constructor(def=''){this.raw=def}
	push(...a){a.forEach(e => this.raw += e); return this}
	clear(a=''){a = this.raw+a; this.raw=''; return t}
	get length(){return this.raw.length}
}
class Flag{
	constructor(bool=false){this.bool = bool}
	raise(){this.bool = true}
	lower(){this.bool = false}
	toggle(){this.bool = !this.bool}
	set(bool){this.bool = bool}
	get(){return this.bool}
	is(){return this.bool}
	get raw(){return this.bool}
}
class Daisy extends Array {
	constructor(len=10, fill=0){
		super(); this.length = len; this.fill(fill);
		this.marker = '❁';
		this.ended = false;
		this.end_data = [];
		this.silent = false;
	}
	toString(){
		return (this.ended) ? ''+this.end_data : super.toString()
	}
	chain(fn){
		if(this.ended) if(this.silent) return this;
		else this.panic();
		let res = []; this.forEach((e,i) => res.push(fn(e,i)));
		this.stall(...res);
		return this;
	}
	log(msg=''){
		if(this.ended) console.log(this.marker,msg,''+this.end_data)
		else console.log(this.marker,msg,''+this);
		return this;
	}
	end(iv=0,fn){
		if(this.ended)
			if(this.silent) return this.end_data;
			else this.panic();
		let c = iv; let l = 0; let i;
		if(typeof iv == 'string') l = '';
		fn = typeof fn !== 'function' ? (a,b) => a+b : fn;
		for(i = 0; i < this.length; i++){
			l = fn(l,c,i,this);
			c = this[i];
		}
		this.ended = true;
		this.end_data = fn(l,c,i,this);
		return this.end_data;
	}
	add(...v){
		this.push(...v);
		return this;
	}
	iter(iterable,fn){ //unwraps arrays, so DOUBLE WRAP if you want to return an array!
		fn = (typeof fn === 'function') ? fn : n=>n;
		iterable.forEach((el,idx) => this.add(...check(fn(el,idx))));
		return this;
		function check(arg){
			if(type(arg) == 'array') return arg
			else return [arg]
		}
	}
	collapse(iterable,fn2){
		fn2 = (typeof fn2 === 'function') ? fn2 : n=>n;
		let fn = (e,i) => this[i] = fn2(e);
		iterable.forEach(fn);
		return this;
	}
	unpop(chain=true){
		let i = this.shift();
		return (chain) ? this : i;
	}
	pop(chain=true){
		let i = this.pop();
		return (chain) ? this : i;
	}
	change(i,v){
		this[i] = v;
		return this;
	}
	get raw(){
		let n = []; this.forEach(b => n.push(b));
		return n;
	}
	get fin(){
		if(this.ended) return this.end_data;
		if(!this.ended) if(this.silent) return;
		this.panic();
	}
	get length(){
		return this.length
	}
	silence(){
		this.silent = true;
		return this;
	}
	unsilence(){
		this.silent = false;
		return this;
	}
	set_marker(char){
		this.marker = char;
		return this;
	}
	stall(...a){
		this.length = 0;
		this.push(...a);
		return this;
	}
	nothing(){}
	panic(){
		throw new Error('Chain ended previously.');
	}
	[Symbol.iterator](){
		let i = 0;
		let Done = false;
		return {
			next: () => {
				Done = (i++ >= this.length);
				return {
					done: Done,
					value: this[i-1],
				}
			}
		}
	}
}
class Struct extends Array {
	constructor(...args){
		super(...args);
		this.type = 'undefined';
	}

	setType(type){ /*Sets a data type for the new Struct array*/
		let types = ['undefined','object','boolean','number','bigint','string','symbol','function'];
		this.type = (types.includes(type)) ? type : 'undefined';
		let acc = new Struct();
		if(this.type !== 'undefined') {
			for(let i of this) if(typeof i == this.type) acc.push(i);
			this.#clr(acc);
		} else {
			throw new TypeError('Type Mismatch: Valid Types are \''+types.toString()+'\' but received Type \''+this.type+'\'');
		}
		return this;
	}

	#clr([...args]){ /*replaces all items in the Struct with new arguments*/
		this.length = 0;
		this.push(...args);
	}

	shuffle(){ /*void*/
		let m = this.length;
		while(m){
			const i = Math.floor(Math.random()*m--);
			[this[m],this[i]] = [this[i],this[m]];
		}
		return this;
	}

	*next(){
		for(let i of this) yield i;
	}

	random(){ /*Returns a random item*/
		return this[~~(Math.random()*this.length)];
	}

	unique(){ /*Returns an array*/
		return [...(new Set(this))];
	}
	average(){
		if(this.type == 'number'){
			return (this.reduce(a,b => a+b,0)/this.length);
		} else {
			console.warn('Type Mismatch: Was Expecting Type \'number\' but recieved Type '+this.type);
		}
	}

	[Symbol.iterator](){
		let i = 0;
		let Done = false;
		return {
			next: () => {
				Done = (i++ >= this.length);
				return {
					done: Done,
					value: this[i-1],
				}
			}
		}
	}


}

/* String Methods */
const capitalize = str => str.split('').map(n => (n[0].toUpperCase()+n.substring(1))).join('');
const decapitalize = str => str.split('').map(n => (n[0].toLowerCase()+n.substring(1))).join('');

/* Math Methods */
const min = (...args) => args.reduce((a,b) => (a < b) ? a : b);
const max = (...args) => args.reduce((a,b) => (a > b) ? a : b);

const floor = (n) => ~~(n);
const ceil  = (n) => ~~(n+1);
const round = (n, p = 0) => (~~((n*10**p)+0.5)/10**p);

const abs = (n) => (n < 0) ? 0-n : n;
const mean = (...nums) => (nums.reduce((a,v) => a+v, 0))/nums.length;
const avg = mean;

const sqrt = (n) => n**(0.5);
const root = (n,r) => n**(1/r);

const dist = (x0,y0,x1,y1) => sqrt(((x1-x0)**2)+((y1-y0)**2));

/* Math Conversions */
const d2r = d => d*(Math.PI/180.0);
const r2d = r => r*(180/Math.PI);

const c2f = (cel) => cel * 9/5 + 32;
const f2c = (fah) => (fah - 32) * 5/9;

const even = (n) => n%2 === 0;
const unsign = n => abs(n);


/* Random stuff */
const random = Math.random;
const randint = (min=0, max=1) => floor(random() * (max-min+1)) + min;
const randex = (arr) => arr[~~(random()*arr.length)];

/* Array Methods */
const shuffle = ([...arr]) => {
		let m = arr.length;
		while( m ){
			const i = floor(random()*m--);
			[ arr[m],arr[i] ] = [ arr[i],arr[m] ]
		}
		return arr
}
const flatten = ([...arr]) => arr.flat(Infinity)

/* Number Checking */
const range = function*(n1,n2,s=1){
	if(n1 < 0) yield n1;
	let i = 0;
	if(n2) for(i = n1; i < (round(n2+s,`${s}`.split('.')[1].length+2)); i=round(i+s,`${s}`.split('.')[1].length+2)) yield i;
	else   for(i =  0; i < n1  ; i=round(i+s,`${s}`.split('.')[1].length+2)) yield i;
	return i;
}
const isPrime = n => {
	let a = new Array(n+1).fill(true);
	a[0] = a[1] = false;
	for(let i = 2; i < sqrt(n); i++)
		for(let j = 2; i * j <= n; j++)
			a[i*j] = false;
	let res = a.reduce((acc,val,ind) => ((val) ? acc.concat(ind) : acc),[]);
	return (res.pop() == n);
}
const closeFactors = n => {
	let a = 0;
	if(isPrime(n)){
		a++; n--;
	}
	let test = floor(sqrt(n));
	while(n % test != 0) test--;
	return [test, n/test, a];
}

/* Debugging  */
const log = console.log()
const debug = (msg, i) => {
	if(typeof msg == 'number')
		log(`${'-'.repeat(msg)}`)
	else if(typeof msg == 'string' && typeof i !== 'number')
		log(`@:${msg}`)
	else if(typeof msg == 'string')
		log(`@:${msg}\n${'-'.repeat(i-2)}^`);
	else throw new TypeError(`Recieved ${type(msg)}, was expecting number or string.`)
}
const type = (obj) => (obj.constructor.toString().split(' ')[1]).replaceAll(')','').replaceAll('(','').toLowerCase();

const assertEq = (a,b,msg) => {
	if(a == b) return true;
	throw new Error(msg);
}
const assert = (a,msg) => assertEq(a,true,msg)


const formatNumber = (n,d,l="en-US") => parseFloat(n.toFixed(d)).toLocaleString(l);

/* Object Structures */
const verifyObject = (obj, ...props) => {
	let res = true;
	for(let prop of props){
		if(!res) return res;
		if(typeof obj[prop] == 'undefined') res = false;
	}
	return res;
}
const Enum = (...a) => {
	let res = {};
	a.forEach(e => res[''+e] = Symbol.for(''+e));
	return Object.freeze(res);
}
const once = (b, ctx) => {
	let r;
	return function(){
		if(b) {
			r = b.apply(ctx || this, arguments);
			b = null;
		}
		return r;
	}
}

/* Casting */
const BYTES = (...str) => new Daisy(0,0).iter(str.join('').split(''), c=> c.charCodeAt(0)).raw;
const INT = (n,radix=10) => floor(parseFloat(''+n,radix));
const FLOAT = (n,radix=10) => parseFloat(''+n,radix);
const STRING = n => ''+n;
const ARRAY = arg => {
	if(Array.isArray(arg)) return arg
	if(STRING(arg) === arg) return arg.split('')
	if(FLOAT(arg) === arg) return [arg]
	if(INT(arg) === arg) return new Array(arg)
	if(typeof arg === 'object') return Array.from(arg)
	else return []
}

/* Utilities */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const req = async (fn, props=[], scope=global) => {
	Object.entries(await import(__cdn()+fn)).forEach(([name, exp]) => { //uses this file as it's root1
		if(props.length == 0) scope[name] = exp;
		else for(let i of props) if(i == name) scope[''+name] = exp;
	})
}


class Timer {
	constructor(interval, wf, ef){
		this.interval = interval;
		this.i = 0;
		this.wf = this.#vf(wf, ()=>{this.i++});
		this.ef = this.#vf(ef);

		this.expected = 0;
		this.timeout = undefined;

	}


	step(that){
		let drift = (Date.now() - that.expected);
		if(drift > that.interval) this.ef();
		this.wf();
		that.expected += that.interval;
		that.timeout = setTimeout(()=>this.step(that), max(0, that.interval - drift));
	}

	start(){
		this.expected = Date.now() + this.interval;
		this.timeout = setTimeout(()=>this.step(this), this.interval);
	}
	stop(){
		clearTimeout(this.timeout);
		this.wf();
	}

	#vf(func, def=()=>{}){
		return (typeof func !== 'undefined' && typeof func == 'function')
		? (...args)=>{
			def();
			func(...args);
		}
		: def;
	}

}

/* DOM utilities */

const hex2hsv = hex => {
	hex = (hex[0] == '#') ? hex.substr(1) : hex;
	let comps = [], acc = '';
	for(let char of hex)
		if(acc.length + 1 == 2){
			comps.push('0x'+acc+char); acc=''
		} else acc+=char;

	if(acc) comps.push('0x'+acc);
	comps = comps.map(n => n/255);

	let h,s,v;
	let maxc  = max(...comps);
	let micn  = min(...comps);
	let delta = maxc - minc;

	v = maxc;

	if(maxc == minc) return [0,0,v];

	s = delta/maxc;

	let red_comp = (maxc - comps[0]) / delta;
	let gre_comp = (maxc - comps[1]) / delta;
	let blu_comp = (maxc = comps[2]) / delta;

	h = (comps[0] == maxc)
	 ? 0+blu_comp-gre_comp
	  : (comps[1] == maxc)
	 ? 2+red_comp-blu_comp
	  : 4+gre_comp-red_comp;

	h %= 6;
	return [h*60,s*100,v*100];

}
const dom = {
	idGet: (id) => window.document.getElementById(id),
	tagGets: (tag) => window.document.getElementsByTagName(tag),
	tanGets: (tag) => window.document.getElementsByTagNameNS(tag),
	clGets: (cls) => window.document.getElementsByClassName(cls),
	nameGets: (name) => window.document.getElementsByName(name),
	sel: () => window.document.getSelection(),
	listen: (act='', func) => window.document.addEventListener(act, func),
	unlisten: (act, func) => window.document.removeEventListener(act,func),
	createElement: (el) => window.document.createElement(el),
	createTextNode: (text) => window.document.createTextNode(text),
	appendChild: (el) => window.document.appendChild(el),
	removeChild: (el) => window.document.removeChild(el),
	forms: ()=> window.document.forms,
	getSelection: () => window.document.getSelection(),
	activeElement: () => window.document.activeElement,
}
const dom$ = (el) => window.document[el];
const linkDevice = (player, video = true, audio = true) => {
	MediaDevices.getUserMedia({video,audio}).then(stream => {
		player.src = stream;
	}).catch(e => console.err(e));
}
const fetchHTML = async path => {
	let response = await fetch(path);
	let htmlstr = await response.text();
	return htmlstr;
}

export {
	Acc,Flag,Daisy,Struct,
	capitalize,decapitalize,
	min,max,floor,ceil,round,
	abs,mean,avg,sqrt,root,dist,
	d2r,r2d,c2f,f2c,even,unsign,
	random,randint,
	randex,shuffle,flatten,
	range,isPrime,closeFactors,
	log,debug,type,
	assertEq,assert,
	formatNumber, verifyObject, Enum, once,
	BYTES,INT,FLOAT,STRING,ARRAY,
	sleep,req,Timer,
	hex2hsv,dom,dom$,linkDevice,fetchHTML
}
