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

export const parseFirebaseAuthError = (error): string => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Please provide a valid e-mail'
    case 'auth/user-not-found':
      return 'User not found'
    case 'auth/wrong-password':
      return 'Wrong password'
    default:
      return 'Could not login. Try again.'
  }
}
