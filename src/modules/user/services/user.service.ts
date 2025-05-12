// src/services/user.service.ts
import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll({ orderBy: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ user_id: id });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ email });
  }

  async create(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    const user = new User();
    user.email = userData.email;
    user.password = userData.password;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.createdAt = Math.floor(Date.now() / 1000);

    await this.em.persistAndFlush(user);
    return user;
  }
}