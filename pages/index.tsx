import { useState } from "react";
import styled from "styled-components";
import Input from "../components/Input";

const Home = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submission, setSubmission] = useState<{ [key: string]: string }>({
    username,
    password,
  });

  const handleSubmit = () => setSubmission({ username, password });

  return (
    <Container>
      <Main>
        <Title>Cobalt Input Element</Title>
        <Form>
          <Input
            value={username}
            placeholder={"Username"}
            onChange={({ value }) => setUsername(value)}
            onSubmit={handleSubmit}
            required
            css={`
              width: 300px;
            `}
          />
          <Input
            value={password}
            placeholder={"Password"}
            showPasswordToggle
            type={"password"}
            passwordCharDelay={1000}
            onChange={({ value }) => setPassword(value)}
            onSubmit={handleSubmit}
            required
          />
          <Button
            onClick={handleSubmit}
            onKeyUp={(e: React.KeyboardEvent) => {
              e.key === "Enter" && handleSubmit();
              console.log(e.key);
            }}
          >
            Login
          </Button>
        </Form>
        <Code>{JSON.stringify(submission, null, 4)}</Code>
      </Main>
    </Container>
  );
};
export default Home;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Container = styled.div`
  padding: 0 2rem;
  flex: 1;
`;

const Main = styled.div`
  padding: 4rem 0;
  display: flex;
  gap: 4rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div.attrs({ role: "heading" })`
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
  text-align: center;
  & a {
    color: rgb(0, 112, 243);
    text-decoration: none;
  }

  & a:hover,
  & a:focus,
  & a:active {
    text-decoration: underline;
  }
`;

const Button = styled.div.attrs({ tabIndex: 0 })`
  cursor: pointer;
  border: 1px solid currentColor;
  border-radius: 4px;
  width: fit-content;
  padding: 2px 8px;
  user-select: none;
  &:focus {
    outline: 4px solid rgb(75, 150, 255);
    @media (prefers-color-scheme: dark) {
      outline: 4px solid rgb(25, 100, 150);
    }
  }
`;

const Code = styled.div`
  font-family: monospace;
`;
