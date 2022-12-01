import { useState } from "react"

export default function ImageGallery({images}) {
    const [imageIndex, setImageIndex] = useState(0)

    return (
        <div className="image-gallery">
            <div className="image-big">
                <img src={images[imageIndex]} width="100" height="100"></img>
            </div>
            <ul className="image-menu">
                {images.map((image, index) => 
                   <li className="image-menu-item" key={index} onClick={() => setImageIndex(index)}>
                        <img src={image} width="100" height="100"></img>
                   </li> 
                )}
            </ul>
        </div>
    )
}