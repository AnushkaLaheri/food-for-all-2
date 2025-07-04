import Donation from "../models/Donation.js"
import User from "../models/User.js"

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Donation.aggregate([
      {
        $group: {
          _id: "$user",
          donations: { $sum: 1 },
          impact: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $addFields: {
          name: "$userDetails.name",
          avatar: "$userDetails.avatar",
          level: {
            $switch: {
              branches: [
                { case: { $gte: ["$donations", 30] }, then: "Gold" },
                { case: { $gte: ["$donations", 20] }, then: "Silver" },
                { case: { $gte: ["$donations", 10] }, then: "Bronze" },
              ],
              default: "Supporter",
            },
          },
          progress: { $mod: ["$impact", 100] },
        },
      },
      { $sort: { impact: -1 } },
      { $limit: 20 },
    ])

    res.json(leaderboard)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
