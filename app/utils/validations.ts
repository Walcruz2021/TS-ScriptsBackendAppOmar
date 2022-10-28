export const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/

export function validateInput(value): string | boolean {
  if (!value) {
    return 'Enter value'
  }
  return true
}

export function validateSelectMultiple(values): string | boolean {
  if (!values.length) {
    return 'Select values'
  }
  return true
}

export function validateEmail(value): string | boolean {
  if (!value) {
    return 'Entre email'
  }
  return validateRegexp(value, EMAIL_PATTERN)
}

export function validateRegexp(value: string, regexp: RegExp): boolean {
  return regexp.test(value)
}
