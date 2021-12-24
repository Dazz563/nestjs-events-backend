import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Attendee } from './entities/attendee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      Attendee
    ]),
  ],
  controllers: [EventController],
  providers: [EventService]
})
export class EventModule { }
