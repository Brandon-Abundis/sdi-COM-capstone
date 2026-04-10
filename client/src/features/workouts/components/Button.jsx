export default function Button({ name, func }) {
  return (
    <button
      onClick={() => {
        console.log('omg')
        func();
      }}
      className={
        "text-[#a78bfa] bg-[#0e0b1a] w-15 rounded-md hover:bg-gray-500 active:scale-90 border-[#1e1838] border-2 mt-3"
      }
    >
      {" "}
      {name}
    </button>
  );
}
