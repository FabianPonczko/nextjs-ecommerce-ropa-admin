import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
  _id,
  title:existingTitle,
  description:existingDescription,
  price:existingPrice,
  stock:existingStock,
  images:existingImages,
  category:assignedCategory,
  properties:assignedProperties,

  weight:existingWeight,
  height: existingHeight,
  width: existingWidth,
  depth: existingDepth,
  }) {
  const [title,setTitle] = useState(existingTitle || '');
  const [description,setDescription] = useState(existingDescription || '');
  const [category,setCategory] = useState(assignedCategory || '');
  const [productProperties,setProductProperties] = useState(assignedProperties || {});
  const [weight,setWeight] = useState(existingWeight || '');
  const [height,setHeight] = useState(existingHeight || '');
  const [width,setWidth] = useState(existingWidth || '');
  const [depth,setDepth] = useState(existingDepth || '');
  const [price,setPrice] = useState(existingPrice || '');
  const [stock,setStock] = useState(existingStock || '');
  const [images,setImages] = useState(existingImages || []);
  const [linkEliminar,setLinkEliminar] = useState("");
  const [goToProducts,setGoToProducts] = useState(false);
  const [isUploading,setIsUploading] = useState(false);
  const [categories,setCategories] = useState([]);
  const router = useRouter();

  
  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, []);
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,description,price,stock,images,category,weight,width,height,depth,
      properties:productProperties,linkEliminar
    };
    if (_id) {
      //update
      await axios.put('/api/products', {...data,_id});
    } else {
      //create
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push('/products');
  }
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      
      const res = await axios.post('/api/upload', data);
      setImages(oldImages => {
        return [...oldImages, ...res.data?.links];
      });
      setIsUploading(false);
    }
  }
  async function deleteImage(link) {
    setLinkEliminar(link)
    const data = {link,images};
    if(_id){
      try {
        const res = await axios.put('/api/deleteImage', {...data,_id});
        setImages(res.data?.newImages);
        console.log('Imagen eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        // Maneja el error según tus necesidades, por ejemplo, mostrando un mensaje al usuario
      }
    }
    
  }
  function updateImagesOrder(images) {
    setImages(images);
  }
  function setProductProp(propName,value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
      <form onSubmit={saveProduct}>
        <label>Product name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={ev => setTitle(ev.target.value)}/>
        <label>Category</label>
        <select value={category}
                onChange={ev => setCategory(ev.target.value)}>
          <option value="">Uncategorized</option>
          {categories.length > 0 && categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        {propertiesToFill.length > 0 && propertiesToFill.map(p => (
          <div key={p.name}>
             
             {/* propiedades ej: talle , color */}
            <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
            <div>
              <select value={productProperties[0]}
                      onChange={ev =>
                        setProductProp(p.name,ev.target.value)
                      }
                      >
                <option value="">{productProperties[p.name]} </option>
                {p.values.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

                {/* {category.length > 0 && */}
                {propertiesToFill[0].name === p.name &&
                <div>
                  <label>Stock</label>
                  <input  type="number"
                  placeholder={stock }
                  value={stock}
                  onChange={ev =>setStock(ev.target.value)}
                  />
          </div>
          }
  
          </div>
        ))}
          
        <label>
          Photos
        </label>
        <div className="mb-2 flex flex-wrap gap-1">
          <ReactSortable
            list={images}
            className="flex flex-wrap gap-1"
            setList={updateImagesOrder}>
            {!!images?.length && images.map(link => (
              <>
              <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
              <label style={{position:"absolute",backgroundColor:"red",borderRadius:"50%" ,width:"15px",color:"white",display:"flex",justifyContent:"center",cursor:"pointer"}}
              onClick={()=>deleteImage(link)}
              >X</label>
                <img src={link} alt="" className="rounded-lg"/>
              </div>
              </>
            ))}
          </ReactSortable>
          {isUploading && (
            <div className="h-24 flex items-center">
              <Spinner />
            </div>
          )}
          <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div>
              Add image
            </div>
            <input type="file" onChange={uploadImages} className="hidden"/>
          </label>
        </div>
        <label>Description</label>
        <textarea
          placeholder="description"
          value={description}
          onChange={ev => setDescription(ev.target.value)}
        />
        <label>Price (in USD)</label>
        <input
          type="number" placeholder="price"
          value={price}
          onChange={ev => setPrice(ev.target.value)}
        />
        <p style={{marginTop:"20px",marginBottom:"10px"}}>For the delivery only</p>
        <label>Weight (in gr)</label>
        <input
          type="number" placeholder="weigth"
          value={weight}
          onChange={ev => setWeight(ev.target.value)}
        />
        <label>height (in cm)</label>
        <input
          type="number" placeholder="heigth"
          value={height}
          onChange={ev => setHeight(ev.target.value)}
        />
        <label>width (in cm)</label>
        <input
          type="number" placeholder="width"
          value={width}
          onChange={ev => setWidth(ev.target.value)}
        />
        <label>Depth (in cm)</label>
        <input
          type="number" placeholder="depth"
          value={depth}
          onChange={ev => setDepth(ev.target.value)}
        />
        <button
          type="submit"
          className="btn-primary">
          Save
        </button>
      </form>
  );
}
