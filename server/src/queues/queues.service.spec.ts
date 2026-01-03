import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { QueuesService } from './queues.service';
import { QUEUE_NAMES } from './queue-names.const';

// Mock queue
const mockQueue = {
  add: jest.fn(),
  getWaitingCount: jest.fn().mockResolvedValue(0),
  getActiveCount: jest.fn().mockResolvedValue(0),
  getCompletedCount: jest.fn().mockResolvedValue(0),
  getFailedCount: jest.fn().mockResolvedValue(0),
  getDelayedCount: jest.fn().mockResolvedValue(0),
  pause: jest.fn(),
  resume: jest.fn(),
  clean: jest.fn(),
};

describe('QueuesService', () => {
  let service: QueuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueuesService,
        {
          provide: getQueueToken(QUEUE_NAMES.ANALYSIS),
          useValue: mockQueue,
        },
        {
          provide: getQueueToken(QUEUE_NAMES.UPLOAD),
          useValue: mockQueue,
        },
        {
          provide: getQueueToken(QUEUE_NAMES.OCR),
          useValue: mockQueue,
        },
        {
          provide: getQueueToken(QUEUE_NAMES.NOTIFICATION),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<QueuesService>(QueuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addAnalysisJob', () => {
    it('should add a job to analysis queue', async () => {
      const contractId = 'test-contract-id';
      const userId = 'test-user-id';

      mockQueue.add.mockResolvedValue({ id: 'job-123' });

      const result = await service.addAnalysisJob(contractId, userId);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'analyze',
        expect.objectContaining({
          contractId,
          userId,
        }),
        undefined,
      );
      expect(result).toEqual({ id: 'job-123' });
    });
  });

  describe('getQueueStats', () => {
    it('should return queue statistics', async () => {
      const stats = await service.getQueueStats('ANALYSIS');

      expect(stats).toEqual({
        queueName: QUEUE_NAMES.ANALYSIS,
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
        total: 0,
      });
    });
  });
});

