import { Pipe, PipeTransform } from '@angular/core'

const PARAGRAPH_SPLIT = '<br /><br />'

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(text: string, { length, paragraphs }): any {
    if (length) {
      return `${text.substr(0, length)}...`
    }

    if (paragraphs) {
      return text.split(PARAGRAPH_SPLIT).slice(0, paragraphs).join(PARAGRAPH_SPLIT)
    }
  }
}
