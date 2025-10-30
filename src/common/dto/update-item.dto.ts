import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({
    description: 'The name of the item',
    example: 'Updated Item',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The description of the item',
    example: 'This is an updated item description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
