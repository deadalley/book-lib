import { Pipe, PipeTransform } from '@angular/core'
import { Book } from '../interfaces/book'

@Pipe({
  name: 'ordering'
})
export class BookOrderPipe implements PipeTransform {
  transform(books: Book[], orderingMethod?: any): any {
    if (!orderingMethod || orderingMethod === 'title') { return { } }
    const orderedItems = { }

    books.forEach((book) => {
      if (Object.keys(orderedItems).includes(book[orderingMethod])) {
        orderedItems[book[orderingMethod]].push(book)
      } else {
        orderedItems[book[orderingMethod]] = [book]
      }
    })

    return orderedItems
  }
}
