import mongoose, { isValidObjectId, mongo } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    const { name, description } = req.body;

    if (!(name || description)) {
        throw new ApiError(400, "required field name or description")
    }

    const playlist = await Playlist.create(
        {
            name: name.toLowerCase(),
            description: description,
            videos: [],
            owner: req.user._id
        }
    )

    const createdPlaylist = await Playlist.findById(playlist._id)

    if (!createPlaylist) {
        throw new ApiError(400, "Error while creating playlist")
    }

    return res.status(200).json(
        new ApiResponse(200, createdPlaylist, "Playlist Successfully created")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists

    const { userId } = req.params
    
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid UserId")
    }

    const getUserPlaylists = await User.aggregate([
        {
            $match: {
                _id : new mongoose.Types.ObjectId(userId)
            }

        },
        {
            $lookup: {
                from: "playlists",
                localField: "_id",
                foreignField: "owner",
                as: "UserPlaylists"
            }
        },
        {
            $project:{
                UserPlaylists: 1,
            }
        }

    ])

    if (!getUserPlaylists) {
        throw new ApiError(400, "Error while accessing User Playlist")
    }

    return res.status(200).json(
        new ApiResponse(200, getUserPlaylists, "User Playlist")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id

    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid PlaylistId")
    }

    const getPlaylist = await Playlist.findById({
        _id: playlistId
    })


    if (!getPlaylist) {
        throw new ApiError(400, "Error while accessing playlist")
    }

    return res.status(200).json(
        new ApiResponse(200, getPlaylist, "playlist fetched successfully")
    )

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!(playlistId && isValidObjectId(videoId))) {
        throw new ApiError(400, "playlistId and Video required")
    }

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

    if(!(playlistId && videoId)){
        throw new ApiError(400,"playlistId and videoId is required")
    }

    const playlist = Playlist.findById(
        {
            id:playlistId
        }
    )

    if(!playlist){
        throw new ApiError(400, "Error while deleting video")
    }

    const removeVideoFromPlaylist = playlist.videos.filter(video => video.id !==  videoId)

    playlist.videos = removeVideoFromPlaylist

    await playlist.save()

    return res.status(200).json(
        new ApiResponse(200, "video deleted from playlist")
    )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist

    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "playlistId Missing")
    }

    const deletePlaylist = await Playlist.deleteOne(
        {
            _id: playlistId
        }
    )

    if (!deletePlaylist) {
        throw new ApiError(400, "Error while deleting playlist")
    }

    return res.status(200).json(
        new ApiResponse(200, deletePlaylist, "playlist deleted successfully")
    )

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
})


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
