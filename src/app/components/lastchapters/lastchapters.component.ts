import { Component, OnInit, Input } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';

@Component({
  selector: 'app-lastchapters',
  templateUrl: './lastchapters.component.html',
  styleUrls: ['./lastchapters.component.css'],
  providers: [ArticleService]
})
export class LastchaptersComponent implements OnInit {

  @Input() home: boolean;

  public articles: Article[];
  public articlesPromise: any;

  constructor(
    private _articleService: ArticleService
  ) {
    this.home = false;
  }

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles(){
    const cantidad = (!this.home) ? 20 : 10;

    this._articleService.getArticles(cantidad).subscribe(
      response => {
        this.articles = response.articulos;
      },
      error => {
        console.log(error);

      });
  }

}
