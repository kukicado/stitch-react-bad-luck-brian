import React, { useState, useEffect } from "react";
import blb from "./blb.jpg";

import { client, getAllMemes, insertMeme, voteMeme } from "./Stitch";
import {
  AnonymousCredential,
  CustomCredential
} from "mongodb-stitch-browser-sdk";

import { useAuth0 } from "./react-auth0-spa";

export default function Home() {
  let [memes, setMemes] = useState([]);

  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    getTokenSilently,
    logout
  } = useAuth0();

  useEffect(() => {
    if (client.auth.user) {
      getAllMemes().then(data => {
        setMemes(data);
      });
    } else {
      client.auth
        .loginWithCredential(new AnonymousCredential())
        .then(user => {
          getAllMemes().then(data => {
            setMemes(data);
          });
        })
        .catch(console.error);

      /*
      getTokenSilently().then(token => {
        const credential = new CustomCredential(token);

        client.auth
          .loginWithCredential(credential)
          .then(authedUser => {
            getAllMemes().then(data => {
              setMemes(data);
            });
          })
          .catch(err => console.log(err));
      });
      */
    }
  }, []);

  const handleLogout = () => {
    client.auth.logout().then(() => logout());
  };

  const updateMemes = () => {
    getAllMemes().then(data => {
      setMemes(data);
    });
  };

  return (
    <div>
      <div className="flex bg-black text-white p-5">
        <div className="w-1/2" onClick={handleLogout}>
          Bad Luck Brian
        </div>
        <div className="w-1/2 text-right">
          {isAuthenticated && <div onClick={handleLogout}>Logout</div>}
          {!isAuthenticated && <div onClick={loginWithRedirect}>Login</div>}
        </div>
      </div>
      <div className="bg-gray-500">
        <div className="container mx-auto text-center">
          <div className="flex flex-wrap">
            {!client.auth.user && (
              <div className="w-full min-h-screen">
                <h1 className="text-6xl">Bad Luck Brian Strikes Again :(</h1>
              </div>
            )}
            {client.auth.user && <Create updateMemes={updateMemes} />}

            {memes.map(meme => (
              <Meme
                key={meme._id.toString()}
                id={meme._id}
                topCaption={meme.top_caption}
                bottomCaption={meme.bottom_caption}
                votes={meme.votes}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Create = ({ updateMemes }) => {
  let [topCaption, setTopCaption] = useState("");
  let [bottomCaption, setBottomCaption] = useState("");

  const handleTopChange = event => {
    setTopCaption(event.target.value);
  };

  const handleBottomChange = event => {
    setBottomCaption(event.target.value);
  };

  const handleInsertMeme = e => {
    e.preventDefault();

    insertMeme(client.auth.user, topCaption, bottomCaption).then(() => {
      setTopCaption("");
      setBottomCaption("");
      getAllMemes().then(data => {
        updateMemes(data);
      });
    });
  };

  return (
    <div className="w-1/3 p-5 relative">
      <form onSubmit={handleInsertMeme}>
        <div className="absolute caption top">
          <input
            className="rounded-lg"
            type="text"
            value={topCaption}
            onChange={e => handleTopChange(e)}
          />
        </div>

        <img className="image my-5" src={blb} alt="Bad Luck Brian" />

        <div className="absolute caption bottom">
          <input
            className="rounded-lg"
            type="text"
            value={bottomCaption}
            onChange={e => handleBottomChange(e)}
          />
        </div>

        <input
          type="submit"
          value="Submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        />
      </form>
    </div>
  );
};

const Meme = ({ id, topCaption, bottomCaption, votes }) => {
  const [count, setCount] = useState(votes);

  const vote = (id, direction) => {
    voteMeme(id, direction);
    if (direction === 1) {
      setCount(count + 1);
    } else {
      setCount(count - 1);
    }
  };

  return (
    <div className="w-1/3 p-5 text-white relative">
      <div className="absolute caption top">{topCaption}</div>
      <img className="image my-5" src={blb} alt="Bad Luck Brian" />
      <div className="absolute caption bottom">{bottomCaption}</div>
      <div className="flex flex-wrap text-center">
        <div className="w-1/3" onClick={() => vote(id, 1)}>
          Upvote
        </div>
        <div className="w-1/3 text-black">{count}</div>
        <div className="w-1/3" onClick={() => vote(id, -1)}>
          Downvote
        </div>
      </div>
    </div>
  );
};
