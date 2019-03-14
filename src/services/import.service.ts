import { Injectable } from '@angular/core'
import * as XLSX from 'xlsx'
import { LANGUAGES } from 'utils/constants'
import { upperCaseFirstLetter } from 'utils/helpers'
import { Book } from 'database/models/book.model'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

type AOA = any[][]

@Injectable()
export class ImportService {
  private booksToImport = new BehaviorSubject<Book[]>([])

  booksToImport$ = this.booksToImport.asObservable()

  readFile(uploadedFile) {
    const reader = new FileReader()

    reader.onload = (e: any) => {
      const binaryString = e.target.result
      const workBook: XLSX.WorkBook = XLSX.read(binaryString, {
        type: 'binary',
      })

      const workSheet: XLSX.WorkSheet = workBook.Sheets[workBook.SheetNames[0]]

      const file = XLSX.utils.sheet_to_json(workSheet, { header: 1 }) as AOA
      this.booksToImport.next(this.parseFile(file))
    }

    reader.readAsBinaryString(uploadedFile)
    return this.booksToImport$
  }

  parseFile(file: AOA) {
    return file
      .map(row => ({
        title: row[0],
        author: row[1],
        original: row[2],
        publisher: row[3],
        date: new Date().toISOString(),
        ...(row[4] ? { pages: +row[4] } : {}),
        ...(row[5] ? { year: +row[5] } : {}),
        ...(row[6] && LANGUAGES.includes(upperCaseFirstLetter(row[6]))
          ? { language: row[6] }
          : {}),
        ...(row[7] ? { rating: +row[7] } : {}),
        owned: !!row[8] && row[8].toLocaleLowerCase() === 'x',
        wishlist: !!row[9] && row[9].toLocaleLowerCase() === 'x',
        read: !!row[10] && row[10].toLocaleLowerCase() === 'x',
        favorite: !!row[11] && row[11].toLocaleLowerCase() === 'x',
        ...(row[12] ? { imageLarge: row[12] } : {}),
      }))
      .filter(book => !!book.title && !!book.author) as Book[]
  }
}
