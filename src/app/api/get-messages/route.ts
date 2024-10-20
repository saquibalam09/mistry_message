import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id); // Ensure it's an ObjectId , When is this necessary?If you're working with data where _id might be a string (e.g., after a JSON conversion) or if you explicitly need to ensure the type is an ObjectId for consistency in your operations.
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    if (!user || user.length === 0) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: user[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
