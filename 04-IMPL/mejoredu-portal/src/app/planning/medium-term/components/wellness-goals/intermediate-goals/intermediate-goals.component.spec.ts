import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediateGoalsComponent } from './intermediate-goals.component';

describe('IntermediateGoalsComponent', () => {
  let component: IntermediateGoalsComponent;
  let fixture: ComponentFixture<IntermediateGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntermediateGoalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntermediateGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
