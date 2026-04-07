import InputField from "./InputField";

export default function ModalContent({ cancel, info }) {
  if (info) {
    let { title, type } = info;
  }
  return (
    <div className={"bg-blue-500 w-3xl h-200 flex flex-col rounded-lg"}>
      <h2> {info ? "Edit Workout" : "Create Workout"} </h2>
      <div id="inputList" className={"bg-black w-100 gap-1 flex flex-col"}>
        <InputField type={"title"} />
        <InputField type={"type"} />
        <InputField
          type={"selection"}
          choices={["strength", "cardio", "other"]}
        />
        <InputField type={"test"} />
        <InputField type={"test"} />
      </div>
      <button onClick={cancel} className={"bg-white text-gray-900 w-15 rounded-md hover:bg-gray-500 active:scale-90 border-gray-600 border-1"}> Cancel</button>
    </div>
  );
}
