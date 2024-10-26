import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultingFilesComponent } from './consulting-files.component';

describe('ConsultingFilesComponent', () => {
  let component: ConsultingFilesComponent;
  let fixture: ComponentFixture<ConsultingFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultingFilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultingFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
