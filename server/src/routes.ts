import express from 'express'
import { SubmitFeedbackUseCase } from './use-cases/submit-feedback-use-case'
import { PrismaFeedbacksRepository } from './repositories/prisma/prisma-feedbacks-repository'
import { NodemailerMailAdapter } from './adapters/nodemailer/nodemailer-mail-adapter'
import { IHttpError } from './interfaces/http-error'

export const routes = express.Router()

routes.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body

  try {
    const prismaFeedbackRepository = new PrismaFeedbacksRepository()
    const nodemailerMailAdapter = new NodemailerMailAdapter()

    const submitFeedbackUseCase = new SubmitFeedbackUseCase(
      prismaFeedbackRepository,
      nodemailerMailAdapter
    )

    const submitResponse = await submitFeedbackUseCase.execute({
      type,
      comment,
      screenshot,
    })

    if (submitResponse != null) {
      return res.status(submitResponse.code).send(submitResponse)
    }

    return res.status(201).send()
  } catch (error) {
    return res
      .status(500)
      .send(
        'Something went wrong while submitting your feedback, please try again later'
      )
  }
})
