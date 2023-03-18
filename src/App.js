import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import './style.css';
import liff from '@line/liff';
import jwt from 'jwt-decode';
import axios from 'axios';

import { Link, Route, Routes, useSearchParams } from 'react-router-dom';

export default function App() {
  const [step, setStep] = useState(1);

  const [log, setLog] = useState([]);
  const [profile, setProfile] = useState();
  const [isFriend, setIsFriend] = useState();
  const [user, setUser] = useState();

  const [subscriber, setSubscriber] = useState();
  const [subscribeResult, setSubscribeResult] = useState();

  // const [searchParams, setSearchParams] = useSearchParams();
  // const searchName = searchParams.get('name');

  const API_BASE_URL =
    // 'https://55ed-125-25-98-87.ap.ngrok.io/minenoti-app/asia-east2/service/';
    'https://asia-east2-minenoti-app.cloudfunctions.net/service';
  console.log('subscriber', subscriber);

  useEffect(() => {
    // unsubscribe();
    // getSubscriber();
    return;
  }, []);

  const subscribe = async (subscriber_key, line_uid, data_payload) => {
    setSubscribeResult(null);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-mineapi-key': '5f20d727-721c-4867-8d70-32d5c43bad99',
        'Access-Control-Allow-Origin': '*',
      };

      console.log('Q', {
        // line_uid: 'U1c20e5490ff612a0bb135a5b46268cca',
        // subscriber_key: 'suppakit.neno@gmail.com',
        line_uid: line_uid,
        subscriber_key: subscriber_key,
        ...data_payload,
      });
      const payload = {
        service: 'LINE-OA',
        payload: {
          // line_uid: 'U1c20e5490ff612a0bb135a5b46268cca',
          // subscriber_key: 'suppakit.neno@gmail.com',
          line_uid: line_uid,
          subscriber_key: subscriber_key,
          ...data_payload,
        },
      };
      const result = await axios.post(
        `${API_BASE_URL}/line-oa-subscribe`,
        payload,
        {
          headers: headers,
        }
      );
      console.log(result);
      if (result.data.status == 'success') {
        setSubscriber(result.data.result);
        setSubscribeResult('เชื่อมต่อสำเร็จ');
        liffSendMessage('เชื่อมต่อสำเร็จ');
      } else {
        setSubscribeResult('เชื่อมต่อไม่สำเร็จ');
      }
    } catch (err) {
      console.log(err);
      setSubscribeResult('เกิดข้อผิดพลาด');
    }
    return;
  };

  const unsubscribe = async (subscriber_key) => {
    setSubscribeResult(null);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-mineapi-key': '5f20d727-721c-4867-8d70-32d5c43bad99',
        'Access-Control-Allow-Origin': '*',
      };
      const payload = {
        service: 'LINE-OA',
        payload: {
          // subscriber_key: 'suppakit.neno@gmail.com',
          subscriber_key: subscriber_key,
        },
      };
      const result = await axios.post(
        `${API_BASE_URL}/line-oa-unsubscribe`,
        payload,
        {
          headers: headers,
        }
      );
      console.log(result);
      if (result.data.status == 'success') {
        setSubscriber(null);
        setSubscribeResult('ยกเลิกสำเร็จ');
        liffSendMessage('ยกเลิกสำเร็จ');
      } else {
        setSubscribeResult('ยกเลิกไม่สำเร็จ');
      }
    } catch (err) {
      console.log(err.response);
      setSubscribeResult('เกิดข้อผิดพลาด');
    }
    return;
  };

  const getSubscriber = async (subscriber_key) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-mineapi-key': '5f20d727-721c-4867-8d70-32d5c43bad99',
        'Access-Control-Allow-Origin': '*',
      };
      const result = await axios.get(
        `${API_BASE_URL}/line-oa-subscriber/${subscriber_key}`,
        {
          headers: headers,
        }
      );
      console.log(result);
      if (result.data.status == 'success') {
        setSubscriber(result.data.result);
      } else {
        setSubscribeResult('ไม่สามารถเรียกข้อมูลได้การเชื่อมต่อได้');
      }
    } catch (err) {
      console.log(err.response);
      if (err.response.data.status == 'error') {
        setSubscribeResult(null);
      } else {
        setSubscribeResult('ไม่สามารถเรียกข้อมูลได้การเชื่อมต่อได้');
      }
    }
    return;
  };

  const liffSendMessage = (message = 'Hello, World!') => {
    liff
      .sendMessages([
        {
          type: 'text',
          text: message,
        },
      ])
      .then(() => {
        // liff.closeWindow();
        console.log('message sent');
      })
      .catch((err) => {
        console.log('error', err);
      });
    return;
  };

  const getFriendShipStatus = async () => {
    const friend = await liff.getFriendship();
    setIsFriend(friend.friendFlag);
    if (friend.friendFlag) setStep(3);
    return;
  };

  const liffScanQrCode = () => {
    liff
      .scanCodeV2()
      .then((result) => {
        // result = { value: "" }
        const payload = jwt(result.value);
        // Check Expiration
        // setQrCode(payload);
        setUser(payload);
        getSubscriber(payload.email);
        setStep(4);
      })
      .catch((error) => {
        console.log('error', error);
      });
  };

  useEffect(() => {
    async function main() {
      await liff.init({ liffId: '1657197561-ny8ambBq' });

      liff.ready.then(() => {
        if (liff.isInClient()) {
          console.log('CLIENT');
          setLog((prevStep) => [...prevStep, 'client']);
          getUserProfile();
        } else {
          console.log('NOT CLIENT');
          setLog((prevStep) => [...prevStep, 'not client']);
          if (!liff.isLoggedIn()) {
            liff.login();
            return;
          }
          getUserProfile();
        }
      });

      return;
    }

    async function getUserProfile() {
      console.log('get profile');
      const profile = await liff.getProfile();
      console.log('profile', profile);
      let my_profile = {
        userId: profile.userId,
        pictureUrl: profile.pictureUrl,
        displayName: profile.displayName,
        statusMessage: profile.statusMessage,
        email: liff.getDecodedIDToken().email,
      };
      setLog((prevStep) => [...prevStep, 'logged in']);
      setProfile((prevProfile) => my_profile);

      setStep(2);

      // const lineContext = await liff.getContext();
      // setContent(lineContext);
    }
    main();
    return;
  }, []);

  useEffect(() => {
    if (step == 2) getFriendShipStatus();
  }, [step]);

  return (
    <ThemeProvider theme={theme}>
      {step >= 1 && (
        <>
          <h2>STEP 1: Line login</h2>
          {profile ? (
            <div>
              <div>LINE USER ID: {profile.userId}</div>
            </div>
          ) : (
            <div>ไม่สามารถดึงข้อมูลได้</div>
          )}
        </>
      )}

      {step >= 2 && (
        <>
          <h2>STEP 2: Add friend</h2>
          {isFriend ? (
            <div>เพิ่มเพื่อนแล้ว</div>
          ) : (
            <div>
              <button onClick={() => getFriendShipStatus()}>
                ตรวจสอบอีกครั้ง
              </button>
              กรุณาเพิ่มเพื่อน
              <a href="https://page.line.me/?accountId=554ijrkk">
                <img src={'https://qr-official.line.me/sid/L/554ijrkk.png'} />
              </a>
            </div>
          )}
        </>
      )}

      {step >= 3 && (
        <>
          <h2>STEP 3: User</h2>
          {user ? (
            <div>
              <div>USER ID: {user.document_id}</div>
              <div>
                NAME: {user.first_name} {user.last_name}
              </div>
              <div>EMAIL: {user.email}</div>
            </div>
          ) : (
            <div>
              <button onClick={liffScanQrCode}>Scan QR CODE</button>
            </div>
          )}
        </>
      )}

      {step == 4 && (
        <>
          {/* <h2>STEP 4: Notify setting</h2> */}
          {/* <div>RESULT: {JSON.stringify(apiResult)}</div> */}
          <div>{subscribeResult && subscribeResult}</div>
          SUB:{JSON.stringify(subscriber)}
          {subscriber && subscriber.subscriber_key ? (
            <button onClick={() => unsubscribe(user.email)}>ยกเลิก</button>
          ) : (
            <button
              onClick={() =>
                subscribe(user.email, profile.userId, {
                  document_id: user.document_id,
                  first_name: user.first_name,
                  last_name: user.last_name,
                })
              }
            >
              เชื่อมต่อ
            </button>
          )}
        </>
      )}

      {/* <div>STEP: {JSON.stringify(step)}</div>
      <div>PROFILE: {JSON.stringify(profile)}</div>
      <div>IS FRIEND: {JSON.stringify(isFriend)}</div>
      <div>PARAMS NAME: {searchName ? searchName : '-'}</div>
      <div>QR CODE: {JSON.stringify(qrCode)}</div> */}

      {/* <div>
        <button onClick={liffSendMessage}>Send message</button>
      </div> */}

      {/* <div>CONTEXT: {JSON.stringify(context, null, 2)}</div> */}

      {/* 
      <Routes>
        <Route path="/" element={<Navigate replace to="/inventory" />} />
      </Routes> 
      */}
    </ThemeProvider>
  );
}
