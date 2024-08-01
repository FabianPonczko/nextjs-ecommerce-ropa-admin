import {
  ref,
  deleteObject
} from "firebase/storage";
import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

import { storage } from '@/lib/firebasedb';
const bucketName = 'dawid-next-ecommerce';

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  await isAdminRequest(req,res);

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Product.findOne({_id:req.query.id}));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === 'POST') {
    const {title,description,price,stock,images,category,weight,width,height,depth, properties} = req.body;
    const productDoc = await Product.create({
      title,description,price,stock,images,category,weight,width,height,depth,properties,
    })
    res.json(productDoc);
  }

  if (method === 'PUT') {
    const {linkEliminar,title,description,price,stock,images,category,weight,width,height,depth, properties,_id} = req.body;
    await Product.updateOne({_id}, {title,description,price,stock,images,category,weight,width,height,depth, properties});
    if(linkEliminar){
        // Create a reference to the file to delete
        const desertRef = ref(storage, linkEliminar);
        // Delete the file
        deleteObject(desertRef).then(() => {
          console.log("File deleted successfully")
        }).catch((error) => {
          console.log("Uh-oh, an error occurred!")
        });
    }
      res.json(true);
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({_id:req.query?.id});
      res.json(true);
    }
  }
}