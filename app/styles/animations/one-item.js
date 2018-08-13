import React from 'react';
import { Transition } from 'react-transition-group';

const saved = {};

const AnimateOne = ({ in: inProp }, componentCreator, options = {}, key) => {
    const {
        duration,
        defaultStyle,
        entering,
        entered,
        exiting,
    } = options;

    const transitionStyles = {
        entering: entering || {},
        entered: entered || {},
        exiting: exiting || {},
    };


    const createComponent = (state) => {
        let component = componentCreator({
            ...defaultStyle || {},
            ...transitionStyles[state]
        });

        if (key && state === 'entering' && !saved[key]) {
            saved[key] = {};
        }

        if (key && state === 'entered') {
            if (saved[key]) {
                if (saved[key].entered) {
                    component = saved[key].entered;
                }
                else {
                    saved[key].entered = component;
                }

                if (!saved[key].exiting) {
                    saved[key].exiting = componentCreator({
                        ...defaultStyle || {},
                        ...transitionStyles.exiting
                    });
                }
            }
            else {
                saved[key] = {};
            }
        }

        if (key && state === 'exiting') {
            if (saved[key] && saved[key].exiting) {
                component = saved[key].exiting;
            }

            delete saved[key];
        }

        return component;

    }

    return (
        <Transition in={inProp ? true : false} timeout={duration || 200}>
            {state => createComponent(state)}
        </Transition>
    );
}

const Fade = ({ in: inProp }, componentCreator, options = {}, key) => {
    
    let {
        duration,
        defaultStyle,
        entering,
        entered,
        exiting,
        ease,
    } = options;

    ease = ease || 'ease-in-out';
    duration = duration || 200;
    defaultStyle = defaultStyle || {
        transition: `opacity ${duration}ms ${ease}`,
        opacity: 0,
        display: 'none'
    };
    entering = entering || { opacity: 0, display: 'block' }
    entered = entered || { opacity: 1, display: 'block' }
    exiting = exiting || { opacity: 0, display: 'block' }

    return AnimateOne(
        { in: inProp },
        componentCreator,
        { duration, defaultStyle, entering, entered, exiting },
        key
    );
}

const Slide = ({ in: inProp }, componentCreator, options = {}, key) => {
    let {
        duration,
        defaultStyle,
        entering,
        entered,
        exiting,
        ease,
        origin,
        opacity,
        display,
    } = options;

    ease = ease || 'ease-in-out';
    duration = duration || 200;
    origin = origin || 'top';
    display = display || 'block';

    defaultStyle = defaultStyle || {
        transform: 'scaleY(0)',
        transformOrigin: origin,
        transition: `transform ${duration}ms ${ease}`,
        height: '0',
        opacity: '0',
        display: 'none',
    }
    entering = entering || { transform: 'scaleY(0)', height: 'auto', opacity: '0', display: display }
    entered = entered || { transform: 'scaleY(1)', height: 'auto', opacity: opacity || '1', display }
    exiting = exiting || { transform: 'scaleY(0)', height: '0', opacity: opacity || '1', display }

    return AnimateOne(
        { in: inProp },
        componentCreator,
        { duration, defaultStyle, entering, entered, exiting },
        key
    );
}


export { AnimateOne, Fade, Slide };