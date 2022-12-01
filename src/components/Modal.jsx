import Basket from "./Basket";
import ProductDetail from "./ProductDetail";
import Wishlist from "./Wishlist";

export default function Modal({basket, showBasket, setShowBasket, basketDispatch, wishlist, showWishlist, setShowWishlist, wishlistDispatch, detailProduct, setDetailProduct}) {

    function resetModal() {
        setShowBasket(false);
        setShowWishlist(false);
        setDetailProduct(null);
    }

    return (
        <div className="overlay" onClick={(e) => { 
            if(e.target === e.currentTarget) {
                resetModal()
            }
        }}>
            <div className="modal">
                <div className="modal-content">
                    {showBasket && <Basket basket={basket} basketDispatch={basketDispatch} />}
                    {showWishlist && <Wishlist wishlist={wishlist} wishlistDispatch={wishlistDispatch} setDetailProduct={setDetailProduct} setShowWishlist={setShowWishlist} />}
                    {(detailProduct !== null) && <ProductDetail id={detailProduct} wishlist={wishlist} wishlistDispatch={wishlistDispatch} basketDispatch={basketDispatch}/>}
                    
                    <button className="modal-close" onClick={resetModal}>
                        <img src="icons/xmark.svg" alt="Close"/>
                    </button>
                </div>
            </div>
        </div>
    )
}