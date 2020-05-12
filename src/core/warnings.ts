import { format } from '../utils'

export const enum CoreWarnCodes {
  NOT_FOUND_KEY,
  FALLBACK_TO_TRANSLATE,
  CANNOT_FORMAT_NUMBER,
  FALLBACK_TO_NUMBER_FORMAT,
  CANNOT_FORMAT_DATE,
  FALLBACK_TO_DATE_FORMAT,
  __EXTEND_POINT__
}

export const warnMessages: { [code: number]: string } = {
  [CoreWarnCodes.NOT_FOUND_KEY]: `Not found '{key}' key in '{locale}' locale messages.`,
  [CoreWarnCodes.FALLBACK_TO_TRANSLATE]: `Fall back to translate '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.CANNOT_FORMAT_NUMBER]: `Cannot format a number value due to not supported Intl.NumberFormat.`,
  [CoreWarnCodes.FALLBACK_TO_NUMBER_FORMAT]: `Fall back to number format '{key}' key with '{target}' locale.`,
  [CoreWarnCodes.CANNOT_FORMAT_DATE]: `Cannot format a date value due to not supported Intl.DateTimeFormat.`,
  [CoreWarnCodes.FALLBACK_TO_DATE_FORMAT]: `Fall back to datetime format '{key}' key with '{target}' locale.`
}

export function getWarnMessage(
  code: CoreWarnCodes,
  ...args: unknown[]
): string {
  return format(warnMessages[code], ...args)
}
