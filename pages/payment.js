import {useState} from 'react'
import { useRouter } from 'next/router'
import CartItems from '../components/CartItems';
import axios from 'axios';

function payment() {
    const router = useRouter();
    const [error, setError] = useState({
        frontend: "",
        backend: "",
    });
    const [card, setCard] = useState();
    

    function handleCard(e) {
        setCard(prevState => {return {...prevState,
            [e.target.name]:e.target.value}})
    }

    async function removeAllItems() {
        await axios.delete(`https://xcaret-store-backend.herokuapp.com/api/cart/`)
    }

    async function handlePayment(e) {
        e.preventDefault();
        try {
            if(card === undefined ) {
                throw new Error("Missing card details, please fill all fields ")
            }
            const response = await axios.post('http://localhost:3001/api/order/', {
                card_name: card.card_name,
                card_number: card.card_number,
                card_cvv: card.card_cvv,
                card_date: card.card_date,
            })
            if(response.status === 200) {
                setError({frontend:"", backend:""})
                router.push("/thanks/")
                removeAllItems();
            }
            console.log(response)
        } catch (e) {
            setError( {
                frontend: e.message,
                backend: e?.response?.data.message
            })

        }

    }


  return (
    <div className="">

        <div className="flex flex-col sm:justify-evenly w-full">
            <h1 className="text-5xl font-extralight text-neutral-400 self-center sm:self-start sm:ml-72 mt-10 mb-6">Order details</h1>
        </div>
        <div className="text-center mx-[30%]">
            <CartItems onCheckout={true}/>
        </div>
    
      <div className="flex flex-col items-center justify-center bg-neutral-100 py-10 ">
        <h1>Payment information</h1>
        { error.frontend && <p className='bg-red-100 rounded-md p-6'>{error.frontend}</p>}
        { error.backend && <p className='bg-red-100 rounded-md p-6'>{error.backend}</p>}
        <form className="flex flex-col sm:flex-row w-[100vw] gap-3 items-center justify-center" onSubmit={handlePayment}>
            <div className="flex flex-col flex-wrap gap-1 justify-center mt-10 px-10" onChange={handleCard}>
                    <p className='text-sm'>Card number</p>
                    <input
                        name="card_number" className="border rounded h-10 text-lg" placeholder="5152 1234 5678 9123" type='text'
                        onClick={ e => handleCard(e)}
                    />
                    <p className='text-sm'>Name on the card</p>
                    <input
                        name="card_name" className="border rounded h-10 text-lg" placeholder="Name" type='text'
                        onClick={ e => handleCard(e)}
                    />
                    <p className='text-sm'>Expiry date</p>
                    <input
                        name="card_date" className="border rounded h-10 text-lg" placeholder="MM/YY" type='text'
                        onClick={ e => handleCard(e)}
                    />
                    <p className='text-sm'>CVV</p>
                    <input
                        name="card_cvv" className="border rounded h-10 text-lg" placeholder="000" type='text'
                        onClick={ e => handleCard(e)}
                    />
                
            </div>
            <div className="flex flex-col flex-wrap items-center gap-5 mb-10">
                <div className="">
                    {/* <p className="text-right1">Total amount</p> */}
                    {/* <p className="text-right4 text-4xl">$5000</p> */}
                </div>

                    <button 
                        type='submit'
                        className='bg-cyan-500 font-bold text-white uppercase rounded hover:bg-cyan-800 transition-all duration-500 py-3 px-3 mt-10'>
                        Place order
                    </button>
                    <button 
                        type='button'
                        onClick={()=>router.push("/")}
                        className='bg-red-100 text-white text-sm font-light rounded hover:bg-red-400 transition-all duration-500 py-1 px-2'>
                        Go back
                    </button>


            </div>

        </form>
    </div>
    </div>
  )
}

export default payment