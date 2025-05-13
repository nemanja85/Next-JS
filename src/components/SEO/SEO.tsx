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
      {noIndex && <meta name="robots" content="noindex, nofollow"> <meta name="googlebot" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow"> <meta name="googlebot" content="index, follow" />}

      <title>{`${title} | ${config.seo.title}`}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={`${config.url}${router.route}`} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={config.seo.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content={config.seo.twitter} />
      <meta name="twitter:image" content={`${config.url}images/twitter-card-default.png`} />
      
      <meta property="og:title" content={title} />
      <meta property="og:url" content={config.url} />
      <meta property="og:image" content="/favicon.ico" />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={title} />
    </Head>
  );
};

export default SEO;
