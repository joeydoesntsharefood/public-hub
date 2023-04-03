import axios from 'axios';

export class MailerConsumer {
  constructor(
    private readonly baseUrl: string = 'http://agriland11971.c42.integrator.host/mailer',
  ) {}

  async sendRecoveryPasswordToken(data: {
    to: string;
    code: string;
    name: string;
  }): Promise<boolean> {
    try {
      await axios.post(`${this.baseUrl}/forget`, data);

      return true;
    } catch (err: any) {
      return false;
    }
  }

  async sendConfirmationToken(data: {
    to: string;
    code: string;
    name: string;
  }): Promise<boolean> {
    try {
      await axios.post(`${this.baseUrl}/confirmation`, data);

      return true;
    } catch (err: any) {
      return false;
    }
  }

  async sendInviteEvent(data: {
    to;
    eventDate;
    eventHour;
    eventLocation;
    eventName;
  }): Promise<boolean> {
    try {
      await axios.post(`${this.baseUrl}/invite`, data);

      return true;
    } catch (err: any) {
      return false;
    }
  }
}
