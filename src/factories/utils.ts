import * as Factory from 'factory.ts'
import { lorem, random } from 'faker'

export const FactoryArray = (factory, n = 10): any[] => {
  const _ret = new Array()
  for (let i = 0; i < n; i++) {
    _ret.push(factory.build())
  }

  return _ret
}

export const GenericFactory = Factory.makeFactory<GenericInterface>({
  number: random.number(),
  string: lorem.sentence()
})

interface GenericInterface {
  number: number,
  string: string
}
