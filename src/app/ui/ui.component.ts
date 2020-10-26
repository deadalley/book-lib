import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.css'],
})
export class UiComponent implements OnInit {
  @Input() dark: boolean

  ngOnInit() {}
}
