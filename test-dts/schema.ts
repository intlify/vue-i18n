export type ResourceSchema = {
  foo: string
  nest: {
    bar: string
  }
  errors: string[]
}

export type MyDatetimeScehma = {
  short: {
    hour: 'numeric'
  }
}

export type MyNumberSchema = {
  currency: {
    style: 'symbol'
  }
}
