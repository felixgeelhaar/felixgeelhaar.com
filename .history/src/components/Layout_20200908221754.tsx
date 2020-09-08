import React, { useLayoutEffect } from 'react';
import { PageProps } from 'gatsby';

export default function Layout(props: PageProps, { children }) {
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
