import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GoogleGenerativeAI,
  GenerativeModel,
  Part,
} from '@google/generative-ai';
import { AnalyzeContractDto } from './dto/analyze-contract.dto';
import { AnalysisResult } from './interfaces/analysis-result.interface';
import type { ProcessedDocument } from '../document/interfaces/document.interface';

@Injectable()
export class AiAnalysisService {
  private readonly logger = new Logger(AiAnalysisService.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey || apiKey === 'your_api_key_here') {
      this.logger.warn('GEMINI_API_KEY is not configured properly');
      throw new Error(
        'GEMINI_API_KEY is not configured. Please add it to your .env file',
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for better multimodal support
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
    this.logger.log('Google Gemini AI initialized successfully');
  }

  /**
   * Analyze contract from base64 image (legacy method for direct API calls)
   * @param dto - AnalyzeContractDto with base64 image
   * @returns Analysis result
   */
  async analyzeContract(dto: AnalyzeContractDto): Promise<AnalysisResult> {
    try {
      this.logger.log('Starting contract analysis from base64 image...');

      // Convert base64 to proper format for Gemini
      const imageData = this.prepareImageData(dto.image, dto.mimeType);

      // Call Gemini with multimodal content
      const result = await this.callGeminiMultimodal([imageData]);

      this.logger.log('Contract analysis completed successfully');
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Error analyzing contract:', errorMessage);

      if (errorMessage.includes('API key')) {
        throw new BadRequestException('Invalid API key configuration');
      }

      throw new BadRequestException(
        `Failed to analyze contract: ${errorMessage}`,
      );
    }
  }

  /**
   * Analyze contract from ProcessedDocument (for queue-based analysis)
   * Supports text, images, and PDFs
   * @param document - ProcessedDocument from DocumentService
   * @returns Analysis result
   */
  async analyzeProcessedDocument(
    document: ProcessedDocument,
  ): Promise<AnalysisResult> {
    try {
      this.logger.log(`Analyzing document of type: ${document.type}`);

      if (document.type === 'text' && document.text) {
        // Text-based document (DOCX) - use text analysis
        return await this.analyzeContractText(document.text);
      } else if (
        document.type === 'image' &&
        document.base64 &&
        document.mimeType
      ) {
        // Image or PDF - use multimodal analysis
        const imageData = this.prepareImageData(
          document.base64,
          document.mimeType,
        );
        return await this.callGeminiMultimodal([imageData]);
      } else {
        throw new BadRequestException(
          'Invalid document format: missing required data',
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Error analyzing processed document:', errorMessage);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        `Failed to analyze document: ${errorMessage}`,
      );
    }
  }

  /**
   * Analyze contract from text content
   * @param text - Extracted text from document
   * @returns Analysis result
   */
  async analyzeContractText(text: string): Promise<AnalysisResult> {
    try {
      this.logger.log('Starting text-based contract analysis...');

      const prompt = this.buildAnalysisPrompt();
      const fullPrompt = `${prompt}\n\n--- Contract Text ---\n${text}`;

      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      const responseText = response.text();

      this.logger.log('Received response from Gemini API');

      const analysisData = this.parseAnalysisResponse(responseText);

      return {
        ...analysisData,
        analyzedAt: new Date().toISOString(),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Error analyzing contract text:', errorMessage);
      throw new BadRequestException(
        `Failed to analyze contract text: ${errorMessage}`,
      );
    }
  }

  /**
   * Analyze contract from image buffer
   * @param imageBuffer - Image file buffer
   * @param mimeType - Image MIME type
   * @returns Analysis result
   */
  async analyzeContractImage(
    imageBuffer: Buffer,
    mimeType: string,
  ): Promise<AnalysisResult> {
    try {
      this.logger.log('Starting image-based contract analysis...');

      const base64 = imageBuffer.toString('base64');
      const imageData = this.prepareImageData(base64, mimeType);

      return await this.callGeminiMultimodal([imageData]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Error analyzing contract image:', errorMessage);
      throw new BadRequestException(
        `Failed to analyze contract image: ${errorMessage}`,
      );
    }
  }

  /**
   * Call Gemini with multimodal content (images/PDFs)
   * @param imageParts - Array of image parts
   * @returns Analysis result
   */
  private async callGeminiMultimodal(
    imageParts: Part[],
  ): Promise<AnalysisResult> {
    const prompt = this.buildAnalysisPrompt();

    const result = await this.model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const text = response.text();

    this.logger.log('Received multimodal response from Gemini API');

    const analysisData = this.parseAnalysisResponse(text);

    return {
      ...analysisData,
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Build the analysis prompt
   * @returns Prompt string
   */
  private buildAnalysisPrompt(): string {
    return `You are a professional contract analysis assistant. Please analyze this contract and provide:

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
      "severity": "high|medium|low",
      "category": "legal|financial|operational|compliance|other",
      "suggestion": "Improvement suggestion"
    }
  ],
  "keyTerms": [
    {
      "title": "Key term title",
      "content": "Term content",
      "importance": "critical|important|normal"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "contractInfo": {
    "type": "Contract type if identifiable",
    "parties": ["Party 1", "Party 2"],
    "effectiveDate": "Date if found",
    "expirationDate": "Date if found",
    "totalValue": "Amount if found"
  }
}

IMPORTANT: Please respond in Chinese (Simplified) for all text content in the JSON response.
Return ONLY the JSON object, no additional text or markdown formatting.`;
  }

  /**
   * Prepare image data for Gemini API
   * @param base64Image - Base64 encoded image
   * @param mimeType - Image MIME type
   * @returns Gemini image part
   */
  private prepareImageData(base64Image: string, mimeType?: string): Part {
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

  /**
   * Parse AI response to structured format
   * @param text - Raw AI response text
   * @returns Parsed analysis data
   */
  private parseAnalysisResponse(
    text: string,
  ): Omit<AnalysisResult, 'analyzedAt'> {
    try {
      // Remove markdown code blocks if present
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText
          .replace(/```json\n?/g, '')
          .replace(/```\n?$/g, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\n?/g, '');
      }

      const parsed: Record<string, unknown> = JSON.parse(cleanText) as Record<
        string,
        unknown
      >;

      // Validate required fields
      if (
        typeof parsed.summary !== 'string' ||
        typeof parsed.riskLevel !== 'string' ||
        !Array.isArray(parsed.risks)
      ) {
        throw new Error('Invalid response format from AI');
      }

      const summary = parsed.summary;
      const riskLevel = parsed.riskLevel as 'high' | 'medium' | 'low';
      const risks = (parsed.risks as unknown[]) || [];
      const keyTerms = (parsed.keyTerms as unknown[]) || [];
      const recommendations = (parsed.recommendations as string[]) || [];
      const contractInfo = parsed.contractInfo as
        | AnalysisResult['contractInfo']
        | undefined;

      return {
        summary,
        riskLevel,
        risks: risks as AnalysisResult['risks'],
        keyTerms: keyTerms as AnalysisResult['keyTerms'],
        recommendations,
        contractInfo,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Failed to parse AI response:', errorMessage);
      this.logger.debug('Raw response:', text);

      // Return a fallback result
      return {
        summary: '分析结果解析失败，但文档已成功识别',
        riskLevel: 'medium',
        risks: [
          {
            title: '解析错误',
            description: '无法解析AI返回的分析结果，请稍后重试',
            severity: 'medium',
          },
        ],
        keyTerms: [],
        recommendations: ['请重新上传文档并尝试分析', '确保文档内容清晰可见'],
      };
    }
  }
}
