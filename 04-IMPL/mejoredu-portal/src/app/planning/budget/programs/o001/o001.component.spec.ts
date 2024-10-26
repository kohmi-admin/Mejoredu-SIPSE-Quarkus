import { ComponentFixture, TestBed } from '@angular/core/testing';

import { O001Component } from './o001.component';

describe('O001Component', () => {
  let component: O001Component;
  let fixture: ComponentFixture<O001Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ O001Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(O001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
