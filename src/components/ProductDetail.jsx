import { useEffect, useState } from "react";
import { getFormattedPrice, getPriceRange } from "./helpers";
import ImageGallery from "./ImageGallery";
import { getProduct, setDelayedAlert } from "./Shop"

export default function ProductDetail({id, basketDispatch, wishlistDispatch, wishlist, setAlert}) {
    const product = getProduct(id);

    // Wenn Produkt nicht existiert
    if(!product){
        return <strong className="error">Das Produkt konnte leider nicht gefunden werden!</strong>
    }

    const {title, description, images, variants, sale, price} = product;
    const isOnWishlist = wishlist.some(item => item === id);

    const [variant, setVariant] = useState('');
    const [currentPrice, setCurrentPrice] = useState(null);

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
        <div className={`product-detail ${sale === 'true' ? 'sale' : ''}`}>
            <h2 className="product-detail-title">{title}</h2>
            {images.length > 1 ?
                <ImageGallery images={images} />
                :
                <div className="product-detail-image">
                    <img src={images[0]} alt={title} width="100" height="100" />
                </div>
            }

            <p className="product-detail-description">{description}</p>
            {variants && 
            <label className="product-detail-variant">Variante:
            <select value={variant} onChange={(e) => setVariant(e.currentTarget.value)}>
                <option value=""></option>
                {variants.map((variant, index) => <option key={index} value={index}>{variant.title}</option>)}
            </select>
            </label>}
            <span className="product-detail-price">{currentPrice}</span>
            <div className="product-detail-menu">
            <button 
                    className={`product-detail-menu-button ${variants && variant === '' ? 'disabled' : ''}`} 
                    title="Zum Warenkorb hinzufügen" 
                    disabled={variants && variant === '' ? true : false}
                    onClick={() => {
                        basketDispatch({id, variant, action: 'add'});
                        setDelayedAlert(setAlert, `"${title}" ${variant !== '' ? '(' + variants[variant].title + ')' : ''} zum Warenkorb hinzugefügt`);
                    }}
                >
                    <img src="icons/cart.svg"></img>
                    Zum Warenkorb hinzufügen
                </button>
                <button 
                    className={`product-detail-menu-button ${!isOnWishlist ? 'passive' : ''}`}
                    title="Zur Wunschliste hinzufügen"
                    onClick={() => wishlistDispatch({id, action: 'toggle'})}
                >
                    <img src="icons/heart.svg"></img>
                    {!isOnWishlist ? 'Zur Wunschliste hinzufügen' : 'Von Wunschliste entfernen'}
                </button>
            </div>
        </div>
    )
}