import { Pipe, PipeTransform } from '@angular/core'
import { Book } from 'models/book.model'

@Pipe({
  name: 'bookGrouping',
})
export class BookGroupingPipe implements PipeTransform {
  transform(books: Book[], groupingMethod?: any): any {
    if (!groupingMethod || groupingMethod === 'no grouping') {
      return {}
    }
    const orderedItems = {}

    if (groupingMethod === 'genre') {
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
      let order = book[groupingMethod]
      if (groupingMethod === 'rating') {
        order = `${book.rating || 0}`
      }
      if (groupingMethod === 'year') {
        order = `${book.year || 'Unknown year'}`
      }
      if (groupingMethod === 'title') {
        order = order[0].toLocaleUpperCase()
      }
      if (groupingMethod === 'date') {
        console.log(book.date)
        order = new Date(book.date).toLocaleDateString()
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
