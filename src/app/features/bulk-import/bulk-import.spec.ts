import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkImport } from './bulk-import';

describe('BulkImport', () => {
  let component: BulkImport;
  let fixture: ComponentFixture<BulkImport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkImport],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkImport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
