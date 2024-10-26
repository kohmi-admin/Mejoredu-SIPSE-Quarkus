import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetiveTreeComponent } from './objetive-tree.component';

describe('ObjetiveTreeComponent', () => {
  let component: ObjetiveTreeComponent;
  let fixture: ComponentFixture<ObjetiveTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetiveTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjetiveTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
