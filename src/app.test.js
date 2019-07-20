import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("that App component renders", () => {
  const container = render(<App />);
  expect(container.baseElement).toMatchInlineSnapshot(`
    <body>
      <div>
        <h1>
          Hi there!
        </h1>
        <a
          href="mailto=hello@felixgeelhaar.de"
        >
          write me
        </a>
      </div>
    </body>
  `);
});

test('that App component contains the Headline "Hi"', () => {
  const { getByText } = render(<App />);
  expect(getByText(/hi/i)).toBeInTheDocument();
});
