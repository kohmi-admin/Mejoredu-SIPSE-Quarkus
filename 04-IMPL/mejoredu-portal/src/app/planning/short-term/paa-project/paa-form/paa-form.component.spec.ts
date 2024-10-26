import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaaFormComponent } from './paa-form.component';

describe('PaaFormComponent', () => {
  let component: PaaFormComponent;
  let fixture: ComponentFixture<PaaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
