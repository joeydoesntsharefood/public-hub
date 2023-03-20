import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoCall } from 'src/entities/videocall.entity';
import { Raw, Repository } from 'typeorm';

@Injectable()
export class VideoCallService {
  constructor(
    @InjectRepository(VideoCall)
    private videoCallRepository: Repository<VideoCall>,
  ) {}

  async create(invitesId: string) {
    const response = await this.videoCallRepository.save({ invitesId });

    return response;
  }

  async findOne(id: string) {
    try {
      const response = await this.videoCallRepository.find();

      if (!response) return null;

      const formatResponse = response?.find((value) =>
        value?.invitesId.split(',').includes(id),
      );

      return formatResponse?.id;
    } catch (err: any) {
      console.log(err);

      return err;
    }
  }
}
