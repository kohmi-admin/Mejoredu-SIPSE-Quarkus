import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellnessGoalsComponent } from './wellness-goals.component';

describe('WellnessGoalsComponent', () => {
  let component: WellnessGoalsComponent;
  let fixture: ComponentFixture<WellnessGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WellnessGoalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WellnessGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
