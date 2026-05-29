import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeStructure } from './fee-structure';

describe('FeeStructure', () => {
  let component: FeeStructure;
  let fixture: ComponentFixture<FeeStructure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeStructure],
    }).compileComponents();

    fixture = TestBed.createComponent(FeeStructure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
