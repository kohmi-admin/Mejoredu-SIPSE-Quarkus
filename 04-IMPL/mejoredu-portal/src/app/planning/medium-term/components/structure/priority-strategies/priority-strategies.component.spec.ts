import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityStrategiesComponent } from './priority-strategies.component';

describe('PriorityStrategiesComponent', () => {
  let component: PriorityStrategiesComponent;
  let fixture: ComponentFixture<PriorityStrategiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriorityStrategiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityStrategiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
