import { describe, it, expect } from "vitest"
import { parseCSV, type CustomTypeDefinition } from "../lib"

describe("Tesing parser",() => {

  it("Parses booleans correctly",() => {

    const testSample =`a:boolean,b:bool
True,false
TRUE,not true`

    const expectedOutput =[
      {
        a: true,
        b: false
      },
      {
        a: true,
      },
    ]

    expect(parseCSV(testSample)).toEqual(expectedOutput)

  })

  it("Parses numbers and floats correctly",() => {

    const testSample =`a:number
0
-1
0xff
20n
14.491`
    
    const testSample2 =`a:float
0
-1
0xff
20n
14.491`
    
    const expectedOutput =[
      { a: 0 },
      { a: -1 },
      { a: 255 },
      { a: 20 },
      { a: 14.491 },
    ]

    expect(parseCSV(testSample)).toEqual(expectedOutput)
    expect(parseCSV(testSample2)).toEqual(expectedOutput)

  })

  

  it("Parses integers correctly",() => {

    const testSample =`a:int
0
-1
0xff
20n
14.491`

    const expectedOutput =[
      { a: 0 },
      { a: -1 },
      { a: 255 },
      { a: 20 },
      { a: 14 },
    ]

    expect(parseCSV(testSample)).toEqual(expectedOutput)

  })




  it("Parses strings correctly",() => {

    const testSample =`stronglyTyped:string,noType
strong,weak
true,123`

    const expectedOutput =[
      {
        stronglyTyped: "strong",
        noType: "weak"
      },
      {
        stronglyTyped: "true",
        noType: "123"
      },
    ]

    expect(parseCSV(testSample)).toEqual(expectedOutput)

  })




  it("Parses arrays correctly",() => {

    const testSample =`strArray:string[],noType:[],numArray:number[],boolArr:bool[]
apple;banana,orange;peach,1;2;3;4,true;false
wine;beer,apple juice;water,-1;2.0004,
`

    const expectedOutput =[
      {
        strArray: ["apple","banana"],
        noType: ["orange","peach"],
        numArray: [1,2,3,4],
        boolArr: [true,false]
      },
      {
        strArray: ["wine","beer"],
        noType: ["apple juice","water"],
        numArray: [-1,2.0004],
        boolArr: []
      },
    ]

    expect(parseCSV(testSample)).toEqual(expectedOutput)

  })



  it("Parses nested properties correctly",() => {

    const testSample =`nested.a.b.c.d.e.f.g
hi
hello`

    const expectedOutput =[
      { nested: { a: { b: { c: { d: { e: { f: { g: "hi" }}}}}}}},
      { nested: { a: { b: { c: { d: { e: { f: { g: "hello" }}}}}}}},
    ]

    expect(parseCSV(testSample)).toEqual(expectedOutput)

  })




  it("Parses custom types correctly",() => {

    const testSample =`heart:heart,reversed:reversed
test message,anna
heart heart,kaiak
another test message,abcd`

    const testTypeDefinitions:CustomTypeDefinition[] =[
      {
        name: 'heart',
        parse: input => input +" <3"
      },
      {
        name: 'reversed',
        parse: input => input.split("").reverse().join("")
      },
    ]

    const expectedOutput =[
      {
        "heart": "test message <3",
        "reversed": "anna",
      },
      {
        "heart": "heart heart <3",
        "reversed": "kaiak",
      },
      {
        "heart": "another test message <3",
        "reversed": "dcba",
      },
    ]

    expect(parseCSV(testSample,testTypeDefinitions)).toEqual(expectedOutput)

  })



  it("Makes sure that comments are ignored",() => {

    const testSample =`id:number,name
0,john
1,victor
# this is a comment!
# 2,bot user`

    const expectedOutput =[
      {
        id: 0,
        name: "john",
      },
      {
        id: 1,
        name: "victor",
      },
    ]

    expect(parseCSV(testSample)).toEqual(expectedOutput)

  })



  it("Should parse this sample",() => {
    
    const testSample =`id:int,user.name,user.age:float,user.isVip:bool,user.gamesPlayed:[],message.content,message.dateSend:int,nested.property.number.array:number[],special:emoji
1,Alice,28.5,true,Tetris;Pac-Man,Hello how are you?,1648872000,1;2;3;4,:D
2,Bob,42.0,false,,Hey there!,1648882800,5;6;7,:party:
3,Charlie,19.3,true,Chess;Checkers;Monopoly,Howdy!,1648915200,21;22;23,:beer:
5,Hannah,31.6,false,Animal Crossing,What's new?,164892600024,25;26;27,:flower:
# 6,Isaac,19.4,true,League of Legends;Dota 2
# This is a comment`

    const testTypeDefinitions:CustomTypeDefinition[] =[
      {
        name: "emoji",
        parse: input => {
          switch ( input ) {
            case ":D": return "😃"
            case ":flower:": return "🌺"
            case ":party:": return "🎉"
            case ":beer:": return "🍺"
            default: return input
          }
        }
      }
    ]

    const expectedOutput =[
      {id:1,user:{name:"Alice",age:28.5,isVip:!0,gamesPlayed:["Tetris","Pac-Man"]},message:{content:"Hello how are you?",dateSend:1648872e3},nested:{property:{number:{array:[1,2,3,4]}}},special:"😃"},
      {id:2,user:{name:"Bob",age:42,isVip:!1,gamesPlayed:[]},message:{content:"Hey there!",dateSend:1648882800},nested:{property:{number:{array:[5,6,7]}}},special:"🎉"},
      {id:3,user:{name:"Charlie",age:19.3,isVip:!0,gamesPlayed:["Chess","Checkers","Monopoly"]},message:{content:"Howdy!",dateSend:1648915200},nested:{property:{number:{array:[21,22,23]}}},special:"🍺"},
      {id:5,user:{name:"Hannah",age:31.6,isVip:!1,gamesPlayed:["Animal Crossing"]},message:{content:"What's new?",dateSend:164892600024},nested:{property:{number:{array:[25,26,27]}}},special:"🌺"},
    ]

    expect(parseCSV(testSample,testTypeDefinitions)).toEqual(expectedOutput)
  })

})

