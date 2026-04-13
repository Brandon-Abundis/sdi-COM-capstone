export default function Button({ name, func, type }) {
  
  return (
    <button
      onClick={() => func()}
      className="btn btn-sm btn-ghost border border-base-300 hover:bg-base-300 mt-3 w-15"
    >
      {name}
    </button>
  );
}
