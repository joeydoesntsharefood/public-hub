import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import {
  Brackets,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findOne(data?: Partial<Schedule>) {
    const options: FindOneOptions<Schedule> = {
      where: {
        ...data,
      },
    };

    const response = await this.scheduleRepository.findOne(options);

    if (!response) return null;

    return response;
  }

  async getAll({
    query,
    endAt,
    startAt,
    search,
  }: {
    startAt: string;
    endAt: string;
    query: any;
    search: string;
  }) {
    console.log(query);

    const queryBuilder = this.scheduleRepository.createQueryBuilder('schedule');

    if (query && Object.keys(query).length > 0) {
      for (const [column, value] of Object.entries(query)) {
        if (value !== undefined) {
          queryBuilder.andWhere(`schedule.${column} = :${column}`, {
            [column]: value,
          });
        }
      }
    }

    if (search && search.trim().length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`schedule.eventName LIKE :search`, {
            search: `%${search}%`,
          });
        }),
      );
    }

    if (startAt && endAt) {
      queryBuilder.where('schedule.verifiedAt BETWEEN :startAt AND :endAt', {
        startAt,
        endAt,
      });
    } else if (startAt) {
      queryBuilder.where('schedule.verifiedAt >= :startAt', {
        startAt,
      });
    } else if (endAt) {
      queryBuilder.where('schedule.verifiedAt <= :endAt', {
        endAt,
      });
    }

    const schedules = await queryBuilder.getMany();

    return schedules;
  }

  async editSchedule(data: Partial<Schedule>, id: number) {
    const whereOptions: FindOptionsWhere<Schedule> = {
      id,
    };

    const response = await this.scheduleRepository.update(whereOptions, data);

    if (!response) return null;

    return response;
  }

  async createSchedule(data: Partial<Schedule>) {
    try {
      const response = await this.scheduleRepository.save(data);

      if (!response) return null;

      return response;
    } catch (err: any) {
      console.log(err);
    }
  }

  async deleteSchedule(id: number) {
    const options: FindOptionsWhere<Schedule> = {
      id,
    };

    const response = await this.scheduleRepository.delete(options);

    return response;
  }
}
