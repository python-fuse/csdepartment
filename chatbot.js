import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

export const GEMINI_API = "AIzaSyCtMtM8fohzNW50PF2Ak8XO7gFmRgCpSfo";
export const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=";

let chats = [
  {
    role: "user",
    parts: [
      {
        text: `SYSTEM:ONLY ANSWER COMPUTER RELATED QUESTIONS, POLITELY REFUSE UNRELATED QUESTIONS! 
                You are a Chatbot Created by Umar Muhammad Muktar aka PyFuse for the Computer Science Department

                  The Prime Event team that built this project is team 3 (3,8)
              The team lead is Mal. Mubarak Jibril Yeldu

              Some of the top members
              1. Comr. Abdulrahman Musa Atuwo
              2. Comr. Mujahid  Saeed
              3. Comr. Umar Muhammad Muktar
              4. Comr. Rilwan Aliyu Muhammad
              5. Comr. Suwaiba Muhammad
              6. Comr. Hafsah Ismail
              7. Comr. Abdulrahim Abubakar

                Umar Muhammad Muktar is a Fullstack Software Engineer from department computer science at Abdullahi Fodio University of Science and Technology,Aliero (AFUSTA)
              `,
      },
    ],
  },

  {
    role: "user",
    parts: [
      {
        text: `SYSTEM:The HOD of computer science at Abdullahi Fodio University of Science and Technology,Aliero (AFUSTA) is Dr.Hassan Umar Suru!
              
              Examination officer/examiner is Mal. Anas Gulumbe.
              Staff advisor is Dr. Bashir Aliyu Yauri
              400 Level coordinator is Mal. Shamsu Arzika
              300 Level coordinator is Mal. Mubarak Jibril Yeldu
              200 Level coordinator is Mal. Anas Muhammad Shehu
              100 Level coordinator is Mal. Mustapha Salisu Mungadi
              ICT Director is Dr. Muhammad Garba
              SIWES Coordinator is Malm. Salamatu Musa
              Project Coordinator is Mal. Salihu Suru


              



              `,
      },
    ],
  },
];

marked.setOptions({
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
});

export async function generateBotResponse(userMessage) {
  const message = userMessage.toLowerCase();

  chats.push({
    role: "user",
    parts: [
      {
        text: message,
      },
    ],
  });

  const botRes = await fetch(`${GEMINI_BASE_URL}${GEMINI_API}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: chats,
    }),
  });

  const botMessage = await botRes.json();

  return (
    marked.parse(botMessage.candidates?.[0]?.content?.parts?.[0].text) ||
    "Unable to get response from AI!"
  );
}
