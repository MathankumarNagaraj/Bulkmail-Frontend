import {  useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";



function App() {

const [msg,setmsg] = useState("")
const [status,setstatus] = useState(false)
const [emailList,setemailList] = useState([])

function handlemsg(event)
{
  setmsg(event.target.value)
}

function handlefile(event)
{
  const file =event.target.files[0]
  
  console.log(file)

  const reader = new FileReader()

  reader.onload =function (event) {
    const data = event.target.result;
      const workbook = XLSX.read(data, {type: 'array'})
      const SheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[SheetName]
      const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
      const totalemail =emailList.map(function(item){return item.A})
      console.log(totalemail)
      setemailList(totalemail)

  }

  reader.readAsArrayBuffer(file);
}

function send() {
  setstatus(true);

  axios.post("https://bulkmail-backend-1-x9gu.onrender.com/sendemail", { msg: msg, emailList: emailList })
    .then(function(response) {
   console.log("Response:", response);
      console.log("Response Data:", response.data);

      if (response.data === true) {
        alert("Email sent successfully");
      } else {
        alert("Failed to send email");
      }
    })
    .catch(function(error) {
      console.error("Error:", error);
      alert("An error occurred while sending the email");
    })
    .finally(function() {
      setstatus(false);
     });
}

  return (
    <div>
      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1>

      </div>

      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">We can help your business with sending multiple emails at once</h1>

      </div>

      
      <div className="bg-blue-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">Drag and Drop</h1>

      </div>
      
      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea onChange={handlemsg} value={msg} className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md" placeholder="Enter the Email text..."></textarea>
      
        <div>
        <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5 mb-5"/>
       
        
      </div>
      <p>Total Emails in the file: {emailList.length}</p>

    

      
      
      <button onClick={send} className="bg-blue-950 mt-2 py-2 px-2 text-white font-medium rounded-md w-fit">{status?"Sending...":"send"}</button>
       
      </div>

      <div className="bg-blue-300 text-white text-center p-8 ">
      

      </div>

      <div className="bg-blue-200 text-white text-center p-8">
       

      </div>



    </div>
  );
}

export default App;
