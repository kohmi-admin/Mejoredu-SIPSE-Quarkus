import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaaAprobadosComponent } from './paa-aprobados.component';

describe('PaaAprobadosComponent', () => {
  let component: PaaAprobadosComponent;
  let fixture: ComponentFixture<PaaAprobadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaaAprobadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaaAprobadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
