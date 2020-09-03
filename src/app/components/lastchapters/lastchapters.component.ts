import { Component, OnInit, Input } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';
import { Global } from '../../services/global';

@Component({
  selector: 'app-lastchapters',
  templateUrl: './lastchapters.component.html',
  styleUrls: ['./lastchapters.component.css'],
  providers: [ArticleService]
})
export class LastchaptersComponent implements OnInit {

  @Input() home: boolean;

  public articles: Article[];
  public url: string;
  constructor(
    private _articleService: ArticleService
  ) {
    this.home = false;
    this.url = Global.url;
   }

  ngOnInit(): void {

    if (this.home == true) {
      this._articleService.getArticlesXpopulate().subscribe(
        response => {
          this.articles = response.articlesPopulate;

        },
        error => {
          console.log(error);

        });
    }else{
      this._articleService.getArticlesChapters().subscribe(
        response => {
          this.articles = response.articlesPopulate;
        },
        error => {
          console.log(error);
          
        }
      );
    }

    
  }

}
