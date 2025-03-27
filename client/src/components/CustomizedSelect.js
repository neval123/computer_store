import Select from "react-select";

const styles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: '#333',
        borderColor: '#2272FF',
        hover: {
            borderColor: 'darkblue'
        }//,
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#333'
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'blue' : '#333',
        color: 'white',
        padding: 20,
    })
};

export default function CustomizedSelect({ value, options, isDisabled, onChange, placeholder }) {
    return (
        <Select
            isMulti
            value={value}
            styles={styles}
            options={options}
            isDisabled={isDisabled}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
}