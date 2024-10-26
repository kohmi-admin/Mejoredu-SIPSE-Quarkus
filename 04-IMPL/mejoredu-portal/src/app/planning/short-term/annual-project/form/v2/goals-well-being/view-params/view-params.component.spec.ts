import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewParamsComponent } from './view-params.component';

describe('ViewParamsComponent', () => {
  let component: ViewParamsComponent;
  let fixture: ComponentFixture<ViewParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewParamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
