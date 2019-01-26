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

  ngOnInit() {}

  onKeyDown(event) {
    const key = event.key.toUpperCase()
    const index = this.languages.findIndex(language => language.startsWith(key))

    if (index === -1) {
      return
    }

    const element = this.languagesRef.toArray()[index].nativeElement
    this.languageList.nativeElement.scrollTop = element.offsetTop
  }
}
