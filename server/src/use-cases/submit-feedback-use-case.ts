import { IMailAdapter } from '../adapters/mail-adapter'
import { IHttpError } from '../interfaces/http-error'
import { IFeedbacksRepository } from '../repositories/feedbacks-repository'

interface ISubmitFeedbackUseCaseRequest {
  type: string
  comment: string
  screenshot?: string
}

export class SubmitFeedbackUseCase {
  constructor(
    private readonly feedbacksRepository: IFeedbacksRepository,
    private readonly mailAdapter: IMailAdapter
  ) {}

  async execute(
    request: ISubmitFeedbackUseCaseRequest
  ): Promise<IHttpError | null> {
    const { type, comment, screenshot } = request

    if (!type) {
      return { code: 422, message: 'Type is required' }
    }

    if (type !== 'BUG' && type !== 'IDEA' && type !== 'OTHER') {
      return { code: 400, message: 'Invalid type provided' }
    }

    if (!comment?.trim()) {
      return { code: 422, message: 'Comment is required' }
    }

    if (screenshot && !screenshot.startsWith('data:image/png;base64')) {
      return { code: 422, message: 'Invalid screenshot format' }
    }

    try {
      await this.feedbacksRepository.create({
        type,
        comment,
        screenshot,
      })

      await this.mailAdapter.sendMail({
        subject: 'Novo feedback',
        body: [
          `<div style="font-family: sans-serif; font-size: 16px; color: #111;">`,
          `<p>Tipo do feedback: ${type}</p>`,
          `<p>Comentário: ${comment}</p>`,
          screenshot
            ? [
                `<p>Imagem:</p>`,
                `<img src="${screenshot}" alt="feedback screenshot" />`,
              ].join('\n')
            : '',
          `</div>`,
        ].join('\n'),
      })
    } catch {
      return {
        code: 500,
        message:
          'Something went wrong while processing your feedback, please try again later',
      }
    }

    return null
  }
}
