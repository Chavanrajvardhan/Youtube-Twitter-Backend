import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    //get video id and check validation
    //check like satus 
    //if alrady exist delete it else add like
    //save it in db 
    //send responce

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid VideoId")
    }

    const isLiked = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    })

    console.log(isLiked)
    let like, unlike;

    if (isLiked === "" || isLiked === null) {
        like = await Like.create(
            {
                video: videoId,
                likedBy: req.user?._id
            }
        )

        if (!like) {
            throw new ApiError(400, "somthing went wrong while liking the video")
        }
    }
    else {
        unlike = await Like.deleteOne({
            video: videoId,
            likedBy: req.user?._id
        })

        if (!unlike) {
            throw new ApiError(400, "somthing went wrong while unliking the video")
        }
    }


    return res.status(200).json(
        new ApiResponse(200, like || unlike, "ToggleVideoLike Successfull")
    )


})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    //get comment id and validate it 
    //check comment already liked or not
    //if liked then unlike else like
    //save it in db
    //send responce 
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid CommentId");
    }

    const isLiked = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    })

    let like, unlike;
    if (isLiked === "" || isLiked === null) {
        like = await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        })

        if (!like) {
            throw new ApiError(400, "Somthing went wrong while liking Comment")
        }
    }
    else {
        unlike = await Like.deleteOne({
            comment: commentId,
            likedBy: req.user?._id
        })

        if (!unlike) {
            throw new ApiError(400, "Somthing went wrong while unliking Comment")
        }
    }

    return res.status(200).json(
        new ApiResponse(200, like || unlike, "toggleCommentLike successfull")
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet

    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid TweetId")
    }

    const isLiked = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    let like, unlike;

    if (isLiked === "" || isLiked === null) {
        like = await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id
        })

        if (!like) {
            throw new ApiError(400, "Somthing went wrong while liking Tweet")
        }
    }
    else {
        unlike = await Like.deleteOne({
            tweet: tweetId,
            likedBy: req.user?._id
        })

        if (!unlike) {
            throw new ApiError(400, "Somthing went wrong while unliking Tweet")
        }
    }

    return res.status(200).json(
        new ApiResponse(200, like || unlike, "toggleTweetLike successfull")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const getLikedVideos = await Like.aggregate([
        {
            $match: { likedBy: new mongoose.Types.ObjectId(req.user?._id) }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedvideos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner"
                        }
                    },
                    {
                        $unwind: "$owner"
                    }
                ],
            },
        },
        {
            $unwind: "$likedvideos"
        },

        {
            $sort: {
                createdAt: -1,
            },
        },

        {
            $project: {
                likedvideos: {
                    "videoFile.url": 1,
                    "thumbnail.url": 1,
                    owner: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    duration: 1,
                    createdAt: 1,
                    isPublished: 1,
                    ownerDetails: {
                        username: 1,
                        fullName: 1,
                        "avatar.url": 1,
                    },
                },
            },
        },

    ])

    if (!getLikedVideos) {
        throw new ApiError(400, "Somthing went wrong while fetching liked video")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                getLikedVideos,
                "liked videos fetched successfully"
            )
        );
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}