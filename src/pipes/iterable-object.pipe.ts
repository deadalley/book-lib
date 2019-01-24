import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'iterable',
})
export class IterableObjectPipe implements PipeTransform {
  transform(object: any): any {
    if (!object) {
      return null
    }
    return Object.keys(object)
      .map(key => {
        const id = `id${key
          .split(' ')
          .join('_')
          .split('/')
          .join('_')
          .toLowerCase()}`
        return { id, key, value: object[key] }
      })
      .sort((a, b) => {
        if (a.key < b.key) {
          return -1
        }
        if (a.key > b.key) {
          return 1
        }
        return 0
      })
  }
}
