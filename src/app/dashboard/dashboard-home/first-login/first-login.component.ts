import { Component, OnInit } from '@angular/core'
import { FormControl , FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Book } from '../../../../interfaces/book'
import Languages from '../../../../utils/languages'

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

    this.book.owned = false
    this.book.read = false
    this.book.favorite = false
  }

  getGenres(genres: Array<string>) {
    this.genres = genres
  }
}
