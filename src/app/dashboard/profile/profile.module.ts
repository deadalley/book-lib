import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Route } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ImageCropperModule } from 'ngx-image-cropper'

import { CoreModule } from '../core/core.module'

import { ProfileComponent } from './profile.component'
import { UserInfoComponent } from './user-info/user-info.component'
import { GoodreadsInfoComponent } from './goodreads-info/goodreads-info.component'
import { EditUserInfoComponent } from './edit-user-info/edit-user-info.component'
import { DeleteAccountComponent } from './delete-account/delete-account.component'

const routes: Route[] = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', component: UserInfoComponent },
      { path: 'edit', component: EditUserInfoComponent },
      {
        path: '',
        component: GoodreadsInfoComponent,
        outlet: 'goodreads',
        pathMatch: 'full',
      },
      {
        path: '',
        component: DeleteAccountComponent,
        outlet: 'delete',
        pathMatch: 'full',
      },
    ],
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    CoreModule,
  ],
  declarations: [
    ProfileComponent,
    UserInfoComponent,
    GoodreadsInfoComponent,
    EditUserInfoComponent,
    DeleteAccountComponent,
  ],
  exports: [ProfileComponent],
})
export class ProfileModule {}
