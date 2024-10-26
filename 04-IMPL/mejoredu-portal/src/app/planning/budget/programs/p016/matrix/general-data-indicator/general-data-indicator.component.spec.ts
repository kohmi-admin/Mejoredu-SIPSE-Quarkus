import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDataIndicatorComponent } from './general-data-indicator.component';

describe('GeneralDataIndicatorComponent', () => {
  let component: GeneralDataIndicatorComponent;
  let fixture: ComponentFixture<GeneralDataIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralDataIndicatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralDataIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
