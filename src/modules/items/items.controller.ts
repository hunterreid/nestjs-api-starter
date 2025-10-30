import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from '../../common/dto/create-item.dto';
import { UpdateItemDto } from '../../common/dto/update-item.dto';
import { ItemResponseDto } from '../../common/dto/item-response.dto';

@ApiTags('items')
@Controller('items')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiBody({ type: CreateItemDto })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created.',
    type: ItemResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createItemDto: CreateItemDto): Promise<ItemResponseDto> {
    const item = await this.itemsService.create(createItemDto);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({
    status: 200,
    description: 'Return all items.',
    type: [ItemResponseDto],
  })
  async findAll(): Promise<ItemResponseDto[]> {
    const items = await this.itemsService.findAll();
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by ID' })
  @ApiParam({ name: 'id', description: 'The UUID of the item' })
  @ApiResponse({
    status: 200,
    description: 'Return the item.',
    type: ItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async findOne(@Param('id') id: string): Promise<ItemResponseDto> {
    const item = await this.itemsService.findOne(id);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an item' })
  @ApiParam({ name: 'id', description: 'The UUID of the item' })
  @ApiBody({ type: UpdateItemDto })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully updated.',
    type: ItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
    const item = await this.itemsService.update(id, updateItemDto);
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an item' })
  @ApiParam({ name: 'id', description: 'The UUID of the item' })
  @ApiResponse({
    status: 204,
    description: 'The item has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.itemsService.remove(id);
  }
}
