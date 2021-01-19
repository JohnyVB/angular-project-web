import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../models/article';
import { Chapter } from '../../models/chapter';
import { User } from '../../models/user';
import { ArticleService } from '../../services/article.service';
import { ChapterService } from '../../services/chapter.service';
import { NotifyService } from '../../services/notify.service';
import { UserService } from '../../services/user.service';
import { ListService } from '../../services/list.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newchapter',
  templateUrl: './newchapter.component.html',
  styleUrls: ['./newchapter.component.css'],
  providers: [ArticleService, ChapterService, NotifyService, ListService, UserService]
})
export class NewchapterComponent implements OnInit {

  public chapter: Chapter[];
  public chapterView: Chapter;
  public errorExtend: boolean;
  public articleId: string;
  public file: any;
  public btnDisabled: boolean;
  public _imgpageIsEmpty: boolean;
  public parent: any;
  public evet: any;
  public errNum: any
  public titleBook: string;
  public user: User;
  public article: Article;

  constructor(
    private _route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private _articleService: ArticleService,
    private _chapterService: ChapterService,
    private _notifyService: NotifyService,
    private _userService: UserService,
    private _listService: ListService
  ) {
    this._imgpageIsEmpty = false;
    this.articleId = '';
    this.btnDisabled = null;
    this.errorExtend = null;
    this.chapter = [{
      _id: '',
      numcap: null,
      titlecap: '',
      comments: [],
      datechapter: '',
      imgpage: ''
    }];
    this.article = new Article('', '', '', null, '', '', null, '', null);
    this.chapterView = new Chapter('', null, '', [], null, '');
    this.user = new User('', '', '', '', null, '', '', '', '', null, null, null, '', '');
    this.errNum = null;
  }

  ngOnInit(): void {
    this.getParams();
    this.getArticleXPopulate();
    this.getUserLogged();
  }

  getUserLogged() {
    this._userService.getUserLogged().subscribe(
      response => {
        if (response) {
          this.user = response.user;
        } else {
          console.warn('No hay usuario logeado');

        }
      },
      error => {
        console.error('Error al traer el usuario logeado');

      }
    );
  }

  saveChapter() {
    if (this.chapterView.imgpage) {
      let extend = this.chapterView.imgpage.split('.')[1];
      if (extend === 'pdf') {
        this.errorExtend = false;
        this._chapterService.saveChapter(this.chapterView, this.articleId).subscribe(
          response => {

            this.uploadPDF(response.chapter._id);
            Swal.fire(
              'Se ha creado un nuevo capitulo!!',
              'Capitulo creado correctamente',
              'success'
            );
            this.file = '';
            this.chapterView.imgpage = '';
            this.chapterView.titlecap = '';
            this.chapterView.numcap = null;
            this.saveNotify();
            this.getArticleXPopulate();
          },
          error => {
            console.log('Error al guardar el capitulo', error);
          }
        );
      } else {
        this.errorExtend = true;
      }
    } else {
      this._imgpageIsEmpty = true;
    }
  }

  saveNotify() {
    this._listService.getListArticle(this.articleId).subscribe(
      response => {
        if (response.list) {

          const notify = {
            userid: this.user._id,
            username: this.user.name,
            articleid: this.article._id,
            articletitle: this.article.title,
            message: ' ha subido un nuevo capitulo en: ',
            chapter: true,
            alert: true
          }

          response.list.forEach((element: any) => {
            this._listService.updateUserList(element._id, notify).subscribe(
              response => {
                if (response) {
                  console.log(response);
                }
              },
              error => {
                console.warn('Error al crear y añadir la notificación');
                
              }
            );
          });
        } else {
          console.warn('No hay lista para este articulo...');

        }

      },
      error => {
        console.error('No se pudo traer las listas', error);

      }
    );
  }

  getFile(files: FileList) {
    this.file = files.item(0);
  }

  uploadPDF(chapterId: any) {
    this._chapterService.uploadPDF(this.file, chapterId).subscribe(
      response => {
        console.log('El PDF se guardo con exito!!!');
      },
      error => {
        console.log('Error al guardar el PDF...', error);
      }
    );
  }

  getParams() {
    this._route.params.subscribe(
      response => {
        this.articleId = response.id;
      },
      error => {
        console.log(error);
      }
    );
  }

  getArticleXPopulate() {
    this._articleService.getArticleService(this.articleId, false).subscribe(
      response => {
        this.titleBook = response.article.title;
        this.chapter = response.article.chapter;
        this.article = response.article;
      },
      error => {
        console.log(error);
      }
    );
  }

  validateEmpty() {
    if (this.chapterView.imgpage && this.chapterView.numcap && this.chapterView.titlecap && !this.errNum) {
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
  }

  validateNum() {
    const expresion = /^([0-9])*$/;
    if (this.chapterView.numcap) {
      const valor = this.chapterView.numcap;
      if (expresion.test(valor.toString())) {
        this.errNum = false;
      } else {
        this.errNum = true;
      }
    }
  }

}
