import * as $ from 'jquery'

export const notify = (
  { title, message },
  options = {
    allowDismiss: true,
    bold: true,
  }
) => {
  const notifyTitle = options.bold ? `<strong>${title}</strong>` : title
  $.notify(
    { title: notifyTitle, message },
    { allow_dismiss: options.allowDismiss }
  )
}
