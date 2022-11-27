import { useRouter } from "next/router"

function thanks() {
  const router = useRouter();

  return (
    <div className=" flex flex-col items-center justify-center h-[100vh]">
      
      <h1 className="text-5xl" >
        Thank you for your preference
      </h1>
      <button 
                  onClick={() => router.push("/")}
                  className='bg-black text-white uppercase w-full hover:bg-neutral-600 py-3 mt-5 transition-all'>
                  Go Back Home
              </button>

    </div>
  )
}

export default thanks