import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {

  constructor(
    @InjectRepository(Event)
    private readonly repo: Repository<Event>,
  ) { }

  async create(createEventDto: CreateEventDto): Promise<Event> {

    return await this.repo.save({
      ...createEventDto,
      when: new Date(createEventDto.when),
    });
  }

  async findAll(): Promise<Event[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Event> {
    return await this.repo.findOne(id);
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);

    return await this.repo.save({
      ...event,
      ...updateEventDto,
      when: updateEventDto.when ? new Date(updateEventDto.when) : event.when,
    })
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);

    await this.repo.remove(event);
  }
}
