export type MessageType = 'text' | 'photo';
export type MessageSender = 'sender' | 'receiver';

export interface ChatMessage {
  id: string;
  type: MessageType;
  sender: MessageSender;
  text?: string;
  imageUrl?: string;
  caption?: string;
  time: string;
  read?: boolean;
}

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    type: 'text',
    sender: 'receiver',
    text: '안녕하세요! 문의 주셔서 감사합니다 😊',
    time: '오후 2:14',
  },
  {
    id: 'm2',
    type: 'text',
    sender: 'sender',
    text: '안녕하세요, PT 트레이너는 어떤 분이신가요? 잔여 횟수 정확히 몇 회 인가요?',
    time: '오후 2:15',
    read: true,
  },
  {
    id: 'm3',
    type: 'text',
    sender: 'receiver',
    text: '트레이너는 김현수 트레이너로 지정되어있고, 잔여 28회입니다. 원하시면 다른 트레이너로 변경도 가능해요!',
    time: '오후 2:17',
  },
  {
    id: 'm4',
    type: 'photo',
    sender: 'sender',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    caption: '이 센터 맞죠? 어제 방문해봤어요',
    time: '오후 2:20',
    read: true,
  },
  {
    id: 'm5',
    type: 'text',
    sender: 'receiver',
    text: '네 맞습니다! 방문까지 해보셨군요. 혹시 가격 조정 가능하신지 여쭤봐도 될까요?',
    time: '오후 2:22',
  },
  {
    id: 'm6',
    type: 'text',
    sender: 'sender',
    text: '80만원에 가능하시면 바로 결제하겠습니다',
    time: '오후 2:23',
    read: true,
  },
];
