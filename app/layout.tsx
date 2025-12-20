import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hexpertify-blog-sigma.vercel.app';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await SEOHead({
    page: 'homepage',
    fallbackTitle: 'hexpertify-blogs - Connect with Certified Experts',
    fallbackDescription: 'hexpertify-blogs - Connect with certified experts across AI, Cloud Computing, Mental Health, Fitness, and Career Development.'
  });

  return {
    ...seo,
    alternates: {
      canonical: SITE_URL,
    },
  };
}

import Schema from '@/components/Schema';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://hexpertify.com/#organization',
        name: 'Hexpertify',
        url: 'https://hexpertify.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://hexpertify.com/logo.png',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://blogs.hexpertify.com/#website',
        name: 'Hexpertify Blogs',
        url: 'https://blogs.hexpertify.com',
        publisher: {
          '@id': 'https://hexpertify.com/#organization',
        },
      },
      {
        '@type': 'Blog',
        '@id': 'https://blogs.hexpertify.com/#blog',
        name: 'Hexpertify Blogs',
        url: 'https://blogs.hexpertify.com',
        description:
          'Blogs written by certified and verified experts from healthcare, mental health, fitness, technology, and career domains.',
        publisher: {
          '@id': 'https://hexpertify.com/#organization',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://blogs.hexpertify.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Hexpertify?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Hexpertify is an online platform that connects users with certified and verified experts across multiple professional fields.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do I book a consultation with an expert?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can book a consultation by selecting an expert on Hexpertify, choosing a suitable time slot, and completing the booking process online.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are your pricing options?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pricing varies depending on the expert and service. Each expert profile displays clear pricing before booking.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is your refund policy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Refund policies depend on the service booked and are clearly mentioned during the booking process.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can I become a consultant on Hexpertify?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can apply to become a consultant on Hexpertify by submitting your credentials through the Join as Consultant page.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do you protect my personal information?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Hexpertify follows strict data protection and privacy standards to ensure your personal information is secure.',
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <Schema value={siteSchema} />
        {children}
        <Footer />
      </body>
    </html>
  );
}


