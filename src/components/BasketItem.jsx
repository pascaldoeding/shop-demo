import { getFormattedPrice } from "./helpers";
import { getProduct } from "./Shop"

export default function BasketItem({id, amount, variants, basketDispatch, setDetailProduct, setShowBasket}) {
    // Daten von jeweiligen Produkt holen
    const product = getProduct(id);

    return (
        <li className="basket-item">
            <div className="item-image"  title="Produkt ansehen" onClick={() => { setShowBasket(false); setDetailProduct(id) }}>
                <img src={product.thumbnail} alt={product.title} width="100" height="100"/>
            </div>
            <div className="item-details">
                <span className="item-title">{product.title}</span>
                <ul className="item-variants">
                    {/* Wenn Produkt Varianten hat: Listen-Element für jede Variante erstellen
                        Andernfalls: Nur ein Listen-Element erstellen */}
                    {variants ? 
                        variants.map((variant) => 
                        <li key={variant.id} className="item-variant">
                            <span className="item-variant-title">{product.variants[variant.id].title} :</span>
                            <button onClick={()=> basketDispatch({id, variant: variant.id, action: 'remove'})} title="Anzahl verringern">
                                <img src="icons/minus.svg"></img>
                            </button>
                            <span className="item-variant-amount">{variant.amount}</span>
                            <button onClick={()=> basketDispatch({id, variant: variant.id, action: 'add'})} title="Anzahl erhöhen">
                                <img src="icons/plus.svg"></img>
                            </button>
                            <span className="item-variant-price">{getFormattedPrice(product.variants[variant.id].price * variant.amount)} €</span>
                            <button onClick={()=> basketDispatch({id, variant: variant.id, action: 'delete'})} title="Variante entfernen">
                                <img src="icons/xmark.svg"></img>
                            </button>
                        </li>
                        )
                    :
                    <li className="item-variant">
                        <span className="item-variant-title"></span>
                        <button onClick={()=> basketDispatch({id, action: 'remove'})} title="Anzahl verringern">
                            <img src="icons/minus.svg"></img>
                        </button>
                        <span className="item-variant-amount">{amount}</span>
                        <button onClick={()=> basketDispatch({id, action: 'add'})} title="Anzahl erhöhen">
                            <img src="icons/plus.svg"></img>
                        </button>
                        <span className="item-variant-price">{getFormattedPrice(product.price * amount)} €</span>
                        <button onClick={()=> basketDispatch({id, action: 'delete'})} title="Produkt entfernen">
                            <img src="icons/xmark.svg"></img>
                        </button>
                    </li>
                    }
                </ul>
            </div>
        </li>
    )
}