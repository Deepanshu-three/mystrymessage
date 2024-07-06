import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User"
import { Message } from "@/model/User";

export async function POST(request: Request){

    await dbConnect()

    const {username, content} = await request.json()

    try {
        
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json(
                {
                  success: false,
                  messages: "user not found",
                },
                {status: 404}
            );
        }

        //is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                  success: false,
                  messages: "user is not accepting the messages",
                },
                {status: 403}
              );
        }

        const newMessage = {content, createdAt: new Date()}

        user.messages.push(newMessage as Message)

        await user.save()

        return Response.json(
            {
              success: true,
              messages: "message sent successfully",
            },
            {status: 400}
          );

    } catch (error) {
        console.log("An unexoeced error occured: ", error)
        return Response.json(
            {
              success: false,
              messages: "error sending message",
            },
            {status: 500}
        );
    }

}