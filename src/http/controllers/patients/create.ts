import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { createUseCase } from '@/use-cases/create-patient'
import { PatientAlreadyExistsError } from '@/use-cases/errors/patient-already-exists'

export async function createPatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createBodySchema = z.object({
    name: z.string(),
    age: z.number(),
    document: z.string(),
  })

  const { name, age, document } = createBodySchema.parse(request.body)

  try {
    await createUseCase({ name, age, document })
  } catch (error) {
    if (error instanceof PatientAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
