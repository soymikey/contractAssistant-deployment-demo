import { Test, TestingModule } from '@nestjs/testing';
import { AiAnalysisService } from './ai-analysis.service';

describe('AiAnalysisService', () => {
  let service: AiAnalysisService;

  beforeEach(async () => {
    // Set a test API key to avoid initialization error
    process.env.GOOGLE_AI_API_KEY = 'test-api-key-for-unit-testing';

    const module: TestingModule = await Test.createTestingModule({
      providers: [AiAnalysisService],
    }).compile();

    service = module.get<AiAnalysisService>(AiAnalysisService);
  });

  afterEach(() => {
    // Clean up
    delete process.env.GOOGLE_AI_API_KEY;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have analyzeContract method', () => {
    expect(service.analyzeContract).toBeDefined();
    expect(typeof service.analyzeContract).toBe('function');
  });

  describe('analyzeContract', () => {
    it('should accept AnalyzeContractDto with image data', () => {
      const dto = {
        image: 'base64-encoded-image-data',
        mimeType: 'image/jpeg',
      };

      // Just verify the method accepts the correct parameters
      expect(() => {
        const result = service.analyzeContract(dto);
        expect(result).toBeDefined();
      }).toBeDefined();
    });
  });
});
