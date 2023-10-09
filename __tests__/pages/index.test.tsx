/**
 * @jest-environment jsdom
 */
import Home from "@/pages/index.origin";
import { render, screen } from "@testing-library/react";

describe("Home", () => {
  it("renders a heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      name: /Cobalt Input Element/i,
    });

    expect(heading).toBeInTheDocument();
  });
  test("renders home unchanged", () => {
    const home = render(<Home />);
    expect(home).toMatchSnapshot();
  });
});
