import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticalDocumentComponent } from './analytical-document.component';

describe('AnalyticalDocumentComponent', () => {
  let component: AnalyticalDocumentComponent;
  let fixture: ComponentFixture<AnalyticalDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticalDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticalDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
