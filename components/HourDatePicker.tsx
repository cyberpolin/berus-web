import { useEffect, useState } from "react";
import { Field } from "formik";
// @ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { range } from "lodash";

const getHours = () => {
  return range(6, 24, 1);
};

const availableHours = getHours().map((x: any) => {
  const isPM = x > 12;
  const meridian = isPM ? "pm" : "am";
  const hour = isPM ? x - 12 : x;
  return {
    value: `${x}:00:00`,
    label: `${hour}:00${meridian}`,
  };
});

type FieldProps = {
  label?: string;
  value?: string;
  name: string;
  errors?: any;
  className?: string;
  id: string;
  type: string;
};

export default function (props: FieldProps) {
  const [initialDate, setInitialDate] = useState(new Date());
  const [hour, setHour] = useState(availableHours[0].value);

  // @ts-ignore
  const setNewDate = (nextDate, hour) => {
    const date = new Date(nextDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const newDate = `${year}/${month}/${day} ${hour}`;
    const nextValue = new Date(newDate);

    // props.formik.setFieldValue(props.name, nextValue)
    return nextValue;
  };

  useEffect(() => {
    //@ts-ignore
    props.formik.setFieldValue(props.name, setNewDate(initialDate, hour));
  }, [hour, initialDate]);
  return (
    <>
      {props.label && (
        <label className="mb-1 mt-3 text-left text-gray-800" htmlFor="password">
          {props.label}
        </label>
      )}
      <div className="flex ">
        <DatePicker
          className={
            "mr-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          }
          selected={initialDate}
          onChange={setInitialDate}
        />
        <select
          name="initialDateHour"
          onChange={({ target }) => {
            setHour(target.value);
          }}
          className=" ml-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          {availableHours.map(({ label, value }, i: number) => {
            return (
              <option key={i} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      </div>

      <Field
        className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        {...props}
        type="hidden"
      />

      {props.errors && props.errors[props.name] && (
        <span className="mb-2 ml-1 inline-block text-left text-sm text-red-800">
          {props.errors[props.name]}
        </span>
      )}
    </>
  );
}
