import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pais, PaisSmall } from '../interfaces/paises.interfaces';
import { combineLatest, Observable, of } from 'rxjs';

const URL = environment.url;

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private _regions: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regiones() {
    return [...this._regions];
  }

  constructor(private httoClient: HttpClient) {}

  getPaisesByRegions(region: string): Observable<PaisSmall[]> {
    return this.httoClient.get<PaisSmall[]>(
      `${URL}region/${region}?fields=alpha3Code;name`
    );
  }

  getPaisesByCode(code: string): Observable<Pais | null> {
    if (!code) {
      return of(null);
    }
    return this.httoClient.get<Pais | null>(`${URL}alpha/${code}`);
  }

  getPaisesByCodeSmall(code: string): Observable<PaisSmall> {
    // if (!code) {
    //   return of(null);
    // }
    return this.httoClient.get<PaisSmall>(
      `${URL}alpha/${code}?fields=alpha3Code;name`
    );
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]> {
    console.log({ borders });
    if (!borders) {
      console.log('acaaaaa')
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];
    borders.forEach((codigo) => {
      console.log('foreach ===>', { codigo });
      const peticion = this.getPaisesByCodeSmall(codigo);
      peticiones.push(peticion);
    });

    console.log({peticiones})
    // regresa un observable q contiene un arreglo con todo el producto de cada una de sus peticiones internas
    return combineLatest(peticiones);
  }
}
