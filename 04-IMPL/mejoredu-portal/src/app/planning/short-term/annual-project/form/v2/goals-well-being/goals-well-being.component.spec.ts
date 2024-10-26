import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsWellBeingComponent } from './goals-well-being.component';

describe('GoalsWellBeingComponent', () => {
  let component: GoalsWellBeingComponent;
  let fixture: ComponentFixture<GoalsWellBeingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalsWellBeingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsWellBeingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
