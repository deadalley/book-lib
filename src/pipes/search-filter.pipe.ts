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
      const queryItems = query.split(' ').filter(item => !!item)
      if (keys) {
        return keys.some(key =>
          queryItems.some(
            queryItem =>
              item[key] &&
              item[key].toLowerCase().includes(queryItem.toLowerCase())
          )
        )
      }
      const lowerCaseItems = item
        .split(' ')
        .filter(it => !!it)
        .map(it => it.toLowerCase())
      return lowerCaseItems.some(it =>
        queryItems.some(queryItem => it.includes(queryItem.toLowerCase()))
      )
    })
  }
}
