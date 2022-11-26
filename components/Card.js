import { useSelector, useDispatch } from 'react-redux'
import { uiActions } from '../store/slices/uiSlice';
import { useRouter } from 'next/router'


function Card( { carDetails } ) {
  const router = useRouter();
  const currency = useSelector( state => state.ui.currency );
  const carPrice = currency === 'mxn' ? carDetails.price_mxn : carDetails.price_usd;
  const dispatch = useDispatch();
  
  function handleAddToCart() {
    dispatch(uiActions.selectItem(carDetails))
    router.push("/addtocart")
  }
  if (carDetails === undefined) return <div>loading...</div>
  return (
    <div className="flex flex-col px-10  shadow-lg  border rounded-xl py-5 gap-5 bg-neutral-50 ">
        {/* <img className='' src="some.jpg" alt="" /> */}
        <h2 className='text-2xl font-medium'>{carDetails.name}</h2>
        <h2 className="text-xl">{carDetails.maker}</h2>
        <h2 className='text-2xl text-right font-bold'>${carPrice}</h2>
        <div className='text-center'>
          <button onClick={ handleAddToCart } className='bg-cyan-900 text-cyan-100 text-sm font-bold uppercase rounded hover:bg-cyan-600  py-3 px-3 transition-all duration-800'>Add to Cart</button>
        </div>
    </div>
  )
}

export default Card