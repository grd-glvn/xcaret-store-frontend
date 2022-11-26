import {useSelector, useDispatch} from 'react-redux'
import {useState} from 'react'
import { useRouter } from 'next/router'

function payment() {
    const router = useRouter();
    const dispatch = useDispatch();
    const cartItems = useSelector( state => state.ui.cartItems);
    const [card, setCard] = useState();

    function handleCard(e) {
        setCard(prevState => {return {...prevState,
            [e.target.name]:e.target.value}})
    }

    async function handlePayment(e) {
        e.preventDefault();
        const reqOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(card)
        };
        const response = await fetch('https://xcaret-store-frontend.herokuapp.com/api/order/',reqOptions);
        const data = await response.json();
        console.log(data)
        alert("Pagado!")
    }
  return (
    <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl">Datos de pago</h1>
        <form className="flex flex-col w-[30vw] gap-3" onSubmit={handlePayment}>
            <div className="flex flex-col gap-5" onChange={handleCard}>
                <input name="card_name" className="border rounded" placeholder="Nombre de titular de tarjeta" type='text'/>
                <input name="card_number" className="border rounded" placeholder="Número de tarjeta" type='text'/>
                <input name="card_expiration_date" className="border rounded" placeholder="Fecha de expiración" type='text'/>
                <input name="card_cvv" className="border rounded" placeholder="CVV" type='text'/>
            </div>
            <div className="">
            <p className="text-right">Total a pagar</p>
            <p className="text-right text-3xl">$5000</p>
            </div>
            <button 
                type='submit'
                className='bg-cyan-500 text-white uppercase rounded hover:bg-cyan-800 py-3 px-3'>
                Realizar pago
            </button>
            <button 
                type='button'
                onClick={()=>router.push("/")}
                className='bg-cyan-500 text-white uppercase rounded hover:bg-cyan-800 py-3 px-3'>
                Cancelar
            </button>
        </form>
    </div>
  )
}

export default payment