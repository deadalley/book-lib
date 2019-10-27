import { Pipe, PipeTransform } from '@angular/core'
import { intersection } from 'lodash'
import { Book } from 'models/book.model'

@Pipe({
  name: 'bookFilter',
})
export class BookFilterPipe implements PipeTransform {
  transform(books: Book[], filterMethod: any, ...args): any {
    if (!filterMethod || filterMethod === 'no filter') {
      return books
    }

    if (filterMethod === 'tags') {
      const tags = args[0]
      if (!tags) {
        return books
      }
      if (!tags.length) {
        return books
      }
      return books.filter(book => !!intersection(book.tags, tags).length)
    }

    return books.filter(book => book[filterMethod])
  }
}
