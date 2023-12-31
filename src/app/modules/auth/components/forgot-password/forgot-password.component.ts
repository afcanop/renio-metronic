import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { General } from '@comun/clases/general';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends General implements OnInit {

  ocultarFormularioRestablecerClave = false
  formularioRestablecerClave: FormGroup;

  @ViewChild('btnRestablecer', { read: ElementRef })
  btnRestablecer!: ElementRef<HTMLButtonElement>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private renderer2: Renderer2,
  ) {
    super()
  }

  ngOnInit(): void {
    this.initForm();
  }

  get formFields() {
    return this.formularioRestablecerClave.controls;
  }

  initForm() {
    this.formularioRestablecerClave = this.formBuilder.group({
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
    });
  }

  submit() {
    this.renderer2.setAttribute(
      this.btnRestablecer.nativeElement,
      'disabled',
      'true'
    );
    this.renderer2.setProperty(
      this.btnRestablecer.nativeElement,
      'innerHTML',
      'Procesando'
    );
    if (this.formularioRestablecerClave.valid) {
      this.authService
      .recuperarClave(this.formFields.usuario.value)
      .subscribe({
        next: () => {
          this.renderer2.removeAttribute(this.btnRestablecer.nativeElement, 'disabled');
          this.renderer2.setProperty(
            this.btnRestablecer.nativeElement,
            'innerHTML',
            'Restablecer'
          );
          this.ocultarFormularioRestablecerClave = true
          this.alertaService.mensajaExitoso(this.translateService.instant('FORMULARIOS.MENSAJES.AUTENTIFICACION.VERIFICACION'));
          this.changeDetectorRef.detectChanges();
        },
        error: () => {
          this.renderer2.removeAttribute(this.btnRestablecer.nativeElement, 'disabled');
          this.renderer2.setProperty(
            this.btnRestablecer.nativeElement,
            'innerHTML',
            'Restablecer'
          );
        },
      });
    } else {
      this.renderer2.removeAttribute(this.btnRestablecer.nativeElement, 'disabled');
      this.renderer2.setProperty(
        this.btnRestablecer.nativeElement,
        'innerHTML',
        'Restablecer'
      );
      this.formularioRestablecerClave.markAllAsTouched()
    }

  }
}
