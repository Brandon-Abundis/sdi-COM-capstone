import { useEffect, useState } from "react"

export default function Tab({ name, func }) {
  let [clicked, setClicked] = useState(false)
  let notClicked = "font-bold hover:bg-gray-500 cursor-pointer p-4  border-2 rounded-md"
  let yesClicked = "font-bold hover:bg-gray-500 bg-purple-500 cursor-pointer p-4  border-2 rounded-md"
  useEffect(() => {}, [clicked])

  return (
    <>
      <button className={clicked == true ? yesClicked : notClicked} onClick={() => {
        let bool = clicked == true ? false : true
        setClicked(bool)
        func()
        }}> {name} </button>
    </>
  );
}
