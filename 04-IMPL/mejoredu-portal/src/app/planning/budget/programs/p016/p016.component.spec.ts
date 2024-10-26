import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P016Component } from './p016.component';

describe('P016Component', () => {
  let component: P016Component;
  let fixture: ComponentFixture<P016Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ P016Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P016Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
