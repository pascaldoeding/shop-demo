import { useEffect, useState } from "react"
import { getFormattedPrice, getPriceRange } from "./helpers";

export default function Product({id, title, thumbnail, variants, sale, price, basketDispatch, wishlistDispatch, wishlist, setDetailProduct}) {
    const [variant, setVariant] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(null);

    const isOnWishlist = wishlist.some(item => item === id);

    useEffect(() => {
        if(price && !variant){
            setCurrentPrice(`${getFormattedPrice(price)} €`);
        } else {
            setCurrentPrice(`${getPriceRange(variants.map(({price}) => parseInt(price)))} €`);
        }
    },[])

    useEffect(() => {
        if(variants){
            if(variant !== null) {
                setCurrentPrice(`${getFormattedPrice(variants[variant].price)} €`);
            } else{
                setCurrentPrice(`${getPriceRange(variants.map(({price}) => parseInt(price)))} €`);
            }
        }
        console.log(parseInt(null));
    }, [variant])

  return (
    <li className={`product ${sale === 'true' ? 'sale' : ''}`}>
        <div className="product-image" title="Details anzeigen" onClick={() => setDetailProduct(id)}>
            <img src={thumbnail} alt={title} />
        </div>
        <div className="product-details">
            <span className="product-title">{title}</span>
            {variants && 
            <label className="product-variant">Variante:
            <select>
                <option value="null" onClick={() => setVariant(null)}></option>
                {variants.map((variant, index) => <option key={index} value={index} onClick={() => setVariant(index)}>{variant.title}</option>)}
            </select>
            </label>}
            <span className="product-price">
                {currentPrice}
            </span>
            <div className="product-menu">
                <button 
                    className={`product-menu-button ${variants && variant === null ? 'disabled' : ''}`} 
                    title="Zum Warenkorb hinzufügen" 
                    disabled={variants && variant === null ? true : false}
                    onClick={() => basketDispatch({id, variant, action: 'add'})}
                >
                    <img src="icons/cart.svg"></img>
                </button>
                <button 
                    className={`product-menu-button ${!isOnWishlist ? 'passive' : ''}`}
                    title={!isOnWishlist ? 'Zur Wunschliste hinzufügen' : 'Von Wunschliste entfernen'}
                    onClick={() => wishlistDispatch({id, action: 'toggle'})}
                >
                    <img src="icons/heart.svg"></img>
                </button>
                <button 
                    className="product-menu-button" 
                    title="Details anzeigen"
                    onClick={() => setDetailProduct(id)}
                >
                    <img src="icons/info.svg"></img>
                </button>
            </div>
        </div>
    </li>
  )
}