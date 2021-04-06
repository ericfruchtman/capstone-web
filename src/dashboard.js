import './App.css';
import React, {useEffect, useState} from "react";
import {Button, List, Collapse, notification} from 'antd';

const { Panel } = Collapse;

function Dashboard(props) {
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [questions, setQuestions]= useState([]);
  const [selectedQuestion, setSelectedQuestion]= useState();
  const [questionTxt, setQuestionTxt]= useState('');
  const [answers, setAnswers]= useState([]);
  const [answerTxt, setAnswerTxt]= useState('');
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();


  let apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const fetchCategories = async () => {
    let res = await fetch(`${apiUrl}/api/v1/categories?token=${localStorage.getItem('token')}`);
    let data = await res.json();
    console.log(data);
    setCategories(data);
  };

  const fetchUserId = async () => {
    let res = await fetch(`${apiUrl}/api/v1/users/me?token=${localStorage.getItem('token')}`);
    let user = await res.json();
    console.log("The current user is",user.userId);
    setUserId(user.userId)
  }
  
const fetchQuestionsForCategory = async () => {
  console.log(selectedCategory);
  if (selectedCategory){
    let res = await fetch (`${apiUrl}/api/v1/categories/${selectedCategory}/questions?token=${token}`);
    let data = await res.json();
    console.log(data);
    setQuestions(data.reverse()); 
}
}


const fetchAnswers = async (questionId) => {
  console.log(questionId);
  if (questionId) {
    let res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${questionId}/answers?token=${token}`);
    let data = await res.json();
    console.log(data);
    setAnswers(data.reverse());
  }
}


/* Make Post request to create a question */
const createNewQuestion = async () => {
  console.log(selectedCategory);
  if(questionTxt === ''){
    notification['error']({
      message:'Alert',
      description:
      `You forgot to type in a question!`,
    })
  }

  if(selectedCategory && questionTxt !== ''){
    let questionBody = { 
      questionTxt: questionTxt,
      userId: userId
    }

    let options = {
      method: 'POST',
      body: JSON.stringify(questionBody),
      headers: {}
    };
    options.headers["Accept"] = "application/json, text/plain, */*";
    options.headers["Content-Type"] = "application/json;charset=utf-8";
    console.log(options);
    
    const res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions?token=${token}`, options);
    let data = await res.json();
    console.log(data);
    fetchQuestionsForCategory();
    setQuestionTxt('');
    notification['success']({
      message:'Thank you',
      description:
      `Your question has been successfully posted!`,
    })
  } 
}

const createANewAnswer = async (questionId) => {
  console.log(selectedQuestion);
  if(answerTxt === ''){
    notification['error']({
      message:'Alert',
      description:
      `Type in your answer first!`,
    })
  }

  if(questionId && answerTxt !== ''){
    let answerBody = { answerTxt: answerTxt }

    let options = {
      method: 'POST',
      body: JSON.stringify(answerBody),
      headers: {}
    };
    options.headers["Accept"] = "application/json, text/plain, */*";
    options.headers["Content-Type"] = "application/json;charset=utf-8";
    console.log(options);

    const res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${questionId}/answers?token=${token}`, options);
    let data = await res.json();
    console.log(data);
    fetchAnswers(questionId);
    fetchQuestionsForCategory();
    setAnswerTxt('');
    notification['success']({
      message:'Thank you',
      description:
      `Your answer was successfully posted!`,
    }) 
  }
}

const deleteSelectedQuestion = async (questionId) => {
  console.log(selectedCategory);
  console.log(questionId);
  await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${questionId}?token=${token}&userId=${userId}`, 
  {method: 'DELETE'});
  fetchQuestionsForCategory();
  notification['success']({
    message:'Deleted',
    description:
    `Your question has been successfully deleted!`,
  })
}

const isLoggedIn = () => {
    if(localStorage.getItem('token')){
      setToken(localStorage.getItem('token'));
      return true;
    } else{
      return false;
    }
  }

  const logOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

function callback(questionId) {
  console.log(questionId);
  fetchAnswers(questionId);
}

useEffect(() => {
    if(isLoggedIn()){
      fetchUserId();
      fetchCategories();
    } else{
      window.location.href = '/'
    }
  }, [])

useEffect(() => {
  fetchQuestionsForCategory();
}, [selectedCategory])

useEffect(() => {
  fetchAnswers();
}, [selectedQuestion])

  return (
    <>
    <div className={"grid grid-cols-12 items-center border from-green-400 bg-gray-50 bg-opacity-100"}>
      <div className={"col-span-8 md:col-span-9 lg:col-span-10 xl:col-span-8 p-2 mt-2"}>
        <h1 className={'text-center text-blue-900 text-3xl tracking-wider text-opacity-80 subpixel-antialiased'}>Custom Quiz Builder</h1>
      </div>
      <div className={"col-span-4 md:col-span-3 lg:col-span-2 xl:col-start-11"}>
        <Button type={'danger'} className={"cursor-pointer"} onClick={logOut}>Log Out</Button>
      </div>
    </div>
    <div className="grid grid-cols-12">
              {/* Sidebar */}
        <div className={"col-span-full md:col-span-3 lg:col-span-2 border p-4"}>
          <ul>
            {categories.map((category, index) => {
              return <li key={index} className={category.id === selectedCategory ? 
                "rounded border my-2 p-4 cursor-pointer bg-blue-800 text-white font-bold" : "rounded border my-2 p-4 cursor-pointer"} 
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
            {/* Question Input Bar */}
            <div className={"grid grid-cols-12 gap-4"}>
              {selectedCategory && <input value={questionTxt} onChange={(event) => {
                setQuestionTxt(event.currentTarget.value);
                }} type="text" placeholder="Type question here" className={'col-span-full md:col-span-9 lg:col-span-10 border w-full rounded border-gray-300 p-2'}/>}
                {selectedCategory && <Button type={'primary'} className={'col-span-full md:col-span-3 lg:col-span-2 bg-green-600 cursor-pointer rounded text-center text-white text-xl md:text-lg p-2'} onClick={createNewQuestion}>Add Question</Button>}
            </div>
            <br/>            
            
            {/* Responses & Answer Input Bar */}
        {selectedCategory && <Collapse onChange={callback} accordion>
          {questions && questions.map((question, index) => {
            return <Panel key={question.id} header={<div className={"grid grid-cols-12 gap-2"}>
              <div className={"col-span-8 md:col-span-10 xl:col-span-11"}>
                <span>{question.questionTxt}</span>
                <br/>
                {question.Answers.length < 1 && <span> - Click to add an answer</span>}
                {question.Answers.length == 1 && <span> 
                  &nbsp;- {question.Answers.length} possible answer
                </span>}
                {question.Answers.length > 1 && <span> 
                  &nbsp;- {question.Answers.length} possible answers
                </span>}
              </div>
              {props.userId == question.userId && <span className={"col-span-4 md:col-span-2 xl:col-span-1"}>
                <Button type={"danger"} onClick={() => {deleteSelectedQuestion(question.id);}}>
                  Delete
                </Button>
              </span>}
            </div>}>
              <List
              size="small"
              header={<div className={'font-bold'}>Answer List</div>}
              footer={<div className={"grid grid-cols-12 gap-4"}>
                <input value={answerTxt} onChange={(event) => {
                  setAnswerTxt(event.currentTarget.value);
                  }} type="text" placeholder="Type answer here" className={'border rounded p-1 col-span-full md:col-span-9 lg:col-span-10'}/>
                <Button type={'primary'} className={"col-start-4 col-span-6 md:col-span-3 lg:col-span-2 cursor-pointer"}
                  onClick={() => {createANewAnswer(question.id);}}>
                    Add Answer
                </Button>
              </div>}
              bordered
              dataSource={answers}
              renderItem={answers => <List.Item>
                <div>
                  {answers.answerTxt}
                </div>

              </List.Item>}
              />
            </Panel>})}

        </Collapse>}
        
        {!selectedCategory && <h1 className={'text-center text-xl uppercase tracking-wider text-blue-500'}>Select a Category to get started</h1>}

      </ul>
    </div>
    </div>
  </>
  );
  }

export default Dashboard;
