import { TestBed, inject } from '@angular/core/testing';
import { AngularFireModule, FirebaseApp } from 'angularfire2';
import { HttpModule } from '@angular/http';
import * as firebase from 'firebase';

import { FirebaseService } from './firebase.service';

export const firebaseConfig = {
  apiKey: "AIzaSyCOJ1FNmdWadfNOCvh3Gu1fPBstpWt33Wc",
  authDomain: "booklib-834b9.firebaseapp.com",
  databaseURL: "https://booklib-834b9.firebaseio.com",
  projectId: "booklib-834b9",
  storageBucket: "booklib-834b9.appspot.com",
  messagingSenderId: "590001193511"
};

describe('FirebaseService', () => {
  let app: firebase.app.App;
  let rootRef: firebase.database.Reference;
  let questionsRef: firebase.database.Reference;
  let listOfQuestionsRef: firebase.database.Reference;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseService],
      imports: [AngularFireModule.initializeApp(firebaseConfig), HttpModule]
    });
  });

  it('should be created', inject([FirebaseService, FirebaseApp], (service: FirebaseService, firebaseApp: firebase.app.App) => {
    app = firebaseApp;
    rootRef = app.database().ref();
    questionsRef = rootRef.child('questions');
    listOfQuestionsRef = rootRef.child('list-of-questions');
    expect(service).toBeTruthy();
  }));

  it('should return false ', () => {
    this.service = new FirebaseService()

    expect(this.service.hasBooks()).toBeFalsy()
  })
});
