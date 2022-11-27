import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { uiActions } from '../store/slices/uiSlice';
import { useRouter } from 'next/router'
import axios from "axios"

const API = 'https://xcaret-store-backend-production.up.railway.app';

function CarPurchaseDetails( {  editCart } ) {
    const car = useSelector( state => state.ui.selectedItem );
    if (car === undefined) return null
    const [form, setForm] = useState(undefined);
    const currency = useSelector( state => state.ui.currency );
    const [carPrice, setCarPrice] = useState(currency === 'mxn' ? car.price_mxn : car.price_usd);
    const [loan, setLoan] = useState({downpayment:0.4*carPrice});
    const [term, setTerm] = useState(12);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        switch (form?.model) {
            case 'Green':
                    addAmount(1.5)
                    break;
            case 'Blue':
                    addAmount(1.8)
                    break;
            case 'Red':
                    addAmount(1.2)
                    break;
            case 'Silver':
                    addAmount(1.3)
                    break;
            case 'Gray':
                    addAmount(1.4)
                    break;
            case 'Black':
                    addAmount(1.9)
                    break;
            case 'White':
                    addAmount(1.1)
                    break;    
            default:
                    addAmount(1)
                break;
        }
        function addAmount(multiplier) {
            setCarPrice(currency === 'mxn' ? car.price_mxn*multiplier : car.price_usd*multiplier)
        } 
      return () => {
      }
    }, [form?.model, form?.method, currency])
    
    useEffect(() => {
        setLoan({downpayment:0.4*carPrice});
        calculateLoan(0.4*carPrice)
        return () => {
      }
    }, [carPrice])
    
    useEffect(() => {
        const downpayment = loan.downpayment;
        calculateLoan(downpayment)
      return () => {
      }
    }, [term])
    
    
    function calculateLoan(downpayment) {
        const financedAmount = carPrice - downpayment;
        const loanPayment = (1.15)*financedAmount/(term);
        setLoan( prevState => {
            return {
                ...prevState, 
                downpayment: downpayment,
                term_months:  term,
                apr: 0.15,
                loan_payment: loanPayment,
            }
        });
    }

    async function handleContinueShopping() {

        if(form === undefined ) return;

        try{
            if(editCart) {
                await axios.put(`${API}/api/cart/${car._id}`,{
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
            const response = await axios.post(`${API}/api/cart/`,{
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

        } catch (e) {
            
            console.log(e)
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.post("${API}/api/cart/",{
            _id: car._id,
            name: car.name,
            maker: car.maker,
            car_price: carPrice,
            price_mxn: car.price_mxn,
            price_usd: car.price_usd,
            selected_currency: currency,
            model: form?.model,
            loan: loan,
            subtotal: form.method === 'cash' ? carPrice : loan.downpayment,
        })
        setForm(undefined)
        setLoan(undefined)

        router.push('/payment')
    }
    
    function handleForm(e) {
        setForm((prevState)=>{
            return ({...prevState,[e.target.name] : e.target.value})
        })

    }

    return (
        <div className='flex flex-col items-center gap-5  mt-20 sm:mt-10 justify-center'>
            <h1 className='text-5xl font-light text-neutral-400  sm:ml-48 sm:mt-10 sm:self-start'>{editCart && 'Edit ' }Finance Options</h1>
            <h2 className='text-5xl font-bold'>{car.name}</h2>
            <h2 className='text-4xl font-medium'>{car.maker}</h2>
            <form className='flex flex-col gap-5 items-center' onSubmit={ e => handleSubmit(e) } >
                <div onChange={ e => handleForm(e)  } >
                    {car.models?.length > 0 && <h3 className='font-light'>Available models</h3>}    
                    <div className="flex flex-col">
                        {car.models?.map( model => {
                            return(
                                <>
                            <div className="flex items-center justify-center bg-neutral-200 rounded-md h-10 mb-3">
                                <div className="flex items-center">
                                    {/* <input className="w-5 h-5" id="cash" type="radio" value="cash"  name="method"  /> */}
                                    <input className="w-5 h-5" type="radio" value={model} id={model} name="model"  />
                                </div>
                                <div className="">
                                    {/* <label for="cash" className="w-full h-full text-xl text-center font-medium cursor-pointer ">Cash</label> */}
                                    <label className="w-full h-full text-xl text-center font-medium cursor-pointer " for={model}>{model}</label>
                                </div>
                            </div>
                                    
                                    
                                </>
                            )
                        })}
                    </div>
                </div> 

                <h3 className='font-light'>Available finance options:</h3>
                <div onChange={ e => handleForm(e)  } >
                    <div className="flex flex-col">
                        <div className="flex items-center justify-center bg-neutral-200 rounded-md h-10">
                            <div className="flex items-center">
                                <input className="w-5 h-5" id="cash" type="radio" value="cash"  name="method"  />
                            </div>
                            <div className="">
                                <label for="cash" className="w-full h-full text-xl text-center font-medium cursor-pointer ">Cash</label>
                            </div>
                        </div>
                        <div className="flex items-center justify-center bg-neutral-200 rounded-md mt-3 h-10 w-20">
                            <div className="flex items-center">
                                <input className="w-5 h-5" id="loan" type="radio" value="loan"  name="method" />
                            </div>
                            <div className="">
                                <label for="loan" className="w-full h-full text-xl text-center font-medium cursor-pointer">Loan</label>
                            </div>
                            
                        </div>
                    </div>
                </div> 
                { form?.method === "loan" && 
                <div className='bg-neutral-100 flex flex-col items-center gap-4 rounded-md w-full h-full'>

                    <input className="w-full h-16 cursor-pointer"
                        name="downpayment" type="range" min={0.1*carPrice} max={0.8*carPrice}  step={0.01*carPrice} value={loan?.downpayment} onChange={ e => calculateLoan(parseInt(e.target.value)) }/>
                    <p className='text-xl font-light'>Downpayment:</p>
                    <p className='text-3xl'>${loan?.downpayment?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                    <p className='text-xl font-light'>Monthly payment:</p>
                    <p className='text-xl font-light'>${loan?.loan_payment?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                    <select className="mb-5" name="term_months" id="term_months" onChange={ e => setTerm(parseInt(e.target.value)) }>
                        <option value="12">12 Months</option>
                        <option value="24">24 Months</option>
                        <option value="48">48 Months</option>
                        <option value="60">60 Months</option>
                    </select>
                </div>
                }
                { form?.method === "cash" &&
                    <>
                    <p className='font-light'>Vehicle price: </p>
                    <p className='font-light text-3xl'>${carPrice.toLocaleString()}</p>
                    </>
                }
                <div className="flex flex-row gap-5">
                    <button 
                    type="button" 
                    className='bg-red-200 text-white rounded hover:bg-red-400 py-3 px-3 transition-all duration-500' onClick={()=>router.push("/")}>
                        Cancelar
                    </button>
                    <button 
                    type="button" 
                    className='bg-cyan-500 text-white rounded hover:bg-cyan-800 py-3 px-3' onClick={handleContinueShopping}>
                        {editCart ? "Editar y continuar comprando" : "Agregar y continuar comprando"}
                    </button>
                    <button 
                    type="submit" 
                    className='bg-cyan-500 text-white rounded hover:bg-cyan-800 py-3 px-3'>
                        Proceder a pago
                    </button>
                </div>
            </form>

        </div>
    )
}

export default CarPurchaseDetails