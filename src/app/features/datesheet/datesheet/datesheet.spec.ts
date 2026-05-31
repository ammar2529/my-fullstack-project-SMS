import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Datesheet } from './datesheet';

describe('Datesheet', () => {
  let component: Datesheet;
  let fixture: ComponentFixture<Datesheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Datesheet],
    }).compileComponents();

    fixture = TestBed.createComponent(Datesheet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
