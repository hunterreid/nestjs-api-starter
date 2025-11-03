import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { DebugConfig } from '../../config/configuration';

@ApiTags('debug')
@Controller('debug/pprof')
export class DebugController {
  constructor(private configService: ConfigService) {}

  private isDebugEnabled(): boolean {
    const debugConfig = this.configService.get<DebugConfig>('debug');
    return debugConfig?.enableDebugEndpoints || false;
  }

  @Get()
  @ApiOperation({ summary: 'Debug endpoints index' })
  @ApiResponse({ status: 200, description: 'List of available debug endpoints' })
  @ApiExcludeEndpoint(false)
  async index() {
    if (!this.isDebugEnabled()) {
      return { error: 'Debug endpoints are disabled in production mode' };
    }

    return {
      message: 'Debug endpoints (pprof equivalent)',
      endpoints: [
        '/debug/pprof',
        '/debug/pprof/heap',
        '/debug/pprof/profile',
        '/debug/pprof/metrics',
      ],
      note: 'These endpoints are only available in development mode',
    };
  }

  @Get('heap')
  @ApiOperation({ summary: 'Get heap statistics' })
  @ApiResponse({ status: 200, description: 'Memory heap statistics' })
  @ApiExcludeEndpoint(false)
  async heap() {
    if (!this.isDebugEnabled()) {
      return { error: 'Debug endpoints are disabled in production mode' };
    }

    const memoryUsage = process.memoryUsage();
    return {
      type: 'heap',
      timestamp: new Date().toISOString(),
      memory: {
        rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
        heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
        arrayBuffers: `${(memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2)} MB`,
      },
      raw: memoryUsage,
    };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get runtime profile information' })
  @ApiResponse({ status: 200, description: 'Runtime profile statistics' })
  @ApiExcludeEndpoint(false)
  async profile() {
    if (!this.isDebugEnabled()) {
      return { error: 'Debug endpoints are disabled in production mode' };
    }

    return {
      type: 'profile',
      timestamp: new Date().toISOString(),
      process: {
        pid: process.pid,
        uptime: `${process.uptime().toFixed(2)} seconds`,
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      cpu: process.cpuUsage(),
    };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get application metrics' })
  @ApiResponse({ status: 200, description: 'Application metrics' })
  @ApiExcludeEndpoint(false)
  async metrics() {
    if (!this.isDebugEnabled()) {
      return { error: 'Debug endpoints are disabled in production mode' };
    }

    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      type: 'metrics',
      timestamp: new Date().toISOString(),
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed,
        external: memoryUsage.external,
        arrayBuffers: memoryUsage.arrayBuffers,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
    };
  }
}
