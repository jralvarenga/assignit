declare module "*.svg" {
  import React from 'react';
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '@env' {
  export const API_KEY: string;
  export const CLIENT_ID: string;
  export const GOOGLE_WEBCLIENT_ID: string;
}