import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTable } from './time-table';

describe('TimeTable', () => {
  let component: TimeTable;
  let fixture: ComponentFixture<TimeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeTable],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
