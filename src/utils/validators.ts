import { AbstractControl } from '@angular/forms'
import { upperCaseFirstLetter } from './helpers'

export const confirmField = (control: AbstractControl, fieldName: string) => {
  const field = control.get(fieldName).value
  const fieldConfirm = control.get(`confirm${upperCaseFirstLetter(fieldName)}`)
    .value

  if (field !== fieldConfirm) {
    control
      .get(`confirm${upperCaseFirstLetter(fieldName)}`)
      .setErrors({ fieldMismatch: true })
    return { fieldMismatch: true }
  }

  return null
}

export const confirmPassword = (control: AbstractControl) =>
  confirmField(control, 'password')

export const confirmEmail = (control: AbstractControl) =>
  confirmField(control, 'email')
