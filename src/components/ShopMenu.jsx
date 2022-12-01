export default function ShopMenu({basket, showBasket, setShowBasket, wishlist, showWishlist, setShowWishlist}) {
  return (
    <div className="shop-menu">
        {basket.length > 0 &&
            <button className="shop-menu-button" title="Warenkorb" onClick={() => setShowBasket(!showBasket)}>
              <img src="icons/cart.svg"></img>
            </button>
        }
        {wishlist.length > 0 &&
            <button className="shop-menu-button" title="Wunschliste" onClick={() => setShowWishlist(!showWishlist)}>
              <img src="icons/heart.svg"></img>
            </button>
        }
    </div>
  )
}