import { Component, OnInit } from '@angular/core'
import { ANIMATIONS, LANGUAGES } from 'utils/constants'

@Component({
  moduleId: module.id,
  selector: 'import-cmp',
  templateUrl: 'import.component.html',
  styleUrls: ['./import.component.css'],
  animations: [ANIMATIONS.CARD],
})
export class ImportComponent implements OnInit {
  languages = LANGUAGES
  displayTableInfo = false
  displayAttributesInfo = false
  ngOnInit() {}
}
