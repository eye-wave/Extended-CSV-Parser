import { CustomTypeDefinition, parseCSV } from "./parser.ts"

const customTypes:CustomTypeDefinition[] =[
  {
    name: "random",
    parse: () => Math.random()
  },
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

const file =Deno.readTextFileSync("demo.csve")
const data =parseCSV(file,customTypes)
const json =JSON.stringify(data,null,2)

console.log(json)
