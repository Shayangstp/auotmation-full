import React from 'react'
import Access from './Access';

export default function AccessList({ accessItem }) {

    const { name, children } = accessItem;

    return (
        <li>
            <p>{name}</p>
            {/* {children.length !== 0 && children !== undefined
                ? <Access accessMenu={children} />
                : null
            } */}
        </li>
    )
}
