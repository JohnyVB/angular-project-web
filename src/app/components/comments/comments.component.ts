import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';
import { Global } from '../../services/global';
import { User } from '../../models/user';
import { Comment } from '../../models/comment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  providers: [UserService, CommentService]
})
export class CommentsComponent implements OnInit, OnChanges {

  public userOn: boolean;
  public user: User;
  public articleId: string;
  public comment: Comment[];
  public url: string;
  public textComment: string;
  public imageDefault: string;

  @Input() reader: boolean;

  constructor(
    private _userService: UserService,
    private _commentService: CommentService,
    private _route: ActivatedRoute,
  ) {
    this.url = Global.url;
    this.userOn = false;
    this.comment = [];
    this.textComment = '';
    this.imageDefault = 'default-user.png';
    this.user = new User('', '', '', '', [], '', '', '', '', null, '', '');
  }

  ngOnChanges() {
    console.log("NgOnChanges");
  }

  getUserLogged(){
    this._userService.getUserLogged().subscribe(
      response => {
        if (!response) {
          this.userOn = false;
        } else {
          this.user = response['user'];
          this.userOn = true;
        }
      },
      error => {
        console.log(error);

      }
    );
  }

  getParams(){
    this._route.params.subscribe(
      response => {
        this.articleId = response.id;
      },
      error => {
        console.warn('No hay libro');
      }
    );
  }

  getComments(articleId: any, reader: any){
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
    console.log("NgOnInit");
    this.getUserLogged();
    this.getParams();
    this.getComments(this.articleId, this.reader);
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
          this.ngOnInit();
          this.textComment = '';
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
