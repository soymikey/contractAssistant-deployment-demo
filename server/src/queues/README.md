# Queues Module

This module provides asynchronous job processing using Bull (Redis-based queue system).

## Overview

The Queues module manages background tasks for the Contract Assistant application:
- **Analysis Queue**: AI contract analysis jobs
- **Upload Queue**: File processing and storage
- **OCR Queue**: Text extraction from images/PDFs
- **Notification Queue**: Email and push notifications

## Configuration

### Redis Setup

Ensure Redis is running and configure it in your `.env` file:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Queue Configuration

Each queue is configured with:
- **Retry Strategy**: Exponential or fixed backoff
- **Attempts**: Number of retry attempts on failure
- **Job Retention**: Auto-cleanup of completed/failed jobs

See `queues.module.ts` for detailed configuration.

## Usage

### Adding Jobs to Queue

Inject `QueuesService` in your service:

```typescript
import { QueuesService } from './queues/queues.service';

@Injectable()
export class YourService {
  constructor(private queuesService: QueuesService) {}

  async analyzeContract(contractId: string, userId: string) {
    // Add job to analysis queue
    const job = await this.queuesService.addAnalysisJob(contractId, userId);
    return { jobId: job.id, status: 'pending' };
  }
}
```

### Queue Methods

**QueuesService** provides:
- `addAnalysisJob(contractId, userId, options?)` - Add contract analysis job
- `addUploadJob(fileId, userId, fileType, options?)` - Add file upload job
- `addOcrJob(fileId, userId, options?)` - Add OCR job
- `addNotificationJob(type, recipient, data, options?)` - Add notification job
- `getQueueStats(queueName)` - Get queue statistics
- `getAllQueueStats()` - Get all queues statistics
- `pauseQueue(queueName)` - Pause a queue
- `resumeQueue(queueName)` - Resume a queue
- `cleanQueue(queueName, grace?)` - Clean completed/failed jobs

## Processors

Processors handle the actual job execution. They are automatically registered and listen for jobs.

### Implementation Status

| Processor | Status | Location |
|-----------|--------|----------|
| AnalysisProcessor | ✅ Implemented (stub) | `processors/analysis.processor.ts` |
| UploadProcessor | ✅ Implemented (stub) | `processors/index.ts` |
| OcrProcessor | ✅ Implemented (stub) | `processors/index.ts` |
| NotificationProcessor | ✅ Implemented (stub) | `processors/index.ts` |

**Note**: All processors are currently stubs with simulated work. They will be fully implemented in their respective modules (Week 3-6).

### Processor Features

Each processor includes:
- `@Process('job-name')` - Main job handler
- `@OnQueueActive()` - Event handler when job starts
- `@OnQueueCompleted()` - Event handler on success
- `@OnQueueFailed()` - Event handler on failure
- Progress tracking with `job.progress(percentage)`
- Error handling and logging

## Monitoring

### Queue Statistics

Get real-time statistics:

```typescript
const stats = await this.queuesService.getAllQueueStats();
// Returns: waiting, active, completed, failed, delayed counts for each queue
```

### Queue Management

Pause/resume queues for maintenance:

```typescript
// Pause analysis queue
await this.queuesService.pauseQueue('ANALYSIS');

// Resume after maintenance
await this.queuesService.resumeQueue('ANALYSIS');
```

### Clean Old Jobs

Remove old completed/failed jobs:

```typescript
// Clean jobs older than 1 hour (3600000 ms)
await this.queuesService.cleanQueue('ANALYSIS', 3600000);
```

## Job Options

Customize job behavior:

```typescript
await this.queuesService.addAnalysisJob(
  contractId,
  userId,
  {
    priority: 1, // Higher priority (1 = highest)
    delay: 5000, // Delay job by 5 seconds
    attempts: 5, // Override default retry attempts
    timeout: 60000, // Job timeout (60 seconds)
    removeOnComplete: true, // Remove immediately after completion
  }
);
```

## Error Handling

All processors include comprehensive error handling:
- Failed jobs are automatically retried based on configuration
- Errors are logged with context
- Failed jobs are preserved for debugging (up to retention limit)
- Failed job data can be retrieved for manual reprocessing

## Development Notes

### Testing Queue Functionality

1. **Start Redis**: Ensure Redis is running (`redis-server`)
2. **Run Application**: `pnpm start:dev`
3. **Add Test Job**: Use QueuesService to add a test job
4. **Monitor Logs**: Check console for processor logs
5. **Check Queue Stats**: Call `getAllQueueStats()` endpoint

### Future Enhancements (Week 3-6)

- [ ] Complete Analysis processor implementation (Week 4-5)
- [ ] Complete Upload processor implementation (Week 3-4)
- [ ] Complete OCR processor implementation (Week 3-4)
- [ ] Complete Notification processor implementation (Week 6)
- [ ] Add Bull Dashboard for UI monitoring
- [ ] Add Prometheus metrics export
- [ ] Implement job prioritization based on user subscription
- [ ] Add dead letter queue for permanently failed jobs

## Dependencies

- `@nestjs/bull` ^11.0.4 - NestJS Bull integration
- `bull` ^4.16.5 - Redis-based queue system
- Redis server (external dependency)

## References

- [Bull Documentation](https://github.com/OptimalBits/bull)
- [NestJS Bull Guide](https://docs.nestjs.com/techniques/queues)
- [Redis Quick Start](https://redis.io/docs/getting-started/)
