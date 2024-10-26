import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NitificationComponent } from './nitification.component';

describe('NitificationComponent', () => {
  let component: NitificationComponent;
  let fixture: ComponentFixture<NitificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NitificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NitificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
