export default function Icon({ type }) {
  let src = type == "strength" ? "/strength.png" : type == "cardio" ? "/cardio.png" : "/other.png";
  return (
    <div className={"bg-white rounded-lg m-2 mb-1"}>
      <img className={"w-20"} src={src} alt="strength ! :3" />
    </div>
  );
}
