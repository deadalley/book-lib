import { Pipe, PipeTransform } from '@angular/core'
import { Collection } from 'interfaces/collection'

@Pipe({
  name: 'collectionOrdering'
})
export class CollectionOrderPipe implements PipeTransform {
  transform(collections: Collection[], orderingMethod?: any): any {
    const orderedCollections = Array.from(collections)
    if (!orderingMethod || orderingMethod === 'no grouping') { return orderedCollections }

    orderedCollections.sort((a, b) => {
      let sortA, sortB
      if (orderingMethod === 'size') {
        sortA = a.books.length
        sortB = b.books.length
      } else {
        sortA = a[orderingMethod]
        sortB = b[orderingMethod]
      }
      if (sortA < sortB) { return -1 }
      if (sortA > sortB) { return 1 }
      return 0
    })

    return orderedCollections
  }
}
