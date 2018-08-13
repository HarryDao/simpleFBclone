export const extractDataFromSnapshots = (
    snapsArr, 
    returnObj = false,
    sortBy, 
    transform = item => item,
) => {

    let items = returnObj ? {} : [];

    snapsArr.map(snaps => {
        snaps.forEach(snap => {
            const data = snap.data();
            const id = snap.id;

            if (returnObj) {
                items[id] = transform(data); 
            }
            else {
                if (data) {
                    data.uid = id;
                }

                items.push(transform(data));
            }
        });
    });

    if (!returnObj && sortBy) {
        items.sort((a, b) => b[sortBy] > a[sortBy] ? 1: -1);
    }

    return items;
}