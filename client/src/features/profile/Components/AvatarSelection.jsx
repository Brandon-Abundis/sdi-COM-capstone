import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function AvatarSelection() {
  const base_pic = ["/Avatar/male.png", "/Avatar/female.png"];
  const head_wear = [
    "/Avatar/beanie.png",
    "/Avatar/hat.png",
    "/Avatar/headband.png",
    "/Avatar/wreath.png",
  ];
  const gloves = ["/Avatar/gloves.png", "/Avatar/gloves2.png"];
  const misc = [
    "/Avatar/outline.png",
    "/Avatar/headphones.png",
    "/Avatar/chain.png",
  ];

  const [base, setBase] = useState(base_pic[0]);
  const [head, setHead] = useState();
  const [chosenGloves, setChosenGloves] = useState();
  const [chosenMisc, setChosenMisc] = useState([]);

  return (
    <>
      <div className="relative w-64 h-64 border-2 border-gray-500 rounded-lg overflow-hidden bg-slate-200 mb-8">
        <img src={base} className="absolute inset-0 w-full h-full z-10" />

        {chosenGloves && (
          <img
            src={chosenGloves}
            className="absolute inset-0 w-full h-full z-20"
          />
        )}

        {head && (
          <img src={head} className="absolute inset-0 w-full h-full z-30" />
        )}

        {chosenMisc.map((item, index) => (
          <img
            key={index}
            src={item}
            className="absolute inset-0 w-full h-full z-40"
          />
        ))}
      </div>
      <div>
        Base
        {base_pic.map((pic, index) => (
          <img key={index} src={pic} onClick={() => setBase(pic)}></img>
        ))}
      </div>
      <div>
        Head
        {head_wear.map((pic, index) => (
          <img key={index} src={pic} onClick={() => setHead(pic)}></img>
        ))}
      </div>
      <div>
        Gloves
        {gloves.map((pic, index) => (
          <img key={index} src={pic} onClick={() => setChosenGloves(pic)}></img>
        ))}
      </div>
      <div>
        Misc
        {misc.map((pic, index) => (
          <img
            key={index}
            src={pic}
            onClick={() => setChosenMisc([...chosenMisc, pic])}
          ></img>
        ))}
      </div>
    </>
  );
}
