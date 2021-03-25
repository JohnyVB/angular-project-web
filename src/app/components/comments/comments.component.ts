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
  providers: [CommentService, UserService]
})
export class CommentsComponent implements OnInit {

  public userOn: boolean;
  public articleId: string;
  public comments: Comment[];
  public url: string;
  public textComment: string;


  @Input() reader: boolean;

  constructor(
    private _commentService: CommentService,
    private _userService: UserService,
    private _route: ActivatedRoute
  ) {
    this.url = Global.url;
    this.userOn = false;
    this.textComment = '';
  }

  ngOnInit(): void {
    this.getParams();
    this.getUserLogged();
  }

  getParams(){
    this._route.params.subscribe(
      response => {
        this.articleId = response.id;
        this.getComments();
      },
      error => {
        console.warn('No hay libro');
      }
    );
  }

  getComments(order: any = -1) {
    this._commentService.getComments(this.articleId, order).subscribe(
      response => {
        this.comments = response.comentarios;
      },
      error => {
        console.warn('No hay comentarios...');
      }
    );
  }

  getUserLogged(){
    this._userService.getUserLogged().subscribe(
      response => {
        this.userOn = true;
      }
    )
  }

  saveComment() {

    if (!this.textComment) {
      Swal.fire(
        'Comentario vacio',
        'Por favor ingrese su comentario....',
        'error'
      );
    } else {
      this._commentService.saveComment(this.articleId, this.textComment, 'article').subscribe(
        response => {
          this.textComment = '';
          this.getComments();
        },
        error => {
          console.log(error);
          
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
