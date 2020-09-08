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
      <main>
        <Flex
          gap={0}
          flexDirection='column'
          sx={{
            maxWidth: `90vw`,
            margin: `0 auto`,
            alignContent: 'center',
            justifyContent: 'center',
            height: '100%',
          }}>
          {children}
        </Flex>
      </main>
    </>
  );
}
