import { Component, ElementRef, OnInit, ViewChild,   Renderer2} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from '../../services/empresa.service';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresa-nuevo',
  templateUrl: './empresa-nuevo.component.html',
  styleUrls: ['./empresa-nuevo.component.scss'],
})
export class EmpresaNuevoComponent implements OnInit {
  formularioEmpresaNuevo: FormGroup;
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService,
    private renderer2: Renderer2,
    private router: Router
  ){}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formularioEmpresaNuevo = this.formBuilder.group({
      nombre: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
        ]),
      ],
      nit: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20)]),
      ],
      digitoVerificacion: [
        '',
        Validators.compose([Validators.required, Validators.minLength(1)]),
      ],

    });
  }

  // convenience getter for easy access to form fields
  get formFields() {
    return this.formularioEmpresaNuevo.controls;
  }

  formSubmit() {
    if (this.formularioEmpresaNuevo.valid) {
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
        this.empresaService.nuevo(this.formularioEmpresaNuevo.value, "1").subscribe({
          next:(respuesta)=>{
            this.renderer2.setAttribute(
              this.btnGuardar.nativeElement,
              'disabled',
              'true'
            );
            this.renderer2.setProperty(
              this.btnGuardar.nativeElement,
              'innerHTML',
              'Guardar'
            );
            this.router.navigate(['/auth/empresa'])
          },
          error: ({error})=>{
            this.renderer2.removeAttribute(this.btnGuardar.nativeElement, 'disabled');
            this.renderer2.setProperty(
              this.btnGuardar.nativeElement,
              'innerHTML',
              'Guardar'
            );
          // this.swalService.mensajeError(
          //   'Error consulta',
          //   `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          // );
          }
        })

      // this.stores.select(obtenerId)
      // .pipe(
      //   switchMap(([usuarioId])=>this.empresaService.nuevo(dataFormularioEmpresaNuevo, usuarioId))
      // )
      // .subscribe({
      //   next:(respuesta: any)=>{
      //     this.recargarlista.emit(true);
      //     this.swalService.mensajaSuccess(
      //         'Nueva empresa creada', ""
      //       );
      //       this.envioFormularioCompleto = true;
      //   },
      //   error: ({ error }): void => {
      //     this.envioFormularioCompleto = true;
      //   },
      // })

    } else {
      this.formularioEmpresaNuevo.markAllAsTouched();
    }
  }

  limpiarFormulario() {
    this.formularioEmpresaNuevo.reset();
  }

  obtenerDigitoVerificacion() {
    if (this.formFields.nit.value) {
      let dv = this.devuelveDigitoVerificacionService.digitoVerificacion(
        parseInt(this.formFields.nit.value)
      );
      if(dv){
        this.formFields.digitoVerificacion.setValue(`${dv}`);
      }
    }
  }
}
