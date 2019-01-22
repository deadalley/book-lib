import { Pipe, PipeTransform } from '@angular/core'
import { Book } from 'models/book.model'

@Pipe({
  name: 'bookFilter',
})
export class BookFilterPipe implements PipeTransform {
  transform(books: Book[], filterMethod?: any): any {
    if (!filterMethod || filterMethod === 'no filter') {
      return books
    }

    return books.filter(book => book[filterMethod])
  }
}
