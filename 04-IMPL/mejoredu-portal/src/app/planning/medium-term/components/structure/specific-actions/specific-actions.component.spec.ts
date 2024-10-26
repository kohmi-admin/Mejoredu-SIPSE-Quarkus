import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificActionsComponent } from './specific-actions.component';

describe('SpecificActionsComponent', () => {
  let component: SpecificActionsComponent;
  let fixture: ComponentFixture<SpecificActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecificActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecificActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
