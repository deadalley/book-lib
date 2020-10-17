import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireStorageModule } from 'angularfire2/storage'
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading'

import { AppComponent } from './app.component'
import { AppRoutes } from './app.routing'

import { UiComponent } from './ui/ui.component'

import { AuthService } from '../services/auth.service'
import { AuthGuardService } from '../services/auth.guard'
import { DatabaseService } from '../services/database.service'
import { LibraryService } from '../services/library.service'
import { GoodreadsService } from '../services/goodreads.service'
import { SessionService } from '../services/session.service'
import { UiService } from '../services/ui.service'
import { ImportService } from 'services/import.service'
import { environment } from 'environments/environment'

@NgModule({
  declarations: [AppComponent, UiComponent],
  providers: [
    AuthService,
    AuthGuardService,
    DatabaseService,
    LibraryService,
    GoodreadsService,
    SessionService,
    UiService,
    ImportService,
  ],
  imports: [
    RouterModule.forRoot(AppRoutes),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.circleSwish,
      backdropBackgroundColour: 'rgba(100,0,0,0)',
      primaryColour: 'rgb(120, 216, 236)',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
    }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
