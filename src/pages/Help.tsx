import manual from "../assets/manual.md?raw";
import { Markdown, Content, Page } from "codicent-app-sdk";

const Help = () => {
  return (
    <Page>
      <Content>
        <Markdown content={manual} />
      </Content>
    </Page>
  );
};

export default Help;
