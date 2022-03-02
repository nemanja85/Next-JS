export const config = Object.freeze({
  url: process.env.NEXT_PUBLIC_SITE_DOMAIN!,
  information: {
    email: process.env.NEXT_PUBLIC_EMAIL!,
    address: process.env.NEXT_PUBLIC_ADDRESS!,
  },
  seo: {
    title: process.env.NEXT_PUBLIC_TITLE!,
    twitter: process.env.NEXT_PUBLIC_TWITTER_USERNAME!,
  },
});
