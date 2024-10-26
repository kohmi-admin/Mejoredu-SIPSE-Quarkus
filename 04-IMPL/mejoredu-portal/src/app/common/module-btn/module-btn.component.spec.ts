import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleBtnComponent } from './module-btn.component';

describe('ModuleBtnComponent', () => {
  let component: ModuleBtnComponent;
  let fixture: ComponentFixture<ModuleBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
