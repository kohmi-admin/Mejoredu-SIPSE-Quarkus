import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryIndicatorsTabComponent } from './registry-indicators-tab.component';

describe('RegistryIndicatorsTabComponent', () => {
  let component: RegistryIndicatorsTabComponent;
  let fixture: ComponentFixture<RegistryIndicatorsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistryIndicatorsTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistryIndicatorsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
