import connect from "./connect";

const API_KEY =
  "eyJhbGciOiJFUzM4NCIsImtpZCI6ImU2YzQyNzQzLWUxZTItNDBmZC1iMjM5LWFmMGJiNzI2YzNjYiIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoiMEN4cl9qSXZILWlqUUp5VzVrWUZIZHdKb1pObVJLT1UiLCJqdGkiOiJlNmM0Mjc0My1lMWUyLTQwZmQtYjIzOS1hZjBiYjcyNmMzY2IiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoiRnVvNmFyM1IzbGJ5TkdFZlVpZG1RUWF2U0Q3c2YwN1cifQ.StCXk3OvAnV5GxEf2FXJNtomaPmsN-1DsTwswM55a90x19V9yfHiuq7hKk_pKkS7NW1yptpVvBFCuVStm2u3K7cNgXcnmS3GbgORUgEQpRPZkp6UTN1RFvvhTBKF5foj";

const WEB_ID = "B0HZmvmOt3kMjQaTF6OavG8QloKH3ktW";
//const APP_ID = "961d1d90-fe99-4035-86be-c6d58ee2efa8";
const APP_ID = "9b9a655b-67db-4456-b2e6-0c0d63b3679b";
export const URL = "https://oaw5nbmep0bhq2j.eu.qlikcloud.com";

export const run = async () => {
  const app = await connect({
    url: URL,
    webIntegrationId: WEB_ID,
    appId: APP_ID,
  });

  return app;
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

export const getObjectQlik = async (app) => {
  let sessionObject = await app.createSessionObject({
    qInfo: {
      qType: "chart",
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["lng"],
          },
          qNullSuppression: true,
        },
        {
          qDef: {
            qFieldDefs: ["lat"],
          },
          qNullSuppression: true,
        },
      ],

      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qWidth: 2,
          qHeight: 5000,
        },
      ],
      qInterColumnSortOrder: [0, 1],
      qSuppressZero: true,
    },
  });

  let sessionObjectLayout = await sessionObject.getLayout();
  await app.destroySessionObject(sessionObject.id);
  return sessionObjectLayout;
};

// export default { URL, run, requestQlikBot, getObjectQlik };
