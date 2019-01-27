import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { CoreModule } from '../core/core.module'

import { ImportComponent } from './import.component'

@NgModule({
  imports: [CommonModule, CoreModule],
  declarations: [ImportComponent],
  exports: [ImportComponent],
})
export class ImportModule {}
