import { EnrollmentStatus } from 'src/common/enums/enrollment.enum';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column()
  course_id!: string;

  @ManyToOne(() => User, (user) => user.enrollments, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Course, (course) => course.enrollments, { nullable: true })
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @CreateDateColumn()
  enrolled_at!: Date;

  @Column({ default: 'active' })
  status!: EnrollmentStatus;
}
