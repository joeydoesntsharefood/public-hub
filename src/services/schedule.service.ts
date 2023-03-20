import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/entities/schedule.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

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

  async getAll(query: any) {
    const options = {
      where: {
        ...query,
      },
    };

    const response = await this.scheduleRepository.find(options);

    if (!response) return null;

    return response;
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
    const response = await this.scheduleRepository.save(data);

    if (!response) return null;

    return response;
  }

  async deleteSchedule(id: number) {
    const options: FindOptionsWhere<Schedule> = {
      id,
    };

    const response = await this.scheduleRepository.delete(options);

    return response;
  }
}
