import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeePayment } from './fee-payment';

describe('FeePayment', () => {
  let component: FeePayment;
  let fixture: ComponentFixture<FeePayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeePayment],
    }).compileComponents();

    fixture = TestBed.createComponent(FeePayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
