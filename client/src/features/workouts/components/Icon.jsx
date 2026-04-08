export default function Icon({ type }) {
  type = type.toLowerCase();
  let src;
  let strength = "/strength.png";
  let cardio = "/cardio.png";
  let other = "/other.png";

  switch (type) {
    case "strength":
      src = strength;
      break;

    case "cardio":
      src = cardio;
      break;

    case "hypertrophy":
      src = strength;
      break;

    case "power":
      src = strength;
      break;

    default:
      src = other;
      break;
  }

  return (
    <div className={"bg-white/25 rounded-lg m-2 mb-1"}>
      <img className={"w-20"} src={src} alt="strength ! :3" />
    </div>
  );
}
