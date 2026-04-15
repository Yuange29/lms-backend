import { Progress } from 'src/progress/entities/progress.entity';
import { Section } from 'src/sections/entities/section.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  section_id!: string;

  @ManyToOne(() => Section, (section) => section.lessons, { nullable: true })
  @JoinColumn({ name: 'section_id' })
  section!: Section;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  content!: string;

  @Column({ nullable: true, default: '' })
  video_url!: string;

  @Column({ default: 0 })
  duration!: number; // seconds

  @Column({ default: 0 })
  order_index!: number;

  @Column({ default: false })
  is_preview!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Progress, (progress) => progress.lesson, { nullable: true })
  progress!: Progress[];
}
