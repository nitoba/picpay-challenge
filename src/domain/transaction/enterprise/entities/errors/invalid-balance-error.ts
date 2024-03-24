import { DomainError } from '@/core/errors/domain-error'

export class InvalidBalanceError extends Error implements DomainError {}
