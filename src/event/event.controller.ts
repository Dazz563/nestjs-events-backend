import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ValidationPipe, UsePipes } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
  ) {
  }

  @Post()
  @UsePipes(new ValidationPipe({ groups: ['create'] }))
  create(
    @Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ groups: ['update'] }))
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
