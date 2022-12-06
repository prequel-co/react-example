import React from "react";

export type Option = {
  value: string;
  display: string;
};

type DropdownProps = {
  label: string;
  options: Option[];
  selected: string;
  setSelected: (o: string) => void;
};
const Dropdown = ({ label, options, selected, setSelected }: DropdownProps) => {
  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(event.target.value);
  };

  return (
    <div className="dropdown">
      <label>{label}</label>
      <select onChange={changeHandler} value={selected}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.display}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
