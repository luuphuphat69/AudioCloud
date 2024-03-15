const Playlist = require("../../model/playlist");
const PlaylistBuilder = require("./PlaylistBuilder");

class PlaylistConcreateBuilder extends PlaylistBuilder{
    setPlaylistId(playlistId){
        this.playlistId = playlistId;
    }
    setUserId(userId){
        this.userId = userId;
    }
    setTitle(title){
        this.title = title;
    }
    setGenre(genre){
        this.genre = genre;
    }
    setIsPublic(isPublic){
        this.isPublic = isPublic;
    }
    setListAudio(listAudio){
        this.listAudio = listAudio;
    }
    build(){
        return new Playlist({
            PlaylistId: this.playlistId,
            UserId: this.userId,
            Title: this.title,
            Genre: this.genre,
            IsPublic: this.isPublic,
            ListAudio: this.listAudio,
        })
    }
}
module.exports = PlaylistConcreateBuilder;