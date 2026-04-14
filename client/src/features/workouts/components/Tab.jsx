import { forwardRef } from "react"

export default forwardRef(function Tab({ name, func }, ref) {
  let def = "font-bold hover:bg-gray-500 cursor-pointer p-4  border-2 rounded-md"

  return (
    <>
      <button ref={ref} className={def} onClick={() => {
        func()
        }}> {name} </button>
    </>
  );
})
