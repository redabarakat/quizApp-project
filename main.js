let count = document.querySelector(".quiz-info .count span");
let bulltes = document.querySelector(".bulltes .spans");
let quizArea = document.querySelector(".quiz-area h2");
let answerAreacontainer = document.querySelector(".answer-area");
let answerArea = document.querySelectorAll(".answer-area label");
let submit = document.querySelector(".submit");
let inputs = document.querySelectorAll(".answer-area input");
let spanRight = document.querySelector(".right");
let spanwrong = document.querySelector(".wrong");
let results = document.querySelector(".results");
let finalResult = document.querySelector(".finalResult");
let finalResulth1 = document.querySelector(".finalResult h1");
let finalResultspan = document.querySelector(".finalResult span")
let countdown = document.querySelector(".countdown .seconds");


let current = 0
let totalright = 0
let totalwrong =0
let time = false
let timer;
let mood = "start";

function getData(){
    let myRequest = new XMLHttpRequest()
    myRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let data = JSON.parse(myRequest.responseText)
            let dataCount = data.length
            showBulltes(dataCount)
            showQuestions(data[current] , dataCount)
            countDown(data, dataCount)
            submit.onclick = function(e){
                if(mood === "start"){
                    inputs.forEach((input) => {
                        if (input.checked || time == true) {
                            time = false;
                            let rightAnswer =
                                data[current]["right_answer"].toLowerCase();
                            chooseAnswer(rightAnswer, data[current]);
                            current++;
                            if (current < 10) {
                                clearInterval(timer);
                                setTimeout(() => {
                                    bulltes.innerHTML = "";
                                    showBulltes(dataCount);
                                    showQuestions(data[current], dataCount);
                                    countDown();
                                }, 1000);
                            } else {
                                finish();
                            }
                        } else {
                            return false;
                        }
                    });
                }else {
                    window.location.reload()
                }
            }
            
        }
    }
    myRequest.open("GET", "questions.json",true);
    myRequest.send()
}
getData();

function showBulltes(num){
    count.innerHTML = num
    for(let i = 0; i < num; i++) {
        let span = document.createElement("span")
        if(i <= current) {
            span.className = "on";
        }
        bulltes.append(span)
    }
    // ********* another solution *********
    // let spanArray = document.querySelectorAll(".bulltes .spans span");
    // spanArray.forEach((span,index) => {
    //     if(index <= current) {
    //         span.className ="on"
    //     }
    // })
}

function showQuestions(question , count) {
    quizArea.innerText = question.title;
    inputs.forEach((input) => {
        input.checked = false
    })
    for(let i =0; i < answerArea.length; i++) {
        answerArea[i].innerText = question[answerArea[i].getAttribute("for")];
    }

}

function chooseAnswer(rightAnswer,data) {
    inputs.forEach((input) => {
        if(input.checked){
            let chooseAnswer = data[input.id].toLowerCase()
            if(chooseAnswer == rightAnswer) {
                totalright++
                spanRight.innerHTML = totalright
            } else {
                totalwrong++
                spanwrong.innerHTML =  totalwrong
            }
            answerArea.forEach((label) => {
                if (label.innerText.toLowerCase() == rightAnswer ) {
                    label.style.color = "green";
                } 
                if (label.getAttribute("for") == input.id && label.innerText.toLowerCase() != rightAnswer ) {
                    label.style.color = "red";
                }
                setTimeout(() => {
                    label.style.color = "white"
                }, 1000);
            });
        } 
    })
}

function finish(){
    quizArea.remove()
    answerAreacontainer.remove();
    clearInterval(timer)
    mood  = "play again"
    submit.innerHTML = "paly again"
    if(totalright < 5) {
        finalResulth1.innerHTML = "bad"
        finalResulth1.className = "bad";
        finalResultspan.innerHTML = totalright
    } else if (totalright >= 5 && totalright < 10) {
        finalResulth1.innerHTML = "good";
        finalResulth1.className = "Good";
        finalResultspan.innerHTML = totalright;
    }else {
        finalResulth1.innerHTML = "perfect";
        finalResulth1.className = "perfect";
        finalResultspan.innerHTML = totalright;
    }
    finalResult.style.display = "block"
}

function countDown(data,dataCount){
    let duration = 10;
    timer = setInterval(() => {
        --duration
        countdown.innerHTML = duration
        if(duration === 0 ){
            clearInterval(timer)
            time = true
            submit.click()
        }
    }, 1000);
}
