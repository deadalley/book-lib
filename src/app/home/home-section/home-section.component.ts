import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'home-section',
  templateUrl: './home-section.component.html',
  styleUrls: ['./home-section.component.css'],
})
export class HomeSectionComponent implements OnInit {
  @Input() sectionTitle: string

  ngOnInit() {}
}
