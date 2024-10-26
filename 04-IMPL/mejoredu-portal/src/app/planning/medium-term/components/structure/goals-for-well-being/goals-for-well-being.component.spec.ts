import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsForWellBeingComponent } from './goals-for-well-being.component';

describe('GoalsForWellBeingComponent', () => {
  let component: GoalsForWellBeingComponent;
  let fixture: ComponentFixture<GoalsForWellBeingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoalsForWellBeingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsForWellBeingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
