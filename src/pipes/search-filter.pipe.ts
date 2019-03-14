import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], query?: string, keys?: string[]): any {
    if (!query) {
      return items
    }

    return items.filter(item => {
      const queryItems = query.split(' ')
      if (keys) {
        return keys.some(key =>
          queryItems.some(
            queryItem =>
              item[key] && item[key].toLowerCase().includes(queryItem)
          )
        )
      }
      const lowerCaseItems = items.map(it => it.toLowerCase())
      return queryItems.some(queryItem => lowerCaseItems.includes(queryItem))
    })
  }
}
