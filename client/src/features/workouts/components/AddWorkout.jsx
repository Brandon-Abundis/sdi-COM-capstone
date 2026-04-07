export default function AddWorkout({ onClick }) {
  return (
    <div
      onClick={onClick}
      className={
        "active:scale-80 transition-transform duration-100 hover:scale-130 hover:cursor-pointer bg-gray-400 opacity-50 w-40 text-wrap rounded-lg h-40 m-20 border-4 flex items-center justify-center"
      }
    >
      <img src="/plus.png" alt="plus !" className={"opacity-40"} />
    </div>
  );
}
