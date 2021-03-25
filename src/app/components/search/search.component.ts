import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';
import { Global } from '../../services/global';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [ArticleService]
})
export class SearchComponent implements OnInit {


  public articles: Article[];
  public url: string;
  public searchString: string;

  constructor(
    private _articleService: ArticleService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.url = Global.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      response => {

        this.searchString = response.search;

        this._articleService.search(this.searchString).subscribe(
          response => {
            if (response.articles) {
              this.articles = response.articles;
            }

          },
          error => {
            console.log(error);
          }
        );

      },
      error => {
        console.log('Error al recojer los parametros por la url', error);
      }
    );
  }

}
