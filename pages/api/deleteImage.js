import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";


export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);


  if (method === 'PUT') {
    const {_id,link,images} = req.body;
    console.log("link a eliminar ",link)
    const newImages = images.filter((links)=> !links.includes(link))
    // console.log({newImages})
    // await Product.updateOne({_id}, {images:newImages});
    res.json({newImages});
  }

  
}