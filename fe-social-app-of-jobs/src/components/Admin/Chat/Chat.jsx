import { ConfigProvider, message as notify, Skeleton, Spin } from "antd";
import { useNavigate, useOutletContext } from "react-router-dom";

import clsx from "clsx";
import axios from "axios";

import { LoadingOutlined } from '@ant-design/icons';

import styles from "./Chat.module.css";
import { useEffect, useRef, useState } from "react";
import InputTexting from "../InputTexting/InputTexting";

const primaryColor = "#00b14f";

function timeDifference(startDate) {
  const start = new Date(startDate);
  const end = new Date();
  const diffInMs = Math.abs(end - start);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 12 * month;

  if (diffInMs < hour) {
    const minutes = Math.floor(diffInMs / minute);
    return `${minutes} phút`;
  } else if (diffInMs < day) {
    const hours = Math.floor(diffInMs / hour);
    return `${hours} giờ`;
  } else if (diffInMs < month) {
    const days = Math.floor(diffInMs / day);
    return `${days} ngày`;
  } else if (diffInMs < year) {
    const months = Math.floor(diffInMs / month);
    return `${months} tháng`;
  } else {
    const years = Math.floor(diffInMs / year);
    return `${years} năm`;
  }
}

function Chat({ socket }) {
  const { admin } = useOutletContext();

  const nav = useNavigate();
  
  const [listFriends, setListFriends] = useState(null);
  const [chatWith, setChatWith] = useState(null);

  const [sentMessages, setSentMessages] = useState(null);

  const chatFrameRef = useRef(null);

  const [messageApi, contextHolder] = notify.useMessage();

  const handleSendMessage = (message) => {
    const text = message.trim();
    if (text) {
      const payload = {
        senderId: admin._id,
        receiverId: chatWith.member._id,
        content: text,
      };

      socket.emit("sender", payload);
      setSentMessages(prev => [...prev, {
        _id: Date.now(),
        ...payload,
        sentAt: Date.now(),
      }]);
    }
  }

  const handleReceiveMessage = (data) => {
    // console.log(data, chatWith?.member._id);
    if (data.load)
      setSentMessages(data.messages);
    else {
      // console.log(data);
      setSentMessages(prev => [...prev, ...data]);
    }
  }

  const handleLoadMessage = ({ owner, friend }) => {
    // if (!chatWith || friend._id === chatWith?._id) {
    // } else {
    // }
    socket.emit("leave");
    setSentMessages(null);
    socket.emit("load", { owner, friend: friend.member._id });
  }

  useEffect(() => {
    // console.log("Chat.jsx call api");
    axios.get("http://localhost:8000/api/admin/list/admin", {
      withCredentials: true,
    })
      .then(res => {
        // console.log(res.data.members);
        socket.on("receiver", handleReceiveMessage);
        setListFriends(res.data.members.filter(friend => friend._id !== admin.uid));
      })
      .catch(err => {
        console.log(err);
        messageApi.error(`Đã có lỗi xảy ra: ${err?.response?.data?.message}`);
        const code = err.response.status;
        if (code === 401 || code === 403)
          nav("/login");
      })

    return () => {
      socket.off("receiver", handleReceiveMessage);
      socket.emit("leave");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatFrameRef && chatFrameRef?.current)
      chatFrameRef.current.scrollTop = chatFrameRef.current.scrollHeight;
  }, [sentMessages]);

  return (
    <div className={styles.chat}>
      {contextHolder}
      <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultActiveBg: "#00b15060",
              defaultActiveColor: primaryColor,
              defaultHoverColor: primaryColor,
              defaultColor: "#02c95b",
            },
            Input: {
              primaryColor: primaryColor,
              hoverBorderColor: "#02c95b",
              activeBorderColor: primaryColor,
            },
          }
        }}
      >
        <div className={styles.friends}>
          {/* Friends
          <Button onClick={() => { socket.io.engine.close();}} >Disconnect</Button> */}
          {listFriends ? listFriends.map((friend) => (
            <div className={clsx([styles.friend, friend._id === chatWith?._id ? styles.select : null])}
              key={friend._id}
              onClick={() => {
                setChatWith(friend);
                handleLoadMessage({ owner: admin._id, friend: friend });
              }}
            >
              <div className={clsx([styles.avatarWrapper, friend.member.online ? styles.active : null])}>
                <img src={friend.member.avatar} alt={friend.member.fullName} className={styles.avatar} />
              </div>
              <div className={styles.info}>
                <h4>{friend.member.fullName}</h4>
                <p>Hãy gửi lời chào trước khi bắt đầu nhắn tin nhé!</p>
              </div>
            </div>
          )) : ([...Array(3)].map((_, index) => (
            <div className={styles.friend} key={index}>
              <Skeleton.Avatar active shape="circle" size="large" />
              <div className={styles.info}>
                <Skeleton.Input active size="default" />
              </div>
            </div>
          )))}
        </div>

        <div className={styles.content}>
          {chatWith ? (<>
            <div className={styles.header}>
              <div className={clsx([styles.avatarWrapper, chatWith.member.online ? styles.active : null])}>
                <img src={chatWith.member.avatar}
                  alt={chatWith.member.fullName} className={styles.avatar}
                />
              </div>
              <div className={styles.info}>
                <h4>{chatWith.member.fullName}</h4>
                <p>{chatWith.member.online
                  ? "Đang hoạt động"
                  : (chatWith.member.onlineAt
                    ? `Hoạt động ${timeDifference(chatWith.member.onlineAt)} trước`
                    : "Không xác định")}</p>
              </div>
            </div>
            <div className={styles.contentWrapper}>
              <div className={styles.messages} ref={chatFrameRef}>
                {sentMessages !== null ? (sentMessages.length > 0 ? (
                  sentMessages.map(message => message.senderId === admin._id ? (
                    <div className={styles.yourMessage} key={message._id}>
                      <div className={styles.messageWrapper}>{message.content}</div>
                    </div>
                  ) : (
                    <div className={styles.friendMessage} key={message._id}>
                      <div className={styles.messageWrapper}>{message.content}</div>
                    </div>
                  )
                  )) : chatWith ? (<div className={styles.firstMessage}>
                    <div className={styles.avatarWrapper}>
                      <img src={chatWith.member.avatar}
                        alt={chatWith.member.fullName} className={styles.avatar}
                      />
                    </div>
                    <h3>{ chatWith.member.fullName }</h3>
                    <p>Hãy bắt đầu cuộc trò chuyện bằng một lời chào 😍</p>
                  </div>) : (<></>))
                  : (<div className={styles.loading}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: "32px", color: "#00b14f" }} spin />} />
                  </div>)
                }
              </div>

              <InputTexting handleSendMessage={handleSendMessage} />
            </div>
          </>) : (<div className={styles.requireChooseConversation}>
            <img src="/no-conversation.png" alt="Không có cuộc trò chuyện nào" className={styles.imgNoConversation} />
            <p>Bạn hiện không chọn cuộc trò chuyện nào...</p>
          </div>)}
        </div>
      </ConfigProvider>
    </div>
  );
}

export default Chat;