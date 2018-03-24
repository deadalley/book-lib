import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, Validators } from '@angular/forms'
import { BookButtonsComponent } from '../../core/book-buttons/book-buttons.component'
import { Book } from '../../../../interfaces/book'
import Languages from '../../../../utils/languages'
import { cleanFormValues } from '../../../../utils/helpers'

@Component({
  moduleId: module.id,
  selector: 'first-login',
  templateUrl: 'first-login.component.html',
  styleUrls: ['first-login.component.css']
})

export class FirstLoginComponent implements OnInit {
  form: FormGroup
  languages: string[]
  genres: string[]
  tags: string[]
  selectedLanguage: string
  book = { } as Book

  @ViewChild(BookButtonsComponent)
  buttonsComponent: BookButtonsComponent

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      original: '',
      author: ['', Validators.required],
      publisher: '',
      year: 0,
      pages: 0,
      notes: '',
      rating: 0
    })
  }

  ngOnInit() {
    this.languages = Languages
    this.genres = []
    this.selectedLanguage = 'Select a language'
  }

  getGenres(genres: Array<string>) {
    this.genres = genres
  }

  addBook(values) {
    const newValues = {
      id: 99,
      date: new Date().toISOString().substring(0, 10),
      ...cleanFormValues(values),
      ...this.buttonsComponent.getValues()
    }

    Object.assign(this.book, newValues)

    console.log('Adding book', this.book)
  }
}
