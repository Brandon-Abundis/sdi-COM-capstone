import InputField from "./InputField";

export default function ModalContent({ cancel, info }) {
  let { title, type } = info ? info : {title: "", type: ""};

  return (
    <div className={"bg-[#6045cd] w-3xl h-200 flex flex-col rounded-lg items-center "}>
      <h2> {info ? "Edit Workout" : "Create Workout"} </h2>
        <div id="inputList" className={"border-2 border-[#110a2f] rounded-lg gap-2 bg-[#2d2062] w-180 h-90 gap-1 flex flex-col items-center justify-center"}>
        <InputField style={"title"} def={title ? title : ""}/>
        <InputField
          style={"selection"}
          choices={["strength", "cardio", "other"]}
          chosen={type}
        />
        <InputField style={"Location"} />
        <InputField style={"Date"} />
        <InputField style={"Notes"} />
      </div>
      <button onClick={cancel} className={"bg-white text-gray-900 w-15 rounded-md hover:bg-gray-500 active:scale-90 border-gray-600 border-1"}> Cancel</button>
    </div>
  );
}
