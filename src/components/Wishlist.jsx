import { Helmet } from "react-helmet-async";
import WishlistItem from "./WishlistItem";

export default function Wishlist({wishlist, wishlistDispatch, setDetailProduct, setShowWishlist}) {
  return (
    <div className="wishlist">
        <Helmet>
            <title>DemoShop - Wunschliste</title>
        </Helmet>
        <h2>Wunschliste</h2>
        <ul className="wishlist-items">
            {wishlist.map(id => <WishlistItem key={id} id={id} wishlistDispatch={wishlistDispatch} setDetailProduct={setDetailProduct} setShowWishlist={setShowWishlist} />)}
            <li className="wishlist-item placeholder"></li>
            <li className="wishlist-item placeholder"></li>
            <li className="wishlist-item placeholder"></li>
        </ul>
        <button className="wishlist-button" onClick={() => wishlistDispatch({action: 'clear'})}>
            Wunschliste leeren
        </button>
    </div>
  )
}