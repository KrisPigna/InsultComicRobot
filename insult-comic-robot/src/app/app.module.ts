import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ResultComponent } from './result/result.component';

const appRoutes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'result', component: ResultComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ImageUploadComponent,
    HomepageComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes
    ),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
