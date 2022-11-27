import { useEffect, useState } from "react";
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux"
import { uiActions } from "../store/slices/uiSlice";
import { useRouter } from 'next/router'

const API = 'https://xcaret-store-backend-production.up.railway.app';

function CartItems({onCheckout}) {
    const cartListIsOpen = useSelector( state => state.ui.cartListIsOpen )
    const [cartItems, setCartItems] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect( () => {
      async function getCartItems() {
        try {
          const response = await axios.get(`${API}/api/cart/`);
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
      await axios.delete(`${API}/api/cart/${_id}`)
      setRefetch(!refetch)
    }
    async function removeAllItems() {
      await axios.delete(`${API}/api/cart/`)
      setRefetch(!refetch)
    }
  return (
    <div>
      {cartItems.length ===0 ? 
        <li className="hover:bg-neutral-200 opacity-100">
            <p className="text-xl font-bold text-zinc-400">
                No items found
            </p>
            <p className="text">
                Add some items to your cart
            </p>
        </li>            
    :
    <>
        {
        cartItems?.map( car =>{
            return(
                <>
            <li key={car._id} className="hover:bg-neutral-200 opacity-100 flex flex-col">
                <p className="text-xl font-bold w-36">{car.name}</p>
                <div className="self-end">
                    <p className="text-xs w-36">Subtotal</p>
                    <p className="text w-36">${car.subtotal.toLocaleString()}</p>
                </div>
                <div className="self-end flex flex-row gap-2">
                    <button onClick={ () => {
                        dispatch(uiActions.selectItem(car))
                        router.push("/editcart")
                        } }
                        className='bg-neutral-300 w-full text-white uppercase rounded hover:bg-slate-800 px-3 transition-all'>
                        Edit
                    </button>
                    <button 
                        onClick={ () => removeItem(car._id) } 
                        className='bg-red-100 text-white uppercase rounded hover:bg-red-400 px-3 transition-all'>
                        Delete
                    </button>
                </div>
            </li>
            </>
            )
        })
    
        }
        
        <p>Grand total: </p>
        <p className="text-4xl font-light">${cartItems.reduce((accum,car) => accum + car.subtotal,0).toLocaleString()}
        </p>

        {
          onCheckout ? null :
              <>  
              <button 
                  onClick={() => router.push("/payment")}
                  className='bg-black text-white uppercase w-full hover:bg-neutral-600 py-3 mt-5 transition-all'>
                  Proceed to checkout
              </button>
              <button
                  onClick={removeAllItems} 
                  className='bg-neutral-400 text-xs text-white uppercase w-full hover:bg-red-300 py-3 mt-5 transition-all'>
                  Empty cart
              </button>
              </>
        }
    </>
    }
    </div>
  )
}

export default CartItems