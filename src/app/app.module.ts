import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TypeAheadComponent } from './components/typeahead/typeahead.component';
import { TypeAheadService } from './typeahead.service';

@NgModule({
  declarations: [
    AppComponent,
    TypeAheadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule
  ],
  providers: [
    TypeAheadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
