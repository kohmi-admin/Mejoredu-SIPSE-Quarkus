import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MirPiComponent } from './mir-pi.component';

describe('MirPiComponent', () => {
  let component: MirPiComponent;
  let fixture: ComponentFixture<MirPiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MirPiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MirPiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
