import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import {
  Brackets,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(data: Partial<User>) {
    const options: FindOneOptions<User> = {
      where: {
        ...data,
      },
    };

    const response = await this.userRepository.findOne(options);

    if (!response) return null;

    return response;
  }

  async getAll({
    endAt,
    startAt,
    query,
    search,
    selectColumns,
  }: {
    query: any;
    search: string;
    startAt: string;
    endAt: string;
    selectColumns?: string[];
  }) {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      if (selectColumns && selectColumns.length > 0) {
        queryBuilder.select(selectColumns);
      }

      if (query && Object.keys(query).length > 0) {
        for (const [column, value] of Object.entries(query)) {
          if (value !== undefined) {
            queryBuilder.andWhere(`user.${column} = :${column}`, {
              [column]: value,
            });
          }
        }
      }

      if (search && search.trim().length > 0) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where(`user.name LIKE :search`, {
              search: `%${search}%`,
            })
              .orWhere(`user.lastName LIKE :search`, {
                search: `%${search}%`,
              })
              .orWhere(`user.email LIKE :search`, {
                search: `%${search}%`,
              });
          }),
        );
      }

      if (startAt && endAt) {
        const startDate = new Date(startAt);
        const endDate = new Date(endAt);

        queryBuilder.where(
          'Date(user.verifiedAt) BETWEEN :startDate AND :endDate',
          {
            startDate,
            endDate,
          },
        );
      } else if (startAt) {
        const startDate = new Date(startAt);

        queryBuilder.where('DATE(user.verifiedAt) >= :startDate', {
          startDate,
        });
      } else if (endAt) {
        const endDate = new Date(endAt);

        queryBuilder.where('DATE(user.verifiedAt) <= :endDate', {
          endDate,
        });
      }

      const users = await queryBuilder.getMany();

      return users;
    } catch (err: any) {
      return err;
    }
  }

  async editUser(data: Partial<User>, id: number) {
    const whereOptions: FindOptionsWhere<User> = {
      id,
    };

    const response = await this.userRepository.update(whereOptions, data);

    if (!response) return null;

    return response;
  }

  async createUser(data: Partial<User>) {
    const response = await this.userRepository.save(data);

    if (!response) return null;

    return response;
  }

  async deleteUser(id: number) {
    const options: FindOptionsWhere<User> = {
      id,
    };

    const response = await this.userRepository.delete(options);

    return response;
  }
}
