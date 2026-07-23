import type { TemplateEntry } from './types.ts'
import { template as contactFormSubmission } from './contact-form-submission.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-form-submission': contactFormSubmission,
}
