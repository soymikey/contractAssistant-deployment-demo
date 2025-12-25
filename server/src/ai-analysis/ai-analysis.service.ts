import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalyzeContractDto } from './dto/analyze-contract.dto';
import { AnalysisResult } from './interfaces/analysis-result.interface';

@Injectable()
export class AiAnalysisService {
  private readonly logger = new Logger(AiAnalysisService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      this.logger.warn('GOOGLE_AI_API_KEY is not configured properly');
      throw new Error('GOOGLE_AI_API_KEY is not configured. Please add it to your .env file');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.logger.log('Google Gemini AI initialized successfully');
  }

  async analyzeContract(dto: AnalyzeContractDto): Promise<AnalysisResult> {
    try {
      this.logger.log('Starting contract analysis...');

      // Convert base64 to proper format for Gemini
      const imageData = this.prepareImageData(dto.image, dto.mimeType);

      // Construct the prompt (in English, but ask for Chinese response)
      const prompt = `You are a professional contract analysis assistant. Please analyze this contract image and provide:

1. **Risk Identification**: Identify potential legal risks and unfavorable terms
2. **Key Terms**: Extract important rights and obligations clauses
3. **Professional Recommendations**: Provide precautions before signing

Please return the result in JSON format with the following structure:
{
  "summary": "Brief overall analysis summary",
  "riskLevel": "high|medium|low",
  "risks": [
    {
      "title": "Risk title",
      "description": "Detailed description",
      "severity": "high|medium|low"
    }
  ],
  "keyTerms": [
    {
      "title": "Key term title",
      "content": "Term content",
      "importance": "critical|important|normal"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

IMPORTANT: Please respond in Chinese (Simplified) for all text content in the JSON response.
Return ONLY the JSON object, no additional text or markdown formatting.`;

      // Call Gemini API
      const result = await this.model.generateContent([
        prompt,
        imageData,
      ]);

      const response = await result.response;
      const text = response.text();

      this.logger.log('Received response from Gemini API');

      // Parse the JSON response
      const analysisData = this.parseAnalysisResponse(text);

      // Add timestamp
      const analysisResult: AnalysisResult = {
        ...analysisData,
        analyzedAt: new Date().toISOString(),
      };

      this.logger.log('Contract analysis completed successfully');
      return analysisResult;

    } catch (error) {
      this.logger.error('Error analyzing contract:', error.message);
      
      if (error.message?.includes('API key')) {
        throw new BadRequestException('Invalid API key configuration');
      }
      
      throw new BadRequestException(`Failed to analyze contract: ${error.message}`);
    }
  }

  private prepareImageData(base64Image: string, mimeType?: string): any {
    // Remove data URL prefix if present
    let imageBase64 = base64Image;
    if (base64Image.includes('base64,')) {
      imageBase64 = base64Image.split('base64,')[1];
    }

    // Determine mime type
    let imageMimeType = mimeType || 'image/jpeg';
    if (base64Image.startsWith('data:')) {
      const match = base64Image.match(/data:([^;]+);/);
      if (match) {
        imageMimeType = match[1];
      }
    }

    return {
      inlineData: {
        data: imageBase64,
        mimeType: imageMimeType,
      },
    };
  }

  private parseAnalysisResponse(text: string): Omit<AnalysisResult, 'analyzedAt'> {
    try {
      // Remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(cleanText);

      // Validate required fields
      if (!parsed.summary || !parsed.riskLevel || !Array.isArray(parsed.risks)) {
        throw new Error('Invalid response format from AI');
      }

      return {
        summary: parsed.summary,
        riskLevel: parsed.riskLevel,
        risks: parsed.risks || [],
        keyTerms: parsed.keyTerms || [],
        recommendations: parsed.recommendations || [],
      };

    } catch (error) {
      this.logger.error('Failed to parse AI response:', error.message);
      this.logger.debug('Raw response:', text);

      // Return a fallback result
      return {
        summary: '分析结果解析失败，但图片已成功识别',
        riskLevel: 'medium',
        risks: [
          {
            title: '解析错误',
            description: '无法解析AI返回的分析结果，请稍后重试',
            severity: 'medium',
          },
        ],
        keyTerms: [],
        recommendations: ['请重新拍照并尝试分析', '确保合同图片清晰可见'],
      };
    }
  }
}
