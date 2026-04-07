export default function InputField({ type, choices }) {
  if (type == "selection") {
    return (
      <div>
        <label for="types"> Workout Type: </label>

        <select name="type" id="workoutSelection">
          {choices.map((choice) => {
            let showChoice = choice.charAt(0).toUpperCase() + choice.slice(1);
            console.log(showChoice);
            return <option value={choice}> {showChoice} </option>;
          })}
        </select>
      </div>
    );
  }
  return (
    <div>
      <input placeholder={type} />
    </div>
  );
}
