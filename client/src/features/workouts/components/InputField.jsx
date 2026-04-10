import { forwardRef } from "react";

export default forwardRef(function InputField(
  { style, choices, def, chosen },
  ref,
) {
  if (style == "selection") {
    return (
      <div>
        <label htmlFor="types"> Workout Type: </label>
        <select
          ref={ref}
          name="type"
          id="workoutSelection"
          className="select select-bordered bg-base-200 border-base-300 p-3 rounded-lg mb-3 text-base-content"
        >
          {choices.map((choice) => {
            let showChoice = choice.charAt(0).toUpperCase() + choice.slice(1);
            if (choice == chosen?.toLowerCase()) {
              return (
                <option key={choice} value={choice} defaultValue>
                  {showChoice}
                </option>
              );
            }
            return <option key={choice} value={choice}>{showChoice}</option>;
          })}
        </select>
      </div>
    );
  }
  return (
    <div>
      <input
        ref={ref}
        placeholder={style}
        defaultValue={def}
        className="input input-bordered rounded-md text-center bg-base-200 text-secondary w-80 mb-3 placeholder:text-secondary/50 focus:border-primary"
      />
    </div>
  );
});
