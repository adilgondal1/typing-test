const TIMER = 10;
const doc_timer = document.querySelector(".curr_time");
const doc_accuracy = document.querySelector(".curr_accuracy");
const doc_error = document.querySelector(".curr_errors");
const doc_cpm = document.querySelector(".curr_cpm");
const doc_wpm = document.querySelector(".curr_wpm");
const wordsToType = document.querySelector(".wordsToType");
const wordsTyped = document.querySelector(".input_text");
const restart_btn = document.querySelector(".restart");
const final_cpm = document.querySelector(".chars");
const final_wpm = document.querySelector(".words");
const final_error = document.querySelector(".errors");
const final_accuracy = document.querySelector(".accuracy");


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



