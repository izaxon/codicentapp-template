declare module "react-json-editor-ajrm" {
  import * as React from "react";

  export interface JSONInputProps {
    id?: string;
    placeholder?: object;
    locale?: unknown;
    height?: string;
    width?: string;
    onChange?: (content: unknown) => void;
    [key: string]: unknown;
  }

  export default class JSONInput extends React.Component<JSONInputProps, object> {}
}

declare module "react-json-editor-ajrm/locale/en" {
  const locale: unknown;
  export default locale;
}
