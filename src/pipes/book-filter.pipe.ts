import { Pipe, PipeTransform } from '@angular/core'
import { intersection } from 'lodash'
import { Book } from 'models/book.model'

@Pipe({
  name: 'bookFilter',
})
export class BookFilterPipe implements PipeTransform {
  transform(books: Book[], filterMethod?: any, tags?: object[]): any {
    if (!filterMethod || filterMethod === 'no filter') {
      return books
    }

    if (filterMethod === 'tags') {
      if (!tags.length) {
        return books.filter(book => !book.tags || !book.tags.length)
      }
      return books.filter(book => !!intersection(book.tags, tags).length)
    }

    return books.filter(book => book[filterMethod])
  }
}
