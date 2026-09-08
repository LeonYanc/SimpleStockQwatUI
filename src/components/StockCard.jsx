function StockCard({stock}){


return (

<div className="bg-slate-900 rounded-xl p-6">


<p className="text-slate-400">

{stock.symbol}

</p>



<h2 className="text-4xl font-bold mt-3">

${stock.price}

</h2>



</div>

);


}


export default StockCard;