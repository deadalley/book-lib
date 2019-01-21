import { Pipe, PipeTransform } from '@angular/core'
import { Collection } from 'models/collection.model'

@Pipe({
  name: 'collectionGrouping',
})
export class CollectionGroupingPipe implements PipeTransform {
  transform(collections: Collection[], groupingMethod?: any): any {
    const orderedCollections = Array.from(collections)
    if (!groupingMethod || groupingMethod === 'no grouping') {
      return orderedCollections
    }

    orderedCollections.sort((a, b) => {
      let sortA, sortB
      if (groupingMethod === 'size') {
        sortA = a.books.length
        sortB = b.books.length
      } else {
        sortA = a[groupingMethod]
        sortB = b[groupingMethod]
      }
      if (sortA < sortB) {
        return -1
      }
      if (sortA > sortB) {
        return 1
      }
      return 0
    })

    return orderedCollections
  }
}
