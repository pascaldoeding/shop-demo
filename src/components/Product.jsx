import { useEffect, useState } from "react"
import { getFormattedPrice, getPriceRange } from "./helpers";
import { setDelayedAlert } from "./Shop";

export default function Product({id, title, thumbnail, variants, sale, price, basketDispatch, wishlistDispatch, wishlist, setDetailProduct, setAlert}) {
    const [variant, setVariant] = useState('');
    const [currentPrice, setCurrentPrice] = useState(null);

    // Hilfsvariable: Ist Produkt auf Wunschliste
    const isOnWishlist = wishlist.some(item => item === id);

    useEffect(() => {
        if(price && variant === ''){
            setCurrentPrice(`${getFormattedPrice(price)} €`);
        } else {
            setCurrentPrice(`${getPriceRange(variants.map(({price}) => parseInt(price)))} €`);
        }
    },[])

    useEffect(() => {
        if(variants){
            if(variant !== '') {
                setCurrentPrice(`${getFormattedPrice(variants[parseInt(variant)].price)} €`);
            } else{
                setCurrentPrice(`${getPriceRange(variants.map(({price}) => parseInt(price)))} €`);
            }
        }
    }, [variant])

  return (
    <li className={`product ${sale === 'true' ? 'sale' : ''}`}>
        <div className="product-image" title="Details anzeigen" onClick={() => setDetailProduct(id)}>
            <img src={thumbnail} alt={title} width="100" height="100" />
        </div>
        <div className="product-details">
            <span className="product-title">{title}</span>
            {variants && 
            <label className="product-variant">Variante:
            <select value={variant} onChange={(e) => setVariant(e.currentTarget.value)}>
                <option value=""></option>
                {variants.map((variant, index) => <option key={index} value={index}>{variant.title}</option>)}
            </select>
            </label>}
            <span className="product-price">
                {currentPrice}
            </span>
            <div className="product-menu">
                <button 
                    className={`product-menu-button ${variants && variant === '' ? 'disabled' : ''}`} 
                    title="Zum Warenkorb hinzufügen" 
                    disabled={variants && variant === '' ? true : false}
                    onClick={() => {
                        basketDispatch({id, variant, action: 'add'});
                        setDelayedAlert(setAlert, `"${title}" ${variant !== '' ? '(' + variants[variant].title + ')' : ''} zum Warenkorb hinzugefügt`);
                    }}
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