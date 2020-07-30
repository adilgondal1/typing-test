const submit_btn = document.querySelector(".submit-btn")
const username = document.querySelector(".username")
const updated_name = document.querySelector(".update-username")
const play_btn = document.querySelector(".play")
const my_scores = document.querySelector(".my-scores")
const top_scores = document.querySelector(".top-scores")
const my_leaderboard = document.querySelector(".leaderboard#mine")
const top_leaderboard = document.querySelector(".leaderboard#overall")
const user_scores = document.querySelector(".user-scores")
const delete_btn = document.querySelector(".delete")
const update_form = document.querySelector(".update-form")
const update_btn = document.querySelector(".update-btn")
const user_form = document.querySelector(".user-form")

let my_name = ""
let my_id = 0
let all_users = []







submit_btn.addEventListener("click", displayScores)

function displayScores(){
    if (username.value == "") {
        alert("Please enter a username!");
        return false;
      }
    user_form.style.display = "none";

    my_scores.style.display = "block";
    top_scores.style.display = "block";
    play_btn.style.display = "block";
    delete_btn.style.display = "block";
    update_form.style.display = "block";



    getUsers()
    getScores()

}

function getUsers(){
    fetch("http://localhost:9292/users")
    .then(res => res.json())
    .then(users => {
        all_users = users.message.map(user => user.username)
        findUser(users.message)
    })
}



function findUser(users){
    const found = users.find(user => user.username == username.value)
    if (found) {
        getUserScores(found.id)
        user_scores.innerText = `${found.username}'s Top Scores`
        my_id = found.id
        my_name = found.username
        console.log(my_id)
    } else {
        createUser(username.value)
    }
}

function createUser(name){
    console.log(name)
    const configObj = { 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }, 
        body: JSON.stringify({
            username: name
        })
    }
    fetch('http://localhost:9292/users', configObj)
        .then(res => res.json())
        .then(json => { 
            sessionStorage.setItem('my_id', json.message.split(" ")[0])
            my_id = sessionStorage.getItem('my_id')
            sessionStorage.setItem('username', json.message.split(" ")[1])
            my_name = sessionStorage.getItem('username')
            user_scores.innerText = `${name}'s Top Scores`
        }) 
}

update_btn.addEventListener("click", updateUser)
function updateUser(){
    if (updated_name.value == "") {
        alert("Please enter a username!");
        return false;
    }
    const found = all_users.find(user => user == updated_name.value)
    if (found){
        alert("Username already taken!");
        document.querySelector(".update-username").value = ""
        return false;
    }  
    const name = updated_name.value
    all_users.splice(all_users.indexOf(my_name), 1, name);
    const configObj = { 
        method: 'PUT', 
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }, 
        body: JSON.stringify({
            username: name
        })
    }
    fetch(`http://localhost:9292/users/${my_id}`, configObj)
        .then(res => res.json())
        .then(json => { 
            user_scores.innerText = `${name}'s Top Scores`
    })
    my_name = name
    document.querySelector(".update-username").value = ""
    mine = document.querySelectorAll("td#mine")
    mine.forEach(cell => cell.innerText = my_name)
}

delete_btn.addEventListener('click', function(){
    fetch(`http://localhost:9292/users/${my_id}`, {
        method: 'DELETE',
    })
    .then( () => {
        my_scores.style.display = "none";
        top_scores.style.display = "none";
        play_btn.style.display = "none";
        delete_btn.style.display = "none";
        update_form.style.display = "none";

        username.value = ""
        user_form.style.display = "block";
        
        adds = document.querySelectorAll(".additions")
        adds.forEach(add => add.remove())

    })
}) 


function getUserScores(id){
    fetch(`http://localhost:9292/users/${id}`)
    .then(res => res.json())
    .then(user => sortScores(user.scores,my_leaderboard))
}

function sortScores(scores,leaderboard){
    const sorted = scores.sort(compare)
    // const top_scores = sorted.map(score => score.value)
    showScores(sorted,leaderboard)
}

function compare(a,b){
    const score1 = a.value
    const score2 = b.value

    if (score1 > score2) return -1;
    if (score2 > score1) return 1;
  
    return 0;
}

function showScores(scores,leaderboard){
    scores.slice(0,5).forEach((score,index) => {
        let tr = document.createElement('tr')
        tr.classList.add("additions");
        if (leaderboard === my_leaderboard){
            tr.innerHTML = `<td>${index+1}</td><td>${score.value}</td>`
        }else {
            if (score.user.username == my_name){
                tr.innerHTML = `<td>${index+1}</td><td id = "mine" >${score.user.username}</td><td>${score.value}</td>`
            } else {
                tr.innerHTML = `<td>${index+1}</td><td>${score.user.username}</td><td>${score.value}</td>`
            }
        }
        leaderboard.append(tr)
      })
}

function viewAgain(){
    reset()
    adds = document.querySelectorAll(".additions")
    adds.forEach(add => add.remove())


    my_scores.style.display = "block";
    top_scores.style.display = "block";
    play_btn.style.display = "block";
    delete_btn.style.display = "block";
    update_form.style.display = "block";


    restart_btn.style.display = "none";
    view_btn.style.display = "none";
    time_display.style.display = "none";
    final_error.style.display = "none";
    wordsToType.style.display = "none";
    wordsTyped.style.display = "none"; 
    final_accuracy.style.display = "none";
    final_cpm.style.display = "none";
    final_wpm.style.display = "none";

    getUsers()
    getScores()

}

function getScores(){
    fetch("http://localhost:9292/scores")
    .then(res => res.json())
    .then(scores => sortScores(scores,top_leaderboard))
}


const TIMER = 3;
const doc_timer = document.querySelector(".curr_time");
const time_display = document.querySelector(".timer");
const doc_accuracy = document.querySelector(".curr_accuracy");
const doc_error = document.querySelector(".curr_errors");
const doc_cpm = document.querySelector(".curr_cpm");
const doc_wpm = document.querySelector(".curr_wpm");
const wordsToType = document.querySelector(".wordsToType");
const wordsTyped = document.querySelector(".input_text");
const restart_btn = document.querySelector(".restart#button");
const view_btn = document.querySelector(".restart#view");
const final_cpm = document.querySelector(".chars");
const final_wpm = document.querySelector(".words");
const final_error = document.querySelector(".errors");
const final_accuracy = document.querySelector(".accuracy");
const container = document.querySelector(".container");



play_btn.addEventListener("click", displayGame)

function displayGame(){
    my_scores.style.display = "none";
    top_scores.style.display = "none";
    play_btn.style.display = "none";
    delete_btn.style.display = "none";
    update_form.style.display = "none";



    time_display.style.display = "block";
    final_error.style.display = "block";
    wordsToType.style.display = "block";
    wordsTyped.style.display = "block";  
}


let quotes_array = [];
let used_words = [];
let timeLeft = TIMER;
let timeUsed = 0;
let total_errors = 0;
let accuracy = 0;
let characterTyped = 0;
let current_quote = "";
let quoteNo = 0;
let timer = null;
let wordNo = 0;
let wordCount = 0;

for(let i=0;i<20;i++){
    quotes_array.push("")
    used_words.push("")
}

function getWords(){
    fetch("https://random-word-api.herokuapp.com//word?number=100")
    .then(res => res.json())
    .then(words => {
        // console.log(words)
        make_ary(words)
        updateWords()
    })
}



function make_ary(words){
    let i = 0;
    words.forEach((word,index) => {
        quotes_array[i]+=word+" "
        if (index !=0 & index % 5 == 0){
            i++
        }
    })

}

function updateValues(){
    document.body.onkeyup = function(e){
    curr_input = wordsTyped.value;
  
      if (e.keyCode != 8){
          input_ary = curr_input.split('');
          let curr_char = input_ary.length - 1
          if (input_ary[curr_char] != quotes_array[quoteNo].substring(curr_char,curr_char+1)){
              total_errors++
          }
          console.log(total_errors)
        doc_error.textContent = total_errors;
      }
  
      if(e.keyCode == 32){
          processCurrentWord()
          wordsTyped.value = "";
             if (quotes_array[quoteNo].split(" ").length == 1){
              quotes_array[quoteNo] = ""; 
          } else {
              quotes_array[quoteNo] = quotes_array[quoteNo].substr(quotes_array[quoteNo].indexOf(" ") + 1)
          }
          updateWords()
      }
  }}

function updateWords() {
    if (quotes_array[quoteNo] === ""){
        quoteNo++;
        wordNo = 0;
    }
      wordsToType.textContent = null;
      current_quote = quotes_array[quoteNo];

      current_quote = current_quote.slice(0, current_quote.length -1)
    
      current_quote.split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.innerText = char
        wordsToType.appendChild(charSpan)
    
      })

        used_words[quoteNo].split(" ").reverse().forEach(word => {
        const strong = document.createElement('strong')
        strong.innerText = word.substring(0,word.length - 1) + " "
        if (word.slice(-1) === "1"){
            strong.style.color = "green";
        } else {
            strong.style.color = "red";
        }
        wordsToType.prepend(strong);
      })
}

function processCurrentWord(){
    curr_input = wordsTyped.value;
    curr_word = quotes_array[quoteNo].slice(0, quotes_array[quoteNo].indexOf(" ") + 1);

    used_words[quoteNo] += quotes_array[quoteNo].substr(0,quotes_array[quoteNo].indexOf(" "))

    if (curr_input === curr_word){
        curr_word++;
        wordCount++;
        console.log(wordCount)
        used_words[quoteNo] += "1"
        characterTyped += (curr_input.length - 1)
        console.log(characterTyped)
    } else {
        used_words[quoteNo] += "0"
    }
    used_words[quoteNo] += " "
}


function updateCurrentText() {
    curr_input = wordsTyped.value;
    curr_input_array = curr_input.split('');

    quoteSpanArray = wordsToType.querySelectorAll('span');
    quoteSpanArray.forEach((char, index) => {
        let typedChar = curr_input_array[index]

        if (typedChar == null) {
        char.classList.remove('correct');
        char.classList.remove('incorrect');
        } else if (typedChar === char.innerText) {
        char.classList.add('correct');
        char.classList.remove('incorrect');
        } else {
        char.classList.add('incorrect');
        char.classList.remove('correct');

        }
    });

}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeUsed++;
        doc_timer.textContent = timeLeft + "s";
    }
    else {
        finish();
    }
}

function finish() {
    clearInterval(timer);
    wordsTyped.value = "";
    wordsTyped.disabled = true;
    document.body.onkeyup = null

    wordsToType.textContent = "Click restart to play again!";

    restart_btn.style.display = "block";
    view_btn.style.display = "block";


    cpm = Math.round(((characterTyped / timeUsed) * 60));
    wpm = Math.round((((characterTyped / 5) / timeUsed) * 60));

    doc_cpm.textContent = cpm;
    doc_wpm.textContent = wpm;

    let correctCharacters = (characterTyped - total_errors );
    let accuracyVal = ((correctCharacters / characterTyped) * 100);
    if (accuracyVal < 0){
      doc_accuracy.textContent = "0";
    } else {
        doc_accuracy.textContent = Math.round(accuracyVal);
    }

    final_accuracy.style.display = "block";
    final_cpm.style.display = "block";
    final_wpm.style.display = "block";

    createScore(wpm)

}

function createScore(wpm){
    const configObj = { 
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }, 
        body: JSON.stringify({
            value: wpm,
            user_id: my_id 
        })
    }
    fetch('http://localhost:9292/scores', configObj)
}


function start() {
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    updateCurrentText()
    updateValues()
    wordsTyped.addEventListener("input",updateCurrentText)
    wordsTyped.removeEventListener("input",start)
}

function reset() {
  timeLeft = TIMER;
  timeUsed = 0;
  total_errors = 0;
  accuracy = 0;
  characterTyped = 0;
  quoteNo = 0;
  wordsTyped.disabled = false;
  wordCount = 0;

  wordsTyped.value = "";
  getWords();
  quotes_array = ["","","","","","","","","",""];
  used_words = ["","","","","","","","","",""];
  wordsTyped.addEventListener("input",start)
  doc_accuracy.textContent = 100;
  doc_timer.textContent = timeLeft + 's';
  doc_error.textContent = 0;
  restart_btn.style.display = "none";
  final_cpm.style.display = "none";
  final_wpm.style.display = "none";
  final_accuracy.style.display = "none";

}



getWords()
wordsTyped.addEventListener("input",start)
restart_btn.addEventListener("click",reset)
view_btn.addEventListener("click",viewAgain)



