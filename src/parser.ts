
export function parseCSV(input: string, customTypes:CustomTypeDefinition[] =[]){
  input =input.replace(/#.*\n?/g,"").trim()
  const [ rawHeaders ] =input.match(/.*/) || []
  
  if ( !rawHeaders ) throw new Error("File empty")

  const schema =getSchemaFromCSV(rawHeaders)
  const rows =input.split("\n").slice(1)

  return rows.map(row => parseRowWithSchema(row,schema,customTypes))
}




export type CustomTypeDefinition ={
  name: string,
  parse: (input:string) => unknown
}

function parseItemWithType(input:string, type:string, customTypes:CustomTypeDefinition[] =[]):any {
  if ( type.endsWith("[]" ) ) {
    const nestedType =type.slice(0,-2)
    return input
      .split(";")
      .map(item => parseItemWithType(item,nestedType))
      .filter(item => {
        if ( typeof item === "string" && item.length < 1 ) return false
        if ( typeof item === "number" && item === 0 ) return true
        if ( typeof item === "boolean" && item === false ) return true
        if ( !item ) return false
        return true
      })
  }

  const n =input.startsWith("0x") ? parseInt(input) : parseFloat(input)

  switch ( type ) {
    case "float":
    case "number": return isNaN(n) ? null : n
    case "int": return isNaN(n) ? null : Math.floor(n)
    case "bool":
    case "boolean": {
      const lower =input.toLowerCase()
      if ( lower === "true" ) return true
      if ( lower === "false" ) return false
      return null
    }
  }

  for ( const typedef of customTypes ) {
    if ( type !== typedef.name ) continue
    return typedef.parse(input)
  }

  return input
}




function parseRowWithSchema(row:string, schema:Schema, customTypes:CustomTypeDefinition[] =[]) {
  const obj:any ={}
  

  row.split(",").forEach((item,i) => {
    const schemaItem =schema.at(i)
    
    if ( !schemaItem ) return
      
    const nested =schemaItem.tokens.slice(0,-1)
    const lastToken =schemaItem.tokens.at(-1)
    const parsedItem =parseItemWithType(item,schemaItem.type,customTypes)

    if ( parsedItem === null ) return

    if ( !lastToken ) return

    let nestedObject =obj
    nested.forEach(token => {
      if (!( token in nestedObject )) nestedObject[token] ={}
      nestedObject =nestedObject[token]
    })

    nestedObject[lastToken] =parsedItem
    

  })

  
  return obj
}



type Schema =SchemaItem[]
type SchemaItem ={
  type: string,
  tokens: string[]
}

function getSchemaFromCSV(input:string):Schema {
  return input
    .split(",")
    .map(item => {

      const [ rawToken, type ="string" ] =item.split(":")
      const tokens =rawToken?.split(".") || []

      return { type, tokens }
    })
}


