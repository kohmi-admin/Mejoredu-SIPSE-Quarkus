import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevancePriorityObjectivesComponent } from './relevance-priority-objectives.component';

describe('RelevancePriorityObjectivesComponent', () => {
  let component: RelevancePriorityObjectivesComponent;
  let fixture: ComponentFixture<RelevancePriorityObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelevancePriorityObjectivesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelevancePriorityObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
