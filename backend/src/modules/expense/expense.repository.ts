import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Expense, ExpenseDocument } from '../../schemas/expense.schema';

@Injectable()
export class ExpenseRepository {
  constructor(
    @InjectModel(Expense.name)
    private readonly expenseModel: Model<ExpenseDocument>,
  ) {}

  create(data: Partial<Expense>, session?: ClientSession) {
    return this.expenseModel.create([data], { session }).then(([log]) => log);
  }

  findMany(filter: Record<string, unknown>, skip: number, limit: number) {
    return this.expenseModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  count(filter: Record<string, unknown>) {
    return this.expenseModel.countDocuments(filter).exec();
  }
}
