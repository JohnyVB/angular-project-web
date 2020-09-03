import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastchaptersComponent } from './lastchapters.component';

describe('LastchaptersComponent', () => {
  let component: LastchaptersComponent;
  let fixture: ComponentFixture<LastchaptersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastchaptersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastchaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
