import { ApiProperty } from '@nestjs/swagger';

export class ItemResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the item',
    example: 'Sample Item',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the item',
    example: 'This is a sample item description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'The creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'The last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: string;
}
