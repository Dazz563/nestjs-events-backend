import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ValidationPipe, UsePipes, Logger } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Controller('event')
export class EventController {

  private readonly logger = new Logger(EventController.name);

  constructor(
    private readonly eventService: EventService,
  ) {
  }

  @Post()
  @UsePipes(new ValidationPipe({ groups: ['create'] }))
  create(
    @Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(createEventDto);
  }

  @Get()
  async findAll(): Promise<Event[]> {

    this.logger.log(`Hit the findAll route`);

    const events = await this.eventService.findAll();

    this.logger.debug(`Found ${events.length} events`);

    return events;
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Event> {
    // return this.eventService.findOne(+id);

    // Using query builder
    return this.eventService.getEvent(+id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ groups: ['update'] }))
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): Promise<void> {
    return this.eventService.remove(+id);
  }

  @Post('/add-attendee/:id')
  async addAttendee(@Param('id') id: string, @Body('name') name: string): Promise<Event> {
    return await this.eventService.addAttendee(+id, name);
  }
}
