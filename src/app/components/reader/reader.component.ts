import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ChapterService } from '../../services/chapter.service';
import { UserService } from '../../services/user.service';
import { Chapter } from '../../models/chapter';
import { User } from '../../models/user';
import { Article } from '../../models/article';
import { Global } from '../../services/global';


@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css'],
  providers: [ChapterService, UserService, ArticleService]
})
export class ReaderComponent implements OnInit {

  public chapter: Chapter;
  public user: User;
  public autor: User;
  public article: Article
  public urlPDF: string;
  public url: any;
  public page: number;
  public cascade: boolean;
  public zoom: number;
  public chapterId: string;
  public nextDisabled: boolean;
  public preDisabled: boolean;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _chapterService: ChapterService,
    private _userService: UserService,
    private _articleService: ArticleService
  ) {
    this.zoom = 1;
    this.cascade = false;
    this.page = 1;
    this.urlPDF = null;
    this.url = Global.url;
    this.chapterId = '';
    this.nextDisabled = false;
    this.preDisabled = false;

    this.article = new Article('', '', '', null, '', '', [], '', []);
    this.chapter = new Chapter('', null, '', null, '');
    this.user = new User('', '', '', '', [], '', '', '', '', null, '', '');
    this.autor = new User('', '', '', '', [], '', '', '', '', null, '', '');

  }

  validatePrefe() {
    if (this.user.prefreader === 'cascada') {
      this.cascade = true;
    }
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      (params: Params) => {
        this.chapterId = params.id;
        this._chapterService.getChapter(params.id).subscribe(
          (response) => {
            this.chapter = response.chapter;
            this.urlPDF = this.url + 'get-imgpages/' + this.chapter.imgpage;

            this._articleService.getArticleXchapter(response.chapter._id).subscribe(
              (response) => {
                this.article = response.article;

                this._userService.getUserXArticle(response.article._id).subscribe(
                  (response) => {
                    this.autor = response.user;

                  },
                  (error) => {
                    console.log('No se encontro el usuario del libro');

                  }
                );
              },
              (error) => {
                console.log('No hay articulo');

              }
            );
          },
          (error) => {
            console.log('Error al traer el capitulo', error);

          }
        );

      },
      (error) => {
        console.log('Error al traer el id del capitulo', error);
      }

    );

    this._userService.getUserLogged().subscribe(
      (response) => {
        this.user = response['user'];
        this.validatePrefe();
      },
      (error) => {
        console.log('No hay usuario logeado');

      }
    );

  }

  nextPage() {
    this.page++;
  }

  previousPage() {
    this.page--;
  }

  plusZoom() {
    this.zoom = (this.zoom + 0.1);
    console.log(this.zoom);

  }

  minusZoom() {
    this.zoom = (this.zoom - 0.1);
    console.log(this.zoom);
  }

  setCascade() {
    this.cascade = !this.cascade;
  }

  returnArticle() {
    this._router.navigate(['/book/' + this.article._id])
  }

  getIndexChapter() {
    const indexChapter = this.article.chapter.findIndex((element: any) => element === this.chapterId);
    return indexChapter;
  }

  nextChapter() {
    const chapterNext = this.getIndexChapter() + 1;
    if (this.article.chapter[chapterNext] === undefined) {
      this.nextDisabled = true;
    }else{
      this.preDisabled = false;
      this._router.navigate(['/reader/' + this.article.chapter[chapterNext]]);
    }
  }

  preChapter() {
    const chapterPre = this.getIndexChapter() - 1;
    if (this.article.chapter[chapterPre] === undefined) {
      this.preDisabled = true;
    }else{
      this.nextDisabled = false;
      this._router.navigate(['/reader/' + this.article.chapter[chapterPre]]);
    }
  }

}
