/**
 * define the resource schema
 */

import enUS from './en-US.json'

// define message schema as master mesage schema
export type MessageSchema = typeof enUS

// define number format schema
export type NumberSchema = {
  currency: {
    style: 'currency'
    currencyDisplay: 'symbol'
    currency: string
  }
}
