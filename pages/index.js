import Layout from "@/components/Layout";
import { data } from "autoprefixer";
import axios from "axios";
import {useSession} from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const {data: session} = useSession();
  const [order,setOrder] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItemsDay, setFilteredItemsDay] = useState([]);
  const [filteredItemsWeek, setFilteredItemsWeek] = useState([]);
  const [filteredItemsMonth, setFilteredItemsMonth] = useState([]);
  const [filteredItemsYear, setFilteredItemsYear] = useState([]);


useEffect(() => {
   const fetchItems = async () => {
      try {
          const response = await axios.get('/api/dashboard');
          setItems(response.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };
  fetchItems();
}, []);

useEffect(()=>{
    filterToday()
    filterThisWeek()
    filterThisMonth()
    filterThisYear()
},[items])

  const filterToday = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    const todayItems = items.filter(item => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= start && createdAt <= end && item.paid===true;
    });
    
    // const total = filtered.reduce((sum, item) => sum + item.price, 0);
    // setTotalPrice(total);
    console.log({todayItems})
    setFilteredItemsDay(todayItems);
  };
  const filterThisWeek = () => {
    const start = new Date();
    start.setDate(start.getDate() - start.getDay()); // Domingo
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Sábado
    end.setHours(23, 59, 59, 999);
    
    const weekItems = items.filter(item => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= start && createdAt <= end && item.paid===true;
    });
    
    setFilteredItemsWeek(weekItems);
  };

  const filterThisMonth = () => {
    const start = new Date();
    start.setDate(1); // Primer día del mes
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // Último día del mes
    end.setHours(23, 59, 59, 999);

    const monthItems = items.filter(item => {
        const createdAt = new Date(item.createdAt);
        return createdAt >= start && createdAt <= end && item.paid===true;
    });

    setFilteredItemsMonth(monthItems);
};
  
const filterThisYear = () => {
  const start = new Date(new Date().getFullYear(), 0, 1); // Primer día del año
  start.setHours(0, 0, 0, 0);
  const end = new Date(new Date().getFullYear(), 11, 31); // Último día del año
  end.setHours(23, 59, 59, 999);

  const yearItems = items.filter(item => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= start && createdAt <= end && item.paid===true;
  });

  setFilteredItemsYear(yearItems);
};

const amountDay = Object.values(filteredItemsDay).flat().reduce((sum, item) => {
  return sum + item.line_items.reduce((lineItemSum, lineItem) => {
    return lineItemSum + lineItem.product_data.amount;
  }, 0);
}, 0);

const amountWeek = Object.values(filteredItemsWeek).flat().reduce((sum, item) => {
  return sum + item.line_items.reduce((lineItemSum, lineItem) => {
    return lineItemSum + lineItem.product_data.amount;
  }, 0);
}, 0);

const amountMonth = Object.values(filteredItemsMonth).flat().reduce((sum, item) => {
  return sum + item.line_items.reduce((lineItemSum, lineItem) => {
    return lineItemSum + lineItem.product_data.amount;
  }, 0);
}, 0);

const amountYear =  Object.values(filteredItemsYear).flat().reduce((sum, item) => {
  return sum + item.line_items.reduce((lineItemSum, lineItem) => {
    return lineItemSum + lineItem.product_data.amount;
  }, 0);
}, 0);



  return <Layout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        Hello, <b>{session?.user?.name}</b>
      </h2>
      <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"/>
        <span className="px-2">
          {session?.user?.name}
        </span>
      </div>
      
    </div>
    <div>
      <div className="mt-5 font-bold font-sans text-center bg-slate-300">Ventas</div>
      <div className="flex flex-col">
        <div className=" p-3 flex justify-evenly font-serif">
          <div>
              {filteredItemsDay.length > 0 && (
                <div className=" mt-5 p-3 bg-slate-200 flex flex-col justify-around w-60 h-32 rounded-lg ">
                  <div className=" flex justify-around">
                    <span >Ordenes Diarias</span>
                  </div>
                  <div className=" flex justify-around font-bold font-mono">
                    <p>{filteredItemsDay.length}</p>
                  </div>
                </div>
              )}

          </div>
          <div>
            {filteredItemsWeek.length > 0 && (
              <div className="  mt-5 p-3 bg-slate-200 flex flex-col justify-around w-60 h-32 rounded-lg ">
                <div className=" flex justify-around">
                  <span>Ordenes Semanales</span>
                </div>
                <div className=" flex justify-around font-bold font-mono">
                  <p>{filteredItemsWeek.length}</p>
                </div>
              </div>
            )}
            
          </div>
          <div>
            {filteredItemsMonth.length > 0 && (
              <div className="  mt-5 p-3 bg-slate-200 flex flex-col justify-around w-60 h-32 rounded-lg ">
                <div className=" flex justify-around">
                  <span>Ordenes Mensuales</span>
                </div>
                <div className=" flex justify-around font-bold font-mono">
                  <p>{filteredItemsMonth.length}</p>
                </div>
              </div>
            )}
            
          </div>
          <div>
            {filteredItemsYear.length > 0 && (
              <div className="  mt-5 p-3 bg-slate-200 flex flex-col justify-around w-60 h-32 rounded-lg ">
                <div className=" flex justify-around">
                  <span>Ordenes Anuales</span>
                </div>
                <div className=" flex justify-around font-bold font-mono">
                  <p>{filteredItemsYear.length}</p>
                </div>
              </div>
            )}
            
          </div>
        </div>
        <div className=" p-3 flex justify-evenly font-serif">
        <div>
        {filteredItemsDay.length > 0 && (
                <div className=" mt-5 p-3 bg-slate-200 flex flex-col justify-around w-60 h-32 rounded-lg ">
                  <div className=" flex justify-around">
                    <span >Suma Diaria</span>
                  </div>
                  <div className=" flex justify-around font-bold font-mono">
                    <p>${amountDay}</p>
                  </div>
                </div>
              )}
        </div>
        <div>
        {filteredItemsWeek.length > 0 && (
                <div className=" mt-5 p-3 bg-slate-200 flex flex-col justify-around w-60 h-32 rounded-lg ">
                  <div className=" flex justify-around">
                    <span >Suma Semanal</span>
                  </div>
                  <div className=" flex justify-around font-bold font-mono">
                    <p>${amountWeek}</p>
                  </div>
                </div>
              )}
        </div>
        <div>
        {filteredItemsMonth.length > 0 && (
                <div className=" mt-5 p-3 bg-slate-200 flex flex-col justify-around w-60 h-32 rounded-lg ">
                  <div className=" flex justify-around">
                    <span >Suma Mensual</span>
                  </div>
                  <div className=" flex justify-around font-bold font-mono">
                    <p>${amountMonth}</p>
                  </div>
                </div>
              )}
        </div>
        <div>
        {filteredItemsYear.length > 0 && (
                <div className=" mt-5 p-3 bg-slate-200 flex flex-col justify-around w-60 h-32 rounded-lg ">
                  <div className=" flex justify-around">
                    <span>Suma Anual</span>
                  </div>
                  <div className=" flex justify-around font-bold font-mono">
                    <p>${amountYear}</p>
                  </div>
                </div>
              )}
        </div>
        </div>
      </div>
    </div>
  </Layout>
}
