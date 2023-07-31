import {
  Component,
  TemplateRef,
  ViewChild,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BaseFiltroFormularioComponent } from '../base-filtro-formulario/base-filtro-formulario.component';
import { General } from '@comun/clases/general';

@Component({
  selector: 'app-base-filtro',
  templateUrl: './base-filtro.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    BaseFiltroFormularioComponent,
  ],
})
export class BaseFiltroComponent implements OnInit {
  formularioItem: FormGroup;
  listaFiltros: any[] = [];
  filtrosAplicados: any[] = [{
    propiedad: '',
    criterio: ''
  }];
  @Input() propiedades: any[];
  @Output() emitirFiltros: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    if (localStorage.getItem(document.location.pathname)) {
      this.filtrosAplicados = JSON.parse(
        localStorage.getItem(document.location.pathname)!
      );
      this.filtrosAplicados.map((propiedad) => {
        this.filtros.push(this.crearControlFiltros(propiedad));
      });
    } else {

      this.filtros.push(this.crearControlFiltros(null));
    }
  }

  initForm() {
    this.formularioItem = this.formBuilder.group({
      filtros: this.formBuilder.array([]),
    });
  }

  get filtros() {
    return this.formularioItem.get('filtros') as FormArray;
  }

  private crearControlFiltros(propiedades: any | null) {
    let busqueda = '';
    let entre = '';
    if (propiedades) {
      busqueda = propiedades.busqueda;
      entre = propiedades.entre;
    }

    return this.formBuilder.group({
      propiedad: [''],
      criterio: [''],
      busqueda: [busqueda],
      entre: [entre],
    });
  }

  agregarFiltro() {
    this.filtros.push(
      this.formBuilder.group({
        propiedad: [''],
        criterio: [''],
        busqueda: [''],
        entre: [''],
      })
    );
  }

  eliminarFiltro(index: number) {
    if (this.filtros.length > 1) {
      this.filtros.removeAt(index);
    }
  }

  eliminarFiltroLista(index: string) {
    this.listaFiltros = this.listaFiltros.filter(
      (filtro: any) => filtro.id !== index
    );
  }

  agregar() {
    this.listaFiltros = this.formularioItem.value['filtros'].map(
      (filtro: any) => {
        return {
          id: crypto.randomUUID(),
          ...filtro,
        };
      }
    );
    localStorage.setItem(
      document.location.pathname,
      JSON.stringify(this.listaFiltros)
    );
    this.emitirFiltros.emit(this.formularioItem.value['filtros']);
  }

  actualizarPropiedad(propiedad: string, index: number) {
    const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
    filtroPorActualizar.patchValue({ propiedad });
    this.actualizarCriterio('', index);
  }

  actualizarCriterio(criterio: string, index: number) {
    const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
    filtroPorActualizar.patchValue({ criterio });
  }
}
