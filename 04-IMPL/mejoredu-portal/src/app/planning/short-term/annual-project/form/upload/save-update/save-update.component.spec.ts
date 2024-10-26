import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateComponent } from './save-update.component';

describe('SaveUpdateComponent', () => {
  let component: SaveUpdateComponent;
  let fixture: ComponentFixture<SaveUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
