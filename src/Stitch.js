import {
    Stitch,
    RemoteMongoClient
  } from "mongodb-stitch-browser-sdk";


let client = Stitch.initializeDefaultAppClient("main-brodv");

let mongodb = client.getServiceClient(
  RemoteMongoClient.factory,
  "main"
);

export {client, mongodb};