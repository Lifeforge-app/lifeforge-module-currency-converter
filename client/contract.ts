export type EndpointGetCurrencies_OutputOK = string[];
export type EndpointGetRatesHistory_OutputOK = {
  date: string;
  rate: number;
}[];

export interface Contract {
  getCurrencies: EndpointGetCurrencies;
  getRatesHistory: EndpointGetRatesHistory;
}
export interface EndpointGetCurrencies {
  method: "get";
  input: {};
  output: {
    OK: EndpointGetCurrencies_OutputOK;
  };
  media: null;
}
export interface EndpointGetRatesHistory {
  method: "get";
  input: {
    query?: EndpointGetRatesHistory_InputQuery;
  };
  output: {
    OK: EndpointGetRatesHistory_OutputOK;
  };
  media: null;
}
export interface EndpointGetRatesHistory_InputQuery {
  from: string;
  to: string;
}
