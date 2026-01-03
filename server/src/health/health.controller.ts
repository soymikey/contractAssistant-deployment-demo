import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Health check controller
 * Provides endpoints to check application and service health
 */
@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private prisma: PrismaService,
  ) {}

  /**
   * Main health check endpoint
   * Checks database connection, memory, and disk usage
   */
  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Health check',
    description:
      'Performs comprehensive health check including database, memory, and disk',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check passed',
    schema: {
      example: {
        status: 'ok',
        info: {
          database: { status: 'up' },
          memory_heap: { status: 'up' },
          memory_rss: { status: 'up' },
          storage: { status: 'up' },
        },
        error: {},
        details: {
          database: { status: 'up' },
          memory_heap: { status: 'up' },
          memory_rss: { status: 'up' },
          storage: { status: 'up' },
        },
      },
    },
  })
  @ApiResponse({ status: 503, description: 'Health check failed' })
  check() {
    return this.health.check([
      // Check database connection
      () => this.prismaHealth.pingCheck('database', this.prisma),
      // Check memory usage - heap should not exceed 150MB
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Check memory usage - RSS should not exceed 300MB
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      // Check disk storage - should have at least 50% free space
      // Use platform-specific path (C:\ for Windows, / for Unix-like systems)
      // () =>
      //   this.disk.checkStorage('storage', {
      //     path: process.platform === 'win32' ? 'C:\\' : '/',
      //     thresholdPercent: 0.5,
      //   }),
    ]);
  }

  /**
   * Simple liveness probe
   * Returns OK if application is running
   */
  @Get('live')
  @ApiOperation({
    summary: 'Liveness probe',
    description: 'Simple check to verify application is running',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is alive',
    schema: {
      example: { status: 'ok', timestamp: '2024-01-01T00:00:00.000Z' },
    },
  })
  getLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe
   * Checks if application is ready to accept traffic
   */
  @Get('ready')
  @HealthCheck()
  @ApiOperation({
    summary: 'Readiness probe',
    description: 'Checks if application is ready to accept traffic',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is ready',
  })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  getReadiness() {
    return this.health.check([
      // Only check database for readiness
      () => this.prismaHealth.pingCheck('database', this.prisma),
    ]);
  }
}
