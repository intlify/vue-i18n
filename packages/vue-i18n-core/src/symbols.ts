import { makeSymbol } from '@intlify/shared'

export const CoreContextSymbol = /* #__PURE__*/ Symbol('__coreContext')
export const TranslateVNodeSymbol: symbol = /* #__PURE__*/ makeSymbol('__translateVNode')
export const DatetimePartsSymbol: symbol = /* #__PURE__*/ makeSymbol('__datetimeParts')
export const NumberPartsSymbol: symbol = /* #__PURE__*/ makeSymbol('__numberParts')
export const EnableEmitter: symbol = /* #__PURE__*/ makeSymbol('__enableEmitter')
export const DisableEmitter: symbol = /* #__PURE__*/ makeSymbol('__disableEmitter')
export const DisposeSymbol: symbol = /* #__PURE__*/ makeSymbol('__dispose')
