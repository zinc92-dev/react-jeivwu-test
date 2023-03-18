import React, { useEffect, useState, useMemo, useRef } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import './style.css';
import liff from '@line/liff';
import jwt from 'jwt-decode';
import axios from 'axios';
import { CopyBlock, dracula } from 'react-code-blocks';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import emojis from './emojis.json';
import stickers from './stickers.json';
import parse from 'html-react-parser';
import ReactPlayer from 'react-player';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';

// import './services/firebase.js';
const API_BASE_URL =
  'https://asia-east2-minenoti-app.cloudfunctions.net/service';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDibIuRKmTgmsE4ZWfsor8a8JmmpM8LN3s',
  authDomain: 'minenoti-app.firebaseapp.com',
  projectId: 'minenoti-app',
  storageBucket: 'minenoti-app.appspot.com',
  messagingSenderId: '1175334579',
  appId: '1:1175334579:web:b116aec0a4f70445ed0ac6',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import {
  useCollection,
  useCollectionData,
} from 'react-firebase-hooks/firestore';

export default function Admin() {
  const [currentChatroom, setCurrentChatroom] = useState();

  const chatWithUser = async (contact_id) => {
    // Create if not exist
    const chatRef = doc(
      db,
      'teams',
      'BX2Of0mhQD9QzoENx3xE',
      'campaigns',
      'TtZGMe0NC4uHk50vsIpX',
      'line-oa-chat',
      contact_id
    );
    const chatSetting = {
      type: 'user',
      users: [],
    };
    await setDoc(chatRef, chatSetting, { merge: true });

    // Set currentChatroom
    setCurrentChatroom(contact_id);
    return;
  };

  const deleteChat = async (chat_id) => {
    const chatRef = doc(
      db,
      'teams',
      'BX2Of0mhQD9QzoENx3xE',
      'campaigns',
      'TtZGMe0NC4uHk50vsIpX',
      'line-oa-chat',
      chat_id
    );
    await deleteDoc(chatRef);
    setCurrentChatroom(null);
    return;
  };

  const dataConverter = {
    // toFirestore(post) {
    //   return { author: post.author, title: post.title };
    // },
    fromFirestore(snapshot, options) {
      const data = snapshot.data(options);
      return {
        id: snapshot.id,
        ref: snapshot.ref,
        ...data,
      };
    },
  };
  // contacts
  const contactsQuery = useMemo(() => {
    const contactsRef = collection(
      db,
      'teams',
      'BX2Of0mhQD9QzoENx3xE',
      'campaigns',
      'TtZGMe0NC4uHk50vsIpX',
      'line-oa-subscribers'
    );
    const queryData = contactsRef.withConverter(dataConverter);
    return queryData;
  }, []);
  const [contacts, loadingContacts, errorContacts, snapshotContacts] =
    useCollectionData(contactsQuery);

  // chatRooms
  const chatsQuery = useMemo(() => {
    const chatsRef = collection(
      db,
      'teams',
      'BX2Of0mhQD9QzoENx3xE',
      'campaigns',
      'TtZGMe0NC4uHk50vsIpX',
      'line-oa-chat'
    );
    const queryData = chatsRef.withConverter(dataConverter);
    return queryData;
  }, []);
  const [chatRooms, loadingChatRooms, errorChatRooms, snapshotChatRooms] =
    useCollectionData(chatsQuery);

  useEffect(() => {
    if (chatRooms && chatRooms.length == 1) setCurrentChatroom(chatRooms[0].id);
  }, [chatRooms]);

  // chatMessages
  const messagesQuery = useMemo(() => {
    if (!currentChatroom) return;
    const messagesRef = collection(
      db,
      'teams',
      'BX2Of0mhQD9QzoENx3xE',
      'campaigns',
      'TtZGMe0NC4uHk50vsIpX',
      'line-oa-chat',
      currentChatroom,
      'messages'
    );
    const queryData = query(messagesRef, orderBy('created_dt')).withConverter(
      dataConverter
    );
    return queryData;
  }, [currentChatroom]);
  const [
    chatMessages,
    loadingChatMessages,
    errorChatMessages,
    snapshotChatMessages,
  ] = useCollectionData(messagesQuery);

  // console.log('contacts', contacts);
  // console.log('chatRooms', chatRooms);
  // console.log('chatMessages', chatMessages);

  return (
    <ThemeProvider theme={theme}>
      <h1>Admin</h1>
      <div>Contacts</div>
      {errorContacts && <strong>Error: {JSON.stringify(errorContacts)}</strong>}
      {loadingContacts && <span>Contacts Loading...</span>}
      {contacts &&
        contacts.map((contact) => {
          return <Contact {...contact} chatWithUser={chatWithUser} />;
        })}
      {contacts && contacts.length <= 0 && !loadingContacts && 'ไม่มีข้อมูล'}
      <div>Chat rooms</div>
      {errorChatRooms && (
        <strong>Error: {JSON.stringify(errorChatRooms)}</strong>
      )}
      {loadingChatRooms && <span>ChatRooms Loading...</span>}
      {chatRooms &&
        chatRooms.map((room) => {
          return (
            <ChatRoom
              {...room}
              setCurrentChatroom={setCurrentChatroom}
              deleteChat={deleteChat}
              isActive={currentChatroom == room.id}
            />
          );
        })}
      {chatRooms && chatRooms.length <= 0 && !loadingChatRooms && 'ไม่มีข้อมูล'}
      {currentChatroom ? (
        <>
          <div>Chat box</div>
          {errorChatMessages && (
            <strong>Error: {JSON.stringify(errorChatMessages)}</strong>
          )}
          {loadingChatMessages && <span>ChatMessages Loading...</span>}
          <div>
            {chatMessages &&
              chatMessages.map((chatMessage) => {
                return <ChatMessage {...chatMessage} />;
              })}
          </div>
          {chatMessages &&
            chatMessages.length <= 0 &&
            !loadingChatMessages &&
            'ไม่มีข้อมูล'}
          <div>
            <ChatInputForm currentChatroom={currentChatroom} />
          </div>
        </>
      ) : (
        'กรุณาเลือกห้องสนทนา'
      )}
    </ThemeProvider>
  );
}

const TextMessageInput = (props) => {
  const [draftTextObject, setDraftTextObject] = useState({
    type: 'text',
    text: '',
  });
  const counterRef = useRef();
  const { quill, quillRef, Quill } = useQuill({
    modules: {
      toolbar: '#toolbar',
    },
  });
  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        const text = quill
          .getText()
          .toString()
          // .replace(/(<([^>]+)>)/gi, '')
          .replace(/\r?\n|\r/, '');
        // console.log('text', text);
        handleEmoji(text);
      });
    }
  }, [quill]);

  function handleEmoji(text) {
    const htmlContent = quill.root.innerHTML
      .replace(/<p[^>]*>/g, '')
      .replace(/<\/p>/g, '');
    const imgRex = /<img src\s*=\s*"(.+?)">/g;
    const images = [];
    let img;
    let culmulative_index = 0;
    while ((img = imgRex.exec(htmlContent))) {
      // console.log(img[0].length);
      console.log('src', img[1]);
      const findEmoji = emojiLookup(img[1]);
      if (findEmoji)
        images.push({
          index: img.index - culmulative_index,
          ...findEmoji,
        });
      culmulative_index += img[0].length - 1;
    }
    console.log(images.length);
    let newDraftTextObject = {
      ...draftTextObject,
      emojis: images,
    };

    if (text)
      newDraftTextObject.text = htmlContent.replace(
        /<img src\s*=\s*"(.+?)">/g,
        '$'
      );
    if (images.length <= 0) delete newDraftTextObject.emojis;
    return setDraftTextObject(newDraftTextObject);
  }

  const emojiLookup = (imgUrl) => {
    const lookupProductId = imgUrl.split('/')[6];
    const emojiArray = emojis[lookupProductId];
    const emojiResult = emojiArray.find((emoji) => emoji.imgUrl == imgUrl);
    let copyEmoji;
    if (emojiResult) {
      copyEmoji = { ...emojiResult };
      delete copyEmoji.imgUrl;
    }
    return copyEmoji;
  };

  const onSelectEmoji = (emoji_img, emoji_productId, emoji_emojiId) => {
    let insertPosition =
      quill.selection.savedRange.index + quill.selection.savedRange.length;
    const a = quill.insertEmbed(insertPosition, 'image', emoji_img);
    quill.setSelection(quill.selection.savedRange.index + 1, 0);
    return;
  };
  return (
    <>
      TEXT & EMOJI
      <div className={'quill-editor'}>
        <div ref={quillRef} />

        <div id="toolbar">
          <div>Sticker</div>
          <div>
            Emoji
            (https://developers.line.biz/en/docs/messaging-api/emoji-list/#line-emoji-definitions)
            <div>
              <EmojiToolBar onSelectEmoji={onSelectEmoji} />
            </div>
          </div>
        </div>
        <div id="editor" />
      </div>
      <div ref={counterRef}>
        {quill && quill.getLength() - 1}/5,000 ตัวอักษร
      </div>
      <button onClick={() => props.sendMessage(draftTextObject)}>Send</button>
      <CopyBlock
        language={'jsx'}
        text={JSON.stringify(draftTextObject, null, '\t')}
        showLineNumbers={true}
        theme={dracula}
        wrapLines={true}
        codeBlock
      />
    </>
  );
};

const ImageMessageInput = (props) => {
  const [draftImageObject, setDraftImageObject] = useState({
    type: 'image',
    originalContentUrl:
      'https://uploads-ssl.webflow.com/61ca8fdec403dd3ff0a1d21c/629878d7b942eae8bd80c447_7-01-p-1080.png',
    previewImageUrl:
      'https://uploads-ssl.webflow.com/61ca8fdec403dd3ff0a1d21c/629878d7b942eae8bd80c447_7-01-p-1080.png',
  });
  return (
    <>
      <div>UPLOAD IMAGE</div>
      <button onClick={() => props.sendMessage(draftImageObject)}>Send</button>
      <CopyBlock
        language={'jsx'}
        text={JSON.stringify(draftImageObject, null, '\t')}
        showLineNumbers={true}
        theme={dracula}
        wrapLines={true}
        codeBlock
      />
    </>
  );
};

const VideoMessageInput = (props) => {
  const [draftVideoObject, setDraftVideoObject] = useState({
    type: 'video',
    originalContentUrl:
      'https://www.f5.com/c/landing/cms-documentation/mp4-video-player',
    previewImageUrl:
      'https://www.f5.com/content/dam/f5-labs-v2/homepage/home-page-bg-2.jpg',
  });
  return (
    <>
      <div>UPLOAD VIDEO</div>
      <button onClick={() => props.sendMessage(draftVideoObject)}>Send</button>
      <CopyBlock
        language={'jsx'}
        text={JSON.stringify(draftVideoObject, null, '\t')}
        showLineNumbers={true}
        theme={dracula}
        wrapLines={true}
        codeBlock
      />
    </>
  );
};

const StickerMessageInput = (props) => {
  const [draftStickerObject, setDraftStickerObject] = useState({
    type: 'sticker',
    packageId: '446',
    stickerId: '1988',
  });
  const onSelectSticker = (imgUrl, packageId, stickerId) => {
    const newDraftStickerObject = {
      type: 'sticker',
      packageId: packageId,
      stickerId: stickerId,
    };
    setDraftStickerObject(newDraftStickerObject);
    return;
  };

  return (
    <>
      <div>STICKER</div>
      <div>
        <StickerToolBar packageId={446} onSelectSticker={onSelectSticker} />
      </div>
      <button onClick={() => props.sendMessage(draftStickerObject)}>
        Send
      </button>
      <CopyBlock
        language={'jsx'}
        text={JSON.stringify(draftStickerObject, null, '\t')}
        showLineNumbers={true}
        theme={dracula}
        wrapLines={true}
        codeBlock
      />
    </>
  );
};

const ChatInputForm = (props) => {
  const currentChatroom = props.currentChatroom;

  const sendMessage = async (messagePayload) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-mineapi-key': '5f20d727-721c-4867-8d70-32d5c43bad99',
      'Access-Control-Allow-Origin': '*',
    };
    const payload = {
      service: 'LINE-OA',
      payload: {
        to: currentChatroom,
        messages: [messagePayload],
      },
    };
    console.log('sendMessage', payload);
    const result = await axios.post(`${API_BASE_URL}/line-oa`, payload, {
      headers: headers,
    });
    console.log('sendMessage', result);
    return result;
  };

  return (
    <>
      <div>
        <TextMessageInput sendMessage={sendMessage} />
      </div>
      <div>
        <StickerMessageInput sendMessage={sendMessage} />
      </div>
      <div>
        <ImageMessageInput sendMessage={sendMessage} />
      </div>
      <div>
        <VideoMessageInput sendMessage={sendMessage} />
      </div>
    </>
  );
};

const Contact = (props) => {
  const id = props.id;
  const email = props.email || '-';
  const handleChatWithUser = () => {
    props.chatWithUser(id);
  };
  return (
    <div onClick={handleChatWithUser}>
      <hr />
      <div>{id}</div>
      <div>{email}</div>
    </div>
  );
};

const ChatRoom = (props) => {
  const id = props.id;
  const name = props.id || '-';
  const isRead = props.isRead ? '[READ]' : '[NOT READ]';
  const isActive = props.isActive ? '[ACTIVE]' : '';
  const handleSetCurrentChatroom = () => {
    props.setCurrentChatroom(id);
  };
  const handleDeleteChatroom = () => {
    props.deleteChat(id);
  };
  return (
    <>
      <div onClick={handleSetCurrentChatroom}>
        {isActive} ROOM: {name} {isRead}
      </div>
      <div onClick={handleDeleteChatroom}>ลบ</div>
    </>
  );
};

const ChatMessage = (props) => {
  const message = props.message;
  if (!props.message) return;
  let renderHtml = '';

  const created_by = (props.source && props.source.subscriber_id) || '-';
  const created_dt = props.created_dt
    ? props.created_dt.toDate().toString()
    : '-';

  const emojiReverseLookup = (productId, emojiId) => {
    if (!productId || !emojiId) return;
    const emojiArray = emojis[productId];
    let emojiResult;
    if (emojiArray)
      emojiResult = emojiArray.find((emoji) => emoji.emojiId == emojiId);
    return emojiResult;
  };

  const stickerReverseLookup = (packageId, stickerId) => {
    if (!packageId || !stickerId) return;
    const stickerArray = stickers[packageId];
    let stickerResult;
    if (stickerArray)
      stickerResult = stickerArray.find(
        (sticker) => sticker.stickerId == stickerId
      );
    return stickerResult;
  };

  String.prototype.replaceAt = function (index, replacement) {
    if (index >= this.length) return this.valueOf();
    return this.substring(0, index) + replacement + this.substring(index + 1);
  };

  if (message.type == 'text') {
    renderHtml = message.text;
    let culmulative_index = 0;
    if (props.message.emojis) {
      for (const emoji of props.message.emojis) {
        const emojiReplace = emojiReverseLookup(emoji.productId, emoji.emojiId);
        const replaceEmoji = `<img src="${emojiReplace.imgUrl}" class="message-emoji" />`;
        renderHtml = renderHtml.replaceAt(
          culmulative_index + emoji.index,
          replaceEmoji
        );
        culmulative_index += replaceEmoji.length - 1;
      }
    }
  } else if (message.type == 'sticker') {
    const stickerReplace = stickerReverseLookup(
      message.packageId,
      message.stickerId
    );
    renderHtml = `<img src="${stickerReplace.imgUrl}" class="message-sticker" />`;
  } else if (message.type == 'image') {
    renderHtml = `<a href="${message.originalContentUrl}" target="_tab"><img src="${message.previewImageUrl}" class="message-image" /></a>`;
  } else if (message.type == 'video') {
    console.log('video', message);
    renderHtml = (
      <ReactPlayer
        controls={true}
        light={message.previewImageUrl}
        url={message.originalContentUrl}
      />
    );
  }

  return (
    <div>
      <hr />
      {message.type == 'text' && <div>{parse(renderHtml)}</div>}
      {message.type == 'sticker' && <div>{parse(renderHtml)}</div>}
      {message.type == 'image' && <div>{parse(renderHtml)}</div>}
      {message.type == 'video' && <div>{renderHtml}</div>}
      <div>{created_by}</div>
      <div>{created_dt}</div>
    </div>
  );
};

const EmojiToolBar = (props) => {
  const emojiArray = emojis['5ac1bfd5040ab15980c9b435'];
  const onSelectEmoji = props.onSelectEmoji;
  return (
    <>
      {emojiArray.map((emoji) => {
        return (
          <img
            src={emoji.imgUrl}
            onClick={() =>
              onSelectEmoji(emoji.imgUrl, emoji.productId, emoji.emojiId)
            }
          />
        );
      })}
    </>
  );
};

const StickersAa = Object.keys(stickers).map((key) => {
  return <div>{stickers[key]}</div>;
});
console.log('StickersAa', StickersAa);

const StickerToolBar = (props) => {
  if (!props.packageId) return;
  const stickerArray = stickers[props.packageId];
  const onSelectSticker = props.onSelectSticker;
  return (
    <>
      {/* <div>{<StickersAa />}</div> */}
      {stickerArray.map((sticker) => {
        return (
          <img
            src={sticker.imgUrl}
            onClick={() =>
              onSelectSticker(
                sticker.imgUrl,
                sticker.packageId,
                sticker.stickerId
              )
            }
          />
        );
      })}
    </>
  );
};

// useEffect(() => {
//   const q = query(
//     collection(
//       db,
//       'teams',
//       'BX2Of0mhQD9QzoENx3xE',
//       'campaigns',
//       'TtZGMe0NC4uHk50vsIpX',
//       'line-oa-chat',
//       currentChatroom,
//       'messages'
//     )
//   );
//   const unsubscribe = onSnapshot(q, (querySnapshot) => {
//     let messages = [];
//     querySnapshot.forEach((doc) => {
//       messages.push({ message_id: doc.id, ...doc.data() });
//       // console.log(doc.data());
//     });
//     setChatMessages([...messages]);
//   });
//   return unsubscribe;
// }, [currentChatroom]);
