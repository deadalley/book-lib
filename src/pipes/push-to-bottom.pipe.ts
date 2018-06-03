import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'pushToBottom'
})
export class PushToBottomPipe implements PipeTransform {
  transform(array: Array<any>, itemToPush?: string): any {
    if (!itemToPush) { return array }
    const position = array.findIndex((item) => item.key === itemToPush)
    const element = array.splice(position, 1)[0]
    array.push(element)
    return array
  }
}
