import { useEffect, useState } from "react";
import { styled } from "styled-components";
import HideCharsDarkImg from "../public/components/HideCharsToggle/hideChars.dark.png";
import HideCharsLightImg from "../public/components/HideCharsToggle/hideChars.light.png";
import ShowCharsDarkImg from "../public/components/HideCharsToggle/showChars.dark.png";
import ShowCharsLightImg from "../public/components/HideCharsToggle/showChars.light.png";

const HideCharsToggle = ({
  startAsVisible = false,
  onChange = (isVisible) => {},
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(startAsVisible);

  const handleClick = () => {
    setIsVisible((curIsVisible) => !curIsVisible);
  };

  useEffect(() => {
    onChange(isVisible);
  }, [isVisible]);

  return (
    <Container
      data-is-visible={isVisible}
      onClick={handleClick}
      className={className}
    >
      <Eye />
    </Container>
  );
};

const Container = styled.div`
  cursor: pointer;
  outline: 0 none;
  border: 1px solid currentColor;
  border-radius: 4px;
`;

const Eye = styled.div`
  display: block;
  height: 25px;
  width: 25px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  [data-is-visible="true"] & {
    background-image: url(${HideCharsLightImg.src});
    @media (prefers-color-scheme: dark) {
      background-image: url(${HideCharsDarkImg.src});
    }
  }
  [data-is-visible="false"] & {
    background-image: url(${ShowCharsLightImg.src});
    @media (prefers-color-scheme: dark) {
      background-image: url(${ShowCharsDarkImg.src});
    }
  }
`;

export default HideCharsToggle;
