import { forwardRef } from "react";

export default forwardRef(function InputField(
  { style, choices, def, chosen },
  ref,
) {
  if (style == "selection") {
    return (
      <div className={"flex flex-col items-center gap-2"}>
        <label for="types"> Type: </label>

        <select
          ref={ref}
          name="type"
          className={
            "bg-[#0c0916] p-3 rounded-lg border-2 border-[#231d3f] mb-3"
          }
        >
          {choices.map((choice) => {
            let showChoice = choice.charAt(0).toUpperCase() + choice.slice(1);
            if (choice == chosen.toLowerCase()) {
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
        ref={ref}
        placeholder={style}
        defaultValue={def}
        className={
          "rounded-md text-center bg-[#0e0b1a] text-[#a78bfa] w-80 border-3 border-[#231d3f] text-wrap focus:border-[#7300ff] mb-3 placeholder:text-[#a78bfa]/50"
        }
      />
    </div>
  );
});
