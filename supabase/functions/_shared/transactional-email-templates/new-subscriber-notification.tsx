import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './types.ts'

interface Props {
  subscriberEmail?: string
  site?: string
  subscribedAt?: string
}

const Email = ({ subscriberEmail, site, subscribedAt }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New newsletter subscriber</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>New Newsletter Subscriber</Heading>
        <Text style={text}>Someone just subscribed to your mailing list.</Text>

        <Section style={detailSection}>
          <Text style={label}>Email</Text>
          <Text style={value}>{subscriberEmail || 'Not provided'}</Text>

          <Text style={label}>Site</Text>
          <Text style={value}>{site || 'Unknown'}</Text>

          <Text style={label}>Subscribed</Text>
          <Text style={value}>{subscribedAt || new Date().toISOString()}</Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>The full subscriber list is available in your backend.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'New MiyTube newsletter subscriber',
  displayName: 'New Subscriber (MiyTube)',
  previewData: { subscriberEmail: 'jane@example.com', site: 'miytube' },
  to: 'miytubembh@gmail.com',
} satisfies TemplateEntry

export const templateIwin = {
  component: Email,
  subject: 'New IWIN newsletter subscriber',
  displayName: 'New Subscriber (I Want Information Now)',
  previewData: { subscriberEmail: 'jane@example.com', site: 'iwantinformationnow' },
  to: 'iwantinformation@iwantinformationnow.com',
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

const hr = {
  borderColor: '#e2e8f0',
  marginTop: '32px',
}

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  marginTop: '16px',
}
