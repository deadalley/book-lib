import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { HomeComponent } from './home/home.component';

import { GoodreadsService } from './services/goodreads.service';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';
import { AuthGuard } from './services/auth.guard';

export const firebaseConfig = {
  apiKey: "AIzaSyCOJ1FNmdWadfNOCvh3Gu1fPBstpWt33Wc",
  authDomain: "booklib-834b9.firebaseapp.com",
  databaseURL: "https://booklib-834b9.firebaseio.com",
  projectId: "booklib-834b9",
  storageBucket: "booklib-834b9.appspot.com",
  messagingSenderId: "590001193511"
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
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
  providers: [
    GoodreadsService,
    AuthService,
    FirebaseService,
    AuthGuard
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
