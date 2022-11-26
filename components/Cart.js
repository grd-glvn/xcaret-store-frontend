import { useEffect, useState } from "react"
import axios from 'axios'
import { useSelector } from "react-redux"
function Cart( ) {
  const cartListIsOpen = useSelector( state => state.ui.cartListIsOpen )
  const [cartItems, setCartItems] = useState([]);
  const [refetch, setRefetch] = useState(false);
  useEffect( () => {
    async function getCartItems() {
      try {
        const response = await axios.get('https://xcaret-store-backend.herokuapp.com/api/cart/');
        console.log(response.data)
        setCartItems(response.data.data);
        return 
      } catch (e) {
        console.log(e)
      }
    }
    getCartItems();

    return () => {
      
    }
  }, [cartListIsOpen, refetch])

  async function removeItem(_id) {
    await axios.delete(`https://xcaret-store-backend.herokuapp.com/api/cart/${_id}`)
    setRefetch(!refetch)
  }
  
  if(cartItems === undefined) return <div>loaaad</div>;

  return (
    <div>
        {cartItems.map( car =>{
          return(
            <>
              <p>{car.name}</p>
              <p>{car.car_price}</p>
              <button onClick={ () => removeItem(car._id) } className='bg-cyan-500 text-white uppercase rounded hover:bg-cyan-800 py-3 px-3'>Eliminar</button>
            </>
            )
        })}
    </div>
  )
}

export default Cart