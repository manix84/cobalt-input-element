/**
 * @jest-environment jsdom
 */
import Input, { PASSWORD_CHAR as P } from "@/components/Input";
import { fireEvent, render, waitFor } from "@testing-library/react";

describe("Input", () => {
  test("renders basic component unchanged", () => {
    const input = render(<Input />);
    expect(input).toMatchSnapshot();
  });

  test("renders `className` in component unchanged", () => {
    const input = render(<Input className={"className"} />);
    expect(input).toMatchSnapshot();
  });

  test("renders `style` in component unchanged", () => {
    const input = render(<Input style={{ zIndex: 1 }} />);
    expect(input).toMatchSnapshot();
  });

  test("renders `placeholder` in component unchanged", () => {
    const input = render(<Input placeholder={"PlaceHolder"} />);
    expect(input).toMatchSnapshot();
  });

  test("renders `showPasswordToggle` in component unchanged", () => {
    const input = render(<Input type={"password"} showPasswordToggle />);
    expect(input).toMatchSnapshot();
  });

  test("renders `value` in component unchanged", () => {
    const input = render(<Input value={"Value"} />);
    expect(input).toMatchSnapshot();
  });

  test("renders `password` and `value` in component unchanged", () => {
    const input = render(<Input type={"password"} value={"Password"} />);
    expect(input).toMatchSnapshot();
  });

  test("renders `placeholder` and `value` in component unchanged", () => {
    const input = render(<Input value={"Value"} placeholder={"PlaceHolder"} />);
    expect(input).toMatchSnapshot();
  });

  test("renders `password`, `value`, and `placeholder` in component unchanged", () => {
    const input = render(
      <Input type={"password"} value={"Value"} placeholder={"PlaceHolder"} />
    );
    expect(input).toMatchSnapshot();
  });

  test("renders `focused` in component unchanged", () => {
    const input = render(<Input value={"Value"} testId={"test"} />);
    input.getByTestId("test").focus();
    expect(input).toMatchSnapshot();
  });

  test("displays the correct values", () => {
    const { getByTestId } = render(
      <Input placeholder={"Test"} testId={"test"} />
    );

    expect(getByTestId("test").textContent).toMatch("Test");
  });

  test("removes Placeholder, when a Value is present", () => {
    const { getByTestId } = render(
      <Input placeholder={"Test"} value={"Hello World"} testId={"test"} />
    );
    expect(getByTestId("test").textContent).toMatch("Hello World");
  });

  test("last character should be visibile for X seconds, when `passwordCharDelay` is set.", async () => {
    jest.useFakeTimers();
    window.HTMLElement.prototype.scrollIntoView = () => {};
    const { getByTestId } = render(
      <Input type={"password"} testId={"test"} passwordCharDelay={10} />
    );
    fireEvent.keyDown(getByTestId("test"), { key: "A" });
    fireEvent.keyDown(getByTestId("test"), { key: "B" });
    fireEvent.keyDown(getByTestId("test"), { key: "C" });
    fireEvent.keyDown(getByTestId("test"), { key: "D" });
    expect(getByTestId("test").textContent).toMatch(`${P}${P}${P}D`);
    await waitFor(() => {
      jest.advanceTimersByTime(10);
      setTimeout(async () => {
        expect(getByTestId("test").textContent).toMatch(`${P}${P}${P}${P}`);
      }, 10);
    });
  });

  test("characters should not be visible when `passwordCharDelay` is disabled.", () => {
    jest.useFakeTimers();
    window.HTMLElement.prototype.scrollIntoView = () => {};
    const { getByTestId } = render(<Input type={"password"} testId={"test"} />);
    fireEvent.keyDown(getByTestId("test"), { key: "A" });
    fireEvent.keyDown(getByTestId("test"), { key: "B" });
    fireEvent.keyDown(getByTestId("test"), { key: "C" });
    fireEvent.keyDown(getByTestId("test"), { key: "D" });

    expect(getByTestId("test").textContent).toMatch(`${P}${P}${P}${P}`);
  });

  test("`<HideCharToggle />` souldn't be present, if `showPasswordToggle` is disabled.", () => {
    const { queryByTestId } = render(
      <Input type={"password"} testId={"test"} />
    );
    expect(queryByTestId("test_toggle")).not.toBeInTheDocument();
  });

  test("`<HideCharToggle />` sould be present, if `showPasswordToggle` is enabled.", () => {
    const { getByTestId } = render(
      <Input type={"password"} testId={"test"} showPasswordToggle />
    );
    expect(getByTestId("test_toggle")).toBeInTheDocument();
  });

  test("clicking `<HideCharToggle />` should toggle hiding password characters.", () => {
    jest.useFakeTimers();
    window.HTMLElement.prototype.scrollIntoView = () => {};
    const { getByTestId } = render(
      <Input
        value={"Value"}
        type={"password"}
        testId={"test"}
        showPasswordToggle
      />
    );
    expect(getByTestId("test").textContent).toMatch(`${P}${P}${P}${P}${P}`);
    fireEvent.click(getByTestId("test_toggle"));
    expect(getByTestId("test").textContent).toMatch("Value");
  });
});
