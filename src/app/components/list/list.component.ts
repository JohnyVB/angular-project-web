import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ListService } from '../../services/list.service';
import { List } from '../../models/list';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [ListService]
})
export class ListComponent implements OnInit {

  public userid: any;
  public list: any;
  //public list: List[];

  constructor(
    private _route: ActivatedRoute,
    private _listService: ListService
  ) { }

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
          this.list = response.list;
          console.log(this.list);
          
        }else{
          console.warn('No hay listas');
        }
      },
      error => {
        console.warn('Error al traer la lista');
        
      }
    );
  }

}
