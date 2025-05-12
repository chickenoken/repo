import { Injectable, Inject } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserQueueService } from '../../queue/services/user-queue.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userQueueService: UserQueueService,
  ) {}

  async findAll(): Promise<User[]> {
    const cachedUsers = await this.cacheManager.get<User[]>('all_users');
    if (cachedUsers) {
      return cachedUsers;
    }

    const users = await this.userRepository.findAll({ orderBy: { createdAt: 'DESC' } });
    
    await this.cacheManager.set('all_users', users);
    
    return users;
  }

  async findOne(id: number): Promise<User | null> {
    const cacheKey = `user_${id}`;
    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOne({ user_id: id });
    
    if (user) {
      await this.cacheManager.set(cacheKey, user);
      await this.userQueueService.addProcessUserDataJob(id);
    }
    
    return user;
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
    
    await this.cacheManager.del('all_users');
    
    const cacheKey = `user_${user.user_id}`;
    await this.cacheManager.set(cacheKey, user);
    await this.cacheManager.set(`user_email_${user.email}`, user);
    
    await this.userQueueService.addSendWelcomeEmailJob({
      email: user.email,
      firstName: user.firstName,
    });
    
    return user;
  }
}