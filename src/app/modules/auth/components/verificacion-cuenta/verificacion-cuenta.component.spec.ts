import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionCuentaComponent } from './verificacion-cuenta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('VerificacionCuentaComponent', () => {
  let component: VerificacionCuentaComponent;
  let fixture: ComponentFixture<VerificacionCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificacionCuentaComponent],
      imports:[
        CardComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VerificacionCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });
});
