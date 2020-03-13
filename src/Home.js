import React, { useState, useEffect } from "react";
import blb from "./blb.jpg";

export default function Home() {
  return (
    <div>
      <div className="flex bg-black text-white p-5">
        <div className="w-1/2">Bad Luck Brian</div>
        <div className="w-1/2 text-right">{/* To Do */}|</div>
      </div>
      <div className="bg-gray-500">
        <div className="container mx-auto text-center">
          <div className="flex flex-wrap">
            <div className="w-full min-h-screen">
              <h1 className="text-6xl">Bad Luck Brian Strikes Again :(</h1>
            </div>

            <Create />

            {/* Display Memes */}
          </div>
        </div>
      </div>
    </div>
  );
}

const Create = () => {
  return (
    <div className="w-1/3 p-5 relative">
      <h1>TODO: Create Meme</h1>
    </div>
  );
};

const Meme = () => {
  return (
    <div className="w-1/3 p-5 text-white relative">
      <h1>TODO: MEMES</h1>
    </div>
  );
};
