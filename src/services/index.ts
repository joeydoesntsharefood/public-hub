import { DeveloperService } from './developer.service';
import { ScheduleService } from './schedule.service';
import { UserService } from './user.service';
import { VideoCall } from 'src/entities/videocall.entity';
import { AuthService } from './auth.service';
import { AvatarService } from './avatar.service';
import { ContentService } from './content.service';
import { VideoCallService } from './videocall.service';
import { AnalyticService } from './analytic.service';

const Services = {
  AuthService,
  DeveloperService,
  ScheduleService,
  UserService,
  VideoCall,
  AvatarService,
  ContentService,
  VideoCallService,
  AnalyticService,
};

export default Services;
