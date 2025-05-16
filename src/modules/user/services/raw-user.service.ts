import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/mysql';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RawUserService {
  constructor(private readonly em: EntityManager) {}

  async findAllRaw(): Promise<any[]> {
    try {
      const connection = this.em.getConnection();
      const query = `
        SELECT 
          user_id,
          user_email,
          user_first_name,
          user_last_name,
          user_created,
          user_last_login
        FROM users
        ORDER BY user_created DESC
      `;

      return await connection.execute(query);
    } catch (error) {
      console.error('Error in findAllRaw:', error);
      return [];
    }
  }

  async findOneRaw(id: string): Promise<any | null> {
    try {
      const connection = this.em.getConnection();
      const query = `
        SELECT 
          user_id,
          user_email,
          user_password,
          user_first_name,
          user_last_name,
          user_created,
          user_last_login
        FROM users
        WHERE user_id = ?
      `;

      const results = await connection.execute(query, [id]);

      if (results.length === 0) {
        return null;
      }

      return results[0];
    } catch (error) {
      console.error('Error in findOneRaw:', error);
      return null;
    }
  }

  async findByEmailRaw(email: string): Promise<any | null> {
    try {
      const connection = this.em.getConnection();
      const query = `
        SELECT 
          user_id,
          user_email,
          user_password,
          user_first_name,
          user_last_name,
          user_created,
          user_last_login
        FROM users
        WHERE user_email = ?
      `;

      const results = await connection.execute(query, [email]);

      if (results.length === 0) {
        return null;
      }

      return results[0];
    } catch (error) {
      console.error('Error in findByEmailRaw:', error);
      return null;
    }
  }

  async createRaw(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<any> {
    try {
      const connection = this.em.getConnection();
      const userId = uuidv4();
      const now = new Date();

      const query = `
        INSERT INTO users (
          user_id,
          user_email,
          user_password,
          user_first_name,
          user_last_name,
          user_created
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      await connection.execute(query, [
        userId,
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        now,
      ]);

      return {
        user_id: userId,
        user_email: data.email,
        user_password: data.password,
        user_first_name: data.firstName,
        user_last_name: data.lastName,
        user_created: now,
        user_last_login: null,
      };
    } catch (error) {
      console.error('Error in createRaw:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async searchUsersRaw(searchTerm: string, limit = 10): Promise<any[]> {
    try {
      const connection = this.em.getConnection();
      const query = `
        SELECT 
          user_id,
          user_email,
          user_first_name,
          user_last_name,
          user_created,
          user_last_login
        FROM users
        WHERE 
          user_email LIKE ? OR
          user_first_name LIKE ? OR
          user_last_name LIKE ?
        LIMIT ?
      `;

      const searchPattern = `%${searchTerm}%`;
      const results = await connection.execute(query, [
        searchPattern,
        searchPattern,
        searchPattern,
        limit,
      ]);

      return results;
    } catch (error) {
      console.error('Error in searchUsersRaw:', error);
      return [];
    }
  }
}
