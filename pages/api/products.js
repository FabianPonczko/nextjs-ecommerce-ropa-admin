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
    if(linkEliminar && linkEliminar.length > 0){
      linkEliminar.forEach((linkAeliminar) => {
        // Crear una referencia al archivo a eliminar
        const desertRef = ref(storage, linkAeliminar);
        // Eliminar el archivo
        deleteObject(desertRef).then(() => {
            console.log(`File ${linkAeliminar} deleted successfully`);
        }).catch((error) => {
            console.log(`Uh-oh, an error occurred while deleting ${linkAeiminar}:`, error);
        });
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