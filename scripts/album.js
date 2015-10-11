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
 
     return template; 
};

var findParentbyClassName = function(element, className)
{
    var parent = null;
    
    // check for existence of parent
    if( parent = element.parentElement )
    { 
        // check for last possible parent; avoid infinite loop; 
        if( parent.nodeName.toUpperCase() != 'BODY' )
        {
            while(parent.className != className && parent.nodeName != 'body' )
            { parent = parent.parentElement; }
        }
        // parent with param className not found
        else{ alert("No parent found with that class name"); }
    }
    else // element param has no parent
    { alert("No parent found"); }
    
    return parent;  
    
    // ??? check != body; maybe exit sooner
};

var getSongItem = function(element)
{ 
/* - table: album-view-song-list ----------- */    
/* - tr: album-view-song-item -------------- */
/* -- td: song-item-number -- td: song-item-name -- td: song-item-duration- */  
/*-----   within song-item-number: <album-song-button><ion-play></></>  ----*/    
    switch (element.className) 
    {
        // click within .song-item-number <td>
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentbyClassName(element, 'song-item-number');
        // click within <tr>
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        // click within <td> sibling: get parent, then find <td> by class
        case 'song-item-title':
        case 'song-item-duration':
            return findParentbyClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        // click within song-item-number <td>
        case 'song-item-number':
            return element;
        default:
            return;     
    };
};


var setCurrentAlbum = function(album) 
{ 
     // #1
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     // #2
     albumTitle.firstChild.nodeValue = album.name;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     // #3
     albumSongList.innerHTML = '';
 
     // #4
     for (i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
     }
};

 var clickHandler = function(targetElement) 
 {
     var songItem = getSongItem(targetElement);

     if (currentlyPlayingSong === null) 
     {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     } 
     else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) 
     {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
  
     } 
     else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) 
     {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }
 };
 
// Elements we'll be adding listeners to
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
 
// album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
 var currentlyPlayingSong = null;

window.onload = function() 
{   
    setCurrentAlbum(albumPicasso);  
    
    songListContainer.addEventListener('mouseover', function(event) 
        {
            if (event.target.parentElement.className === 'album-view-song-item') 
            {
                var songItem = getSongItem(event.target);

                if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong)     
                {
                    songItem.innerHTML = playButtonTemplate;
                }
            }
        });
    
    for (i = 0; i < songRows.length; i++) 
    {
         songRows[i].addEventListener('mouseleave', function(event) 
            {
                var songItem = getSongItem(event.target);
                var songItemNumber = songItem.getAttribute('data-song-number');
 
                // #2
                if (songItemNumber !== currentlyPlayingSong) 
                {
                    songItem.innerHTML = songItemNumber;
                }
            });
        
         songRows[i].addEventListener('click', function(event) 
         {
                clickHandler(event.target);
         });
    }
};