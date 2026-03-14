import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   STORAGE HELPERS  (window.storage – persistent key-value)
═══════════════════════════════════════════════════════ */
async function getUsers() {
  try { const r = await window.storage.get("ct:users"); return r ? JSON.parse(r.value) : {}; }
  catch { return {}; }
}
async function saveUsers(u) {
  try { await window.storage.set("ct:users", JSON.stringify(u)); } catch {}
}
async function getUserData(username) {
  try { const r = await window.storage.get(`ct:data:${username}`); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function saveUserData(username, data) {
  try { await window.storage.set(`ct:data:${username}`, JSON.stringify(data)); } catch {}
}

/* ═══════════════════════════════════════════════════════
   LESSON DATA
═══════════════════════════════════════════════════════ */
const CHARS = [
  { id:"python", emoji:"🐍", name:"Pyto",  lang:"Python",   color:"#3b82f6", badge:"🔥 Popular" },
  { id:"cp", emoji:"⚡", name:"Capri", lang:"C++",       color:"#10b981", badge:null },
  { id:"c",  emoji:"🔧", name:"Cerro", lang:"C",         color:"#f59e0b", badge:null },
  { id:"java", emoji:"☕", name:"Java",  lang:"Java",      color:"#ef4444", badge:"🆕 New" },
  { id:"datastructure", emoji:"📊", name:"Datsy", lang:"Data Sci",  color:"#8b5cf6", badge:null },
];

const LESSONS = {
  py:{emoji:"🐍",name:"Pyto",color:"#3b82f6",lang:"Python",units:[
    {title:"Hello Python!",steps:[
      {text:"Hey! I'm Pyto 🐍 your Python buddy! Python is one of the easiest — and most popular — languages in the world!",mood:"excited"},
      {text:'The first command: print() — it makes the computer show a message. Like texting the computer! 📱',mood:"normal"},
      {text:'Try it: print("Hello, World!") — the "quotes" tell Python this is TEXT, not a command.',mood:"thinking"},
      {text:"Add comments with # — Python ignores these lines. They're notes just for humans! 💡",mood:"normal"},
      {text:"That's lesson 1! You learned Python's most important command. Now try the Code tab! 🚀",mood:"excited"},
    ],
    code:'# Pyto says: Try changing my messages!\nprint("Hello, World! 🌍")\nprint("My name is Pyto 🐍")\nprint("I love coding!")\n',
    quiz:[
      {q:'Which is correct to print "Python"?',opts:['print(Python)','print("Python")','Print("Python")','show("Python")'],ans:1,ex:'✅ print() lowercase, text must be in "quotes"!'},
      {q:'What do the quotes " " do in print("Hello")?',opts:['Make it louder','Tell Python this is text','Just decoration','Nothing'],ans:1,ex:'✅ Quotes mark a string — they tell Python "this is text, not a command"!'},
      {q:'What appears when you run print("Hi")?',opts:['print("Hi")','("Hi")','Hi','Nothing'],ans:2,ex:'✅ print() shows what\'s inside the quotes — just Hi appears!'},
      {q:'How do you write a comment in Python?',opts:['// note','/* note */','# note','-- note'],ans:2,ex:'✅ In Python, # makes a comment — Python ignores that line!'},
    ],
    hw:[
      {level:'easy',icon:'🌟',title:'Say Your Name!',xp:10,desc:'Print your name, age, and favourite colour on separate lines.',starter:'print("My name is ___")\nprint("I am ___ years old")\nprint("My favourite colour is ___")',hint:'Each print() shows one line. Replace ___ with your real info!'},
      {level:'medium',icon:'🔥',title:"Pyto's Adventure",xp:25,desc:'Write a 6-line story about Pyto using print(). Be creative!',starter:'print("Once upon a time, Pyto the Python...")',hint:'Write 6 print() statements, each one a sentence of the story.'},
      {level:'hard',icon:'💎',title:'Star Triangle',xp:40,desc:'Print a triangle: Row1:*, Row2:**, Row3:***, Row4:****, Row5:*****',starter:'print("*")\n# Now do rows 2 to 5!\n',hint:'print("*"), print("**") etc. or: for i in range(1,6): print("*"*i)'},
    ]},
    {title:"Variables",steps:[
      {text:"Today: variables! 📦 Imagine a box with a label 'score'. You put a number inside. That's a variable!",mood:"excited"},
      {text:'In Python: name = "Pyto" — name on the left, equals sign, value on the right. That\'s it!',mood:"normal"},
      {text:"4 types: whole numbers like 42, decimals like 3.14, text like \"hello\", and True/False booleans!",mood:"excited"},
      {text:"Use the variable later: print(score) — Python opens the 'score' box and shows what's inside! 😎",mood:"thinking"},
    ],
    code:'hero   = "Pyto"\nlives  = 3\nscore  = 0\nprint("Hero:", hero)\nprint("Lives:", lives)\nprint("Score:", score)\n',
    quiz:[
      {q:'What is a variable?',opts:['A type of loop','A labelled box storing data','A print command','A type of number'],ans:1,ex:'✅ A variable is like a labelled box — it stores a value!'},
      {q:"Which correctly stores 10 in 'score'?",opts:['score == 10','score: 10','score = 10','int score = 10'],ans:2,ex:'✅ In Python: variable_name = value. Simple!'},
      {q:'name = "Pyto" then print(name). What shows?',opts:['"Pyto"','name','Pyto','Nothing'],ans:2,ex:'✅ print(name) shows Pyto — no quotes!'},
      {q:'What type is True in Python?',opts:['str','int','float','bool'],ans:3,ex:'✅ True and False are booleans — yes/no answers!'},
    ],
    hw:[
      {level:'easy',icon:'🌟',title:'My Info Box',xp:10,desc:'Create 4 variables: name, age, food, like_coding. Print them all.',starter:'name = "___"\nage  = ___\nfood = "___"\nlike_coding = ___\n',hint:'name = "Rohan", age = 14, food = "Pizza", like_coding = True'},
      {level:'medium',icon:'🔥',title:'Score Tracker',xp:25,desc:'Start score=0. Add 10 (coin), add 25 (boss), subtract 5 (lost life). Print after each.',starter:'score = 0\nprint("Start:", score)\n# Collect a coin (+10)\n# Defeat boss (+25)\n# Lose a life (-5)\n',hint:'score = score + 10 then print("After coin:", score)'},
      {level:'hard',icon:'💎',title:'Variable Swap',xp:40,desc:'Create a=10, b=20. Swap their values using a temp variable.',starter:'a = 10\nb = 20\nprint("Before:", a, b)\ntemp = ___\na = ___\nb = ___\nprint("After:", a, b)',hint:'temp=a, then a=b, then b=temp!'},
    ]},
    {title:"Loops",steps:[
      {text:"Today: LOOPS! 🔄 Imagine writing 'I love Python' 100 times. That's what loops automate!",mood:"excited"},
      {text:"The for loop: for i in range(5): — runs the code 5 times, counting 0 to 4!",mood:"normal"},
      {text:"The while loop keeps going as long as something is TRUE. while lives > 0: — stops when False!",mood:"thinking"},
      {text:"Key rule: indent with 4 spaces inside a loop. Python uses this to know what repeats! 😮",mood:"excited"},
    ],
    code:'for i in range(1, 6):\n    print("Count:", i)\n\nprint("---")\n\nfor i in range(0, 11, 2):\n    print("Even:", i)\n',
    quiz:[
      {q:'How many times does range(3) loop?',opts:['2','3','4','0'],ans:1,ex:'✅ range(3) gives 0,1,2 — three numbers, runs 3 times!'},
      {q:'Which loop checks a condition each time?',opts:['for loop','while loop','print loop','repeat loop'],ans:1,ex:'✅ while loop keeps going as long as its condition is True!'},
      {q:'What does range(1, 6) give?',opts:['1,2,3,4,5,6','0,1,2,3,4,5','1,2,3,4,5','1,2,3,4,5,6,7'],ans:2,ex:'✅ range(1,6) gives 1,2,3,4,5 — stops BEFORE 6!'},
      {q:'Why indent inside a loop?',opts:['Look nice','Python uses it to know what\'s inside','Runs faster','Optional'],ans:1,ex:'✅ Python REQUIRES indentation — it defines the loop body!'},
    ],
    hw:[
      {level:'easy',icon:'🌟',title:'Countdown Rocket!',xp:10,desc:'Use while to count down from 10 to 1, then print "🚀 Blast Off!"',starter:'count = 10\nwhile count > 0:\n    print(count)\n    count = count - 1\nprint("🚀 Blast Off!")',hint:'Loop condition: count > 0. Inside: print(count) then count = count - 1'},
      {level:'medium',icon:'🔥',title:'Times Table',xp:25,desc:'Pick any number. Use for to print its times table 1× to 12×.',starter:'num = 7\nfor i in range(1, 13):\n    result = num * i\n    print(i, "x", num, "=", result)\n',hint:'result = num * i, then print(i, "x", num, "=", result)'},
      {level:'hard',icon:'💎',title:'Star Pyramid',xp:45,desc:'Use a loop. Row 1: 1 star, Row 2: 2 stars, up to Row 5.',starter:'for i in range(1, 6):\n    print("*" * i)\n',hint:'print("*" * i) prints i stars! So i=3 gives ***'},
    ]},
  ]},
  cp:{emoji:"⚡",name:"Capri",color:"#10b981",lang:"C++",units:[
    {title:"Hello C++!",steps:[
      {text:"Hi! I'm Capri ⚡ C++ teacher! Games like Fortnite and GTA are built with C++!",mood:"excited"},
      {text:"C++ needs #include <iostream> for print tools, and int main(){} — the front door!",mood:"normal"},
      {text:'cout << "Hello!"; — cout means "console output". The << arrows push your message out! 📺',mood:"thinking"},
      {text:"Every line ends with ; — like a full stop. Forget it and your program won't compile! 😅",mood:"normal"},
    ],
    code:'#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    cout << "I am Capri ⚡" << endl;\n    return 0;\n}\n',
    quiz:[
      {q:'Which header do you need for cout?',opts:['<stdio.h>','<iostream>','<string>','<print>'],ans:1,ex:'✅ #include <iostream> gives you cout and cin!'},
      {q:'What does cout stand for?',opts:['computer out','console output','code output','C output'],ans:1,ex:'✅ cout = console output — sends text to screen!'},
      {q:'Every C++ statement ends with...',opts:['period .','colon :','semicolon ;','Nothing'],ans:2,ex:'✅ The semicolon ; ends every C++ statement!'},
      {q:'Where does a C++ program start?',opts:['Top of file','In main()','At #include','Anywhere'],ans:1,ex:'✅ int main() is the entry point!'},
    ],
    hw:[
      {level:'easy',icon:'🌟',title:"Capri's Intro",xp:10,desc:'Print your name, age, and favourite language in C++.',starter:'#include <iostream>\nusing namespace std;\nint main() {\n    cout << "My name is ___" << endl;\n    cout << "I am ___ years old" << endl;\n    return 0;\n}',hint:'Replace ___ with your info. Each cout << "..." << endl; shows one line.'},
      {level:'medium',icon:'🔥',title:'Bio Card',xp:25,desc:'Create a formatted bio card using cout with * borders.',starter:'#include <iostream>\nusing namespace std;\nint main() {\n    cout << "***************" << endl;\n    cout << "* Name: ___   *" << endl;\n    cout << "***************" << endl;\n    return 0;\n}',hint:'Each line is a cout. Make borders with ** and fill in your info!'},
      {level:'hard',icon:'💎',title:'C++ Variables',xp:40,desc:'Declare int, double, and string variables. Print them in sentences.',starter:'#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    int age = ___;\n    double gpa = ___;\n    string name = "___";\n    cout << name << " is " << age << endl;\n    return 0;\n}',hint:'int for whole numbers, double for decimals, string for text.'},
    ]},
  ]},
  c:{emoji:"🔧",name:"Cerro",color:"#f59e0b",lang:"C",units:[
    {title:"Hello in C",steps:[
      {text:"I'm Cerro 🔧 teaching you C — the father of ALL programming languages!",mood:"excited"},
      {text:"C needs #include <stdio.h> for print tools, and int main() — the front door! 🚪",mood:"normal"},
      {text:"printf() prints text. \\n means new line — invisible but moves to next line! 📄",mood:"thinking"},
      {text:"return 0; at the end means: job done successfully! 👍",mood:"normal"},
    ],
    code:'#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    printf("Cerro is here!\\n");\n    return 0;\n}\n',
    quiz:[
      {q:'What does #include <stdio.h> do?',opts:['Start program','Gives printf access','End program','Declares a variable'],ans:1,ex:'✅ <stdio.h> gives you printf, scanf and more!'},
      {q:'What does \\n do inside printf?',opts:['Prints letter n','Creates a new line','Ends the program','Nothing'],ans:1,ex:'✅ \\n is the newline escape character!'},
      {q:'What does return 0; mean?',opts:['Return number 0','Program finished OK','Skip to 0','Nothing'],ans:1,ex:'✅ return 0 tells the OS the program ended successfully!'},
      {q:'Comments in C are written as...',opts:['// only','# comment','/* comment */','Both // and /* */'],ans:3,ex:'✅ C supports both // and /* */ comments!'},
    ],
    hw:[
      {level:'easy',icon:'🌟',title:'C Introduction',xp:10,desc:'Print your name, age, and city — each on a separate line.',starter:'#include <stdio.h>\nint main() {\n    printf("My name is ___\\n");\n    printf("I am ___ years old\\n");\n    return 0;\n}',hint:"Replace ___ with your info. Don't forget \\n at end of each string!"},
      {level:'medium',icon:'🔥',title:'Rectangle of Stars',xp:25,desc:'Print a 4×8 rectangle of asterisks using printf.',starter:'#include <stdio.h>\nint main() {\n    printf("********\\n");\n    // Add 3 more rows!\n    return 0;\n}',hint:'Write 4 printf("********\\n"); statements!'},
      {level:'hard',icon:'💎',title:'C Variables',xp:40,desc:'Declare int, float, char variables and print with %d, %f, %c.',starter:'#include <stdio.h>\nint main() {\n    int age = ___;\n    float gpa = ___;\n    char grade = \'___\';\n    printf("Age: %d\\n", age);\n    return 0;\n}',hint:'%d for int, %.1f for float, %c for char.'},
    ]},
  ]},
  jv:{emoji:"☕",name:"Java",color:"#ef4444",lang:"Java",units:[
    {title:"Hello Java!",steps:[
      {text:"I'm Java the Coffee Cat ☕ Java runs on phones, browsers, smart TVs — 'Write once, run anywhere'! 🦸",mood:"excited"},
      {text:"Java programs live inside a class. main() is where everything starts!",mood:"normal"},
      {text:'System.out.println("Hello!"); is Java\'s print command. Tip: type sout + Tab in most editors! ⌨️',mood:"thinking"},
      {text:"Java is strongly typed — you MUST say int, String, boolean when making variables. No shortcuts! 💪",mood:"normal"},
    ],
    code:'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        System.out.println("Java Cat says hi! ☕");\n    }\n}\n',
    quiz:[
      {q:'Entry point of a Java program?',opts:['class Main','void start()','public static void main','System.out.println'],ans:2,ex:'✅ public static void main(String[] args) is where Java begins!'},
      {q:'How do you print in Java?',opts:['print("Hi")','cout << "Hi"','System.out.println("Hi")','printf("Hi")'],ans:2,ex:'✅ System.out.println() is the Java print statement!'},
      {q:'What type stores text in Java?',opts:['str','text','String','char[]'],ans:2,ex:'✅ String (capital S!) stores text in Java.'},
      {q:'Java files must be saved as...',opts:['file.java','Main.txt','program.jav','code.class'],ans:0,ex:'✅ Java files saved as ClassName.java!'},
    ],
    hw:[
      {level:'easy',icon:'🌟',title:'Java Greeting',xp:10,desc:'Print your name, age, and favourite drink in Java.',starter:'public class Main {\n    public static void main(String[] args) {\n        System.out.println("My name is ___");\n        System.out.println("I am ___ years old");\n    }\n}',hint:'Replace each ___ with your info.'},
      {level:'medium',icon:'🔥',title:'Variable Card',xp:25,desc:'Declare String, int, boolean variables and print with labels.',starter:'public class Main {\n    public static void main(String[] args) {\n        String name = "___";\n        int age = ___;\n        boolean likesJava = ___;\n        System.out.println("Name: " + name);\n    }\n}',hint:'Use + to join text with variables: "Name: " + name'},
      {level:'hard',icon:'💎',title:'Simple Calculator',xp:45,desc:'Declare two ints. Print their sum, difference, product, quotient.',starter:'public class Main {\n    public static void main(String[] args) {\n        int a = 20;\n        int b = 4;\n        System.out.println("Sum: " + (a + b));\n        // Add -, *, /\n    }\n}',hint:'Sum: a+b, Difference: a-b, Product: a*b, Division: a/b'},
    ]},
  ]},
  ds:{emoji:"📊",name:"Datsy",color:"#8b5cf6",lang:"Python",units:[
    {title:"What is Data Science?",steps:[
      {text:"Hey! I'm Datsy 📊 Data Science turns raw numbers into stories and decisions — like being a detective with data! 🔍",mood:"excited"},
      {text:"Every day billions of data points are created — Netflix history, phone steps, weather data. We make sense of it!",mood:"normal"},
      {text:"Main tool: Python! Plus libraries: NumPy for numbers, Pandas for tables, Matplotlib for charts 📈",mood:"thinking"},
      {text:"Workflow: Collect → Clean → Explore → Model → Present. Most work is CLEANING messy data! 🧹",mood:"normal"},
    ],
    code:'import statistics\n\nscores = [85, 92, 78, 95, 88, 72, 96, 84]\nprint("Scores:", scores)\nprint("Average:", statistics.mean(scores))\nprint("Highest:", max(scores))\nprint("Lowest:", min(scores))\n',
    quiz:[
      {q:'What does a data scientist mainly do?',opts:['Design websites','Analyse data to find insights','Write device drivers','Only design databases'],ans:1,ex:'✅ Data scientists collect, clean, analyse and communicate findings!'},
      {q:'Which library makes charts?',opts:['NumPy','Pandas','Matplotlib','Statistics'],ans:2,ex:'✅ Matplotlib is the go-to library for charts!'},
      {q:'First step in data science workflow?',opts:['Model','Present','Clean','Collect'],ans:3,ex:'✅ You must first Collect data before anything else!'},
      {q:'Which function finds the highest value?',opts:['highest()','top()','max()','peak()'],ans:2,ex:'✅ max() returns the largest value in a list!'},
    ],
    hw:[
      {level:'easy',icon:'🌟',title:'Class Statistics',xp:10,desc:'Create a list of 6 test scores. Calculate average, max, min.',starter:'import statistics\n\nscores = [___, ___, ___, ___, ___, ___]\nprint("Average:", statistics.mean(scores))\nprint("Max:", max(scores))\nprint("Min:", min(scores))\n',hint:'Fill in 6 numbers between 0-100!'},
      {level:'medium',icon:'🔥',title:'Frequency Count',xp:25,desc:'Create a list of fruits. Count how many times each fruit appears.',starter:'fruits = ["apple","banana","apple","orange","banana","apple"]\napple_count = fruits.count("apple")\nprint("Apple:", apple_count)\n# Count banana and orange too!\n',hint:'Use list.count("item") to count occurrences.'},
      {level:'hard',icon:'💎',title:'Grade Classifier',xp:45,desc:'Loop through scores and print each with its grade (A:90+, B:80+, C:70+, F:below70).',starter:'scores = [95, 82, 67, 74, 91, 58, 88]\nfor score in scores:\n    if score >= 90:\n        grade = "A"\n    # Add elif for B, C and else for F\n    print(score, "->", grade)\n',hint:'if score >= 90: grade="A" elif score >= 80: grade="B" etc.'},
    ]},
  ]},
};

/* ═══════════════════════════════════════════════════════
   CODE SIMULATOR
═══════════════════════════════════════════════════════ */
function runCode(lang, code) {
  const lines = [];
  if (lang === "Python" || lang === "Data Sci") {
    const re = /print\s*\(([^)]+)\)/g; let m;
    while ((m = re.exec(code)) !== null) {
      let arg = m[1].trim();
      if ((arg.startsWith('"')&&arg.endsWith('"'))||(arg.startsWith("'")&&arg.endsWith("'")))
        lines.push(arg.slice(1,-1));
      else if (arg.includes(','))
        lines.push(arg.replace(/["']/g,'').replace(/,\s*/g,' '));
      else lines.push('[variable: '+arg+']');
    }
  } else {
    const re = /(?:cout\s*<<\s*|printf\s*\(\s*|println\s*\(\s*|System\.out\.println\s*\(\s*)["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(code)) !== null) lines.push(m[1].replace(/\\n/g,'').replace(/\\t/g,'  '));
  }
  return lines;
}

/* ═══════════════════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════════════════ */
function Confetti({ show }) {
  if (!show) return null;
  const cols = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#3b82f6','#ec4899'];
  const pieces = Array.from({length:45},(_,i)=>({
    id:i, left:Math.random()*100, color:cols[Math.floor(Math.random()*cols.length)],
    size:6+Math.random()*8, delay:Math.random()*1.2, dur:2+Math.random()*1.5,
  }));
  return (
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:9999,overflow:'hidden'}}>
      {pieces.map(p=>(
        <div key={p.id} style={{
          position:'absolute',left:`${p.left}%`,top:-12,
          width:p.size,height:p.size,background:p.color,borderRadius:2,
          animation:`cfall ${p.dur}s ease-in forwards`,animationDelay:`${p.delay}s`,
        }}/>
      ))}
      <style>{`@keyframes cfall{from{transform:translateY(-30px) rotate(0);opacity:1}to{transform:translateY(110vh) rotate(540deg);opacity:0}}`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AUTH SCREEN
═══════════════════════════════════════════════════════ */
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login'); // login | register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = async () => {
    setError(''); setLoading(true);
    const u = username.trim().toLowerCase();
    const p = password.trim();
    if (!u || !p) { setError('Please fill in all fields.'); setLoading(false); return; }
    if (u.length < 3) { setError('Username must be at least 3 characters.'); setLoading(false); return; }
    if (p.length < 4) { setError('Password must be at least 4 characters.'); setLoading(false); return; }

    const users = await getUsers();

    if (mode === 'register') {
      if (confirm !== p) { setError('Passwords do not match.'); setLoading(false); return; }
      if (users[u]) { setError('Username already taken. Try another!'); setLoading(false); return; }
      users[u] = { password: btoa(p), created: Date.now() };
      await saveUsers(users);
      const initData = { xp:0, streak:1, lastLogin: Date.now(), progress:{} };
      await saveUserData(u, initData);
      onLogin(u, initData);
    } else {
      if (!users[u]) { setError('Username not found. Register first!'); setLoading(false); return; }
      if (atob(users[u].password) !== p) { setError('Wrong password. Try again!'); setLoading(false); return; }
      let data = await getUserData(u);
      if (!data) data = { xp:0, streak:1, lastLogin:Date.now(), progress:{} };
      // streak logic
      const dayMs = 86400000;
      const now = Date.now();
      const last = data.lastLogin || 0;
      if (now - last > dayMs * 2) data.streak = 1;
      else if (now - last > dayMs) data.streak = (data.streak||1) + 1;
      data.lastLogin = now;
      await saveUserData(u, data);
      onLogin(u, data);
    }
    setLoading(false);
  };

  const inp = {
    width:'100%', padding:'13px 16px', borderRadius:12, border:'2px solid #e2e8f0',
    fontSize:'1rem', fontFamily:"'Nunito',sans-serif", outline:'none',
    background:'#f8faff', color:'#1a1f36', boxSizing:'border-box',
  };

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#1e1b4b 0%,#312e81 40%,#4c1d95 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20,fontFamily:"'Nunito',sans-serif"}}>
      <style>{`
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
      `}</style>

      {/* Logo */}
      <div style={{textAlign:'center',marginBottom:32,animation:'fadeIn .6s ease'}}>
        <div style={{fontSize:'4rem',animation:'floatUp 3s ease-in-out infinite'}}>🎨</div>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'2.2rem',background:'linear-gradient(135deg,#a5b4fc,#fbbf24)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginTop:8}}>
          CodeToons
        </div>
        <div style={{color:'#a5b4fc',fontSize:'.88rem',marginTop:4,fontWeight:700}}>
          Learn coding with cartoon friends! 🚀
        </div>
      </div>

      {/* Card */}
      <div style={{background:'#fff',borderRadius:24,padding:'28px 24px',width:'100%',maxWidth:380,boxShadow:'0 24px 60px rgba(0,0,0,.35)',animation:'fadeIn .8s ease .1s both'}}>
        {/* Toggle */}
        <div style={{display:'flex',background:'#f0f4ff',borderRadius:50,padding:4,marginBottom:24}}>
          {['login','register'].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setError('');}} style={{
              flex:1,padding:'9px 0',borderRadius:50,border:'none',cursor:'pointer',
              fontWeight:800,fontSize:'.85rem',transition:'all .2s',
              background:mode===m?'#6366f1':'transparent',
              color:mode===m?'#fff':'#64748b',
              boxShadow:mode===m?'0 2px 8px rgba(99,102,241,.4)':'none',
            }}>
              {m==='login'?'🔑 Sign In':'✨ Register'}
            </button>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {/* Username */}
          <div>
            <label style={{fontSize:'.75rem',fontWeight:800,color:'#64748b',textTransform:'uppercase',letterSpacing:'.05em',display:'block',marginBottom:5}}>Username</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="your_username"
              style={inp} onKeyDown={e=>e.key==='Enter'&&handle()}/>
          </div>
          {/* Password */}
          <div>
            <label style={{fontSize:'.75rem',fontWeight:800,color:'#64748b',textTransform:'uppercase',letterSpacing:'.05em',display:'block',marginBottom:5}}>Password</label>
            <div style={{position:'relative'}}>
              <input value={password} onChange={e=>setPassword(e.target.value)} type={showPass?'text':'password'} placeholder="••••••"
                style={{...inp,paddingRight:46}} onKeyDown={e=>e.key==='Enter'&&handle()}/>
              <button onClick={()=>setShowPass(s=>!s)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:'1.1rem'}}>
                {showPass?'🙈':'👁️'}
              </button>
            </div>
          </div>
          {/* Confirm password */}
          {mode==='register' && (
            <div>
              <label style={{fontSize:'.75rem',fontWeight:800,color:'#64748b',textTransform:'uppercase',letterSpacing:'.05em',display:'block',marginBottom:5}}>Confirm Password</label>
              <input value={confirm} onChange={e=>setConfirm(e.target.value)} type={showPass?'text':'password'} placeholder="••••••"
                style={inp} onKeyDown={e=>e.key==='Enter'&&handle()}/>
            </div>
          )}
          {/* Error */}
          {error && (
            <div style={{background:'#fef2f2',border:'2px solid #fecaca',borderRadius:10,padding:'10px 13px',color:'#991b1b',fontWeight:700,fontSize:'.83rem'}}>
              ❌ {error}
            </div>
          )}
          {/* Submit */}
          <button onClick={handle} disabled={loading} style={{
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',
            borderRadius:50,padding:'14px',fontFamily:"'Fredoka One',cursive",fontSize:'1.1rem',
            cursor:loading?'not-allowed':'pointer',boxShadow:'0 4px 18px rgba(99,102,241,.5)',
            opacity:loading?.7:1,transition:'all .2s',marginTop:4,
          }}>
            {loading?'⏳ Please wait...':(mode==='login'?'🚀 Sign In':'🌟 Create Account')}
          </button>
        </div>

        {mode==='register' && (
          <div style={{marginTop:14,background:'#f0fdf4',border:'2px solid #a7f3d0',borderRadius:10,padding:'9px 13px',fontSize:'.75rem',color:'#065f46',fontWeight:700}}>
            ✅ Your progress is saved! Log in from any device with the same username & password.
          </div>
        )}
      </div>

      <div style={{color:'#6366f1',fontSize:'.75rem',marginTop:16,fontWeight:700,opacity:.7}}>
        🔒 Your data is saved securely in this app
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SCENE PANEL
═══════════════════════════════════════════════════════ */
function ScenePanel({ charInfo, stepIdx, steps, onNext }) {
  const step = steps[stepIdx];
  const mood = step?.mood || 'normal';
  const anim = mood==='excited'?'charEx .4s ease-in-out infinite'
             : mood==='thinking'?'charTh 2s ease-in-out infinite'
             : 'charFl 1.8s ease-in-out infinite';
  return (
    <div style={{background:'linear-gradient(180deg,#dbeafe 0%,#bfdbfe 55%,#86efac 55%,#4ade80 100%)',padding:'16px 14px 14px',display:'flex',gap:10,alignItems:'flex-start',position:'relative',minHeight:165,flexShrink:0}}>
      <span style={{position:'absolute',top:8,right:32,fontSize:'1.7rem',animation:'sunP 4s ease-in-out infinite',pointerEvents:'none'}}>☀️</span>
      <span style={{position:'absolute',top:10,left:'38%',fontSize:'1rem',animation:'drft 8s ease-in-out infinite',pointerEvents:'none'}}>☁️</span>
      <span style={{position:'absolute',bottom:28,right:12,fontSize:'1.9rem',pointerEvents:'none'}}>🌳</span>

      <div style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'center',width:78,zIndex:2}}>
        <span style={{fontSize:'3.6rem',animation:anim,display:'block',filter:'drop-shadow(0 4px 8px rgba(0,0,0,.18))',lineHeight:1}}>
          {charInfo.emoji}
        </span>
        <span style={{background:'#fff',borderRadius:50,padding:'2px 9px',fontFamily:"'Fredoka One',cursive",fontSize:'.65rem',marginTop:3,boxShadow:'0 2px 6px rgba(0,0,0,.1)'}}>
          {charInfo.name}
        </span>
      </div>

      <div style={{flex:1,background:'#fff',borderRadius:16,padding:'12px 13px',boxShadow:'0 5px 18px rgba(0,0,0,.1)',border:'3px solid #c7d2fe',position:'relative',zIndex:2,minHeight:65}}>
        <div style={{position:'absolute',left:-17,top:24,borderWidth:9,borderStyle:'solid',borderColor:'transparent #c7d2fe transparent transparent'}}/>
        <div style={{position:'absolute',left:-10,top:27,borderWidth:7,borderStyle:'solid',borderColor:'transparent #fff transparent transparent'}}/>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'.88rem',lineHeight:1.65,color:'#1e1b4b',marginBottom:9}}>
          {step?.text}
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',gap:4}}>
            {steps.map((_,i)=>(
              <span key={i} style={{width:i===stepIdx?16:6,height:6,borderRadius:50,background:i===stepIdx?charInfo.color:'#e2e8f0',transition:'all .2s',display:'inline-block'}}/>
            ))}
          </div>
          <button onClick={onNext} style={{background:`linear-gradient(135deg,${charInfo.color},${charInfo.color}bb)`,color:'#fff',border:'none',borderRadius:50,padding:'6px 14px',fontFamily:"'Fredoka One',cursive",fontSize:'.8rem',cursor:'pointer',boxShadow:'0 3px 10px rgba(0,0,0,.2)'}}>
            {stepIdx<steps.length-1?'Next →':'Got it ✓'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes charFl{0%,100%{transform:rotate(-3deg) translateY(0)}50%{transform:rotate(3deg) translateY(-8px)}}
        @keyframes charEx{0%,100%{transform:scale(1)}25%{transform:scale(1.12) rotate(-5deg)}75%{transform:scale(1.12) rotate(5deg)}}
        @keyframes charTh{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-6px) rotate(2deg)}}
        @keyframes sunP{0%,100%{transform:scale(1) rotate(0)}50%{transform:scale(1.08) rotate(10deg)}}
        @keyframes drft{0%,100%{transform:translateX(0)}50%{transform:translateX(10px)}}
        @keyframes floatAnim{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CODE TAB
═══════════════════════════════════════════════════════ */
function CodeTab({ unit, charInfo }) {
  const [code, setCode] = useState(unit.code);
  const [output, setOutput] = useState([]);
  const handleRun = () => {
    const lines = runCode(charInfo.lang, code);
    setOutput(lines.length===0
      ? [{type:'info',text:`→ ${charInfo.name} says: Looks good! Run in a real IDE for full output.`}]
      : lines.map(l=>({type:'ok',text:'→ '+l}))
    );
  };
  return (
    <div style={{padding:12}}>
      <div style={{background:'#1e1e2e',borderRadius:14,overflow:'hidden',marginBottom:10,border:'2px solid #313244'}}>
        <div style={{background:'#181825',padding:'8px 12px',display:'flex',alignItems:'center',gap:5}}>
          {['#ff5f57','#febc2e','#28c840'].map((c,i)=>(<span key={i} style={{width:9,height:9,borderRadius:'50%',background:c,display:'inline-block'}}/>))}
          <span style={{marginLeft:'auto',fontSize:'.6rem',fontWeight:800,color:'#6c7086',textTransform:'uppercase',letterSpacing:'.07em'}}>{charInfo.lang}</span>
          <button onClick={handleRun} style={{background:'linear-gradient(135deg,#10b981,#059669)',color:'#fff',border:'none',borderRadius:6,padding:'4px 11px',fontWeight:800,fontSize:'.7rem',cursor:'pointer',marginLeft:6}}>▶ Run</button>
          <button onClick={()=>setOutput([])} style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'4px 9px',fontWeight:800,fontSize:'.7rem',cursor:'pointer'}}>✕</button>
        </div>
        <textarea value={code} onChange={e=>setCode(e.target.value)}
          style={{width:'100%',minHeight:190,background:'#1e1e2e',color:'#cdd6f4',fontFamily:"'Courier New',monospace",fontSize:'.8rem',lineHeight:1.8,padding:13,border:'none',outline:'none',resize:'vertical',tabSize:2,boxSizing:'border-box'}}/>
        {output.length>0&&(
          <div style={{background:'#0d1117',padding:'9px 13px',borderTop:'2px solid #313244',maxHeight:120,overflowY:'auto'}}>
            <div style={{fontSize:'.58rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',color:'#30363d',marginBottom:3}}>OUTPUT</div>
            {output.map((l,i)=>(<div key={i} style={{fontFamily:"'Courier New',monospace",fontSize:'.76rem',color:l.type==='ok'?'#39d353':l.type==='err'?'#ff6b6b':'#58a6ff'}}>{l.text}</div>))}
          </div>
        )}
      </div>
      <div style={{background:'#f0fdf4',border:'2px solid #a7f3d0',borderRadius:10,padding:'9px 12px',fontSize:'.75rem',color:'#065f46',fontWeight:700}}>
        💡 Simulator mode — copy code to a real {charInfo.lang} environment for full execution!
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   QUIZ TAB
═══════════════════════════════════════════════════════ */
function QuizTab({ unit, charInfo, onXP, savedAnswers, onSave }) {
  const [answers, setAnswers] = useState(savedAnswers || {});
  const [confetti, setConfetti] = useState(false);
  const finished = Object.keys(answers).length === unit.quiz.length;
  const correctCount = Object.entries(answers).filter(([i,c])=>c===unit.quiz[i]?.ans).length;

  const answer = (qi, chosen) => {
    if (answers[qi] !== undefined) return;
    const newA = {...answers, [qi]:chosen};
    setAnswers(newA);
    onSave(newA);
    if (Object.keys(newA).length === unit.quiz.length) {
      const c = Object.entries(newA).filter(([i,ch])=>ch===unit.quiz[i].ans).length;
      onXP(c*15);
      if (c===unit.quiz.length) { setConfetti(true); setTimeout(()=>setConfetti(false),4000); }
    }
  };

  return (
    <div style={{padding:12}}>
      <Confetti show={confetti}/>
      <div style={{background:'#f5f3ff',borderRadius:14,padding:12,marginBottom:12,border:'2px solid #ddd6fe',display:'flex',gap:10,alignItems:'center'}}>
        <span style={{fontSize:'2.2rem',animation:'floatAnim 2s ease-in-out infinite'}}>{charInfo.emoji}</span>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'.9rem',color:'#4c1d95',lineHeight:1.5}}>
          {unit.quiz.length} questions await! Take your time 💜
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:11}}>
        {unit.quiz.map((q,qi)=>(
          <div key={qi} style={{background:'#fff',border:'2px solid #e2e8f0',borderRadius:14,padding:14}}>
            <div style={{fontSize:'.62rem',fontWeight:800,textTransform:'uppercase',color:'#8b5cf6',marginBottom:4}}>Q{qi+1}</div>
            <div style={{fontWeight:800,fontSize:'.86rem',marginBottom:9,lineHeight:1.5,color:'#1a1f36'}}>{q.q}</div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {q.opts.map((opt,oi)=>{
                const picked = answers[qi];
                const isC = oi===q.ans;
                const isW = picked===oi && oi!==q.ans;
                return (
                  <div key={oi} onClick={()=>answer(qi,oi)} style={{
                    display:'flex',alignItems:'center',gap:9,padding:'9px 12px',
                    border:`2px solid ${picked!==undefined?(isC?'#10b981':isW?'#ef4444':'#e2e8f0'):'#e2e8f0'}`,
                    borderRadius:10,cursor:picked!==undefined?'default':'pointer',
                    background:picked!==undefined?(isC?'#ecfdf5':isW?'#fef2f2':'#fff'):'#fff',
                    fontWeight:700,fontSize:'.82rem',transition:'all .15s',
                  }}>
                    <span style={{width:22,height:22,borderRadius:'50%',background:'#f0f4ff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Fredoka One',cursive",fontSize:'.7rem',flexShrink:0,border:'2px solid #e2e8f0'}}>
                      {String.fromCharCode(65+oi)}
                    </span>
                    <span style={{flex:1}}>{opt}</span>
                    {picked!==undefined&&isC&&<span>✅</span>}
                    {isW&&<span>❌</span>}
                  </div>
                );
              })}
            </div>
            {answers[qi]!==undefined&&(
              <div style={{marginTop:8,padding:'8px 11px',borderRadius:9,fontSize:'.78rem',fontWeight:700,background:answers[qi]===q.ans?'#ecfdf5':'#fef2f2',color:answers[qi]===q.ans?'#065f46':'#991b1b',border:`2px solid ${answers[qi]===q.ans?'#a7f3d0':'#fecaca'}`}}>
                {q.ex}
              </div>
            )}
          </div>
        ))}
      </div>
      {finished&&(
        <div style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',borderRadius:16,padding:18,textAlign:'center',marginTop:12}}>
          <div style={{fontSize:'2.4rem',marginBottom:5}}>{correctCount===unit.quiz.length?'🎉':correctCount>=unit.quiz.length/2?'⭐':'💪'}</div>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.05rem',marginBottom:3}}>
            {correctCount===unit.quiz.length?'Perfect score!':`${correctCount}/${unit.quiz.length} correct!`}
          </div>
          <div style={{fontSize:'.8rem',opacity:.85}}>You earned {correctCount*15} XP! {charInfo.name} is proud! {charInfo.emoji}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HOMEWORK TAB
═══════════════════════════════════════════════════════ */
function HwTab({ unit, charInfo, onXP, savedHw, onSave }) {
  const [hwCode, setHwCode] = useState({});
  const [hwStatus, setHwStatus] = useState(savedHw || {});
  const levelC = {easy:'#065f46',medium:'#92400e',hard:'#991b1b'};
  const levelBg = {easy:'#ecfdf5',medium:'#fffbeb',hard:'#fef2f2'};

  const submit = (i,level,xp) => {
    const code = hwCode[i] || unit.hw[i].starter;
    if (code.trim().length<30) { setHwStatus(s=>({...s,[i]:{type:'try',text:`${charInfo.emoji} That looks too short! Write your actual solution — I believe in you! 💪`}})); return; }
    if (hwStatus[i]?.done) { setHwStatus(s=>({...s,[i]:{...s[i],type:'ok',text:`${charInfo.emoji} Already submitted! Great work! ⭐`}})); return; }
    const newS = {...hwStatus,[i]:{done:true,type:'ok',text:`${charInfo.emoji} Amazing! Submitted! 🎉 You earned +${xp} XP! Run in a real IDE to verify!`}};
    setHwStatus(newS); onSave(newS); onXP(xp);
  };
  const hint = (i) => { setHwStatus(s=>({...s,[i]:{...s[i],type:'try',text:`${charInfo.emoji} 💡 "${unit.hw[i].hint}"`}})); };

  return (
    <div style={{padding:12}}>
      <div style={{background:'#f5f3ff',borderRadius:14,padding:12,marginBottom:12,border:'2px solid #ddd6fe',display:'flex',gap:10,alignItems:'center'}}>
        <span style={{fontSize:'2rem'}}>📚</span>
        <div>
          <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'.9rem',color:'#4c1d95'}}>Homework Challenges!</div>
          <div style={{fontSize:'.72rem',color:'#7c3aed',marginTop:1}}>{unit.hw.length} tasks · Earn XP for each!</div>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {unit.hw.map((h,i)=>(
          <div key={i} style={{background:'#fff',border:'2px solid #e2e8f0',borderRadius:14,overflow:'hidden'}}>
            <div style={{padding:'12px 13px',borderBottom:'2px solid #f1f5f9',display:'flex',gap:9,alignItems:'flex-start'}}>
              <span style={{fontSize:'1.7rem'}}>{h.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'.9rem',marginBottom:2}}>{h.title}</div>
                <div style={{fontSize:'.73rem',color:'#64748b',lineHeight:1.55}}>{h.desc}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:3,alignItems:'flex-end',flexShrink:0}}>
                <span style={{background:levelBg[h.level],color:levelC[h.level],fontSize:'.58rem',fontWeight:800,textTransform:'uppercase',padding:'2px 7px',borderRadius:50}}>{h.level}</span>
                <span style={{background:'#fef9c3',color:'#92400e',fontSize:'.62rem',fontWeight:800,padding:'2px 7px',borderRadius:50}}>+{h.xp} XP</span>
                {hwStatus[i]?.done&&<span style={{fontSize:'.65rem',color:'#10b981',fontWeight:800}}>✓ Done</span>}
              </div>
            </div>
            <div style={{padding:'11px 13px'}}>
              <div style={{display:'flex',gap:8,background:'#f8faff',borderRadius:9,padding:9,marginBottom:9,border:'2px solid #e2e8f0',alignItems:'flex-start'}}>
                <span style={{fontSize:'1.4rem',flexShrink:0}}>{charInfo.emoji}</span>
                <div style={{fontSize:'.72rem',lineHeight:1.6,fontStyle:'italic',color:'#4b5563'}}>{charInfo.name} says: "{h.charTip}"</div>
              </div>
              <div style={{background:'#1e1e2e',borderRadius:8,padding:'9px 11px',fontFamily:"'Courier New',monospace",fontSize:'.7rem',color:'#cdd6f4',whiteSpace:'pre-wrap',overflowX:'auto',marginBottom:8,border:'2px solid #313244'}}>
                {h.starter}
              </div>
              <textarea
                value={hwCode[i]!==undefined?hwCode[i]:h.starter}
                onChange={e=>setHwCode(c=>({...c,[i]:e.target.value}))}
                style={{width:'100%',minHeight:100,background:'#1e1e2e',color:'#cdd6f4',fontFamily:"'Courier New',monospace",fontSize:'.76rem',padding:9,border:'2px solid #313244',borderRadius:8,outline:'none',resize:'vertical',marginBottom:8,display:'block',boxSizing:'border-box'}}/>
              <div style={{display:'flex',gap:7,flexWrap:'wrap',marginBottom:8}}>
                <button onClick={()=>submit(i,h.level,h.xp)} style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:50,padding:'7px 16px',fontWeight:800,fontSize:'.76rem',cursor:'pointer'}}>▶ Submit</button>
                <button onClick={()=>hint(i)} style={{background:'#f8faff',color:'#6366f1',border:'2px solid #c7d2fe',borderRadius:50,padding:'7px 14px',fontWeight:800,fontSize:'.76rem',cursor:'pointer'}}>💡 Hint</button>
              </div>
              {hwStatus[i]&&(
                <div style={{padding:'8px 11px',borderRadius:9,fontSize:'.76rem',fontWeight:700,lineHeight:1.5,background:hwStatus[i].type==='ok'?'#ecfdf5':'#fffbeb',color:hwStatus[i].type==='ok'?'#065f46':'#92400e',border:`2px solid ${hwStatus[i].type==='ok'?'#a7f3d0':'#fde68a'}`}}>
                  {hwStatus[i].text}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROFILE SCREEN
═══════════════════════════════════════════════════════ */
function ProfileScreen({ username, userData, onLogout }) {
  const totalXP = userData.xp || 0;
  const streak = userData.streak || 1;
  const progress = userData.progress || {};

  // count completed units
  const completedQuizzes = Object.keys(progress).filter(k=>k.includes('-quiz')).length;
  const completedHw = Object.keys(progress).filter(k=>k.includes('-hw')).length;

  const level = totalXP < 100 ? 1 : totalXP < 300 ? 2 : totalXP < 600 ? 3 : totalXP < 1000 ? 4 : 5;
  const levelNames = ['','🌱 Sprout','🌿 Learner','⭐ Coder','🔥 Pro Coder','💎 Master'];
  const nextXP = [100,300,600,1000,9999][level-1];

  return (
    <div style={{padding:16,fontFamily:"'Nunito',sans-serif"}}>
      {/* Profile header */}
      <div style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:20,padding:20,marginBottom:16,textAlign:'center',color:'#fff'}}>
        <div style={{width:72,height:72,borderRadius:'50%',background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem',margin:'0 auto 10px',border:'3px solid rgba(255,255,255,.4)'}}>
          {username[0].toUpperCase()}
        </div>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.4rem'}}>{username}</div>
        <div style={{fontSize:'.8rem',opacity:.85,marginTop:2}}>{levelNames[level]}</div>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
        {[
          {icon:'⭐',label:'Total XP',val:totalXP,bg:'#fef9c3',c:'#92400e'},
          {icon:'🔥',label:'Day Streak',val:streak,bg:'#fee2e2',c:'#991b1b'},
          {icon:'🧩',label:'Quizzes Done',val:completedQuizzes,bg:'#f0f4ff',c:'#4338ca'},
          {icon:'📚',label:'HW Done',val:completedHw,bg:'#f0fdf4',c:'#065f46'},
        ].map((s,i)=>(
          <div key={i} style={{background:s.bg,borderRadius:14,padding:'14px 12px',textAlign:'center',border:`2px solid ${s.c}22`}}>
            <div style={{fontSize:'1.8rem'}}>{s.icon}</div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.4rem',color:s.c}}>{s.val}</div>
            <div style={{fontSize:'.7rem',fontWeight:800,color:s.c,opacity:.8}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* XP Progress */}
      <div style={{background:'#fff',borderRadius:14,padding:14,marginBottom:16,border:'2px solid #e2e8f0'}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'.9rem',color:'#6366f1',marginBottom:8}}>Level Progress</div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:'.72rem',fontWeight:800,color:'#64748b',marginBottom:5}}>
          <span>{levelNames[level]}</span>
          <span>{level < 5 ? `${totalXP} / ${nextXP} XP` : 'MAX LEVEL!'}</span>
        </div>
        <div style={{background:'#f0f4ff',borderRadius:50,height:10,overflow:'hidden'}}>
          <div style={{background:'linear-gradient(90deg,#6366f1,#8b5cf6)',height:'100%',borderRadius:50,width:`${Math.min(100,level<5?(totalXP/nextXP)*100:100)}%`,transition:'width .5s ease'}}/>
        </div>
      </div>

      {/* Character progress */}
      <div style={{background:'#fff',borderRadius:14,padding:14,marginBottom:16,border:'2px solid #e2e8f0'}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'.9rem',color:'#1e1b4b',marginBottom:10}}>Your Characters</div>
        {CHARS.map(c=>{
          const done = LESSONS[c.id].units.filter((_,i)=>progress[`${c.id}-${i}-quiz`]).length;
          const total = LESSONS[c.id].units.length;
          return (
            <div key={c.id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
              <span style={{fontSize:'1.5rem'}}>{c.emoji}</span>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'.75rem',fontWeight:800,marginBottom:3}}>
                  <span style={{color:c.color}}>{c.name}</span>
                  <span style={{color:'#64748b'}}>{done}/{total} units</span>
                </div>
                <div style={{background:'#f0f4ff',borderRadius:50,height:7,overflow:'hidden'}}>
                  <div style={{background:c.color,height:'100%',borderRadius:50,width:`${(done/total)*100}%`,transition:'width .5s'}}/>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Logout */}
      <button onClick={onLogout} style={{width:'100%',padding:13,background:'#fff',border:'2px solid #fecaca',borderRadius:50,fontWeight:800,fontSize:'.88rem',cursor:'pointer',color:'#ef4444',fontFamily:"'Nunito',sans-serif"}}>
        🚪 Sign Out
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════ */
export default function CodeToonsApp() {
  const [user, setUser] = useState(null);       // logged-in username
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // classroom state
  const [screen, setScreen] = useState('home'); // home | classroom | profile
  const [charId, setCharId] = useState(null);
  const [unitIdx, setUnitIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [tab, setTab] = useState('learn');

  // Check if already logged in (session)
  useEffect(()=>{
    const s = sessionStorage.getItem('ct:session');
    if (s) {
      const {username, data} = JSON.parse(s);
      setUser(username); setUserData(data);
    }
    setLoading(false);
  },[]);

  const handleLogin = (username, data) => {
    setUser(username); setUserData(data);
    sessionStorage.setItem('ct:session', JSON.stringify({username, data}));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ct:session');
    setUser(null); setUserData(null); setScreen('home'); setCharId(null);
  };

  const addXP = async (n) => {
    const newData = {...userData, xp:(userData.xp||0)+n};
    setUserData(newData);
    sessionStorage.setItem('ct:session', JSON.stringify({username:user, data:newData}));
    await saveUserData(user, newData);
  };

  const saveProgress = async (key, value) => {
    const newData = {...userData, progress:{...(userData.progress||{}), [key]:value}};
    setUserData(newData);
    sessionStorage.setItem('ct:session', JSON.stringify({username:user, data:newData}));
    await saveUserData(user, newData);
  };

  if (loading) return (
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#1e1b4b,#4c1d95)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',color:'#fff'}}>
        <div style={{fontSize:'3rem',marginBottom:12}}>🎨</div>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.4rem'}}>Loading CodeToons...</div>
      </div>
    </div>
  );

  if (!user) return <AuthScreen onLogin={handleLogin}/>;

  const charInfo = CHARS.find(c=>c.id===charId);
  const lessonData = charId ? LESSONS[charId] : null;
  const unit = lessonData ? lessonData.units[unitIdx] : null;
  const progress = userData?.progress || {};

  const startLesson = (id) => { setCharId(id); setUnitIdx(0); setStepIdx(0); setTab('learn'); setScreen('classroom'); };

  const TABS = [{id:'learn',label:'📖 Learn'},{id:'code',label:'💻 Code'},{id:'quiz',label:'🧩 Quiz'},{id:'hw',label:'📚 HW'}];

  /* ── HOME ── */
  if (screen==='home') return (
    <div style={{minHeight:'100vh',background:'#f0f7ff',fontFamily:"'Nunito',sans-serif",maxWidth:480,margin:'0 auto',display:'flex',flexDirection:'column'}}>
      <style>{`@keyframes floatAnim{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <div style={{background:'#fff',borderBottom:'3px solid #e2e8f0',padding:'0 14px',height:54,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:200,boxShadow:'0 2px 10px rgba(0,0,0,.06)',flexShrink:0}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.4rem',background:'linear-gradient(135deg,#6366f1,#f59e0b)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>CodeToons 🎨</div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <span style={{background:'#fef9c3',color:'#92400e',borderRadius:50,padding:'4px 10px',fontWeight:800,fontSize:'.72rem'}}>⭐ {userData?.xp||0}</span>
          <span style={{background:'#fee2e2',color:'#991b1b',borderRadius:50,padding:'4px 10px',fontWeight:800,fontSize:'.72rem'}}>🔥 {userData?.streak||1}</span>
          <button onClick={()=>setScreen('profile')} style={{background:'#6366f1',color:'#fff',borderRadius:'50%',width:30,height:30,border:'none',cursor:'pointer',fontWeight:800,fontSize:'.85rem',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {user[0].toUpperCase()}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#e0e7ff,#fce7f3,#fef9c3)',padding:'28px 18px 60px',textAlign:'center',position:'relative',overflow:'hidden',flexShrink:0}}>
        <div style={{position:'absolute',bottom:-1,left:0,right:0,height:50,background:'#f0f7ff',clipPath:'ellipse(55% 100% at 50% 100%)'}}/>
        <div style={{background:'#fff',borderRadius:50,padding:'4px 14px',display:'inline-block',marginBottom:10,fontSize:'.78rem',fontWeight:800,color:'#6366f1',boxShadow:'0 2px 10px rgba(0,0,0,.08)'}}>
          👋 Welcome back, {user}!
        </div>
        <h1 style={{fontFamily:"'Fredoka One',cursive",fontSize:'clamp(1.5rem,5vw,2.2rem)',color:'#1e1b4b',marginBottom:8}}>
          Learn Coding with<br/><span style={{color:'#6366f1'}}>Cartoon Friends!</span> 🚀
        </h1>
        <p style={{color:'#4b5563',fontSize:'.85rem',maxWidth:360,margin:'0 auto',lineHeight:1.7}}>
          Your cartoon buddy explains everything step by step — no boring textbooks!
        </p>
      </div>

      {/* Characters */}
      <div style={{padding:'0 14px 40px',flex:1,overflowY:'auto'}}>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.2rem',textAlign:'center',margin:'0 0 16px',color:'#1e1b4b'}}>
          👇 Pick a friend to start!
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:11,justifyContent:'center'}}>
          {CHARS.map(c=>{
            const done = LESSONS[c.id].units.filter((_,i)=>progress[`${c.id}-${i}-quiz`]).length;
            const total = LESSONS[c.id].units.length;
            return (
              <div key={c.id} onClick={()=>startLesson(c.id)}
                style={{background:'#fff',borderRadius:18,padding:'18px 13px',textAlign:'center',cursor:'pointer',border:`3px solid #e2e8f0`,width:'47%',position:'relative',boxShadow:'0 4px 14px rgba(0,0,0,.07)',transition:'all .2s',fontFamily:"'Nunito',sans-serif"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.transform='translateY(-5px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='#e2e8f0';e.currentTarget.style.transform='translateY(0)';}}
              >
                {c.badge&&<span style={{position:'absolute',top:-8,right:-8,background:c.color,color:'#fff',fontSize:'.58rem',fontWeight:800,padding:'2px 7px',borderRadius:50}}>{c.badge}</span>}
                <div style={{fontSize:'3rem',animation:'floatAnim 2.5s ease-in-out infinite'}}>{c.emoji}</div>
                <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'.95rem',color:c.color,marginTop:5}}>{c.name}</div>
                <div style={{fontSize:'.68rem',fontWeight:800,textTransform:'uppercase',color:'#94a3b8',marginTop:1,marginBottom:7}}>{c.lang}</div>
                {/* progress bar */}
                <div style={{background:'#f0f4ff',borderRadius:50,height:5,overflow:'hidden'}}>
                  <div style={{background:c.color,height:'100%',borderRadius:50,width:`${(done/total)*100}%`}}/>
                </div>
                <div style={{fontSize:'.62rem',fontWeight:800,color:'#94a3b8',marginTop:3}}>{done}/{total} units</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ── PROFILE ── */
  if (screen==='profile') return (
    <div style={{minHeight:'100vh',background:'#f0f7ff',fontFamily:"'Nunito',sans-serif",maxWidth:480,margin:'0 auto',display:'flex',flexDirection:'column'}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>
      <div style={{background:'#fff',borderBottom:'3px solid #e2e8f0',padding:'0 14px',height:54,display:'flex',alignItems:'center',gap:10,position:'sticky',top:0,zIndex:200,boxShadow:'0 2px 10px rgba(0,0,0,.06)'}}>
        <button onClick={()=>setScreen('home')} style={{background:'#f0f7ff',border:'2px solid #e2e8f0',borderRadius:50,padding:'5px 13px',fontSize:'.75rem',fontWeight:800,cursor:'pointer',color:'#64748b'}}>← Back</button>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1.1rem',color:'#6366f1'}}>My Profile</div>
      </div>
      <div style={{flex:1,overflowY:'auto'}}>
        <ProfileScreen username={user} userData={userData} onLogout={handleLogout}/>
      </div>
    </div>
  );

  /* ── CLASSROOM ── */
  return (
    <div style={{height:'100vh',background:'#f0f7ff',fontFamily:"'Nunito',sans-serif",maxWidth:480,margin:'0 auto',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <style>{`@keyframes floatAnim{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');`}</style>

      {/* Header */}
      <div style={{background:'#fff',borderBottom:'3px solid #e2e8f0',padding:'0 12px',height:52,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0,boxShadow:'0 2px 8px rgba(0,0,0,.06)'}}>
        <button onClick={()=>setScreen('home')} style={{background:'#f0f7ff',border:'2px solid #e2e8f0',borderRadius:50,padding:'4px 11px',fontSize:'.72rem',fontWeight:800,cursor:'pointer',color:'#64748b'}}>← Home</button>
        <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1rem',color:charInfo?.color}}>{charInfo?.emoji} {charInfo?.name}</div>
        <div style={{display:'flex',gap:5}}>
          <span style={{background:'#fef9c3',color:'#92400e',borderRadius:50,padding:'3px 9px',fontWeight:800,fontSize:'.68rem'}}>⭐ {userData?.xp||0}</span>
          <button onClick={()=>setScreen('profile')} style={{background:'#6366f1',color:'#fff',borderRadius:'50%',width:28,height:28,border:'none',cursor:'pointer',fontWeight:800,fontSize:'.8rem'}}>
            {user[0].toUpperCase()}
          </button>
        </div>
      </div>

      {/* Unit pills */}
      <div style={{background:'#f8faff',borderBottom:'2px solid #e2e8f0',padding:'7px 12px',display:'flex',gap:6,overflowX:'auto',flexShrink:0}}>
        {lessonData.units.map((u,i)=>(
          <button key={i} onClick={()=>{setUnitIdx(i);setStepIdx(0);setTab('learn');}} style={{
            background:i===unitIdx?charInfo.color:'#fff',
            color:i===unitIdx?'#fff':'#64748b',
            border:`2px solid ${i===unitIdx?charInfo.color:'#e2e8f0'}`,
            borderRadius:50,padding:'4px 12px',fontSize:'.7rem',fontWeight:800,cursor:'pointer',whiteSpace:'nowrap',transition:'all .2s',
          }}>
            {progress[`${charId}-${i}-quiz`]?'✓ ':''}{u.title}
          </button>
        ))}
      </div>

      {/* Scene */}
      {unit&&<ScenePanel charInfo={charInfo} stepIdx={stepIdx} steps={unit.steps} onNext={()=>stepIdx<unit.steps.length-1&&setStepIdx(s=>s+1)}/>}

      {/* Tabs */}
      <div style={{background:'#f8faff',borderBottom:'2px solid #e2e8f0',display:'flex',flexShrink:0}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:1,padding:'10px 2px',fontWeight:800,fontSize:'.68rem',
            border:'none',borderBottom:tab===t.id?`3px solid ${charInfo?.color}`:'3px solid transparent',
            background:'transparent',color:tab===t.id?charInfo?.color:'#94a3b8',cursor:'pointer',transition:'all .2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:'auto',background:'#fff'}}>
        {unit&&tab==='learn'&&(
          <div style={{padding:12}}>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'1rem',color:charInfo.color,marginBottom:10}}>📖 Lesson Notes</div>
            {unit.steps.map((s,i)=>(
              <div key={i} style={{display:'flex',gap:9,marginBottom:10,alignItems:'flex-start',opacity:i>stepIdx?.35:1,transition:'opacity .3s'}}>
                <span style={{fontSize:'1.4rem',flexShrink:0,marginTop:2}}>{charInfo.emoji}</span>
                <div style={{background:'#f0f4ff',borderRadius:'0 13px 13px 13px',padding:'10px 13px',fontSize:'.83rem',lineHeight:1.65,border:'2px solid #e0e7ff',flex:1}}>
                  <div style={{fontFamily:"'Fredoka One',cursive",fontSize:'.62rem',color:charInfo.color,marginBottom:2}}>Step {i+1}</div>
                  {s.text}
                </div>
              </div>
            ))}
          </div>
        )}
        {unit&&tab==='code'&&<CodeTab unit={unit} charInfo={charInfo}/>}
        {unit&&tab==='quiz'&&(
          <QuizTab
            unit={unit} charInfo={charInfo} onXP={addXP}
            savedAnswers={progress[`${charId}-${unitIdx}-quiz`]}
            onSave={v=>saveProgress(`${charId}-${unitIdx}-quiz`,v)}
          />
        )}
        {unit&&tab==='hw'&&(
          <HwTab
            unit={unit} charInfo={charInfo} onXP={addXP}
            savedHw={progress[`${charId}-${unitIdx}-hw`]}
            onSave={v=>saveProgress(`${charId}-${unitIdx}-hw`,v)}
          />
        )}
      </div>
    </div>
  );
}
