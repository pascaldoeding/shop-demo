import Product from "./Product"

export default function ProductList({products, basketDispatch, wishlistDispatch, wishlist, setDetailProduct, setAlert}) {
  return (
    <ul className="product-list">
        {products.map(product => <Product key={product.id} {...product} basketDispatch={basketDispatch} wishlistDispatch={wishlistDispatch} wishlist={wishlist} setDetailProduct={setDetailProduct} setAlert={setAlert} />)}
        <li className="product placeholder"></li>
        <li className="product placeholder"></li>
        <li className="product placeholder"></li>
    </ul>
  )
}

