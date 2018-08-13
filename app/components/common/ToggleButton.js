import React from 'react';
import Switch from 'react-switch';

const Toggle = ({
    value,
    onToggle,
    onColor,
    offColor,
    height,
    width,
}) => {
    height = (height || 1) * 28;
    width = (width || 1) * 56;

    return (
        <Switch
            checked={value ? true : false}
            onChange={onToggle}
            uncheckedIcon={false}
            onColor={onColor || '#45A29E'}
            offColor={offColor || '#e2e2e2'}
            height={height}
            width={width}
        />
    );
}

export { Toggle };

