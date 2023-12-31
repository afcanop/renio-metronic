import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContenedorService } from '../../servicios/contenedor.service';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { of, switchMap, tap, zip } from 'rxjs';
import { General } from '@comun/clases/general';
import { ContenedorFormulario } from '@interfaces/usuario/contenedor';

@Component({
  selector: 'app-contenedor-nuevo',
  templateUrl: './contenedor-nuevo.component.html',
  styleUrls: ['./contenedor-nuevo.component.scss'],
})
export class ContenedorNuevoComponent extends General implements OnInit {
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = '';
  visualizarBtnAtras = true;
  procesando = false;

  informacionContenedor: ContenedorFormulario = {
    nombre: '',
    subdominio: '',
    plan_id: 0,
    imagen: null,
    ciudad: '',
    correo: '',
    direccion: '',
    identificacion: '',
    nombre_corto: '',
    numero_identificacion: '',
    telefono: '',
    ciudad_nombre: '',
    digito_verificacion: '',
  };

  constructor(private contenedorService: ContenedorService) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
    });
  }

  enviarFormulario(dataFormularioLogin: any) {
    this.visualizarBtnAtras = false;
    this.procesando = true;
    this.contenedorService
    .consultarNombre(dataFormularioLogin.subdominio)
    .pipe(
      switchMap(({ validar }) => {
        if (!validar) {
          this.procesando = false;
          this.changeDetectorRef.detectChanges();
          this.alertaService.mensajeError('Error', 'Nombre en uso');
        } else {
          return this.contenedorService.nuevo(
            dataFormularioLogin,
            this.codigoUsuario
          );
        }
        return of(null);
      })
    )
    .subscribe({
      next: (respuesta: any) => {
        if (respuesta.contenedor) {
          this.alertaService.mensajaExitoso(
            this.translateService.instant(
              'FORMULARIOS.MENSAJES.CONTENEDOR.NUEVOCONTENEDOR'
            )
          );
          this.router.navigate(['/contenedor/lista']);
          this.procesando = false;
        }
      },
      error: () => {
        this.procesando = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }
}
