import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmPasswordValidator } from '@comun/validaciones/confirm-password.validator';
import { AlertaService } from '@comun/services/alerta.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  formularioRegistro: FormGroup;
  cambiarTipoCampoClave: ("text"|"password") = "password"
  cambiarTipoCampoConfirmarClave: ("text"|"password") = "password"
  @ViewChild('btnCrear', { read: ElementRef })
  btnCrear!: ElementRef<HTMLButtonElement>;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private renderer2: Renderer2,
    private alertaService: AlertaService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  visualizarClave(){
    if(this.cambiarTipoCampoClave === "password"){
      this.cambiarTipoCampoClave = 'text'
    } else{
      this.cambiarTipoCampoClave = 'password'
    }
  }

  visualizarConfirmarClave(){
    if(this.cambiarTipoCampoConfirmarClave === "password"){
      this.cambiarTipoCampoConfirmarClave = 'text'
    } else{
      this.cambiarTipoCampoConfirmarClave = 'password'
    }
  }

  initForm() {
    this.formularioRegistro = this.formBuilder.group(
      {
        usuario: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
          ]),
        ],
        clave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
          ]),
        ],
        confirmarClave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50),
          ]),
        ],
        terminosCondiciones: [false, Validators.compose([Validators.requiredTrue])],
      },
      {
        validator: ConfirmPasswordValidator.validarClave,
      }
    );
  }

  get formFields() {
    return this.formularioRegistro.controls;
  }


  submit() {
    if (this.formularioRegistro.valid) {

      const mensajes = this.translateService.instant([
        'FORMULARIOS.MENSAJES.EMPRESAS.ELIMINAREMPRESATITULO',
        'FORMULARIOS.MENSAJES.EMPRESAS.ELIMINAREMPRESASUBTITULO',
        'FORMULARIOS.MENSAJES.EMPRESAS.ELIMINAREMPRESAAYUDA',
        'FORMULARIOS.BOTONES.COMUNES.ELIMINAR',
        'FORMULARIOS.BOTONES.COMUNES.CANCELAR',
      ]);

      this.renderer2.setAttribute(
        this.btnCrear.nativeElement,
        'disabled',
        'true'
      );
      this.renderer2.setProperty(
        this.btnCrear.nativeElement,
        'innerHTML',
        'Procesando'
      );
      this.authService.registration(this.formularioRegistro.value).subscribe({
        next: () => {
          this.alertaService.mensajaExitoso(
            'Cuenta creada con éxito',
            'Se ha enviado un correo electrónico para verificar tu cuenta'
          );
          this.router.navigate(['/auth/login']);
        },
        error: () => {
          this.renderer2.removeAttribute(this.btnCrear.nativeElement, 'disabled');
          this.renderer2.setProperty(
            this.btnCrear.nativeElement,
            'innerHTML',
            'Crear'
          );
        },
      });
    } else {
      this.formularioRegistro.markAllAsTouched();
    }
  }
}

