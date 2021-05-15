import React, { Component, useState } from 'react'
import {FaChevronRight} from 'react-icons/fa'
class Menu extends Component{
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    render(){
        const {props, state} = this
        const {data} = props
        return <div className='menu-wrapper'>
            {data.menu.table.map(category => <DropdownMenuRow data={category}/>)}
        </div>
    }
}

function DropdownMenuRow(props){
    const [open,toggleOpen] = useState(false)
    const { data } = props
    return <div className='menu-row-wrapper'>
        <div className='menu-row-category' onClick={() => toggleOpen(!open)}>
            <FaChevronRight className={open ? 'rotate-90' : 'rotate-0'}/>
            <div>
                {data.categoryName}
            </div>
        </div>
        <div className={open ? 'visible food-wrapper' : 'hidden food-wrapper'}>
            {data.foods.map(food =>{
                return <div className='menu-food-row'>
                    {food.name}
                </div>
            })}
        </div>
    </div>
}

export default Menu