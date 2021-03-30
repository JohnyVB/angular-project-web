import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';
import { Global } from '../../services/global';
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
    this.getToken();
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

  getToken(){
    const token = this._userService.getToken();
    if (token) {
      this.getUserLogged();
    }
  }

  getComments(order: any = -1) {

    const coleccion = (this.reader) ? 'chapter' : 'article';

    this._commentService.getComments(this.articleId, order, coleccion).subscribe(
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

      const coleccion = (this.reader) ? 'chapter' : 'article';

      this._commentService.saveComment(this.articleId, this.textComment, coleccion).subscribe(
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
