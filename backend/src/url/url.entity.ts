import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import { User } from '../user/user.entity';
import {Click} from "../click/click.entity";

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    slug: string;

    @Column()
    originalUrl: string;

    @ManyToOne(() => User, (user) => user.urls, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Click, (click) => click.url)
    clicks: Click[];

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;


}
