import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoPaaComponent } from './proyecto-paa.component';

describe('ProyectoPaaComponent', () => {
  let component: ProyectoPaaComponent;
  let fixture: ComponentFixture<ProyectoPaaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectoPaaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProyectoPaaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
