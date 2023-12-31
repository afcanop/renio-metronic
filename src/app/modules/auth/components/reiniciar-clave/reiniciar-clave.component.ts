import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@modulos/auth/services/auth.service';
import { ConfirmPasswordValidator } from '@comun/validaciones/confirm-password.validator';
import { General } from '@comun/clases/general';

@Component({
  templateUrl: './reiniciar-clave.component.html',
  styleUrls: ['./reiniciar-clave.component.scss'],
})
export class ReiniciarClaveComponent extends General implements OnInit {
  codigo_usuario: string = '';
  inhabilitarBtnRestablecer: boolean = true;
  formularioReiniciarClave: FormGroup;
  cambiarTipoCampoClave: 'text' | 'password' = 'password';
  cambiarTipoCampoConfirmarClave: 'text' | 'password' = 'password';
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private renderer2: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.validarToken();
  }

  visualizarClave() {
    if (this.cambiarTipoCampoClave === 'password') {
      this.cambiarTipoCampoClave = 'text';
    } else {
      this.cambiarTipoCampoClave = 'password';
    }
  }

  visualizarConfirmarClave() {
    if (this.cambiarTipoCampoConfirmarClave === 'password') {
      this.cambiarTipoCampoConfirmarClave = 'text';
    } else {
      this.cambiarTipoCampoConfirmarClave = 'password';
    }
  }

  initForm() {
    this.formularioReiniciarClave = this.formBuilder.group(
      {
        clave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        confirmarClave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      },
      {
        validator: ConfirmPasswordValidator.validarClave,
      }
    );
  }

  validarToken() {
    this.inhabilitarBtnRestablecer = false;
  }

  get formFields() {
    return this.formularioReiniciarClave.controls;
  }

  submit() {
    if (this.formularioReiniciarClave.valid) {
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
      const token = this.activatedRoute.snapshot.paramMap.get('token')!;

      this.authService
        .reiniciarClave(this.formFields.clave.value, token)
        .subscribe({
          next: (respuesta) => {
            this.renderer2.removeAttribute(
              this.btnGuardar.nativeElement,
              'disabled'
            );
            this.renderer2.setProperty(
              this.btnGuardar.nativeElement,
              'innerHTML',
              'Guardar'
            );
            this.alertaService.mensajaExitoso(
              this.translateService.instant(
                'FORMULARIOS.MENSAJES.AUTENTIFICACION.INGRESARCLAVE'
              )
            );
            this.router.navigate(['/auth/login']);
          },
          error: (error) => {
            this.renderer2.removeAttribute(
              this.btnGuardar.nativeElement,
              'disabled'
            );
            this.renderer2.setProperty(
              this.btnGuardar.nativeElement,
              'innerHTML',
              'Guardar'
            );

            this.alertaService.mensajeError(
              'Error consulta',
              `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
            );
          },
        });
    } else {
      this.formularioReiniciarClave.markAllAsTouched();
    }
  }
}
