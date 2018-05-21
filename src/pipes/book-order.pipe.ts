import { Pipe, PipeTransform } from '@angular/core'
import { Book } from 'interfaces/book'

@Pipe({
  name: 'bookOrdering'
})
export class BookOrderPipe implements PipeTransform {
  transform(books: Book[], orderingMethod?: any): any {
    if (!orderingMethod || orderingMethod === 'no grouping') { return { } }
    const orderedItems = { }

    books.forEach((book) => {
      if (orderingMethod === 'date') { book.date = new Date(book.date).toLocaleDateString() }

      let order = book[orderingMethod]
      if (orderingMethod === 'title') { order = order[0].toLocaleUpperCase() }

      if (Object.keys(orderedItems).includes(order)) {
        orderedItems[order].push(book)
      } else {
        orderedItems[order] = [book]
      }
    })

    return orderedItems
  }
}
