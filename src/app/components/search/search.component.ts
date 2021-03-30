import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Article } from '../../models/article';
import { SearchServise } from '../../services/search.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [SearchServise]
})
export class SearchComponent implements OnInit {


  public articles: Article[];
  public searchString: string;

  constructor(
    private _searchService: SearchServise,
    private _route: ActivatedRoute
  ) {
    this.articles = [];
  }

  ngOnInit(): void {
    this.getparams();
  }


  getparams(){
    this._route.params.subscribe(
      response => {
        this.searchString = response.search;
        this.getArticle(response.search);
      }
    );
  }

  getArticle(search: string){

    if (search) {
      this._searchService.search(search).subscribe(
        response => {
          this.articles = response.data;
        }
      );
    }else{
      Swal.fire(
        'No hay datos',
        'El campo de los datos para la busqueda es necesario',
        'info'
        );
    }

    
  }

}
