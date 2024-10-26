import { ComponentFixture, TestBed } from '@angular/core/testing';

import { M001Component } from './m001.component';

describe('M001Component', () => {
  let component: M001Component;
  let fixture: ComponentFixture<M001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ M001Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(M001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
