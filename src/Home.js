import React, { useState, useEffect } from 'react';

import { client, mongodb } from './Stitch';
import { getAllMemes, insertMeme } from './MongoDB';
import {
    AnonymousCredential,
    GoogleRedirectCredential
} from 'mongodb-stitch-browser-sdk';
import { useAuth0 } from './react-auth0-spa';
import blb from './blb.jpg';
export default function Home() {
    let [memes, setMemes] = useState([]);
    let [topCaption, setTopCaption] = useState('');
    let [bottomCaption, setBottomCaption] = useState('');

    const {
        loading,
        user,
        isAuthenticated,
        loginWithRedirect,
        logout
    } = useAuth0();

    useEffect(() => {
        if (client.auth.user) {
            getAllMemes().then((data) => {
                setMemes(data);
            });
        }
    }, []);

    if (client.auth.hasRedirectResult()) {
        client.auth.handleRedirectResult().then((user) => {
            console.log(user);
        });
    }

    const handleTopChange = (event) => {
        setTopCaption(event.target.value);
    };

    const handleBottomChange = (event) => {
        setBottomCaption(event.target.value);
    };

    const handleInsertMeme = (e) => {
        console.log('called');
        e.preventDefault();
        console.log(topCaption);
        console.log(bottomCaption);
        console.log(client.auth.user);

        insertMeme(client.auth.user, topCaption, bottomCaption).then(() => {
            setTopCaption('');
            setBottomCaption('');
            getAllMemes().then((data) => {
                setMemes(data);
            });
        });
    };

    return (
        <div>
            <div className="flex bg-black text-white">
                <div className="w-1/2">Superstitions</div>
                <div className="w-1/2">
                    {isAuthenticated && <div onClick={logout}>Logout</div>}
                    {!isAuthenticated && (
                        <div onClick={loginWithRedirect}>Login</div>
                    )}
                </div>
            </div>
            <div className="bg-gray-500">
                <div className="container mx-auto text-center">
                    <div className="flex flex-wrap">
                        <div className="w-1/3 p-5 relative">
                            <form onSubmit={handleInsertMeme}>
                                <div className="absolute caption top">
                                    <input
                                        className="rounded-lg"
                                        type="text"
                                        onChange={(e) => handleTopChange(e)}
                                    />
                                </div>

                                <img
                                    className="image my-5"
                                    src={blb}
                                    alt="Bad Luck Brian"
                                />

                                <div className="absolute caption bottom">
                                    <input
                                        className="rounded-lg"
                                        type="text"
                                        onChange={(e) => handleBottomChange(e)}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    value="Submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                />
                            </form>
                        </div>
                        {memes.map((meme) => (
                            <div
                                className="w-1/3 p-5 text-white relative"
                                key={meme._id}
                            >
                                <div className="absolute caption top">
                                    {meme.top_caption}
                                </div>
                                <img
                                    className="image my-5"
                                    src={blb}
                                    alt="Bad Luck Brian"
                                />
                                <div className="absolute caption bottom">
                                    {meme.bottom_caption}
                                </div>
                                <div>
                                    <div className="text-black">
                                        {meme.votes}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
