import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageChartComponent } from './manage-chart.component';

describe('ManageChartComponent', () => {
  let component: ManageChartComponent;
  let fixture: ComponentFixture<ManageChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
