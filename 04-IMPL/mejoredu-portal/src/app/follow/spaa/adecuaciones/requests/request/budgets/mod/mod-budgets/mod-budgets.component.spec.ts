import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModBudgetsComponent } from './mod-budgets.component';

describe('ModBudgetsComponent', () => {
  let component: ModBudgetsComponent;
  let fixture: ComponentFixture<ModBudgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModBudgetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModBudgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
