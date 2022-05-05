import { prisma } from '../../prisma'
import {
  IFeedbackCreateData,
  IFeedbacksRepository,
} from '../feedbacks-repository'

export class PrismaFeedbacksRepository implements IFeedbacksRepository {
  async create(data: IFeedbackCreateData) {
    await prisma.feedback.create({
      data,
    })
  }
}
