import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RPMLink } from 'src/entities/rpmlink.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { QueryError } from 'mysql2';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(RPMLink)
    private avatarRepository: Repository<RPMLink>,
  ) {}

  async findAll(query: any): Promise<RPMLink[]> {
    const options: FindManyOptions<RPMLink> = {
      where: {
        ...query,
      },
    };

    const response = await this.avatarRepository.find(options);

    if (!response)
      throw new Error('Não foi possível encontrar o dados solicitados.');

    return response;
  }

  async create(link: string): Promise<RPMLink> {
    const data = { link };

    const response = await this.avatarRepository.save(data);

    return response;
  }

  async findOne(id: number): Promise<RPMLink | QueryError> {
    const options: FindOneOptions = {
      where: { id },
    };

    const response = await this.avatarRepository.findOne(options);

    return response;
  }

  async editOne(id: number, data: Partial<RPMLink>) {
    const response = await this.avatarRepository.update({ id }, data);

    console.log(response);

    if (!response) throw new Error('Não foi possível atualizar o seu avatar.');

    return response;
  }

  async delete(id: number) {
    const response = await this.avatarRepository.delete({ id });

    if (!response) throw new Error('Não foi possível deletar o avatar.');

    return response;
  }
}
