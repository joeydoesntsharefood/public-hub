import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

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

  async getAll() {
    try {
      const response = await this.userRepository.find();

      if (!response)
        throw new Error('Não foi possível encontrar o dados solicitados.');

      return response;
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
}
