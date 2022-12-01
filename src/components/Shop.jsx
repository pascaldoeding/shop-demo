import { useEffect, useReducer, useState } from "react"
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
        window.history.replaceState({}, [], url)
    }, [detailProduct])

  return (
    <div className="shop">
        <FilterBar categories={categories} filters={filters} filtersDispatch={filtersDispatch} />
        <ProductList products={products} basketDispatch={basketDispatch} wishlistDispatch={wishlistDispatch} wishlist={wishlist} setDetailProduct={setDetailProduct} />

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
            />
        }
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

function basketReducer(basket, message) {
    const productNotInBasket = !basket.some(({id}) => id === message.id)

    switch (message.action){
      case 'add':
        if(productNotInBasket){
            if(message.variant !== null && message.variant !== undefined){
                return [...basket, {id: message.id, variants:[{id: message.variant, amount: 1}]}];
            }
            return [...basket, {id: message.id, amount: 1}];
        } 

        return basket.map((item) => {
          if(item.id === message.id) {
            if(message.variant !== null && message.variant !== undefined){
                const variantNotInBasket = !item.variants.some(({id}) => id === message.variant);
                if(variantNotInBasket){
                   return {id: item.id, variants:[...item.variants, {id: message.variant, amount: 1}]};
                }
                return {
                    id: item.id,
                    variants: item.variants.map((variant) =>{
                        if(variant.id === message.variant){
                            return {id: variant.id, amount: variant.amount + 1};
                        }
                        return variant;
                    })
                }
            }
            return {id: item.id, amount: item.amount + 1};
          }
          return item;
        })
  
      case 'remove':
        return basket.map((item) => {
          if(item.id === message.id) {
            if(message.variant !== null && message.variant !== undefined){
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
            return {id: item.id, amount: item.amount > 0 ? item.amount - 1 : 0};
          }
          return item;
        })
  
      case 'delete':
        if(message.variant !== undefined){
            const tempBasket = basket.map((item) => {
                if(item.id === message.id){
                    if(item.variants?.length > 1){
                        return{
                            id: item.id,
                            variants: item.variants.filter((variant) => variant.id !== message.variant)
                        }
                    }
                    return {id: false};
                }
                return item;
            })
            return tempBasket.filter((item) => item.id !== false);
        }
        return basket.filter((item) => item.id !== message.id);
  
      case 'clear': 
        return [];
    }
    return basket;
  }

function getInitialBasket(){
    const savedBasket = JSON.parse(localStorage.getItem('basket'));
    return savedBasket ? savedBasket : [];
}


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

function getInitialWishlist(){
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist'));
    return savedWishlist ? savedWishlist : [];
}