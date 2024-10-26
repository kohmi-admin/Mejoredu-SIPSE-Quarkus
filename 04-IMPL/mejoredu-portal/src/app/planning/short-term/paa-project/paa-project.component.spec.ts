import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaaProjectComponent } from './paa-project.component';

describe('PaaProjectComponent', () => {
  let component: PaaProjectComponent;
  let fixture: ComponentFixture<PaaProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaaProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaaProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
