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

// Assignment 25: create third album object
var thirdAlbum = 
{
     name: 'Album 3',
     artist: 'Singer 3',
     label: 'Label 3',
     year: '2033',
     albumArtUrl: 'assets/images/album_covers/15.png',
     songs: [
         { name: 'Song3.1', length: '1:01' },
         { name: 'Song3.2', length: '3:02' },
         { name: 'Song3.3', length: '4:03'},
         { name: 'Song3.4', length: '3:04' },
         { name: 'Song3.5', length: '2:05'}
     ]
};

var createSongRow = function(songNumber, songName, songLength) 
{
     
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template; 
};


var setCurrentAlbum = function(album) 
{ 
     // #1
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
     var objAlbum = document.getElementById('objAlbum');
 
 
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
 
var albumObj = "";
window.onload = function() 
{   
     setCurrentAlbum(albumPicasso);    
     albumObj = albumPicasso;
};


document.getElementsByClassName("album-cover-art")[0].addEventListener("click", displayAlbum);
function displayAlbum() 
{
    var albums = [albumPicasso, albumMarconi, thirdAlbum];
    
    var i = albums.indexOf(albumObj);
    if (i === (albums.length)-1){ i = 0; }
    else{ i = i+1; }   
    
    albumObj = albums[i];  // save album obj for next click
    setCurrentAlbum(albums[i]);
}
                        
                        
                        
                        
                        
                        