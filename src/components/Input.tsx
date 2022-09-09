interface TextInputProps {
    id: string,
    label: string,
    defaultValue?: string,
    password?: boolean,
    onChange?: any,
    required?: boolean,
    disabled?: boolean,
    placeholder?: string
    onSubmit?: any
}

const TextInput = (props: TextInputProps) => {
    let inputAttr: any = {
        id: props.id,
        name: props.id,
        type: ((props.password) ? 'password' : 'text'),
        onChange: props.onChange,
        defaultValue: props.defaultValue,
        placeholder: props.placeholder,
        onSubmit: props.onSubmit,
    }

    if (props.required)
        inputAttr["required"] = "required";
    else if (props.disabled)
        inputAttr["disabled"] = "disabled";

    return (
        <div>
            <label
                htmlFor={props.id}
                className={(props.required) ? 'required' : ''}
            >
                {props.label}
            </label>
            <br />
            <input {...inputAttr} />
            <br />
        </div>
    )
}

export default TextInput;