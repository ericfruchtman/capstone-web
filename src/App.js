import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from "react";
import {Button, List, Collapse} from 'antd';

const { Panel } = Collapse;

function App() {
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [questions, setQuestions]= useState();
  const [questionTxt, setQuestionTxt]= useState('');

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
  setQuestions(data); 
};

/* Make Post request to create a question */
const createNewQuestion = async () => {
  console.log ('create a questions for the category id', selectedCategory)
  let res = await fetch (`${apiUrl}/api/v1/categories/${selectedCategory}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({questionTxt: questionTxt})
  });
  fetchQuestionsForCategory(selectedCategory);
  setQuestionTxt('')
};

const createANewAnswer = async () => {
        // you will need something called selectedQuestion to keep a track of the question that has been selected
      // a state variable to store the answer text that the user types in

      // the usual fetch request / HINT : look up the stock API request
      // 1. Make a POST request to create an answer
      // 2. Once the call is successful
      // 3. Fetch the questions for a category again (reload the questions)
      // 4. done!
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
        {/* <h1 className={'text-center text-3xl'}>Currently selected Category is: {selectedCategory}</h1>
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
        </ul>  */}

        <List
        size= "large"
        header={<div className={'font-bold'}>Categories</div>}
        bordered
        dataSource={categories}
        renderItem={category => <List.Item>
                    <div className={category.id == selectedCategory ? 'cursor-pointer text-blue-500 font-bold' : 'cursor-pointer'} onClick={() => {
                        setSelectedCategory(category.id);
                        fetchQuestionsForCategory(category.id)
                    }}>
                        {category.name}
                    </div>
        </List.Item>}
        />
      </div>
      
      <div className={'col-span-full md:col-span-9 lg:col-span-10 border p-5'}>

{/*<button className={'border p-2 pl-4 pr-4 bg-gray-200'} onClick={createNewQuestion}>New Question</button>*/}

{selectedCategory && <div>
    <input value={questionTxt} onChange={(ev) => {
        setQuestionTxt(ev.currentTarget.value);
    }} type="text" className={'border p-1 mr-5 w-2/3'}/>
    <Button type={'primary'} onClick={createNewQuestion}>Create new question</Button>
    <br/>
    <br/>
</div>}

{/*<ul>*/}
{/*    {questions && questions.map((question) => {*/}
{/*        return <li key={question.id}>*/}
{/*            /!*{question.questionTxt} - {question.Answers.length}*!/*/}
{/*            {question.questionTxt} {question.Answers.length >0 && <span>- <span>{question.Answers.length}</span></span>}*/}
{/*        </li>*/}
{/*    })}*/}
{/*</ul>*/}

{selectedCategory && <Collapse accordion>
    {questions && questions.map((question, index) => {
        return <Panel header={question.questionTxt} key={index}>
            <List
                size="small"
                // header={<div className={'font-bold'}>Answers List</div>}
                footer={<div>
                    <input value={questionTxt} onChange={(ev) => {
                        setQuestionTxt(ev.currentTarget.value);
                    }} type="text" className={'border p-1 mr-5 w-2/3'}/>
                    <Button type={'primary'} onClick={createANewAnswer}>Add Answer</Button>
                </div>}
                bordered
                dataSource={question.Answers}
                renderItem={answer => <List.Item>
                    <div>
                        {answer.answerTxt}
                    </div>
                </List.Item>}
            />
        </Panel>
    })}
</Collapse>}

{!selectedCategory && <h1 className={'text-center text-xl uppercase tracking-wider text-blue-500'}>Select a category to get started</h1>}
{/*{questions && <p>{JSON.stringify(questions)}</p>}*/}
</div>
</div>
</>
);
}

export default App;
