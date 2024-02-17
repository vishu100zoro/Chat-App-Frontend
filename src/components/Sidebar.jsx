import React, { useContext, useEffect } from 'react'
import { Col, ListGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';
import { addNotifications, resetNotifications } from '../features/userSlice';
import './Sidebar.css'
const Sidebar = () => {
    // const roomss =["first room","second room","third room"];
    const user =useSelector((state)=>state.user);
    const dispatch =useDispatch();
    const {socket,currentRoom,setCurrentRoom,members,setMembers,privateMemberMsg,SetPrivateMemberMsg,rooms,setRooms,}= useContext(AppContext);

    function joinRoom (room,isPublic=true){
        if(!user){
            return alert ("please login")
        }
        socket.emit("join-room",room,currentRoom);
        setCurrentRoom(room);
        if(isPublic){
            SetPrivateMemberMsg(null);
        }
        dispatch(resetNotifications (room));
        
    }
    socket.off('notifications').on('notifications', (room)=>{
        if(currentRoom!==room)dispatch(addNotifications(room));
    })
    useEffect(()=>{
        if(user)
        {
            setCurrentRoom("general");
            getRooms();
            socket.emit("join-room","general");
            socket.emit("new-user");
        }
        // eslint-disable-next-line 
    },[])

    socket.off("new-user").on("new-user",(payload)=>{
        // console.log(payload);
        setMembers(payload);
    })

    function getRooms() {
       fetch("https://chat-app-hnfd.onrender.com/rooms")
       .then((res)=> res.json())
       .then((data)=> setRooms(data));
    }

    function orderIds(Id1, Id2){
        if(Id1>Id2) 
         {return Id1+'-'+Id2;}
        else 
         {return Id2+'-'+Id1;}
    }
    function handlePrivateMemberMsg(member){
        SetPrivateMemberMsg(member);
        const roomId=orderIds(user?._id, member?._id);
        joinRoom(roomId, false);
    }
    if(!user){
        return <></>;
    }

    // console.log(user?.newMessage[rooms[0]]);
  return (
    <>
        <h2>Available Rooms</h2>
        <ListGroup>
            {
                rooms.map((room,idx)=>(
                    <ListGroup.Item key={idx} active={room===currentRoom} onClick={()=>joinRoom(room)} style={{cursor:"pointer", display:"flex",justifyContent:"space-between"}}>
                    {room} 
                    {currentRoom !== room && <span className="badge rounded-pill bg-primary">{user.newMessage[room]}</span>}
                    
                    </ListGroup.Item>
                ))
            }
        </ListGroup>
        <h2>Members</h2>
        {
                members.map((member)=>(
                    <ListGroup.Item key={member._id} style={{cursor:"pointer"}} active={privateMemberMsg?._id===member?._id} onClick={()=>handlePrivateMemberMsg(member)} disabled={member?._id===user?._id}>
                     <Row>
                        <Col xs={2} className='member-status'>
                         <img src={member.picture} className='member-status-img' alt="Photo"/>
                         {member.status==='online'? <i className='fas fa-circle sidebar-online-status'></i>:<i className='fas fa-circle sidebar-offline-status'></i>}
                        </Col>
                        <Col xs={9}>
                          {member.name}
                          {member._id===user?._id && " (You)"}
                          {member.status==="offline" && " (Offline)"}
                        </Col>
                        <Col xs={1}>
                        <span className='badge rounded-pill bg-primary'>{user.newMessage[orderIds(member._id,user._id)]}</span>

                        </Col>
                     </Row>
                    </ListGroup.Item>
                ))
            }
    </>
  )
}

export default Sidebar