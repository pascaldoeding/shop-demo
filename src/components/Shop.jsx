import { useEffect, useReducer, useState } from "react"
import { Helmet } from "react-helmet-async";
import Alert from "./Alert";
import FilterBar from "./FilterBar";
import Modal from "./Modal";
import ProductList from "./ProductList";
import ShopMenu from "./ShopMenu";

export const allProducts = await getProducts();
// Liste der Kategorien für Filter ermitteln
const categories = [...new Set(allProducts.flatMap(product => product.categories))];

export default function Shop() {
    const [products, setProducts] = useState(allProducts);

    const [filters, filtersDispatch] = useReducer(filterReducer, []);

    const [showBasket, setShowBasket] = useState(false);
    const [basket, basketDispatch] = useReducer(basketReducer, null, getInitialBasket);
    
    const [showWishlist, setShowWishlist] = useState(false);
    const [wishlist, wishlistDispatch] = useReducer(wishlistReducer, [], getInitialWishlist);

    const [detailProduct, setDetailProduct] = useState(null);

    const [alert, setAlert] = useState(false);

    useEffect(() => {
        localStorage.setItem('basket', JSON.stringify(basket))
        if(basket.length === 0){
            setShowBasket(false);
        }
    }, [basket])

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist))
        if(wishlist.length === 0){
            setShowWishlist(false);
        } 
    }, [wishlist])

    useEffect(() => {
        if(filters.length > 0){
            // Produkte nach den gewählten Filtern filtern und Duplikate mithilfe von Set entfernen
            const filteredProducts = [...new Set(filters.flatMap(filter => allProducts.filter(product => product.categories.some(categorie => categorie === filter))))];
            // Produkte nach ID sortieren
            filteredProducts.sort((a,b) => parseInt(a.id) > parseInt(b.id));
            setProducts(filteredProducts);
        } else {
            setProducts(allProducts);
        }
    }, [filters])

    useEffect(() => {
        const url = new URL(window.location.href);
        const product = url.searchParams.get('product');
        if(product) {
            setDetailProduct(product); 
        }
    }, [])

    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('product');
        if(detailProduct != null) {
            url.searchParams.set('product', detailProduct);
        }
        window.history.replaceState({}, [], url);
    }, [detailProduct])

    useEffect(() => {
        if(alert){
            const timeout = setTimeout(() => {
                setAlert(false);
           }, 1000);
           return () => clearTimeout(timeout);
        }
    }, [alert])

  return (
    <div className="shop">
        <Helmet>
            <title>DemoShop</title>
        </Helmet>
        <FilterBar categories={categories} filters={filters} filtersDispatch={filtersDispatch} />
        <ProductList products={products} basketDispatch={basketDispatch} wishlistDispatch={wishlistDispatch} wishlist={wishlist} setDetailProduct={setDetailProduct} setAlert={setAlert}/>

        <ShopMenu basket={basket} showBasket={showBasket} setShowBasket={setShowBasket} wishlist={wishlist} showWishlist={showWishlist} setShowWishlist={setShowWishlist}/>

        { (showBasket || showWishlist || detailProduct !== null) &&
            <Modal 
                basket={basket} 
                showBasket={showBasket} 
                setShowBasket={setShowBasket} 
                basketDispatch={basketDispatch} 
                wishlist={wishlist} 
                showWishlist={showWishlist} 
                setShowWishlist={setShowWishlist} 
                wishlistDispatch={wishlistDispatch} 
                detailProduct={detailProduct}
                setDetailProduct={setDetailProduct}
                setAlert={setAlert}
            />
        }

        {alert && <Alert alert={alert} />}
    </div>
  )
}

// Alle Produkte laden
async function getProducts(){
    try{
        const response = await fetch('./src/products.json');

        if (!response.ok) {
            throw new Error('Fehler beim Laden der Daten!');
        }

        const products = await response.json();
        return products;
    } catch (error) {
        console.log(error);
    }
}

// Liefert Daten zu einem bestimmten Produkt
export function getProduct(searchId){
    return allProducts.find(({id}) => id === searchId);
}

// Logik für Filter
function filterReducer(filters, message) {
    switch(message.action){
        case 'toggle':
            if(filters.some(filter => filter === message.filter)){ // Filter hinzufügen
                return filters.filter(item => item !== message.filter);
            } else { // Filter enfernen
                return [...filters, message.filter];
            }
        case 'clear':
            return [];
    }
    return filters;
}

// Logik für den Warenkorb
function basketReducer(basket, message) {
    // Hilfsvariable: Produkt noch nicht im Warenkorb?
    const productNotInBasket = !basket.some(({id}) => id === message.id);

    switch (message.action){
      case 'add':
        // Wenn Produkt noch nicht in Warenkorb
        if(productNotInBasket){
            // Wenn Produkt Variante hat
            if(message.variant !== '' && message.variant !== undefined){
                return [...basket, {id: message.id, variants:[{id: message.variant, amount: 1}]}];
            }
            // Wenn Produkt keine Variante hat
            return [...basket, {id: message.id, amount: 1}];
        } 

        return basket.map((item) => {
          if(item.id === message.id) {
            // Wenn Produkt Variante hat
            if(message.variant !== '' && message.variant !== undefined){
                // Hilfsvariable: Variante noch nicht im Warenkorb?
                const variantNotInBasket = !item.variants.some(({id}) => id === message.variant);
                // Wenn Variante noch nicht im Warenkorb
                if(variantNotInBasket){
                   return {id: item.id, variants:[...item.variants, {id: message.variant, amount: 1}]};
                }
                // Wenn Variante bereits im Warenkorb
                return {
                    id: item.id,
                    variants: item.variants.map((variant) =>{
                        // Alle Varianten durchlaufen und entsprechende Variante anpassen
                        if(variant.id === message.variant){
                            return {id: variant.id, amount: variant.amount + 1};
                        }
                        return variant;
                    })
                }
            }
            // Wenn Produkt keine Variante hat
            return {id: item.id, amount: item.amount + 1};
          }
          return item;
        })
  
      case 'remove':
        return basket.map((item) => {
          if(item.id === message.id) {
            // Wenn Produkt Variante hat
            if(message.variant !== '' && message.variant !== undefined){
                return {
                    id: item.id,
                    variants: item.variants.map((variant) =>{
                        if(variant.id === message.variant){
                            return {id: variant.id, amount: variant.amount > 0 ? variant.amount - 1 : 0};
                        }
                        return variant;
                    })
                }
            }
            // Wenn Produkt keine Variante hat
            return {id: item.id, amount: item.amount > 0 ? item.amount - 1 : 0};
          }
          return item;
        })
  
      case 'delete':
        // Wenn Produkt Variante hat
        if(message.variant !== undefined){
            // Temporärer Warenkorb
            const tempBasket = basket.map((item) => {
                if(item.id === message.id){
                    // Mehr als eine Variante vorhanden: Lösche nur Variante
                    if(item.variants?.length > 1){
                        return{
                            id: item.id,
                            variants: item.variants.filter((variant) => variant.id !== message.variant)
                        }
                    }
                    // Nur eine Variante vorhanden: "Flag" zum Löschen des Produkts setzen
                    return {id: false};
                }
                return item;
            })
            // Zu Löschende Produkte mit .filter() entfernen
            return tempBasket.filter((item) => item.id !== false);
        }
        // Wenn Produkt keine Variante hat
        return basket.filter((item) => item.id !== message.id);
  
      case 'clear': 
        return [];
    }
    return basket;
}

// Warenkorb aus localStorage laden (falls vorhanden)
function getInitialBasket(){
    const savedBasket = JSON.parse(localStorage.getItem('basket'));
    return savedBasket ? savedBasket : [];
}

// Logik für die Wusnchliste 
function wishlistReducer(wishlist, message) {
    switch(message.action){
        case 'toggle':
            if(wishlist.some(item => item === message.id)){
                return wishlist.filter(item => item !== message.id);
            } else {
                return [...wishlist, message.id];
            }
        case 'clear':
            return [];
    }
    return wishlist;
}

// Wunschliste aus localStorage laden (falls vorhanden)
function getInitialWishlist(){
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));
    return savedWishlist ? savedWishlist : [];
}

// Logik um Alerts/Notifications verzögert anzuzeigen
// Setzt Alert erst zurück und zeigt verzögert neuen Alert an
export function setDelayedAlert(setAlert, alert){
    setAlert(false);
    setTimeout(() => {
        setAlert(alert);
    }, 200);
}