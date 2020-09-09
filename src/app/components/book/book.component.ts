import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Article } from '../../models/article';
import { User } from '../../models/user';
import { Chapter } from '../../models/chapter';
import { ArticleService } from '../../services/article.service';
import { UserService } from '../../services/user.service';
import { ChapterService } from '../../services/chapter.service';
import { Global } from '../../services/global';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  providers: [ArticleService, UserService, ChapterService]
})
export class BookComponent implements OnInit {


  public article: Article;
  public user: User;
  public chapter: Chapter;
  public chapterId: any;
  public Id: string;
  public url: string;
  public articleSearch: Array<any>;
  public userXarticle: boolean;
  public file: any;
  public urlImage: any;
  public editOn: boolean;
  public errFileChapter: boolean;

  public listaTipo: string[] = ["Tipo 1", "Tipo 2", "Tipo 3"];
  public listaGeneros: string[] = ["Accion", "Aventura", "Ciencia ficcion", "Comedia", "Terror", "Drama", "Romance"];
  public listaEstado: string[] = ["Publicandose", "Abandonado", "Finalizado"];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _articleService: ArticleService,
    private _userService: UserService,
    private _chapterService: ChapterService
  ) {

    this.url = Global.url;
    this.userXarticle = false;
    this.urlImage = '';
    this.editOn = false;
    this.Id = '';
    this.errFileChapter = null;
    this.chapterId = '';

    this.article = new Article('','','','','','',[],'',[]);
    this.user = new User('', '', '', '', [], '', '', '', '', null, '', '');
    this.chapter = new Chapter('',null,'',null,'');

  }


  ngOnInit(): void {
    this._route.params.subscribe(
      response => {
        this.Id = response.id;
      },
      error => {
        console.log('Error al traer el id del articulo');
      }
    );
    
    this._articleService.getArticleService(this.Id).subscribe(
      response => {
        this.article = response.article;
      },
      error => {
        console.log('Error al traer el articulo');
      }
    );

    this._userService.getUserXArticle(this.Id).subscribe(
      response => {
        this.user = response.user;
        this.getUserLogged();
      },
      error => {
        console.log('Error al traer el usuario');
      }
    );    
  }

  getUserLogged(){
    
    this._userService.getUserLogged().subscribe(
      response => {

       let result = response['user'].article.find((_element: any) => _element === this.article._id );
       if (result) {
         this.userXarticle = true;
       }
       
                
      },
      error => {
        console.log('Error al traer el usuario para verificar autor libro', error);
        
      }
    );

  }

  getFile(files: FileList){
    this.file = files.item(0);    
  }

  validatePDF(){
    console.log(this.file.type);

    if (this.file.type !="application/pdf") {
      this.errFileChapter = true;
    }else{
      this.errFileChapter = false;
    }
    
  }

  idChapter(id: any){
    this.chapterId = id;
    this._chapterService.getChapter(id).subscribe(
      response => {
        this.chapter = response.chapter;
      },
      error => {
        console.log('Error al traer el capitulo', error);
        
      }
    );
  }

  validateNumber(){
   
  }

  edit(){
     
    this._chapterService.updateChapter(this.chapterId, this.chapter).subscribe(
      response => {
        console.log('El capitulo se ha actualizado correctamente!!',response);
        if (this.file) {
          this._chapterService.uploadPDF(this.file, this.chapterId).subscribe(
            response => {
              this.ngOnInit();
              console.log('Archivo pdf actualizado con exito', response);
              
            },
            error => {
              console.log('No se ha podido actualizar el archivo pdf');
              
            }
          );
        }
        
      },
      error => {
        console.log('Error al actualizar el capitulo');

      }
    );
    let close2 = document.getElementById('close2') as any;
    close2.click();
  }

  showImage(){
    if (this.file) {
        let reader = new FileReader();

        reader.onload = (e:any)=>{
          this.urlImage = e.target.result;
        }

        reader.readAsDataURL(this.file);
    }
  }

  onSubmit(){
    this._articleService.updateArticle(this.Id, this.article).subscribe(
      response => {
        console.log(response);
        this._articleService.uploadImage(this.file, response.articleUpdated._id).subscribe(
          response => {
            console.log('la imagen del articulo se ha actualizado correctamente');
          },
          error => {
            console.log('Error al actualizar imagen del articulo');
            
          }
        );
        //this.updateImageArticle(response.articleUpdated._id);
        console.log('Se ha actualizado el libro correctamente!!');
        
        this.ngOnInit();
      },
      error => {
        console.log('Error al actualizar el articulo', error);
      }
    );

    this.ngOnInit();
    var modal = document.getElementById('close') as any;
    modal.click();
  }


}
