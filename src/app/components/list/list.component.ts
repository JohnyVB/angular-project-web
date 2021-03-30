import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ListService } from '../../services/list.service';
import { UserService } from '../../services/user.service';
import { List } from '../../models/list';
import Swal from "sweetalert2";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [ListService, UserService]
})
export class ListComponent implements OnInit {

  public lists: List[];
  public userId: string;
  public nameList: string;
  public articleId: string;
  public listDisabled: boolean;
  public listName: string;


  constructor(
    private _listService: ListService,
    private _userService: UserService,
    private _route: ActivatedRoute
  ) {
    this.lists = [];
    this.userId = null;
    this.nameList = null;
    this.articleId = null;
    this.listDisabled = false;
  }

  async ngOnInit(): Promise<any> {
    await this.getParams();
    await this.getToken();
  }

  getParams() {
    this._route.params.subscribe(
      response => {
        this.articleId = response.id;
      }
    );
  }

  getToken() {
    const token = this._userService.getToken();

    if (token) {
      this.getUserLogged();
    }
  }

  getUserLogged() {
    this._userService.getUserLogged().subscribe(
      response => {
        this.userId = response.usuario._id;
        this.getLists(response.usuario._id);
      }
    );
  }

  getLists(userId: string) {
    this._listService.getLists(userId).subscribe(
      response => {
        this.lists = response.listas;
      }
    );
  }

  saveList() {
    if (!this.nameList) {
      Swal.fire(
        'Campo vacio',
        'Por favor ingrese un nombre a la lista',
        'error'
      );
    } else {
      const data = {
        name: this.nameList
      }
      this._listService.saveList(data).subscribe(
        response => {
          this.nameList = '';
          this.getLists(this.userId);
        }
      );
    }
  }


  addBookToList(listId: string) {
    this._listService.addBookToList(listId, this.articleId).subscribe(
      response => {
        if (response.lista) {
          this.listDisabled = true;
          this.listName = response.lista.name;
        }
      }
    )
  }





}
