import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { DeleteResult, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { ListEvents, WhenEventFilter } from './dto/list.events';
import { UpdateEventDto } from './dto/update-event.dto';
import { Attendee, AttendeeAnswerEnum } from './entities/attendee.entity';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {

  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepo: Repository<Attendee>,
  ) { }

  async addAttendee(id: number, attendeeName: string): Promise<Event> {
    const event = await this.findOne(id);

    const attendee = new Attendee();
    attendee.name = attendeeName;

    event.attendees.push(attendee);

    return await this.eventRepo.save(event);
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {

    return await this.eventRepo.save({
      ...createEventDto,
      when: new Date(createEventDto.when),
    });
  }

  async findAll(): Promise<Event[]> {
    return await this.eventRepo.find();
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepo.findOne(id);

    if (!event) {
      throw new NotFoundException(`No event exists with id: ${id}`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);

    return await this.eventRepo.save({
      ...event,
      ...updateEventDto,
      when: updateEventDto.when ? new Date(updateEventDto.when) : event.when,
    })
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);

    await this.eventRepo.remove(event);
  }

  ///////////////////////////////////////////////////////////////////
  // Using query builder

  private getEventsBaseQuery() {
    return this.eventRepo
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  private async getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    let query = this.getEventsWithAttendeeCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`
        )
      }
      if (filter.when == WhenEventFilter.Tomorrow) {
        query = query.andWhere(
          `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`
        )
      }
      if (filter.when == WhenEventFilter.ThisWeek) {
        query = query.andWhere(
          'YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)'
        )
      }
      if (filter.when == WhenEventFilter.NextWeek) {
        query = query.andWhere(
          'YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1)'
        )
      }
    }

    return await query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions
    )
  }

  public async getEvent(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeeCountQuery()
      .andWhere('e.id = :id', { id })

    // this.logger.debug(query.getSql());

    return await query.getOne();
  }

  public getEventsWithAttendeeCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap(
        'e.attendeeCount', 'e.attendees'
      )
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) => qb
          .where('attendee.answer = :answer',
            { answer: AttendeeAnswerEnum.Accepted })
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) => qb
          .where('attendee.answer = :answer',
            { answer: AttendeeAnswerEnum.Maybe })
      )
      .loadRelationCountAndMap(
        'e.attendeerejected',
        'e.attendees',
        'attendee',
        (qb) => qb
          .where('attendee.answer = :answer',
            { answer: AttendeeAnswerEnum.Rejected })
      )
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventRepo
      .createQueryBuilder('e')
      .delete()
      .where('id = : id', { id })
      .execute();
  }
}
