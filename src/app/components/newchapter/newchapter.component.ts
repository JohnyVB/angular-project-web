import { Component, OnInit } from '@angular/core';
import { Chapter } from '../../models/chapter';
import { User } from '../../models/user';
import { ChapterService } from '../../services/chapter.service';
import { ArticleService } from '../../services/article.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newchapter',
  templateUrl: './newchapter.component.html',
  styleUrls: ['./newchapter.component.css'],
  providers: [ArticleService, ChapterService, UserService]
})
export class NewchapterComponent implements OnInit {

  public chapters: Chapter[];
  public chapterSave: any;
  public articleId: string;
  public articleTitle: string;
  public file: any;
  public user: User;
  public errorOn: boolean;


  constructor(
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _articleService: ArticleService,
    private _chapterService: ChapterService

  ) {
    this.chapters = [];
    this.articleTitle = '';
    this.errorOn = true;
    this.chapterSave = {
      number: null,
      title: ''
    };
  }

  ngOnInit(): void {
    this.getParams();
    this.getUserLogged();
  }

  getParams() {
    this._route.params.subscribe(
      response => {
        this.articleId = response.id;
        this.getChapters(response.id);
        this.getArticle(response.id);
      },
      error => {
        console.log(error);
      }
    );
  }

  getArticle(articleId: string) {
    this._articleService.getArticle(articleId).subscribe(
      response => {
        this.articleTitle = response.articulo.title;
      }
    );
  }

  getChapters(articleId: string, order: number = -1) {
    this._chapterService.getChaptersPorUnArticle(articleId, order).subscribe(
      response => {
        this.chapters = response.capitulo;   
      }
    );
  }

  getUserLogged() {
    this._userService.getUserLogged().subscribe(
      response => {
        if (response) {
          this.user = response.usuario;
        } else {
          console.warn('No hay usuario logeado');
        }
      },
      error => {
        console.error('Error al traer el usuario logeado');
      }
    );
  }

  getFile(files: FileList) {
    this.file = files.item(0);

    if (this.file.type !== 'application/pdf') {
      this.errorOn = true;
      Swal.fire(
        'Archivo no valido',
        'El archivo tiene que ser en formato PDF (.pdf)',
        'info'
      );
    } else {
      this.errorOn = false;
    }

  }

  saveChapter() {
    this._chapterService.saveChapter(this.chapterSave, this.articleId).subscribe(
      response => {
        this.saveFileChapter(response.capitulo._id);
      },
      error => {
        console.log(error);
      }
    );
  }

  saveFileChapter(chapterId: string) {
    this._chapterService.uploadFile(this.file, chapterId).subscribe(
      response => {
        this.getChapters(this.articleId);
      },
      error => {
        console.log(error);
        
      }
    );
  }

}
