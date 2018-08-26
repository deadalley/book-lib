import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import Languages from 'utils/languages'

@Component({
  selector: 'language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css'],
})

export class LanguageSelectorComponent implements OnInit {
  languages = ['Languages', 'la', 'als']
  selectedLanguage = 'AAAA'

  ngOnInit() { }
}
