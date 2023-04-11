# Extended CSV Parser for TypeScript

This project began as a way to write JSON files inside Excel spreadsheets.\
It allows for nested object properties, strongly typed values, arrays, and comments.

---

It transforms text inputs like this:
```
id:int,user.name,user.age:float,user.isVip:bool,user.gamesPlayed:[],message.content,message.dateSend:int,lucky:random,nested.property.number.array:number[],special:emoji
1,Alice,28.5,true,Tetris;Pac-Man,Hello how are you?,1648872000,-this-can-be-anything-,1;2;3;4,:D
2,Bob,42.0,false,,Hey there!,1648882800,-1,5;6;7,:party:
3,Charlie,19.3,true,Chess;Checkers;Monopoly,Howdy!,1648915200,---,21;22;23,:beer:
5,Hannah,31.6,false,Animal Crossing,What's new?,1648926000,random,24;25;26;27,:flower:
# 6,Isaac,19.4,true,League of Legends;Dota 2
# This is a comment
```

Into beautiful objects that are ready to use in a JavaScript or TypeScript project.
```json
[
  {
    "id": 1,
    "user": {
      "name": "Alice",
      "age": 28.5,
      "isVip": true,
      "gamesPlayed": [ "Tetris", "Pac-Man" ]
    },
    "message": {
      "content": "Hello how are you?",
      "dateSend": 1648872000
    },
    "lucky": 0.849495919176418,
    "nested": { "property": { "number": { "array": [ 1,2,3,4 ] } } },
    "special": "😃"
  },
  {
    "id": 2,
    "user": {
      "name": "Bob",
      "age": 42,
      "isVip": false,
      "gamesPlayed": []
    },
    "message": {
      "content": "Hey there!",
      "dateSend": 1648882800
    },
    "lucky": 0.027607189531068554,
    "nested": { "property": { "number": { "array": [5,6,7] } } },
    "special": "🎉"
  },
  {
    "id": 3,
    "user": {
      "name": "Charlie",
      "age": 19.3,
      "isVip": true,
      "gamesPlayed": [ "Chess", "Checkers", "Monopoly" ]
    },
    "message": {
      "content": "Howdy!",
      "dateSend": 1648915200
    },
    "lucky": 0.31084866168836345,
    "nested": { "property": { "number": { "array": [ 21,22,23 ] } } },
    "special": "🍺"
  }
]
```

---

## Usage

To use it, simply import the parseCSV function and pass a string with CSV data like this:
```ts
import { type CustomTypeDefinition, parseCSV } from "./parser.ts"

const customTypes =[] as CustomTypeDefinition[]

const file =Deno.readTextFileSync("demo.csve")
const data =parseCSV(file,customTypes)
const json =JSON.stringify(data,null,2)

console.log(json)
```

---

## Supported built-in types
- string ( default )
- float
- number
- int
- bool
- boolean
- all above +`[]`

---

## Custom Types

You may be wondering what those `random` and `emoji` types are for.\
This parser allows for custom type definitions, as shown here:
```ts
import type { CustomTypeDefinition } from "./parser.ts"

const customTypes:CustomTypeDefinition[] =[
  {
    name: "random",
    parse: () => Math.random()
  },
  {
    name: "emoji",
    parse: input => {
      switch ( input ) {
        case ":)": return "😄"
        case ":D": return "😃"
        case ":(": return "😢"
        default: return input
      }
    }
  }
]
```

---

## Syntax Explained

- `,` - separates header names and row values
- `.` - indicates that a header name is a nested object property
- `:` - used to add a optional type to a header entry
- `;` - array item separator


## To do
- [ ] Escaping `,` and `"` characters \
( right now parser uses .split(",") method, which is problematic for some files. )
- [ ] Vscode Extension for better syntax highlighting
- [ ] Rollup plugin
- [ ] readStream version of parseCSV for better performance
