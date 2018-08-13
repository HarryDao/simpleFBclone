export const trackMultipleLoadings = (list, end) => {
    const checks = [];
    const funcs = [];
    const errors = [];

    list.map(({ condition, func, args = [] }, i) => {
        if(!condition) {
            checks.push(false);
            funcs.push({ func, args });
        }
    });

    if (checks.length === 0) {
        return end();
    }

    funcs.map(({ func, args }, index) => {
        func(...args, (err) => {

            if (err) {
                errors.push(err);
            }

            checks[index] = true;
            if (checks.every(check => check)) {
                return end(errors);
            }
        });
    });
}