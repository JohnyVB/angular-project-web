import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewchapterComponent } from './newchapter.component';

describe('NewchapterComponent', () => {
  let component: NewchapterComponent;
  let fixture: ComponentFixture<NewchapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewchapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewchapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
