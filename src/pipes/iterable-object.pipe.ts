import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'iterable'
})
export class IterableObject implements PipeTransform {
  transform(object: any): any {
    if (!object) { return null }
    return Object.keys(object)
            .map((key) => ({ 'key': key, 'value': object[key]}) )
            .sort((a, b) => {
              if (a.key < b.key) { return -1 }
              if (a.key > b.key) { return 1 }
              return 0
            })
  }
}
