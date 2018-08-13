import React from 'react';
import { PulseLoader } from 'react-spinners';
import { Fade } from '../../styles/animations';

const SpinnerLoader = ({
    inProp, 
    size, 
    color,
    duration,
    customStyle
}) => {
    return Fade({ in: inProp }, style => {
        style = { ...style || {}, ...customStyle || {} };
        
        return (
            <div className='spinner-loader' style={style}>
                <div className='inner'>
                    <PulseLoader
                        size={size || 7}
                        color={color || 'white'}
                    />
                </div>
            </div>
        );
    }, { duration: duration || 100 });
}

export { SpinnerLoader };