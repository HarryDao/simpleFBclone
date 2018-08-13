import React from 'react';

export default ({ name, isHome }) => {
    if (!isHome) {
        return (
            <div className='guide'>
                <p><span className='name'>{name}</span> doesnt have any post yet!</p>
            </div>
        );
    }

    return (
        <div className='guide'>
            <h4>Welcome to <span className='name'>simpleFBclone</span></h4>

            <p>Hi <span className='name'>{name}</span>,</p>

            <p>To begin, you can write new posts, or search for new friends.</p>
            
            <p>Only friends can see each other's posts.</p>
        </div>
    );
}