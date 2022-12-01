import BasketItem from "./BasketItem";
import { getFormattedPrice } from "./helpers";
import { getProduct } from "./Shop";

export default function Basket({basket, basketDispatch, setDetailProduct, setShowBasket}) {
  return (
    <div className="basket">
        <h2>Warenkorb</h2>
        <ul className="basket-items">
            {basket.map(item => <BasketItem key={item.id} {...item} basketDispatch={basketDispatch} setDetailProduct={setDetailProduct} setShowBasket={setShowBasket} />)}
            <li className="basket-item basket-total">Gesamt: {getFormattedPrice(getTotalPrice(basket))} €</li>
        </ul>
        <button className="basket-button" onClick={() => basketDispatch({action: 'clear'})}>
            Warenkorb leeren
        </button>
    </div>
  )
}

// Gesamtbetrag berechnen
function getTotalPrice(basket){
    return basket.reduce((prev, cur) => {
        const product = getProduct(cur.id);
        if(cur.variants){
            return prev + cur.variants.reduce((prevVar, curVar) => {
                return prevVar + curVar.amount * product.variants[curVar.id].price
            }, 0)
        } else {
            return prev + cur.amount * product.price;
        }
    }, 0)
}