import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Url } from '../url/url.entity';

@Entity()
export class Click {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ip: string;

    @Column({ nullable: true })
    browser?: string;

    @Column({ nullable: true })
    os?: string;

    @Column({ nullable: true })
    language?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    clickedAt: Date;

    @ManyToOne(() => Url, (url) => url.clicks, { onDelete: 'CASCADE' })
    url: Url;
}
