export default function Button({ name, func }) {

  return (
    <button
      onClick={() => func()}
      className="btn btn-sm btn-ghost border border-base-300 hover:bg-base-300 mt-3 w-20 border-b-5 border-black hover:-translate-y-1 hover:scale-110"
    >
      {name}
    </button>
  );
}
