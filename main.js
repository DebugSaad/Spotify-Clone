console.log("Lets write java script")
let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/Spotify/${folder}/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

         // Show all the songs in the playlist
         let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
         songUl.innerHTML = " ";
         for (const song of songs) {
             songUl.innerHTML = songUl.innerHTML + `<li> <img class="invert" src="Assessts/img/music.svg" alt="">
                                 <div class="info">
                                     <div>${song.replaceAll("%20", " ")} </div>
                                     <div>Atif Aslam</div>
                                 </div>
                                 <div class="playnow">
                                     <span>Play now</span>
                                     <img class="invert" src="Assessts/img/play.svg" alt="play button">
                                 </div></li>`;
         }
         Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
             e.addEventListener("click", element => {
                 playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
             });
         });
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("Assessts/songs/" + track);
    currentSong.src = `${currFolder}/` + track;
    if(!pause){
        currentSong.play();
        play.src = "Assessts/img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00 : 00 / 00 : 00";


}

async function main() {
    // Get all the list of the Songs
    await getSongs(`songs/cs`);
    playMusic(songs[0],true)

    // Add an evemt listener to play previous and next buttons
    play.addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play();
            play.src = "Assessts/img/pause.svg";
        }else{
            currentSong.pause();
            play.src = "Assessts/img/play.svg";
        }
    });
    // Add a event listner to update song time
    currentSong.addEventListener("timeupdate", () =>{
        // console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });
    // Add a event listener to seekbar 
    document.querySelector(".seekbar").addEventListener("click",e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });
    // Add an event lsitener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    // Add an event lsitener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-150%";
    })
    //Add an event listener to previous 
    document.getElementById("previous").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
        if(index - 1 >= length){
        playMusic(songs[index - 1]);
        }
    });
    //Add an event listener to next 
    document.getElementById("next").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
        if(index + 1 < songs.length){
        playMusic(songs[index + 1]);
        }
    });
    //Add an event to Volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to ",e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    //Load the playlist when ever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            
        });
    });
}

main();