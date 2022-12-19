import birdsData from '../js/bird';

const flatBirdsData = birdsData.flat();
let audioTimeLoop;

const gallery = document.querySelector('.gallery');
const overlay = document.querySelector('.overlay');

const birdImg = document.querySelector('.sample-img');
const birdTitle = document.querySelector('.sample-title');
const birdTitleLat = document.querySelector('.sample-title-lat');
const birdDescript = document.querySelector('.sample-descr');
const birdAudio = document.querySelector('.sample-audio');

const playSampleBtn = document.querySelector('.play-sample');
const playSampleProgress = document.querySelector('.sample-time');
const sampleTimeCurrent = document.querySelector('.sample-time-current');
const sampleTimeDuration = document.querySelector('.sample-time-duration');
const volumeSampleInfo = document.querySelector('.sample-volume-info');
const volumeSampleLevel = document.querySelector('.sample-volume');

overlay.addEventListener('click', closeOverlay);
playSampleBtn.addEventListener('click', playSampleVoice);
volumeSampleLevel.addEventListener('input', changeSampleVolume);
playSampleProgress.addEventListener('input', moveSampleProgress);

function renderGalleryItem(bird, index) {
  const img = document.createElement('img');
  const figure = document.createElement('figure');
  const figcaption = document.createElement('figcaption');
  img.classList.add('gallery-img');
  img.src = `${bird.image}`;
  figcaption.textContent = `${bird.name}`;
  figure.id = `${index}`;
  figure.classList.add('gallery-item');
  figure.append(img);
  figure.append(figcaption);
  gallery.append(figure);
}

renderGallery();

function renderGallery() {  
  flatBirdsData.forEach((item, i) => renderGalleryItem(item, i));
  const allBirds = document.querySelectorAll('.gallery-item');
  allBirds.forEach(item => item.addEventListener('click', showBird));
}

function showBird(e) {
  let birdIndex = e.currentTarget.id;
  let bird = flatBirdsData[birdIndex];
  playSampleBtn.classList.remove('pause-button');
  birdImg.style.backgroundImage = `url(${bird.image})`;
  birdTitle.innerHTML = `${bird.name}`;
  birdTitleLat.innerHTML = `${bird.species}`;
  birdDescript.innerHTML = `${bird.description}`;
  birdAudio.src = `${bird.audio}`;
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';  
}

function closeOverlay(e) {
  if (e.target == e.currentTarget) {
    overlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
    birdAudio.pause();
  }
}


function playSampleVoice() {
  if (!birdAudio.paused && !birdAudio.ended) {
    birdAudio.pause();
    playSampleBtn.classList.remove('pause-button');
    clearInterval(audioTimeLoop);
  } else { 
    birdAudio.play();
    playSampleBtn.classList.add('pause-button');
    audioTimeLoop = setInterval(changeSampleProgress, 1000);
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
    clearInterval(audioTimeLoop);
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

function parseTime(time) {
  let min = Math.floor(time / 60);
  let sec = Math.round(time) % 60;
  let showMin = (min < 10) ? ('0' + min) : min;
  let showSec = (sec < 10) ? ('0' + sec) : sec;
  return `${showMin} : ${showSec}`;
}

// export { taskAudio, birdsOptions, chooseOption, renderBird, getRandomBird };