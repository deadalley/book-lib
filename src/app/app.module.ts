import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireDatabaseModule } from 'angularfire2/database'

import { AppComponent } from './app.component'
import { AppRoutes } from './app.routing'

import { AuthService } from '../services/auth.service'
import { AuthGuardService } from '../services/auth.guard'
import { DatabaseService } from '../services/database.service'
import { GoodreadsService } from '../services/goodreads.service'
import { environment } from 'environments/environment'

@NgModule({
  declarations: [
    AppComponent
  ],
  providers: [
    AuthService,
    AuthGuardService,
    DatabaseService,
    GoodreadsService
  ],
  imports: [
    RouterModule.forRoot(AppRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
