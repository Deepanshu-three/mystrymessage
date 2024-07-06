import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function POST(request: Request) {

    await dbConnect();

    const session = await getServerSession(authOptions);
  
    const user: User = session?.user as User;
  
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          messages: "Not authenticates",
        },
        {status: 400}
      );
    }
  
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        
        const user = await UserModel.aggregate([
            { $match : {id: userId}}, 
            { $unwind: '$messages'},
            { $sort: {'messages.createdAt': -1}},
            { $group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if(!user || user.length === 0){
            return Response.json(
                {
                  success: false,
                  messages: "user not found",
                },
                {status: 400}
              );
        }

        return Response.json(
            {
              success: true,
              messages: user[0].messages,
            },
            {status: 200}
          );

    } catch (error) {
        console.log("error occured: ", error)
        return Response.json(
            {
              success: false,
              messages: "error getting messages",
            },
            {status: 400}
        );
    }

}