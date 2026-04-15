import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/AuthProvider";
export default function AvatarSelection() {
  const background = [
    null,
    "/Avatar/bg/bg1.png",
    "/Avatar/bg/bg2.jpg",
    "/Avatar/bg/bg3.jpeg",
    "/Avatar/bg/bg4.jpg",
  ];
  const base_pic = ["/Avatar/male.png", "/Avatar/female.png"];
  const colors = [
    "/Avatar/color/image.png",
    "/Avatar/color/image (1).png",
    "/Avatar/color/image (2).png",
    "/Avatar/color/image (3).png",
    "/Avatar/color/image (4).png",
    "/Avatar/color/image (5).png",
  ];
  const head_wear = [
    "/Avatar/beanie.png",
    "/Avatar/hat.png",
    "/Avatar/headband.png",
    "/Avatar/wreath.png",
  ];
  const hands = [
    "Avatar/Hands/image (1).png",
    "Avatar/Hands/image (2).png",
    "Avatar/Hands/image (3).png",
    "Avatar/Hands/image (4).png",
    "Avatar/Hands/image (5).png",
    "Avatar/Hands/image (6).png",
  ];
  const gloves = ["/Avatar/gloves.png", "/Avatar/gloves2.png"];
  const misc = [
    "/Avatar/outline.png",
    "/Avatar/headphones.png",
    "/Avatar/chain.png",
  ];

  const { user, refreshUser, profile } = useAuth();

  const [back, setBack] = useState(profile?.back || null);

  const [base, setBase] = useState(profile?.base || base_pic[0]);
  const [color, setColor] = useState(profile?.color || colors[0]);
  const [hand, setHand] = useState(profile?.hand || hands[0]);

  const [head, setHead] = useState(profile?.head || null);
  const [chosenGloves, setChosenGloves] = useState(
    profile?.chosenGloves || null,
  );
  const [chosenMisc, setChosenMisc] = useState(profile?.chosenMisc || []);

  useEffect(() => {
    if (profile) {
      setBack(profile.back || null);
      setColor(profile.color || colors[0]);
      setHand(profile.hand || hands[0]);

      setBase(profile.base || base_pic[0]);
      setHead(profile.head || null);
      setChosenGloves(profile.chosenGloves || null);
      setChosenMisc(profile.chosenMisc || []);
    }
  }, [profile]);

  const navigate = useNavigate();

  async function edit(data) {
    try {
      const response = await fetch(
        `http://localhost:8080/users/id/${user.id}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to save");

      await refreshUser();

      console.log("Account edited successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const handleSave = () => {
    const avatarSelection = {
      back,
      hand,
      color,
      base,
      head,
      chosenGloves,
      chosenMisc,
    };
    const updatedProfile = {
      ...user,
      profile: avatarSelection,
    };

    // localStorage.setItem("user", JSON.stringify(updatedProfile));

    edit(updatedProfile);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-base-100 rounded-xl shadow-xl">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold uppercase tracking-wider text-accent">
          Preview
        </h2>
        <div className="relative w-64 h-64 border-4 border-accent rounded-2xl overflow-hidden bg-[#2a2245] shadow-2xl">
          {back && back !== null && (
            <img
              src={back}
              alt=""
              className="absolute inset-0 w-full h-full z-2 object-cover"
            />
          )}
          <img
            src={color}
            className="absolute inset-0 w-full h-full z-5 object-contain"
          />
          <img
            src={hand}
            className="absolute inset-0 w-full h-full z-5 object-contain"
          />

          <img
            src={base}
            className="absolute inset-0 w-full h-full z-10 object-contain"
          />

          {chosenGloves && (
            <img
              src={chosenGloves}
              className="absolute inset-0 w-full h-full z-20 object-contain"
            />
          )}

          {head && (
            <img
              src={head}
              className="absolute inset-0 w-full h-full z-30 object-contain"
            />
          )}

          {chosenMisc &&
            chosenMisc.map((item, index) => (
              <img
                key={index}
                src={item}
                className="absolute inset-0 w-full h-full z-40 object-contain"
              />
            ))}
        </div>

        <button
          onClick={handleSave}
          className="btn btn-accent btn-wide shadow-lg hover:scale-105 transition-transform"
        >
          Save Gear Loadout
        </button>
      </div>

      <div className="flex-1 space-y-3">
        <section>
          <h3 className="text-sm font-semibold mb-2 opacity-70 uppercase tracking-wider">
            Body Type
          </h3>
          <div className="grid grid-cols-8 gap-4 p-3 bg-base-200 rounded-lg min-h-[100px]">
            {base_pic.map((pic, index) => (
              <img
                key={index}
                src={pic}
                className={`w-full aspect-square p-2 rounded-md cursor-pointer border-2 transition-all object-contain ${
                  base === pic
                    ? "border-accent bg-accent/20"
                    : "border-transparent hover:bg-base-300"
                }`}
                onClick={() => setBase(pic)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold mb-2 opacity-70 uppercase tracking-wider">
            Color
          </h3>
          <div className="grid grid-cols-8 gap-4 p-3 bg-base-200 rounded-lg min-h-[100px]">
            {colors.map((pic, index) => (
              <img
                key={index}
                src={pic}
                className={`w-full aspect-square p-2 rounded-md cursor-pointer border-2 transition-all object-contain ${
                  color === pic
                    ? "border-accent bg-accent/20"
                    : "border-transparent hover:bg-base-300"
                }`}
                onClick={() => {
                  setColor(pic);
                  setHand(hands[index]);
                }}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold mb-2 opacity-70 uppercase tracking-wider">
            Head Gear
          </h3>
          <div className="grid grid-cols-8 gap-4 p-3 bg-base-200 rounded-lg min-h-[100px]">
            {head_wear.map((pic, index) => (
              <img
                key={index}
                src={pic}
                className={`w-full aspect-square p-2 rounded-md cursor-pointer border-2 transition-all object-contain ${
                  head === pic
                    ? "border-accent bg-accent/20"
                    : "border-transparent hover:bg-base-300"
                }`}
                onClick={() => setHead(head === pic ? null : pic)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold mb-2 opacity-70 uppercase tracking-wider">
            Gloves
          </h3>
          <div className="grid grid-cols-8 gap-4 p-3 bg-base-200 rounded-lg min-h-[100px]">
            {gloves.map((pic, index) => (
              <img
                key={index}
                src={pic}
                className={`w-full aspect-square p-2 rounded-md cursor-pointer border-2 transition-all object-contain ${
                  chosenGloves === pic
                    ? "border-accent bg-accent/20"
                    : "border-transparent hover:bg-base-300"
                }`}
                onClick={() =>
                  setChosenGloves(chosenGloves === pic ? null : pic)
                }
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold mb-2 opacity-70 uppercase tracking-wider">
            Miscellaneous
          </h3>
          <div className="grid grid-cols-8 gap-4 p-3 bg-base-200 rounded-lg min-h-[100px]">
            {misc.map((pic, index) => (
              <img
                key={index}
                src={pic}
                className={`w-full aspect-square p-2 rounded-md cursor-pointer border-2 transition-all object-contain ${
                  chosenMisc.includes(pic)
                    ? "border-accent bg-accent/20"
                    : "border-transparent hover:bg-base-300"
                }`}
                onClick={() => {
                  if (chosenMisc.includes(pic)) {
                    setChosenMisc(chosenMisc.filter((i) => i !== pic));
                  } else {
                    setChosenMisc([...chosenMisc, pic]);
                  }
                }}
              />
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-sm font-semibold mb-2 opacity-70 uppercase tracking-wider">
            Background
          </h3>
          <div className="grid grid-cols-8 gap-4 p-3 bg-base-200 rounded-lg min-h-[100px]">
            {background.map((pic, index) => (
              <img
                key={index}
                src={pic}
                className={`w-full aspect-square p-2 rounded-md cursor-pointer border-2 transition-all object-contain ${
                  back === pic
                    ? "border-accent bg-accent/20"
                    : "border-transparent hover:bg-base-300"
                }`}
                onClick={() => setBack(pic)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
