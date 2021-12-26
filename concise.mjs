/*SNIPPET LIBRARY*/

/*Array Methods*/

const randex = (arr) => arr[~~(Math.random()*arr.length)];

const shuffle = ([...arr]) => {
	let m = arr.length;
	while(m){
		const i = Math.floor(Math.random()*m--);
		[arr[m],arr[i]] = [arr[i],arr[m]];
	}
	return arr;
}

/*Data Structures*/

class Accumulator {
	constructor(t,cb){
		this.t = t;
		this.c = '';
		this.length = 0;
		this.cb = (typeof cb != 'undefined' && typeof cb == 'function') ? cb : ()=>log('Eureka!');
	}
	test(s){
		if(s.length > 1) throw new Error(`Rcieved ${s.length} chars, expected 1 char`);
		if(this.c+s == this.t){
			this.cb(); this.c+=s; this.#sl();
			return true;
		}
		let m = '';
		for(let i in this.t){
			if(this.t[i] != this.c[i]) m = this.t[i];
			if(m) break;
		}
		if(m == s){
			this.c += s;
			return true;
		}
		return false;
	}
	#sl(){this.length - this.c.length};
	clear(i){
		i = this.c;
		this.c=  '';
		return i;
	}
	[Symbol.iterator](){
		let i = 0;
		let Done = false;
		return {
			next: () => {
				Done = (i++ >= this.c.length);
				return {
					done: Done,
					value: this.c[i-1],
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

const verifyObject = (obj, ...props) => {
	let res = true;
	for(let prop of props){
		if(!res) return res;
		if(typeof obj[prop] == 'undefined') res = false;
	}
	return res;
}

/*STRINGS*/

const capitalize   = str => str[0].toUpperCase + str.substring(1);

const decapitalize = str => str[0].toLowerCase + str.substring(1);

/*MATH*/

const min = (...args) => args.reduce((a,b) => (a < b) ? a : b);

const max = (...args) => args.reduce((a,b) => (a > b) ? a : b);

const floor = (n) => ~~(n);

const ceil  = (n) => ~~(n+1);

const round = (n, p = 0) => (~~((n*10**p)+0.5)/10**p);

const abs = (n) => (n < 0) ? 0-n : n;

const random = Math.random;

const randint = (min=0, max=1) => floor(random() * (max-min+1)) + min;

const mean = (...nums) => (nums.reduce((a,v) => a+v, 0))/nums.length;

const sqrt = (n) => n**(0.5);

const d2r = d => d*(Math.PI/180.0);

const r2d = r => r*(180/Math.PI);

const dist = (x0,y0,x1,y1) => sqrt(((x1-x0)**2)+((y1-y0)**2));

const range = function*(n1,n2){
	if(n1 < 0) yield n1;
	let i = 0;
	if(n2) for(i = n1; i < n2+1; i++) yield i;
	else   for(i =  0; i < n1  ; i++) yield i;
	return i;
};

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
};





/*Utilities*/

const log = console.log;

const debug = (str, i) => {
	if(typeof str !== 'string' || typeof i !== 'number') throw new TypeError(`Type Mismatch in debug statement`);
	log(`s: ${str}\n${' '.repeat(i+2)}^`);
};

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
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const req = async (path, props=[], scope=global) => {
	Object.entries(await import(path)).forEach(([name, exp]) => { //uses this file as it's root1
		if(props.length == 0) scope[name] = exp;
		else for(let i of props) if(i == name) scope[''+name] = exp;
	})
}

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

};

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





/*DOM*/

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
	randex,
	shuffle,
	Accumulator,
	Struct,
	verifyObject,
	capitalize,
	decapitalize,
	min,
	max,
	floor,
	ceil,
	round,
	abs,
	random,
	randint,
	mean,
	sqrt,
	d2r,
	r2d,
	dist,
	range,
	isPrime,
	closeFactors,
	log,
	debug,
	once,
	sleep,
	req,
	hex2hsv,
	Timer,
	dom,
	linkDevice,
	fetchHTML,
}
