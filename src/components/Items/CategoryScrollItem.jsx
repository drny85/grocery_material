import React from 'react'

const CategoryScrollItem = ({ name, selected, onClick }) => {


    return (
        <div onClick={onClick} style={{ display: 'flex', height: '3rem', backgroundColor: name === selected ? 'lightgray' : '#eee', padding: '1rem 2rem', borderRadius: '20px', margin: '0.5rem 0.7rem', boxShadow: '3px 5px 5px rgba(0,0,0,0.5)' }}>
            <h4>{name}</h4>
        </div>
    )
}

export default CategoryScrollItem
