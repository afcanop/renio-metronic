import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { FechasService } from '@comun/services/fechas.service';
import {
  Consumo,
  EmpresaService
} from '@modulos/empresa/servicios/empresa.service';

@Component({
  selector: 'app-empresa-facturacion',
  templateUrl: './empresa-facturacion.component.html',
  styleUrls: ['./empresa-facturacion.component.scss'],
})
export class EmpresaFacturacionComponent extends General implements OnInit {
  // empresa_id = this.activatedRoute.snapshot.paramMap.get('codigoempresa')!;

  empresa_id: string | null;

  consumo: Consumo = {
    vr_plan: 0,
    vr_total: 0,
    consumosPlan: [],
  };

  constructor(private empresaService: EmpresaService,
    public fechasServices: FechasService) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.parent?.paramMap.subscribe((params) => {
      this.empresa_id = params.get('codigoempresa');
    });
    this.consultarConsumoFecha();
    this.changeDetectorRef.detectChanges();
  }

  consultarConsumoFecha() {
    if(this.empresa_id){
      this.empresaService
      .consultarConsumoFecha(this.empresa_id)
      .subscribe((respuesta: any) => {
        // Llenar el objeto consumo con los valores de la respuesta
        this.consumo.vr_plan = respuesta.consumos.vr_plan;
        this.consumo.vr_total = respuesta.consumos.vr_total;
  
        // Si la respuesta tiene un arreglo de consumosPlan
        if (respuesta.consumosPlan && respuesta.consumosPlan.length > 0) {
          // Llenar el objeto consumosPlan con todos los elementos del arreglo
          this.consumo.consumosPlan = respuesta.consumosPlan.map((consumoPlan: any) => ({
            plan_id: consumoPlan.plan_id,
            vr_plan: consumoPlan.vr_plan,
            vr_total: consumoPlan.vr_total,
            plan_nombre: consumoPlan.plan_nombre
          }));
        }
  
        this.changeDetectorRef.detectChanges();
      });
    }
  }
}
