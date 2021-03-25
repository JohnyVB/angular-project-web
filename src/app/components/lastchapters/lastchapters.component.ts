import { Component, OnInit, Input } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { ChapterService } from '../../services/chapter.service'
import { Article } from '../../models/article';
import { Global } from '../../services/global';

@Component({
  selector: 'app-lastchapters',
  templateUrl: './lastchapters.component.html',
  styleUrls: ['./lastchapters.component.css'],
  providers: [ArticleService, ChapterService]
})
export class LastchaptersComponent implements OnInit {

  @Input() home: boolean;

  public articles: any[];
  public url: string;

  constructor(
    private _articleService: ArticleService,
    private _chapterService: ChapterService
  ) {
    this.home = false;
    this.url = Global.url;
  }

  ngOnInit(): void {

    this._articleService.getArticles(null).subscribe(
      response => {
        this.articles = response.articulos;
        console.log(this.articles);
        
      },
      error => {
        console.log(error);

      });
  }

}
