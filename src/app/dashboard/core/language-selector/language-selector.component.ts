import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { LANGUAGES } from 'utils/constants'
import { BehaviorSubject } from 'rxjs'
import { map, debounceTime } from 'rxjs/operators'
import { upperCaseFirstLetter } from 'utils/helpers'

@Component({
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
})
export class LanguageSelectorComponent implements OnInit {
  languages = LANGUAGES
  @Input() selectedLanguage
  @Output() select = new EventEmitter<string>()

  @ViewChild('languageList') languageList
  @ViewChildren('languages') languagesRef

  languageInputBuffer = ''
  languageInput = new BehaviorSubject<string>(this.languageInputBuffer)
  languageInput$ = this.languageInput.asObservable()

  ngOnInit() {
    this.languageInput$
      .pipe(
        debounceTime(300),
        map(input => upperCaseFirstLetter(input))
      )
      .subscribe(input => {
        this.findLanguage(input)
        this.languageInputBuffer = ''
      })
  }

  onKeyUp(event) {
    this.languageInput.next(
      (this.languageInputBuffer = this.languageInputBuffer.concat(event.key))
    )
  }

  findLanguage(input: string) {
    const index = this.languages.findIndex(language =>
      language.startsWith(input)
    )

    if (index === -1) {
      return
    }

    const element = this.languagesRef.toArray()[index].nativeElement
    this.languageList.nativeElement.scrollTop = element.offsetTop
  }
}
