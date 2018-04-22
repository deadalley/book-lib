import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HttpModule } from '@angular/http'
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireDatabaseModule } from 'angularfire2/database'

import { AppComponent } from './app.component'
import { AppRoutes } from './app.routing'

import { AuthService } from '../services/auth.service'
import { DatabaseService } from '../services/database.service'

export const firebaseConfig = {
  apiKey: 'AIzaSyCOJ1FNmdWadfNOCvh3Gu1fPBstpWt33Wc',
  authDomain: 'booklib-834b9.firebaseapp.com',
  databaseURL: 'https://booklib-834b9.firebaseio.com',
  projectId: 'booklib-834b9',
  storageBucket: 'booklib-834b9.appspot.com',
  messagingSenderId: '590001193511'
}

@NgModule({
  declarations: [
    AppComponent
  ],
  providers: [
    AuthService,
    DatabaseService
  ],
  imports: [
    RouterModule.forRoot(AppRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
