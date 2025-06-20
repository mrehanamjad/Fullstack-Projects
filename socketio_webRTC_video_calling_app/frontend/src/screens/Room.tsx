// import { useCallback, useEffect, useState } from "react";
// import { useSocket } from "../context/SocketContext";
// import ReactPlayer from "react-player";
// import peer from "../services/peer";

// function RoomPage() {
//   const socket = useSocket();
//   const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
//   const [myStream, setMyStream] = useState<MediaStream | null>(null);
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

//   const handleUserJoined = useCallback(({ email, id }: any) => {
//     console.log(`email: ${email} joined room`);
//     setRemoteSocketId(id);
//   }, []);

//   const handleCallUser = useCallback(async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: true,
//       audio: true,
//     });
//     const offer = await peer.getOffer();
//     socket.emit("user:call", {
//       to: remoteSocketId,
//       offer,
//     });
//     setMyStream(stream);
//   }, [remoteSocketId, socket]);

//   const handleIncomingCall = useCallback(
//     async ({ from, offer }: any) => {
//       console.log(`Incoming call from ${from}, offer:`, offer);
//       setRemoteSocketId(from);
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       setMyStream(stream);
//       const answer = await peer.getAnswer(offer);
//       socket.emit("call:accepted", {
//         to: from,
//         answer,
//       });
//     },
//     [socket]
//   );

//   const sendStreams = useCallback(() => {
//     for (const track of myStream?.getTracks() || []) {
//       peer.peer?.addTrack(track, myStream!);
//     }
//   }, [myStream]);

//   const handleCallAccept = useCallback(async ({ answer }: any) => {
//     await peer.setLocalDescription(answer);
//     console.log(`Call accepted!`);
//     sendStreams();
//   }, [sendStreams]);

//   const handleNegotiationNeeded = useCallback(async () => {
//     const offer = await peer.getOffer();
//     socket.emit("peer:negotiation:needed", {
//       to: remoteSocketId,
//       offer,
//     });
//   }, [remoteSocketId, socket]);

//   const handleNegotiationNeedIncomming = useCallback(
//     async ({ from, offer }: any) => {
//       const answer = await peer.getAnswer(offer);
//       socket.emit("peer:negotiation:done", {
//         to: from,
//         answer,
//       });
//     },
//     [socket]
//   );

//   const handleNegotiationNeedFinal = useCallback(
//     async ({ from, answer }: any) => {
//       await peer.setLocalDescription(answer);
//       console.log(`Negotiation done with ${from}`);
//     },
//     []
//   );

//   useEffect(() => {
//     peer.peer?.addEventListener("negotiationneeded", handleNegotiationNeeded);
//     return () => {
//       peer.peer?.removeEventListener(
//         "negotiationneeded",
//         handleNegotiationNeeded
//       );
//     };
//   }, [handleNegotiationNeeded]);

//   useEffect(() => {
//     peer.peer?.addEventListener("track", (ev) => {
//       const remoteStreams = ev.streams;
//       console.log("GotTrack!");
//       setRemoteStream(remoteStreams[0]);
//     });
//   }, []);

//   useEffect(() => {
//     socket.on("room:joined", handleUserJoined);
//     socket.on("incoming:call", handleIncomingCall);
//     socket.on("call:accepted", handleCallAccept);
//     socket.on("peer:negotiation:needed", handleNegotiationNeedIncomming);
//     socket.on("peer:negotiation:final", handleNegotiationNeedFinal);

//     return () => {
//       socket.off("room:joined", handleUserJoined);
//       socket.off("incoming:call", handleIncomingCall);
//       socket.off("call:accepted", handleCallAccept);
//       socket.off("peer:negotiation:needed", handleNegotiationNeedIncomming);
//       socket.off("peer:negotiation:final", handleNegotiationNeedFinal);
//     };
//   }, [
//     socket,
//     handleUserJoined,
//     handleIncomingCall,
//     handleCallAccept,
//     handleNegotiationNeedIncomming,
//     handleNegotiationNeedFinal,
//   ]);

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
//         Room Page
//       </h1>
//       {myStream && <button onClick={sendStreams} className="bg-black text-white p-4 text-xl">Send Stream</button>}
//       <p className="text-center text-gray-600 ">
//         {remoteSocketId ? "Connected" : "No One in Room"}
//       </p>
//       {remoteSocketId && (
//         <button
//           onClick={handleCallUser}
//           className="p-8 text-xl bg-green-900 font-bold text-white"
//         >
//           📱 Call
//         </button>
//       )}

//       {myStream && (
//         <>
//           <h2 className="">My Stream</h2>
//           <ReactPlayer
//             playing
//             muted
//             url={myStream}
//             width="500px"
//             height="300px"
//           />
//         </>
//       )}
//       {remoteStream && (
//         <>
//           <h2 className="">Remote Stream</h2>
//           <ReactPlayer
//             playing
//             muted
//             url={remoteStream}
//             width="500px"
//             height="300px"
//           />
//         </>
//       )}
//     </div>
//   );
// }

// export default RoomPage;










































import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import ReactPlayer from "react-player";
import peer from "../services/peer";

function RoomPage() {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const handleUserJoined = useCallback(({ email, id }: any) => {
    console.log(`email: ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
    
    // Add tracks to peer connection BEFORE creating offer
    for (const track of stream.getTracks()) {
      peer.peer?.addTrack(track, stream);
    }
    
    const offer = await peer.getOffer();
    socket.emit("user:call", {
      to: remoteSocketId,
      offer,
    });
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }: any) => {
      console.log(`Incoming call from ${from}, offer:`, offer);
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      
      // Add tracks to peer connection BEFORE creating answer
      for (const track of stream.getTracks()) {
        peer.peer?.addTrack(track, stream);
      }
      
      const answer = await peer.getAnswer(offer);
      socket.emit("user:answer", {  // FIXED: Changed from "call:accepted" to "user:answer"
        to: from,
        answer,
      });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        peer.peer?.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  const handleCallAccept = useCallback(async ({ answer }: any) => {
    await peer.setRemoteDescription(answer);  // FIXED: Changed from setLocalDescription to setRemoteDescription
    console.log(`Call accepted!`);
  }, []);

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:negotiation:needed", {
      to: remoteSocketId,
      offer,
    });
  }, [remoteSocketId, socket]);

  const handleNegotiationNeedIncomming = useCallback(
    async ({ from, offer }: any) => {
      const answer = await peer.getAnswer(offer);
      socket.emit("peer:negotiation:done", {
        to: from,
        answer,
      });
    },
    [socket]
  );

  const handleNegotiationNeedFinal = useCallback(
    async ({ answer }: any) => {  // FIXED: Removed unused 'from' parameter
      await peer.setRemoteDescription(answer);  // FIXED: Changed from setLocalDescription to setRemoteDescription
      console.log(`Negotiation done`);
    },
    []
  );

  useEffect(() => {
    peer.peer?.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.peer?.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);

  useEffect(() => {
    peer.peer?.addEventListener("track", (ev) => {
      const remoteStreams = ev.streams;
      console.log("Got Track!", remoteStreams);
      if (remoteStreams && remoteStreams.length > 0) {
        setRemoteStream(remoteStreams[0]);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("room:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccept);
    socket.on("peer:negotiation:needed", handleNegotiationNeedIncomming);
    socket.on("peer:negotiation:final", handleNegotiationNeedFinal);

    return () => {
      socket.off("room:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccept);
      socket.off("peer:negotiation:needed", handleNegotiationNeedIncomming);
      socket.off("peer:negotiation:final", handleNegotiationNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccept,
    handleNegotiationNeedIncomming,
    handleNegotiationNeedFinal,
  ]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
        Room Page
      </h1>
      
      <p className="text-center text-gray-600 mb-4">
        {remoteSocketId ? "Connected" : "No One in Room"}
      </p>
      
      {remoteSocketId && (
        <div className="text-center mb-4">
          <button
            onClick={handleCallUser}
            className="p-4 text-xl bg-green-600 hover:bg-green-700 font-bold text-white rounded-lg mr-4"
          >
            📱 Call
          </button>
          {myStream && (
            <button 
              onClick={sendStreams} 
              className="p-4 text-xl bg-blue-600 hover:bg-blue-700 font-bold text-white rounded-lg"
            >
              Send Stream
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {myStream && (
          <div>
            <h2 className="text-xl font-semibold mb-2">My Stream</h2>
            <ReactPlayer
              playing
              muted
              url={myStream}
              width="100%"
              height="300px"
              style={{ border: '2px solid #ccc', borderRadius: '8px' }}
            />
          </div>
        )}
        
        {remoteStream && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Remote Stream</h2>
            <ReactPlayer
              playing
              url={remoteStream}
              
              width="100%"
              height="300px"
              style={{ border: '2px solid #ccc', borderRadius: '8px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomPage;