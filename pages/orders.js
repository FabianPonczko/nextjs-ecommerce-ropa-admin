import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders,setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic" >
        <thead   style={{border:"1px solid blue",backgroundColor:"#2222"}}>
          <tr>
            <th>Date</th>
            <th>Id</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr></tr>
        {orders.length > 0 && orders.map(order => (
          <tr style={{border:"1px solid blue"}} key={order._id}  >
            <td  >{(new Date(order.createdAt)).toLocaleString() }
            </td>
            <td >{order._id}
            </td>
            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
              {order.paid ? 'YES' : 'NO'}
            </td>
            <td>
              {order.name}, {order.email}<br />
              {order.city} {order.postalCode} {order.country}<br />
              {order.streetAddress}
            </td>
            <td>
              {order.line_items.map(l => (
                <span key={l.name}>
                  {l.product_data?.quantity} - {l.product_data?.title} 
                  <br />
                </span>
              ))}
            </td>
            <td>
              {order.line_items.map(l => (
                <span key={l._id}>
                    {l.product_data?.amount}
                    
                  </span>
                ))}
              </td>
           
          </tr>          
        ))}
        </tbody>
      
      </table>
    </Layout>
  );
}
