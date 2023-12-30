import { TestBed } from '@angular/core/testing';

import { TasksQueriesService } from './tasks-queries.service';

describe('TasksQueriesService', () => {
  let service: TasksQueriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksQueriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
