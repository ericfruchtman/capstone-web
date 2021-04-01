import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from "react";

function App() {
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [questions, setQuestions]= useState();

  let apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const fetchCategories = async () => {
    console.log('fetching the categories');
    /* let res = await fetch('http://localhost:3000/api/v1/categories'); */
    console.log(`${apiUrl}/api/v1/categories`)
    let res = await fetch(`${apiUrl}/api/v1/categories`);
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

const fetchQuestionsForCategory = async (id) => {
  console.log('fetch questions for this category id', id);
  let res = await fetch (`http://localhost:3000/api/v1/categories/${id}/questions`);
  let data = await res.json();
  console.log(data); 
};

const createNewQuestion = async () => {
  console.log ('create a questions for the category id', selectedCategory)
};


  return (
    <>

    <div className="grid grid-cols-12">
      <div className={'col-span-full border p-5'}>
        <h1 className={'text-center text-3xl'}>Custom Quiz Generator</h1>
      </div>
    </div>
    <div className="grid grid-cols-12">
      <div className= {'col-span-full md:col-span-3 lg:col-span-2 border p-5'}>
        <h1 className={'text-center text-3xl'}>Currently selected Category is: {selectedCategory}</h1>
        <ul>
          {categories.map((category, index) => {
            return <li key={index} className={category.Id == 
              selectedCategory ? 'border p-5 cursor-pointer bg-gray-200' : 'border p-5 cursor-pointer'} 
              onClick={() => {
                setSelectedCategory(category.id);
                fetchQuestionsForCategory(category.id)
              }}>
                {category.name}
              </li>
          })}
        </ul>
      </div>
      
      <div className={'col-span-full md:col-span-9 lg:col-span-10 border p-5'}>
        <h1 className={'text-center text-3xl'}>blank space</h1>

        <button className={'border p-2 pl-4 pr-4 bg-gray-200'} onClick={createNewQuestion}>New Question</button>
        <br />
        <br />

        <ul>
          {questions && questions.map((question) => {
            return <li key={question.id}>
              {question.questionTxt}
              {question.Answers.length >0 && <span>- <span>{question.Answers.length}
              </span></span>}
            </li>
          })}
        </ul>
      </div>
    </div>
    </>
  );
}

export default App;
