export type IntlAvailability = {
  dateTimeFormat: boolean
  numberFormat: boolean
}

const intlDefined = typeof Intl !== 'undefined'
export const Availabilities = {
  dateTimeFormat: intlDefined && typeof Intl.DateTimeFormat !== 'undefined',
  numberFormat: intlDefined && typeof Intl.NumberFormat !== 'undefined'
} as IntlAvailability
