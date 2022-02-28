import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body className={`${process.env.NODE_ENV === 'development' ? 'debug-screens' : ''} bg-white dark:bg-gray-800`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
