import type { Metadata } from 'next';

const config = {
  appName: 'Molinar - AI Agents That Can Do Anything',
  appDescription:
    'Launch and manage secure AI agents for your business. Isolated containers on AWS, encrypted keys, Telegram integration — deploy in 60 seconds.',
  domainName: 'business.molinar.ai',
};

export const getSEOTags = ({
  title,
  description,
  keywords,
  openGraph,
  canonicalUrlRelative,
  extraTags,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    image?: string;
  };
  canonicalUrlRelative?: string;
  extraTags?: Record<string, unknown>;
} = {}): Metadata => {
  return {
    title: title || config.appName,
    description: description || config.appDescription,
    keywords: keywords || [
      config.appName,
      'AI agents',
      'business automation',
      'Telegram bot',
      'AI assistant',
      'secure AI',
      'AWS',
      'OpenClaw',
    ],
    applicationName: config.appName,
    metadataBase: new URL(
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/'
        : `https://${config.domainName}/`
    ),

    openGraph: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      url: openGraph?.url || `https://${config.domainName}/`,
      siteName: config.appName,
      locale: 'en_US',
      type: 'website',
    },

    twitter: {
      title: openGraph?.title || config.appName,
      description: openGraph?.description || config.appDescription,
      card: 'summary_large_image',
    },

    ...(canonicalUrlRelative && {
      alternates: { canonical: canonicalUrlRelative },
    }),

    ...extraTags,
  };
};

export const renderSchemaTags = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'http://schema.org',
          '@type': 'SoftwareApplication',
          name: config.appName,
          description: config.appDescription,
          image: `https://${config.domainName}/icon.png`,
          url: `https://${config.domainName}/`,
          author: {
            '@type': 'Organization',
            name: 'Molinar AI',
          },
          datePublished: '2026-02-08',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          offers: [
            {
              '@type': 'Offer',
              price: '49.00',
              priceCurrency: 'USD',
              name: 'Starter',
            },
            {
              '@type': 'Offer',
              price: '149.00',
              priceCurrency: 'USD',
              name: 'Pro',
            },
          ],
        }),
      }}
    />
  );
};
