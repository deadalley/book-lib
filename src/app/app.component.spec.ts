import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutes } from './app.routing';

export const firebaseConfig = {
  apiKey: "AIzaSyCOJ1FNmdWadfNOCvh3Gu1fPBstpWt33Wc",
  authDomain: "booklib-834b9.firebaseapp.com",
  databaseURL: "https://booklib-834b9.firebaseio.com",
  projectId: "booklib-834b9",
  storageBucket: "booklib-834b9.appspot.com",
  messagingSenderId: "590001193511"
};

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(AppRoutes),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
