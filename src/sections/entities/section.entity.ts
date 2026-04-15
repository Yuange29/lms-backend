import { Course } from 'src/courses/entities/course.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sections')
export class Section {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  course_id!: string;

  @ManyToOne(() => Course, (course) => course.sections, { nullable: true })
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @Column()
  title!: string;

  @Column({ default: 0 })
  order_index!: number;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.section, { nullable: true })
  lessons!: Lesson[];
}
