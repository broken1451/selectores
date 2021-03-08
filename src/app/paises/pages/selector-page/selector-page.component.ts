import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisSmall, Pais } from '../../interfaces/paises.interfaces';
import { PaisesService } from '../../services/paises.service';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.scss']
})
export class SelectorPageComponent implements OnInit {

  public form: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    frontera: ['', [Validators.required]],
  });

  // llenar selectores
  public regions: string[] = [];
  public paises: PaisSmall[] = [];
  // public fronteras: string[] = [];
  public fronteras: PaisSmall[] = [];

  // Ui
  public cargando: boolean = false
  public noBorders: boolean = false

  constructor(private fb: FormBuilder, private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regions = this.paisesService.regiones;
    // this.form.get('region')?.valueChanges.subscribe(region=>{
      //   this.paisesService.getPaisesByRegions(region).subscribe(paises => {
        //     this.paises = paises;
        //   })
        // })
        
    // cuando cambie la region
    this.form.get('region')?.valueChanges.pipe(
      tap(()=>{
        this.form.get('pais')?.reset('')
        this.cargando = true;
        // this.form.get('frontera')?.disable()
      }),
      switchMap((region) => {
        return this.getPaisesByRegion(region)
      })
    ).subscribe((paises) => {
      this.paises = paises;
      this.cargando = false;
    })


    // cuando cambia pais
    this.form.get('pais')?.valueChanges.pipe(
      tap(()=>{
        this.form.get('frontera')?.reset('')
        this.fronteras = []
        this.cargando = true;
        // this.form.get('frontera')?.enable()
      }),
      switchMap((codigo) => {
        return this.getPaisesByCode(codigo)
      }),
      tap((pais) => {
        console.log('TAP =====> ', pais)
        if (pais?.borders.length === 0) {
          this.cargando = false;
          this.noBorders = true;
          this.form.get('frontera')?.setErrors(null);
         
        }
      }),
      switchMap((pais) => {
        return this.getPaisesByCodes(pais?.borders!)
      })
    ).subscribe((paisF) => {
      console.log({paisF})
      // this.fronteras = paisF?.borders || [];
      this.fronteras = paisF || [];
      this.cargando = false;
    })
  }

  guardar(){
    console.log(this.form.value)
  }

  getPaisesByRegion(region: string): Observable<PaisSmall[]>{
    return  this.paisesService.getPaisesByRegions(region);
  }

  getPaisesByCode(code: string): Observable<Pais | null>{
    return  this.paisesService.getPaisesByCode(code);
  }

  getPaisesByCodes(borders: string[]): Observable<PaisSmall[]>{
    return this.paisesService.getPaisesPorCodigos(borders);
  }

}
