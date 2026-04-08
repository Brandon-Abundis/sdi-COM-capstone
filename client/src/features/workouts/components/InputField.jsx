export default function InputField({ style, choices, def, chosen }) {
  if (style == "selection") {
    return (
      <div>
        <label for="types"> Workout Type: </label>

        <select name="type" id="workoutSelection">
          {choices.map((choice) => {
            let showChoice = choice.charAt(0).toUpperCase() + choice.slice(1);
            if (choice == chosen) {
              // if there's already a type, select it
              return (
                <option value={choice} selected="selected">
                  {showChoice}
                </option>
              );
            }
            return <option value={choice}> {showChoice} </option>;
          })}
        </select>
      </div>
    );
  }
  return (
    <div>
      <input
        placeholder={style}
        defaultValue={def}
        className={
          "rounded-md text-center bg-white text-black w-80 border-3 border-[#0e001f]  text-wrap focus:border-[#7300ff] mb-3"
        }
      />
    </div>
  );
}