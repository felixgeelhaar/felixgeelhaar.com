/** @jsx jsx */
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { jsx, Flex } from 'theme-ui';

export default function Layout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 650,
        padding: `0 1rem`,
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {children}
    </div>
  );
}
