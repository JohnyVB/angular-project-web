import { Component, OnInit, Input } from '@angular/core';

import { ChapterService } from '../../services/chapter.service';
import { Chapter } from '../../models/chapter';

@Component({
  selector: 'app-listchapters',
  templateUrl: './listchapters.component.html',
  styleUrls: ['./listchapters.component.css'],
  providers: [ChapterService]
})
export class ListchaptersComponent implements OnInit {

  @Input() articleId: string;
  public chapters: Chapter[]
  public totalChapters: number;

  constructor(
    private _chapterService: ChapterService
  ) {
    this.chapters = [];
    this.totalChapters = 0;
   }

  ngOnInit(): void {
    this.getChapters();
  }

  getChapters( order: number = -1){

    this._chapterService.getChaptersPorUnArticle(this.articleId, order).subscribe(
      response => {
        console.log(response);
        this.chapters = response.capitulo;
        this.totalChapters = response.total;
        
      }
    );
  }

}
