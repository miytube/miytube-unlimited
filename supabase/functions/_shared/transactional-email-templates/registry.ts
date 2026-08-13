import type { TemplateEntry } from './types.ts'
import { template as contactFormSubmission } from './contact-form-submission.tsx'
import {
  template as newSubscriberMiytube,
  templateIwin as newSubscriberIwin,
} from './new-subscriber-notification.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-form-submission': contactFormSubmission,
  'new-subscriber-miytube': newSubscriberMiytube,
  'new-subscriber-iwin': newSubscriberIwin,
}
