export const cleanFormValues = (formValues): object => {
  // tslint:disable-next-line:prefer-const
  let cleanValues = { }

  Object.keys(formValues).forEach((prop) => {
    if (typeof formValues[prop] !== 'undefined' && formValues[prop]) {
      cleanValues[prop] = formValues[prop]
    }
  })
  return cleanValues
}
