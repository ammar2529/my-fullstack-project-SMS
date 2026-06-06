import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFee } from './my-fee';

describe('MyFee', () => {
  let component: MyFee;
  let fixture: ComponentFixture<MyFee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFee],
    }).compileComponents();

    fixture = TestBed.createComponent(MyFee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
