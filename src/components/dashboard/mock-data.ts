export type LinkData = {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  clicks: number;
  analytics: {
    clicksByDate: { date: string; clicks: number }[];
    geo: { country: string; clicks: number }[];
    devices: { device: string; clicks: number }[];
    referrers: { referrer: string; clicks: number }[];
  };
};

export const mockLinks: LinkData[] = [
  {
    id: '1',
    originalUrl: 'https://www.producthunt.com/posts/new-ai-product-launch',
    shortCode: 'ai-launch',
    createdAt: '2024-07-20T10:00:00Z',
    clicks: 1258,
    analytics: {
      clicksByDate: [
        { date: '2024-07-20', clicks: 300 },
        { date: '2024-07-21', clicks: 650 },
        { date: '2024-07-22', clicks: 200 },
        { date: '2024-07-23', clicks: 108 },
      ],
      geo: [
        { country: 'USA', clicks: 600 },
        { country: 'India', clicks: 250 },
        { country: 'UK', clicks: 150 },
        { country: 'Germany', clicks: 100 },
        { country: 'Canada', clicks: 158 },
      ],
      devices: [
        { device: 'Desktop', clicks: 800 },
        { device: 'Mobile', clicks: 400 },
        { device: 'Tablet', clicks: 58 },
      ],
      referrers: [
        { referrer: 'producthunt.com', clicks: 700 },
        { referrer: 'twitter.com', clicks: 300 },
        { referrer: 'direct', clicks: 150 },
        { referrer: 'google.com', clicks: 108 },
      ],
    },
  },
  {
    id: '2',
    originalUrl: 'https://techcrunch.com/2024/07/19/startup-funding-news/',
    shortCode: 'funding-news',
    createdAt: '2024-07-19T14:30:00Z',
    clicks: 842,
    analytics: {
      clicksByDate: [
        { date: '2024-07-19', clicks: 400 },
        { date: '2024-07-20', clicks: 250 },
        { date: '2024-07-21', clicks: 100 },
        { date: '2024-07-22', clicks: 92 },
      ],
      geo: [
        { country: 'USA', clicks: 500 },
        { country: 'France', clicks: 100 },
        { country: 'Japan', clicks: 90 },
        { country: 'Australia', clicks: 80 },
        { country: 'Brazil', clicks: 72 },
      ],
      devices: [
        { device: 'Desktop', clicks: 500 },
        { device: 'Mobile', clicks: 320 },
        { device: 'Tablet', clicks: 22 },
      ],
      referrers: [
        { referrer: 'techcrunch.com', clicks: 400 },
        { referrer: 'linkedin.com', clicks: 250 },
        { referrer: 'direct', clicks: 100 },
        { referrer: 'facebook.com', clicks: 92 },
      ],
    },
  },
  {
    id: '3',
    originalUrl:
      'https://www.smashingmagazine.com/2024/07/new-css-features-2024/',
    shortCode: 'css-features',
    createdAt: '2024-07-18T09:00:00Z',
    clicks: 2301,
    analytics: {
      clicksByDate: [
        { date: '2024-07-18', clicks: 1200 },
        { date: '2024-07-19', clicks: 800 },
        { date: '2024-07-20', clicks: 251 },
        { date: '2024-07-21', clicks: 50 },
      ],
      geo: [
        { country: 'USA', clicks: 900 },
        { country: 'Germany', clicks: 400 },
        { country: 'Netherlands', clicks: 300 },
        { country: 'UK', clicks: 250 },
        { country: 'India', clicks: 451 },
      ],
      devices: [
        { device: 'Desktop', clicks: 2001 },
        { device: 'Mobile', clicks: 250 },
        { device: 'Tablet', clicks: 50 },
      ],
      referrers: [
        { referrer: 'smashingmagazine.com', clicks: 1500 },
        { referrer: 'dev.to', clicks: 500 },
        { referrer: 'direct', clicks: 201 },
        { referrer: 'google.com', clicks: 100 },
      ],
    },
  },
];
