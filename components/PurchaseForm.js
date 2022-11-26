import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { uiActions } from '../store/slices/uiSlice';
import { useRouter } from 'next/router'
import axios from "axios"

function CarPurchaseDetails( {  editCart } ) {
    const car = useSelector( state => state.ui.selectedItem );
    if (car === undefined) return null
    const [form, setForm] = useState(undefined);
    const [loan, setLoan] = useState({});
    const router = useRouter();
    const dispatch = useDispatch();
    const currency = useSelector( state => state.ui.currency );
    const carPrice = currency === 'mxn' ? car.price_mxn : car.price_usd;

    function calculateLoan(e) {
        const downpayment = e.target.value;
        const financedAmount = carPrice - downpayment;
        const loanPayment = (1.15)*financedAmount/12;
        setLoan( prevState => {
            return {
                ...prevState, 
                downpayment: downpayment,
                term_months:  12,
                apr: 0.15,
                loan_payment: loanPayment,
            }
        });
    }

    async function handleContinueShopping() {
        dispatch(uiActions.toggleCarModal())
        if(form === undefined ) return;
        console.log(loan)
        if(editCart) {
            await axios.put(`http://localhost:3001/api/cart/${car._id}`,{
                car_price: carPrice,
                selected_currency: currency,
                model: form.model,
                loan: form.method ==='cash'? {} : loan,
                subtotal: form.method === 'cash' ? carPrice : loan.downpayment, 
                // loan: loan,
            })
            router.push("/")  
            return          
        }
        await axios.post("http://localhost:3001/api/cart/",{
            _id: car._id,
            name: car.name,
            maker: car.maker,
            car_price: carPrice,
            price_mxn: car.price_mxn,
            price_usd: car.price_usd,
            selected_currency: currency,
            model: form.model,
            loan: loan,
            subtotal: form.method === 'cash' ? carPrice : loan.downpayment,
        })
        router.push("/")
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.post("http://localhost:3001/api/cart/",{
            _id: car._id,
            name: car.name,
            maker: car.maker,
            car_price: carPrice,
            price_mxn: car.price_mxn,
            price_usd: car.price_usd,
            selected_currency: currency,
            model: form.model,
            loan: loan,
            subtotal: form.method === 'cash' ? carPrice : loan.downpayment,
        })
        setForm(undefined)
        setLoan(undefined)
        dispatch(uiActions.toggleCarModal())
        router.push('/payment')
    }
    
    function handleForm(e) {
        setForm((prevState)=>{
            return ({...prevState,[e.target.name] : e.target.value})
        })
    }

    return (
        <div className='flex flex-col items-center gap-5 h-[100vh] justify-center'>
            <h1 className='text-3xl font-semibold'>Finance Options</h1>
            <h2 className='text-2xl font-bold'>{car.name}</h2>
            <h2 className='text-lg font-medium'>{car.maker}</h2>
            <form className='flex flex-col gap-5 items-center' onSubmit={ e => handleSubmit(e) } >
                <div onChange={ e => handleForm(e)  } >
                    {car.models?.length > 0 && <h3>Select Model</h3>}    
                    {car.models?.map( model => {
                        return(
                            <>
                                <input className="" type="radio" value={model} name="model"  />
                                <label htmlFor="model">{model}</label>
                            </>
                        )
                    })}
                </div> 
                <div onChange={ e => handleForm(e)  } >
                    <input className="" type="radio" value="cash"  name="method" onClick={()=>setLoan(undefined)} /> Cash
                    <input className="" type="radio" value="loan"  name="method" /> Loan
                </div> 
                { form?.method === "loan" ? 
                <>
                    <input name="downpayment" type="range" min={0.1*carPrice} max={0.8*carPrice} step="1000" onChange={ e => calculateLoan(e) }/>
                    <p>Downpayment: {loan?.downpayment}</p>
                </>
                : 
                <p>Precio del vehículo: {carPrice}</p>
                }
                <div className="flex flex-row gap-5">
                    <button 
                    type="button" 
                    className='bg-cyan-500 text-white uppercase rounded hover:bg-cyan-800 py-3 px-3' onClick={()=>router.push("/")}>
                        Cancelar
                    </button>
                    <button 
                    type="button" 
                    className='bg-cyan-500 text-white uppercase rounded hover:bg-cyan-800 py-3 px-3' onClick={handleContinueShopping}>
                        Editar y continuar comprando
                    </button>
                    <button 
                    type="submit" 
                    className='bg-cyan-500 text-white uppercase rounded hover:bg-cyan-800 py-3 px-3'>
                        Proceder a pago
                    </button>
                </div>
            </form>

        </div>
    )
}

export default CarPurchaseDetails