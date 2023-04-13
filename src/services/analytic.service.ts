import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Analytics } from 'src/entities/analytics.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyticService {
  constructor(
    @InjectRepository(Analytics)
    private analyticsRepository: Repository<Analytics>,
  ) {}

  async createAnalytics(body: Partial<Analytics>) {
    try {
      const response = await this.analyticsRepository.save(body);

      return response;
    } catch (err: any) {
      console.log(err);
      return false;
    }
  }

  async getAnlytics({ startAt, endAt }: { startAt?: string; endAt?: string }) {
    const queryBuilder =
      this.analyticsRepository.createQueryBuilder('analytic');

    if (startAt && endAt) {
      const startDate = new Date(startAt);
      const endDate = new Date(endAt);

      queryBuilder.where(
        'Date(analytic.date) BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    } else if (startAt) {
      const startDate = new Date(startAt);

      queryBuilder.where('DATE(analytic.date) >= :startDate', {
        startDate,
      });
    } else if (endAt) {
      const endDate = new Date(endAt);

      queryBuilder.where('DATE(analytic.date) <= :endDate', {
        endDate,
      });
    }

    const analytics = await queryBuilder.getMany();

    return analytics;
  }
}
