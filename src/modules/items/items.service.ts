import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from '../redis/redis.service';
import { Item } from '../../common/interfaces/item.interface';
import { CreateItemDto } from '../../common/dto/create-item.dto';
import { UpdateItemDto } from '../../common/dto/update-item.dto';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);
  private readonly ITEMS_KEY = 'items';

  constructor(private readonly redisService: RedisService) {}

  private getItemKey(id: string): string {
    return `${this.ITEMS_KEY}:${id}`;
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const id = uuidv4();
    const now = new Date();
    
    const item: Item = {
      id,
      name: createItemDto.name,
      description: createItemDto.description || '',
      createdAt: now,
      updatedAt: now,
    };

    const itemKey = this.getItemKey(id);
    
    // Use Redis pipeline for atomic operations
    const operations = [
      () => this.redisService.getClient().hSet(itemKey, 'id', item.id),
      () => this.redisService.getClient().hSet(itemKey, 'name', item.name),
      () => this.redisService.getClient().hSet(itemKey, 'description', item.description),
      () => this.redisService.getClient().hSet(itemKey, 'createdAt', item.createdAt.toISOString()),
      () => this.redisService.getClient().hSet(itemKey, 'updatedAt', item.updatedAt.toISOString()),
      () => this.redisService.getClient().sAdd(this.ITEMS_KEY, id),
    ];

    await this.redisService.executePipeline(operations);
    
    this.logger.log(`Created item with ID: ${id}`);
    return item;
  }

  async findAll(): Promise<Item[]> {
    const itemIds = await this.redisService.getClient().sMembers(this.ITEMS_KEY);
    
    if (itemIds.length === 0) {
      return [];
    }

    const items: Item[] = [];
    
    for (const id of itemIds) {
      const itemKey = this.getItemKey(id);
      const itemData = await this.redisService.hGetAll(itemKey);
      
      if (itemData && Object.keys(itemData).length > 0) {
        items.push(this.mapToItem(itemData));
      }
    }

    return items;
  }

  async findOne(id: string): Promise<Item> {
    const itemKey = this.getItemKey(id);
    const itemData = await this.redisService.hGetAll(itemKey);

    if (!itemData || Object.keys(itemData).length === 0) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return this.mapToItem(itemData);
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const itemKey = this.getItemKey(id);
    const exists = await this.redisService.exists(itemKey);

    if (!exists) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    const now = new Date();
    const operations = [];

    if (updateItemDto.name) {
      operations.push(() => this.redisService.getClient().hSet(itemKey, 'name', updateItemDto.name));
    }

    if (updateItemDto.description !== undefined) {
      operations.push(() => this.redisService.getClient().hSet(itemKey, 'description', updateItemDto.description));
    }

    operations.push(() => this.redisService.getClient().hSet(itemKey, 'updatedAt', now.toISOString()));

    // Use Redis pipeline for atomic operations
    await this.redisService.executePipeline(operations);

    this.logger.log(`Updated item with ID: ${id}`);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const itemKey = this.getItemKey(id);
    const exists = await this.redisService.exists(itemKey);

    if (!exists) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    // Use Redis pipeline for atomic operations
    const operations = [
      () => this.redisService.getClient().del(itemKey),
      () => this.redisService.getClient().sRem(this.ITEMS_KEY, id),
    ];

    await this.redisService.executePipeline(operations);
    this.logger.log(`Deleted item with ID: ${id}`);
  }

  private mapToItem(data: Record<string, string>): Item {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}
