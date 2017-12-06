import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AuthService } from './auth.service';

import * as firebase from 'firebase/app';

export const firebaseConfig = {
  apiKey: "AIzaSyCOJ1FNmdWadfNOCvh3Gu1fPBstpWt33Wc",
  authDomain: "booklib-834b9.firebaseapp.com",
  databaseURL: "https://booklib-834b9.firebaseio.com",
  projectId: "booklib-834b9",
  storageBucket: "booklib-834b9.appspot.com",
  messagingSenderId: "590001193511"
};

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, AngularFireDatabaseModule, AngularFireAuthModule],
      providers: [AuthService, AngularFireAuth, ]
    });
  });

  it('should be created', inject([AuthService, AngularFireAuth], (service: AuthService, fire: AngularFireAuth) => {
    expect(service).toBeTruthy();
  }));

  it('should not execute', () => {

  })
});
