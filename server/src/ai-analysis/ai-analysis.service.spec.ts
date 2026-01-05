import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiAnalysisService } from './ai-analysis.service';
import type { AnalyzeContractDto } from './dto/analyze-contract.dto';

describe('AiAnalysisService', () => {
  let service: AiAnalysisService;

  const mockConfigService = {
    get: jest.fn((key: string): string | undefined => {
      if (key === 'GEMINI_API_KEY') {
        return 'test-api-key-for-unit-testing';
      }
      return undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiAnalysisService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AiAnalysisService>(AiAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have analyzeContract method', () => {
    expect(typeof service.analyzeContract).toBe('function');
  });

  it('should have analyzeProcessedDocument method', () => {
    expect(typeof service.analyzeProcessedDocument).toBe('function');
  });

  it('should have analyzeContractText method', () => {
    expect(typeof service.analyzeContractText).toBe('function');
  });

  it('should have analyzeContractImage method', () => {
    expect(typeof service.analyzeContractImage).toBe('function');
  });

  describe('analyzeContract', () => {
    it('should accept AnalyzeContractDto with image data', () => {
      const dto: AnalyzeContractDto = {
        image: 'base64-encoded-image-data',
        mimeType: 'image/jpeg',
      };

      // Just verify the method accepts the correct parameters and returns a promise
      const result = service.analyzeContract(dto);
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Promise);
    });
  });
});
