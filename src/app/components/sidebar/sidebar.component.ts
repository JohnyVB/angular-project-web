import { Component, OnInit, Input } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [ArticleService, UserService]
})
export class SidebarComponent implements OnInit {

  @Input() chapterOff: boolean;

  public userId: string;

  constructor(
    private _articleService: ArticleService,
    private _userService: UserService,
    private _router: Router
  ) {
    this.chapterOff = false;
    this.userId = '';
   }

  ngOnInit(): void {
  }

  sendIdUser(){
    const token = this._userService.getToken();
    if (token) {
      this._userService.getUserAdmin(token).subscribe(
        response => {
          this.userId = response.user._id;
          this._router.navigate(['/newbook/' + this.userId]);
        },
        error => {
          console.log('Error al buscar usuario por token', error);
          
        }
      );
    }else{
      console.log('No hay usuario logeado!!!');
      
    }
    
  }

}
