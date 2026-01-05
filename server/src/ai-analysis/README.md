# AI Analysis Module

This module provides AI-powered contract analysis capabilities using Google Gemini 1.5 Flash model.

## Overview

The AI Analysis module supports:
- **Multimodal analysis**: PDF, DOCX, DOC, and image files (JPEG, PNG, WebP)
- **Async processing**: Queue-based analysis for production use
- **Progress tracking**: Real-time status and progress updates
- **Risk identification**: Automatic risk categorization and suggestions

## API Endpoints

All endpoints require JWT authentication (except `/analyses/analyze` and `/analyses/health`).

Base URL: `/api/v1/analyses`

### 1. Submit Contract for Analysis

**POST** `/analyses`

Submits a contract for AI analysis. The analysis is processed asynchronously via a job queue.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "contractId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**
```json
{
  "jobId": "123",
  "analysisLogId": "660e8400-e29b-41d4-a716-446655440001",
  "status": "pending",
  "message": "Analysis job submitted successfully"
}
```

**Error Responses:**
- `400` - Invalid contract ID
- `401` - Unauthorized
- `403` - Contract belongs to another user
- `404` - Contract not found

---

### 2. Get Analysis Status

**GET** `/analyses/status/:analysisLogId`

Returns the current status and progress of an analysis job.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "contractId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "progress": 45,
  "error": null,
  "startedAt": "2026-01-05T10:00:00.000Z",
  "completedAt": null
}
```

**Status Values:**
- `pending` - Job is in queue
- `processing` - Analysis in progress
- `completed` - Analysis finished successfully
- `failed` - Analysis failed (check `error` field)

---

### 3. Get Analysis Result

**GET** `/analyses/contract/:contractId`

Returns the latest analysis result for a contract.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "contractId": "550e8400-e29b-41d4-a716-446655440000",
  "type": "full",
  "overviewData": {
    "summary": "This is a standard service agreement with moderate risk level...",
    "riskLevel": "medium",
    "keyTerms": [
      {
        "title": "Payment Terms",
        "content": "Net 30 days from invoice date",
        "importance": "critical"
      }
    ],
    "contractInfo": {
      "type": "Service Agreement",
      "parties": ["Company A", "Company B"],
      "effectiveDate": "2026-01-01",
      "expirationDate": "2027-01-01",
      "totalValue": "$50,000"
    },
    "analyzedAt": "2026-01-05T10:05:00.000Z"
  },
  "suggestionsData": {
    "recommendations": [
      "Consider adding a termination clause",
      "Clarify liability limitations"
    ]
  },
  "createdAt": "2026-01-05T10:05:00.000Z",
  "risks": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "title": "Unlimited Liability",
      "description": "The contract does not specify liability caps",
      "level": "high",
      "category": "legal",
      "suggestion": "Add a liability limitation clause",
      "clauseRef": "Section 5.2"
    }
  ]
}
```

---

### 4. Get Contract Risks

**GET** `/analyses/contract/:contractId/risks`

Returns all identified risks for a contract.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "title": "Unlimited Liability",
    "description": "The contract does not specify liability caps",
    "level": "high",
    "category": "legal",
    "suggestion": "Add a liability limitation clause",
    "clauseRef": "Section 5.2"
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440004",
    "title": "Auto-renewal Clause",
    "description": "Contract auto-renews without explicit notice period",
    "level": "medium",
    "category": "operational",
    "suggestion": "Require 60-day advance notice for renewal",
    "clauseRef": "Section 8.1"
  }
]
```

**Risk Levels:** `high`, `medium`, `low`

**Risk Categories:** `legal`, `financial`, `operational`, `compliance`, `other`

---

### 5. Get Analysis History

**GET** `/analyses/contract/:contractId/history`

Returns the analysis history for a contract.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "contractId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-id",
    "status": "completed",
    "progress": 100,
    "error": null,
    "startedAt": "2026-01-05T10:00:00.000Z",
    "completedAt": "2026-01-05T10:05:00.000Z"
  }
]
```

---

### 6. Direct Analysis (Sync)

**POST** `/analyses/analyze`

Performs synchronous analysis on a base64-encoded contract image. **For testing only** - use the queue-based endpoint for production.

**Request Body:**
```json
{
  "image": "base64-encoded-image-data",
  "mimeType": "image/jpeg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": "...",
    "riskLevel": "medium",
    "risks": [...],
    "keyTerms": [...],
    "recommendations": [...]
  }
}
```

---

### 7. Health Check

**POST** `/analyses/health`

Check if the AI Analysis service is running.

**Response (200):**
```json
{
  "status": "ok",
  "message": "AI Analysis service is running"
}
```

---

## Frontend Integration

### TypeScript Types

```typescript
// Request/Response Types
interface SubmitAnalysisRequest {
  contractId: string;
}

interface SubmitAnalysisResponse {
  jobId: string;
  analysisLogId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
}

interface AnalysisStatus {
  id: string;
  contractId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  error?: string;
  startedAt: Date;
  completedAt?: Date;
}

interface RiskItem {
  id: string;
  title: string;
  description: string;
  level: 'high' | 'medium' | 'low';
  category?: 'legal' | 'financial' | 'operational' | 'compliance' | 'other';
  suggestion?: string;
  clauseRef?: string;
}

interface KeyTerm {
  title: string;
  content: string;
  importance: 'critical' | 'important' | 'normal';
}

interface ContractInfo {
  type?: string;
  parties?: string[];
  effectiveDate?: string;
  expirationDate?: string;
  totalValue?: string;
}

interface OverviewData {
  summary: string;
  riskLevel: 'high' | 'medium' | 'low';
  keyTerms: KeyTerm[];
  contractInfo?: ContractInfo;
  analyzedAt: string;
}

interface SuggestionsData {
  recommendations: string[];
}

interface AnalysisResult {
  id: string;
  contractId: string;
  type: string;
  overviewData: OverviewData;
  suggestionsData: SuggestionsData;
  createdAt: Date;
  risks: RiskItem[];
}
```

### Example: Analysis Service

```typescript
import { apiClient } from './api';

class AnalysisService {
  private readonly endpoint = '/analyses';

  // Submit contract for analysis
  async submitAnalysis(contractId: string): Promise<SubmitAnalysisResponse> {
    const response = await apiClient.post(this.endpoint, { contractId });
    return response.data;
  }

  // Get analysis status
  async getStatus(analysisLogId: string): Promise<AnalysisStatus> {
    const response = await apiClient.get(`${this.endpoint}/status/${analysisLogId}`);
    return response.data;
  }

  // Get analysis result
  async getResult(contractId: string): Promise<AnalysisResult> {
    const response = await apiClient.get(`${this.endpoint}/contract/${contractId}`);
    return response.data;
  }

  // Get risks only
  async getRisks(contractId: string): Promise<RiskItem[]> {
    const response = await apiClient.get(`${this.endpoint}/contract/${contractId}/risks`);
    return response.data;
  }

  // Get analysis history
  async getHistory(contractId: string): Promise<AnalysisStatus[]> {
    const response = await apiClient.get(`${this.endpoint}/contract/${contractId}/history`);
    return response.data;
  }
}

export const analysisService = new AnalysisService();
```

### Example: Complete Analysis Flow

```typescript
import { analysisService } from './services/analysisService';

async function analyzeContract(contractId: string) {
  try {
    // 1. Submit analysis request
    const { analysisLogId } = await analysisService.submitAnalysis(contractId);
    console.log('Analysis submitted, tracking ID:', analysisLogId);

    // 2. Poll for status
    const result = await pollUntilComplete(analysisLogId, contractId);
    
    // 3. Display results
    console.log('Analysis complete:', result);
    return result;
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
}

async function pollUntilComplete(
  analysisLogId: string,
  contractId: string,
  onProgress?: (progress: number) => void
): Promise<AnalysisResult> {
  const POLL_INTERVAL = 3000; // 3 seconds
  const MAX_ATTEMPTS = 100;   // 5 minutes max
  
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      attempts++;
      
      if (attempts > MAX_ATTEMPTS) {
        reject(new Error('Analysis timeout'));
        return;
      }

      try {
        const status = await analysisService.getStatus(analysisLogId);
        
        // Update progress
        onProgress?.(status.progress);

        if (status.status === 'completed') {
          // Fetch full result
          const result = await analysisService.getResult(contractId);
          resolve(result);
        } else if (status.status === 'failed') {
          reject(new Error(status.error || 'Analysis failed'));
        } else {
          // Continue polling
          setTimeout(poll, POLL_INTERVAL);
        }
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}
```

### Example: React Hook

```typescript
import { useState, useCallback } from 'react';
import { analysisService } from './services/analysisService';

export function useContractAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (contractId: string) => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      // Submit analysis
      const { analysisLogId } = await analysisService.submitAnalysis(contractId);

      // Poll for completion
      const analysisResult = await pollUntilComplete(
        analysisLogId,
        contractId,
        setProgress
      );

      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    analyze,
    isAnalyzing,
    progress,
    result,
    error,
  };
}

// Usage in component
function ContractAnalysisButton({ contractId }: { contractId: string }) {
  const { analyze, isAnalyzing, progress, result, error } = useContractAnalysis();

  const handleAnalyze = async () => {
    try {
      await analyze(contractId);
    } catch {
      // Error already set in hook
    }
  };

  return (
    <View>
      <Button 
        title={isAnalyzing ? `Analyzing... ${progress}%` : 'Analyze Contract'}
        onPress={handleAnalyze}
        disabled={isAnalyzing}
      />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {result && <AnalysisResultView result={result} />}
    </View>
  );
}
```

---

## Environment Configuration

Required environment variable:

```env
GEMINI_API_KEY=your-gemini-api-key
```

---

## Architecture

```
ai-analysis/
├── dto/
│   ├── analysis.dto.ts       # Request/Response DTOs
│   ├── analyze-contract.dto.ts
│   └── index.ts
├── interfaces/
│   └── analysis-result.interface.ts
├── ai-analysis.controller.ts  # REST API endpoints
├── ai-analysis.module.ts      # Module configuration
├── ai-analysis.service.ts     # Gemini AI integration
├── analysis.service.ts        # Business logic + database
└── README.md                  # This file
```

### Services

- **AiAnalysisService**: Direct integration with Gemini AI
  - `analyzeContract()` - Analyze base64 image
  - `analyzeProcessedDocument()` - Analyze processed document
  - `analyzeContractText()` - Analyze text content
  - `analyzeContractImage()` - Analyze image buffer

- **AnalysisService**: Business logic layer
  - `submitAnalysis()` - Submit to queue, create log
  - `processAnalysis()` - Called by queue processor
  - `storeAnalysisResults()` - Save to database
  - `getAnalysisStatus()` - Get job status
  - `getAnalysisResult()` - Get stored result
  - `getRisks()` - Get risk items
  - `getAnalysisHistory()` - Get analysis history

### Processing Flow

```
1. POST /analyses
   └── AnalysisService.submitAnalysis()
       ├── Create AnalysisLog (status: pending)
       └── Add job to Bull Queue

2. Queue Processor (async)
   └── AnalysisProcessor.handleAnalysis()
       ├── Read contract file
       ├── DocumentService.processDocument()
       ├── AiAnalysisService.analyzeProcessedDocument()
       ├── AnalysisService.storeAnalysisResults()
       └── Update Contract status

3. GET /analyses/status/:id
   └── Poll until status === 'completed'

4. GET /analyses/contract/:id
   └── Return stored analysis result
```

---

## Supported File Types

| Type | MIME Type | Processing |
|------|-----------|------------|
| PDF | application/pdf | Direct to Gemini (multimodal) |
| DOCX | application/vnd.openxmlformats-officedocument.wordprocessingml.document | Text extraction |
| DOC | application/msword | Text extraction |
| JPEG | image/jpeg | Direct to Gemini (multimodal) |
| PNG | image/png | Direct to Gemini (multimodal) |
| WebP | image/webp | Direct to Gemini (multimodal) |

---

## Error Handling

All endpoints return standard error responses:

```json
{
  "statusCode": 404,
  "message": "Contract not found",
  "error": "Not Found"
}
```

Common error codes:
- `400` - Bad request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (accessing another user's data)
- `404` - Not found (contract/analysis not found)
- `500` - Internal server error (AI service failure)
