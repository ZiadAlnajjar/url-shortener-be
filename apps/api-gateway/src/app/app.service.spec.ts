import { Test } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let _service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    _service = app.get<AppService>(AppService);
  });
});
