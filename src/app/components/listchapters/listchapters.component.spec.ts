import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListchaptersComponent } from './listchapters.component';

describe('ListchaptersComponent', () => {
  let component: ListchaptersComponent;
  let fixture: ComponentFixture<ListchaptersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListchaptersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListchaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
