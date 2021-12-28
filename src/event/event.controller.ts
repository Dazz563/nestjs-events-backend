import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, ValidationPipe, UsePipes, Logger, Query, NotFoundException, UseGuards, SerializeOptions, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { ListEvents } from './dto/list.events';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';

@Controller('event')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventController {

  private readonly logger = new Logger(EventController.name);

  constructor(
    private readonly eventService: EventService,
  ) {
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UsePipes(new ValidationPipe({ groups: ['create'] }))
  @UseInterceptors(ClassSerializerInterceptor)
  create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return this.eventService.createEvent(createEventDto, user);
  }

  @Get()
  @UseGuards(AuthGuardJwt)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {

    // this.logger.log(`Hit the findAll route`);
    const events = await this.eventService.findAll();

    // Using query builder 
    // const events = await this.eventService.getEventsWithAttendeeCountFilteredPaginated(
    //   filter,
    //   {
    //     total: true,
    //     currentPage: filter.page,
    //     limit: 10
    //   }
    // );
    // this.logger.debug(`Found ${events.length} events`);

    return events;


  }

  @Get(':id')
  // @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: string): Promise<Event> {
    // return this.eventService.findOne(+id);

    // Using query builder
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UsePipes(new ValidationPipe({ groups: ['update'] }))
  @UseInterceptors(ClassSerializerInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    return this.eventService.update(+id, updateEventDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.eventService.remove(+id, user);

    // Using query builder 
    // const result = await this.eventService.deleteEvent(+id, user);


    // if (result?.affected !== 1) {
    //   throw new NotFoundException(`No event exists with id: ${id}`);
    // }
  }

  @Post('/add-attendee/:id')
  @UseGuards(AuthGuardJwt)
  async addAttendee(@Param('id') id: string, @Body('name') name: string): Promise<Event> {
    return await this.eventService.addAttendee(+id, name);
  }
}
