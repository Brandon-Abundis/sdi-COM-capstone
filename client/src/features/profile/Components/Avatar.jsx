import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Avatar({ userData }) {
  const [savedAvatar, setSavedAvatar] = useState(null);

  const initials =
    `${userData.first_name.slice(0, 1)}${userData.last_name.slice(0, 1)}`.toUpperCase();

  useEffect(() => {
    if (userData?.profile) {
      setSavedAvatar(JSON.parse(userData.profile));
    }
  }, [userData?.profile]);

  // if (!savedAvatar)
  //   return (
  //     <span className="text-sm font-bold text-[#c084fc] leading-none">
  //       {initials}
  //     </span>
  //   );

  return (
    <div className="relative w-full h-full flex items-center justify-center mr-1.5">
      {!savedAvatar && (
        <span className="text-sm font-bold text-[#c084fc] leading-none">
          {initials}
        </span>
      )}

      {savedAvatar && (
        <>
          <img src={savedAvatar.color} className="absolute inset-0 z-5" />
          <img src={savedAvatar.base} className="absolute inset-0 z-10" />
          {savedAvatar.head && (
            <img src={savedAvatar.head} className="absolute inset-0 z-30" />
          )}
          {savedAvatar.chosenGloves && (
            <img
              src={savedAvatar.chosenGloves}
              className="absolute inset-0 z-20 object-contain scale-150"
            />
          )}
          {savedAvatar.chosenMisc?.map((path, i) => (
            <img key={i} src={path} className="absolute inset-0 z-40" />
          ))}
        </>
      )}
    </div>
  );
}
