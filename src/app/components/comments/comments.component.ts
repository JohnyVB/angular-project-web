import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';
import { NotifyService } from '../../services/notify.service';
import { ArticleService } from '../../services/article.service';
import { ListService } from '../../services/list.service';
import { Global } from '../../services/global';
import { User } from '../../models/user';
import { Comment } from '../../models/comment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  providers: [UserService, CommentService, NotifyService, ArticleService, ListService]
})
export class CommentsComponent implements OnInit {

  public userOn: boolean;
  public user: User;
  public articleId: string;
  public comment: Comment[];
  public url: string;
  public textComment: string;
  public imageDefault: string;
  public userArticle: User;
  public article: any;

  @Input() reader: boolean;

  constructor(
    private _userService: UserService,
    private _commentService: CommentService,
    private _notifyService: NotifyService,
    private _articleService: ArticleService,
    private _listService: ListService,
    private _route: ActivatedRoute
  ) {
    this.url = Global.url;
    this.userOn = false;
    this.comment = [];
    this.textComment = '';
    this.imageDefault = 'default-user.png';
    this.user = new User('', '', '', '', null, '', '', '', '', null, null, null, '', '');
    this.userArticle = new User('', '', '', '', null, '', '', '', '', null, null, null, '', '');
  }

  getUserLogged() {
    this._userService.getUserLogged().subscribe(
      response => {
        if (!response) {
          this.userOn = false;
        } else {
          this.user = response.user;
          this.userOn = true;
        }
      },
      error => {
        console.log(error);

      }
    );
  }

  getParams() {
    this._route.params.subscribe(
      response => {
        this.articleId = response.id;
      },
      error => {
        console.warn('No hay libro');
      }
    );
  }

  getComments(articleId: any, reader: any) {
    this._commentService.getComments(articleId, reader).subscribe(
      response => {
        this.comment = response.article.comments;
      },
      error => {
        console.warn('No hay comentarios...');
      }
    );
  }


  ngOnInit(): void {
    this.getUserLogged();
    this.getParams();
    this.getComments(this.articleId, this.reader);
    this.getArticle();
    this.getUser(this.articleId);
  }

  getArticle() {
    this._articleService.getArticleService(this.articleId, this.reader).subscribe(
      response => {
        this.article = response.article;
      },
      error => {
        console.log('Error al traer el articulo...');
      }
    );
  }

  getUser(articleid: any) {
    
    this._userService.getUserXArticle(articleid, this.reader).subscribe(
      response => {
        
        this.userArticle = response.user;
      },
      error => {
        console.log('Error al traer el usuario de este articulo...');
      }
    );
  }

  saveNotify(userid: any) {
  
    let params = {
      userid: this.user._id,
      username: this.user.name,
      articleid: this.article._id,
      articletitle: this.article.title,
      chapter: false,
      message: ' comentó el libro: '
    }

    if (this.reader) {
      params.articletitle = this.article.titlecap,
      params.message = ' comentó el capitulo: ',
      params.chapter = true
    }

    this._notifyService.sendEmail(this.userArticle.email, params).subscribe(
      response => {
        if (response) {
          console.log('El email se envió');
        }
      },
      error => {
        if (error) {
          console.log('Error al enviar el email');
        }
      }
    );

    this._notifyService.saveNotify(params, userid).subscribe(
      response => {

        let update = {
          push:{
            notify: response.notifyStored._id
          }
        }

        this._userService.updateUserParam(this.userArticle._id, update).subscribe(
          response => {
            console.log('user notify actualizado');
          },
          error => {
            console.log('Error al guardar el id de la notificacion en el usuario');
          }
        );
        console.log('Notificacion guardada');
      },
      error => {
        console.log('Error al crear la notificacion');
      }
    );
  }

  saveComment() {

    const comment = new Comment(null, this.textComment, this.user._id);
    if (!this.textComment) {
      Swal.fire(
        'Comentario vacio',
        'Por favor ingrese su comentario....',
        'error'
      );
    } else {
      this._commentService.saveComment(this.articleId, comment, this.reader).subscribe(
        response => {
          Swal.fire(
            'Comentario',
            'Se ha publicado el comentario correctamente!!',
            'success'
          );
          this.saveNotify(this.userArticle._id);
          this.textComment = '';
          this.ngOnInit();
        },
        error => {
          Swal.fire(
            'Comentario',
            'Ocurrio un error al publicar el comentario, por favor intente mas tarde',
            'error'
          );
        }
      );
    }

  }

}
