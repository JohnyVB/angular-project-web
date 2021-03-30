import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ChapterService } from '../../services/chapter.service';
import { UserService } from '../../services/user.service';
import { Chapter } from '../../models/chapter'

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.css'],
  providers: [ArticleService, ChapterService, UserService]
})
export class ChaptersComponent implements OnInit {

  public articleId: string;
  public userId: string;
  public chapters: Chapter[];
  public userProp: boolean;

  constructor(
    private _articleService: ArticleService,
    private _chapterService: ChapterService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { 
    this.chapters = [];
    this.userProp = false;
  }

  ngOnInit(): void {
    
    this.getParams();
    this.getToken();
  }

  getParams(){
    this._route.params.subscribe(
      response => {
        this.articleId = response.id;
        this.getArticle(response.id);
        this.getChapters(response.id);
      },
      error => {
        console.warn('No hay libro');
      }
    );
  }

  getToken(){
    const token = this._articleService.getToken();
    if (token) {
      this.getUserLogged();
    }
  }

  getChapters(articleId: string, order: number = -1){
    this._chapterService.getChaptersPorUnArticle(articleId, order).subscribe(
      response => {
        this.chapters =  response.capitulo;        
      },
      error => {
        console.log(error);
      }
    );
  }

  getUserLogged(){
    this._userService.getUserLogged().subscribe(
      response => {
        this.userId = response.usuario._id;        
      }
    );
  }

  getArticle(articleId: string){
    this._articleService.getArticle(articleId).subscribe(
      response => {
        const { _id: userid } = response.articulo.user;
        if (userid === this.userId) {
          this.userProp = true;
        }else{
          this.userProp = false;
        }
      }
    );
  }

}
