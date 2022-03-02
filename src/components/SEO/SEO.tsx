import Head from 'next/head';
import { useRouter } from 'next/router';
import { config } from './config';

type SeoProps = {
  title: string;
  description: string;
  keywords: string;
  noIndex?: boolean;
};

const SEO = ({ title, description, keywords, noIndex = false }: SeoProps) => {
  const router = useRouter();

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow" />}

      {/* TODO: Check this <meta name="googlebot" content="index, follow" /> */}

      {/* The real MVP: https://moz.com/blog/meta-data-templates-123 */}
      <title>{`${title} | ${config.seo.title}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={`${config.url}${router.route}`} />

      {/* <!-- Twitter Card data --> */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={config.seo.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content={config.seo.twitter} />
      <meta name="twitter:image" content={config.url} />
      {/* <!-- Open Graph data --> */}
      <meta property="og:title" content={title} />
      <meta property="og:url" content={config.url} />
      <meta property="og:image" content="/favicon.ico" />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={title} />
    </Head>
  );
};

export default SEO;
