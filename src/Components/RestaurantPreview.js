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
        return <div className="restaurant-preview">
            <img src={src}/>
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