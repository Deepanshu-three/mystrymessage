import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

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

  const userId = user._id;

  const  {acceptMessages} = await request.json()

  try {

    const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessage: acceptMessages},
        {new: true}
    )

    if(!updatedUser){
        return Response.json(
            {
              success: false,
              messages: "falied to update user to accept message",
            },
            {status: 401}
          );
    }

    return Response.json(
        {
          success: true,
          messages: "message acceptance status updated successfully",
        },
        {status: 200}
      );
    
  } catch (error) {
    console.log("falied to update user status")
    return Response.json(
        {
          success: false,
          messages: "falied to update user status",
        },
        {status: 500}
      );
  }

}

export async function GET(request: Request){

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

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId)
  
    if(!foundUser){
      return Response.json(
          {
            success: false,
            messages: "user not found",
          },
          {status: 401}
        );
      }
  
      return Response.json(
          {
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage,
          },
          {status: 200}
        );
  } catch (error) {
    console.log("falied to update user status")
    return Response.json(
        {
          success: false,
          messages: "Erorr in getting message acceptance status",
        },
        {status: 500}
      );
  }


}
