import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../../services/list.service';
import { List } from '../../models/list';
import { Global } from '../../services/global';
import Swal from "sweetalert2";

@Component({
  selector: 'app-listpage',
  templateUrl: './listpage.component.html',
  styleUrls: ['./listpage.component.css'],
  providers: [ListService]
})
export class ListpageComponent implements OnInit {

  public userid: any;
  public url: string;
  public list: List[];
  public newNameList: string;
  public listIdupdate: string;
  public nameListModal: string;

  constructor(
    private _route: ActivatedRoute,
    private _listService: ListService
  ) {
    this.url = Global.url;
    this.newNameList = null;
    this.listIdupdate = '';
    this.nameListModal = '';
    this.list = [];
  }

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    this._route.params.subscribe(params => {
      this.userid = params.id;
      this.getLists(params.id);
    });
  }

  getLists(userId: string) {
    this._listService.getLists(userId).subscribe(
      response => {
        this.list = response.listas;
        console.log(this.list);
        
      },
      error => {
        console.warn('Error al traer la lista');

      }
    );
  }

  editList() {

    if (!this.newNameList) {
      Swal.fire(
        'Campo vacio',
        'Por favor ingrese un nuevo nombre a la lista',
        'error'
      );
    } else {

      this._listService.editList(this.listIdupdate, this.newNameList).subscribe(
        response => {
          if (response) {
            this.nameListModal = response.lista.name;
            this.newNameList = '';
            this.getLists(this.userid);
          }
        },
        error => {
          console.warn('Error en la edición de la lista');

        }
      );
    }
  }

  editOn(listid: string, namelist: string) {
    this.listIdupdate = listid;
    this.nameListModal = namelist;
  }

  deleteList(listid: string) {

    Swal.fire({
      title: '¿Esta seguro de eliminar la lista?',
      text: "Una vez eliminado no se podra recuperar!",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Eliminar`,
      denyButtonText: `Cancelar`,
    })
      .then((result) => {
        if (result.isConfirmed) {

          this._listService.deleteList(listid).subscribe(
            response => {
              if (response) {
                this.getLists(this.userid);
              }
            },
            error => {
              console.log(error);

            }
          );

          Swal.fire({
            text: "La lista se ha eliminado correctamente",
            icon: "success",
          });
        } else if (result.isDenied) {
          Swal.fire({
            title: "No se ha eliminado la lista",
            icon: 'info'
          });
        }
      });

  }

  quitBook(listId: string, articleId: string) {

    this._listService.deleteBookList(listId, articleId).subscribe(
      response => {
        this.getLists(this.userid);
      },
      error => {
        console.warn('Error al quitar el libro de la lista');
        console.log(error);
      }
    );
  }

}
