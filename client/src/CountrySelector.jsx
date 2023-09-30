import React, { useState, useMemo } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list'
// https://www.npmjs.com/package/react-select-country-list

function CountrySelector({ value, onChange }) {
  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (selectedOption) => {
    onChange(selectedOption); // Call the onChange callback with the selected option
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      fontSize: '16px', // Adjust the font size as needed
      minWidth: '200px', // Adjust the width as needed  
    }),
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={changeHandler}
      styles={customStyles} // Apply custom styles to the control
    />
  );
}

export default CountrySelector;