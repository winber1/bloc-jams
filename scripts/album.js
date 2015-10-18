var createSongRow = function(songNumber, songName, songLength) 
{     
     var template =
        '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + songLength + '</td>'
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
             if(songPaused)
             {  $(this).html(pauseButtonTemplate); }
             else
             {  $(this).html(playButtonTemplate); }
             songPaused = !songPaused;
         }
         // change row selection to pause button
         else 
         { 
             $(this).html(pauseButtonTemplate);  
             currentlyPlayingSongNumber = songNbr; 
             currentSongFromAlbum = currentAlbum.songs[songNbr - 1];
             songPaused = false;
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
console.log("songNbr type is " + typeof songNbr + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
     };
    
     // attach event listeners to row
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
    
     return $row;
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
    
    // reset previous song row to song nbr
    $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(currentlyPlayingSongNumber);
    
    currentSongFromAlbum = currentAlbum.songs[nextIdx];
    currentlyPlayingSongNumber = nextIdx+1;
    updatePlayerBarSong();
    
    // set next song row to pause button
    $(".song-item-number[data-song-number = " + currentlyPlayingSongNumber + "]").html(pauseButtonTemplate);
    
};

var previousSong = function()
{
    var songIdx = trackIndex(currentAlbum, currentSongFromAlbum);
    var nextIdx = songIdx-1;
    if(nextIdx < 0)
    { nextIdx = currentAlbum.songs.length-1; }
    
    // reset previous song row to song nbr
    $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]').html(currentlyPlayingSongNumber);
    
    currentSongFromAlbum = currentAlbum.songs[nextIdx];
    currentlyPlayingSongNumber = nextIdx+1;
    updatePlayerBarSong();
    
    // set next song row to pause button
    $(".song-item-number[data-song-number = " + currentlyPlayingSongNumber + "]").html(pauseButtonTemplate);
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
};
  
// album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
 // var currentlyPlayingSong = null;
 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;

 var songPaused = false;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

$(document).ready(function()
{ 
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});