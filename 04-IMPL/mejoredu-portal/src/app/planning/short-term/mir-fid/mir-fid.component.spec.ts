import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MirFidComponent } from './mir-fid.component';

describe('MirFidComponent', () => {
  let component: MirFidComponent;
  let fixture: ComponentFixture<MirFidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MirFidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MirFidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
