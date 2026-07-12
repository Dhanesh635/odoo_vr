import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  findByEmailWithPassword(email: string) {
    return this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select('+passwordHash')
      .exec();
  }

  findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  list(filter: Record<string, unknown> = {}) {
    return this.userModel.find(filter).sort({ createdAt: -1 }).exec();
  }
}
