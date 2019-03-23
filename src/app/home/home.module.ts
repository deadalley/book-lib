import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { HomeComponent } from './home.component'
import { FooterComponent } from './footer/footer.component'
import { GetStartedComponent } from './get-started/get-started.component'
import { SignUpComponent } from './sign-up/sign-up.component'
import { SignInComponent } from './sign-in/sign-in.component'
import { HomeNavbarComponent } from './home-navbar/home-navbar.component'
import { HomeSectionComponent } from './home-section/home-section.component'
import { PopoverContainerComponent } from './popover-container/popover-container.component'
import { ClickOutsideDirective } from 'directives/click-outside.directive'

const homeRoutes: Routes = [{ path: '', component: HomeComponent }]

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    HomeComponent,
    FooterComponent,
    GetStartedComponent,
    SignUpComponent,
    SignInComponent,
    HomeNavbarComponent,
    HomeSectionComponent,
    PopoverContainerComponent,
    ClickOutsideDirective,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
