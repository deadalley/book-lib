import { TestBed, async } from '@angular/core/testing'

import { RouterTestingModule } from '@angular/router/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { GetStartedComponent } from './home/get-started/get-started.component'
import { FooterComponent } from './home/footer/footer.component'
import { SignUpComponent } from './home/sign-up/sign-up.component'
import { SignInComponent } from './home/sign-in/sign-in.component'
import { DebugButtonComponent } from './home/debug-button/debug-button.component'

import { AppRoutes } from './app.routing'

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeComponent,
        FooterComponent,
        GetStartedComponent,
        SignUpComponent,
        SignInComponent,
        DebugButtonComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes(AppRoutes),
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents()
  }))

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  }))
})
