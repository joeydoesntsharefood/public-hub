import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Painels } from 'src/entities/painels.entity';
import { PainelsNames } from 'src/entities/painelsnames.entity';
import { Brackets, FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Painels)
    private painelsRepository: Repository<Painels>,
    @InjectRepository(PainelsNames)
    private painelsNameRepository: Repository<PainelsNames>,
  ) {}

  async getAllContents(query: any) {
    const options = {
      where: {
        ...query,
      },
    };

    const response = await this.painelsRepository.find(options);

    return response;
  }

  async getAllPainels(query?: any, search?: string) {
    const queryBuilder =
      this.painelsNameRepository.createQueryBuilder('painelsNames');

    if (query && Object.keys(query).length > 0) {
      for (const [column, value] of Object.entries(query)) {
        if (value !== undefined) {
          queryBuilder.andWhere(`painelsNames.${column} = :${column}`, {
            [column]: value,
          });
        }
      }
    }

    if (search && search.trim().length > 0) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`painelsNames.name LIKE :search`, {
            search: `%${search}%`,
          });
        }),
      );
    }

    const painels = await queryBuilder.getMany();

    return painels;
  }

  async editPainelsName(query: any, body: Partial<PainelsNames>) {
    const options: FindOptionsWhere<PainelsNames> = {
      ...query,
    };

    const response = await this.painelsNameRepository.update(options, body);

    return response;
  }

  async createContents(body: Partial<Painels>) {
    const response = await this.painelsRepository.save(body);

    return response;
  }

  async deleteContentInEdit(painelId: number) {
    const options: FindOptionsWhere<Painels> = {
      painelId,
    };

    const response = await this.painelsRepository.delete(options);

    return response;
  }
}
