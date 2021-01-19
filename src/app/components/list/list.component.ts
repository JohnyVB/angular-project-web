import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ListService } from '../../services/list.service';
import { List } from '../../models/list';
import { Global } from '../../services/global';
import Swal from "sweetalert2";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [ListService]
})
export class ListComponent implements OnInit {

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
    this.newNameList = '';
    this.listIdupdate = '';
    this.nameListModal = '';
  }

  ngOnInit(): void {
    this.getUserId();
    this.getList();
  }

  getUserId(){
    this._route.params.subscribe(params => {
      this.userid = params.id;
    });
  }

  getList(){
    this._listService.getList(this.userid).subscribe(
      response => {
        if (response) {
          this.list = response.user.list;          
        }else{
          console.warn('No hay listas');
        }
      },
      error => {
        console.warn('Error al traer la lista');
        
      }
    );
  }

  editList(){

    if (this.newNameList === '' || !this.newNameList) {
      Swal.fire(
        'Campo vacio',
        'Por favor ingrese un nuevo nombre a la lista',
        'error'
      );
    }else{

      let update = {
        name: this.newNameList
      }

      this._listService.editList(this.listIdupdate, update).subscribe(
        response => {
          if (response) {
            this.nameListModal = response.listUpdated.name;
            this.newNameList = '';
            this.getList();
          }
        },
        error => {
          console.warn('Error en la edición de la lista');
          
        }
      );
    }
  }

  editOn(listid:string, namelist:string){
    this.listIdupdate = listid;
    this.nameListModal = namelist;
  }

  deleteList(listid:string){

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
                this.getList();
              }
            },
            error => {
              console.warn('Error al eliminar la lista');
              
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

  quitBook(articleid:string){

    console.log(articleid);
    
    this._listService.deleteBookList(articleid).subscribe(
      response => {
        console.log(response);
        
        this.getList();
      },
      error => {
        console.warn('Error al quitar el libro de la lista');
        console.log(error);
        
        
      }
    );
  }

}
