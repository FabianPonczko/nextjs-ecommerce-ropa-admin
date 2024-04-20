import multiparty from 'multiparty';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";

import fs from 'fs';
import mime from 'mime-types';
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

import { storage } from '@/lib/firebasedb';

const bucketName = 'dawid-next-ecommerce';

export default async function Handle(req,res) {
  await mongooseConnect();
  await isAdminRequest(req,res);

  // const [imageUrl,setImageUrls] = useState(null)

  const form = new multiparty.Form();
  const {fields,files} = await new Promise((resolve,reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({fields,files});
    });
  });
  // console.log('length:', files.file.length);
  
  const links = [];
  
   for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const newFilename = Date.now() 
    const imagePath =  fs.readFileSync(file.path)
     const imageRef =  ref(storage, `images/${file.originalFilename}`);
    uploadBytes(imageRef,imagePath  ).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        //  setImageUrls((prev) => [...prev, url]);
        links.push(url)
        return res.json({links});
      });
      
    });
    
    
  }
  
}

export const config = {
  api: {bodyParser: false},
};