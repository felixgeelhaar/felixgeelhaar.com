/** @jsx jsx */
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { jsx, Flex } from 'theme-ui';

export default function Layout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <Flex>{children}</Flex>;
}
