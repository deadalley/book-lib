export const ignoreReturnFor = fn => args =>
  Promise.resolve()
    .then(() => fn(args))
    .then(() => args)
