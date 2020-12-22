import { Pipe, PipeTransform } from '@angular/core'
import { Book } from 'database/models/book.model'

@Pipe({
  name: 'page',
})
export class PagePipe implements PipeTransform {
  transform(books: Book[], page?: number, maxBooks?: number): any {
    if (!page || !maxBooks) {
      return books
    }

    return books.slice((page - 1) * maxBooks, page * maxBooks)
  }
}
