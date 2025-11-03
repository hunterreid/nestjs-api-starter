import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    description: 'The name of the item',
    example: 'Sample Item',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the item',
    example: 'This is a sample item description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
