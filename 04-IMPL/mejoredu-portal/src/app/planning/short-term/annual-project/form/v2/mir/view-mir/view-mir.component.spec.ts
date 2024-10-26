import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMirComponent } from './view-mir.component';

describe('ViewMirComponent', () => {
  let component: ViewMirComponent;
  let fixture: ComponentFixture<ViewMirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
