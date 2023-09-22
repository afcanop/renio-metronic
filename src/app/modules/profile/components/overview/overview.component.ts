import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  obtenerUsuarioId,
  obtenerUsuarioImagen,
  obtenerUsuarioNombre,
} from '@redux/selectors/usuario.selectors';
import { switchMap } from 'rxjs';
import { InquilinoService } from '../../../inquilino/servicios/inquilino.service';
import { Inquilino } from '@interfaces/usuario/inquilino';
import { General } from '@comun/clases/general';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent extends General implements OnInit {
  arrInquilinos: Inquilino[] = [];
  usuarioImagen$ = this.store.select(obtenerUsuarioImagen);
  usuarioCorreo = this.store.select(obtenerUsuarioNombre);
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = '';
  constructor(private inquilinoService: InquilinoService) {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista() {
    this.store
      .select(obtenerUsuarioId)
      .pipe(switchMap((usuarioId) => this.inquilinoService.lista(usuarioId)))
      .subscribe({
        next: (respuesta) => {
          this.arrInquilinos = respuesta.inquilinos;
          this.changeDetectorRef.detectChanges();
        },
        error: ({ error }): void => {
          this.alertaService.mensajeError(
            'Error consulta',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          );
        },
      });
  }
}
