import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaService } from '@comun/services/alerta.service';
import { ResumenService } from '@modulos/profile/services/resumen.service';
import { Store } from '@ngrx/store';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { obtenerImagen } from '@redux/selectors/usuario-imagen.selectors';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {

  usuarioInformacion = {
    id: "",
    name: "",
    last_name: ""
  }
  srcResult: string = '';
  habilitarEdicionFormulario: boolean = false;
  formularioResumen: FormGroup;
  usuarioImagen$ = this.store.select(obtenerImagen);
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;


  constructor(
    private store: Store,
    private resumenService: ResumenService,
    private formBuilder: FormBuilder,
    private renderer2: Renderer2,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.consultarInformacion()
    this.initForm();
  }

  initForm() {
    this.formularioResumen = this.formBuilder.group({
      email: [
        this.usuarioInformacion.name,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
        ]),
      ],
      password: [
        this.usuarioInformacion.last_name,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
        ]),
      ],
    });
  }

   get formFields() {
    return this.formularioResumen.controls;
  }

  visualizarFormulario() {
    this.habilitarEdicionFormulario = !this.habilitarEdicionFormulario;
  }


  consultarInformacion (){
    this.store.select(obtenerId)
    .pipe(
      switchMap(([usuarioId]) => this.resumenService.perfil(usuarioId))
    )
    .subscribe({
      next: (respuesta: any) => {
        this.usuarioInformacion = {
          "id": respuesta.id,
          "name": respuesta.name,
          "last_name":respuesta.last_name
        }
      },
      error(err) {

      },
    })
  }

  archivoSeleccionado(event: any) {
    const inputNode: any = event.target;

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };

      reader.readAsDataURL(inputNode.files[0]);
    }
  }

  formSubmit() {
    if (this.formularioResumen.valid) {
      this.renderer2.setAttribute(
        this.btnGuardar.nativeElement,
        'disabled',
        'true'
      );
      this.renderer2.setProperty(
        this.btnGuardar.nativeElement,
        'innerHTML',
        'Procesando'
      );
      if (this.formularioResumen.value.lastName && this.formularioResumen.value.userName) {
        console.log("asd");

      }
    } else {
      this.formularioResumen.markAllAsTouched();
    }
  }
}