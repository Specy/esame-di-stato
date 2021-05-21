import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag  } from '@fortawesome/free-solid-svg-icons'
class RestaurantPreview extends Component{
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    render(){
        const {name, src,tags} = this.props.data
        return <div className="restaurant-preview" onClick={() =>this.props.click(this.props.data)}>
            <img src={src}
            							onError={(e) => e.target.src = 'https://cdn.discordapp.com/attachments/771432833034092554/845258746368360468/unknown.png'}
            />
            <div className="restaurant-name">
                {name}
            </div>
            <div className="restaurant-tags">
                <FontAwesomeIcon icon={faTag} />
                {tags.join(", ")}
            </div>

        </div>
    }
}


export default RestaurantPreview