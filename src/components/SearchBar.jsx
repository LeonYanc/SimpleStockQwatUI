import { useState } from "react";


function SearchBar({ onSearch }) {


  const [symbol, setSymbol] = useState("");



  const handleSearch = () => {

    if(symbol.trim()){

      onSearch(symbol.toUpperCase());

    }

  };



  return (

    <div className="flex gap-4">


      <input

        value={symbol}

        onChange={(e)=>setSymbol(e.target.value)}

        placeholder="Search stock symbol..."

        className="
        bg-slate-900
        border
        border-slate-700
        rounded-lg
        px-4
        py-3
        w-80
        text-white
        "

      />



      <button

        onClick={handleSearch}

        className="
        bg-blue-600
        hover:bg-blue-700
        px-6
        rounded-lg
        font-semibold
        "

      >

        Search

      </button>


    </div>

  );

}


export default SearchBar;