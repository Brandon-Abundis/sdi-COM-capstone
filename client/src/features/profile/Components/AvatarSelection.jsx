import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Avatar() {
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
  return (
    <>
      <div>
        Base
        <img></img>
      </div>
    </>
  );
}
