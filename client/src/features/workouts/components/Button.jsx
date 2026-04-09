export default function Button({ name, func }) {
  return (
    <button
      onClick={() => {
        console.log('omg')
        func();
      }}
      className={
        "bg-white text-gray-900 w-15 rounded-md hover:bg-gray-500 active:scale-90 border-gray-600 border mt-3"
      }
    >
      {" "}
      {name}
    </button>
  );
}
