/**
 * @jest-environment jsdom
 */
import HideCharsToggle from "@/components/HideCharsToggle";
import { render } from "@testing-library/react";

describe("HideCharsToggle", () => {
  test("renders basic component unchanged", () => {
    const Toggle = render(<HideCharsToggle onChange={() => {}} />);
    expect(Toggle).toMatchSnapshot();
  });
  test("renders start visible option unchanged", () => {
    const Toggle = render(
      <HideCharsToggle startAsVisible onChange={() => {}} />
    );
    expect(Toggle).toMatchSnapshot();
  });
  test("renders start visible option unchanged", () => {
    const Toggle = render(
      <HideCharsToggle className={"className"} onChange={() => {}} />
    );
    expect(Toggle).toMatchSnapshot();
  });
});
