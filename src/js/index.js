import birdsData from '../js/bird';
import { showResult } from '../js/result';
// import { getRandomBird, birdsOptions, taskAudio, chooseOption } from '../js/utils';

const numBirdsInPart = 6;
let partBirds = 0;
let generalScore = 0;
let currentScore = 5;
let indexTaskBird;
let taskBird;
let loopTask;
let loopSample;

const partsOfGame = document.querySelectorAll('.parts-item');
const score = document.querySelector('.score');
const taskImg = document.querySelector('.task-img');
const taskTitle = document.querySelector('.song-title');
const taskAudio = document.querySelector('.task-audio');
const sampleOffer = document.querySelector('.samle-offer');
const sampleWrapper = document.querySelector('.sample-wrapper');
const birdImg = document.querySelector('.sample-img');
const birdTitle = document.querySelector('.sample-title');
const birdTitleLat = document.querySelector('.sample-title-lat');
const birdDescript = document.querySelector('.sample-descr');
const birdAudio = document.querySelector('.sample-audio');
const nextBtn = document.querySelector('.next');
const birdsOptions = document.querySelectorAll('.options-item');

const playTaskBtn = document.querySelector('.play-task');
const playTaskProgress = document.querySelector('.task-time');
const taskTimeCurrent = document.querySelector('.task-time-current');
const taskTimeDuration = document.querySelector('.task-time-duration');
const playSampleBtn = document.querySelector('.play-sample');
const playSampleProgress = document.querySelector('.sample-time');
const sampleTimeCurrent = document.querySelector('.sample-time-current');
const sampleTimeDuration = document.querySelector('.sample-time-duration');
const volumeTaskInfo = document.querySelector('.task-volume-info');
const volumeSampleInfo = document.querySelector('.sample-volume-info');
const volumeTaskLevel = document.querySelector('.task-volume');
const volumeSampleLevel = document.querySelector('.sample-volume');

const audioTrue = new Audio();
audioTrue.src = '../src/assets/true.mp3';
const audioFalse = new Audio();
audioFalse.src = '../src/assets/false.mp3';

playTaskBtn.addEventListener('click', playTaskVoice);
volumeTaskLevel.addEventListener('input', changeTaskVolume);
playTaskProgress.addEventListener('input', moveTaskProgress);
playSampleBtn.addEventListener('click', playSampleVoice);
volumeSampleLevel.addEventListener('input', changeSampleVolume);
playSampleProgress.addEventListener('input', moveSampleProgress);

initTask(partBirds);

function initTask(part) {
  indexTaskBird = getRandomBird(numBirdsInPart);
  taskBird = birdsData[partBirds][indexTaskBird];
  partsOfGame[partBirds].classList.add('current');
  taskAudio.src = `${taskBird.audio}`;
  birdsOptions.forEach((item, i) => {
    item.firstChild.nextSibling.textContent = birdsData[part][i].name;
    item.addEventListener('click', chooseOption);
  })
  nextBtn.style.background = "rgba(0, 87, 218, 0.7)";
  nextBtn.removeEventListener('click', nextTask);
}

function getRandomBird(n) {
  return Math.floor(Math.random() * n);
}

function chooseOption(e) {
  let chooseIndex = +e.currentTarget.id;
  let chooseBird = birdsData[partBirds][chooseIndex];
  renderBird(chooseBird);
  sampleWrapper.classList.remove('hidden');
  sampleOffer.classList.add('hidden');  
  if (chooseIndex === indexTaskBird) {
    e.currentTarget.firstChild.style.background = "rgb(0, 255, 0)";
    audioTrue.play();
    birdsOptions.forEach((item) => {
      item.addEventListener('click', onlyRenderBird);
      item.removeEventListener('click', chooseOption);      
    });
    rightChoice(taskBird);
  } else {
    e.currentTarget.firstChild.style.background = "rgb(255, 0, 0)";
    audioFalse.play();
    currentScore = currentScore - 1;
  }
}

function renderBird(bird) {
  birdImg.style.backgroundImage = `url(${bird.image})`;
  birdTitle.innerHTML = `${bird.name}`;
  birdTitleLat.innerHTML = `${bird.species}`;
  birdDescript.innerHTML = `${bird.description}`;
  birdAudio.src = `${bird.audio}`;
  playSampleBtn.classList.remove('pause-button');
}

function onlyRenderBird(e) {
  let chooseIndex = +e.currentTarget.id;
  let chooseBird = birdsData[partBirds][chooseIndex];
  renderBird(chooseBird);
}

function rightChoice(bird) {  
  taskImg.style.backgroundImage = `url(${bird.image})`;
  taskTitle.innerHTML = `${bird.name}`;
  taskAudio.pause();
  playTaskBtn.classList.remove('pause-button');
  nextBtn.style.background = "rgb(0, 153, 25)";
  nextBtn.addEventListener('click', nextTask);
  generalScore += currentScore;
  currentScore = 5;
  score.textContent = `Очки: ${generalScore}`;
  if(partBirds < 5) {
    nextBtn.addEventListener('click', nextTask);
  } else {
    nextBtn.removeEventListener('click', nextTask);
    nextBtn.textContent = 'Результат';
    nextBtn.addEventListener('click', showResult);
  }
}

function nextTask() {  
    partsOfGame[partBirds].classList.remove('current');
    partBirds++;
    taskImg.style.backgroundImage = "url(../src/assets/unknow_bird.jpg)";
    taskTitle.innerHTML = '******';
    sampleWrapper.classList.add('hidden');
    sampleOffer.classList.remove('hidden');
    birdsOptions.forEach((item, i) => {
      item.firstChild.style.background = "rgb(54, 74, 255)";
    })
    initTask(partBirds);  
}

// Play task

function playTaskVoice() {
  if (!taskAudio.paused && !taskAudio.ended) {
    taskAudio.pause();
    playTaskBtn.classList.remove('pause-button');
    clearInterval(loopTask);
  } else { 
    taskAudio.play();
    playTaskBtn.classList.add('pause-button');
    loopTask = setInterval(changeTaskProgress, 1000);
  }
}

function changeTaskProgress() {
  if (!taskAudio.ended) {
    playTaskProgress.value = parseInt(taskAudio.currentTime * 100 / taskAudio.duration);
    taskTimeDuration.textContent = parseTime(taskAudio.duration);
    taskTimeCurrent.textContent = parseTime(taskAudio.currentTime);
  } else {
    playTaskProgress.value = 0;
    taskTimeCurrent.textContent = '00:00';
    playTaskBtn.classList.remove('pause-button');
    clearInterval(loopTask);
    taskAudio.load();
  }
}

function parseTime(time) {
  let min = Math.floor(time / 60);
  let sec = Math.round(time) % 60;
  let showMin = (min < 10) ? ('0' + min) : min;
  let showSec = (sec < 10) ? ('0' + sec) : sec;
  return `${showMin} : ${showSec}`;
}

function moveTaskProgress() {
  taskAudio.currentTime = parseInt(playTaskProgress.value * taskAudio.duration / 100);
}

function changeTaskVolume() {
  taskAudio.volume = this.value;
  volumeTaskInfo.textContent = Math.round(this.value * 100);
}



// Play sample

function playSampleVoice() {
  if (!birdAudio.paused && !birdAudio.ended) {
    birdAudio.pause();
    playSampleBtn.classList.remove('pause-button');
    clearInterval(loopSample);
  } else { 
    birdAudio.play();
    playSampleBtn.classList.add('pause-button');
    loopSample = setInterval(changeSampleProgress, 1000);
  }
}

function changeSampleProgress() {
  if (!birdAudio.ended) {
    playSampleProgress.value = parseInt(birdAudio.currentTime * 100 / birdAudio.duration);
    sampleTimeDuration.textContent = parseTime(birdAudio.duration);
    sampleTimeCurrent.textContent = parseTime(birdAudio.currentTime);
  } else {
    playSampleProgress.value = 0;
    sampleTimeCurrent.textContent = '00:00';
    playSampleBtn.classList.remove('pause-button');
    clearInterval(loopTask);
    birdAudio.load();
  }
}

function moveSampleProgress() {
  birdAudio.currentTime = parseInt(playSampleProgress.value * birdAudio.duration / 100);
}

function changeSampleVolume() {
  birdAudio.volume = this.value;
  volumeSampleInfo.textContent = Math.round(this.value * 100);
}

// End audio

export { generalScore };