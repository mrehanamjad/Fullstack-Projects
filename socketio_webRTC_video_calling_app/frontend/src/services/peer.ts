// class PeerService {
//   peer: RTCPeerConnection | undefined;

//   constructor() {
//     if (!this.peer) {
//       this.peer = new RTCPeerConnection({
//         iceServers: [
//           {
//             urls: [
//               "stun:stun.l.google.com:19302",
//               "stun:global.stun.twilio.com:3478",
//             ],
//           },
//         ],
//       });
//     }
//   }

//   async getAnswer(
//     offer: RTCSessionDescriptionInit
//   ): Promise<RTCSessionDescriptionInit | undefined> {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(offer);
//       const answer = await this.peer.createAnswer();
//       await this.peer.setLocalDescription(new RTCSessionDescription(answer)); // Fixed: was 'ans'
//       return answer;
//     }
//   }

//   // Get the offer to send to the remote peer
//   async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
//     if (this.peer) {
//       const offer = await this.peer.createOffer();
//       await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//       return offer;
//     }
//   }

//   // Set the remote description when accepting a call
//   async setLocalDescription(answer: RTCSessionDescriptionInit): Promise<void> {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
//     }
//   }
// }

// export default new PeerService();




class PeerService {
  peer: RTCPeerConnection | undefined;

  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  async getAnswer(
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit | undefined> {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  }

  // Get the offer to send to the remote peer
  async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  // FIXED: This should set remote description, not local
  async setRemoteDescription(answer: RTCSessionDescriptionInit): Promise<void> {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }
}

export default new PeerService();