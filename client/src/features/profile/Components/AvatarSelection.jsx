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

  const [base, setBase] = useState([base_pic[0]]);
  const [head, setHead] = useState();
  const [chosenGloves, setChosenGloves] = useState();
  const [chosenMisc, setChosenMisc] = useState([]);

  return (
    <>
      <div>
        Base
        {base_pic.map((pic, id) => (
          <img key={id} src={pic} onClick={() => setBase(pic)}></img>
        ))}
      </div>
      <div>
        Head
        {head_wear.map((pic, id) => (
          <img key={id} src={pic} onClick={() => setHead(pic)}></img>
        ))}
      </div>
      <div>
        Gloves
        {gloves.map((pic, id) => (
          <img key={id} src={pic} onClick={() => setChosenGloves(pic)}></img>
        ))}
      </div>
      <div>
        Misc
        {misc.map((pic, id) => (
          <img
            key={id}
            src={pic}
            onClick={() => setChosenMisc([...chosenMisc, pic])}
          ></img>
        ))}
      </div>
    </>
  );
}
