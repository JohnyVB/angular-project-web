import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChapterService } from '../../services/chapter.service';
import { Chapter } from '../../models/chapter';
import { Global } from '../../services/global';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css'],
  providers: [ChapterService]
})
export class ReaderComponent implements OnInit {


  public chapter: Chapter;
  public url: any;
  public page: number;
  public zoom: number;
  public chapterId: string;
  public commentsOn: boolean;
  
  constructor(
    private _route: ActivatedRoute,
    private _chapterService: ChapterService,
  ) {
    this.zoom = 1.0;
    this.page = 1;
    this.url = Global.url;
    this.chapterId = '';
    this.commentsOn = false;

    this.chapter = new Chapter('', null, '', null, null, '', {}, {});

  }

  ngOnInit(): void {
    this.getparams();
  }

  getparams(){
    this._route.params.subscribe(
      response => {
        this.chapterId = response.id;
        this.getChapter(response.id);
      }
    );
  }

  getChapter(chapterId: string){
    this._chapterService.getChapter(chapterId).subscribe(
      response => {
        this.chapter = response.capitulo;
      }
    );
  }

  openComments(){
    this.commentsOn = !this.commentsOn;
  }

  setPlusZoom(){
    this.zoom += 0.1;

  }

  setMinusZoom(){
    this.zoom -= 0.1;
  }

  nextPague(){
    this.page += 1;
  }

  previusPague(){
    this.page -= 1;
  }

}
