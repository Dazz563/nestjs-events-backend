import { Expose } from "class-transformer";
import { User } from "src/auth/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Attendee } from "./attendee.entity";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column()
    @Expose()
    name: string;

    @Column()
    @Expose()
    description: string;

    @Column()
    @Expose()
    when: Date;

    @Column()
    @Expose()
    address: string;

    @OneToMany(() => Attendee, (attendee) => attendee.event, {
        eager: true,
        cascade: true,
    })
    @Expose()
    attendees: Attendee[];

    @ManyToOne(() => User, (user) => user.organized)
    @Expose()
    organizer: User;

    @Column({ nullable: true })
    organizer_Id: number;

    // Virtual properties
    @Expose()
    attendeeCount?: number;
    @Expose()
    attendeeRejected?: number;
    @Expose()
    attendeeMaybe?: number;
    @Expose()
    attendeeAccepted?: number;
}
