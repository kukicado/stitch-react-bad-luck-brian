import {mongodb} from './Stitch';

let db = mongodb.db('friday');

const getAllMemes = () => {
    return db
        .collection("memes")
        .find({})
        .asArray()
}

const insertMeme = (user, topCaption, bottomCaption) => {
    return db
      .collection("memes")
      .insertOne({
        owner_id: user.id,
        top_caption: topCaption,
        bottom_caption: bottomCaption
      })
      .then(getAllMemes);
}

export {getAllMemes, insertMeme}