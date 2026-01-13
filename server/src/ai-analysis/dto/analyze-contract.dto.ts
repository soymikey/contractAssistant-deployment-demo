import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AnalyzeContractDto {
  @IsNotEmpty()
  @IsString()
  image: string; // base64 encoded image string

  @IsOptional()
  @IsString()
  mimeType?: string; // image/jpeg, image/png, etc.

  @IsOptional()
  @IsString()
  fileName?: string; // original filename if uploaded from file
}
