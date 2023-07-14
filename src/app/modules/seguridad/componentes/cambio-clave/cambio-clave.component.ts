import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '@comun/validaciones/confirm-password.validator';
import { AuthService } from '@modulos/auth';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { General } from '@comun/clases/general';

@Component({
  selector: 'app-seguridad-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styleUrls: ['./cambio-clave.component.scss'],
})

export class CambioClaveComponent extends General implements OnInit {
  codigoUsuario = '';
  formularioCambioClave: FormGroup;
  cambiarTipoCampoClave: 'text' | 'password' = 'password';
  cambiarTipoCampoNuevaClave: 'text' | 'password' = 'password';
  cambiarTipoCampoConfirmarNuevaClave: 'text' | 'password' = 'password';
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    super()
  }

  ngOnInit(): void {
    this.initForm();
    this.store.select(obtenerId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
  }

  visualizarClave() {
    if (this.cambiarTipoCampoClave === 'password') {
      this.cambiarTipoCampoClave = 'text';
    } else {
      this.cambiarTipoCampoClave = 'password';
    }
  }

  visualizarNuevaClave() {
    if (this.cambiarTipoCampoNuevaClave === 'password') {
      this.cambiarTipoCampoNuevaClave = 'text';
    } else {
      this.cambiarTipoCampoNuevaClave = 'password';
    }
  }

  visualizarConfirmarNuevaClave() {
    if (this.cambiarTipoCampoConfirmarNuevaClave === 'password') {
      this.cambiarTipoCampoConfirmarNuevaClave = 'text';
    } else {
      this.cambiarTipoCampoConfirmarNuevaClave = 'password';
    }
  }

  initForm() {
    this.formularioCambioClave = this.formBuilder.group(
      {
        nuevaClave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        confirmarNuevaClave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      },
      {
        validator: [
          ConfirmPasswordValidator.validarCambioClave,
        ],
      }
    );
  }

  get formFields() {
    return this.formularioCambioClave.controls;
  }
  submit() {
    if (this.formularioCambioClave.valid) {
      this.authService
        .reiniciarClave(this.codigoUsuario, this.formFields.nuevaClave.value)
        .subscribe((respuesta) => {
          this.alertaService.mensajaExitoso(
            this.translateService.instant("FORMULARIOS.MENSAJES.COMUNES.INGRESARCLAVE")
          );
          this.modalService.dismissAll();
        });
    } else {
      this.formularioCambioClave.markAllAsTouched();
    }
  }

  open() {
    this.formularioCambioClave.reset();
    this.modalRef = this.modalService.open(this.customTemplate, { backdrop: 'static' });
  }

}
