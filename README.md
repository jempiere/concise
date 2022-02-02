# Concise.mjs
An all-purpose Snippets Library!
---
Welcome to `concise.mjs`, an es6 module that has just about every snippet I've ever needed (and is updated regularly!). 
It's got just about everything I need, and if you have any suggestions, feel free to create an issue or pull request!

[Source Code](https://github.com/jempiere/concise/blob/main/concise.mjs) | [Docs](/docs/concise.html#the-accumulator-is-comparable-to-a-string-builder-class)

Notes on formatting a project with `concise.mjs`:
---
All libraries imported with the `await req('LIBRARY.mjs')` MUST be in the same folder as concise.mjs OR in a specified subdirectory.
Example:

```
root/
├─ libs/
│  ├─ concise.mjs
│  ├─ subdirectory/
│  │  ├─ library2.mjs
│  ├─ library1.mjs
├─ src/
│  ├─ index.mjs
```

The above filetree houses several directories and subdirectories.

This is what the top of `index.mjs` could look like:

```JS
import { req } from '../libs/concise.mjs'
await req('library1.mjs');
await req('subdirectory/library2.mjs');
```
