import { TestBed } from '@angular/core/testing';

import { TeacherClassService } from './teacher-class.service';

describe('TeacherClassService', () => {
  let service: TeacherClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
