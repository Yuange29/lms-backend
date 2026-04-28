import { Lesson } from 'src/lessons/entities/lesson.entity';
import { User } from 'src/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column()
  lesson_id!: string;

  @ManyToOne(() => User, (user) => user.progress, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.progress, { nullable: true })
  @JoinColumn({ name: 'lesson_id' })
  lesson!: Lesson;

  @Column({ default: false })
  is_completed!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  completed_at!: Date | null;
}
