import { Stitch, RemoteMongoClient } from "mongodb-stitch-browser-sdk";

let client = Stitch.initializeDefaultAppClient("main-brodv");

let mongodb = client.getServiceClient(RemoteMongoClient.factory, "main");

let db = mongodb.db("friday");

const getAllMemes = () => {
  console.log("called");
  return db
    .collection("memes")
    .find({}, { sort: { _id: -1 } })
    .asArray();
};

const insertMeme = (user, topCaption, bottomCaption) => {
  return db
    .collection("memes")
    .insertOne({
      owner_id: user.id,
      top_caption: topCaption,
      bottom_caption: bottomCaption,
      votes: 0
    })
    .then(getAllMemes);
};

const voteMeme = (id, direction) => {
  client.callFunction("vote", [id, direction]);
};

export { client, mongodb, getAllMemes, insertMeme, voteMeme };
