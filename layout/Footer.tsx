import { styled } from "styled-components";

const Footer = () => (
  <FooterComponent>
    <HorizontalRule />
    &copy; Rob Taylor {new Date().getFullYear()}
  </FooterComponent>
);
export default Footer;

const HorizontalRule = styled.div`
  display: flex;
  width: 95vw;
  height: 1px;
  background-color: transparent;

  background: linear-gradient(
    90deg,
    rgba(150, 150, 150, 0.1) 0%,
    rgba(150, 150, 150, 1) 50%,
    rgba(150, 150, 150, 0.1) 100%
  );
`;

const FooterComponent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0;
  padding: 2rem 0;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  a {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
`;
