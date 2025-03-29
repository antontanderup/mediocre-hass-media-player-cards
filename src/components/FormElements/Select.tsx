import { FC } from "preact/compat";

export type Select = {
  options: { name: string; value: string }[];
  onSelected: (value: string) => void;
  selected: string;
};

export const Select: FC<Select> = ({ options, onSelected, selected }) => {
  return (
    <select
      value={selected}
      onChange={e => onSelected((e.target as HTMLSelectElement).value)}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};
