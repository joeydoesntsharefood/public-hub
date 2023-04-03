import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly secret = 'pub-2022';

  async generateHash(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async verification(password: string, hash: string) {
    try {
      const resultado = await bcrypt.compare(password, hash);
      return resultado;
    } catch (erro) {
      return false;
    }
  }

  generateToken(userId: string): string {
    const expiresIn = 300;
    const payload = { sub: userId };
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verifyToken(token: string): { sub: string } {
    return jwt.verify(token, this.secret) as { sub: string };
  }

  generateRandomNumber(): string {
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += (Math.floor(Math.random() * 10) + 1).toString();
    }
    return result;
  }
}
