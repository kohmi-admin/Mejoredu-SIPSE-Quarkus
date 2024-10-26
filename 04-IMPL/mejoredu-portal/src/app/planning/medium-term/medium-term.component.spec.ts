import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumTermComponent } from './medium-term.component';

describe('MediumTermComponent', () => {
  let component: MediumTermComponent;
  let fixture: ComponentFixture<MediumTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediumTermComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediumTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
