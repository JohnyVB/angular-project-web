import { Component, OnInit, Input } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';
import { Global } from '../../services/global';

@Component({
  selector: 'app-lastbooks',
  templateUrl: './lastbooks.component.html',
  styleUrls: ['./lastbooks.component.css'],
  providers: [ArticleService]
})
export class LastbooksComponent implements OnInit {

  public articles: Article[];
  public url: string;

  @Input() home: boolean;

  constructor(
    private _articleService: ArticleService
  ) {
    this.url = Global.url;
    this.home = false;
  }

  ngOnInit(): void {


    this._articleService.getArticles('user').subscribe(
      response => {
        this.articles = response.articulos;
      },
      error => {
        console.log(error);
      }
    );



  }

}
