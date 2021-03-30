import { Component, OnInit, Input } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { ChapterService } from '../../services/chapter.service'
import { Article } from '../../models/article';

@Component({
  selector: 'app-lastchapters',
  templateUrl: './lastchapters.component.html',
  styleUrls: ['./lastchapters.component.css'],
  providers: [ArticleService, ChapterService]
})
export class LastchaptersComponent implements OnInit {

  @Input() home: boolean;

  public articles: Article[];

  constructor(
    private _articleService: ArticleService,
    private _chapterService: ChapterService
  ) {
    this.home = false;
  }

  ngOnInit(): void {
    this.getChapters();
    this.getArticles();
  }

  getArticles(){
    const cantidad = (!this.home) ? 20 : 10;

    this._articleService.getArticles(cantidad).subscribe(
      response => {
        this.articles = response.articulos;
        console.log(this.articles);

      },
      error => {
        console.log(error);

      });
  }

  getChapters(){
    const cantidad = (!this.home) ? 20 : 10;
    this._chapterService.getChapters(cantidad).subscribe(
      response => {
        console.log(response.capitulo);
        
      }
    );
  }

}
