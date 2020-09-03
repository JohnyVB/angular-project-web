import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastbooksComponent } from './lastbooks.component';

describe('LastbooksComponent', () => {
  let component: LastbooksComponent;
  let fixture: ComponentFixture<LastbooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastbooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
