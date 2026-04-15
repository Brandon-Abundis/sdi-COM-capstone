import { forwardRef } from "react";

export default forwardRef(function InputField(
  { style, choices, def, chosen, aged, maxLen },
  ref,
) {
  if (style == "selection") {
    return (
      <div className={"flex flex-col w-50 items-center"}>
        <label htmlFor="types"> Workout Type: </label>
        <select
          ref={ref}
          name="type"
          id="workoutSelection"
          className={`select select-bordered bg-base-200 border-base-300 p-3 rounded-lg mb-3 text-base-content text-center ${aged ? "pointer-events-none bg-gray-800" : ""}`}
        >
          {choices.map((choice) => {
            let showChoice = choice.charAt(0).toUpperCase() + choice.slice(1);
            if (choice == chosen?.toLowerCase()) {
              return (
                <option key={choice} value={choice} selected defaultValue>
                  {showChoice}
                </option>
              );
            }
            return (
              <option key={choice} value={choice}>
                {showChoice}
              </option>
            );
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
        readOnly={aged}
        maxlength={maxLen}
        className={` ${aged ? "pointer-events-none bg-gray-800" : ""} input input-bordered rounded-md text-center bg-base-200 text-secondary w-80 mb-3 placeholder:text-secondary/50 focus:border-primary`}
      />
    </div>
  );
});
