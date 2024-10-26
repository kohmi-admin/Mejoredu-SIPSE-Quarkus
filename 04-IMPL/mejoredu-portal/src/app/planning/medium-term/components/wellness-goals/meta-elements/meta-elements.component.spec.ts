import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaElementsComponent } from './meta-elements.component';

describe('MetaElementsComponent', () => {
  let component: MetaElementsComponent;
  let fixture: ComponentFixture<MetaElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetaElementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetaElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
