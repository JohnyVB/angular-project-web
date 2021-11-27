import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatoruserComponent } from './activatoruser.component';

describe('ActivatoruserComponent', () => {
  let component: ActivatoruserComponent;
  let fixture: ComponentFixture<ActivatoruserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivatoruserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivatoruserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
