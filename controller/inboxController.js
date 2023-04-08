// external imports
const createError = require("http-errors");

// internal imports
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const People = require("../models/People")


async function getCreatorImgUrl(id){
    try{
        const userDetail = await People.find({"_id": id});
        return `http://localhost:${process.env.PORT}/profile/${userDetail[0].avatar}`;
    }catch(err){
        console.log(err)
    }
    
}

// get conversations
async function getConversations(req, res, next) {
    try {
       
      const conversations = await Conversation.find({
        $or: [
          { "creator.id": req.user.id },
          { "participant.id": req.user.id },
        ],
      });

      res.status(200).json({
        success: true,
        response_code: 200,
        conversations: await Promise.all(conversations.map( async conversation => {
            return {
                id: conversation._id,
                creator:{
                    id: conversation.creator.id,
                    name: conversation.creator.name,
                    url:  req.user.id == conversation.participant.id ?await getCreatorImgUrl(conversation.creator.id):null,
                },
                participant:{
                    id: conversation.participant.id,
                    name: conversation.participant.name,
                    url: conversation.participant.url
                },
                last_msg: await Message.find({"conversation_id":conversation._id}).sort({"createdAt":-1}),
                created_at: conversation.createdAt,
            }
        }))
      })
    } catch (err) {
      next(err);
    }
  }


// add conversation
async function addConversation(req,res,next){
    try{
        const existingUser = await Conversation.find({
            $or: [
                {"creator.id":req.user.id,"participant.id":req.body.id},
                {"creator.id":req.body.id,"participant.id":req.user.id},
              ],
        });
        const newConversation = new Conversation({
            creator:{
                id: req.user.id,
                name: req.user.username,
            },
            participant: {
                name: req.body.participant,
                id: req.body.id,
                url: req.body.url
            },
        });

        
        if(!existingUser.length){
            const result = await newConversation.save();
            res.status(200).json({
                success: true,
                response_code: 200,
                newConversation: {
                    id: result._id,
                    creator: result.creator,
                    participant: result.participant,
                    last_msg: null,
                    created_at: result.createdAt
                }
              });
        }else{
            res.status(200).json({
                success: true,
                response_code: 400,
                message: "User already exists!"
            })
        }
    }
    catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}



// get messages of a conversation
async function getMessages(req, res, next) {
    try {
      const messages = await Message.find({
        conversation_id: req.query.id,
      }).sort("-createdAt");
  
      res.status(200).json({
        success: true,
        response_code: 200,
        messages:messages.map(msg => {
            return {
                sender: {
                    ...msg.sender
                },
                receiver:{
                    ...msg.receiver
                },
                id: msg._id,
                text: msg.text,
                attachment: msg.attachment,
                conversation_id: msg.conversation_id,
                date_time: msg.date_time,
                createdAt: msg.createdAt,
                updatedAt: msg.updatedAt
            }
        }),
        conversation_id: req.query.id,
      });

    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  }



  // send new message
async function sendMessage(req, res, next) {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      // save message text/attachment in database
      let attachments = null;

      if (req.files && req.files.length > 0) {
        attachments = [];

        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }
      const newMessage = new Message({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.user.id,
          name: req.user.username,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();

      // emit socket event
      global.io.emit(`test-msg`,newMessage);


      res.status(200).json({
        success: true,
        response_code: 200,
        message: result,
      });
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: "message text or attachment is required!",
      },
    });
  }
}

module.exports = {addConversation,getConversations,getMessages,sendMessage}