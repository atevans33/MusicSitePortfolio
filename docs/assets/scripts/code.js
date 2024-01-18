var currBtn = null;
var oldEl = null;
var oldHTML = null;
var oldAsideEl = null;
var oldAsideHTML = null;
var oldVolume;
//album title names
var albumTitles = ["8 pm", "Godless Woman", "Flaming Lies", 
    "Memories", "Dust", "Party", "Relapsing", "Garden"];
var songLinks = ["docs/assets/audio/8pm.mp3",
 "docs/assets/audio/godless-woman.mp3","docs/assets/audio/flaming-lies.mp3",
"docs/assets/audio/memories.mp3", "docs/assets/audio/dust.mp3",
"docs/assets/audio/party.mp3", "docs/assets/audio/relapsing.mp3",
"docs/assets/audio/garden.mp3"];
var audio_index  = new Audio();
var m_breakpoint = 1024;//the breakpoint for mobile/tablet to desktop in px

window.onload = function () {
    //flowtry page scripts
    var audio = document.getElementById("audio");

    //set up listener events on play buttons
    var buttons = document.getElementsByClassName("play-button");
    for (let i = 0; i < buttons.length; i++) {
        //check if record bar is displayed. Display if not
        buttons[i].onclick = function () {

            //check if current button was already pressed and music is playing pressed : if so, pause song
            if (!audio.ended) {
                if (buttons[i].getAttribute("aria-pressed") === "true") {
                    if (!audio.paused) {
                        TogglePlayButton(buttons[i]);
                        audio.pause();
                        return;
                    }
                    else if (audio.paused && audio.currentTime > 0) {
                        TogglePlayButton(buttons[i]);
                        audio.play();
                        return;
                    }
                }
            }

            //check if a song is currently playing
            if (currBtn != null) {
                TogglePlayButton(currBtn); //toggle old button styling
                ToggleSongButtons(currBtn);//toggle old song button styling

                //unmute audio, if muted
                if (audio.muted) {
                    audio.muted = false;
                    $(currBtn).next().find('.mute').attr("aria-pressed", "false");
                }
            }
            currBtn = buttons[i];//update new play button
            //change button styling
            TogglePlayButton(currBtn);
            ToggleSongButtons(currBtn);
            InitializeWaveform(audio);
            LoadSubtitles(audio, currBtn.getAttribute('song'));
        }
    };

    //set up listener events on restart buttons
    var restartButtons = document.getElementsByClassName("restart");
    for (let i = 0; i < restartButtons.length; i++) {
        restartButtons[i].onclick = function () {
            audio.currentTime = 0;//set time back to 0
            LoadSubtitles(audio, currBtn.getAttribute('song'));
            audio.play();

            if (audio.paused) {
                TogglePlayButton(currBtn);
            }
        };
    }

    //set up listener events for mute buttons
    var muteButtons = document.getElementsByClassName("mute");
    for (let i = 0; i < muteButtons.length; i++) {
        muteButtons[i].onclick = function () {
            if (!audio.muted) {
                oldVolume = audio.volume;
                audio.muted = true;
                muteButtons[i].setAttribute("aria-pressed", "true");
            }
            else {
                audio.muted = false;
                muteButtons[i].setAttribute("aria-pressed", "false");
            }
        }
    }

    //set up listener events on volume buttons

    //add listener for music aside 'Lyrics' button
    $("#aside-btn").on("click", function () {
        var aside = document.getElementById('lyric-aside');
        if (aside.getAttribute("aria-expanded") === "true") {
            aside.setAttribute("aria-expanded", "false");
            $('#lyric-aside .btn').attr("aria-pressed", "true");
        }
        else {
            aside.setAttribute("aria-expanded", "true");
            $('#lyric-aside .btn').attr("aria-pressed", "false");
        }
    });
};

//nav music button
$("#music-btn").on("click", function () {
    var btn = $("#music-btn");

    if (btn.attr("aria-pressed") === "false") {
        SliderExpand();
    }
    else {
        SliderClose();
    }
});

//music slider exit button
$('#exit-slider').on("click", function () {
    SliderClose();
});

//music slider mute button
var mute_index = document.getElementById('mute-index');
mute_index.addEventListener('click',function() {
    if(mute_index.getAttribute('aria-pressed') === 'false') {
        mute_index.setAttribute('aria-pressed', 'true');
        audio_index.volume = 0;
    }
    else {
        mute_index.setAttribute('aria-pressed', 'false');
        audio_index.volume = 1;
    }
});

//button to disable page animations (slider anim and rotating record)
$("#anim-disable-btn").on("click", function () {
    var btn = $("#anim-disable-btn");
    var records = document.querySelectorAll(".record-element .img");

    if (btn.attr("aria-pressed") === "false") {
        btn.html("Enable Animation");
        btn.attr("aria-pressed", "true");
        $("#records-container").addClass("paused");

        for (let i = 0; i < records.length; i++) {
            records[i].classList.add("paused");
        }
    }
    else {
        btn.attr("aria-pressed", "false");
        btn.html("Disable Animation");
        $("#records-container").removeClass("paused");

        for (let i = 0; i < records.length; i++) {
            records[i].classList.remove("paused");
        }
    }

})

//mobile manu nav expand
$('#menu').on('click', function () {
    var menu = $('#menu');
    if (menu.attr('aria-expanded') === 'true') {
        menu.attr('aria-expanded', 'false');
        $("#nav").attr('visible', 'false');
    } else {
        menu.attr('aria-expanded', 'true');
        $("#nav").attr('visible', 'true');
    }
});

//array of album record elements
var records= $("#records-container .record-element");

//music slider previous button
var btn_prev = $('.btn-prev');
var index = 1;
var record_slider = document.getElementById('record-slider');
var bodyIndex = document.getElementById('body-index');
btn_prev.on('click', function() {
        let newIndex = index - 1;
        if(newIndex < 1) {
            newIndex = 8;
        }

        if(window.innerWidth < 1024 && window.innerWidth < window.innerHeight) {
            btn_prev.addClass('no-events');
            setTimeout(() => {
                btn_prev.removeClass('no-events');
            }, 600);
        }

        record_slider.classList.remove('record-' + index);
        record_slider.classList.add('record-' + newIndex);
        bodyIndex.classList.remove('color-' + index);
        bodyIndex.classList.add('color-'+ newIndex);
        $("#album-title").html(albumTitles[parseInt(newIndex) - 1]);
        
        if(record_slider.getAttribute('aria-expanded') === "true") {
            audio_index.src = songLinks[parseInt(newIndex) - 1];
        }
        
        audio_index.play();
        index = newIndex;
});

//music slider next button
var btn_next = $('.btn-next')
btn_next.on('click', function() {
    var newIndex = index + 1;
    if (newIndex > 8) {
        newIndex = 1;
    }

    if(window.innerWidth < 1024 && window.innerWidth < window.innerHeight) {
        btn_next.addClass('no-events');
        setTimeout(() => {
            btn_next.removeClass('no-events');
        }, 600);
    }

    record_slider.classList.remove('record-' + index);
    record_slider.classList.add('record-' + newIndex);
    bodyIndex.classList.remove('color-' + index);
    bodyIndex.classList.add('color-'+ newIndex);
    $("#album-title").html(albumTitles[parseInt(newIndex) - 1]);
    
    if(record_slider.getAttribute('aria-expanded') === "true") {
        audio_index.src = songLinks[parseInt(newIndex) - 1];
    }

    audio_index.play();
    index = newIndex;
});

//Open mailing service form
$("#subscribe-btn").on("click", function() {
    var btn = $("#subscribe-btn");
    if (btn.attr("aria-pressed") === "false") {
        btn.attr("aria-pressed", "true");
        $("#dialog1").removeClass("hide");
    }
    else {
        btn.attr("aria-pressed", "false");
        $("#dialog1").addClass("hide");
    }

    //if porttait(mobile/tablet), close nav menu
    if(window.innerWidth < window.innerHeight) {
        $("#menu").attr("aria-expanded", "false");
    }
});

//exit button on aria
$("#exit-dialog1").on("click", function() {
    $("#subscribe-btn").attr("aria-pressed", "false");
    $("#dialog1").addClass("hide");
});

/* 
Update styling of the play button. This function serves cosmetic
purposes only
 */
function TogglePlayButton(button) {
    //check if buttons was pressed: update attribute and icon styling 
    if($(button).attr("aria-pressed") === "false") {
        $(button).find('.fa-solid').addClass('fa-pause');
        $(button).find('.fa-solid').removeClass('fa-play');
        button.setAttribute("aria-pressed", "true");
    }else {
        $(button).find('.fa-solid').addClass('fa-play');
        $(button).find('.fa-solid').removeClass('fa-pause');
        button.setAttribute("aria-pressed", "false");
    }
}

//Song button toggle
function ToggleSongButtons(button) {
    var controlButtons = $(button).next();//grab control buttons for music
    var buttons = $(controlButtons).children();

    //activate buttons if play button is toggled on
    if(button.getAttribute("aria-pressed") === "true") {
        //display buttons
        controlButtons.attr("aria-hidden", "false");
        
        //activate control buttons
        for(let i = 0; i < buttons.length; i++){
            $(buttons[i]).removeAttr("disabled")           
        }
    }else {
        //display buttons
        controlButtons.attr("aria-hidden", "true");

        //deactivate control buttons
        for(let i = 0; i < buttons.length; i++){
            $(buttons[i]).removeAttr("disabled")           
        }
    }
    
    
}

/* 
Music Visualizer Waveform Code

source: https://www.codehim.com/vanilla-javascript/javascript-audio-waveform-visualizer/
source: https://blog.logrocket.com/audio-visualizer-from-scratch-javascript/
*/
var MEDIA_ELEMENT_NODES = new WeakMap();
var context, src, analyser, ctx, bufferLength, dataArray, WIDTH,
HEIGHT, barWidth, barHeight, position, canvas;
function InitializeWaveform(audio) {
    var recordBar = document.getElementById("waveform-bar");
    if(recordBar.getAttribute("aria-hidden")) {
        recordBar.setAttribute("aria-hidden", "false")
    }

    //grab correct audio file and generate source/ analyser
    audio.src = "/flowetry/audio/" + currBtn.getAttribute("song") + ".mp3";
    audio.load();
    audio.play();

    if(context == undefined) {
        context = new AudioContext();
    }

    if(MEDIA_ELEMENT_NODES.has(audio)) {
        src = MEDIA_ELEMENT_NODES.get(audio);
    } else {
        src = context.createMediaElementSource(audio);
        MEDIA_ELEMENT_NODES.set(audio, src);
    }
    analyser = context.createAnalyser();
    
    //generate canvas
    canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    
    //gather mp3 information
    try {
        src.connect(analyser);
        analyser.connect(context.destination);
    } catch(e) {
        console.log("context has already been analyzed");
    }

    analyser.fftSize = 256;

    bufferLength = analyser.frequencyBinCount;

    dataArray = new Uint8Array(bufferLength);

    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    barWidth = (WIDTH / bufferLength) * 2.5;
    barHeight;
    position = 0;
    
    //waveform animation (function runs at 60fps)
    function renderFrame() {
      requestAnimationFrame(renderFrame);

      position = (WIDTH / 2.20); //added the -3 because it was still
      //a little too far to the right

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

    //for loop for the left half of waveform
      for (var dataIndex = 0; dataIndex < bufferLength / 2; dataIndex+= 2) {
          
        barHeight = dataArray[dataIndex];
        
        var r = barHeight /2.5;
        var g = barHeight /2.5;
        var b = barHeight /2.5;

        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ", 1)";
        ctx.fillRect(position, HEIGHT - barHeight, barWidth, barHeight);
        
          
        position -= (barWidth + 1);
      }

      position = (WIDTH / 1.91);

      //for loop for the right hand of the waveform
      for (var dataIndex = 0; dataIndex < bufferLength / 2; dataIndex+= 2) {              
        barHeight = dataArray[dataIndex];
        
        var r = barHeight /2.5;
        var g = barHeight /2.5;
        var b = barHeight /2.5;

        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ", 1)";
        ctx.fillRect(position, HEIGHT - barHeight, barWidth, barHeight);
        
          
        position += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();
}

function ResetAudio(audio, button) {
    $(oldEl).html(oldHTML);
    $(oldAsideEl).html(oldAsideHTML);
    oldEl = null;
    oldHTML = null;
    oldAsideEl = null;
    oldAsideHTML = null;
    currBtn = null;
    TogglePlayButton(button);
    ToggleSongButtons(button);

    if(audio.muted) {
        audio.muted = false;
        $(button).next().find('.mute').attr("aria-pressed", "false");
    }

    if($('#lyrical-aside').attr("aria-expanded")) {
        $('#lyrical-aside').attr("aria-expanded", "false");
        $('#lyric-aside .btn').attr("aria-pressed", "false");

    }

    var recordBar = document.getElementById("waveform-bar");
    recordBar.setAttribute("aria-hidden", "true");

    $('#lyric-aside').removeClass('aside-close')
}

function LoadSubtitles(audio, song) {
    $(audio).off("timeupdate");//Clear previous listener events
    
    /* Create Subtitles */
    //Load subs from json
    var syncData = [];
    $.getJSON('./flowetry/audio/' + song + '.json', function (json) {
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                var item = json[key];
                syncData.push({
                    end: item.end,
                    start: item.start,
                    text: item.text,
                    highlighted: false
                });            
            }
        }
    });

    if(oldEl != null) {
        $(oldEl).html(oldHTML);
        $(oldAsideEl).html(oldAsideHTML);
        oldEl = null;
        oldHTML = null;
        oldAsideEl = null;
        oldAsideHTML = null;
    }

    //place song lines into array
    var bars = $('#' + song + ' .verse li');

     //remove highlight once audio ends
     audio.addEventListener("ended", function(e) {
        ResetAudio(audio, currBtn);
    });

    /* Update Aside Content */
    var asideContent = document.getElementById("aside-content");
    asideContent.scrollTop = 0;
    asideContent.innerHTML = $('#' + song + ' .verses').html();
    var asideBars = $("#aside-content li");
    
    /* Clear any leftover highlighted text*/
    if(oldEl != null) {
        $(oldEl).html(oldHTML);
    }
    
    $(audio).on("timeupdate", function(e){
        syncData.forEach(function(element, index) {
            if(audio.currentTime >= element.start && audio.currentTime <= element.end) {
                if(element.highlighted) {
                    return;
                }
                if(oldEl != null){
                    $(oldEl).html(oldHTML);
                    $(oldAsideEl).html(oldAsideHTML);
                }
                
                oldAsideHTML = $(asideBars[index]).html();
                oldHTML = $(bars[index]).html();
                $(asideBars[index]).html('<span class="highlighted">' + element.text + '</span>');
                $(bars[index]).html('<span class="highlighted">' + element.text + '</span>');
                oldEl = $(bars[index]);
                oldAsideEl = $(asideBars[index]);
                element.highlighted = true;

                if(index > 2) {
                    asideContent.scrollTop += bars[0].offsetHeight;
                }
            }
        });
    });
}

function SliderExpand() {
    if(index === 1 ) {
        audio_index.src = "docs/assets/audio/8pm.mp3"
    }
    else {
        audio_index.src = songLinks[parseInt(index) - 1];
    }
    
    setTimeout(() => {
        audio_index.play();
    }, 700);

    $("#music-btn").attr("aria-pressed", "true");
    document.getElementById('record-slider').setAttribute('aria-expanded', 'true');

    setTimeout(() => {
        document.getElementById('exit-slider').focus();
    }, 100);

    //if mobile
    if(window.innerWidth < 1025 && window.innerWidth < window.innerHeight) {
        $('#menu').attr("aria-expanded", "false");
        console.log('skipped, kinda');
        setTimeout(function() {
            $('#menu').addClass("hide-menu");
        }, 600);
        return;
    }

    var sliderRot = $("#records-container");

    //pause animation first to avoid strange whip effects
    //sliderRot.addClass("paused");

    try {
    var startAngle;
    //#region Get Slider Rotation / Angle
    //find current angle of slider to set it 
    //(if class is removed prior to setting it, there will be a studder effect)
    
    //get style of slider
    var el = document.getElementById("records-container");
    var style = window.getComputedStyle(el, null);
    
    //get the transform property value
    var tr = style.getPropertyValue("-webkit-transform") ||
        style.getPropertyValue("-moz-transform") ||
        style.getPropertyValue("-ms-transform") ||
        style.getPropertyValue("-o-transform") ||
        style.getPropertyValue("transform") ||
            "fail...";
    
    var values = tr.split('(')[1];
    values = values.split(')')[0];
    values = values.split(',');
    var a = values[0];
    var b = values[1];
    
    startAngle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    //#endregion
    
    var destinationAngle;
    //#region Set Rotation to most visible record
    //determine the closest record
    sliderRot.removeClass("rotate");
    if(startAngle > 0) {//if positive
        if(startAngle > 165.5) {
            index = 5;
        }
        else if (startAngle > 120.5) {
            index = 4;
        }
        else if (startAngle > 75.5) {
            index = 3;
        }
        else if (startAngle > 30.5) {
            index = 2;
        }
        else if (startAngle > 0) {
            index = 1;
        }
    }
    else {//if negative
        if(startAngle < -145.5) {
            index = 5;
        }
        else if(startAngle < -104.5) {
            index = 6;
        }
        else if (startAngle < -59.5) {
            index = 7;
        }
        else if (startAngle < -14.5) {
            index = 8;
        }
        else {
            index = 1;
        }
    }
    //#endregion
    }
    catch {
        if (index === null) {
            index = 1;
        }
    }

    //$("#body-index").attr("record", index);
    $("#slider-controls").attr("visible", "true");
    record_slider.classList.remove('record-1');
    document.getElementById('record-slider').classList.add('record-' + index);
    $("#album-title").html(albumTitles[parseInt(index) - 1]);
}

function SliderClose() {
    $("#music-btn").attr("aria-pressed", "false");
    document.getElementById('record-slider').setAttribute('aria-expanded', 'false');
    audio_index.pause();
    audio_index.currentTime = 0;

    //if mobile and portrait
    if(window.innerWidth <= m_breakpoint) {
        $("#menu").removeClass("hide-menu");//bring back menu
        return;
    }

    
    $("#records-container").addClass("rotate");
    $("#slider-controls").attr("visible", "false");
    record_slider.classList.remove('record-' + index);
    bodyIndex.classList.remove('color-' + index);
    index = 1;
}

function m_ToggleHamburgerVisible() {
    //grab menu element
    var el = $("menu");
    
    if(el.hasClass("hide")) {
        el.removeClass("hide");
    }
    else {
        el.addClass("hide");
    }
}

