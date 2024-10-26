import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortTermComponent } from './short-term.component';

describe('ShortTermComponent', () => {
  let component: ShortTermComponent;
  let fixture: ComponentFixture<ShortTermComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortTermComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
