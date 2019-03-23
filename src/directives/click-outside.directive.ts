import {
  Directive,
  Output,
  HostListener,
  ElementRef,
  EventEmitter,
} from '@angular/core'
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable'

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<MouseEvent>()

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement

    // Check if the click was outside the element
    if (
      targetElement &&
      !this.elementRef.nativeElement.contains(targetElement)
    ) {
      this.clickOutside.emit(event)
    }
  }
}
