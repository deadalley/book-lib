import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
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

  ngOnInit() { }
}
