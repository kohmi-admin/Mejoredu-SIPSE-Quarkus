import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPiComponent } from './upload-pi.component';

describe('UploadPiComponent', () => {
  let component: UploadPiComponent;
  let fixture: ComponentFixture<UploadPiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadPiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
