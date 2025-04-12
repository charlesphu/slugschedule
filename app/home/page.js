import React from "react";

import Title from "./Title";
import UploadForm from "./UploadForm";

export default function Home() {
  return (
    <div>
      {/* Content */}
      <div className="relative z-1 flex h-screen w-full items-center justify-between p-20">
        <Title />
        <UploadForm />
      </div>

      {/* Stickers and Decorations */}
      <div className="pointer-event-none absolute top-0 h-screen w-full select-none">
        <img
          className="absolute top-5 left-20 h-[20%] w-[12%] object-contain"
          src={"Decor 1.png"}
          draggable={false}
        />
        <img
          className="absolute top-2 right-20 h-[20%] w-[7%] object-contain"
          src={"Decor 2.png"}
          draggable={false}
        />
        <img
          className="absolute bottom-2 left-20 z-3 h-[30%] w-[20%] object-contain"
          src={"Slug Draw.png"}
          draggable={false}
        />
        <img
          className="absolute right-20 bottom-2 z-3 h-[30%] w-[20%] object-contain"
          src={"Decor 3.png"}
          draggable={false}
        />
      </div>
    </div>
  );
}
