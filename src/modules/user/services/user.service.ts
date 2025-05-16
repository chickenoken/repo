import { Injectable, Inject } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserQueueService } from '../../queue/services/user-queue.service';
import { Users } from 'src/modules/entities/Users';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: EntityRepository<Users>,
    private readonly em: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userQueueService: UserQueueService,
  ) {}

  async findAll(): Promise<Users[]> {
    const cachedUsers = await this.cacheManager.get<Users[]>('all_users');
    if (cachedUsers) {
      return cachedUsers;
    }

    const users = await this.userRepository.findAll({ orderBy: { userCreated: 'DESC' } });
    
    await this.cacheManager.set('all_users', users);
    
    return users;
  }

  async findOne(id: number): Promise<Users | null> {
    const cacheKey = `user_${id}`;
    const cachedUser = await this.cacheManager.get<Users>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userRepository.findOne({ userId: id });
    
    if (user) {
      await this.cacheManager.set(cacheKey, user);
      await this.userQueueService.addProcessUserDataJob(id);
    }
    
    return user;
  }
  
  async create(userData: {
    userEmail: string;
    userPassword: string;
    userFirstName: string;
    userLastName: string;
  }): Promise<Users> {
    const user = new Users();
    user.userEmail = userData.userEmail;
    user.userPassword = userData.userPassword;
    user.userFirstName = userData.userFirstName;
    user.userLastName = userData.userLastName;
    user.userCreated = Math.floor(Date.now() / 1000);

    await this.em.persistAndFlush(user);
    
    await this.cacheManager.del('all_users');
    
    const cacheKey = `user_${user.userId}`;
    await this.cacheManager.set(cacheKey, user);
    await this.cacheManager.set(`user_email_${user.userEmail}`, user);
    
    await this.userQueueService.addSendWelcomeEmailJob({
      email: user.userEmail,
      firstName: user.userFirstName,
    });
    
    return user;
  }
}