import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from "react";

function App() {
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();

  const fetchCategories = async () => {
    console.log('fetching the categories');
    let res = await fetch('http://localhost:3000/api/v1/categories');
    let data = await res.json();
    console.log(data);
    setCategories(data);
  };

  useEffect(() => {
    //this code runs once on component mount
    fetchCategories()
  }, [])

  useEffect(() => {
    // this code will run whenever the selectedCategory changes
}, [selectedCategory])


  return (
    <>
    <div className="grid grid-cols-12">
      <div className={'col-span-full border p-5'}>
        <h1 className={'text-center text-3xl'}>Custom Quiz Generator</h1>
      </div>
    </div>
    <div className="grid grid-cols-12">
      <div className= {'col-span-full md:col-span-3 lg:col-span-2 border p-5'}>
        <ul>
          {categories.map((category, index) => {
            return <li key={index} className={category.Id == 
              selectedCategory ? 'border p-5 cursor-pointer bg-gray-200' : 'border p-5 cursor-pointer'} 
              onClick={() => {setSelectedCategory(category.id);
              }}>
                {category.name}
              </li>
          })}
        </ul>
      </div>
      
      <div className={'col-span-full md:col-span-9 lg:col-span-10 border p-5'}>
        <h1 className={'text-center text-3xl'}>blank space</h1>
      </div>
    </div>
    </>
  );
}

export default App;
