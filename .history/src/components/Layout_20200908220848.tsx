import React, { useLayoutEffect } from 'react';
import { PageProps } from 'gatsby';

export default function Layout(props: PageProps) {
  return (
    <div style={{ margin: `0 auto`, maxWidth: 650, padding: `0 1rem` }}>
      {props.children}
    </div>
  );
}
