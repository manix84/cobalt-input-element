import {
  StyleHTMLAttributes,
  createRef,
  forwardRef,
  useEffect,
  useState,
} from "react";
import styled, { keyframes } from "styled-components";
import HideCharsDarkImg from "../public/components/Input/hideChars.dark.png";
import HideCharsLightImg from "../public/components/Input/hideChars.light.png";
import ShowCharsDarkImg from "../public/components/Input/showChars.dark.png";
import ShowCharsLightImg from "../public/components/Input/showChars.light.png";

const ERRORS = { required: "Field is required" };
const PASSWORD_CHAR: string = "•";
let delayedPasswordCharacterTimeout: ReturnType<typeof setTimeout>;

interface InputProps {
  value?: string;
  type?: "text" | "password";
  focus?: boolean;
  style?: StyleHTMLAttributes<HTMLDivElement>;
  className?: string;
  passwordCharDelay?: number;
  showPasswordToggle?: boolean;
  cursorBlink?: "blink" | "phase" | "smooth" | "solid";
  placeholder?: string;
  required?: boolean;
  onSubmit?: () => void;
  onChange?: ({
    value,
    errors,
  }: {
    value: string;
    errors?: { [key: string]: string };
  }) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  testId?: string;
}

export const Input = forwardRef<HTMLDivElement, InputProps>(
  (
    {
      value = "",
      type = "text",
      focus: forceFocus = false,
      style = {},
      className = "",
      passwordCharDelay = 0,
      showPasswordToggle = false,
      cursorBlink = "phase",
      placeholder = "",
      required = false,
      onChange = () => {},
      onSubmit = () => {},
      onFocus = () => {},
      onBlur = () => {},
      testId,
    }: InputProps,
    ref
  ) => {
    const lastCharRef = createRef<HTMLSpanElement>();
    const [currentValue, setCurrentValue] = useState<string>(value || "");
    const [cursorPosition, setCursorPosition] = useState<number>(
      String(value).length
    );
    const [selection, setSelection] = useState<[number, number]>([0, 0]);
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [hideValue, setHideValue] = useState<boolean>(type === "password");
    const [hideLastChar, setHideLastChar] = useState<boolean>(true);
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    /**
     * Handle the Backspace being pressed.
     * Remove the character left of the indicator, unless at the beginning of the input.
     */
    const HandleBackspace = () => {
      setCurrentValue(
        (curValue) =>
          String(curValue).substring(0, cursorPosition - 1) +
          String(curValue).substring(cursorPosition, String(curValue).length)
      );
      setCursorPosition((curValue) => (curValue > 0 ? curValue - 1 : 0));
      setHideLastChar(true);
      clearTimeout(delayedPasswordCharacterTimeout);
    };

    /**
     * Handle the Enter button being pressed.
     * Fire the onSubmit event, containing the current value.
     */
    const HandleEnter = () => onSubmit && onSubmit();

    /**
     * Handle the Right Arrow being pressed.
     * Move 1 character right, unless at the end of the input.
     */
    const HandleMoveRight = () => {
      setCursorPosition((curValue) =>
        curValue < String(currentValue).length ? curValue + 1 : curValue
      );
    };

    /**
     * Handle the Left Arrow being pressed.
     * Move 1 character left, unless at the start of the input.
     */
    const HandleMoveLeft = () => {
      setCursorPosition((curValue) => (curValue > 0 ? curValue - 1 : curValue));
    };

    /**
     * Handle the Up Arrow being pressed.
     * Move to the beginning of the input.
     */
    const HandleMoveToStart = () => setCursorPosition(0);

    /**
     * Handle the Down Arrow being pressed
     * Move to the end of the input.
     */
    const HandleMoveToEnd = () =>
      setCursorPosition(String(currentValue).length);

    const HandleSelect = () => {};

    /**
     * Handle character intake
     * @param char {string} - The Character being input
     */
    const HandleCharacter = (char: string, hasMetaKey: boolean) => {
      if (char.length > 1 || hasMetaKey) return;
      setCurrentValue(
        (curValue) =>
          String(curValue).substring(0, cursorPosition) +
          char +
          String(curValue).substring(cursorPosition, String(curValue).length)
      );
      setCursorPosition((curValue) => curValue + 1);
      setIsDirty(true);
      if (passwordCharDelay && type === "password") {
        setHideLastChar(false);
        clearTimeout(delayedPasswordCharacterTimeout);
        delayedPasswordCharacterTimeout = setTimeout(
          () => setHideLastChar(true),
          passwordCharDelay
        );
      }
    };
    /**
     * Handle clicking the show/hide characters button, when type is "password".
     */
    const handleToggleHideValue = () => setHideValue((curVal) => !curVal);

    /**
     * Handle any button being pressed.
     * @param evt {React.KeyboardEvent}
     */
    const handleKeyDown = (evt: React.KeyboardEvent) => {
      const hasMetaKey = evt.ctrlKey || evt.metaKey;
      if (evt.shiftKey) {
        setIsSelecting(true);
      } else {
        setIsSelecting(false);
      }
      switch (evt.key) {
        case "Backspace":
          HandleBackspace();
          break;
        case "ArrowRight":
          HandleMoveRight();
          break;
        case "ArrowLeft":
          HandleMoveLeft();
          break;
        case "ArrowUp":
          HandleMoveToStart();
          break;
        case "ArrowDown":
          HandleMoveToEnd();
          break;
        case "Enter":
          HandleEnter();
          break;
        default:
          if (hasMetaKey && evt.key.toLowerCase() === "a") {
            evt.preventDefault();
            setSelection([0, currentValue.length]);
          } else {
            HandleCharacter(evt.key, hasMetaKey);
          }
      }
      lastCharRef.current && lastCharRef.current.scrollIntoView();
    };

    useEffect(() => {
      if (required && isDirty) {
        if (currentValue.length < 1) {
          setErrors((curErrors) => {
            curErrors["required"] = ERRORS["required"];
            return curErrors;
          });
        } else {
          setErrors((curErrors) => {
            delete curErrors["required"];
            return curErrors;
          });
        }
      }
      onChange &&
        onChange({ value: currentValue, errors: errors || undefined });
    }, [currentValue]);

    useEffect(() => {
      if (isSelecting) {
        if (selection[0] === -1) {
          setSelection([cursorPosition, cursorPosition]);
        } else {
          setSelection((curSelection) => [
            cursorPosition < curSelection[0] ? cursorPosition : curSelection[0],
            cursorPosition > curSelection[1] ? cursorPosition : curSelection[1],
          ]);
        }
      } else {
        setSelection([-1, -1]);
      }
      console.log({ ...selection });
    }, [cursorPosition]);

    const handleFocus = onFocus;
    const handleBlur = onBlur;
    return (
      <Container>
        <MainElement
          ref={ref}
          data-cursor-type={cursorBlink}
          data-force-focus={forceFocus}
          data-has-errors={Boolean(Object.keys(errors).length)}
          data-testId={testId}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={style}
          className={className}
        >
          <TextDisplay>
            {placeholder && String(currentValue).length === 0 && (
              <PlaceholderText>{placeholder}</PlaceholderText>
            )}
            <Character
              data-character-id={0}
              data-cursor={cursorPosition === 0}
              children={"​"}
            />
            {String(currentValue)
              .split("")
              .map((character, i) => {
                const isLastChar = i === cursorPosition - 1;
                const hideThisChar =
                  hideValue && (!isLastChar || (isLastChar && hideLastChar));
                return (
                  <Character
                    key={`key_${i}`}
                    data-character-id={i + 1}
                    data-cursor={cursorPosition === i + 1}
                    data-selected={i >= selection[0] && i <= selection[1]}
                    ref={lastCharRef}
                  >
                    {hideThisChar ? PASSWORD_CHAR : character}
                  </Character>
                );
              })}
            {type === "password" && showPasswordToggle ? (
              <HideCharsToggle
                data-show-chars={hideValue}
                data-testid={testId ? `${testId}_toggle` : undefined}
                onClick={handleToggleHideValue}
              />
            ) : (
              <></>
            )}
          </TextDisplay>
        </MainElement>
        {Object.keys(errors).length ? (
          <Errors>
            {Object.entries(errors).map(([key, error]) => (
              <Error key={key} data-key={key}>
                {error}
              </Error>
            ))}
          </Errors>
        ) : (
          <></>
        )}
      </Container>
    );
  }
);

export default Input;

const phaseAnimation = keyframes`
  from {
    border-color: rgba(255, 255, 255, 1);
    @media (prefers-color-scheme: dark) {
    border-color: rgba(0, 0, 0, 1);
    }
  }
  50% {
    border-color: rgba(255, 255, 255, 0);
    @media (prefers-color-scheme: dark) {
    border-color: rgba(0, 0, 0, 0);
    }
  }
  to {
    border-color: rgba(255, 255, 255,1);
    @media (prefers-color-scheme: dark) {
    border-color: rgba(0, 0, 0, 1);
    }
  }
`;

const Container = styled.div`
  position: relative;
`;

const MainElement = styled.div.attrs({ tabIndex: 0 })`
  outline: 0 none;
  border: 1px solid currentColor;
  border-radius: 4px;
  min-width: 150px;
  overflow: hidden;
  cursor: text;
  &:focus {
    outline: 4px solid rgb(75, 150, 255);
    @media (prefers-color-scheme: dark) {
      outline: 4px solid rgb(25, 100, 150);
    }
  }
  &[data-has-errors="true"] {
    outline: 4px solid rgb(255, 0, 0);
    @media (prefers-color-scheme: dark) {
      outline: 4px solid rgb(200, 0, 0);
    }
  }
`;

const TextDisplay = styled.div`
  display: flex;
  width: fit-content;
  min-height: 1rem;
  min-width: 100%;
  padding: 2px 4px;
  white-space: nowrap;
  overflow: scroll;
`;

const PlaceholderText = styled.span`
  opacity: 50%;
  color: currentColor;
  :focus & {
    display: none;
  }
`;

const Character = styled.span`
  display: inline-flex;
  min-width: 5px;
  border-right: 2px solid transparent;
  margin-right: -2px;
  :focus &[data-cursor="true"] {
    border-right-color: currentColor;
  }
  &[data-selected="true"] {
    background-color: rgba(75, 150, 255, 0.8);
    @media (prefers-color-scheme: dark) {
      background-color: rgba(25, 100, 150, 0.8);
    }
  }
  [data-cursor-type="blink"]:focus &[data-cursor="true"],
  [data-cursor-type="phase"]:focus &[data-cursor="true"],
  [data-cursor-type="smooth"]:focus &[data-cursor="true"] {
    animation-name: ${phaseAnimation};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  [data-cursor-type="blink"]:focus &[data-cursor="true"] {
    animation-timing-function: steps(1, end);
  }
  [data-cursor-type="smooth"]:focus &[data-cursor="true"] {
    animation-timing-function: cubic-bezier(0, 0.99, 0, 0.98);
  }
  [data-cursor-type="phase"]:focus &[data-cursor="true"] {
    animation-duration: 1.5s;
  }
`;

const HideCharsToggle = styled.div`
  display: inline-flex;
  align-self: center;
  cursor: pointer;
  margin-left: auto;
  height: 1em;
  width: 1em;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  &[data-show-chars="true"] {
    background-image: url(${ShowCharsLightImg.src});
    @media (prefers-color-scheme: dark) {
      background-image: url(${ShowCharsDarkImg.src});
    }
  }
  &[data-show-chars="false"] {
    background-image: url(${HideCharsLightImg.src});
    @media (prefers-color-scheme: dark) {
      background-image: url(${HideCharsDarkImg.src});
    }
  }
`;
const Errors = styled.div`
  padding-top: 2px;
  font-size: 0.8em;
  color: rgb(200, 0, 0);
  @media (prefers-color-scheme: dark) {
    color: rgb(255, 0, 0);
  }
`;
const Error = styled.div``;
