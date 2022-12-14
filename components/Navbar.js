import { useDispatch, useSelector } from "react-redux"
import { uiActions } from "../store/slices/uiSlice"
import CartDropdown from "./CartDropdown";

function Navbar() {
    const dispatch = useDispatch();
    const lang = useSelector( state => state.ui.language )
    const uiLang = useSelector( state => state.ui.uiLang )
    const currency = useSelector( state => state.ui.currency )
  return (
    <nav className='flex flex-row fixed top-0 z-50 justify-around w-full h-[8vh] items-center bg-neutral-300 backdrop-blur-lg opacity-100'>
        <button className="px-5 py-1 hover:bg-white rounded transition-all duration-600 uppercase" onClick={()=>dispatch(uiActions.toggleLanguage())} >{lang}</button>
        {/* <div>Cart</div> */}
        <CartDropdown/>
        <button className='uppercase px-5 py-1 hover:bg-white rounded transition-all duration-600' onClick={()=>dispatch(uiActions.toggleCurrency())}>{currency}</button>
  </nav>
  )
}

export default Navbar