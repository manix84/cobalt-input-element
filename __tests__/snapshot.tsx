/**
 * @jest-environment jsdom
 */
import Input from "@/components/Input";
import Home from "@/pages/index.origin";
import { render } from "@testing-library/react";

it("renders homepage unchanged", () => {
  const home = render(<Home />);
  expect(home).toMatchSnapshot();
});

it("renders basic Input components unchanged", () => {
  const input = render(<Input />);
  expect(input).toMatchSnapshot();
});
