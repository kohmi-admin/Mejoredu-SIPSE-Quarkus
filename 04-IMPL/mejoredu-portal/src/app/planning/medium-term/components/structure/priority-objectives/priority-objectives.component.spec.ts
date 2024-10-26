import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityObjectivesComponent } from './priority-objectives.component';

describe('PriorityObjectivesComponent', () => {
  let component: PriorityObjectivesComponent;
  let fixture: ComponentFixture<PriorityObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriorityObjectivesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
