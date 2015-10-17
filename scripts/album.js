// Example Album
var albumPicasso = 
{
     name: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { name: 'Blue', length: '4:26' },
         { name: 'Green', length: '3:14' },
         { name: 'Red', length: '5:01' },
         { name: 'Pink', length: '3:21'},
         { name: 'Magenta', length: '2:15'}
     ]
};
 
 // Another Example Album
var albumMarconi = 
{
     name: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { name: 'Hello, Operator?', length: '1:01' },
         { name: 'Ring, ring, ring', length: '5:01' },
         { name: 'Fits in your pocket', length: '3:21'},
         { name: 'Can you hear me now?', length: '3:14' },
         { name: 'Wrong phone number', length: '2:15'}
     ]
};

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
         // if song playing now, reset all row htmls to song nbr
         if (currentlyPlayingSong) 
         { 
            var songItem = $(document).find('.song-item-number');  
             
            songItem.each
            (
                function(i,item)
                {  $(item).html(i+1);  }
            );
             
         /*    
            {
                songItem[i].text(i);
                songItem.
                //$("#w3s").attr("href", "http://www.w3schools.com/jquery");
            }*/
         }     
         
         // song selection stayed the same - pause it
         if( currentlyPlayingSong === $(this).attr("data-song-number"))
         { 
             if(songPaused)
             {  $(this).html(pauseButtonTemplate); }
             else
             {  $(this).html(playButtonTemplate); }
             //currentlyPlayingSong = null;
             songPaused = !songPaused;
         }
         // change row selection to pause button
         else 
         { 
             $(this).html(pauseButtonTemplate);  
             currentlyPlayingSong = $(this).attr("data-song-number"); 
             songPaused = false;
         }  
     };
    
     
     var onHover = function(event) 
     {
         var songItem = $(this).find('.song-item-number');
         
         if (songItem)
         {
             if( songItem.attr("data-song-number") !== currentlyPlayingSong)
             { songItem.html(playButtonTemplate); }     
         }
     };
     var offHover = function(event) 
     {
         var songItem = $(this).find('.song-item-number');
         if( songItem.attr("data-song-number") !== currentlyPlayingSong )
         { songItem.html(songItem.attr("data-song-number")); }  
     };
    
     // attach event listeners to row
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
    
 //   $row.click(clickHandler);
     return $row;
};

var setCurrentAlbum = function(album) 
{ 
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
  
// album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
 var currentlyPlayingSong = null;
 var songPaused = false;

$(document).ready(function()
{ setCurrentAlbum(albumPicasso);  });