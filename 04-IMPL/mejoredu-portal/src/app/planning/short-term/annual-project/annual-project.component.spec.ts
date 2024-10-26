import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualProjectComponent } from './annual-project.component';

describe('AnnualProjectComponent', () => {
  let component: AnnualProjectComponent;
  let fixture: ComponentFixture<AnnualProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnualProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnualProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
