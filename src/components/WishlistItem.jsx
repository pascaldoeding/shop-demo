import { getProduct } from "./Shop"

export default function WishlistItem({id, wishlistDispatch, setDetailProduct, setShowWishlist}) {
    const product = getProduct(id);

    return (
        <li className="wishlist-item">
            <div className="wishlist-item-image" title="Produkt ansehen" onClick={() => { setShowWishlist(false); setDetailProduct(id) }}>
                <img src={product.thumbnail} alt={product.title}/>
                <span className="wishlist-item-title">{product.title}</span>
            </div>
            <button className="wishlist-button" title="Aus Wunschliste entfernen" onClick={() => wishlistDispatch({id, action: 'toggle'})}>
                <img src="icons/xmark.svg"></img>
            </button>
        </li>
    )
}