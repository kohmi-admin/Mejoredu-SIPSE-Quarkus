import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFichaIdentificadorComponent } from './view-ficha-identificador.component';

describe('ViewFichaIdentificadorComponent', () => {
  let component: ViewFichaIdentificadorComponent;
  let fixture: ComponentFixture<ViewFichaIdentificadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFichaIdentificadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFichaIdentificadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
