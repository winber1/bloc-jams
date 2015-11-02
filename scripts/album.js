var createSongRow = function(songNumber, songName, songLength) 
{     
     var template =
        '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
        + '</tr>'
        ;
 
     var $row = $(template); 
    
     // row event handlers (JQuery refactor)
     var clickHandler = function() 
     {     
         var songNbr = parseInt($(this).attr('data-song-number'));
         
         // if song playing now, reset all row htmls to song nbr
         if (currentlyPlayingSongNumber) 
         { 
            var songItems = $(document).find('.song-item-number');  
             
            songItems.each
            (
                function(i,item)
                {  $(item).html(i+1);  }
            );
         }     
         
         // song selection stayed the same - pause it
         if( currentlyPlayingSongNumber === songNbr)
          { 
             if(currentSoundFile.isPaused())
             {  
                 $(this).html(pauseButtonTemplate); 
                 currentSoundFile.play();
                 updateSeekBarWhileSongPlays();
             }
             else
             { 
                 $(this).html(playButtonTemplate); 
                 currentSoundFile.pause();
             }
             
              songPaused = !songPaused;
         }
         // change row selection to pause button
         else 
         { 
             // set current volume thumb and fill
             var $volumeFill = $('.volume .fill');
             var $volumeThumb = $('.volume .thumb');
             $volumeFill.width(currentVolume + '%');
             $volumeThumb.css({left: currentVolume + '%'});
             
             $(this).html(pauseButtonTemplate);  
             //currentlyPlayingSongNumber = songNbr; 
             //currentSongFromAlbum = currentAlbum.songs[songNbr - 1];
             setSong(songNbr);
             songPaused = false;
             currentSoundFile.play();
             updateSeekBarWhileSongPlays();
         } 
         
         updatePlayerBarSong();
     };
    
     
     var onHover = function(event) 
     {
         var songItem = $(this).find('.song-item-number');       
         
         if (songItem)
         {
             var songNbr = parseInt(songItem.attr('data-song-number'));
             
             if( songNbr !== currentlyPlayingSongNumber)
             { songItem.html(playButtonTemplate); }     
         }
     };
    
     var offHover = function(event) 
     {
         var songItem = $(this).find('.song-item-number');  
         
         if (songItem)
         {
             var songNbr = parseInt(songItem.attr('data-song-number'));
             
             if( songNbr !== currentlyPlayingSongNumber )
             {  songItem.html(songNbr);  } 
         }
     };
    
     // attach event listeners to row
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
    
     return $row;
};

// set currentlyPlayingSongNumber,
//     currentSongFromAlbum
var setSong = function(songNumber) 
{
    // stop any existing song; get ready for new song set
    if (currentSoundFile) { currentSoundFile.stop(); }
    
    currentlyPlayingSongNumber = songNumber;     
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    // buzz api constructor
    currentSoundFile = new buzz.sound(musicPath + currentSongFromAlbum.audioUrl, 
                            {
                                formats: [ 'mp3' ],
                                preload: true
                            });
    setVolume(currentVolume);
};

 var seek = function(time) 
 {
     if (currentSoundFile) 
     {  currentSoundFile.setTime(time);  }
 }
 
 var setVolume = function(volume) 
 {
     if (currentSoundFile) {  currentSoundFile.setVolume(volume);  }
 };

// get song number element for attr data-song-number as input param
var getSongNumberCell = function(number)
{
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var setCurrentAlbum = function(album) 
{ 
     currentAlbum = album;  
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     // set values
     $albumTitle.text(album.name);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();

     for (i = 0; i < album.songs.length; i++) 
     {
         var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
         $albumSongList.append($newRow);
     }
};

var setCurrentTimeInPlayerBar = function(time)
{
    $('.seek-control .current-time').text(time);
};

var setTotalTimeInPlayerBar = function(time)
{
    $('.seek-control .total-time').text(time);
};

// output seconds in time (mm:ss) format
var filterTimeCode = function(time)
{
    var nbr = Number.parseFloat(time);
    var min = Math.floor(nbr/60);
    var sec = Math.floor(nbr % 60);

    if (sec <10)
    { sec = "0" + sec; }
    
    var formatTime = min + ":" + sec;
    return formatTime;
};

var updateSeekBarWhileSongPlays = function() 
{
     if (currentSoundFile) 
     {
         // bind custom Buzz event 'timeupdate' to music file
         currentSoundFile.bind('timeupdate', function(event) 
         {
             // use Buzz's getTime() to find Fill ratio
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');
 
             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
         });
     }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) 
{
    var offsetXPercent = seekBarFillRatio * 100;
    
    // set song Control or Volume based on slider movement  
 /*
    if($seekBar.parent().hasClass("seek-control"))
    { seek( seekBarFillRatio * currentSoundFile.getDuration()  ); }
    else //if($seekBar.parent().hasClass("ion-volume-high icon"))  
    { setVolume(  seekBarFillRatio *100  ); }
*/
    
    // check range; must be 0-100, includsive
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    // set slider fill and thumb classes with percentage
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});   
 };

var setupSeekBars = function() 
{
     var $seekBars = $('.player-bar .seek-bar');

     $seekBars.click(function(event) 
     {
         // get X point of click and % of slider clicked
         // offsetXvar: length of left slide of slider to click
         // barWidth: length of slider
         offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         var seekBarFillRatio = offsetX / barWidth;

    // set song Control or Volume based on slider movement  
    if($seekBar.parent().hasClass("seek-control"))
    { seek( seekBarFillRatio * currentSoundFile.getDuration()  ); }
    else   
    { setVolume(  seekBarFillRatio *100  ); }
 
         // set slider
         updateSeekPercentage($(this), seekBarFillRatio);
     });

     // add mousedown event to element with .thumb class
     $seekBars.find('.thumb').mousedown(function(event) 
     {
        // .thumb's (this) parent has .seek-bar
        var $seekBar = $(this).parent();
 
        // namespace event listener
        // allow user to mousemove on document, specific to .thumb
        $(document).bind('mousemove.thumb', function(event)
        {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
          
    // set song Control or Volume based on slider movement  
    if($seekBar.parent().hasClass("seek-control"))
    { seek( seekBarFillRatio * currentSoundFile.getDuration()  ); }
    else 
    { setVolume(  seekBarFillRatio *100  ); } 
         
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
 
        // release mousemove behavior 
        $(document).bind('mouseup.thumb', function() 
        {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
        });
     });   
 };

var trackIndex = function(album, song) 
{
     return album.songs.indexOf(song);
};

var nextSong = function()
{
    var songIdx = trackIndex(currentAlbum, currentSongFromAlbum);
    var nextIdx = songIdx+1;
    if(nextIdx == currentAlbum.songs.length)
    { nextIdx = 0; }
    
    // reset old song row to song nbr
    var songCell = getSongNumberCell(currentlyPlayingSongNumber);
    songCell.html(currentlyPlayingSongNumber);
    
    // set next song
    setSong(nextIdx+1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    // set next song row to pause button
    songCell = getSongNumberCell(currentlyPlayingSongNumber);
    songCell.html(pauseButtonTemplate);
};

var previousSong = function()
{
    var songIdx = trackIndex(currentAlbum, currentSongFromAlbum);
    var nextIdx = songIdx-1;
    if(nextIdx < 0)
    { nextIdx = currentAlbum.songs.length-1; }
    
    // reset old song row to song nbr
    var songCell = getSongNumberCell(currentlyPlayingSongNumber);
    songCell.html(currentlyPlayingSongNumber);
    
    // set next song 
    setSong(nextIdx+1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    // set next song row to pause button
    songCell = getSongNumberCell(currentlyPlayingSongNumber);
    songCell.html(pauseButtonTemplate);
};

var updatePlayerBarSong = function()
{
    $(".currently-playing .song-name").text(currentSongFromAlbum.name);
    $(".currently-playing .artist-name").text(currentAlbum.artist);
    $(".currently-playing .artist-song-mobile").text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    
    if(songPaused)
    {  $('.main-controls .play-pause').html(playerBarPlayButton);  }
    else
    {  $('.main-controls .play-pause').html(playerBarPauseButton);  }
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.length));
};
  
// album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

 // Store state of playing songs
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var musicPath = 'C:\\\\Users\\W\\bloc\\bloc-jams';
 var currentVolume = 80;

 var songPaused = false;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

$(document).ready(function()
{ 
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});