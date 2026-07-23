import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './types.ts'

interface Props {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const Email = ({ name, email, subject, message }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact form submission on MiyTube</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>New Contact Form Submission</Heading>
        <Text style={text}>Someone submitted the contact form on MiyTube.</Text>

        <Section style={detailSection}>
          <Text style={label}>Name</Text>
          <Text style={value}>{name || 'Not provided'}</Text>

          <Text style={label}>Email</Text>
          <Text style={value}>{email || 'Not provided'}</Text>

          <Text style={label}>Subject</Text>
          <Text style={value}>{subject || 'Not provided'}</Text>

          <Text style={label}>Message</Text>
          <Text style={messageValue}>{message || 'No message provided'}</Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>Reply directly to this email to respond to the sender.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) => `Contact form: ${data?.subject || 'New submission'}`,
  displayName: 'Contact Form Submission',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'General Inquiry',
    message: 'Hi, I love the platform and would like to learn more about advertising.',
  },
  to: 'miytubembh@gmail.com',
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
  color: '#0f172a',
}

const container = {
  padding: '24px 32px',
  maxWidth: '600px',
  margin: '0 auto',
}

const heading = {
  color: '#0f172a',
  fontSize: '24px',
  fontWeight: 600,
  marginBottom: '16px',
}

const text = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '24px',
}

const detailSection = {
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '24px',
  marginBottom: '24px',
}

const label = {
  color: '#64748b',
  fontSize: '12px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginBottom: '4px',
  marginTop: '16px',
}

const value = {
  color: '#0f172a',
  fontSize: '16px',
  marginTop: '0',
  marginBottom: '0',
}

const messageValue = {
  color: '#0f172a',
  fontSize: '16px',
  lineHeight: '24px',
  whiteSpace: 'pre-wrap' as const,
  marginTop: '0',
}

const hr = {
  borderColor: '#e2e8f0',
  marginTop: '32px',
}

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  marginTop: '16px',
}
