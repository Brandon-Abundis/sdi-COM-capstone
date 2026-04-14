import { useEffect, useState, forwardRef } from "react"

export default forwardRef(function Tab({ name, func }, ref) {
  let [clicked, setClicked] = useState(false)
  let def = "font-bold hover:bg-gray-500 cursor-pointer p-4  border-2 rounded-md"

  useEffect(() => {}, [clicked])

  return (
    <>
      <button ref={ref} className={def} onClick={() => {
        let bool = clicked == true ? false : true
        setClicked(bool)
        func()
        }}> {name} </button>
    </>
  );
})
