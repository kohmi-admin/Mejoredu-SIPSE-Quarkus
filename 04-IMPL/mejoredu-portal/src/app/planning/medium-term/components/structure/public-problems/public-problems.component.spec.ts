import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicProblemsComponent } from './public-problems.component';

describe('PublicProblemsComponent', () => {
  let component: PublicProblemsComponent;
  let fixture: ComponentFixture<PublicProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicProblemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
