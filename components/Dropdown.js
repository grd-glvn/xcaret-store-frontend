import { useState } from "react";

function Dropdown( ) {
    const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div className="relative text-center">
        <button className="relative block z-10 px-5 py-1 hover:bg-white rounded transition-all duration-600" onClick={()=> setShowDropdown(!showDropdown)}>
            <p className="">Cart</p>
        </button>
        { showDropdown &&
        <>
        <button className="fixed top-0 right-0 bottom-0 w-full h-[100vh] cursor-default bg-black opacity-30" onClick={()=> setShowDropdown(!showDropdown)}></button>
        <ul className=" bg-neutral-100 absolute top-10 z-10 w-48 rounded overflow-hidden">
            <li className="hover:bg-neutral-200">Item 1</li>
            <li className="hover:bg-neutral-200">Item 2</li>
            <li className="hover:bg-neutral-200">Item 3</li>
        </ul>
        </>
        }
    </div>
  )
}

export default Dropdown