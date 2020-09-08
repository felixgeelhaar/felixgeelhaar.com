/** @jsx jsx */
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { jsx, Flex } from 'theme-ui';

export default function Layout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <Helmet>
        <title>Gatsby Admin</title>
        <html lang="en" />
      </Helmet>
      <Flex
        gap={0}
        flexDirection="column"
        sx={{
          maxWidth: `76rem`,
          margin: `0 auto`,
          px: 8,
        }}
      >
        <Navbar />
        <main>{children}</main>
      </Flex>;
}
