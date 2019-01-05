import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { LibraryService } from 'services/library.service'
import { upperCaseFirstLetter } from 'utils/helpers'
import * as XLSX from 'xlsx'
import { Book } from 'interfaces/book'
import { LANGUAGES } from 'utils/constants'

type AOA = any[][]

@Component({
  moduleId: module.id,
  selector: 'library-navbar',
  templateUrl: 'library-navbar.component.html',
  styleUrls: ['library-navbar.component.css']
})

export class LibraryNavbarComponent implements OnInit, OnDestroy {
  subscriptions = []
  tilesDisplay = true
  tagsDisplay = false
  selectedOrdering: string
  @ViewChild('fileUpload') fileUpload
  bookOrderings = [
    'No grouping',
    'Author',
    'Date',
    'Genre',
    'Rating',
    'Title',
    'Year'
  ]

  collectionOrderings = [
    'No grouping',
    'Size',
    'Title'
  ]

  get localUrlPath(): string {
    const splitUrl = this.router.url.split('/')
    return splitUrl[splitUrl.length - 1].split('?')[0]
  }

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private libraryService: LibraryService
  ) {
    this.subscriptions.push(this.libraryService.tagsDisplay$.subscribe((tagsDisplay) => this.tagsDisplay = tagsDisplay))
    this.subscriptions.push(this.libraryService.tilesDisplay$.subscribe((tilesDisplay) => this.tilesDisplay = tilesDisplay))
    this.subscriptions.push(this.route.queryParams.subscribe((params) => {
      this.selectedOrdering = params['grouping'] ? upperCaseFirstLetter(params['grouping']) : 'No grouping'
    }))
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  toggleTilesDisplay() {
    this.libraryService.toggleTilesDisplay(!this.tilesDisplay)
  }

  toggleTagsDisplay() {
    this.libraryService.toggleTagsDisplay()
  }

  setOrdering(order: string) {
    if (order === 'No grouping') {
      this.router.navigate(['.'], { relativeTo: this.route })
      return
    }
    const queryParams: Params = { ...this.route.snapshot.queryParams, grouping: order.toLocaleLowerCase() }
    this.router.navigate([`./${this.localUrlPath}`], { relativeTo: this.route, queryParams })
  }

  uploadFile() {
    this.fileUpload.nativeElement.click()
  }

  readFile(event) {
    const reader = new FileReader()

    reader.onload = (e: any) => {
      const binaryString = e.target.result
      const workBook: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' })

      const workSheet: XLSX.WorkSheet = workBook.Sheets[workBook.SheetNames[0]]

      const file = (XLSX.utils.sheet_to_json(workSheet, { header: 1 })) as AOA
      this.parseFile(file)
    }

    reader.readAsBinaryString(event.target.files[0])
    return
  }

  parseFile(file: AOA) {
    console.log(file)

    const books = file.map((row) => ({
      ...(row[0] !== '-' ? { title: row[0] } : {}),
      ...(row[1] !== '-' ? { author: row[1] } : {}),
      original: row[2] !== '-' ? row[2] : '',
      publisher: row[3] !== '-' ? row[3] : '',
      pages: row[4] !== '-' ? row[4] : 0,
      year: row[5] !== '-' ? row[5] : 0,
      ...(LANGUAGES.includes(row[6]) ? { language: row[6] } : {}),
      rating: row[7] !== '-' ? row[7] : 0,
      owned: row[8].toLocaleLowerCase() === 'x',
      read: row[9].toLocaleLowerCase() === 'x',
      favorite: row[10].toLocaleLowerCase() === 'x',
      notes: row[11] !== '-' ? row[11] : '',
      image_large: row[12] !== '-' ? row[12] : '',
    } as Book)).filter((book) => !!book.title && !!book.author)

    this.libraryService.setBooksToImport = books
    this.router.navigate(['books/import'], { relativeTo: this.route, queryParams: { } })

    // include Date when parsing book for uploading
  }
}
