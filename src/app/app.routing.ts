import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, Route } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { BooksComponent } from './components/books/books.component';
import { ChaptersComponent } from './components/chapters/chapters.component';
import { BookComponent } from './components/book/book.component';
import { DeveloperComponent } from './components/developer/developer.component';
import { NewbookComponent } from './components/newbook/newbook.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReaderComponent } from './components/reader/reader.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { ErrorComponent } from './components/error/error.component';
import { NewchapterComponent } from './components/newchapter/newchapter.component';
import { SearchComponent } from './components/search/search.component';


const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'library', component: BooksComponent },
    { path: 'chapters', component: ChaptersComponent },
    { path: 'book/:id', component: BookComponent },
    { path: 'search/:search', component: SearchComponent},
    { path: 'developer', component: DeveloperComponent },
    { path: 'newbook', component: NewbookComponent },
    { path: 'newchapter/:id', component: NewchapterComponent},
    { path: 'profile/:id', component: ProfileComponent },
    { path: 'reader/:id', component: ReaderComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'users', component: UsersComponent },
    { path: 'error', component: ErrorComponent},
    { path: '**', component: ErrorComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<Route> = RouterModule.forRoot(appRoutes);