/**
 * define the resource schema
 */

import enUS from './en-US.json'

// define the locale message schema as master
export type MessageSchema = typeof enUS

// define the number format schema
export type NumberSchema = {
  currency: {
    style: 'currency'
    currencyDisplay: 'symbol'
    currency: string
  }
}
