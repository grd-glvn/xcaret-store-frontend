import { useState } from "react";
import CartItems from "./CartItems";
import {useSelector} from "react-redux"

function CartDropdown( ) {
  const lang = useSelector( state => state.ui.language )
  const uiLang = useSelector( state => state.ui.uiLang )
  const ui = uiLang[lang]; 
  const [showDropdown, setShowDropdown] = useState(false);

  if(ui === undefined) return null;

  return (
    <div className="relative text-center">
        <button className="relative block z-10 px-5 py-1 hover:bg-white rounded transition-all duration-600" onClick={()=> setShowDropdown(!showDropdown)}>
            <p className="">{ui.navbar.button}</p>
        </button>
        { showDropdown &&
        <>
        <button className="fixed top-0 right-0 bottom-0 w-full h-[100vh] cursor-default bg-black opacity-30" onClick={()=> setShowDropdown(!showDropdown)}></button>
        <ul className=" bg-white absolute transform -translate-x-[39%] top-10 py-3 z-10 w-80 rounded overflow-hidden shadow-xl">
            <CartItems onCheckout={false}/>
        </ul>
        </>
        }
    </div>
  )
}

export default CartDropdown