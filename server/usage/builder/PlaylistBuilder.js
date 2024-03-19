const Playlist = require("../../model/playlist");
const Builder = require("./Builder");

class PlaylistBuilder extends Builder{
    playlistBuilder(playlistId, userId, title, isPublic){
        this.playlistId = playlistId;
        this.userId = userId;
        this.title = title;
        this.isPublic = isPublic;
    }

    playlistWithGenre(genre){
        this.genre = genre;
    }

    playlistWithListAudio(listAudio){
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
module.exports = PlaylistBuilder;