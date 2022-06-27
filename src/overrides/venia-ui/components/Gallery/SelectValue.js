import React from 'react';
import Select from "@magento/venia-ui/lib/components/Select";
import {data} from "./mockData";
import {useFieldState} from "informed";
import TextInput from '@magento/venia-ui/lib/components/TextInput';

const SelectValue = () => {
    const { value } = useFieldState('quantity');
    console.log(value)

    const bellowValue =  (
        <Select
            field="quantity"
            items={data}
        />
    );

    const aboveValue =  (
        <TextInput
            field="quantity"
            items={data}
        />
    );

    const setView = value >= 4  ? (
        <TextInput
            field="quantity"
            items={data}
        />
    ) : (
        <Select
            field="quantity"
            items={data}
        />
    )
    return (
        <div
        >
        {setView}
        </div>
    );
}

SelectValue.defaultProps = {
    selectLabel: "quantity"
};

export default SelectValue;
