import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

const firebaseConfig = {
  apiKey: "AIzaSyAbHy3MaEvffBFwep38g1dznbnf4xfuYiM",
  authDomain: "bellakabb-b8a58.firebaseapp.com",
  projectId: "bellakabb-b8a58",
  storageBucket: "bellakabb-b8a58.appspot.com",
  messagingSenderId: "1012841987067",
  appId: "1:1012841987067:web:a378a53f5224488950695e"
};
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    HttpClientModule,

  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
