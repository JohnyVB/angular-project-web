import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Chapter } from '../../models/chapter';
import { ArticleService } from '../../services/article.service';
import { ChapterService } from '../../services/chapter.service';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert';


@Component({
  selector: 'app-newchapter',
  templateUrl: './newchapter.component.html',
  styleUrls: ['./newchapter.component.css'],
  providers: [ArticleService, ChapterService]
})
export class NewchapterComponent implements OnInit {

  public chapter: Chapter[];
  public chapterView: Chapter;
  public errorExtend: boolean;
  public articleId: string;
  public file: any;
  public btnDisabled: boolean;

  public _imgpageIsEmpty: boolean;
  public _titleIsEmpty: boolean;
  public _numcapIsEmpty: boolean;

  public titleBook: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _articleService: ArticleService,
    private _chapterService: ChapterService
  ) {

    this._imgpageIsEmpty = false;
    this._titleIsEmpty = false;
    this._numcapIsEmpty = false;
    this.articleId = '';
    this.btnDisabled = true;

    this.errorExtend = null;

    this.chapter = [{
      _id: '',
      numcap: null,
      titlecap: '',
      datechapter: '',
      imgpage: ''
    }];

    this.chapterView = new Chapter('',null,'',null,'');
  }

  ngOnInit(): void {
    this.getParams();
    this.getArticleXPopulate();
  }

  //----------------------------Enviar formulario------------------------------------------------------------------
  onSubmit(newChapterForm: NgForm){
    this._chapterService.saveChapter(this.chapterView, this.articleId).subscribe(
      response => {        
        this.uploadPDF(response.chapter._id);
        swal(
          'Se ha creado un nuevo capitulo!!',
          'Capitulo creado correctamente',
          'success'
        );

        newChapterForm.resetForm();
        this.ngOnInit();
      },
      error => {
        console.log('Error al guardar el capitulo', error);
        
      }
    );
  }

  getFile(files: FileList){
    this.file = files.item(0);
  }

  uploadPDF(chapterId: any){
    this._chapterService.uploadPDF(this.file, chapterId).subscribe(
      response => {
        console.log('El PDF se guardo con exito!!!');
        
      },
      error => {
        console.log('Error al guardar el PDF...', error);
        
      }
    );
  }

  //----------------------------Recojer el id del libro-------------------------------------------------------------
  getParams() {
    this._route.params.subscribe(
      response => {
        this.articleId = response.id;
      },
      error => {
        console.log(error);
      }
    );
  }

  //----------------------------Mostrar los libros con el campo chapter poblado------------------------------------
  getArticleXPopulate() {
    this._articleService.getArticleService(this.articleId).subscribe(
      response => {

        this.titleBook = response.article.title;
        this.chapter = response.article.chapter;
      
      },
      error => {
        console.log(error);

      }
    );
  }

  //----------------------------Validar extencion del archivo a subir------------------------------------------------
  validarExtens() {

    if (this.chapterView.imgpage != '') {
      let extend = this.chapterView.imgpage.split('.')[1];
      if (extend === 'pdf') {
        this.errorExtend = false;
      } else {
        this.errorExtend = true;
      }
    }else{
      this._imgpageIsEmpty = true;
    }

  }

  //----------------------------Validacion de campos vacios--------------------------------------------------------------
  imgpageIsEmpty() {
    if (this.chapterView.imgpage == '' || this.chapterView.imgpage == null || this.chapterView.imgpage == undefined) {
      this._imgpageIsEmpty = true;
      this.btnDisabled = true;
    }else{
      this._imgpageIsEmpty = false;
      this.btnDisabled = false;
    }
  }

  numcapIsEmpty(){
    if (this.chapterView.numcap == null || this.chapterView.numcap == undefined) {
      this._numcapIsEmpty = true;
      this.btnDisabled = true;
    } else {
      this._numcapIsEmpty = false;
      this.btnDisabled = false;
    }
  }

  titleIsEmpty() {
    if (this.chapterView.titlecap == '' || this.chapterView.titlecap == null || this.chapterView.titlecap == undefined) {
      this._titleIsEmpty = true;
      this.btnDisabled = true;
    } else {
      this._titleIsEmpty = false;
      this.btnDisabled = false;
    }
  }

}
