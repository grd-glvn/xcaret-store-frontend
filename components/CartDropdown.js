import { useEffect, useState } from "react";
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux"
import { uiActions } from "../store/slices/uiSlice";
import { useRouter } from 'next/router'

function CartDropdown( ) {
    const [showDropdown, setShowDropdown] = useState(false);
    const cartListIsOpen = useSelector( state => state.ui.cartListIsOpen )
    const [cartItems, setCartItems] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

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
    async function removeAllItems() {
      await axios.delete(`https://xcaret-store-backend.herokuapp.com/api/cart/`)
      setRefetch(!refetch)
    }

  return (
    <div className="relative text-center">
        <button className="relative block z-10 px-5 py-1 hover:bg-white rounded transition-all duration-600" onClick={()=> setShowDropdown(!showDropdown)}>
            <p className="">Cart</p>
        </button>
        { showDropdown &&
        <>
        <button className="fixed top-0 right-0 bottom-0 w-full h-[100vh] cursor-default bg-black opacity-30" onClick={()=> setShowDropdown(!showDropdown)}></button>
        <ul className=" bg-white absolute transform -translate-x-[36%] top-10 py-3 z-10 w-64 rounded overflow-hidden shadow-xl">
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
                    <li className="hover:bg-neutral-200 opacity-100 flex flex-col">
                        <p className="text-xl font-bold w-36">{car.name}</p>
                        <div className="self-end">
                            <p className="text-xs w-36">Subtotal</p>
                            <p className="text w-36">${car.subtotal}</p>
                        </div>
                        <div className="self-end flex flex-row">
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
        </ul>
        </>
        }
    </div>
  )
}

export default CartDropdown