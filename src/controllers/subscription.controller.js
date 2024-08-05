import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "ChanelId Missing")
    }

    const isSubscribed = await Subscription.findById(
        {
            subscriber: req.users?._id,
            channel: channelId
        }
    )

    if (isSubscribed) {
        await Subscription.findByIdAndDelete({ isSubscribed: _id })

        return res.status(200).json(
            new ApiResponse("200", { isSubscribed: false }, "Unsubscribed")
        )
    }

    await Subscription.create(
        {
            subscriber: req.users?._id,
            channel: channelId
        }
    )

    return res.status(200).json(
        new ApiResponse(200, { isSubscribed: true }, "Subscribed Successfully")
    )

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid Channel ID")
    }
    
    const channel = await Subscription.findById(channelId)

    if(!channel){
        throw new ApiError(400, "Channel dose not exist")
    }

    const subscribers = await Subscription.findById({channelId}).populate(subscribers)
    
    if (!subscribers) {
        throw new ApiError(400, "Error while fetchig sunscribers of channel")
    }

    const subscriberCount = await Subscription.countDocuments({
        channel: channelId
    })

    return res.status(200)
    .json(200, {subscribers,subscriberCount}, "Subscriber list fetched Successfully")


})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params  

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriberId")
    }

    const subscriptions = await Subscription.findById(subscriberId).populate("channel")

    if (!subscriptions) {
        throw new ApiError(400, "Error while fetchig subscriptions channel")
    }


    const subscriptionsCount = await Subscription.countDocuments({
        subscriber: subscriberId
    })

    return res.status(200)
        .json(
            new ApiResponse(200, {subscriptionsCount, subscriptions}, "Channel details fetched Successfully")
        )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}