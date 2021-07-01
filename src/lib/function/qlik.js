import connect from "./connect";

const API_KEY =
  "eyJhbGciOiJFUzM4NCIsImtpZCI6IjMxZjdiNDMwLTkyYWQtNDRmMy1hNmUyLWM4NjVhNTk1MmVkOCIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoiMEN4cl9qSXZILWlqUUp5VzVrWUZIZHdKb1pObVJLT1UiLCJqdGkiOiIzMWY3YjQzMC05MmFkLTQ0ZjMtYTZlMi1jODY1YTU5NTJlZDgiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoiRnVvNmFyM1IzbGJ5TkdFZlVpZG1RUWF2U0Q3c2YwN1cifQ.PXrz5iQHEzLqC9Zr4wdZoG1C6QzGYyrXFPcMn4Tn4eDLdEj5k6RIaYaPCz38vwdvx_3ubdKrA6S9OXlswgvJ8LTCONZ_IvQJMtwKXlznAqKpgKbXfH_f6jjr6Gi_jnCK";

const WEB_ID = "B0HZmvmOt3kMjQaTF6OavG8QloKH3ktW";
const APP_ID = "961d1d90-fe99-4035-86be-c6d58ee2efa8";
export const URL = "https://oaw5nbmep0bhq2j.eu.qlikcloud.com";

export const run = async () => {
  const app = await connect({
    url: URL,
    webIntegrationId: WEB_ID,
    appId: APP_ID,
  });
};

const options = {
  // hostname: URL,
  // port: 443,
  // path: "/api/v1/questions/actions/ask",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
    "qlik-web-integration-id": WEB_ID,
  },
};

export const requestQlikBot = async (message) => {
  const data = JSON.stringify({
    text: message,
    app: { id: APP_ID, name: "Cars" },
  });

  let myObj = await fetch(URL + "/api/v1/questions/actions/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      "qlik-web-integration-id": WEB_ID,
    },
    body: data,
  }).then((data) => {
    return data.json();
  });
  let result, img;
  if ("narrative" in myObj.conversationalResponse.responses[0]) {
    result = myObj.conversationalResponse.responses[0].narrative.text;
  } else if ("imageUrl" in myObj.conversationalResponse.responses[0]) {
    img = myObj.conversationalResponse.responses[0].imageUrl;
    if ("narrative" in myObj.conversationalResponse.responses[1]) {
      result = myObj.conversationalResponse.responses[1].narrative.text;
    }
  }
  return { result, img };
};

export default { URL, run, requestQlikBot };
