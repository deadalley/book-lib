import { Pipe, PipeTransform } from '@angular/core'
import { Book } from 'models/book.model'

@Pipe({
  name: 'bookOrdering',
})
export class BookOrderPipe implements PipeTransform {
  transform(books: Book[], orderingMethod?: any): any {
    if (!orderingMethod || orderingMethod === 'no grouping') {
      return {}
    }
    const orderedItems = {}

    if (orderingMethod === 'genre') {
      books.forEach(book => {
        if (!book.genres) {
          book.genres = ['No genre']
        }
        book.genres.forEach(genre => {
          if (Object.keys(orderedItems).includes(genre)) {
            orderedItems[genre].push(book)
          } else {
            orderedItems[genre] = [book]
          }
        })
      })
      return orderedItems
    }

    books.forEach(book => {
      if (orderingMethod === 'date') {
        book.date = new Date(book.date).toLocaleDateString()
      }

      let order = book[orderingMethod]
      if (orderingMethod === 'rating') {
        order = `${book.rating || 0}`
      }
      if (orderingMethod === 'year') {
        order = `${book.year || 'Unknown year'}`
      }
      if (orderingMethod === 'title') {
        order = order[0].toLocaleUpperCase()
      }

      if (Object.keys(orderedItems).includes(order)) {
        orderedItems[order].push(book)
      } else {
        orderedItems[order] = [book]
      }
    })

    return orderedItems
  }
}
