import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RPMLink } from 'src/entities/rpmlink.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { QueryError } from 'mysql2';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(RPMLink)
    private avatarRepository: Repository<RPMLink>,
  ) {}

  async findAll(): Promise<RPMLink[]> {
    try {
      const response = await this.avatarRepository.find();

      if (!response)
        throw new Error('Não foi possível encontrar o dados solicitados.');

      return response;
    } catch (err: any) {
      return err;
    }
  }

  async create(data: RPMLink): Promise<RPMLink> {
    return await this.avatarRepository.save(data);
  }

  async findOne(id: number): Promise<RPMLink | QueryError> {
    const options: FindOneOptions = {
      where: { id },
    };

    const response = await this.avatarRepository.findOne(options);

    return response;
  }
}
