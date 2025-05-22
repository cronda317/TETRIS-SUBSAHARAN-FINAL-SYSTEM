import {useCallback, useMemo} from 'react';
import {UiButton} from './UiButton';

export interface UiOption<TType> {
    label: string;

    value: TType;
}

export interface UiSelectProps<TType> {
    onChange: (value: TType) => void;

    options: Array<UiOption<TType>>;

    value: TType;
}

export function UiSelect<TType>({
    onChange,
    options,
    value
}: UiSelectProps<TType>) {
    const indx = useMemo(
        () => options.findIndex((option) => option.value === value),
        [value, options]
    );

    const increase = useCallback(() => {
        const i = Math.min(options.length - 1, indx + 1);
        onChange(options[i].value);
    }, [onChange, options, indx]);

    const decrease = useCallback(() => {
        const i = Math.max(0, indx - 1);
        onChange(options[i].value);
    }, [onChange, options, indx]);

    return (
        <div className="flex text-sm">
            <UiButton className="px-2 py-1 text-xs" onClick={decrease} disabled={indx <= 0}>
                -
            </UiButton>
            <div className="flex-grow text-center text-xs py-1">{options[indx]?.label}</div>
            <UiButton
                className="px-2 py-1 text-xs"
                onClick={increase}
                disabled={indx >= options.length - 1}
            >
                +
            </UiButton>
        </div>
    );
}
