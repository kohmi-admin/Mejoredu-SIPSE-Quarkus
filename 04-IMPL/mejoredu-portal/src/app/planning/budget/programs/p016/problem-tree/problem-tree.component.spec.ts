import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemTreeComponent } from './problem-tree.component';

describe('ProblemTreeComponent', () => {
  let component: ProblemTreeComponent;
  let fixture: ComponentFixture<ProblemTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemTreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
