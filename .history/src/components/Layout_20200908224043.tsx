/** @jsx jsx */
import React from 'react';
import { Helmet } from 'react-helmet';
import { jsx } from 'theme-ui';
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
        <title>Gatsby Admin</title>
        <html lang='en' />
      </Helmet>
      <Flex
        gap={0}
        flexDirection='column'
        sx={{
          maxWidth: `90vw`,
          margin: `0 auto`,
          px: 8,
        }}>
        <main>{children}</main>
      </Flex>
    </>
  );
}
