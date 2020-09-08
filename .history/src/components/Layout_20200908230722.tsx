import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Flex } from '@theme-ui/components';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <>
      <Helmet>
        ya
        <title>Felix Geelhaar</title>
        <html lang='en' />
      </Helmet>
      <main style={{ maxWidth: `90vw`, margin: `0 auto` }}>
        <Flex
          sx={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexFlow: 'column nowrap',
            gap: 0,
          }}>
          {children}
        </Flex>
      </main>
    </>
  );
}
