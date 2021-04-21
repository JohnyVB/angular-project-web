import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.routing';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'angular2-moment';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LastbooksComponent } from './components/lastbooks/lastbooks.component';
import { LastchaptersComponent } from './components/lastchapters/lastchapters.component';
import { BookComponent } from './components/book/book.component';
import { HomeComponent } from './components/home/home.component';
import { NewbookComponent } from './components/newbook/newbook.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReaderComponent } from './components/reader/reader.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { DeveloperComponent } from './components/developer/developer.component';
import { ChaptersComponent } from './components/chapters/chapters.component';
import { BooksComponent } from './components/books/books.component';
import { ErrorComponent } from './components/error/error.component';
import { NewchapterComponent } from './components/newchapter/newchapter.component';
import { CookieService } from 'ngx-cookie-service';
import { SearchComponent } from './components/search/search.component';
import { CommentsComponent } from './components/comments/comments.component';
import { NotifyComponent } from './components/notify/notify.component';
import { ListComponent } from './components/list/list.component';
import { ListpageComponent } from './components/listpage/listpage.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LastbooksComponent,
    LastchaptersComponent,
    BookComponent,
    HomeComponent,
    NewbookComponent,
    ProfileComponent,
    ReaderComponent,
    RegisterComponent,
    UsersComponent,
    DeveloperComponent,
    ChaptersComponent,
    BooksComponent,
    ErrorComponent,
    NewchapterComponent,
    SearchComponent,
    CommentsComponent,
    NotifyComponent,
    ListComponent,
    ListpageComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    MomentModule,
    PdfViewerModule,
    RouterModule
  ],
  providers: [appRoutingProviders, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
