import { TestBed } from '@angular/core/testing';

import { TasksCommandsService } from './tasksCommands.service';

describe('TasksService', () => {
  let service: TasksCommandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksCommandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
