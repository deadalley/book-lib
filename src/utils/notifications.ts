import * as $ from 'jquery'

export const notify = (
  params,
  options = { bold: true, allowDismiss: true, type: 'success' }
) => {
  const notifyTitle = options.bold
    ? `<strong>${params.title}</strong>`
    : params.title
  $.notify(
    {
      message: params.message,
      ...(params.title ? { title: notifyTitle } : {}),
    },
    {
      allow_dismiss: options.allowDismiss,
      ...(options.type ? { type: options.type } : {}),
    }
  )
}
