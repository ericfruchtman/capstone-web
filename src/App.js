import './App.css';
import React, {useEffect, useState} from "react";
import {Button, List, Collapse} from 'antd';

const { Panel } = Collapse;

function App() {
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [questions, setQuestions]= useState([]);
  const [selectedQuestion, setSelectedQuestion]= useState();
  const [questionTxt, setQuestionTxt]= useState('');
  const [answers, setAnswers]= useState([]);
  const [answerTxt, setAnswerTxt]= useState('');

  let apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const fetchCategories = async () => {
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
    fetchQuestionsForCategory();
  }, [selectedCategory])
  
  useEffect(() => {
    fetchAnswers();
  }, [selectedQuestion])

const fetchQuestionsForCategory = async (id) => {
  console.log(id);
  let res = await fetch (`${apiUrl}/api/v1/categories/${id}/questions`);
  let data = await res.json();
  console.log(data);
  setQuestions(data); 
};


const fetchAnswers = async (id) => {
  console.log(id);
    let res = await fetch(`${apiUrl}/api/v1/categories/:categoryId/questions/${id}/answers`);
    let data = await res.json();
    console.log(data);
    setAnswers(data);
  };


/* Make Post request to create a question */
const createNewQuestion = async () => {
  console.log (selectedCategory)
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
  console.log(selectedQuestion)
  let res = await fetch(`${apiUrl}/api/v1/categories/:categoryId/questions/${selectedQuestion}/answers`, {
    method: 'POST',
    headers: {},
    body: JSON.stringify({answerTxt: answerTxt})
});
fetchAnswers(selectedQuestion);
fetchQuestionsForCategory();
setAnswerTxt('')
};
        // you will need something called selectedQuestion to keep a track of the question that has been selected
      // a state variable to store the answer text that the user types in

      // the usual fetch request / HINT : look up the stock API request
      // 1. Make a POST request to create an answer
      // 2. Once the call is successful
      // 3. Fetch the questions for a category again (reload the questions)
      // 4. done!

  return (
    <>
    <div className="grid grid-cols-12">
      <div className={'col-span-full border p-5'}>
        <h1 className={'text-center text-3xl'}>Custom Quiz Generator</h1>
      </div>
    </div>
    <div className="grid grid-cols-12">
              {/* Sidebar */}
        <div className={"col-span-full md:col-span-3 lg:col-span-2 border p-4"}>
          <ul>
            {categories.map((category, index) => {
              return <li key={index} className={category.id == selectedCategory ? 
                "rounded border my-2 p-4 cursor-pointer bg-blue-500 text-white font-bold" : "rounded border my-2 p-4 cursor-pointer"} 
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedQuestion('');
                }}>
                {category.name}
              </li>
            })}
          </ul>
        </div>

        {/* Results */}
        <div className={"col-span-full md:col-span-9 lg:col-span-10 border p-4"}>
          <ul>
            <div className={"grid grid-cols-12 gap-4"}>
              
              {/* Question Input Bar */}
              {selectedCategory && <input value={questionTxt} onChange={(event) => {
                setQuestionTxt(event.currentTarget.value);
                }} type="text" className={'col-span-full md:col-span-9 lg:col-span-10 border w-full rounded border-gray-300 p-2'}/>}
                {selectedCategory && <span className={'col-span-full md:col-span-3 lg:col-span-2 bg-green-600 cursor-pointer rounded text-center text-white text-xl md:text-lg p-2'} onClick={createNewQuestion}>New Question</span>}
            </div>
            <br/>            
            
            {/* Responses & Answer Input Bar */}
            {questions.map((question, index) => {
              return <div>
                <li key={index} className={question.id == selectedQuestion ? 
                "border my-2 p-4 bg-gray-300 font-bold" : "border my-2 p-4 cursor-pointer"} 
                onClick={() => {
                setSelectedQuestion(question.id);
                }}>
                  {question.questionTxt}
                  {question.Answers.length > 0 && <span> - Number of Answers: {question.Answers.length}</span>}
                                                      
                  {answers.map((answer, id) => {
                    return answer.questionId == question.id && <div key={id} className={"rounded border p-4 mt-4 bg-white font-normal"}>
                      {answer.answerTxt}
                    </div>
                  })}
               </li>
               {selectedQuestion == question.id && 
               <div className={"bg-gray-300 p-4 border"}>
                 <input value={answerTxt} onChange={(event) => {
                   setAnswerTxt(event.currentTarget.value);
                   }} type="text" className={'rounded border p-2 mr-5 w-3/4'}/>
                  <button className={"col-span-full md:col-span-3 lg:col-span-2 bg-green-600 cursor-pointer rounded text-center text-white text-xl md:text-lg p-2"} 
                  onClick={createANewAnswer}>Add Answer</button>
                </div>}
                   
              </div>

            })}
            </ul>


        
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

        {/* <List
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
      
      <div className={'col-span-full md:col-span-9 lg:col-span-10 border p-5'}> */}

{/*<button className={'border p-2 pl-4 pr-4 bg-gray-200'} onClick={createNewQuestion}>New Question</button>*/}

{/* {selectedCategory && <div>
    <input value={questionTxt} onChange={(ev) => {
        setQuestionTxt(ev.currentTarget.value);
    }} type="text" className={'border p-1 mr-5 w-2/3'}/>
    <Button type={'primary'} onClick={createNewQuestion}>Create new question</Button>
    <br/>
    <br/>
</div>} */}

{/*<ul>*/}
{/*    {questions && questions.map((question) => {*/}
{/*        return <li key={question.id}>*/}
{/*            /!*{question.questionTxt} - {question.Answers.length}*!/*/}
{/*            {question.questionTxt} {question.Answers.length >0 && <span>- <span>{question.Answers.length}</span></span>}*/}
{/*        </li>*/}
{/*    })}*/}
{/*</ul>*/}

{/* {selectedCategory && <Collapse accordion>
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
</Collapse>} */}

{!selectedCategory && <h1 className={'text-center text-xl uppercase tracking-wider text-blue-500'}>Select a category to get started</h1>}
{/*{questions && <p>{JSON.stringify(questions)}</p>}*/}
</div>
</div>
</>
);
}

export default App;
